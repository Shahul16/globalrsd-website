# GIRSD — Go-Live Setup Guide

Everything in the code is done. This guide is the exact order of account setup
to make it live. Total hands-on time: roughly 60–90 minutes (plus DNS wait).

---

## 0. The 12 Railway variables (final list)

| # | Variable | Where you get it | Required |
|---|----------|------------------|----------|
| 1 | `ADMIN_KEY` | You invent it (strong password for /admin) | ✅ |
| 2 | `GITHUB_TOKEN` | GitHub → Settings → Developer settings → Fine-grained token, **Contents: Read & Write** on this repo | ✅ for admin CMS |
| 3 | `GITHUB_REPO` | e.g. `Shahul16/globalrsd-website` — must match your real repo name | ✅ |
| 4 | `GITHUB_BRANCH` | `main` | optional |
| 5 | `RESEND_API_KEY` | resend.com → API Keys | ✅ for enquiry forms |
| 6 | `LEAD_TO_EMAIL` | Your inbox, e.g. `info@globalrsd.co.uk` | optional (defaults to info@) |
| 7 | `LEAD_FROM_EMAIL` | e.g. `GIRSD Website <leads@globalrsd.co.uk>` — only after domain verified in Resend | optional |
| 8 | `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API | ✅ for login/payments |
| 9 | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API (anon public) | ✅ |
| 10 | `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API (service_role — keep secret) | ✅ |
| 11 | `STRIPE_SECRET_KEY` | Stripe → Developers → API keys (`sk_test_…` now, `sk_live_…` later) | ✅ for payments |
| 12 | `STRIPE_WEBHOOK_SECRET` | Stripe → Webhooks → your endpoint (`whsec_…`) | ✅ for orders to record |

> After adding/changing variables, Railway redeploys automatically.
> `NEXT_PUBLIC_*` variables are baked in at build time — a redeploy is required.

---

## 1. GitHub + Railway (15 min)

1. Push this folder to GitHub (private repo is fine), e.g. `Shahul16/globalrsd-website`.
2. railway.app → New Project → **Deploy from GitHub repo** → select the repo.
   Railway auto-detects Next.js. No start command needed (`npm run build` / `npm start`).
3. Add variables 1–4 now (the site deploys and works read-only with just these).
4. Settings → Networking → Generate Domain → you get `xxxx.up.railway.app`.
   Later: add custom domain `www.globalrsd.co.uk` (Railway shows you the CNAME record).

## 2. Supabase — database + login (20 min)

1. supabase.com → New project (free tier). Region: London (`eu-west-2`).
2. **SQL Editor → New query** → paste the whole of `supabase/schema.sql` → Run.
   This creates the `orders` and `certificates` tables with row-level security.
3. Project Settings → API → copy the three values into Railway variables 8, 9, 10.
4. **Authentication → URL Configuration**:
   - Site URL: `https://www.globalrsd.co.uk` (or your railway.app URL until DNS is done)
   - Redirect URLs: add both `https://www.globalrsd.co.uk/**` and `https://xxxx.up.railway.app/**`
5. Email/password login now works. (Authentication → Providers → Email:
   you may turn OFF "Confirm email" for instant sign-up, or leave ON for verified emails —
   the register page handles both.)

## 3. Google sign-in (15 min, free)

1. console.cloud.google.com → New project → **APIs & Services → OAuth consent screen**
   → External → fill app name `GIRSD`, support email → Save (Testing mode is fine to start).
2. **Credentials → Create credentials → OAuth client ID → Web application**:
   - Authorised redirect URI: `https://<your-project>.supabase.co/auth/v1/callback`
     (exact value shown in Supabase → Authentication → Providers → Google)
3. Copy Client ID + Client Secret into Supabase → Authentication → Providers → **Google** → Enable.
4. Done — the "Continue with Google" button is already wired.


## 4. Resend — enquiry emails (10 min + DNS wait)

1. resend.com → sign up → **API Keys → Create** → put in Railway variable 5.
2. Forms work immediately: emails arrive from `onboarding@resend.dev`.
   ⚠️ In this default mode Resend only delivers to **your own Resend account email** —
   fine for testing tonight.
3. For real delivery to `info@globalrsd.co.uk`: **Domains → Add domain**
   `globalrsd.co.uk` → add the 3 DNS records (SPF, DKIM) at your registrar →
   wait for "Verified" (minutes to a few hours) → set variable 7
   `LEAD_FROM_EMAIL="GIRSD Website <leads@globalrsd.co.uk>"` and variable 6 to your inbox.
4. Every Contact / Membership / Partner / Awards submission (incl. attachments)
   now lands in your inbox with Reply-To set to the visitor.

## 5. Stripe — payments (15 min test mode)

1. stripe.com → create account for **Q TECH PRIVATE LTD**.
2. Developers → API keys → copy **Secret key** (`sk_test_…`) → Railway variable 11.
3. Developers → **Webhooks → Add endpoint**:
   - URL: `https://www.globalrsd.co.uk/api/stripe/webhook` (or railway.app URL for now)
   - Event: `checkout.session.completed`
   - Copy the **Signing secret** (`whsec_…`) → Railway variable 12.
4. Test the full flow: buy a ticket with card `4242 4242 4242 4242`, any future
   expiry, any CVC → you land on the confirmation page → the order appears on
   the member dashboard (written by the webhook).
5. **Going live** (when ready): complete Stripe's business activation
   (company number 15754767, bank account, ID). Then swap variable 11 to the
   `sk_live_…` key and create a live-mode webhook (new `whsec_…` for variable 12).
   Activation review is usually same-day but is Stripe's decision, not ours.

---

## What changed in the code (for your records)

- **Forms** → real: POST `/api/lead` → Resend email with attachments, honeypot anti-spam.
- **Auth** → real Supabase: email/password + Google/Microsoft/Apple OAuth, sessions persist across devices. `src/lib/auth.tsx` rewritten; localStorage demo removed.
- **Payments** → real Stripe Checkout (hosted page, PCI handled by Stripe). Prices recomputed **server-side**; member discounts (30%/15%) verified against the database, not the browser.
- **Orders** → recorded by the Stripe webhook into Supabase; dashboard reads them live. Membership cancel now updates the database.
- **Certificate verification** → reads the Supabase `certificates` table (add rows in Table Editor); sample data only as fallback.
- Removed every "demo mode / not transmitted / test mode" notice from the UI.

## Remaining honest limitations

- Membership is a **one-off annual payment** (12 months from purchase), not an
  auto-renewing Stripe subscription. "Renew now" charges again for another year.
  Auto-renew subscriptions can be added later as an upgrade.
- Apple sign-in pending the $99 developer account (see §5).
- Stripe **live** payouts pending Stripe's business verification (see §7).

---

## 6. Accreditation badge artwork (2 min per badge)

The site ships with tasteful in-house badge emblems for **CPD Provider, ICO
Registered and UKRLP Registered** so nothing looks empty on day one.

1. Enter your real registration numbers in `src/lib/site.ts` → `registrations`
   (CPD certificate no., ICO registration ref e.g. `ZB…`, UKRLP → your UKPRN).
   They then appear on the badges automatically.
2. When an accrediting body supplies its **official logo pack** (CPD providers
   receive one; always follow their brand rules), drop the file into
   `public/accreditations/` named `cpd`, `ico` or `ukrlp` (`.png`, `.svg`,
   `.webp` or `.jpg`) — it replaces the built-in emblem automatically after the
   next deploy. No code changes needed.
3. ⚠️ Only display a badge for registrations the company genuinely holds — ICO
   registration is a legal requirement for processing personal data (from ~£52/yr
   at ico.org.uk), and UKRLP registration is free at ukrlp.co.uk. Claiming them
   without holding them is a compliance risk, not a design choice.

## 7. Careers applications

The /careers page emails every application (with the CV attached) through the
same Resend pipeline as the other forms — no extra setup beyond §6. To edit or
add openings, update `src/lib/data/careers.ts` and push (or ask your developer).
