import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import Countdown from "@/components/Countdown";
import TicketSelector from "@/components/TicketSelector";
import { events, getEvent } from "@/lib/data/events";

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return {};
  return {
    title: `${event.acronym} — ${event.title}`,
    description: event.summary,
    alternates: { canonical: `/events/${event.slug}` },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();

  const dateRange =
    new Date(event.date).toDateString() === new Date(event.endDate).toDateString()
      ? new Date(event.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
      : `${new Date(event.date).toLocaleDateString("en-GB", { day: "numeric", month: "long" })} – ${new Date(event.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`;

  return (
    <>
      <section className="bg-navy text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="animate-fadeUp text-sm font-semibold uppercase tracking-widest text-gold">
              {event.category}
            </p>
            <h1 className="mt-3 max-w-3xl animate-fadeUp font-display text-3xl font-bold text-white sm:text-4xl" style={{ animationDelay: "100ms" }}>
              {event.acronym}: {event.title}
            </h1>
            <p className="mt-4 animate-fadeUp text-lg text-slate-300" style={{ animationDelay: "200ms" }}>
              {dateRange} · {event.venue}, {event.city}
            </p>
            <a href="#tickets" className="btn-gold mt-6 animate-fadeUp" style={{ animationDelay: "300ms" }}>
              Register as a Delegate
            </a>
          </div>
          <Countdown target={event.date} label={event.acronym} />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14">
        <Reveal>
          <h2 className="flourish font-display text-3xl font-bold">About the Event</h2>
          <p className="mt-6 leading-relaxed">{event.description}</p>
          <h3 className="mt-8 font-display text-xl font-bold">Themes &amp; Tracks</h3>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {event.themes.map((t) => (
              <li key={t} className="flex gap-2 text-sm leading-relaxed">
                <span aria-hidden="true" className="mt-0.5 text-gold-dark">◆</span>
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="bg-cream py-14" aria-labelledby="agenda-heading">
        <div className="mx-auto max-w-4xl px-4">
          <Reveal>
            <h2 id="agenda-heading" className="flourish font-display text-3xl font-bold">Agenda</h2>
          </Reveal>
          {event.agenda.map((day) => (
            <Reveal key={day.day}>
              <h3 className="mt-8 font-display text-xl font-bold">{day.day}</h3>
              <ol className="mt-4 space-y-0 border-l-2 border-gold/50">
                {day.items.map((item, idx) => (
                  <li key={`${item.time}-${idx}`} className="relative pb-5 pl-6">
                    <span aria-hidden="true" className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full border-2 border-gold bg-white" />
                    <p className="text-sm font-bold text-gold-dark">{item.time}</p>
                    <p className="font-medium text-navy">{item.title}</p>
                    {item.speaker && <p className="text-sm text-slate-500">{item.speaker}</p>}
                  </li>
                ))}
              </ol>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14" aria-labelledby="speakers-heading">
        <Reveal>
          <h2 id="speakers-heading" className="flourish font-display text-3xl font-bold">Keynote Speakers</h2>
        </Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {event.speakers.map((s, i) => (
            <Reveal key={s.name} delay={i * 100}>
              <div className="card flex h-full gap-5 p-6">
                <div aria-hidden="true" className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-navy font-display text-xl font-bold text-gold">
                  {s.name.split(" ").slice(-1)[0][0]}
                  {s.name.split(" ")[0][0]}
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold">{s.name}</h3>
                  <p className="text-sm font-semibold text-gold-dark">{s.title}, {s.affiliation}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.bio}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="tickets" className="bg-navy/[0.03] py-14 scroll-mt-24" aria-labelledby="tickets-heading">
        <div className="mx-auto max-w-5xl px-4">
          <Reveal>
            <h2 id="tickets-heading" className="flourish font-display text-3xl font-bold">
              Delegate Registration &amp; Tickets
            </h2>
          </Reveal>
          <div className="mt-8">
            <TicketSelector eventSlug={event.slug} tiers={event.tickets} />
          </div>
        </div>
      </section>
    </>
  );
}
