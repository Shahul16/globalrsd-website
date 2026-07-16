"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/** Branded full-screen loader shown on first paint, fades out once the page is ready. */
export default function LoadingScreen() {
  const [hidden, setHidden] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const finish = () => setHidden(true);
    if (document.readyState === "complete") {
      const t = setTimeout(finish, 400);
      return () => clearTimeout(t);
    }
    window.addEventListener("load", finish);
    const failsafe = setTimeout(finish, 2200);
    return () => {
      window.removeEventListener("load", finish);
      clearTimeout(failsafe);
    };
  }, []);

  useEffect(() => {
    if (!hidden) return;
    const t = setTimeout(() => setGone(true), 650);
    return () => clearTimeout(t);
  }, [hidden]);

  if (gone) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-navy transition-opacity duration-500 ${
        hidden ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <Image
        src="/logo.svg"
        alt=""
        width={110}
        height={131}
        priority
        unoptimized
        className="animate-shimmer"
      />
      <p className="mt-6 font-display text-xl font-bold tracking-widest text-gold">GIRSD</p>
      <div className="mt-5 h-1 w-40 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-1/2 animate-loaderbar rounded-full bg-gold" />
      </div>
    </div>
  );
}
