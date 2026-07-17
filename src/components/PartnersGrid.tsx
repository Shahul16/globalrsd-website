import Image from "next/image";
import Reveal from "./Reveal";

const partners = [
  { name: "University of Manchester", logo: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=200&q=80" },
  { name: "KTH Royal Institute", logo: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=200&q=80" },
  { name: "King's College London", logo: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=200&q=80" },
  { name: "Nanyang Institute", logo: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=200&q=80" },
  { name: "Aston University", logo: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=200&q=80" },
  { name: "Gulf University S&T", logo: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=200&q=80" },
];

export default function PartnersGrid() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl font-bold text-navy">Our Institutional Partners</h2>
          <p className="mt-4 text-slate-600">Collaborating with world-class universities and research bodies.</p>
        </Reveal>
        
        <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {partners.map((partner, i) => (
            <Reveal key={partner.name} delay={i * 50}>
              <div className="group flex flex-col items-center justify-center p-4 transition-all hover:-translate-y-1">
                <div className="relative h-20 w-full overflow-hidden grayscale transition-all group-hover:grayscale-0">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-full w-full object-contain"
                  />
                </div>
                <p className="mt-4 text-center text-xs font-semibold text-slate-400 group-hover:text-navy">
                  {partner.name}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
