import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { individualAwards, institutionalAwards, awards, awardsTimeline } from "@/lib/data/awards";
import { DemoForm, Field } from "@/components/forms";

export const metadata: Metadata = {
  title: "Global Awards",
  description:
    "The Globalrsd Global Awards recognise outstanding individuals and institutions across academia and industry. Nominate online — there is no fee to nominate.",
  alternates: { canonical: "/awards" },
};

const allCategories = awards.map((a) => a.name);

export default function AwardsPage() {
  return (
    <>
      <PageHero
        eyebrow="Globalrsd Global Awards 2026"
        title="Recognising Excellence in Research & Skills"
        intro="Celebrating outstanding researchers, educators, institutions and industry leaders from around the world. Nominations are open — nominate yourself or someone you admire, online and free of charge."
      />

      {/* Intro + quick actions */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <Reveal>
          <div className="img-zoom mb-12 h-72 rounded-md shadow-card">
            <img
              src="/awards.jpg"
              alt="Awards ceremony trophies"
              loading="lazy"
            />
          </div>
        </Reveal>
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <h2 className="flourish font-display text-3xl font-bold">About the Awards</h2>
            <p className="mt-6 leading-relaxed text-muted">
              The Globalrsd Global Awards honour excellence, innovation and impact across
              the research and skills-development community. Presented each year
              alongside our flagship conference, the awards shine a light on the
              people and organisations advancing knowledge and building capability
              worldwide. Winners join a distinguished international network and are
              profiled across Globalrsd channels.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              Anyone may submit a nomination — on their own behalf or for a colleague,
              student, mentor or institution. Every entry is assessed against published
              criteria by an independent panel of academics and industry leaders.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="card p-7">
              <h3 className="font-display text-xl font-bold">At a glance</h3>
              <ul className="mt-4 space-y-3 text-sm text-muted">
                <li className="flex justify-between gap-4"><span>Nomination fee</span><span className="font-semibold text-navy">Free</span></li>
                <li className="flex justify-between gap-4"><span>Categories</span><span className="font-semibold text-navy">{awards.length}</span></li>
                <li className="flex justify-between gap-4"><span>Deadline</span><span className="font-semibold text-navy">30 Sept 2026</span></li>
                <li className="flex justify-between gap-4"><span>Ceremony</span><span className="font-semibold text-navy">29 Nov 2026, Chennai</span></li>
              </ul>
              <a href="#nominate" className="btn-gold mt-6 w-full">Nominate now</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why it matters */}
      <section className="bg-cream py-16">
        <div className="mx-auto max-w-7xl px-4">
          <Reveal>
            <h2 className="flourish font-display text-3xl font-bold">Why the Awards Matter</h2>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Recognition & motivation", "Formal recognition for outstanding work, motivating individuals and teams to keep raising standards."],
              ["Enhanced reputation", "For institutions and organisations, a Globalrsd award strengthens reputation and credibility."],
              ["Networking & visibility", "Winners and finalists gain visibility across Globalrsd's global community and partner network."],
              ["Driving innovation", "By spotlighting impactful, innovative work, the awards push the whole sector forward."],
            ].map(([title, body], i) => (
              <Reveal key={title} delay={i * 80}>
                <div className="card h-full p-6">
                  <h3 className="font-display text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <Reveal>
          <h2 className="flourish font-display text-3xl font-bold">Award Categories</h2>
          <p className="mt-4 max-w-2xl text-muted">
            Choose the category that best fits the nominee. Not sure which fits best?
            Our team will help place your nomination correctly.
          </p>
        </Reveal>

        <h3 className="mt-10 font-display text-xl font-bold text-navy">Individual Awards</h3>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {individualAwards.map((c, i) => (
            <Reveal key={c.id} delay={(i % 3) * 90}>
              <div className="card h-full border-t-4 border-t-gold p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">{c.track}</p>
                <h4 className="mt-2 font-display text-lg font-bold">{c.name}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted">{c.description}</p>
                <a href="#nominate" className="mt-4 inline-block text-sm font-semibold text-navy hover:text-gold-dark">Nominate for this →</a>
              </div>
            </Reveal>
          ))}
        </div>

        <h3 className="mt-12 font-display text-xl font-bold text-navy">Institutional Awards</h3>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {institutionalAwards.map((c, i) => (
            <Reveal key={c.id} delay={(i % 3) * 90}>
              <div className="card h-full border-t-4 border-t-navy p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">{c.track}</p>
                <h4 className="mt-2 font-display text-lg font-bold">{c.name}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted">{c.description}</p>
                <a href="#nominate" className="mt-4 inline-block text-sm font-semibold text-navy hover:text-gold-dark">Nominate for this →</a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Eligibility + Judging */}
      <section className="bg-cream py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-2">
          <Reveal>
            <h2 className="flourish font-display text-3xl font-bold">Who Can Enter</h2>
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-muted">
              {[
                "Researchers, academics, educators and doctoral candidates at any career stage.",
                "Industry professionals whose work is informed by research or drives skills development.",
                "Departments, universities, colleges and organisations worldwide.",
                "Self-nominations and third-party nominations are equally welcome.",
                "There is no fee to nominate, and nominees need not be Globalrsd members.",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span aria-hidden="true" className="mt-0.5 font-bold text-gold">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="flourish font-display text-3xl font-bold">How Entries Are Judged</h2>
            <ol className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
              {[
                ["Significance & impact", "The demonstrable difference the work has made to its field, organisation or community."],
                ["Excellence & rigour", "Quality, originality and methodological soundness of the work."],
                ["Innovation", "Novelty of approach and contribution to advancing practice."],
                ["Evidence", "Strength of the supporting evidence provided in the nomination."],
              ].map(([t, b], i) => (
                <li key={t} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy font-display text-sm font-bold text-white">{i + 1}</span>
                  <span><span className="font-semibold text-navy">{t}.</span> {b}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-4xl px-4 py-16">
        <Reveal>
          <h2 className="flourish text-center font-display text-3xl font-bold">Key Dates</h2>
        </Reveal>
        <ol className="mt-10 space-y-0">
          {awardsTimeline.map((step, i) => (
            <Reveal key={step.label} delay={i * 70}>
              <li className="flex gap-5 pb-8 last:pb-0">
                <div className="flex flex-col items-center">
                  <span className="flex h-4 w-4 shrink-0 rounded-full border-2 border-gold bg-white" />
                  {i < awardsTimeline.length - 1 && <span className="mt-1 w-0.5 flex-1 bg-line" />}
                </div>
                <div className="-mt-1">
                  <p className="font-semibold text-navy">{step.date}</p>
                  <p className="text-sm text-muted">{step.label}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* How to nominate */}
      <section className="bg-navy py-16 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <Reveal>
            <h2 className="font-display text-3xl font-bold text-white">How to Nominate</h2>
          </Reveal>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              ["Choose a category", "Pick the award that best matches the nominee's achievements."],
              ["Complete the form", "Tell us about the nominee and provide a short evidence statement and any supporting links or documents."],
              ["Submit online", "Send your nomination — you'll receive email confirmation within two working days."],
            ].map(([t, b], i) => (
              <Reveal key={t} delay={i * 90}>
                <div className="h-full rounded-md border border-white/10 bg-white/5 p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold font-display text-lg font-bold text-navy">{i + 1}</span>
                  <h3 className="mt-4 font-display text-lg font-bold text-white">{t}</h3>
                  <p className="mt-2 text-sm text-slate-300">{b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Nomination form */}
      <section id="nominate" className="mx-auto max-w-3xl px-4 py-16" aria-labelledby="nominate-heading">
        <Reveal>
          <h2 id="nominate-heading" className="flourish font-display text-3xl font-bold">
            Submit a Nomination
          </h2>
          <p className="mt-4 text-muted">
            Nominations may be made on your own behalf or for a colleague or
            institution. All entries are assessed against published criteria by our
            independent judging panel. There is no fee to nominate.
          </p>
        </Reveal>
        <div className="card mt-8 p-8">
          <DemoForm
            name="Award nomination"
            submitLabel="Submit nomination"
            successMessage="Your nomination has been received. The awards committee will confirm receipt by email within two working days."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Your full name" id="nominator-name" autoComplete="name" />
              <Field label="Your email" id="nominator-email" type="email" autoComplete="email" />
            </div>
            <Field label="Nomination type" id="nomination-type" as="select" options={["Self-nomination", "Nominating someone else"]} />
            <Field label="Award category" id="category" as="select" options={allCategories} />
            <Field label="Nominee name (individual or institution)" id="nominee" />
            <Field label="Nominee affiliation / organisation" id="affiliation" />
            <Field label="Nominee country" id="country" required={false} />
            <Field
              label="Evidence statement — why does this nominee deserve the award? (max 500 words)"
              id="statement"
              as="textarea"
              rows={7}
            />
            <Field label="Supporting links (publications, profiles, portfolio)" id="links" required={false} hint="Optional — separate multiple links with commas." />
            <Field label="Supporting document (optional)" id="attachment" as="file" required={false} accept=".pdf,.doc,.docx" hint="PDF or Word, max 10 MB." />
          </DemoForm>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-cream py-16">
        <div className="mx-auto max-w-3xl px-4">
          <Reveal>
            <h2 className="flourish font-display text-3xl font-bold">Frequently Asked Questions</h2>
          </Reveal>
          <div className="mt-8 space-y-4">
            {[
              ["Is there a fee to nominate?", "No. Nominating is completely free, whether you nominate yourself or someone else."],
              ["Do nominees have to be Globalrsd members?", "No. Membership is not required to nominate or to win."],
              ["Can I nominate myself?", "Yes — self-nominations are welcome and assessed on the same basis as third-party nominations."],
              ["How are winners chosen?", "An independent panel of academics and industry leaders scores each entry against published criteria: significance, excellence, innovation and evidence."],
              ["When and where is the ceremony?", "Winners are announced at the ICMDR 2026 ceremony on 29 November 2026 at CMS College of Engineering, Chennai."],
            ].map(([q, a], i) => (
              <Reveal key={q} delay={i * 60}>
                <details className="card group p-5">
                  <summary className="cursor-pointer list-none font-semibold text-navy [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center justify-between gap-4">
                      {q}
                      <span aria-hidden="true" className="text-gold transition group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{a}</p>
                </details>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-8 text-center text-sm text-muted">
              Awards enquiries:{" "}
              <a href="mailto:awards@globalrsd.co.uk" className="font-semibold text-navy underline">awards@globalrsd.co.uk</a>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
