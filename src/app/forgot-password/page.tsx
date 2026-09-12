"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { getSupabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function sendEmailLink(e: FormEvent) {
    e.preventDefault();
    const sb = getSupabase();
    if (!sb) return setError("Password reset is not available yet — please contact us.");
    if (!email.includes("@")) return setError("Please enter a valid email address.");
    setError("");
    setBusy(true);
    const { error: err } = await sb.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (err) return setError(friendly(err.message));
    setEmailSent(true);
  }

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-cream px-4 py-16">
      <div className="card w-full max-w-md p-8">
        <h1 className="font-display text-3xl font-bold">Reset your password</h1>
        <p className="mt-2 text-sm text-slate-500">
          Enter your account email and we&apos;ll send you a secure link to set a new password.
        </p>

        {error && (
          <p role="alert" className="mt-5 rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        )}

        {emailSent ? (
          <div role="status" className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-emerald-800">
            <p className="font-display font-bold">Check your inbox</p>
            <p className="mt-1 text-sm leading-relaxed">
              If an account exists for <strong>{email}</strong>, we&apos;ve sent a
              secure link to set a new password. The link expires in 1 hour.
            </p>
          </div>
        ) : (
          <form onSubmit={sendEmailLink} className="mt-6 space-y-5" aria-label="Email reset">
            <div>
              <label htmlFor="email" className="label">Email address</label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" disabled={busy} className="btn-gold w-full disabled:opacity-60">
              {busy ? "Sending…" : "Email me a reset link"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          Remembered it?{" "}
          <Link href="/login" className="font-semibold text-navy underline">Back to login</Link>
        </p>
      </div>
    </section>
  );
}

function friendly(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("rate limit")) return "Too many attempts — please wait a minute and try again.";
  return message;
}
