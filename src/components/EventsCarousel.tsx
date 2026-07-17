"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { eventImage } from "@/lib/images";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Event {
  slug: string;
  category: string;
  acronym: string;
  summary: string;
  date: string;
  city: string;
  tickets: { price: number }[];
}

interface EventsCarouselProps {
  events: Event[];
}

export default function EventsCarousel({ events }: EventsCarouselProps) {
  return (
    <div className="relative mt-10">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true, dynamicBullets: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="pb-12"
      >
        {events.map((e) => (
          <SwiperSlide key={e.slug} className="h-auto">
            <Link href={`/events/${e.slug}`} className="group block h-full overflow-hidden rounded-lg border border-white/10 bg-white/5 transition hover:-translate-y-1.5 hover:border-gold/60 hover:bg-white/10 hover:shadow-2xl duration-300">
              <div className="img-zoom h-40">
                <img src={eventImage(e.category)} alt="" loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-gold">{e.category}</p>
                <h3 className="mt-3 font-display text-xl font-bold text-white group-hover:text-gold-light">{e.acronym}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-slate-300">{e.summary}</p>
                <p className="mt-4 text-sm font-medium text-slate-200">
                  {new Date(e.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} · {e.city}
                </p>
                <p className="mt-1 text-sm text-gold">From £{Math.min(...e.tickets.map((t) => t.price))}</p>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
