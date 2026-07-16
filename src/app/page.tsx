import Link from "next/link";
import Image from "next/image";
import Countdown from "@/components/Countdown";
import CountUp from "@/components/CountUp";
import PartnerMarquee from "@/components/PartnerMarquee";
import Reveal from "@/components/Reveal";
import { nextEvent, events } from "@/lib/data/events";
import { courses } from "@/lib/data/courses";
import { SITE } from "@/lib/site";
import { IMAGES, eventImage, courseImage } from "@/lib/images";

const services = [
  {
    title: "Research Conferences",
    href: "/events",
    description: "Peer-reviewed international conferences with publication pathways in indexed journals.",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  },
  {
    title: "Skills Workshops",
    href: "/events",
    description: "Intensive, small-group workshops led by practitioners — from academic writing to data analysis.",
    icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  },
  {
    title: "Online Courses",
    href: "/courses",
    description: "Tutor-supported certified courses in research methods, data, writing and leadership.",
    icon: "M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342",
  },
  {
    title: "Global Awards",
    href: "/awards",
    description: "Recognising outstanding individuals and institutions across academia and industry.",
    icon: "M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0",
  },
  {
    title: "Membership",
    href: "/membership",
    description: "Join a global community with discounts, mentoring and members-only briefings.",
    icon: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z",
  },
  {
    title: "Global Education",
    href: "/events",
    description: "Summits and partnership programmes for international education and student mobility.",
    icon: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418",
  },
];

export default function HomePage() {
  const upcoming = nextEvent();
  const featuredEvents = events.slice(0, 3);
  const featuredCourses = courses.slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy text-white">
        <img
          src={IMAGES.heroConference}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.14]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-navy via-navy/90 to-navy-dark/80"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 animate-float rounded-full bg-gold/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 animate-float rounded-full bg-gold/10 blur-3xl"
          style={{ animationDelay: "2s" }}
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:py-28 lg:grid-cols-2">
          <div>
            <p className="animate-fadeUp text-sm font-semibold uppercase tracking-widest text-gold">
              Est. London · Serving {SITE.stats.countries} countries
            </p>
            <h1 className="mt-4 animate-fadeUp font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl" style={{ animationDelay: "120ms" }}>
              Advancing Research.
              <br />
              <span className="text-gold">Developing Skills.</span>
            </h1>
            <p className="mt-6 max-w-xl animate-fadeUp text-lg leading-relaxed text-slate-300" style={{ animationDelay: "240ms" }}>
              The Global Institute of Research &amp; Skills Development unites
              scholars and professionals through international conferences,
              certified courses, global awards and a thriving membership
              community.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 animate-fadeUp" style={{ animationDelay: "360ms" }}>
              <Link href={`/events/${upcoming.slug}`} className="btn-gold">
                Book Conference Tickets
              </Link>
              <Link
                href="/membership"
                className="inline-flex items-center justify-center rounded-md border-2 border-gold px-5 py-2.5 font-semibold text-gold transition hover:bg-gold hover:text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Become a Member
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-start gap-8 lg:items-end">
            <Image
              src="/logo.svg"
              alt="GIRSD heraldic crest"
              width={152}
              height={180}
              priority
              unoptimized
              className="hidden animate-shimmer lg:block"
            />
            <Countdown target={upcoming.date} label={upcoming.acronym} />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-slate-200 bg-cream">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 text-center md:grid-cols-4">
          {[
            { end: SITE.stats.members, suffix: "+", label: "Members worldwide" },
            { end: SITE.stats.conferences, suffix: "", label: "Conferences delivered" },
            { end: SITE.stats.countries, suffix: "", label: "Countries represented" },
            { end: SITE.stats.papers, suffix: "+", label: "Papers presented" },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-display text-4xl font-bold text-navy">
                <CountUp end={s.end} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-sm font-medium text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <Reveal className="text-center">
          <h2 className="flourish font-display text-3xl font-bold sm:text-4xl">What We Do</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Six programmes, one purpose: connecting rigorous research with
            practical capability for academics, students and industry.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 80}>
              <Link href={s.href} className="card card-lift group block h-full p-6">
                <span className="inline-flex rounded-lg bg-navy p-3 text-gold transition group-hover:bg-gold group-hover:text-navy">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={s.icon} />
                  </svg>
                </span>
                <h3 className="mt-4 font-display text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.description}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-gold-dark group-hover:underline">
                  Learn more →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="bg-navy py-20 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Upcoming Events</h2>
              <p className="mt-2 text-slate-300">Conferences, workshops and summits open for registration.</p>
            </div>
            <Link href="/events" className="btn-gold">View all events</Link>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featuredEvents.map((e, i) => (
              <Reveal key={e.slug} delay={i * 100}>
                <Link href={`/events/${e.slug}`} className="group block h-full overflow-hidden rounded-lg border border-white/10 bg-white/5 transition hover:-translate-y-1.5 hover:border-gold/60 hover:bg-white/10 hover:shadow-2xl duration-300">
                  <div className="img-zoom h-40">
                    <img src={eventImage(e.category)} alt="" loading="lazy" />
                  </div>
                  <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gold">{e.category}</p>
                  <h3 className="mt-3 font-display text-xl font-bold text-white group-hover:text-gold-light">{e.acronym}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-300">{e.summary}</p>
                  <p className="mt-4 text-sm font-medium text-slate-200">
                    {new Date(e.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} · {e.city}
                  </p>
                  <p className="mt-1 text-sm text-gold">From £{Math.min(...e.tickets.map((t) => t.price))}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COURSES TEASER */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Featured Courses</h2>
            <p className="mt-2 text-slate-600">Certified, tutor-supported online learning.</p>
          </div>
          <Link href="/courses" className="btn-navy">Browse all courses</Link>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {featuredCourses.map((c, i) => (
            <Reveal key={c.slug} delay={i * 100}>
              <Link href={`/courses/${c.slug}`} className="card card-lift group block h-full overflow-hidden">
                <div className="img-zoom h-40">
                  <img src={courseImage(c.category)} alt="" loading="lazy" />
                </div>
                <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-gold-dark">{c.category} · {c.level}</p>
                <h3 className="mt-3 font-display text-xl font-bold group-hover:text-gold-dark">{c.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-slate-600">{c.summary}</p>
                <p className="mt-4 text-sm text-slate-500">{c.duration} · {c.effort}</p>
                <p className="mt-1 font-display text-lg font-bold text-navy">£{c.price}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PARTNERS */}
      <PartnerMarquee />

      {/* PRIMARY CTA */}
      <section className="bg-gradient-to-br from-navy to-navy-light py-20 text-center text-white">
        <Reveal className="mx-auto max-w-3xl px-4">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Join a Global Community of Researchers &amp; Professionals
          </h2>
          <p className="mt-4 text-lg text-slate-300">
            Members enjoy a 30% discount on every conference ticket, course
            discounts, mentoring and more — from just £49 a year.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/membership" className="btn-gold">Explore Membership</Link>
            <Link href="/contact" className="inline-flex items-center rounded-md border-2 border-white/60 px-5 py-2.5 font-semibold text-white transition hover:border-gold hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">
              Talk to Us
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
