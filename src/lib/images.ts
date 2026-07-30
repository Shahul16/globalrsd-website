/** Local brand imagery — no external dependencies, always loads. */

export const IMAGES = {
  heroConference: "/hero.jpg",
  aboutCampus: "/about-feature.jpg",
  aboutTeam: "/about-feature.jpg",
  awardsCeremony: "/awards.jpg",
  membershipNetwork: "/membership.jpg",
};

/** Fallbacks when an item has no explicit image field. */
export function eventImage(category?: string) {
  void category;
  return IMAGES.heroConference;
}
export function courseImage(category?: string) {
  void category;
  return "/co-generic.jpg";
}
