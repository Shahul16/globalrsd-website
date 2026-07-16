# GIRSD — Global Institute of Research & Skills Development

Production-quality website for **globalrsd.co.uk**, built with Next.js 15 (App Router), TypeScript and Tailwind CSS.

Owner: **Q TECH PRIVATE LTD** (UK Company No. 15754767), trading as **GIRSD**
Registered office: 23 Kinnaird Avenue, Bromley BR1 4HG, England

## Features

- **7 main sections** — Home (animated hero, live countdown to the next conference, count-up statistics, services strip, partner marquee), About Us (vision & mission, founder, committees, CSR, publications teaser), Events (3 categories with detail pages: agenda, speakers, tiered tickets £99–£399), Courses (6-course catalog with syllabus, support, assessment, certification), Awards (individual & institutional categories, venue, nomination form), Membership (Student £49 / Academic £99 / Industry £249 per year, Sponsors & Exhibiting), Contact (enquiry form + company details)
- **Member area** — register/login, dashboard with profile, tickets, course enrolments, membership status, renewal and cancellation
- **Checkout** — single flow for tickets, courses and memberships; automatic **30% member discount** on conference tickets (15% on courses); order confirmation page. Payments are simulated in Stripe test-mode style (see below)
- **Secondary pages** — Partner With Us (agent application form), News (3 posts), full UK-oriented legal pages (Terms, Privacy/UK GDPR, Refund & Cancellation, Data Protection)
- **SEO & accessibility** — per-page metadata, Open Graph, `sitemap.xml`, `robots.txt`, semantic landmarks, skip link, focus rings, `prefers-reduced-motion` support, WCAG AA colour contrast
- **Brand** — heraldic crest logo (SVG), navy `#14213D` + gold `#C9A227`, Playfair Display display headings, Inter body

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
```

Node 18.18+ (Node 20+ recommended).

## Payments (Stripe)

The checkout ships in **mock test mode** — no API keys required. The payment form mimics Stripe's test flow (use card `4242 4242 4242 4242`), applies member discounts, records the order to the signed-in user, and redirects to the confirmation page. No real charge is ever made.

To swap in real Stripe test-mode payments:

1. `npm install stripe @stripe/stripe-js`
2. Add `.env.local`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```
3. Replace the simulated `onPay` handler in `src/app/checkout/page.tsx` with a call to a route handler that creates a Stripe Checkout Session (one-off `payment` mode for tickets/courses, `subscription` mode for memberships), passing the discounted amount, and point the success URL at `/checkout/confirmation`.

The member-discount calculation is already centralised in the checkout's `buildItem()` so the same logic feeds either implementation.

## Auth model & database (IMPORTANT)

**Where is data stored right now? Nowhere on a server.** Authentication is a client-side demo (localStorage-backed context in `src/lib/auth.tsx`): accounts, tickets and enrolments live only in each visitor's own browser. Nothing is shared between devices and nothing reaches you, the site owner. This is fine for a demo, not for real customers.

The Google / Microsoft / Apple buttons on the login and register pages are **demo mode** — they create a local session without a real OAuth round-trip.

### Going real: free database + real social login (Supabase)

[Supabase](https://supabase.com) free tier gives you a hosted Postgres database (500MB), authentication with Google/Microsoft/Apple OAuth built in, and file storage — no card required.

1. Create a project at supabase.com → copy the Project URL and anon key
2. `npm install @supabase/supabase-js @supabase/ssr`
3. Add to `.env` (Railway → service → Variables):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
4. In Supabase → Authentication → Providers, enable Google / Azure (Microsoft) / Apple. Each provider needs an OAuth app on that platform's console (Google Cloud Console and Azure are free; **Apple requires a paid Apple Developer account, $99/yr**)
5. Replace the internals of `src/lib/auth.tsx` with Supabase auth calls (`supabase.auth.signInWithOAuth({ provider })`), and swap `SocialAuth.tsx`'s `demoSignIn` for the real call — every page already consumes the single `useAuth()` hook, so nothing else changes
6. Create tables `orders` and `enrolments` in Supabase and write to them at checkout instead of localStorage

Alternative: NextAuth/Auth.js with Railway Postgres also works; Supabase is recommended because auth + database + storage come in one free service.

## Deploy to Vercel

```bash
npm i -g vercel
vercel           # preview deployment
vercel --prod    # production
```

Or push the repo to GitHub and import it at https://vercel.com/new (framework preset: Next.js, no extra configuration needed). Then point the `globalrsd.co.uk` DNS at Vercel (CNAME `cname.vercel-dns.com`) and add the domain in the Vercel project settings.

## Project structure

```
src/
  app/                 # App Router pages
    events/[slug]/     # event detail (agenda, speakers, tickets)
    courses/[slug]/    # course detail (syllabus, assessment, enrol)
    checkout/          # unified checkout + confirmation
    dashboard/         # member area
    legal/             # terms, privacy, refunds, data-protection
    news/[slug]/       # blog posts
    sitemap.ts         # sitemap.xml
    robots.ts          # robots.txt
  components/          # Header, Footer, Countdown, CountUp, Reveal, forms…
  lib/
    auth.tsx           # demo auth store (localStorage)
    site.ts            # brand/company constants
    data/              # events, courses, news, people, memberships
public/logo.svg        # heraldic crest placeholder logo
.claude/skills/        # skill-card-generator (NVIDIA/skills)
```

## Quality notes

- Animations are CSS/IntersectionObserver-based (no animation libraries) and disabled under `prefers-reduced-motion`
- All interactive elements are keyboard-accessible with visible focus states
- Static generation for all content pages (`generateStaticParams` on detail routes) keeps Lighthouse performance/SEO high
# girsd-website
