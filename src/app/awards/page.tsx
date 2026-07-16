import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { awardCategories } from "@/lib/data/memberships";
import { DemoForm, Field } from "@/components/forms";

export const metadata: Metadata = {
  title: "Awards",
  description:
    "The GIRSD Global Awards recognise outstanding individuals and institutions across academia and industry. Nominations for 2026 are open — no fee to nominate.",
  alternates: { canonical: "/awards" },
};

const allCategories = [
  ...awardCategories.individual.map((c) => c.name),
  ...awardCategories.institutional.map((c) => c.name),
];

export default function AwardsPage() {
  return (
    <>
      <PageHero
        eyebrow="GIRSD Global Awards 2026"
        title="Recognising Excellence in Research & Skills"
        intro="Eight categories across academia and industry, judged by an independent international panel. Nominations close 21 August 2026 — there is no fee to nominate."
      />

      <section className="mx-auto max-w-7xl px-4 py-16">
        <Reveal>
          <div className="img-zoom mb-12 h-64 rounded-xl shadow-md">
            <img
              src="https://images.unsplash.com/photo-1579389083078-4e7018379f7e?auto=format&fit=crop&w=1600&q=60"
              alt="Gold award trophies on a ceremony stage"
              loading="lazy"
            />
          </div>
          <h2 className="flourish font-display text-3xl font-bold">Why the Awards Matter</h2>
        </Reveal>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Recognition & motivation", "Awards provide recognition for hard work and outstanding contributions, motivating individuals and teams."],
            ["Enhanced reputation", "For organisations, winning awards can significantly boost reputation and credibility."],
            ["Networking & knowledge sharing", "Award ceremonies are platforms for networking, connecting attendees to share best practice within their field."],
            ["Driving innovation", "By highlighting innovative ideas and impactful work, the awards encourage the whole sector to push boundaries and raise standards."],
          ].map(([title, body], i) => (
            <Reveal key={title} delay={i * 80}>
              <div className="card h-full p-6">
                <h3 className="font-display text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <h2 className="flourish mt-16 font-display text-3xl font-bold">Individual Awards</h2>
        </Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {awardCategories.individual.map((c, i) => (
            <Reveal key={c.name} delay={(i % 3) * 90}>
              <div className="card h-full border-t-4 border-t-gold p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">{c.track}</p>
                <h3 className="mt-2 font-display text-xl font-bold">{c.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <h2 className="flourish mt-16 font-display text-3xl font-bold">Institutional Awards</h2>
        </Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {awardCategories.institutional.map((c, i) => (
            <Reveal key={c.name} delay={(i % 3) * 90}>
              <div className="card h-full border-t-4 border-t-navy p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">{c.track}</p>
                <h3 className="mt-2 font-display text-xl font-bold">{c.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-navy py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-bold text-white">Ceremony &amp; Venue</h2>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-300">
              The 2026 awards ceremony takes place on <strong className="text-gold">Friday 16 October 2026</strong> at
              The Bromley Court Hotel, London, alongside the closing session of
              ICRIET 2026. Shortlisted nominees receive two complimentary
              ceremony places; winners receive a commissioned trophy, a citation
              presented on stage, and a profile feature across GIRSD channels.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16" aria-labelledby="nominate-heading">
        <Reveal>
          <h2 id="nominate-heading" className="flourish font-display text-3xl font-bold">
            Submit a Nomination
          </h2>
          <p className="mt-4 text-slate-600">
            Nominations may be made on your own behalf or for a colleague or
            institution. All entries are assessed against published criteria by
            our independent judging panel.
          </p>
        </Reveal>
        <div className="card mt-8 p-8">
          <DemoForm
            name="Award nomination form"
            submitLabel="Submit nomination"
            successMessage="Your nomination has been received. The awards committee will confirm receipt by email within two working days."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Your full name" id="nominator-name" autoComplete="name" />
              <Field label="Your email" id="nominator-email" type="email" autoComplete="email" />
            </div>
            <Field label="Award category" id="category" as="select" options={allCategories} />
            <Field label="Nominee name (individual or institution)" id="nominee" />
            <Field label="Nominee affiliation / organisation" id="affiliation" />
            <Field
              label="Evidence statement — why does this nominee deserve the award? (max 500 words)"
              id="statement"
              as="textarea"
              rows={7}
            />
          </DemoForm>
        </div>
        <Reveal>
          <p className="mt-8 text-center text-sm text-slate-500">
            Questions about research submissions:{" "}
            <a href="mailto:research@globalsrd.co.uk" className="font-semibold text-navy underline">research@globalsrd.co.uk</a>
            {" "}· Awards enquiries:{" "}
            <a href="mailto:awards@globalsrd.co.uk" className="font-semibold text-navy underline">awards@globalsrd.co.uk</a>
          </p>
        </Reveal>
      </section>
    </>
  );
}
