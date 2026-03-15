export const dynamic = 'force-dynamic';
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin, Gauge, Star } from "lucide-react";
import { sql } from "@/lib/db";
import { CatalogSearch } from "@/components/ui/catalog-search";
import { FeaturedCarousel } from "@/components/ui/featured-carousel";

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
  is_featured: boolean;
  usage_type?: string;
  is_urgent?: boolean;
};

// Data Fetching with graceful degradation
async function getMachines(): Promise<Machine[]> {
  try {
    if (!process.env.POSTGRES_URL) {
      return getMockHomeMachines();
    }
    const rows = await sql`
        SELECT * FROM machines 
        WHERE status = 'published' AND (expires_at > CURRENT_TIMESTAMP OR expires_at IS NULL)
        ORDER BY 
            CASE visibility_tier
                WHEN 'oro' THEN 1
                WHEN 'plata' THEN 2
                WHEN 'basico' THEN 3
                ELSE 4
            END ASC,
            is_featured DESC, 
            display_order ASC, 
            created_at DESC
    `;
    return rows as Machine[];
  } catch (error) {
    console.error("No se pudo conectar a la base de datos o la tabla no existe:", error);
    return getMockHomeMachines();
  }
}

function getMockHomeMachines(): Machine[] {
  return [
    {
      id: "demo-machine-1",
      title: "Excavadora Zoomlion ZE210E 21T (Demo)",
      description: "Excavadora sobre orugas de 21 toneladas en perfecto estado operativo.",
      price: 350000000,
      hours: 1200,
      is_featured: true,
      location: "Quibdó, Chocó",
      tags: ["Oportunidad", "Entrega Inmediata", "Destacado"],
      images: ["/zoomlion.png"]
    }
  ];
}

export default async function Home() {
  const machines = await getMachines();
  
  // Filter machines that should be featured or recommended
  const oroMachines = machines.filter(m => m.is_featured || (m as any).visibility_tier === 'oro');
  const plataMachines = machines.filter(m => (m as any).visibility_tier === 'plata');
  
  // Combine all featured machines for the carousel
  const carouselMachines = [...oroMachines, ...plataMachines];
  
  // Define hero machine (first featured for the hero background)
  const heroMachine = carouselMachines[0] || machines[0] || getMockHomeMachines()[0];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[80vh] min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden bg-brand-black">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroMachine?.images?.[0] || "/zoomlion.png"}
            alt={heroMachine?.title || "Maquinaria Pesada"}
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
              href="/dashboard/machines/new"
              className="w-full sm:w-auto px-8 py-4 bg-white text-brand-black font-black rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2 text-sm md:text-base shadow-xl"
            >
              Publicar Equipo (Gratis)
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Machines Section (Carousel) */}
      {carouselMachines.length > 0 && (
        <FeaturedCarousel 
          featuredMachines={carouselMachines as any} 
          title="Máquinas Destacadas" 
          className="-mt-12 mb-16"
        />
      )}

      {/* Dynamic Catalog Section */}
      <section id="catalogo" className="py-8 md:py-16 bg-white text-brand-black">
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

          <CatalogSearch machines={machines} />


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
