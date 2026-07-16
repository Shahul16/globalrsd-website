"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Order = {
  orderId: string;
  title: string;
  detail: string;
  quantity: number;
  subtotal: number;
  discount: number;
  total: number;
  date: string;
};

export default function ConfirmationPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("girsd_last_order");
      if (raw) setOrder(JSON.parse(raw));
    } catch { /* ignore */ }
    setReady(true);
  }, []);

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-cream px-4 py-16">
      <div className="card w-full max-w-lg p-8 text-center">
        {!ready ? (
          <p className="text-slate-500" role="status">Loading…</p>
        ) : order ? (
          <>
            <span aria-hidden="true" className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-600">
              ✓
            </span>
            <h1 className="mt-5 font-display text-3xl font-bold">Payment Confirmed</h1>
            <p className="mt-2 text-sm text-slate-500">
              Thank you — a receipt has been sent to your email address.
            </p>
            <dl className="mt-6 space-y-2 rounded-lg bg-cream p-5 text-left text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Order reference</dt>
                <dd className="font-mono font-semibold text-navy">{order.orderId}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Item</dt>
                <dd className="max-w-[60%] text-right font-medium text-navy">{order.title}</dd>
              </div>
              {order.quantity > 1 && (
                <div className="flex justify-between">
                  <dt className="text-slate-500">Quantity</dt>
                  <dd className="font-medium text-navy">{order.quantity}</dd>
                </div>
              )}
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <dt>Member discount</dt>
                  <dd>−£{order.discount}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-200 pt-2 font-display text-base font-bold text-navy">
                <dt>Total paid</dt>
                <dd>£{order.total}</dd>
              </div>
            </dl>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/dashboard" className="btn-gold">Go to my dashboard</Link>
              <Link href="/events" className="btn-outline">Browse more events</Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="font-display text-2xl font-bold">No recent order found</h1>
            <p className="mt-3 text-sm text-slate-500">
              We couldn&apos;t find a recent order on this device.
            </p>
            <Link href="/events" className="btn-navy mt-6">Browse events</Link>
          </>
        )}
      </div>
    </section>
  );
}
