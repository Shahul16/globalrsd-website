"use client";

import { useCallback, useEffect, useState, type FocusEvent, type KeyboardEvent } from "react";

type UseSlideshowOptions = {
  slideCount: number;
  intervalMs: number;
};

export type Slideshow = {
  activeIndex: number;
  /** Increments every time the autoplay timer restarts — restarts the timer line. */
  timerKey: number;
  isAutoPlaying: boolean;
  isUserPaused: boolean;
  prefersReducedMotion: boolean;
  goTo: (index: number) => void;
  next: () => void;
  previous: () => void;
  togglePaused: () => void;
  pauseOnHover: () => void;
  resumeAfterHover: () => void;
  handleBlur: (event: FocusEvent<HTMLElement>) => void;
  handleKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
};

/**
 * Autoplay state for the home hero slideshow.
 *
 * The slideshow runs slowly and pauses whenever the visitor shows intent to
 * read or interact: hovering the hero, focusing anything inside it, switching
 * browser tabs, or asking for reduced motion. Any manual move restarts the
 * full interval, so a slide never flickers past mid-read.
 */
export function useSlideshow({ slideCount, intervalMs }: UseSlideshowOptions): Slideshow {
  const [activeIndex, setActiveIndex] = useState(0);
  const [timerKey, setTimerKey] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isUserPaused, setIsUserPaused] = useState(false);
  const [isDocumentHidden, setIsDocumentHidden] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setPrefersReducedMotion(motionQuery.matches);
    syncMotion();
    motionQuery.addEventListener("change", syncMotion);
    return () => motionQuery.removeEventListener("change", syncMotion);
  }, []);

  useEffect(() => {
    const syncVisibility = () => setIsDocumentHidden(document.hidden);
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => document.removeEventListener("visibilitychange", syncVisibility);
  }, []);

  const closeGap = useCallback(
    (index: number) => ((index % slideCount) + slideCount) % slideCount,
    [slideCount],
  );

  const goTo = useCallback((index: number) => setActiveIndex(closeGap(index)), [closeGap]);

  const next = useCallback(() => setActiveIndex((current) => closeGap(current + 1)), [closeGap]);

  const previous = useCallback(
    () => setActiveIndex((current) => closeGap(current - 1)),
    [closeGap],
  );

  const togglePaused = useCallback(() => setIsUserPaused((paused) => !paused), []);

  const pauseOnHover = useCallback(() => setIsHovered(true), []);

  const resumeAfterHover = useCallback(() => setIsHovered(false), []);

  const handleBlur = useCallback((event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsHovered(false);
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        next();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        previous();
      }
    },
    [next, previous],
  );

  // Autoplay runs automatically and continuously, pausing only if the user explicitly pauses,
  // the browser tab is hidden, or the user requested reduced motion.
  const isAutoPlaying =
    slideCount > 1 && !isUserPaused && !isDocumentHidden && !prefersReducedMotion;

  useEffect(() => {
    if (!isAutoPlaying) return;
    // A fresh timer key resets the visible countdown to the full interval.
    setTimerKey((key) => key + 1);
    const timer = window.setTimeout(() => {
      setActiveIndex((current) => closeGap(current + 1));
    }, intervalMs);
    return () => window.clearTimeout(timer);
  }, [activeIndex, closeGap, intervalMs, isAutoPlaying]);

  return {
    activeIndex,
    timerKey,
    isAutoPlaying,
    isUserPaused,
    prefersReducedMotion,
    goTo,
    next,
    previous,
    togglePaused,
    pauseOnHover,
    resumeAfterHover,
    handleBlur,
    handleKeyDown,
  };
}
