export default function PageHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <section className="bg-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <p className="animate-fadeUp text-sm font-semibold uppercase tracking-widest text-gold">
          {eyebrow}
        </p>
        <h1 className="mt-3 max-w-3xl animate-fadeUp font-display text-3xl font-bold text-white sm:text-5xl" style={{ animationDelay: "120ms" }}>
          {title}
        </h1>
        {intro && (
          <p className="mt-5 max-w-2xl animate-fadeUp text-lg text-slate-300" style={{ animationDelay: "240ms" }}>
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}
