/**
 * Shared contract for the home page hero slideshow.
 * The constants live here so the autoplay timer, progress indicator,
 * and image drift animation remain perfectly synchronized.
 */

export type SlideCta = {
  label: string;
  href: string;
};

export type HeroSlide = {
  id: string;
  /** Short label for the bottom navigation tab */
  tabTitle: string;
  /** Contextual category/location badge */
  eyebrow: string;
  /** Primary headline line 1 (e.g., "Advancing Research.") */
  headline: string;
  /** Secondary headline line 2 styled in gold (e.g., "International Conferences") */
  highlight: string;
  /** Comprehensive editorial description */
  description: string;
  /** Primary button */
  primaryCta: SlideCta;
  /** Secondary button */
  secondaryCta: SlideCta;
  /** Card renderer identifier for the right-hand spotlight */
  cardType: "conference" | "course" | "award" | "membership" | "workshop" | "partnership";
  /** Background photograph */
  image: string;
  /** Outline SVG path data for the tab icon */
  icon: string;
  /** Primary title used for cards and 'What We Do' section */
  title: string;
  /** Primary URL */
  href: string;
  /** Legacy CTA field */
  cta?: string;
};

/**
 * Slide display duration — 7.5 seconds ensures continuous, professional,
 * and dignified automatic slide transitions.
 */
export const SLIDE_DURATION_MS = 7500;

/** Background photo crossfade length */
export const CROSSFADE_MS = 1200;

/** Content panel and card crossfade transition */
export const PANEL_FADE_MS = 800;

/** Slow cinematic drift for the active background photograph */
export const KEN_BURNS_MS = SLIDE_DURATION_MS + 2500;
