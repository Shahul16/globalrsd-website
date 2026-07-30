-- GIRSD database schema
-- Run once in Supabase → SQL Editor → New query → paste → Run

-- ============================================================
-- ORDERS: every paid Stripe checkout (tickets, courses, memberships)
-- Written ONLY by the Stripe webhook (service role). Members read their own.
-- ============================================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  email text,
  kind text not null check (kind in ('ticket', 'course', 'membership', 'unknown')),
  title text not null,
  slug text,
  tier text,
  quantity integer not null default 1,
  amount integer not null default 0,          -- pence (GBP)
  currency text not null default 'gbp',
  stripe_session_id text unique,
  status text not null default 'paid',
  cancelled_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

-- Members can read their own orders (dashboard)
drop policy if exists "Users read own orders" on public.orders;
create policy "Users read own orders"
  on public.orders for select
  using (auth.uid() = user_id);

-- No insert/update/delete policies for regular users:
-- only the service-role key (webhook + API routes) can write.

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_kind_idx on public.orders (kind);

-- ============================================================
-- CERTIFICATES: public verification lookup (/verify-certificate)
-- Add rows via Supabase Table Editor as you issue certificates.
-- ============================================================
create table if not exists public.certificates (
  id text primary key,                         -- e.g. GIRSD-2026-001
  name text not null,                          -- recipient full name
  course text not null,                        -- course or event title
  issued_date date not null default current_date
);

alter table public.certificates enable row level security;
-- No public policies: lookups go through the server API (service role),
-- so the full list can never be scraped.
