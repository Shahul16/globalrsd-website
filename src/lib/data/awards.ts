import awardsJson from "@/content/awards.json";

export type Award = {
  id: string;
  type: "Individual" | "Institutional";
  name: string;
  track: string;
  description: string;
};

export const awards = awardsJson as Award[];

export const individualAwards = awards.filter((a) => a.type === "Individual");
export const institutionalAwards = awards.filter((a) => a.type === "Institutional");

/** Key dates for the current awards cycle (editable here). */
export const awardsTimeline = [
  { date: "1 August 2026", label: "Nominations open" },
  { date: "30 September 2026", label: "Nomination deadline" },
  { date: "October 2026", label: "Independent panel review & shortlisting" },
  { date: "November 2026", label: "Finalists notified" },
  { date: "29 November 2026", label: "Awards ceremony · ICMDR 2026, Chennai" },
];
