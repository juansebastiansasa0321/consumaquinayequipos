"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, MapPin, Clock, Star } from "lucide-react";

type Machine = {
    id: string;
    title: string;
    description: string;
    price: number;
    hours: number;
    location: string;
    tags: string[];
    images: string[];
    is_featured: boolean;
    usage_type?: string;
    visibility_tier?: string;
    is_urgent?: boolean;
    currency?: string;
};

export function CatalogSearch({ machines }: { machines: Machine[] }) {
    const [query, setQuery] = useState("");

    const [locationFilter, setLocationFilter] = useState("");

    const uniqueLocations = useMemo(() => {
        const locs = machines.map(m => m.location).filter(Boolean);
        return Array.from(new Set(locs)).sort();
    }, [machines]);

    const filtered = useMemo(() => {
        const q = query.toLowerCase().trim();
        return machines.filter(m => {
            const matchesQuery = !q || [
                m.title,
                m.description,
                m.location,
                ...(m.tags || []),
            ].join(" ").toLowerCase().includes(q);
            
            const matchesLocation = !locationFilter || m.location === locationFilter;
            
            return matchesQuery && matchesLocation;
        });
    }, [query, locationFilter, machines]);

    return (
        <div>
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-10 md:mb-12">
                <div className="flex flex-col sm:flex-row items-center gap-3 bg-white border-2 border-gray-200 focus-within:border-brand-yellow rounded-2xl p-2 sm:px-4 sm:py-3 transition-all shadow-sm hover:shadow-md">
                    <div className="flex w-full sm:w-auto flex-1 items-center gap-2">
                        <Search className="w-5 h-5 text-gray-400 shrink-0 ml-2 sm:ml-0" />
                        <input
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Buscar por nombre, marca, sector..."
                            className="flex-1 text-brand-black outline-none bg-transparent text-sm md:text-base placeholder-gray-400 py-1"
                        />
                        {query && (
                            <button onClick={() => setQuery("")} className="text-gray-400 hover:text-gray-700 transition-colors mr-2">
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <div className="hidden sm:block w-[1px] h-6 bg-gray-200" />
                    <div className="flex w-full sm:w-auto items-center gap-2 px-2 sm:px-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100">
                        <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                        <select
                            value={locationFilter}
                            onChange={e => setLocationFilter(e.target.value)}
                            className="w-full sm:w-48 text-brand-black outline-none bg-transparent text-sm md:text-base text-ellipsis"
                        >
                            <option value="">Cualquier ubicación</option>
                            {uniqueLocations.map(loc => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </select>
                    </div>
                </div>
                {(query || locationFilter) && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        {filtered.length === 0 ? "No se encontraron máquinas" : `${filtered.length} equipo${filtered.length !== 1 ? "s" : ""} encontrado${filtered.length !== 1 ? "s" : ""}`}
                    </p>
                )}
            </div>

            {/* Results Grid / Mobile Carousel */}
            {filtered.length > 0 ? (
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 pt-2 sm:pt-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 md:gap-8 sm:pb-0 sm:overflow-visible sm:snap-none -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar after:content-[''] after:shrink-0 after:w-1 sm:after:hidden">
                    {filtered.map((machine) => (
                        <Link
                            href={`/maquina/${machine.id}`}
                            key={machine.id}
                            className={`group flex flex-col w-[85vw] max-w-[320px] shrink-0 snap-center sm:w-auto sm:max-w-none sm:shrink sm:snap-align-none bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                                machine.is_urgent 
                                ? 'border-2 border-brand-yellow ring-4 ring-brand-yellow/20 shadow-brand-yellow/10' 
                                : 'border border-gray-100 hover:border-brand-yellow/40'
                            }`}
                        >
                            <div className="relative h-52 sm:h-60 w-full bg-gray-100 overflow-hidden">
                                {machine.images && machine.images.length > 0 ? (
                                    <Image
                                        src={machine.images[0]}
                                        alt={machine.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Sin imagen</div>
                                )}
                                
                                {/* Urgent Badge */}
                                {machine.is_urgent && (
                                    <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] md:text-xs font-black px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.6)] animate-pulse border border-red-400 z-10">
                                        VENTA URGENTE
                                    </div>
                                )}

                                {/* Oro Badge - Special Shield */}
                                {machine.visibility_tier === 'oro' && (
                                    <div className="absolute top-3 left-3 bg-amber-500 text-black text-[10px] md:text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-yellow-300 z-10">
                                        <Star className="w-3.5 h-3.5 fill-black" /> Vendedor Verificado
                                    </div>
                                )}

                                {/* Plata Badge - Oportunidad */}
                                {machine.visibility_tier === 'plata' && (
                                    <div className="absolute top-3 left-3 bg-sky-500 text-white text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-sky-400">
                                        Oportunidad
                                    </div>
                                )}
                                
                                {machine.price && (
                                    <div className={`absolute bottom-3 left-3 text-white text-xs md:text-sm font-black px-3 py-1.5 rounded-full z-10 ${machine.is_urgent ? 'bg-red-600' : 'bg-brand-black/75 backdrop-blur'}`}>
                                        {machine.currency === 'USD' ? 'US$' : '$'}{Number(machine.price).toLocaleString("es-CO")} {machine.currency === 'USD' ? 'USD' : ''}
                                    </div>
                                )}
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-base font-bold mb-2 group-hover:text-brand-yellow transition-colors line-clamp-2">{machine.title}</h3>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mb-4">
                                    {machine.location && (
                                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {machine.location}</span>
                                    )}
                                    {machine.hours > 0 && (
                                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {machine.hours.toLocaleString()}{machine.usage_type === 'km' ? ' km' : 'h'}</span>
                                    )}
                                </div>
                                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                                    <span className="font-black text-lg text-brand-black">
                                        {machine.price ? `${machine.currency === 'USD' ? 'US$' : '$'}${Number(machine.price).toLocaleString("es-CO")} ${machine.currency === 'USD' ? 'USD' : ''}` : "Consultar precio"}
                                    </span>
                                    <span className="text-xs font-bold text-brand-yellow group-hover:underline">Ver detalles →</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : query ? (
                <div className="text-center py-16">
                    <p className="text-4xl mb-4">🔍</p>
                    <p className="text-gray-500 font-medium mb-2">No encontramos equipos con "{query}"</p>
                    <p className="text-gray-400 text-sm">Intenta con otra búsqueda o <button onClick={() => setQuery("")} className="text-brand-yellow font-bold hover:underline">ve todo el catálogo</button></p>
                </div>
            ) : (
                <div className="text-center py-16 text-gray-400">
                    <p>No hay máquinas disponibles por el momento.</p>
                </div>
            )}
        </div>
    );
}
