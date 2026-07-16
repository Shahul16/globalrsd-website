"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth";
import { getEvent } from "@/lib/data/events";
import { getCourse } from "@/lib/data/courses";
import { getTier } from "@/lib/data/memberships";
import { SITE } from "@/lib/site";

type LineItem = {
  kind: "ticket" | "course" | "membership";
  title: string;
  detail: string;
  unitPrice: number;
  discountRate: number; // 0, 0.15 or 0.3
  meta: Record<string, string>;
};

function buildItem(
  params: URLSearchParams,
  isMember: boolean
): LineItem | null {
  const type = params.get("type");
  if (type === "ticket") {
    const event = getEvent(params.get("event") ?? "");
    const tier = event?.tickets.find((t) => t.id === params.get("tier"));
    if (!event || !tier) return null;
    return {
      kind: "ticket",
      title: `${event.acronym} — ${tier.name}`,
      detail: `${event.title}, ${new Date(event.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`,
      unitPrice: tier.price,
      discountRate: isMember ? SITE.memberDiscount : 0,
      meta: { eventSlug: event.slug, eventTitle: event.acronym, tierName: tier.name },
    };
  }
  if (type === "course") {
    const course = getCourse(params.get("course") ?? "");
    if (!course) return null;
    return {
      kind: "course",
      title: course.title,
      detail: `${course.duration} online course · ${course.certification.split(".")[0]}`,
      unitPrice: course.price,
      discountRate: isMember ? 0.15 : 0,
      meta: { courseSlug: course.slug, courseTitle: course.title },
    };
  }
  if (type === "membership") {
    const tier = getTier(params.get("tier") ?? "");
    if (!tier) return null;
    return {
      kind: "membership",
      title: `GIRSD ${tier.name} Membership`,
      detail: "Annual subscription · renews yearly, cancel any time",
      unitPrice: tier.price,
      discountRate: 0,
      meta: { tierId: tier.id, tierName: tier.name },
    };
  }
  return null;
}

function CheckoutInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { user, ready, updateUser } = useAuth();
  const isMember = Boolean(user?.membership);
  const [qty, setQty] = useState(1);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  const item = useMemo(
    () => buildItem(new URLSearchParams(params.toString()), isMember),
    [params, isMember]
  );

  if (!item) {
    return (
      <div className="card mx-auto max-w-lg p-8 text-center">
        <h1 className="font-display text-2xl font-bold">Nothing to check out</h1>
        <p className="mt-3 text-sm text-slate-500">
          Your basket is empty or the link has expired.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/events" className="btn-navy">Browse events</Link>
          <Link href="/membership" className="btn-gold">View membership</Link>
        </div>
      </div>
    );
  }

  if (ready && !user) {
    const next = `/checkout?${params.toString()}`;
    return (
      <div className="card mx-auto max-w-lg p-8 text-center">
        <h1 className="font-display text-2xl font-bold">Please log in first</h1>
        <p className="mt-3 text-sm text-slate-500">
          You need an account so we can attach your{" "}
          {item.kind === "membership" ? "membership" : item.kind === "course" ? "enrolment" : "tickets"} to it.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href={`/login?next=${encodeURIComponent(next)}`} className="btn-gold">Log in</Link>
          <Link href="/register" className="btn-outline">Register</Link>
        </div>
      </div>
    );
  }

  const quantity = item.kind === "ticket" ? qty : 1;
  const subtotal = item.unitPrice * quantity;
  const discount = Math.round(subtotal * item.discountRate);
  const total = subtotal - discount;

  function onPay(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const card = String(form.get("card") ?? "").replace(/\s/g, "");
    if (card.length < 12) {
      setError("Please enter a valid card number (use Stripe test card 4242 4242 4242 4242).");
      return;
    }
    setError("");
    setPaying(true);

    // Simulated Stripe (test mode) confirmation
    setTimeout(() => {
      const orderId = `GIRSD-${Date.now().toString(36).toUpperCase()}`;
      const now = new Date().toISOString();

      if (item!.kind === "ticket") {
        updateUser({
          tickets: [
            ...(user?.tickets ?? []),
            {
              orderId,
              eventSlug: item!.meta.eventSlug,
              eventTitle: item!.meta.eventTitle,
              tierName: item!.meta.tierName,
              quantity,
              paid: total,
              date: now,
            },
          ],
        });
      } else if (item!.kind === "course") {
        updateUser({
          enrolments: [
            ...(user?.enrolments ?? []),
            {
              orderId,
              courseSlug: item!.meta.courseSlug,
              courseTitle: item!.meta.courseTitle,
              paid: total,
              date: now,
            },
          ],
        });
      } else {
        const renews = new Date();
        renews.setFullYear(renews.getFullYear() + 1);
        updateUser({
          membership: {
            tierId: item!.meta.tierId,
            tierName: item!.meta.tierName,
            price: item!.unitPrice,
            since: now,
            renewsAt: renews.toISOString(),
          },
        });
      }

      try {
        window.localStorage.setItem(
          "girsd_last_order",
          JSON.stringify({ orderId, title: item!.title, detail: item!.detail, quantity, subtotal, discount, total, date: now })
        );
      } catch { /* ignore */ }

      router.push("/checkout/confirmation");
    }, 900);
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_380px]">
      {/* Payment form */}
      <div className="card p-8">
        <h1 className="font-display text-2xl font-bold">Secure Checkout</h1>
        <p className="mt-1 text-sm text-slate-500">
          Payments are processed by Stripe in test mode. No real charge is made.
        </p>
        <form onSubmit={onPay} className="mt-6 space-y-5" aria-label="Payment form">
          {error && (
            <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>
          )}
          {item.kind === "ticket" && (
            <div>
              <label htmlFor="qty" className="label">Number of delegates</label>
              <select
                id="qty"
                className="input max-w-[120px]"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label htmlFor="cardname" className="label">Name on card</label>
            <input id="cardname" name="cardname" required autoComplete="cc-name" className="input" defaultValue={user?.name ?? ""} />
          </div>
          <div>
            <label htmlFor="card" className="label">Card number</label>
            <input
              id="card"
              name="card"
              required
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="4242 4242 4242 4242"
              className="input"
            />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label htmlFor="expiry" className="label">Expiry</label>
              <input id="expiry" name="expiry" required placeholder="12/28" autoComplete="cc-exp" className="input" />
            </div>
            <div>
              <label htmlFor="cvc" className="label">CVC</label>
              <input id="cvc" name="cvc" required inputMode="numeric" placeholder="123" autoComplete="cc-csc" className="input" />
            </div>
          </div>
          <button type="submit" disabled={paying} className="btn-gold w-full disabled:opacity-60">
            {paying ? "Processing payment…" : `Pay £${total}`}
          </button>
          <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2v-9a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm3 8H9V6a3 3 0 116 0v3z"/></svg>
            256-bit TLS · Powered by Stripe (test mode)
          </p>
        </form>
      </div>

      {/* Order summary */}
      <aside aria-label="Order summary">
        <div className="card bg-navy p-8 text-white">
          <h2 className="font-display text-xl font-bold text-gold">Order Summary</h2>
          <p className="mt-4 font-semibold">{item.title}</p>
          <p className="mt-1 text-sm text-slate-300">{item.detail}</p>
          <dl className="mt-6 space-y-2 border-t border-white/15 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-300">
                {quantity > 1 ? `${quantity} × £${item.unitPrice}` : "Subtotal"}
              </dt>
              <dd>£{subtotal}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-300">
                <dt>Member discount ({Math.round(item.discountRate * 100)}%)</dt>
                <dd>−£{discount}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-white/15 pt-3 font-display text-lg font-bold">
              <dt>Total</dt>
              <dd>£{total}</dd>
            </div>
          </dl>
          {item.kind === "ticket" && !isMember && (
            <p className="mt-5 rounded-md bg-gold/15 px-3 py-2.5 text-xs text-gold-light">
              Members would pay £{Math.round(subtotal * (1 - SITE.memberDiscount))} for this order.{" "}
              <Link href="/membership" className="underline">Join from £49/year</Link>
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <section className="bg-cream px-4 py-16">
      <Suspense
        fallback={<p className="text-center text-slate-500" role="status">Loading checkout…</p>}
      >
        <CheckoutInner />
      </Suspense>
    </section>
  );
}
