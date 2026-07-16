"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

/**
 * Social sign-in buttons. In this demo build they create a local session
 * (no OAuth round-trip). Swap the onClick for NextAuth `signIn(provider)`
 * once Google / Microsoft / Apple credentials are configured — see README.
 */
export default function SocialAuth({ next = "/dashboard" }: { next?: string }) {
  const { login } = useAuth();
  const router = useRouter();

  function demoSignIn(provider: string) {
    login(`member@${provider}.demo`, `${provider[0].toUpperCase()}${provider.slice(1)} User`);
    router.push(next);
  }

  const base =
    "flex w-full items-center justify-center gap-3 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-navy hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold";

  return (
    <div>
      <div className="my-5 flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
          or continue with
        </span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>
      <div className="space-y-2.5">
        <button type="button" onClick={() => demoSignIn("google")} className={base}>
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"/>
          </svg>
          Continue with Google
        </button>
        <button type="button" onClick={() => demoSignIn("microsoft")} className={base}>
          <svg width="18" height="18" viewBox="0 0 23 23" aria-hidden="true">
            <rect width="10" height="10" x="1" y="1" fill="#F25022"/>
            <rect width="10" height="10" x="12" y="1" fill="#7FBA00"/>
            <rect width="10" height="10" x="1" y="12" fill="#00A4EF"/>
            <rect width="10" height="10" x="12" y="12" fill="#FFB900"/>
          </svg>
          Continue with Microsoft
        </button>
        <button type="button" onClick={() => demoSignIn("apple")} className={base}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M16.365 1.43c0 1.14-.46 2.21-1.21 3.02-.79.87-2.1 1.54-3.16 1.46-.13-1.1.43-2.28 1.15-3.05.81-.87 2.22-1.5 3.22-1.43zM20.94 17.06c-.6 1.36-.89 1.96-1.66 3.16-1.08 1.67-2.6 3.75-4.49 3.77-1.67.02-2.1-1.1-4.37-1.08-2.27.01-2.75 1.1-4.42 1.08-1.89-.02-3.33-1.9-4.41-3.56C-1.4 16.1-1.71 10.35.94 7.3c1.35-1.55 3.13-2.46 4.8-2.46 1.7 0 2.77 1.1 4.18 1.1 1.37 0 2.2-1.1 4.17-1.1 1.49 0 3.07.81 4.2 2.21-3.69 2.02-3.09 7.29 1.65 10.01z"/>
          </svg>
          Continue with Apple
        </button>
      </div>
      <p className="mt-3 text-center text-[11px] leading-relaxed text-slate-400">
        Demo mode: creates a local session. Connect real OAuth credentials
        (see README) to enable live Google, Microsoft and Apple sign-in.
      </p>
    </div>
  );
}
