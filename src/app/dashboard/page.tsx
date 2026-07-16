"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export default function DashboardPage() {
  const { user, ready, updateUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.replace("/login?next=/dashboard");
  }, [ready, user, router]);

  if (!ready || !user) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-500" role="status">Loading your dashboard…</p>
      </section>
    );
  }

  const m = user.membership;

  return (
    <>
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">My Dashboard</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
            Welcome back, {user.name.split(" ")[0]}
          </h1>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-3">
        {/* Profile */}
        <section aria-labelledby="profile-h" className="card p-6">
          <h2 id="profile-h" className="font-display text-xl font-bold">Profile</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-semibold text-slate-500">Name</dt>
              <dd className="text-navy">{user.name}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">Email</dt>
              <dd className="text-navy">{user.email}</dd>
            </div>
          </dl>
        </section>

        {/* Membership */}
        <section aria-labelledby="membership-h" className="card border-t-4 border-t-gold p-6">
          <h2 id="membership-h" className="font-display text-xl font-bold">Membership</h2>
          {m ? (
            <>
              <p className="mt-4 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">
                {m.tierName} member · Active
              </p>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Member since</dt>
                  <dd className="font-medium text-navy">{new Date(m.since).toLocaleDateString("en-GB")}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Renews on</dt>
                  <dd className="font-medium text-navy">{new Date(m.renewsAt).toLocaleDateString("en-GB")}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Annual fee</dt>
                  <dd className="font-medium text-navy">£{m.price}</dd>
                </div>
              </dl>
              <p className="mt-4 rounded-md bg-gold/10 px-3 py-2 text-xs text-navy">
                Your 30% conference discount is applied automatically at checkout.
              </p>
              <div className="mt-4 flex gap-3">
                <Link href={`/checkout?type=membership&tier=${m.tierId}`} className="btn-navy text-sm">
                  Renew now
                </Link>
                <button
                  onClick={() => updateUser({ membership: null })}
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-400 hover:text-red-600"
                >
                  Cancel membership
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="mt-4 text-sm text-slate-600">
                You don&apos;t have an active membership. Join to unlock a 30%
                discount on every conference ticket and 15% off courses.
              </p>
              <Link href="/membership" className="btn-gold mt-5">Explore membership</Link>
            </>
          )}
        </section>

        {/* Quick actions */}
        <section aria-labelledby="actions-h" className="card bg-navy p-6 text-white">
          <h2 id="actions-h" className="font-display text-xl font-bold text-gold">Quick Actions</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link className="underline hover:text-gold-light" href="/events">Book conference tickets</Link></li>
            <li><Link className="underline hover:text-gold-light" href="/courses">Browse and enrol on courses</Link></li>
            <li><Link className="underline hover:text-gold-light" href="/awards">Nominate for the Global Awards</Link></li>
            <li><Link className="underline hover:text-gold-light" href="/contact">Contact the team</Link></li>
          </ul>
        </section>

        {/* Tickets */}
        <section aria-labelledby="tickets-h" className="card p-6 lg:col-span-2">
          <h2 id="tickets-h" className="font-display text-xl font-bold">My Tickets</h2>
          {user.tickets.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              No tickets yet. <Link href="/events" className="font-semibold text-navy underline">Browse upcoming events</Link>.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th scope="col" className="py-2 pr-4">Event</th>
                    <th scope="col" className="py-2 pr-4">Ticket</th>
                    <th scope="col" className="py-2 pr-4">Qty</th>
                    <th scope="col" className="py-2 pr-4">Paid</th>
                    <th scope="col" className="py-2">Order</th>
                  </tr>
                </thead>
                <tbody>
                  {user.tickets.map((t) => (
                    <tr key={t.orderId} className="border-b border-slate-100">
                      <td className="py-3 pr-4 font-medium text-navy">{t.eventTitle}</td>
                      <td className="py-3 pr-4">{t.tierName}</td>
                      <td className="py-3 pr-4">{t.quantity}</td>
                      <td className="py-3 pr-4">£{t.paid}</td>
                      <td className="py-3 font-mono text-xs text-slate-500">{t.orderId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Courses */}
        <section aria-labelledby="courses-h" className="card p-6">
          <h2 id="courses-h" className="font-display text-xl font-bold">My Courses</h2>
          {user.enrolments.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              No enrolments yet. <Link href="/courses" className="font-semibold text-navy underline">Browse courses</Link>.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {user.enrolments.map((e) => (
                <li key={e.orderId} className="rounded-md border border-slate-200 p-4">
                  <Link href={`/courses/${e.courseSlug}`} className="font-semibold text-navy hover:text-gold-dark">
                    {e.courseTitle}
                  </Link>
                  <p className="mt-1 text-xs text-slate-500">
                    Enrolled {new Date(e.date).toLocaleDateString("en-GB")} · £{e.paid} · {e.orderId}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
