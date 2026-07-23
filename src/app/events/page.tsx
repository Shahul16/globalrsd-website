import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { events } from "@/lib/data/events";
import { eventImage } from "@/lib/images";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Explore Globalrsd's research conferences, skills development workshops and global education summits. Delegate registration and tickets from £99.",
  alternates: { canonical: "/events" },
};

const CATEGORIES = [
  {
    name: "Research Conferences",
    blurb:
      "Recurring peer-reviewed international conferences with publication pathways, keynotes and doctoral symposia.",
  },
  {
    name: "Skills Development Workshops",
    blurb:
      "Intensive small-group workshops led by practitioners, with certificates and follow-up support.",
  },
  {
    name: "Global Education",
    blurb:
      "Summits and programmes for international education, student mobility and institutional partnership.",
  },
] as const;

export default function EventsPage() {
  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Conferences, Workshops & Summits"
        intro="Register as a delegate, present your research or exhibit your organisation. Globalrsd members save 30% on every ticket."
      />

      {CATEGORIES.map((cat, ci) => {
        const list = events.filter((e) => e.category === cat.name);
        return (
          <section
            key={cat.name}
            className={ci % 2 ? "bg-cream py-16" : "py-16"}
            aria-labelledby={`cat-${ci}`}
          >
            <div className="mx-auto max-w-7xl px-4">
              <Reveal>
                <h2 id={`cat-${ci}`} className="font-display text-3xl font-bold">
                  {cat.name}
                </h2>
                <p className="mt-2 max-w-2xl text-slate-600">{cat.blurb}</p>
              </Reveal>
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {list.map((e, i) => (
                  <Reveal key={e.slug} delay={i * 100}>
                    <Link href={`/events/${e.slug}`} className="card card-lift group flex h-full flex-col overflow-hidden">
                      <div className="img-zoom h-44">
                        <img src={e.image ?? eventImage(e.category)} alt="" loading="lazy" />
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded bg-navy px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-gold">
                          {e.acronym}
                        </span>
                        <span className="text-sm font-medium text-slate-500">
                          {new Date(e.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                        </span>
                      </div>
                      <h3 className="mt-3 font-display text-xl font-bold group-hover:text-gold-dark">
                        {e.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{e.summary}</p>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
                        <span className="text-sm text-slate-500">{e.venue}, {e.city}</span>
                        <span className="font-semibold text-navy">
                          From £{Math.min(...e.tickets.map((t) => t.price))}
                        </span>
                      </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
