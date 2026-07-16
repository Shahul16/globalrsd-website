"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth";
import SocialAuth from "@/components/SocialAuth";

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    login(email);
    router.push(next);
  }

  return (
    <div className="card w-full max-w-md p-8">
      <h1 className="font-display text-3xl font-bold">Member Login</h1>
      <p className="mt-2 text-sm text-slate-500">
        Access your dashboard, tickets, courses and membership.
      </p>
      <form onSubmit={onSubmit} className="mt-6 space-y-5" aria-label="Login form">
        {error && (
          <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        )}
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
        <div>
          <label htmlFor="password" className="label">Password</label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-gold w-full">Log in</button>
        <p className="text-center text-sm text-slate-500">
          No account yet?{" "}
          <Link href="/register" className="font-semibold text-navy underline">Register free</Link>
        </p>
        <p className="text-center text-xs text-slate-400">
          Demo site: any email and password (6+ characters) will sign you in locally.
        </p>
      </form>
      <SocialAuth next={next} />
    </div>
  );
}

export default function LoginPage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-cream px-4 py-16">
      <Suspense>
        <LoginForm />
      </Suspense>
    </section>
  );
}
