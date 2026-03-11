export const dynamic = 'force-dynamic';
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, MapPin, Tag, CheckCircle2 } from "lucide-react";
import { sql } from "@vercel/postgres";
import { notFound } from "next/navigation";

// Type matches the one in page.tsx
type Machine = {
    id: string;
    title: string;
    description: string;
    price: number;
    hours: number;
    location: string;
    tags: string[];
    images: string[];
};

async function getMachine(id: string): Promise<Machine | null> {
    try {
        const { rows } = await sql`SELECT * FROM machines WHERE id = ${id}`;
        if (rows.length === 0) return null;
        return rows[0] as Machine;
    } catch (error) {
        console.error("Error fetching machine:", error);
        return null;
    }
}

export default async function MachineDetailPage({ params }: { params: { id: string } }) {
    const machine = await getMachine(params.id);

    if (!machine) {
        // If DB is not connected locally, we mock it for development visualization.
        if (process.env.NODE_ENV === "development" && !process.env.POSTGRES_URL) {
            return <MockMachineDetail id={params.id} />;
        }
        notFound();
    }

    return <MachineDetailView machine={machine} />;
}

// Separate component for the view logic
function MachineDetailView({ machine }: { machine: Machine }) {
    const message = encodeURIComponent(`Hola, estoy interesado en la máquina: ${machine.title}`);
    return (
        <div className="bg-gray-50 min-h-screen pb-24">
            {/* Top Navigator */}
            <div className="bg-white border-b border-gray-200 py-4">
                <div className="container mx-auto px-4">
                    <Link href="/#catalogo" className="inline-flex items-center text-gray-500 hover:text-brand-yellow font-medium transition-colors">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Volver al catálogo
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Image Gallery and Description */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Gallery (Simplified for now with primary image) */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <div className="relative w-full aspect-video md:h-[500px] bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                                {machine.images && machine.images.length > 0 ? (
                                    <Image
                                        src={machine.images[0]}
                                        alt={machine.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-gray-400 font-medium">Imágenes no disponibles</div>
                                )}
                            </div>

                            {/* Optional: Multiple image thumbnails here if array > 1 */}
                            {machine.images && machine.images.length > 1 && (
                                <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
                                    {machine.images.map((img, idx) => (
                                        <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shrink-0 cursor-pointer hover:border-brand-yellow">
                                            <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold mb-4">Descripción General</h2>
                            <div className="text-gray-600 space-y-4 max-w-prose leading-relaxed whitespace-pre-line">
                                {machine.description || "No hay descripción detallada para este equipo."}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Pricing & Quick Details */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                            <div className="mb-2 flex flex-wrap gap-2">
                                {machine.tags?.map(tag => (
                                    <span key={tag} className="bg-brand-yellow/20 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-3xl font-bold text-brand-black mb-4">{machine.title}</h1>
                            <div className="text-4xl font-black text-brand-black mb-6 pb-6 border-b border-gray-100">
                                ${machine.price ? machine.price.toLocaleString("es-CO") : "A consultar"}
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <MapPin className="w-5 h-5 text-gray-400" />
                                    <span className="font-medium">Ubicación: </span> {machine.location || "Consultar"}
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Clock className="w-5 h-5 text-gray-400" />
                                    <span className="font-medium">Horas de uso: </span> {machine.hours ? `${machine.hours}h` : "N/A"}
                                </div>
                            </div>

                            <a
                                href={`https://wa.me/573054265677?text=${message}`}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full block text-center bg-brand-yellow hover:bg-yellow-400 text-brand-black font-bold text-lg py-4 rounded-xl transition-all shadow-md mb-4"
                            >
                                Contactar al Vendedor
                            </a>
                            <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1">
                                <CheckCircle2 className="w-4 h-4" /> Venta segura y verificada
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function MockMachineDetail({ id }: { id: string }) {
    return <MachineDetailView machine={{
        id: id,
        title: "Excavadora Zoomlion ZE210E 21T (Demo)",
        description: "Excavadora sobre orugas de 21 toneladas en perfecto estado operativo. \n\n- Mantenimientos al día.\n- Ideal para minería y movimiento de tierras.\n- Cabina reforzada panorámica.\n- Excelente rendimiento de combustible.",
        price: 350000000,
        hours: 1200,
        location: "Quibdó, Chocó",
        tags: ["Oportunidad", "Entrega Inmediata", "Destacado"],
        images: [
            "/zoomlion.png",
            "https://consumaquinayequipos.com/wp-content/uploads/2023/11/WhatsApp-Image-2023-11-20-at-3.08.34-PM.jpeg",
            "https://consumaquinayequipos.com/wp-content/uploads/2023/11/WhatsApp-Image-2023-11-20-at-3.08.35-PM.jpeg"
        ]
    }} />;
}
