export const dynamic = 'force-dynamic';
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin, Gauge, Star } from "lucide-react";
import { sql } from "@vercel/postgres";

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
    const { rows } = await sql`SELECT * FROM machines ORDER BY display_order ASC, created_at DESC LIMIT 6`;
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
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow font-semibold text-sm tracking-widest uppercase">
            Especialistas en Maquinaria Pesada
          </div>
          <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
            Potencia para <br className="md:hidden" /><span className="text-brand-yellow text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-yellow-600">Minería e Infraestructura</span>
          </h1>
          <p className="text-base md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Distribución especializada de excavadoras de 21 toneladas y motores industriales para las regiones de Chocó y Cauca.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
            <Link
              href="#catalogo"
              className="px-8 py-4 bg-brand-yellow text-brand-black font-bold rounded-lg hover:bg-yellow-400 transition-all flex items-center justify-center gap-2"
            >
              Ver Catálogo <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contacto"
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-brand-black transition-all flex items-center justify-center gap-2"
            >
              Solicitar Cotización
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Machine Section */}
      <section className="py-16 md:py-24 bg-brand-black text-white px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 md:order-1 relative h-[300px] md:h-[500px] rounded-2xl overflow-hidden border border-brand-gray/30 group">
              <Image
                src={featuredMachine.images?.[0] || "/zoomlion.png"}
                alt={featuredMachine.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white font-bold text-2xl flex items-center gap-2">
                {featuredMachine.title}
                {featuredMachine.is_featured && <Star className="w-5 h-5 text-brand-yellow fill-brand-yellow" />}
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-2xl md:text-5xl font-bold mb-4 md:mb-6">Máquina <span className="text-brand-yellow">Destacada</span></h2>
              <p className="text-gray-400 mb-6 md:mb-8 text-base md:text-lg line-clamp-4">
                {featuredMachine.description || "El equipo ideal para proyectos de alto rendimiento."}
              </p>

              <div className="space-y-4 mb-8">
                {featuredMachine.tags?.slice(0, 4).map((tag, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-brand-yellow shrink-0 mt-0.5" />
                    <span className="text-gray-300 font-medium">{tag}</span>
                  </div>
                ))}
                {(!featuredMachine.tags || featuredMachine.tags.length === 0) && (
                   <div className="flex items-start gap-3">
                     <CheckCircle2 className="w-6 h-6 text-brand-yellow shrink-0 mt-0.5" />
                     <span className="text-gray-300">Garantía y entrega inmediata</span>
                 </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                  <a
                    href={`https://wa.me/573054265677?text=Hola,%20quiero%20más%20información%20sobre%20${encodeURIComponent(featuredMachine.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-brand-yellow font-bold hover:underline"
                  >
                    Consultar disponibilidad <ArrowRight className="w-4 h-4" />
                  </a>
                  <Link href={`/maquina/${featuredMachine.id}`} className="px-5 py-2 rounded-lg border border-gray-600 hover:bg-white hover:text-black transition-colors font-semibold text-sm">
                    Ver más fotos
                  </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Catalog Section */}
      <section id="catalogo" className="py-24 bg-gray-50 text-brand-black px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Nuestro <span className="text-brand-yellow">Catálogo</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explora nuestra disponibilidad actual de maquinaria pesada. Equipos listos para trabajar.
            </p>
          </div>

          {machines.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {machines.map((machine) => (
                <Link href={`/maquina/${machine.id}`} key={machine.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100">
                  <div className="relative h-64 w-full bg-gray-200 overflow-hidden">
                    {machine.images && machine.images.length > 0 ? (
                      <Image
                        src={machine.images[0]}
                        alt={machine.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Sin imagen
                      </div>
                    )}
                    <div className="absolute top-4 left-4 flex gap-2">
                      {machine.tags?.slice(0, 2).map(tag => (
                        <span key={tag} className="bg-brand-black/80 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full">
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
