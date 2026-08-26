"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Gauge, Star, Clock } from "lucide-react";

export type FeaturedMachine = {
  id: string;
  title: string;
  description: string;
  price: number;
  hours: number;
  location: string;
  images: string[];
  visibility_tier?: string;
  usage_type?: string;
  is_urgent?: boolean;
  currency?: string;
};

export function FeaturedCarousel({ 
  featuredMachines, 
  title = "Máquinas Destacadas",
  className = "-mt-12 mb-16"
}: { 
  featuredMachines: FeaturedMachine[];
  title?: string;
  className?: string;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollTo = (index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const slideWidth = container.scrollWidth / featuredMachines.length;
    container.scrollTo({ left: slideWidth * index, behavior: "smooth" });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const slideWidth = container.scrollWidth / featuredMachines.length;
      const newIndex = Math.round(container.scrollLeft / slideWidth);
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < featuredMachines.length) {
        setActiveIndex(newIndex);
      }
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeIndex, featuredMachines.length]);

  return (
    <section className={`py-12 md:py-20 bg-gray-50 text-brand-black relative z-20 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] rounded-[3rem] mx-4 md:mx-8 xl:mx-16 border border-gray-200 overflow-hidden ${className}`}>
      <div className="container mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8 md:mb-10">
          <div className="w-1 h-8 bg-brand-yellow rounded-full" />
          <span className="text-brand-black uppercase tracking-[0.2em] text-sm font-bold">{title}</span>
        </div>

        {/* Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 gap-5 md:gap-6 hide-scrollbar"
        >
          {featuredMachines.map((fm) => (
            <div
              key={fm.id}
              className={`min-w-[80vw] sm:min-w-[420px] md:min-w-[560px] lg:min-w-[680px] max-w-[680px] shrink-0 snap-center bg-white rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col ${
                fm.is_urgent
                  ? "border-2 border-brand-yellow ring-4 ring-brand-yellow/15 shadow-[0_0_25px_rgba(250,204,21,0.15)]"
                  : "border border-gray-100"
              }`}
            >
              {/* ── IMAGE: fixed 16:9 ratio, always looks clean ── */}
              <div className="relative w-full aspect-video overflow-hidden bg-gray-200">
                <Image
                  src={fm.images?.[0] || "/zoomlion.png"}
                  alt={fm.title}
                  fill
                  sizes="(max-width: 640px) 80vw, (max-width: 1024px) 560px, 680px"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  priority
                />
                {/* Dark gradient at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Top badges */}
                <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 z-10">
                  <div className="flex flex-col gap-1.5">
                    {fm.visibility_tier === "oro" && (
                      <span className="inline-flex items-center gap-1.5 bg-amber-500 text-black font-black text-[10px] px-2.5 py-1 rounded-lg shadow uppercase tracking-wider border border-amber-300">
                        <Star className="w-3 h-3 fill-black" /> Vendedor Verificado
                      </span>
                    )}
                    {fm.visibility_tier === "plata" && (
                      <span className="inline-flex items-center gap-1.5 bg-sky-400 text-black font-black text-[10px] px-2.5 py-1 rounded-lg shadow uppercase tracking-wider">
                        <Star className="w-3 h-3 fill-black" /> Oportunidad
                      </span>
                    )}
                  </div>
                  {fm.is_urgent && (
                    <span className="inline-flex items-center bg-red-600 text-white font-black text-[10px] px-2.5 py-1 rounded-full shadow-[0_0_12px_rgba(220,38,38,0.7)] animate-pulse border border-red-400 uppercase tracking-wider">
                      Venta Urgente
                    </span>
                  )}
                </div>

                {/* Bottom: price + location */}
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-10 gap-2">
                  {fm.location && (
                    <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full border border-white/10 truncate max-w-[55%]">
                      <MapPin className="w-3 h-3 text-brand-yellow shrink-0" />
                      {fm.location}
                    </span>
                  )}
                  {fm.price > 0 && (
                    <span className={`ml-auto font-black text-sm px-3 py-1 rounded-full text-white shadow-lg ${fm.is_urgent ? "bg-red-600" : "bg-brand-black/85 backdrop-blur"}`}>
                      {fm.currency === "USD" ? "US$" : "$"}
                      {Number(fm.price).toLocaleString("es-CO")}
                      {fm.currency === "USD" ? " USD" : ""}
                    </span>
                  )}
                </div>
              </div>

              {/* ── CONTENT ── */}
              <div className="p-5 sm:p-6 flex flex-col flex-1 gap-3">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold leading-snug text-brand-black line-clamp-2">
                  {fm.title}
                </h2>

                {fm.hours > 0 && (
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {fm.hours.toLocaleString()} {fm.usage_type === "km" ? "kilómetros" : "horas de uso"}
                  </div>
                )}

                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1">
                  {fm.description || "Equipo de alto rendimiento listo para trabajar en tu proyecto."}
                </p>

                {/* Buttons */}
                <div className="flex gap-3 pt-1">
                  <a
                    href={`https://wa.me/573054265677?text=Hola,%20quiero%20más%20información%20sobre%20${encodeURIComponent(fm.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-brand-yellow text-brand-black font-bold py-2.5 px-4 rounded-xl hover:bg-yellow-400 transition-all text-sm shadow-md shadow-brand-yellow/20"
                  >
                    Consultar <ArrowRight className="w-4 h-4" />
                  </a>
                  <Link
                    href={`/maquina/${fm.id}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 border border-gray-200 text-brand-black hover:bg-gray-200 font-bold py-2.5 px-4 rounded-xl transition-all text-sm"
                  >
                    Ver detalles
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots — desktop */}
        {featuredMachines.length > 1 && (
          <div className="hidden md:flex justify-center items-center gap-2 mt-4">
            {featuredMachines.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Ir a máquina destacada ${i + 1}`}
                className={`transition-all duration-300 rounded-full h-2.5 ${
                  activeIndex === i ? "w-7 bg-brand-yellow" : "w-2.5 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}

        {/* Dots — mobile */}
        {featuredMachines.length > 1 && (
          <div className="md:hidden flex justify-center items-center gap-2 mt-4">
            {featuredMachines.map((_, i) => (
              <div
                key={i}
                className={`transition-all duration-300 rounded-full h-2 ${
                  activeIndex === i ? "w-6 bg-brand-yellow" : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
