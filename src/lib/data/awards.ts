import awardsJson from "@/content/awards.json";

export type Award = {
  id: string;
  type: "Individual" | "Institutional";
  name: string;
  track: string;
  description: string;
};

export type AwardCategory = {
  category: string;
  awards: Award[];
};

export const awardCategories = awardsJson as AwardCategory[];
export const awards = awardCategories.flatMap(({ awards: categoryAwards }) => categoryAwards);

export const individualAwards = awards.filter((a) => a.type === "Individual");
export const institutionalAwards = awards.filter((a) => a.type === "Institutional");

/** Fixed annual awards cycle (editable here). */
export const awardCycles = [
  { cycle: "Award 1", month: "February", interval: "Start" },
  { cycle: "Award 2", month: "May", interval: "+3 months" },
  { cycle: "Award 3", month: "August", interval: "+3 months" },
  { cycle: "Award 4", month: "November", interval: "+3 months" },
];
