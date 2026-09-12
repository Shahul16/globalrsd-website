import { partners } from "@/lib/data/people";

export default function PartnerMarquee() {
  const row = [...partners, ...partners]; // duplicated for seamless loop
  return (
    <div className="overflow-hidden border-y border-slate-200 bg-cream py-6" aria-label="Partner institutions">
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap px-6">
        {row.map((p, i) => (
          <span
            key={`${p}-${i}`}
            aria-hidden={i >= partners.length}
            className="font-display text-lg font-semibold tracking-wide text-navy/50"
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}
