export const dynamic = 'force-dynamic';
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin, Gauge, Star } from "lucide-react";
import { sql } from "@/lib/db";

// Types
type Machine = {
  id: string;
  title: string;
  description: string;
  price: number;
  hours: number;
  location: string;
  tags: string[];
  images: string[];
  is_featured?: boolean;
};

// Data Fetching with graceful degradation
async function getMachines(): Promise<Machine[]> {
  try {
    if (!process.env.POSTGRES_URL) {
      // Just return mock data without throwing, else Next breaks on the server component
      return getMockHomeMachines();
    }
    const rows = await sql`SELECT * FROM machines ORDER BY display_order ASC, created_at DESC LIMIT 6`;
    return rows as Machine[];
  } catch (error) {
    console.error("No se pudo conectar a la base de datos o la tabla no existe:", error);
    // Return mock data for local testing when database is not connected
    return getMockHomeMachines();
  }
}

function getMockHomeMachines(): Machine[] {
  return [
    {
      id: "demo-machine-1",
      title: "Excavadora Zoomlion ZE210E 21T (Demo)",
      description: "Excavadora sobre orugas de 21 toneladas en perfecto estado operativo. \n\n- Mantenimientos al día.\n- Ideal para minería y movimiento de tierras.\n- Cabina reforzada panorámica.\n- Excelente rendimiento de combustible.",
      price: 350000000,
      hours: 1200,
      location: "Quibdó, Chocó",
      tags: ["Oportunidad", "Entrega Inmediata", "Destacado"],
      images: [
        "/zoomlion.png",
        "https://consumaquinayequipos.com/wp-content/uploads/2023/11/WhatsApp-Image-2023-11-20-at-3.08.35-PM.jpeg", // Using placeholders for a gallery
        "https://consumaquinayequipos.com/wp-content/uploads/2023/11/WhatsApp-Image-2023-11-20-at-3.08.34-PM.jpeg"
      ]
    }
  ];
}

export default async function Home() {
  const machines = await getMachines();
  const featuredMachine = machines.find(m => m.is_featured) || machines[0] || getMockHomeMachines()[0];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[80vh] min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden bg-brand-black">
        <div className="absolute inset-0 z-0">
          <Image
            src={featuredMachine.images?.[0] || "/zoomlion.png"}
            alt={featuredMachine.title}
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/50 to-transparent" />
        </div>

        <div className="container relative z-10 px-4 md:px-6 text-center max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-block px-4 py-1.5 mb-4 md:mb-6 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow font-semibold text-xs md:text-sm tracking-widest uppercase">
            Especialistas en Maquinaria Pesada
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-4 md:mb-6 leading-tight">
            Potencia para{" "}<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-yellow-500">Minería e Infraestructura</span>
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-gray-300 mb-8 md:mb-10 max-w-xl mx-auto">
            Distribución especializada de excavadoras y motores industriales para Chocó y Cauca.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center w-full max-w-sm sm:max-w-none">
            <Link
              href="#catalogo"
              className="w-full sm:w-auto px-8 py-4 bg-brand-yellow text-brand-black font-bold rounded-xl hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 shadow-xl shadow-brand-yellow/20 text-sm md:text-base"
            >
              Ver Catálogo <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contacto"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur border border-white/30 text-white font-bold rounded-xl hover:bg-white hover:text-brand-black transition-all flex items-center justify-center gap-2 text-sm md:text-base"
            >
              Solicitar Cotización
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Machine Section */}
      <section className="py-12 md:py-20 bg-brand-black text-white">
        {/* Section Label */}
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8 md:mb-12">
            <div className="w-1 h-8 bg-brand-yellow rounded-full" />
            <span className="text-brand-yellow uppercase tracking-[0.2em] text-sm font-bold">Máquina Destacada</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
            {/* Image - shown first on mobile */}
            <div className="relative h-[260px] sm:h-[340px] md:h-[520px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
              <Image
                src={featuredMachine.images?.[0] || "/zoomlion.png"}
                alt={featuredMachine.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              {/* Price badge */}
              {featuredMachine.price && (
                <div className="absolute top-4 right-4 bg-brand-yellow text-brand-black font-black text-sm px-3 py-1.5 rounded-full shadow-lg">
                  ${featuredMachine.price.toLocaleString('es-CO')}
                </div>
              )}
              {/* Location badge */}
              {featuredMachine.location && (
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full border border-white/10">
                  <MapPin className="w-3 h-3 text-brand-yellow" /> {featuredMachine.location}
                </div>
              )}
            </div>

            {/* Text Content */}
            <div className="py-2">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 md:mb-4 leading-tight">
                {featuredMachine.title}
              </h2>
              
              {featuredMachine.hours > 0 && (
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                  <Gauge className="w-4 h-4" /> {featuredMachine.hours.toLocaleString()} horas de uso
                </div>
              )}

              <p className="text-gray-300 mb-6 text-sm md:text-base line-clamp-3 leading-relaxed">
                {featuredMachine.description || "El equipo ideal para proyectos de alto rendimiento."}
              </p>

              {/* Tags as feature list */}
              {featuredMachine.tags && featuredMachine.tags.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-8">
                  {featuredMachine.tags.slice(0, 4).map((tag, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-brand-yellow shrink-0" />
                      <span className="text-gray-200 text-sm font-medium">{tag}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/573054265677?text=Hola,%20quiero%20más%20información%20sobre%20${encodeURIComponent(featuredMachine.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-brand-yellow text-brand-black font-bold py-3 px-6 rounded-xl hover:bg-yellow-400 transition-all text-sm md:text-base shadow-lg shadow-brand-yellow/20"
                >
                  Consultar disponibilidad <ArrowRight className="w-4 h-4" />
                </a>
                <Link 
                  href={`/maquina/${featuredMachine.id}`} 
                  className="flex-1 flex items-center justify-center gap-2 border border-white/20 text-white font-semibold py-3 px-6 rounded-xl hover:bg-white hover:text-brand-black transition-all text-sm md:text-base"
                >
                  Ver detalles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Catalog Section */}
      <section id="catalogo" className="py-16 md:py-24 bg-white text-brand-black">
        {/* Top border accent */}
        <div className="w-full h-1 bg-gradient-to-r from-brand-yellow via-yellow-400 to-transparent mb-12 md:mb-16" />
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 md:mb-14 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1 h-8 bg-brand-yellow rounded-full" />
                <span className="text-brand-yellow uppercase tracking-[0.2em] text-xs font-bold">Inventario Disponible</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold">Nuestro <span className="text-brand-black">Catálogo</span></h2>
            </div>
            <p className="text-gray-500 max-w-xs text-sm">
              Equipos listos para trabajar en tu proyecto
            </p>
          </div>

          {machines.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {machines.map((machine) => (
                <Link href={`/maquina/${machine.id}`} key={machine.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-brand-yellow/40 hover:-translate-y-1">
                  <div className="relative h-52 sm:h-60 w-full bg-gray-100 overflow-hidden">
                    {machine.images && machine.images.length > 0 ? (
                      <Image
                        src={machine.images[0]}
                        alt={machine.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        Sin imagen
                      </div>
                    )}
                    {/* Featured badge */}
                    {machine.is_featured && (
                      <div className="absolute top-3 left-3 bg-brand-yellow text-brand-black text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 fill-brand-black" /> Destacada
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
                      {machine.tags?.slice(0, 2).map(tag => (
                        <span key={tag} className="bg-brand-black/75 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-brand-yellow transition-colors">{machine.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      {machine.location && (
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {machine.location}</span>
                      )}
                      {machine.hours > 0 && (
                        <span className="flex items-center gap-1"><Gauge className="w-4 h-4" /> {machine.hours}h</span>
                      )}
                    </div>
                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="font-black text-xl text-brand-black">
                        ${machine.price ? machine.price.toLocaleString('es-CO') : "Consultar"}
                      </span>
                      <span className="text-brand-yellow font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        Ver detalles <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
              <h3 className="text-xl font-bold text-gray-400 mb-2">Catálogo en actualización</h3>
              <p className="text-gray-500">Próximamente publicaremos nuestras máquinas disponibles.</p>
              <p className="text-sm text-gray-400 mt-4">(Si eres el administrador, sube máquinas desde el Dashboard)</p>
            </div>
          )}

          {/* CTA Banner for Unlisted Machines */}
          <div className="mt-16 bg-brand-black rounded-3xl p-8 md:p-12 text-center text-white border border-brand-gray/20 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-yellow/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-yellow/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <h3 className="text-2xl md:text-4xl font-bold mb-4 relative z-10">¿No encuentras la máquina que buscas?</h3>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto text-lg relative z-10">
              Contamos con una amplia red de proveedores. Contáctanos indicando el equipo exacto que necesitas y nosotros lo conseguimos para ti al mejor precio.
            </p>
            <Link 
              href="/contacto" 
              className="inline-flex items-center gap-2 bg-brand-yellow text-brand-black px-8 py-4 rounded-xl font-bold hover:bg-yellow-400 transition-colors relative z-10 shadow-lg"
            >
              Consultar Equipo Específico <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
