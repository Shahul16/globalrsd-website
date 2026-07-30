import Script from "next/script";

/**
 * Loads Google reCAPTCHA v3 (score-based) sitewide, badge hidden via CSS in
 * globals.css per Google's terms (the required attribution text is added
 * instead in the footer). Only loads if a site key is configured — forms
 * work fine without it, they're just unprotected until it's set.
 *
 * Pair with RECAPTCHA_SECRET_KEY (server-side, in api/lead/route.ts) and
 * NEXT_PUBLIC_RECAPTCHA_SITE_KEY (this file). See SETUP_GUIDE.md.
 */
export default function RecaptchaLoader() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!siteKey) return null;

  return (
    <Script
      src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
      strategy="afterInteractive"
    />
  );
}
