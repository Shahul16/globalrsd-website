import fs from "fs";
import path from "path";
import Image from "next/image";
import { SITE } from "@/lib/site";

/**
 * Accreditation trust badges: CPD Provider · ICO Registered · UKRLP Registered.
 *
 * Artwork rules:
 * - By default each badge renders a brand-styled emblem (original SVG, drawn
 *   in-house — NOT a copy of any body's trademark).
 * - When the official logo pack is received from an accrediting body, drop the
 *   file at /public/accreditations/cpd.png (or ico.png / ukrlp.png — .png/.svg/
 *   .webp/.jpg all work) and it is used automatically, no code change needed.
 * - Registration numbers come from SITE.registrations in src/lib/site.ts.
 */

type BadgeKey = "cpd" | "ico" | "ukrlp";
const ORDER: BadgeKey[] = ["cpd", "ico", "ukrlp"];
const EXTENSIONS = ["png", "svg", "webp", "jpg"];

function officialLogo(key: BadgeKey): string | null {
  try {
    for (const ext of EXTENSIONS) {
      const rel = `/accreditations/${key}.${ext}`;
      if (fs.existsSync(path.join(process.cwd(), "public", rel))) return rel;
    }
  } catch {
    /* filesystem unavailable — fall back to emblem */
  }
  return null;
}

function Emblem({ badge, dark }: { badge: BadgeKey; dark: boolean }) {
  const ring = "#C9A227";
  const face = dark ? "#0E1730" : "#14213D";
  const icon =
    badge === "cpd" ? (
      // Certificate / ribbon
      <g stroke={ring} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="17" y="18" width="30" height="22" rx="2.5" />
        <path d="M22 25h20M22 30h14" />
        <circle cx="40" cy="41" r="6.5" fill={face} />
        <path d="M37 46l-2 8 5-3 5 3-2-8" fill={face} />
        <circle cx="40" cy="41" r="6.5" />
      </g>
    ) : badge === "ico" ? (
      // Shield + padlock (data protection)
      <g stroke={ring} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 14l15 5v11c0 10-6.5 16.5-15 20-8.5-3.5-15-10-15-20V19l15-5z" />
        <rect x="26" y="30" width="12" height="10" rx="1.8" />
        <path d="M28.5 30v-3.2a3.5 3.5 0 017 0V30" />
      </g>
    ) : (
      // Registry ledger + UK check
      <g stroke={ring} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 16h18a5 5 0 015 5v27H25a5 5 0 01-5-5V16z" />
        <path d="M43 21h3v27H26" />
        <path d="M26 26h11M26 32h8" />
        <path d="M27 41.5l3.5 3.5 6.5-6.5" />
      </g>
    );
  return (
    <svg viewBox="0 0 64 64" width="56" height="56" role="img" aria-hidden="true" className="shrink-0">
      <circle cx="32" cy="32" r="30" fill={face} stroke={ring} strokeWidth="2.4" />
      <circle cx="32" cy="32" r="25.5" fill="none" stroke={ring} strokeWidth="0.9" opacity="0.55" />
      {icon}
    </svg>
  );
}

export default function TrustBadges({
  variant = "light",
  heading,
}: {
  /** "light" for cream/white sections, "dark" for the footer */
  variant?: "light" | "dark";
  heading?: string;
}) {
  const dark = variant === "dark";
  return (
    <div>
      {heading && (
        <p
          className={`mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] ${
            dark ? "text-slate-500" : "text-slate-400"
          }`}
        >
          {heading}
        </p>
      )}
      <ul className="flex flex-wrap items-stretch justify-center gap-4 sm:gap-6">
        {ORDER.map((key) => {
          const reg = SITE.registrations[key];
          const logo = officialLogo(key);
          return (
            <li
              key={key}
              className={`flex min-w-[240px] max-w-xs flex-1 items-center gap-4 rounded-xl border px-5 py-4 ${
                dark
                  ? "border-white/10 bg-white/[0.04]"
                  : "border-slate-200 bg-white shadow-sm"
              }`}
            >
              {logo ? (
                <Image
                  src={logo}
                  alt={`${reg.name} — official logo`}
                  width={56}
                  height={56}
                  unoptimized
                  className="h-14 w-14 shrink-0 object-contain"
                />
              ) : (
                <Emblem badge={key} dark={dark} />
              )}
              <div className="min-w-0">
                <p className={`font-display text-sm font-bold ${dark ? "text-white" : "text-navy"}`}>
                  {reg.name}
                </p>
                <p className={`mt-0.5 text-xs leading-snug ${dark ? "text-slate-400" : "text-slate-500"}`}>
                  {reg.body}
                </p>
                {reg.number && (
                  <p className={`mt-1 text-xs font-semibold tracking-wide ${dark ? "text-gold" : "text-gold-dark"}`}>
                    Reg. No. {reg.number}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
