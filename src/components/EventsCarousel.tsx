"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Event } from "@/lib/data/events";
import { eventImage } from "@/lib/images";

/** Auto-advancing, scroll-snap events carousel with arrow controls (pauses on hover/focus). */
export default function EventsCarousel({ events }: { events: Event[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  function scrollByCard(dir: 1 | -1) {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 24 : 360;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
    else el.scrollBy({ left: step * dir, behavior: "smooth" });
  }

  useEffect(() => {
    if (paused) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = setInterval(() => scrollByCard(1), 4500);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        ref={track}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Upcoming events carousel"
      >
        {events.map((e) => (
          <Link
            key={e.slug}
            data-card
            href={`/events/${e.slug}`}
            className="group block w-[85%] shrink-0 snap-start overflow-hidden rounded-lg border border-white/10 bg-white/5 transition duration-300 hover:-translate-y-1.5 hover:border-gold/60 hover:bg-white/10 hover:shadow-2xl sm:w-[46%] lg:w-[31%]"
          >
            <div className="img-zoom relative h-44">
              <img src={e.image ?? eventImage(e.category)} alt="" loading="lazy" />
              <span className="absolute left-3 top-3 rounded bg-navy/85 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-gold backdrop-blur-sm">
                {e.category}
              </span>
              <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded bg-black/50 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>
                {e.city}
              </span>
            </div>
            <div className="p-6">
              <p className="text-sm font-semibold text-gold">
                {new Date(e.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </p>
              <h3 className="mt-2 font-display text-xl font-bold text-white group-hover:text-gold-light">
                {e.acronym}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-slate-300">{e.summary}</p>
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-sm text-gold">From £{Math.min(...e.tickets.map((t) => t.price))}</span>
                <span className="text-sm font-semibold text-white underline-offset-4 group-hover:underline">
                  View details →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-2 flex justify-center gap-3">
        <button
          onClick={() => scrollByCard(-1)}
          aria-label="Previous events"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white transition hover:border-gold hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button
          onClick={() => scrollByCard(1)}
          aria-label="Next events"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white transition hover:border-gold hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  );
}
