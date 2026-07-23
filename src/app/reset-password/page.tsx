"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { getSupabase } from "@/lib/supabase";

/**
 * Landing page for the email password-recovery link.
 * A recovery session is established automatically by the Supabase client
 * from the link; the user then sets a new password.
 */
export default function ResetPasswordPage() {
  const router = useRouter();
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setHasSession(false);
      return;
    }
    let cancelled = false;
    // Give the client a moment to exchange the recovery code from the URL.
    const check = async () => {
      const { data } = await sb.auth.getSession();
      if (!cancelled) setHasSession(Boolean(data.session));
    };
    void check();
    const { data: sub } = sb.auth.onAuthStateChange((event, session) => {
      if (cancelled) return;
      if (event === "PASSWORD_RECOVERY" || session) setHasSession(true);
    });
    const timer = setTimeout(check, 1500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      sub.subscription.unsubscribe();
    };
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const sb = getSupabase();
    if (!sb) return setError("Password reset is not available yet.");
    if (password.length < 8) return setError("Choose a password of at least 8 characters.");
    if (password !== confirm) return setError("The two passwords don't match.");
    setError("");
    setBusy(true);
    const { error: err } = await sb.auth.updateUser({ password });
    setBusy(false);
    if (err) return setError(err.message);
    setDone(true);
    setTimeout(() => router.push("/dashboard"), 1800);
  }

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-cream px-4 py-16">
      <div className="card w-full max-w-md p-8">
        {hasSession === null ? (
          <p className="text-center text-slate-500" role="status">Verifying your reset link…</p>
        ) : !hasSession ? (
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold">Link expired or invalid</h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Reset links are valid for 1 hour and can only be used once.
              Please request a fresh one.
            </p>
            <Link href="/forgot-password" className="btn-gold mt-6 inline-block">
              Request a new link
            </Link>
          </div>
        ) : done ? (
          <div role="status" className="text-center">
            <span aria-hidden="true" className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-600">✓</span>
            <h1 className="mt-5 font-display text-2xl font-bold">Password updated</h1>
            <p className="mt-2 text-sm text-slate-500">You&apos;re signed in — taking you to your dashboard…</p>
          </div>
        ) : (
          <>
            <h1 className="font-display text-3xl font-bold">Choose a new password</h1>
            <p className="mt-2 text-sm text-slate-500">
              Make it at least 8 characters — a mix of words and numbers works well.
            </p>
            <form onSubmit={onSubmit} className="mt-6 space-y-5" aria-label="New password">
              {error && (
                <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>
              )}
              <div>
                <label htmlFor="password" className="label">New password</label>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="confirm" className="label">Repeat new password</label>
                <input
                  id="confirm"
                  type="password"
                  required
                  autoComplete="new-password"
                  className="input"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
              <button type="submit" disabled={busy} className="btn-gold w-full disabled:opacity-60">
                {busy ? "Updating…" : "Set new password"}
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
