export type TicketTier = {
  id: string;
  name: string;
  price: number; // GBP
  includes: string[];
};

export type AgendaItem = { time: string; title: string; speaker?: string };

export type Speaker = {
  name: string;
  title: string;
  affiliation: string;
  bio: string;
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
  agenda: { day: string; items: AgendaItem[] }[];
  speakers: Speaker[];
  image?: string;
};

import eventsJson from "@/content/events.json";

export const events = eventsJson as Event[];

export function getEvent(slug: string) {
  return events.find((e) => e.slug === slug);
}

export function nextEvent(now = new Date()) {
  return [...events]
    .filter((e) => new Date(e.date) > now)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))[0] ?? events[0];
}
