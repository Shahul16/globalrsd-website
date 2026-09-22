"use client";

import type { KeyboardEvent } from "react";
import { SLIDE_DURATION_MS, type HeroSlide } from "@/lib/hero";

type HomeHeroControlsProps = {
  slides: HeroSlide[];
  activeIndex: number;
  timerKey: number;
  isAutoPlaying: boolean;
  onSelect: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
};

/**
 * Ultra-minimalist, high-corporate slide indicator.
 * Displays refined, glowing progress pills that fill smoothly with gold
 * as the slide auto-advances. All text clutter, category names, and
 * numbers have been removed for an uncluttered luxury aesthetic.
 */
export default function HomeHeroControls({
  slides,
  activeIndex,
  timerKey,
  isAutoPlaying,
  onSelect,
  onKeyDown,
}: HomeHeroControlsProps) {
  return (
    <div className="relative z-20 w-full pb-8 pt-2">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 sm:justify-start">
        <div
          className="flex items-center gap-2.5 rounded-full bg-navy/60 px-4 py-2 border border-white/10 backdrop-blur-md shadow-xl"
          role="tablist"
          aria-label="Slide navigation"
          onKeyDown={onKeyDown}
        >
          {slides.map((slide, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={slide.id || index}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelect(index)}
                aria-label={`Go to slide ${index + 1}: ${slide.headline || slide.title}`}
                className={`group relative h-1.5 rounded-full transition-all duration-500 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                  isActive
                    ? "w-12 bg-white/20"
                    : "w-6 bg-white/20 hover:w-8 hover:bg-white/45"
                }`}
              >
                {isActive && isAutoPlaying ? (
                  <span
                    key={timerKey}
                    className="block h-full w-full origin-left animate-heroProgress rounded-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.8)]"
                    style={{
                      animationDuration: `${SLIDE_DURATION_MS}ms`,
                      animationPlayState: "running",
                    }}
                  />
                ) : isActive ? (
                  <span className="block h-full w-full rounded-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
