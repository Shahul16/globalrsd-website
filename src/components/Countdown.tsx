"use client";

import { useEffect, useState } from "react";

function diff(target: string) {
  const ms = Math.max(0, +new Date(target) - Date.now());
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor(ms / 3_600_000) % 24,
    minutes: Math.floor(ms / 60_000) % 60,
    seconds: Math.floor(ms / 1_000) % 60,
  };
}

export default function Countdown({ target, label }: { target: string; label: string }) {
  const [t, setT] = useState<ReturnType<typeof diff> | null>(null);

  useEffect(() => {
    setT(diff(target));
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const cells = [
    { value: t?.days, unit: "Days" },
    { value: t?.hours, unit: "Hours" },
    { value: t?.minutes, unit: "Minutes" },
    { value: t?.seconds, unit: "Seconds" },
  ];

  return (
    <div aria-label={`Countdown to ${label}`}>
      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">
        Next conference · {label}
      </p>
      <div className="flex gap-3 sm:gap-4" role="timer">
        {cells.map((c) => (
          <div
            key={c.unit}
            className="w-16 rounded-lg border border-gold/40 bg-white/5 py-3 text-center backdrop-blur-sm sm:w-20"
          >
            <span className="block font-display text-2xl font-bold text-white tabular-nums sm:text-3xl">
              {c.value === undefined ? "–" : String(c.value).padStart(2, "0")}
            </span>
            <span className="mt-1 block text-[10px] uppercase tracking-wider text-slate-300 sm:text-xs">
              {c.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
