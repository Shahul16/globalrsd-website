"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { SITE } from "@/lib/site";
import type { TicketTier } from "@/lib/data/events";

export default function TicketSelector({
  eventSlug,
  tiers,
}: {
  eventSlug: string;
  tiers: TicketTier[];
}) {
  const { user, ready } = useAuth();
  const isMember = Boolean(user?.membership);

  return (
    <div>
      {ready && (
        <p
          className={`mb-5 rounded-md px-4 py-3 text-sm font-medium ${
            isMember
              ? "bg-emerald-50 text-emerald-800"
              : "bg-gold/10 text-navy"
          }`}
          role="status"
        >
          {isMember
            ? `Your ${user!.membership!.tierName} membership discount of 30% will be applied at checkout.`
            : (
              <>
                GIRSD members save 30% on every ticket.{" "}
                <Link href="/membership" className="font-semibold underline hover:text-gold-dark">
                  Join from £49/year
                </Link>
              </>
            )}
        </p>
      )}
      <ul className="grid gap-5 lg:grid-cols-3">
        {tiers.map((t) => {
          const discounted = Math.round(t.price * (1 - SITE.memberDiscount));
          return (
            <li key={t.id} className="card flex h-full flex-col p-6">
              <h3 className="font-display text-lg font-bold">{t.name}</h3>
              <p className="mt-2 font-display text-3xl font-bold text-navy">
                £{isMember ? discounted : t.price}
                {isMember && (
                  <span className="ml-2 text-base font-normal text-slate-400 line-through">
                    £{t.price}
                  </span>
                )}
              </p>
              {!isMember && (
                <p className="mt-1 text-xs text-slate-500">£{discounted} for members</p>
              )}
              <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-600">
                {t.includes.map((inc) => (
                  <li key={inc} className="flex gap-2">
                    <span aria-hidden="true" className="text-gold-dark">✓</span>
                    {inc}
                  </li>
                ))}
              </ul>
              <Link
                href={`/checkout?type=ticket&event=${eventSlug}&tier=${t.id}`}
                className="btn-navy mt-6 w-full"
              >
                Book — {t.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
