"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Gauge, Star } from "lucide-react";

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

  // Function to handle dot clicks
  const scrollTo = (index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    
    // We assume all children have the same width and snap naturally
    const slideWidth = container.scrollWidth / featuredMachines.length;
    container.scrollTo({ left: slideWidth * index, behavior: "smooth" });
  };

  // Function to listen to horizontal scroll and update active dot
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollPosition = container.scrollLeft;
      const slideWidth = container.scrollWidth / featuredMachines.length;
      
      // Calculate which slide is currently most visible
      const newIndex = Math.round(scrollPosition / slideWidth);
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < featuredMachines.length) {
        setActiveIndex(newIndex);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeIndex, featuredMachines.length]);

  return (
    <section className={`py-16 md:py-24 bg-gray-50 text-brand-black relative z-20 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] rounded-[3rem] mx-4 md:mx-8 xl:mx-16 border border-gray-200 overflow-hidden ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8 md:mb-12">
          <div className="w-1 h-8 bg-brand-yellow rounded-full" />
          <span className="text-brand-black uppercase tracking-[0.2em] text-sm font-bold">{title}</span>
        </div>
        
        {/* Carousel Container */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6 md:gap-8 hide-scrollbar"
        >
          {featuredMachines.map((fm) => (
            <div key={fm.id} className={`min-w-[90vw] sm:min-w-[500px] md:min-w-[800px] shrink-0 snap-center bg-white rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center transition-all ${
                fm.is_urgent 
                ? 'border-4 border-brand-yellow ring-4 ring-brand-yellow/20 shadow-[0_0_30px_rgba(250,204,21,0.2)]'
                : 'border border-gray-100'
            }`}>
              {/* Image */}
              <div className="relative h-[220px] sm:h-[300px] md:h-[400px] rounded-2xl overflow-hidden group">
                <Image
                  src={fm.images?.[0] || "/zoomlion.png"}
                  alt={fm.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                
                {/* Urgent Badge */}
                {fm.is_urgent && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white font-black text-[10px] md:text-xs px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.8)] animate-pulse border border-red-500 z-10">
                        VENTA URGENTE
                    </div>
                )}
                {/* Tier Badge */}
                {fm.visibility_tier === 'oro' && (
                    <div className="absolute top-4 left-4 bg-amber-500 text-black font-black text-[10px] md:text-xs px-3 py-1.5 rounded-lg shadow-lg uppercase tracking-wider flex items-center gap-1.5 border border-amber-300">
                        <Star className="w-3.5 h-3.5 fill-black" /> Vendedor Verificado
                    </div>
                )}
                {fm.visibility_tier === 'plata' && (
                    <div className="absolute top-4 left-4 bg-sky-400 text-black font-black text-[10px] md:text-xs px-3 py-1.5 rounded-lg shadow-lg uppercase tracking-wider flex items-center gap-1.5 border border-sky-300">
                        <Star className="w-3.5 h-3.5 fill-black" /> Oportunidad
                    </div>
                )}

                {/* Price badge */}
                {fm.price && (
                  <div className={`absolute bottom-4 right-4 text-white font-black text-sm md:text-base px-3 py-1.5 rounded-full shadow-lg z-10 ${fm.is_urgent ? 'bg-red-600' : 'bg-brand-black/80 backdrop-blur'}`}>
                    {fm.currency === 'USD' ? 'US$' : '$'}{Number(fm.price).toLocaleString('es-CO')} {fm.currency === 'USD' ? 'USD' : ''}
                  </div>
                )}
                {/* Location badge */}
                {fm.location && (
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full border border-white/10">
                    <MapPin className="w-3 h-3 text-brand-yellow" /> {fm.location}
                  </div>
                )}
              </div>

              {/* Text Content */}
              <div className="py-2 flex flex-col h-full justify-center">
                <h2 className="text-xl sm:text-2xl md:text-4xl font-bold mb-3 md:mb-4 leading-tight text-brand-black">
                  {fm.title}
                </h2>
                
                {fm.hours > 0 && (
                  <div className="flex items-center gap-2 text-gray-500 font-medium text-sm mb-4">
                    <Gauge className="w-4 h-4" /> {fm.hours.toLocaleString()} {fm.usage_type === 'km' ? 'kilómetros' : 'horas de uso'}
                  </div>
                )}

                <p className="text-gray-600 mb-8 text-sm sm:text-base line-clamp-3 leading-relaxed">
                  {fm.description || "El equipo ideal para proyectos de alto rendimiento."}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                  <a
                    href={`https://wa.me/573054265677?text=Hola,%20quiero%20más%20información%20sobre%20${encodeURIComponent(fm.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-brand-yellow text-brand-black font-bold py-3 px-4 rounded-xl hover:bg-yellow-400 transition-all text-sm shadow-lg shadow-brand-yellow/20"
                  >
                    Consultar <ArrowRight className="w-4 h-4" />
                  </a>
                  <Link 
                    href={`/maquina/${fm.id}`} 
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 border border-gray-200 text-brand-black hover:bg-gray-200 font-bold py-3 px-4 rounded-xl transition-all text-sm"
                  >
                    Ver detalles
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots (Desktop / Laptop) */}
        {featuredMachines.length > 1 && (
          <div className="hidden md:flex justify-center items-center gap-2 mt-2">
            {featuredMachines.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                aria-label={`Ir a máquina destacada ${index + 1}`}
                className={`transition-all duration-300 rounded-full h-3 flex items-center justify-center ${
                  activeIndex === index 
                    ? "w-8 bg-brand-yellow cursor-default" 
                    : "w-3 bg-gray-300 hover:bg-gray-400 cursor-pointer"
                }`}
              />
            ))}
          </div>
        )}
        
        {/* Pagination Dots (Mobile) */}
        {featuredMachines.length > 1 && (
          <div className="md:hidden flex justify-center items-center gap-2 mt-4">
            {featuredMachines.map((_, index) => (
              <div
                key={index}
                className={`transition-all duration-300 rounded-full h-2 ${
                  activeIndex === index 
                    ? "w-6 bg-brand-yellow" 
                    : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
