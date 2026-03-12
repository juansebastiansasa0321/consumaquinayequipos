export const dynamic = 'force-dynamic';
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, MapPin, CheckCircle2, Tag, ArrowRight, MessageCircle } from "lucide-react";
import { sql } from "@/lib/db";
import { notFound } from "next/navigation";
import { MachineGallery } from "@/components/ui/machine-gallery";

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

async function getMachine(id: string): Promise<Machine | null> {
    try {
        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) return null;
        const rows = await sql`SELECT * FROM machines WHERE id = ${numericId}`;
        if (rows.length === 0) return null;
        return rows[0] as Machine;
    } catch (error) {
        console.error("Error fetching machine:", error);
        return null;
    }
}

async function getSimilarMachines(currentId: string, tags: string[]): Promise<Machine[]> {
    if (!tags || tags.length === 0) return [];
    try {
        const numericId = parseInt(currentId, 10);
        const rows = await sql`
            SELECT * FROM machines
            WHERE id != ${numericId}
            AND tags && ${tags.length ? tags.map(String) : []}::text[]
            ORDER BY display_order ASC, created_at DESC
            LIMIT 4
        `;
        return rows as Machine[];
    } catch (error) {
        console.error("Error fetching similar machines:", error);
        return [];
    }
}

export default async function MachineDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const machine = await getMachine(id);
    if (!machine) {
        if (process.env.NODE_ENV === "development") return <MockMachineDetail id={id} />;
        notFound();
    }
    const similar = await getSimilarMachines(id, machine.tags || []);
    return <MachineDetailView machine={machine} similar={similar} />;
}

function MachineDetailView({ machine, similar }: { machine: Machine; similar: Machine[] }) {
    const message = encodeURIComponent(`Hola, estoy interesado en la máquina: ${machine.title}. ¿Podría darme más información?`);

    return (
        <div className="bg-gray-50 min-h-screen pb-24">
            {/* Sticky top nav */}
            <div className="bg-white border-b border-gray-200 py-3 sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-4">
                    <Link href="/#catalogo" className="inline-flex items-center text-gray-500 hover:text-brand-yellow font-medium transition-colors text-sm gap-1.5">
                        <ArrowLeft className="w-4 h-4" /> Volver al catálogo
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 md:py-10 max-w-5xl">

                {/* === HERO CARD === */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mb-6">

                    {/* Interactive Gallery */}
                    <MachineGallery images={machine.images} title={machine.title} />

                    {/* Tags */}
                    {machine.tags && machine.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 px-6 pt-4">
                            {machine.tags.map(tag => (
                                <span key={tag} className="flex items-center gap-1 bg-brand-yellow/15 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-brand-yellow/30">
                                    <Tag className="w-3 h-3" /> {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Title + Quick Stats */}
                    <div className="px-6 pt-4 pb-2">
                        <h1 className="text-2xl md:text-3xl font-black text-brand-black leading-tight mb-3">{machine.title}</h1>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                            {machine.location && (
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-brand-yellow" /> {machine.location}
                                </span>
                            )}
                            {machine.hours > 0 && (
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-brand-yellow" /> {machine.hours.toLocaleString()} {machine.usage_type === 'km' ? 'km' : 'horas de uso'}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Price */}
                    <div className="px-6 py-3">
                        <span className="text-2xl md:text-3xl font-black text-brand-black">
                            {machine.price ? `$${Number(machine.price).toLocaleString("es-CO")}` : "Precio a consultar"}
                        </span>
                    </div>

                    {/* CTA Buttons */}
                    <div className="px-6 py-5 flex flex-col sm:flex-row gap-3 border-t border-gray-100">
                        <a
                            href={`https://wa.me/573054265677?text=${message}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 bg-brand-yellow hover:bg-yellow-400 text-brand-black font-bold py-4 rounded-xl transition-all shadow-md shadow-brand-yellow/20"
                        >
                            <MessageCircle className="w-5 h-5" /> Contactar al Vendedor
                        </a>
                        <Link
                            href="/contacto"
                            className="flex-1 flex items-center justify-center gap-2 border-2 border-brand-black text-brand-black font-bold py-4 rounded-xl hover:bg-brand-black hover:text-white transition-all"
                        >
                            Solicitar Cotización
                        </Link>
                    </div>
                    <p className="text-xs text-center text-gray-400 pb-4 flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Venta segura y verificada
                    </p>
                </div>

                {/* Description */}
                {machine.description && (
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-1 h-6 bg-brand-yellow rounded-full" />
                            <h2 className="text-lg font-bold text-brand-black">Descripción del equipo</h2>
                        </div>
                        <div className="text-gray-600 leading-relaxed whitespace-pre-line text-sm md:text-base">
                            {machine.description}
                        </div>
                    </div>
                )}

                {/* === SIMILAR MACHINES === */}
                {similar.length > 0 && (
                    <div className="mt-8">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-1 h-8 bg-brand-yellow rounded-full" />
                            <div>
                                <p className="text-xs uppercase tracking-widest text-brand-yellow font-bold">También te puede interesar</p>
                                <h2 className="text-xl font-black text-brand-black">Equipos Similares</h2>
                            </div>
                        </div>

                        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4 sm:pb-0 sm:overflow-visible sm:snap-none -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar after:content-[''] after:shrink-0 after:w-1 sm:after:hidden">
                            {similar.map(m => (
                                <Link href={`/maquina/${m.id}`} key={m.id}
                                    className="group flex flex-col w-[85vw] max-w-[280px] shrink-0 snap-center sm:w-auto sm:max-w-none sm:shrink sm:snap-align-none bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-brand-yellow/40 transition-all duration-300">
                                    <div className="relative h-40 bg-gray-100 overflow-hidden w-full">
                                        {m.images?.[0] ? (
                                            <Image src={m.images[0]} alt={m.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Sin imagen</div>
                                        )}
                                        {m.price && (
                                            <div className="absolute bottom-2 right-2 bg-brand-yellow text-brand-black text-[10px] font-black px-2 py-1 rounded-full">
                                                ${Number(m.price).toLocaleString("es-CO")}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-sm text-brand-black line-clamp-2 group-hover:text-brand-yellow transition-colors mb-2">{m.title}</h3>
                                        {m.location && (
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <MapPin className="w-3 h-3" /> {m.location}
                                            </p>
                                        )}
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {m.tags?.slice(0, 2).map(tag => (
                                                <span key={tag} className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full font-medium">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mt-auto pt-4 px-4 pb-4">
                                        <span className="text-xs font-bold text-brand-yellow flex items-center gap-1">Ver equipo <ArrowRight className="w-3 h-3" /></span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function MockMachineDetail({ id }: { id: string }) {
    return <MachineDetailView similar={[]} machine={{
        id: id,
        title: "Excavadora Zoomlion ZE210E 21T (Demo)",
        description: "Excavadora sobre orugas de 21 toneladas en perfecto estado operativo.\n\n- Mantenimientos al día.\n- Ideal para minería y movimiento de tierras.\n- Cabina reforzada panorámica.",
        price: 350000000,
        hours: 1200,
        is_featured: true,
        location: "Quibdó, Chocó",
        tags: ["Oportunidad", "Entrega Inmediata"],
        images: ["/zoomlion.png"]
    }} />;
}
