export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, Clock, CheckCircle2, Phone, MessageCircle, Zap, Shield, Truck, Star } from "lucide-react";
import { sql } from "@/lib/db";
import { MachineGallery } from "@/components/ui/machine-gallery";
import { notFound } from "next/navigation";

type Machine = {
  id: string; title: string; description: string; price: number; hours: number;
  location: string; tags: string[]; images: string[]; is_featured: boolean;
  usage_type?: string; contact_phone?: string; contact_phone_2?: string;
  contact_email?: string; currency?: string; is_urgent?: boolean;
  seo_title?: string; seo_description?: string;
};

async function getMachine(id: string): Promise<Machine | null> {
  try {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;
    const rows = await sql`SELECT * FROM machines WHERE id = ${numericId} AND status = 'published'`;
    return rows.length ? rows[0] as Machine : null;
  } catch { return null; }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const machine = await getMachine(id);
  if (!machine) return { title: "Máquina no encontrada" };

  const isNew = machine.hours === 0;
  const condicion = isNew ? "Nuevo" : `${machine.hours?.toLocaleString() ?? ""} horas de uso`;
  const defaultTitle = `${machine.title} | ${condicion} | ${machine.location ?? "Colombia"} — Consumaquinayequipos`;
  const defaultDesc = `${machine.title}. ${machine.location ?? ""}. ${isNew ? "Equipo nuevo, 0 horas de uso." : `${machine.hours?.toLocaleString()} ${machine.usage_type === "km" ? "km" : "horas"} de uso.`} Motor Cummins 173 HP. Contáctanos: +57 310 575 3752.`;

  const seoTitle = (machine as any).seo_title || defaultTitle;
  const seoDesc = (machine as any).seo_description || defaultDesc;
  const canonical = `https://consumaquinayequipos.com/maquina/${id}/landing`;
  const ogImage = machine.images?.[0];

  return {
    title: seoTitle,
    description: seoDesc,
    keywords: [
      machine.title,
      "Zoomlion ZE215E", "excavadora 21 toneladas", "retroexcavadora 21 toneladas",
      "excavadora Colombia", "maquinaria pesada Cali", "excavadora nueva Colombia",
      "Cat 320 Colombia", "Komatsu PC200", "Hitachi ZX200", "Volvo EC220",
      machine.location ?? "",
    ].filter(Boolean),
    alternates: { canonical },
    openGraph: {
      title: seoTitle,
      description: seoDesc,
      type: "website",
      url: canonical,
      locale: "es_CO",
      siteName: "Consumaquinayequipos",
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: machine.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDesc,
      images: ogImage ? [ogImage] : [],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  };
}

export default async function MachineLandingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const machine = await getMachine(id);
  if (!machine) notFound();

  const phone = (machine.contact_phone || "573105753752").replace(/\D/g, "");
  const phone2 = machine.contact_phone_2 ? machine.contact_phone_2.replace(/\D/g, "") : null;
  const waMsg = encodeURIComponent(`Hola, vi la publicación de "${machine.title}" en consumaquinayequipos.com y me gustaría recibir más información y el precio final.`);
  const isNew = machine.hours === 0;
  const priceFormatted = machine.price
    ? `${machine.currency === "USD" ? "US$" : "$"}${Number(machine.price).toLocaleString("es-CO")}${machine.currency === "USD" ? " USD" : " COP"}`
    : null;

  const specs = [
    { icon: "⚖️", label: "Peso operativo", value: "21.5 toneladas" },
    { icon: "⚡", label: "Motor", value: "Cummins 173 HP" },
    { icon: "⬇️", label: "Profundidad máx.", value: "6.63 m" },
    { icon: "💪", label: "Fuerza de excavación", value: "138 kN" },
    { icon: "🔄", label: "Par de giro", value: "67.1 kN·m" },
    { icon: "🛢️", label: "Capacidad cuchara", value: "0.93 m³" },
  ];

  const benefits = [
    { icon: Shield, title: "Garantía de fábrica", desc: "Equipo nuevo con respaldo directo Zoomlion" },
    { icon: Truck, title: "Despacho a todo Colombia", desc: "Logística desde Cali a cualquier región" },
    { icon: Zap, title: "Entrega inmediata", desc: "Disponible ahora, no esperes meses" },
    { icon: Star, title: "Precio competitivo", desc: "Alternativa sólida a Cat, Komatsu e Hitachi" },
  ];

  // JSON-LD Schema para esta máquina
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "name": machine.title,
        "description": machine.description || `${machine.title} disponible en ${machine.location ?? "Colombia"}.`,
        "brand": { "@type": "Brand", "name": "Zoomlion" },
        "model": "ZE215E",
        "category": "Excavadora hidráulica sobre orugas",
        "image": machine.images ?? [],
        "offers": {
          "@type": "Offer",
          "priceCurrency": machine.currency ?? "COP",
          "price": machine.price ?? undefined,
          "availability": "https://schema.org/InStock",
          "itemCondition": isNew ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
          "url": `https://consumaquinayequipos.com/maquina/${machine.id}/landing`,
          "seller": { "@type": "Organization", "name": "Consumaquinayequipos", "telephone": "+573105753752" }
        },
        "additionalProperty": [
          { "@type": "PropertyValue", "name": "Peso operativo", "value": "21.5 toneladas" },
          { "@type": "PropertyValue", "name": "Motor", "value": "Cummins 173 HP" },
          { "@type": "PropertyValue", "name": "Profundidad de excavación", "value": "6.63 m" },
          { "@type": "PropertyValue", "name": "Condición", "value": isNew ? "Nuevo" : "Usado" },
        ]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://consumaquinayequipos.com" },
          { "@type": "ListItem", "position": 2, "name": "Catálogo", "item": "https://consumaquinayequipos.com/#catalogo" },
          { "@type": "ListItem", "position": 3, "name": machine.title, "item": `https://consumaquinayequipos.com/maquina/${machine.id}/landing` }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ══════════════════════════════════
          HERO con galería
      ══════════════════════════════════ */}
      <div className="bg-[#111] relative">
        <div className="max-w-5xl mx-auto">
          <MachineGallery images={machine.images} title={machine.title} />
        </div>
        {isNew && (
          <div className="absolute top-4 left-4 z-20">
            <span className="flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> EQUIPO NUEVO
            </span>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════
          HEADER STICKY con CTA
      ══════════════════════════════════ */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-black text-gray-900 text-sm md:text-base truncate">{machine.title}</p>
            {priceFormatted && <p className="text-brand-yellow font-black text-sm">{priceFormatted}</p>}
          </div>
          <a
            href={`https://wa.me/${phone}?text=${waMsg}`}
            target="_blank" rel="noreferrer"
            className="shrink-0 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-black px-4 py-2.5 rounded-xl transition-all text-sm shadow-lg shadow-green-500/30"
          >
            <MessageCircle className="w-4 h-4" /> Cotizar ahora
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

        {/* ══════════════════════════════════
            TÍTULO + PRECIO + META
        ══════════════════════════════════ */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          {/* Tags */}
          {machine.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {machine.tags.map(t => (
                <span key={t} className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  {t}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-4">
            {machine.title}
          </h1>

          {/* Meta info */}
          <div className="flex flex-wrap gap-3 mb-5">
            {machine.location && (
              <span className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                <MapPin className="w-4 h-4 text-yellow-500" /> {machine.location}
              </span>
            )}
            {isNew ? (
              <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" /> Equipo Nuevo · 0 horas
              </span>
            ) : machine.hours > 0 ? (
              <span className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                <Clock className="w-4 h-4 text-yellow-500" /> {machine.hours.toLocaleString()} {machine.usage_type === "km" ? "km" : "horas"}
              </span>
            ) : null}
          </div>

          {/* Precio */}
          <div className="flex items-end gap-3 py-4 border-t border-b border-gray-100 mb-6">
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Precio</p>
              <p className="text-3xl md:text-4xl font-black text-gray-900">
                {priceFormatted || <span className="text-xl">Consultar precio</span>}
              </p>
              <p className="text-xs text-gray-400 mt-1">Precio negociable · Financiación disponible</p>
            </div>
          </div>

          {/* CTA principal */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`https://wa.me/${phone}?text=${waMsg}`}
              target="_blank" rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2.5 bg-green-500 hover:bg-green-600 text-white font-black py-4 px-6 rounded-xl transition-all text-base shadow-xl shadow-green-500/25"
            >
              <MessageCircle className="w-5 h-5" /> Contactar por WhatsApp
            </a>
            <a
              href={`tel:+57${phone}`}
              className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-6 rounded-xl transition-all text-base"
            >
              <Phone className="w-5 h-5" /> Llamar
            </a>
          </div>
          {phone2 && (
            <a
              href={`https://wa.me/${phone2}?text=${waMsg}`}
              target="_blank" rel="noreferrer"
              className="mt-3 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-xl transition-all text-sm w-full"
            >
              <MessageCircle className="w-4 h-4" /> Contacto alternativo (WhatsApp)
            </a>
          )}
          <p className="text-xs text-center text-gray-400 mt-3 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Vendedor verificado · Transacción segura
          </p>
        </div>

        {/* ══════════════════════════════════
            FICHA TÉCNICA
        ══════════════════════════════════ */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-7 bg-yellow-400 rounded-full" />
            <h2 className="text-lg font-black text-gray-900">Ficha Técnica</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {specs.map(s => (
              <div key={s.label} className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                <p className="text-2xl mb-1">{s.icon}</p>
                <p className="font-black text-gray-900 text-sm leading-tight">{s.value}</p>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════
            DESCRIPCIÓN
        ══════════════════════════════════ */}
        {machine.description && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-7 bg-yellow-400 rounded-full" />
              <h2 className="text-lg font-black text-gray-900">Descripción del equipo</h2>
            </div>
            <div className="text-gray-600 leading-relaxed whitespace-pre-line text-sm md:text-base">
              {machine.description}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════
            POR QUÉ COMPRARNOS
        ══════════════════════════════════ */}
        <div className="bg-gray-900 rounded-2xl p-6 md:p-8 text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-7 bg-yellow-400 rounded-full" />
            <h2 className="text-lg font-black">¿Por qué comprar con nosotros?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map(b => (
              <div key={b.title} className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shrink-0">
                  <b.icon className="w-5 h-5 text-gray-900" />
                </div>
                <div>
                  <p className="font-black text-white text-sm">{b.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════
            UBICACIÓN
        ══════════════════════════════════ */}
        {machine.location && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-5">
            <div className="w-14 h-14 bg-yellow-50 border border-yellow-200 rounded-2xl flex items-center justify-center shrink-0">
              <MapPin className="w-7 h-7 text-yellow-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Ubicación actual</p>
              <p className="font-black text-gray-900 text-lg mt-0.5">{machine.location}</p>
              <p className="text-sm text-gray-500">Coordinamos el despacho a cualquier parte de Colombia</p>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════
            CTA FINAL — Gran cierre
        ══════════════════════════════════ */}
        <div className="bg-yellow-400 rounded-2xl p-6 md:p-10 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-yellow-900 mb-2">¿Listo para adquirir este equipo?</p>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Habla con nosotros ahora</h2>
          <p className="text-gray-800 text-sm mb-6 max-w-md mx-auto">
            Respondemos inmediatamente. Resolvemos todas tus dudas sobre precio, financiación y logística de entrega.
          </p>
          <a
            href={`https://wa.me/${phone}?text=${waMsg}`}
            target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-3 bg-gray-900 text-white font-black px-8 py-4 rounded-xl hover:bg-gray-800 transition-all text-base shadow-xl"
          >
            <MessageCircle className="w-5 h-5" /> Escribir por WhatsApp · +57 310 575 3752
          </a>
        </div>

      </div>

      {/* Footer mínimo */}
      <footer className="border-t border-gray-200 py-6 bg-white mt-8">
        <p className="text-center text-xs text-gray-400">
          © 2026 Consumaquinayequipos · Cali, Colombia · consumaquinayequipos.com
        </p>
      </footer>
    </div>
  );
}
