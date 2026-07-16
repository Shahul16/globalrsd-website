"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth";
import SocialAuth from "@/components/SocialAuth";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return setError("Please enter your full name.");
    if (!email.includes("@")) return setError("Please enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    register(name.trim(), email);
    router.push("/dashboard");
  }

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-cream px-4 py-16">
      <div className="card w-full max-w-md p-8">
        <h1 className="font-display text-3xl font-bold">Create Your Account</h1>
        <p className="mt-2 text-sm text-slate-500">
          Registration is free. Membership subscriptions and event tickets can
          be added any time.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-5" aria-label="Registration form">
          {error && (
            <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="name" className="label">Full name</label>
            <input id="name" required autoComplete="name" className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="email" className="label">Email address</label>
            <input id="email" type="email" required autoComplete="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="password" className="label">Choose a password</label>
            <input id="password" type="password" required autoComplete="new-password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn-gold w-full">Create account</button>
          <p className="text-center text-sm text-slate-500">
            Already registered?{" "}
            <Link href="/login" className="font-semibold text-navy underline">Log in</Link>
          </p>
          <p className="text-center text-xs text-slate-400">
            By registering you agree to our{" "}
            <Link href="/legal/terms" className="underline">Terms</Link> and{" "}
            <Link href="/legal/privacy" className="underline">Privacy Policy</Link>.
          </p>
        </form>
        <SocialAuth />
      </div>
    </section>
  );
}
