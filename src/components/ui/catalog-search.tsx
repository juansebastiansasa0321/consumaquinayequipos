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
};

export function CatalogSearch({ machines }: { machines: Machine[] }) {
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        const q = query.toLowerCase().trim();
        if (!q) return machines;
        return machines.filter(m => {
            const searchText = [
                m.title,
                m.description,
                m.location,
                ...(m.tags || []),
            ].join(" ").toLowerCase();
            return searchText.includes(q);
        });
    }, [query, machines]);

    return (
        <div>
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-10 md:mb-12">
                <div className="flex items-center gap-3 bg-white border-2 border-gray-200 focus-within:border-brand-yellow rounded-2xl px-4 py-3 transition-all shadow-sm hover:shadow-md">
                    <Search className="w-5 h-5 text-gray-400 shrink-0" />
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Buscar por nombre, marca, sector, ubicación..."
                        className="flex-1 text-brand-black outline-none bg-transparent text-sm md:text-base placeholder-gray-400"
                    />
                    {query && (
                        <button onClick={() => setQuery("")} className="text-gray-400 hover:text-gray-700 transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
                {query && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        {filtered.length === 0 ? "No se encontraron máquinas" : `${filtered.length} equipo${filtered.length !== 1 ? "s" : ""} encontrado${filtered.length !== 1 ? "s" : ""}`}
                    </p>
                )}
            </div>

            {/* Results Grid */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {filtered.map((machine) => (
                        <Link
                            href={`/maquina/${machine.id}`}
                            key={machine.id}
                            className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-brand-yellow/40 hover:-translate-y-1"
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
                                {machine.is_featured && (
                                    <div className="absolute top-3 left-3 bg-brand-yellow text-brand-black text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-brand-black" /> Destacada
                                    </div>
                                )}
                                {machine.price && (
                                    <div className="absolute top-3 right-3 bg-brand-black/75 backdrop-blur text-white text-xs font-bold px-2.5 py-1 rounded-full">
                                        ${machine.price.toLocaleString("es-CO")}
                                    </div>
                                )}
                                {machine.tags?.length > 0 && !machine.is_featured && (
                                    <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
                                        {machine.tags.slice(0, 1).map(tag => (
                                            <span key={tag} className="bg-brand-black/75 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-full">{tag}</span>
                                        ))}
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
                                        {machine.price ? `$${machine.price.toLocaleString("es-CO")}` : "Consultar precio"}
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
