import Script from "next/script";

/**
 * Loads Cloudflare Turnstile script sitewide with explicit rendering mode.
 * Only loads if NEXT_PUBLIC_TURNSTILE_SITE_KEY is configured.
 */
export default function TurnstileLoader() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAFAAlriI1ioGxDjY";
  if (!siteKey) return null;

  return (
    <Script
      src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
      strategy="afterInteractive"
    />
  );
}
