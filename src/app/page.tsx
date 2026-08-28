export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { sql } from "@/lib/db";
import { CatalogSearch } from "@/components/ui/catalog-search";
import { FeaturedCarousel } from "@/components/ui/featured-carousel";

export const metadata: Metadata = {
  title: "Excavadora 21 Toneladas en Cali | Zoomlion ZE215E | Maquinaria Pesada Colombia",
  description: "Venta excavadora hidráulica 21 toneladas en Cali, Valle del Cauca. Zoomlion ZE215E, motor Cummins 173 HP, equipo nuevo, entrega inmediata. Alternativa a Cat 320, Komatsu PC200, Hitachi ZX200, Volvo EC220. Cotiza: +57 310 575 3752.",
  keywords: [
    // Búsquedas genéricas
    "excavadora 21 toneladas Colombia",
    "excavadora 21 toneladas Cali",
    "retroexcavadora 21 toneladas",
    "retroexcavadora 21 toneladas Cali",
    "excavadora hidraulica 21 toneladas",
    "excavadora sobre orugas 21 toneladas",
    "maquinaria pesada Cali",
    "maquinaria pesada Valle del Cauca",
    "venta maquinaria pesada Colombia",
    "excavadora nueva Colombia",
    "excavadora nueva Cali",
    // Zoomlion específico
    "Zoomlion ZE215E",
    "Zoomlion ZE215E Colombia",
    "Zoomlion ZE215E Cali",
    "Zoomlion excavadora Colombia",
    "excavadora Zoomlion 21 toneladas",
    // Competidores (personas que buscan otras marcas)
    "excavadora 20 toneladas Cat",
    "Cat 320 Colombia",
    "Caterpillar 320 precio Colombia",
    "Komatsu PC200 Colombia",
    "Komatsu PC210 Cali",
    "Hitachi ZX200 Colombia",
    "Volvo EC220 Colombia",
    "Hyundai R220 Colombia",
    "Doosan DX200 Colombia",
    "JCB JS205 Colombia",
    // Por uso
    "excavadora para mineria Colombia",
    "excavadora para infraestructura",
    "excavadora movimiento de tierras",
    "maquinaria pesada mineria Choco",
    "excavadora Cali entrega inmediata",
    // Por región
    "maquinaria pesada Buenaventura",
    "maquinaria pesada Palmira",
    "maquinaria pesada Bucaramanga",
    "maquinaria pesada Medellín",
    "excavadora Valle del Cauca",
  ],
  openGraph: {
    title: "Excavadora 21 Toneladas en Cali | Zoomlion ZE215E Nueva",
    description: "Motor Cummins 173 HP · Equipo nuevo · Entrega inmediata en Cali · Despacho a todo Colombia. Alternativa sólida a Cat, Komatsu e Hitachi. Cotiza ahora.",
    type: "website",
    locale: "es_CO",
    url: "https://consumaquinayequipos.com",
    siteName: "Consumaquinayequipos",
  },
  twitter: {
    card: "summary_large_image",
    title: "Excavadora Zoomlion 21 Toneladas | Cali, Colombia",
    description: "Equipo nuevo, motor Cummins 173 HP. Disponible en Cali. Cotiza por WhatsApp.",
  },
  alternates: {
    canonical: "https://consumaquinayequipos.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};


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

async function getMachines(): Promise<Machine[]> {
  try {
    if (!process.env.POSTGRES_URL) return getMockHomeMachines();
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
    console.error("No se pudo conectar a la base de datos:", error);
    return getMockHomeMachines();
  }
}

function getMockHomeMachines(): Machine[] {
  return [
    {
      id: "4",
      title: "Excavadora Zoomlion ZE215E 21T",
      description: "Excavadora sobre orugas de 21 toneladas en perfecto estado operativo.",
      price: 350000000,
      hours: 0,
      is_featured: true,
      location: "Cali, Valle del Cauca",
      tags: ["Nuevo", "Entrega Inmediata"],
      images: ["/zoomlion.png"]
    }
  ];
}

export default async function Home() {
  const machines = await getMachines();

  const oroMachines = machines.filter(m => m.is_featured || (m as any).visibility_tier === 'oro');
  const plataMachines = machines.filter(m => (m as any).visibility_tier === 'plata');
  const carouselMachines = [...oroMachines, ...plataMachines];

  // Usar la Zoomlion (id=4) como hero
  const heroMachine = machines.find(m => m.id === '4') || carouselMachines[0] || machines[0] || getMockHomeMachines()[0];

  const waMessage = encodeURIComponent("Hola, vi la Excavadora Zoomlion ZE215E de 21 toneladas en su página web y me gustaría recibir más información y el precio.");

  // JSON-LD Schema para Google Rich Results
  const zoomlionImage = heroMachine?.images?.[0] || "https://consumaquinayequipos.com/zoomlion.png";
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": "https://consumaquinayequipos.com/#business",
        "name": "Consumaquinayequipos",
        "description": "Venta de maquinaria pesada en Cali, Colombia. Excavadoras, minicargadores y volquetas para minería e infraestructura.",
        "url": "https://consumaquinayequipos.com",
        "telephone": "+573105753752",
        "email": "consumaquinayequipos@icloud.com",
        "image": zoomlionImage,
        "priceRange": "$$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Cali",
          "addressLocality": "Cali",
          "addressRegion": "Valle del Cauca",
          "addressCountry": "CO"
        },
        "geo": { "@type": "GeoCoordinates", "latitude": "3.4516", "longitude": "-76.5320" },
        "areaServed": ["Cali", "Valle del Cauca", "Chocó", "Cauca", "Colombia"],
        "sameAs": [
          "https://instagram.com/consumaquinayequipos",
          "https://www.facebook.com/profile.php?id=61582161870533"
        ]
      },
      {
        "@type": "Product",
        "@id": "https://consumaquinayequipos.com/maquina/4/landing#product",
        "name": "Excavadora Zoomlion ZE215E 21 Toneladas",
        "description": "Excavadora hidráulica sobre orugas Zoomlion ZE215E de 21 toneladas. Motor Cummins 173 HP, profundidad de excavación 6.63 m. Equipo nuevo disponible en Cali, Colombia. Despacho a todo el país.",
        "image": [zoomlionImage],
        "brand": { "@type": "Brand", "name": "Zoomlion" },
        "model": "ZE215E",
        "sku": "ZOOMLION-ZE215E-21T",
        "mpn": "ZE215E",
        "category": "Excavadora hidráulica sobre orugas",
        "url": "https://consumaquinayequipos.com/maquina/4/landing",
        "offers": {
          "@type": "Offer",
          "url": "https://consumaquinayequipos.com/maquina/4/landing",
          "priceCurrency": "COP",
          "price": "0",
          "priceSpecification": {
            "@type": "PriceSpecification",
            "priceCurrency": "COP",
            "description": "Precio a convenir. Contáctenos para cotización."
          },
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition",
          "seller": {
            "@type": "Organization",
            "name": "Consumaquinayequipos",
            "url": "https://consumaquinayequipos.com",
            "telephone": "+573105753752"
          }
        }
      }
    ]
  };

  return (
    <div className="w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ═══ HERO ═══ */}
      <section className="relative w-full min-h-[92vh] flex items-center overflow-hidden bg-brand-black">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroMachine?.images?.[0] || "/zoomlion.png"}
            alt="Excavadora Zoomlion ZE215E 21 Toneladas Cali Valle del Cauca"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/55 to-brand-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-black/85 via-brand-black/20 to-transparent" />
        </div>

        <div className="container relative z-10 px-4 md:px-8 max-w-5xl mx-auto flex flex-col items-start pt-16 pb-28">

          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-brand-yellow/10 border border-brand-yellow/40 text-brand-yellow font-bold text-xs tracking-widest uppercase">
            <span className="w-2 h-2 bg-brand-yellow rounded-full animate-pulse" />
            Disponible — Cali, Valle del Cauca
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-3 leading-[1.05]">
            Excavadora<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-yellow-300">
              Zoomlion ZE215E
            </span>
          </h1>

          <p className="text-xl md:text-2xl font-bold text-gray-200 mb-2">
            21 Toneladas · Motor Cummins 173 HP
          </p>
          <p className="text-base md:text-lg text-gray-400 mb-8 max-w-lg leading-relaxed">
            Equipo nuevo para minería, infraestructura y movimiento de tierras. Entrega inmediata desde Cali a cualquier región de Colombia.
          </p>

          {/* Trust pills */}
          <div className="flex flex-wrap gap-2 mb-10">
            {["✅ Equipo nuevo", "📍 Cali, Valle del Cauca", "🚛 Despacho a todo Colombia", "💬 Respuesta inmediata"].map(b => (
              <span key={b} className="text-xs font-semibold text-gray-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                {b}
              </span>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm sm:max-w-none">
            <a
              href={`https://wa.me/573105753752?text=${waMessage}`}
              target="_blank"
              rel="noreferrer"
              className="sm:w-auto px-8 py-4 bg-brand-yellow text-brand-black font-black rounded-xl hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 shadow-xl shadow-brand-yellow/25 text-base"
            >
              Cotizar por WhatsApp <ArrowRight className="w-5 h-5" />
            </a>
            <Link
              href="#catalogo"
              className="sm:w-auto px-8 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2 text-base backdrop-blur"
            >
              Ver Catálogo Completo
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-white text-[10px] font-semibold tracking-[0.3em] uppercase">Explorar</span>
          <div className="w-px h-10 bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section className="bg-brand-yellow py-5">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-14 text-brand-black">
            {[
              { label: "Peso operativo", value: "21 Toneladas" },
              { label: "Motor", value: "Cummins 173 HP" },
              { label: "Profundidad máx.", value: "6.63 m" },
              { label: "Ubicación", value: "Cali, Colombia" },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="font-black text-lg md:text-xl leading-none">{stat.value}</p>
                <p className="text-[10px] font-bold opacity-60 mt-0.5 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURED CAROUSEL ═══ */}
      {carouselMachines.length > 0 && (
        <FeaturedCarousel
          featuredMachines={carouselMachines as any}
          title="Máquinas Destacadas"
          className="mt-0 mb-16"
        />
      )}

      {/* ═══ CATALOG ═══ */}
      <section id="catalogo" className="py-8 md:py-16 bg-white text-brand-black">
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
            <p className="text-gray-500 max-w-xs text-sm">Equipos listos para trabajar en tu proyecto</p>
          </div>

          <CatalogSearch machines={machines} />

          {/* Bottom CTA */}
          <div className="mt-16 bg-brand-black rounded-3xl p-8 md:p-12 text-center text-white border border-brand-gray/20 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-yellow/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-yellow/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            <h3 className="text-2xl md:text-4xl font-bold mb-4 relative z-10">¿No encuentras la máquina que buscas?</h3>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto text-lg relative z-10">
              Contamos con una amplia red de proveedores. Contáctanos con el equipo que necesitas y lo conseguimos al mejor precio.
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
