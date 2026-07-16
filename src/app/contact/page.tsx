import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { DemoForm, Field } from "@/components/forms";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact the Global Institute of Research & Skills Development. Enquiries about conferences, courses, membership, awards and partnerships.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="We'd Be Delighted to Hear From You"
        intro="Questions about an event, a course, membership or partnership? The team replies within two working days."
      />
      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 lg:grid-cols-[1fr_380px]">
        <Reveal>
          <div className="card p-8">
            <h2 className="font-display text-2xl font-bold">Send an Enquiry</h2>
            <div className="mt-6">
              <DemoForm
                name="Contact enquiry form"
                submitLabel="Send enquiry"
                successMessage="Your enquiry has been received. A member of the team will reply within two working days."
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" id="name" autoComplete="name" />
                  <Field label="Email address" id="email" type="email" autoComplete="email" />
                </div>
                <Field
                  label="Subject"
                  id="subject"
                  as="select"
                  options={[
                    "Conference / event enquiry",
                    "Course enquiry",
                    "Membership",
                    "Awards & nominations",
                    "Sponsorship & exhibiting",
                    "Partnership / agents",
                    "Other",
                  ]}
                />
                <Field label="Your message" id="message" as="textarea" />
              </DemoForm>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <aside aria-label="Company details">
            <div className="card bg-navy p-8 text-white">
              <h2 className="font-display text-xl font-bold text-gold">Company Details</h2>
              <dl className="mt-5 space-y-4 text-sm leading-relaxed text-slate-200">
                <div>
                  <dt className="font-semibold text-white">Legal entity</dt>
                  <dd>{SITE.company.legalName} (trading as {SITE.company.tradingAs})</dd>
                </div>
                <div>
                  <dt className="font-semibold text-white">Company number</dt>
                  <dd>{SITE.company.number} (England &amp; Wales)</dd>
                </div>
                <div>
                  <dt className="font-semibold text-white">Registered office</dt>
                  <dd>{SITE.company.address}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-white">Email</dt>
                  <dd>
                    <a href={`mailto:${SITE.email}`} className="text-gold-light underline">{SITE.email}</a>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-white">WhatsApp</dt>
                  <dd>
                    <a href={SITE.whatsapp} className="text-gold-light underline">{SITE.phone}</a>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-white">Office hours</dt>
                  <dd>Monday–Friday, 09:00–17:30 (UK time)</dd>
                </div>
              </dl>
            </div>
          </aside>
        </Reveal>
      </section>
    </>
  );
}
