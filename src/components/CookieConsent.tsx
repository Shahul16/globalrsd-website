"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "girsd-cookie-consent";

type Consent = "accepted" | "necessary-only";

/** Reads the stored consent choice, if any. Safe to call during render. */
export function getCookieConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "accepted" || v === "necessary-only" ? v : null;
  } catch {
    return null;
  }
}

/**
 * First-visit cookie banner. Shows once per browser until the visitor makes
 * a choice, then stays hidden (choice is remembered in localStorage).
 * "Necessary only" still allows strictly-necessary storage (login session,
 * checkout) — the site sets no advertising or third-party tracking cookies.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!getCookieConsent()) setVisible(true);
  }, []);

  function choose(consent: Consent) {
    try {
      window.localStorage.setItem(STORAGE_KEY, consent);
    } catch {
      /* localStorage unavailable — banner simply won't persist */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie preferences"
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-slate-200 bg-white px-4 py-5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] animate-fadeUp sm:px-6"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-3xl">
          <p className="font-display text-sm font-bold text-navy">We use cookies</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            We use strictly necessary cookies to keep you signed in and to
            process checkout. With your consent, we&apos;d also like to use
            analytics cookies to understand how visitors use the site.{" "}
            <Link href="/legal/cookies" className="font-medium text-navy underline">
              Read our Cookie Policy
            </Link>
            .
          </p>
          {showDetails && (
            <ul className="mt-3 space-y-1.5 text-xs text-slate-500">
              <li>
                <strong className="text-slate-700">Strictly necessary</strong> — always on: keeps you
                signed in, remembers checkout progress. Cannot be switched off.
              </li>
              <li>
                <strong className="text-slate-700">Analytics</strong> — optional: helps us understand
                page visits so we can improve the site. Only set if you accept.
              </li>
            </ul>
          )}
          <button
            type="button"
            onClick={() => setShowDetails((v) => !v)}
            className="mt-2 text-xs font-semibold text-slate-500 underline"
          >
            {showDetails ? "Hide details" : "See what this means"}
          </button>
        </div>
        <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={() => choose("necessary-only")}
            className="rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-navy hover:text-navy"
          >
            Necessary only
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="btn-gold px-5 py-2.5 text-sm"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
