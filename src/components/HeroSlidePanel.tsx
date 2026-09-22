"use client";

import Link from "next/link";
import HeroCard from "@/components/HeroCard";
import { PANEL_FADE_MS, type HeroSlide } from "@/lib/hero";

type HeroSlidePanelProps = {
  slide: HeroSlide;
  index: number;
  total: number;
  isActive: boolean;
  upcomingEvent?: {
    date: string;
    acronym: string;
    title: string;
    slug: string;
  };
};

/**
 * Renders a complete editorial slide featuring the left-hand typography
 * and calls to action alongside the right-hand spotlight card (e.g. countdown,
 * course highlights, or membership perks).
 */
export default function HeroSlidePanel({
  slide,
  index,
  total,
  isActive,
  upcomingEvent,
}: HeroSlidePanelProps) {
  const primary = slide.primaryCta || { label: slide.cta || "Learn More", href: slide.href || "/" };
  const secondary = slide.secondaryCta || { label: "Talk to us", href: "/contact" };

  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${total}: ${slide.headline} ${slide.highlight}`}
      aria-hidden={!isActive}
      className={`${
        isActive
          ? "relative z-10 opacity-100 translate-y-0 pointer-events-auto"
          : "absolute inset-0 z-0 opacity-0 translate-y-4 pointer-events-none"
      } transition-[opacity,transform] ease-out duration-700`}
      style={{ transitionDuration: `${PANEL_FADE_MS}ms` }}
    >
      <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
        {/* Left column: Typography & CTAs */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-gold backdrop-blur-sm sm:text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
            {slide.eyebrow}
          </div>

          <h1 className="mt-5 font-display text-3xl font-bold leading-[1.15] text-white sm:text-4xl lg:text-5xl">
            {slide.headline}
            <br />
            <span className="text-gold">{slide.highlight}</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
            {slide.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 sm:mt-9">
            <Link
              href={primary.href}
              tabIndex={isActive ? 0 : -1}
              className="btn-gold focus-visible:ring-offset-navy shadow-lg shadow-gold/20"
              aria-label={`${primary.label} — ${slide.headline}`}
            >
              {primary.label}
            </Link>

            <Link
              href={secondary.href}
              tabIndex={isActive ? 0 : -1}
              className="inline-flex items-center justify-center rounded-md border-2 border-white/70 px-5 py-2.5 font-semibold text-white transition-colors hover:border-gold hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
            >
              {secondary.label}
            </Link>
          </div>
        </div>

        {/* Right column: Dynamic contextual spotlight card */}
        <div className="w-full max-w-md lg:ml-auto">
          <HeroCard slide={slide} upcomingEvent={upcomingEvent} />
        </div>
      </div>
    </div>
  );
}
