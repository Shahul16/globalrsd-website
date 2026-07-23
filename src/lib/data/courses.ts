export type Course = {
  slug: string;
  title: string;
  level: "Foundation" | "Intermediate" | "Advanced";
  duration: string;
  effort: string;
  price: number; // GBP
  category: string;
  summary: string;
  description: string;
  syllabus: { module: string; topics: string[] }[];
  support: string[];
  assessment: string[];
  certification: string;
  image?: string;
};

import coursesJson from "@/content/courses.json";

export const courses = coursesJson as Course[];

export function getCourse(slug: string) {
  return courses.find((c) => c.slug === slug);
}
