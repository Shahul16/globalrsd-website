/** Curated Unsplash photography used across the site (free to hotlink under the Unsplash license). */

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=60`;

export const IMAGES = {
  heroConference: u("photo-1540575467063-178a50c2df87", 1600),
  aboutCampus: u("photo-1523050854058-8df90110c9f1"),
  aboutTeam: u("photo-1522202176988-66273c2fd55f"),
  awardsCeremony: u("photo-1579389083078-4e7018379f7e"),
  membershipNetwork: u("photo-1515187029135-18ee286d815b"),
  categories: {
    "Research Conferences": u("photo-1587825140708-dfaf72ae4b04", 900),
    "Skills Development Workshops": u("photo-1552664730-d307ca884978", 900),
    "Global Education": u("photo-1523580494863-6f3031224c94", 900),
  } as Record<string, string>,
  courses: {
    "Skills Development Courses": u("photo-1516321318423-f06f85e504b3", 900),
    "Skills Development Workshops": u("photo-1517245386807-bb43f82c33c4", 900),
  } as Record<string, string>,
  courseFallback: u("photo-1516321318423-f06f85e504b3", 900),
};

export function eventImage(category: string) {
  return IMAGES.categories[category] ?? IMAGES.heroConference;
}

export function courseImage(category: string) {
  return IMAGES.courses[category] ?? IMAGES.courseFallback;
}
