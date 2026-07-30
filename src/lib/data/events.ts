export type TicketTier = {
  id: string;
  name: string;
  price: number; // GBP — this is the "Normal registration" price
  includes: string[];
};

export type AgendaItem = { time: string; title: string; speaker?: string };

export type Speaker = {
  name: string;
  title: string;
  affiliation: string;
  bio: string;
};

/**
 * Registration fee breakup for an event: Early Bird → Normal → (optionally)
 * Late. `lateFee` controls whether a Late Registration tier applies at
 * all — only events that need one (e.g. flagship conferences with a firm
 * cut-off) set it to true; rolling-registration events (workshops, summits)
 * leave it false and registration simply stays at the Normal price.
 */
export type RegistrationDeadlines = {
  earlyBirdEnds: string; // ISO date — Early Bird pricing applies up to and including this date
  normalEnds: string; // ISO date — Normal pricing applies up to and including this date
  lateFee: boolean; // whether a Late Registration surcharge tier applies after normalEnds
};

export type Event = {
  slug: string;
  category: "Research Conferences" | "Skills Development Workshops" | "Global Education";
  title: string;
  acronym: string;
  date: string; // ISO
  endDate: string;
  venue: string;
  city: string;
  summary: string;
  description: string;
  themes: string[];
  tickets: TicketTier[];
  registrationDeadlines?: RegistrationDeadlines;
  agenda: { day: string; items: AgendaItem[] }[];
  speakers: Speaker[];
  image?: string;
};

import eventsJson from "@/content/events.json";
import { SITE } from "@/lib/site";

export const events = eventsJson as Event[];

export function getEvent(slug: string) {
  return events.find((e) => e.slug === slug);
}

export function nextEvent(now = new Date()) {
  return [...events]
    .filter((e) => new Date(e.date) > now)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))[0] ?? events[0];
}

export type RegistrationPhase = "early" | "normal" | "late";

/**
 * Works out which registration phase an event is currently in, and the
 * price multiplier that applies to ticket prices (before the member
 * discount). Events without a `registrationDeadlines` block are always
 * priced at Normal (multiplier 1) — no breakup is shown for them.
 */
export function getRegistrationPhase(event: Event, now: Date = new Date()) {
  const rd = event.registrationDeadlines;
  const { earlyBirdDiscount, lateFeeSurcharge } = SITE.registrationPricing;

  if (!rd) {
    return { phase: "normal" as RegistrationPhase, label: "Registration", multiplier: 1 };
  }

  const t = now.getTime();
  if (t <= new Date(rd.earlyBirdEnds).getTime()) {
    return { phase: "early" as RegistrationPhase, label: "Early Bird Registration", multiplier: 1 - earlyBirdDiscount };
  }
  if (!rd.lateFee || t <= new Date(rd.normalEnds).getTime()) {
    return { phase: "normal" as RegistrationPhase, label: "Normal Registration", multiplier: 1 };
  }
  return { phase: "late" as RegistrationPhase, label: "Late Registration", multiplier: 1 + lateFeeSurcharge };
}

/** Rounded price for a ticket tier at a given registration-phase multiplier. */
export function phasePrice(basePrice: number, multiplier: number) {
  return Math.round(basePrice * multiplier);
}
