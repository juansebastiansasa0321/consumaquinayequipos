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
            <Link
              key={fm.id}
              href={`/maquina/${fm.id}`}
              className={`group flex flex-col
                w-[85vw] max-w-[320px] shrink-0 snap-center
                sm:min-w-[420px] sm:max-w-[560px]
                md:min-w-[560px] md:max-w-[680px]
                bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl
                ${fm.is_urgent
                  ? "border-2 border-brand-yellow ring-4 ring-brand-yellow/20 shadow-brand-yellow/10"
                  : "border border-gray-100 hover:border-brand-yellow/40"
                }`}
            >
              {/* Imagen — igual que el catálogo: aspect-[4/3] */}
              <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                {fm.images?.[0] ? (
                  <Image
                    src={fm.images[0]}
                    alt={fm.title}
                    fill
                    sizes="(max-width: 640px) 85vw, (max-width: 1024px) 560px, 680px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Sin imagen</div>
                )}

                {/* Urgente */}
                {fm.is_urgent && (
                  <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] md:text-xs font-black px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.6)] animate-pulse border border-red-400 z-10">
                    VENTA URGENTE
                  </div>
                )}

                {/* Tier badge */}
                {fm.visibility_tier === "oro" && (
                  <div className="absolute top-3 left-3 bg-amber-500 text-black text-[10px] md:text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-yellow-300 z-10">
                    <Star className="w-3.5 h-3.5 fill-black" /> Vendedor Verificado
                  </div>
                )}
                {fm.visibility_tier === "plata" && (
                  <div className="absolute top-3 left-3 bg-sky-500 text-white text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-sky-400 z-10">
                    Oportunidad
                  </div>
                )}

                {/* Precio sobre imagen */}
                {fm.price > 0 && (
                  <div className={`absolute bottom-3 left-3 text-white text-xs md:text-sm font-black px-3 py-1.5 rounded-full z-10 ${fm.is_urgent ? "bg-red-600" : "bg-brand-black/75 backdrop-blur"}`}>
                    {fm.currency === "USD" ? "US$" : "$"}{Number(fm.price).toLocaleString("es-CO")}{fm.currency === "USD" ? " USD" : ""}
                  </div>
                )}
              </div>

              {/* Contenido — igual que el catálogo */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-base font-bold mb-2 group-hover:text-brand-yellow transition-colors line-clamp-2">
                  {fm.title}
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mb-4">
                  {fm.location && (
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {fm.location}</span>
                  )}
                  {fm.hours > 0 && (
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {fm.hours.toLocaleString()}{fm.usage_type === "km" ? " km" : "h"}</span>
                  )}
                </div>
                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="font-black text-lg text-brand-black">
                    {fm.price ? `${fm.currency === "USD" ? "US$" : "$"}${Number(fm.price).toLocaleString("es-CO")}${fm.currency === "USD" ? " USD" : ""}` : "Consultar precio"}
                  </span>
                  <span className="text-xs font-bold text-brand-yellow group-hover:underline">Ver detalles →</span>
                </div>
              </div>
            </Link>
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
