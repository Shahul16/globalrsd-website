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

