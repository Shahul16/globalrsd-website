import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { membershipTiers } from "@/lib/data/memberships";
import { DemoForm, Field } from "@/components/forms";

export const metadata: Metadata = {
  title: "Membership",
  description:
    "Join Globalrsd from £49/year. Student, Academic and Industry tiers with a 30% discount on all conference tickets, course discounts, mentoring and members-only briefings.",
  alternates: { canonical: "/membership" },
};

export default function MembershipPage() {
  return (
    <>
      <PageHero
        eyebrow="Membership"
        title="Join a Worldwide Community"
        intro="Three tiers, one community. Every member saves 30% on conference tickets and 15% on courses — plus mentoring, briefings and recognition."
      />

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {membershipTiers.map((t, i) => (
            <Reveal key={t.id} delay={i * 100}>
              <div
                className={`card relative flex h-full flex-col p-8 ${
                  t.featured ? "border-2 border-gold shadow-lg" : ""
                }`}
              >
                {t.featured && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1 text-xs font-bold uppercase tracking-wide text-navy">
                    Most popular
                  </span>
                )}
                <h2 className="font-display text-2xl font-bold">{t.name}</h2>
                <p className="mt-1 text-sm text-slate-500">{t.audience}</p>
                <p className="mt-5 font-display text-5xl font-bold text-navy">
                  £{t.price}
                  <span className="text-base font-normal text-slate-500"> /year</span>
                </p>
                <ul className="mt-6 flex-1 space-y-2.5 text-sm text-slate-600">
                  {t.benefits.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span aria-hidden="true" className="mt-0.5 text-gold-dark">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/checkout?type=membership&tier=${t.id}`}
                  className={`${t.featured ? "btn-gold" : "btn-navy"} mt-8 w-full`}
                >
                  Join as {t.name}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-slate-500">
            Membership renews annually as a subscription and can be cancelled at
            any time from your dashboard. The 30% conference discount is applied
            automatically at checkout for the lifetime of your membership.
          </p>
        </Reveal>

        {/* Comparison table */}
        <Reveal>
          <h2 className="flourish mt-20 text-center font-display text-3xl font-bold">
            Compare Tiers at a Glance
          </h2>
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <caption className="sr-only">Comparison of membership tier benefits</caption>
              <thead>
                <tr className="bg-navy text-white">
                  <th scope="col" className="rounded-tl-lg p-4 text-left font-display">Benefit</th>
                  <th scope="col" className="p-4 text-center font-display">Student<br /><span className="text-gold">£49/yr</span></th>
                  <th scope="col" className="border-x-2 border-gold bg-navy-light p-4 text-center font-display">Academic<br /><span className="text-gold">£99/yr</span></th>
                  <th scope="col" className="rounded-tr-lg p-4 text-center font-display">Industry<br /><span className="text-gold">£249/yr</span></th>
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    ["30% discount on all conference tickets", true, true, true],
                    ["15% discount on online courses", true, true, true],
                    ["Members-only quarterly briefings", true, true, true],
                    ["Member community forum", true, true, true],
                    ["Digital membership certificate", true, true, true],
                    ["Printed membership certificate", false, true, true],
                    ["Priority paper review scheduling", false, true, false],
                    ["Cross-sector mentoring scheme", false, true, true],
                    ["Eligibility for committee service", false, true, false],
                    ["Two workshop delegate passes per year", false, false, true],
                    ["Industry panel speaking opportunities", false, false, true],
                    ["Company profile in Globalrsd directory", false, false, true],
                  ] as [string, boolean, boolean, boolean][]
                ).map(([label, s, a, ind], i) => (
                  <tr key={label} className={i % 2 ? "bg-cream" : "bg-white"}>
                    <th scope="row" className="p-4 text-left font-medium text-slate-700">{label}</th>
                    {[s, a, ind].map((v, col) => (
                      <td
                        key={col}
                        className={`p-4 text-center ${col === 1 ? "border-x-2 border-gold/60" : ""}`}
                      >
                        {v ? (
                          <span aria-label="Included" className="font-bold text-emerald-600">✓</span>
                        ) : (
                          <span aria-label="Not included" className="text-slate-300">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="p-4" />
                  {membershipTiers.map((t) => (
                    <td key={t.id} className={`p-4 text-center ${t.featured ? "border-x-2 border-b-2 border-gold/60" : ""}`}>
                      <Link href={`/checkout?type=membership&tier=${t.id}`} className={`${t.featured ? "btn-gold" : "btn-navy"} text-sm`}>
                        Join {t.name}
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      {/* Scientific Committee membership */}
      <section className="bg-cream py-16" aria-labelledby="committee-heading">
        <div className="mx-auto max-w-7xl px-4">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 id="committee-heading" className="flourish font-display text-3xl font-bold">
              Join Our Scientific Committee
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              Our Scientific Committee is the heart of Globalrsd&apos;s academic
              excellence — passionate researchers, experienced professionals
              and thought leaders from around the world who shape our
              conference programmes and review the research we present. We
              invite experts in Management, Finance, Economics, Humanities,
              Social Sciences, Science, Technology, Engineering and Education
              to apply.
            </p>
          </Reveal>
          <div className="mx-auto mt-10 grid max-w-5xl gap-8 lg:grid-cols-2">
            <Reveal>
              <div className="card h-full p-8">
                <h3 className="font-display text-xl font-bold">Member Benefits</h3>
                <ul className="mt-5 space-y-3 text-sm leading-relaxed text-slate-600">
                  <li className="flex gap-2"><span aria-hidden="true" className="text-gold-dark">✓</span> Recognition in our global academic network and a voice in shaping conference themes, research reviews and workshops</li>
                  <li className="flex gap-2"><span aria-hidden="true" className="text-gold-dark">✓</span> Official committee membership certificate</li>
                  <li className="flex gap-2"><span aria-hidden="true" className="text-gold-dark">✓</span> 20% discount on Globalrsd events</li>
                  <li className="flex gap-2"><span aria-hidden="true" className="text-gold-dark">✓</span> Opportunities to influence your discipline through global collaboration</li>
                </ul>
                <p className="mt-5 rounded-md bg-gold/10 px-4 py-3 text-xs leading-relaxed text-navy">
                  All applications are reviewed by our committee and team to
                  ensure a diverse group of thought leaders driving meaningful
                  outcomes.
                </p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="card p-8">
                <h3 className="font-display text-xl font-bold">Application Form</h3>
                <div className="mt-5">
                  <DemoForm
                    name="Scientific committee application form"
                    submitLabel="Submit application"
                    successMessage="Your application has been received. The committee will review it and respond by email."
                  >
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Prefix (Dr, Prof, Mr, Ms…)" id="sc-prefix" />
                      <Field label="First name" id="sc-first" autoComplete="given-name" />
                      <Field label="Last name" id="sc-last" autoComplete="family-name" />
                      <Field label="Email" id="sc-email" type="email" autoComplete="email" />
                      <Field label="Phone" id="sc-phone" type="tel" autoComplete="tel" />
                      <Field label="Country" id="sc-country" autoComplete="country-name" />
                      <Field label="Academic institution" id="sc-institution" />
                      <Field
                        label="Field of studies"
                        id="sc-field"
                        as="select"
                        options={[
                          "Management",
                          "Finance",
                          "Economics",
                          "Humanities",
                          "Social Sciences",
                          "Science",
                          "Technology",
                          "Engineering",
                          "Education",
                        ]}
                      />
                    </div>
                  </DemoForm>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-navy py-16 text-white" aria-labelledby="sponsors-heading">
        <div className="mx-auto max-w-7xl px-4">
          <Reveal className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 id="sponsors-heading" className="font-display text-3xl font-bold text-white">
                Sponsors &amp; Exhibiting
              </h2>
              <p className="mt-4 leading-relaxed text-slate-300">
                Put your organisation in front of thousands of researchers,
                academics and skilled professionals. Globalrsd offers conference
                sponsorship packages, exhibition stands, and year-round brand
                partnerships — from session sponsorship at a single event to
                headline sponsorship of the Global Awards.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-slate-200">
                <li className="flex gap-2"><span aria-hidden="true" className="text-gold">◆</span> Exhibition stands at all conferences and summits</li>
                <li className="flex gap-2"><span aria-hidden="true" className="text-gold">◆</span> Keynote and session sponsorship with speaking slots</li>
                <li className="flex gap-2"><span aria-hidden="true" className="text-gold">◆</span> Awards ceremony and category sponsorship</li>
                <li className="flex gap-2"><span aria-hidden="true" className="text-gold">◆</span> Branding across proceedings, signage and digital channels</li>
              </ul>
            </div>
            <div className="rounded-lg border border-gold/40 bg-white/5 p-8 text-center">
              <p className="font-display text-2xl font-bold text-gold">Partner with Globalrsd</p>
              <p className="mt-3 text-sm text-slate-300">
                Request our sponsorship prospectus or discuss a bespoke package
                with the partnerships team.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link href="/contact" className="btn-gold">Request the prospectus</Link>
                <Link href="/partner" className="rounded-md border-2 border-white/50 px-5 py-2.5 font-semibold text-white transition hover:border-gold hover:text-gold">
                  Become an agent / partner
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
