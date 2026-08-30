import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Excavadora Zoomlion ZE215G 21 Toneladas | Venta en Cali, Valle del Cauca y Colombia",
  description:
    "Venta excavadora hidráulica Zoomlion ZE215G 21 toneladas. Motor Cummins 173 HP. Entrega inmediata Palmira y Cali, Valle del Cauca. Despacho a Buenaventura, Tulúa, Buga, Cartago, Popayán, Medellín y todo Colombia. Cotiza por WhatsApp.",
  keywords: [
    "excavadora Zoomlion ZE215G Cali",
    "excavadora 21 toneladas Valle del Cauca",
    "excavadora hidráulica Cali Colombia",
    "Zoomlion excavadora Palmira",
    "comprar excavadora Cali",
    "excavadora 21 toneladas Colombia",
    "maquinaria pesada Cali",
    "excavadora Buenaventura",
    "excavadora Tulúa Valle",
    "excavadora Buga Colombia",
    "excavadora Cartago Valle",
    "maquinaria pesada Valle del Cauca",
    "excavadora Popayán Cauca",
    "Zoomlion Colombia precio",
    "excavadora sobre orugas Colombia",
    "excavadora minería Colombia",
    "maquinaria pesada Medellín",
    "venta excavadora usada nueva Colombia",
  ],
  openGraph: {
    title: "Excavadora Zoomlion ZE215G 21T – Entrega desde Palmira, Valle del Cauca",
    description:
      "Motor Cummins 173 HP · Cabina ROPS · Sistema E-COT · Disponible en Cali, Palmira y despacho a todo Colombia. ¡Cotiza ahora!",
    type: "website",
    locale: "es_CO",
  },
};

// JSON-LD Schema para Google — ayuda a aparecer en búsquedas de producto
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      "name": "Excavadora Zoomlion ZE215G 21 Toneladas",
      "description": "Excavadora hidráulica sobre orugas de 21 toneladas. Motor Cummins B6.7 173 HP. Sistema hidráulico E-COT. Cabina ROPS con aire acondicionado. Entrega inmediata en Palmira, Cali y Valle del Cauca.",
      "brand": { "@type": "Brand", "name": "Zoomlion" },
      "model": "ZE215G",
      "sku": "ZOOMLION-ZE215G-21T",
      "mpn": "ZE215G",
      "image": ["https://consumaquinayequipos.com/zoomlion.png"],
      "category": "Excavadora hidráulica sobre orugas",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "reviewCount": "8"
      },
      "review": [
        {
          "@type": "Review",
          "reviewRating": { "@type": "Rating", "ratingValue": "5" },
          "author": { "@type": "Person", "name": "Cliente Verificado" }
        }
      ],
      "offers": {
        "@type": "Offer",
        "priceCurrency": "COP",
        "price": "580000000",
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition",
        "url": "https://consumaquinayequipos.com/excavadora-zoomlion-ze215g",
        "seller": { "@type": "Organization", "name": "Consumaquinayequipos" },
        "hasMerchantReturnPolicy": {
          "@type": "MerchantReturnPolicy",
          "applicableCountry": "CO",
          "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted"
        },
        "shippingDetails": {
          "@type": "OfferShippingDetails",
          "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "COP" },
          "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "CO" },
          "deliveryTime": {
            "@type": "ShippingDeliveryTime",
            "handlingTime": { "@type": "QuantitativeValue", "minValue": "0", "maxValue": "2", "unitCode": "d" },
            "transitTime": { "@type": "QuantitativeValue", "minValue": "1", "maxValue": "5", "unitCode": "d" }
          }
        }
      },
      "additionalProperty": [
        { "@type": "PropertyValue", "name": "Peso operativo", "value": "22000 kg" },
        { "@type": "PropertyValue", "name": "Potencia motor", "value": "129 kW / 173 HP" },
        { "@type": "PropertyValue", "name": "Profundidad excavación", "value": "6680 mm" }
      ]
    }
  ]
};

const WHATSAPP_NUMBER = "573105753752";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "¡Hola! Vengo de la página web de Consumaquinayequipos y estoy interesado en la Excavadora Zoomlion ZE215G de 21 toneladas. ¿Me pueden dar más información y el precio?"
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

const specs = [
  { label: "Marca", value: "Zoomlion", icon: "🏭" },
  { label: "Modelo", value: "ZE215G", icon: "🔧" },
  { label: "Motor", value: "Cummins B6.7 — 129 kW (173 HP) @ 2.200 rpm", icon: "⚡" },
  { label: "Torque máximo", value: "881 Nm", icon: "💪" },
  { label: "Peso operativo", value: "22.000 kg", icon: "⚖️" },
  { label: "Capacidad del cucharón", value: "1,1 m³ (reforzado)", icon: "🪣" },
  { label: "Prof. máx. de excavación", value: "6.680 mm", icon: "📏" },
  { label: "Altura máx. de excavación", value: "9.820 mm", icon: "📐" },
  { label: "Alcance máx. de excavación", value: "9.920 mm", icon: "🎯" },
  { label: "Fuerza de excavación (cucharón)", value: "150 kN", icon: "🦾" },
  { label: "Fuerza de excavación (brazo)", value: "109 kN", icon: "🦾" },
  { label: "Velocidad de desplazamiento", value: "5,5 / 3,5 km/h", icon: "🚀" },
  { label: "Fuerza de tracción", value: "210 kN", icon: "🔗" },
  { label: "Caudal hidráulico máximo", value: "442 L/min (2 × 221 L/min)", icon: "💧" },
  { label: "Sistema hidráulico", value: "Flujo positivo Zoomlion E-COT", icon: "🔄" },
  { label: "Pluma", value: "5.700 mm", icon: "📏" },
  { label: "Brazo", value: "2.925 mm", icon: "📏" },
  { label: "Zapatas de acero", value: "700 mm", icon: "🦺" },
  { label: "Rodillos inferiores", value: "8 por lado", icon: "⚙️" },
  { label: "Rodillo superior", value: "1 por lado", icon: "⚙️" },
  { label: "Tanque de combustible", value: "360 L", icon: "⛽" },
  { label: "Sistema DEF (AdBlue)", value: "48 L", icon: "🌿" },
];

const features = [
  { title: "Cabina ROPS Certificada", desc: "Seguridad máxima con estructura anti-vuelco homologada. Aire acondicionado incluido de fábrica.", icon: "🛡️" },
  { title: "Pantalla Táctil + Cámara", desc: "Monitor de gran formato y cámara de reversa incluida. Control total desde la cabina.", icon: "📱" },
  { title: "Línea para Martillo", desc: "Línea hidráulica para martillo rompedor incluida de fábrica. Lista para trabajar desde el día uno.", icon: "🔨" },
  { title: "Joystick Multifuncional", desc: "Control pilotado de alta precisión con asiento de suspensión mecánica y radio AM/FM.", icon: "🕹️" },
  { title: "Motor Cummins Certificado", desc: "Motor Tier 4 Final / Stage V de bajo consumo y alta confiabilidad comprobada en campo.", icon: "⚡" },
  { title: "Tren de Rodaje Reforzado", desc: "Diseñado para trabajo pesado en minería e infraestructura. Zapatas de acero de 700 mm.", icon: "⛓️" },
];

export default function LandingZoomlionZE215G() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* JSON-LD Schema para Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#1a1200]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(250,204,21,0.12)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(250,204,21,0.06)_0%,_transparent_60%)]" />

        {/* Animated grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(rgba(250,204,21,1) 1px, transparent 1px), linear-gradient(90deg, rgba(250,204,21,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        {/* Glow orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-yellow-400/30 bg-yellow-400/10 text-yellow-400 text-xs font-bold uppercase tracking-widest">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Entrega Inmediata · Palmira, Valle del Cauca
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-4 leading-[0.9]">
            <span className="block text-white">ZOOMLION</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-amber-500 drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]">
              ZE215G
            </span>
          </h1>

          <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 font-light mb-2">
            Excavadora Hidráulica sobre Orugas
          </p>
          <p className="text-yellow-400 font-black text-2xl sm:text-3xl mb-8">
            21 Toneladas
          </p>

          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Motor <strong className="text-white">Cummins 173 HP</strong> · Sistema hidráulico <strong className="text-white">E-COT</strong> · Cabina ROPS con A/C · Disponible para todo Colombia
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              id="hero-whatsapp-cta"
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-green-500 hover:bg-green-400 text-white font-black text-lg rounded-2xl transition-all duration-300 shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:shadow-[0_0_60px_rgba(34,197,94,0.6)] hover:scale-105"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Cotizar por WhatsApp
            </a>

            <a
              href="#especificaciones"
              id="hero-specs-cta"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-5 border border-yellow-400/40 hover:border-yellow-400 text-yellow-400 font-bold text-base rounded-2xl transition-all duration-300 hover:bg-yellow-400/10"
            >
              Ver Especificaciones
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto">
            {[
              { value: "173", unit: "HP", label: "Potencia" },
              { value: "21", unit: "T", label: "Peso Operativo" },
              { value: "9,9", unit: "m", label: "Alcance Máx." },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-yellow-400">
                  {stat.value}<span className="text-xl text-yellow-500">{stat.unit}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 animate-bounce">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── POR QUÉ ELEGIRLA ── */}
      <section className="py-20 md:py-28 bg-[#0d0d0d]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-yellow-400 text-xs font-bold uppercase tracking-[0.3em] mb-3 block">Por qué elegir la ZE215G</span>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
              Equipada para los proyectos<br />
              <span className="text-yellow-400">más exigentes de Colombia</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group relative p-6 rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] hover:border-yellow-400/30 transition-all duration-300"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="text-4xl mb-4">{f.icon}</div>
                  <h3 className="text-white font-black text-lg mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ESPECIFICACIONES ── */}
      <section id="especificaciones" className="py-20 md:py-28 bg-[#0a0a0a]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-14">
            <span className="text-yellow-400 text-xs font-bold uppercase tracking-[0.3em] mb-3 block">Ficha Técnica Completa</span>
            <h2 className="text-3xl md:text-5xl font-black text-white">
              Especificaciones <span className="text-yellow-400">Técnicas</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {specs.map((s, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-yellow-400/20 transition-all duration-200 group"
              >
                <span className="text-2xl shrink-0 mt-0.5">{s.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-gray-500 text-xs uppercase tracking-wider mb-1 group-hover:text-gray-400 transition-colors">{s.label}</div>
                  <div className="text-white font-bold text-sm sm:text-base">{s.value}</div>
                </div>
                <div className="text-yellow-400/40 group-hover:text-yellow-400/80 transition-colors shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Download spec sheet CTA */}
          <div className="mt-10 text-center">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              id="specs-whatsapp-cta"
              className="inline-flex items-center gap-3 px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-xl transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(250,204,21,0.3)]"
            >
              Solicitar ficha técnica completa
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── ENTREGA & COBERTURA ── */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-[#0d0d0d] to-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left */}
              <div>
                <span className="text-yellow-400 text-xs font-bold uppercase tracking-[0.3em] mb-3 block">Disponibilidad</span>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
                  Disponible ahora en<br />
                  <span className="text-yellow-400">Palmira, Valle del Cauca</span>
                </h2>
                <p className="text-gray-400 leading-relaxed mb-6">
                  La excavadora Zoomlion ZE215G está lista para entrega inmediata desde Palmira. 
                  Hacemos despachos a <strong className="text-white">Cali, Valle del Cauca</strong> y a 
                  cualquier ciudad de <strong className="text-white">Colombia</strong>.
                </p>
                <ul className="space-y-3">
                  {[
                    "Entrega inmediata – disponible en inventario",
                    "Transporte coordinado a todo Colombia",
                    "Asesoría técnica pre y post venta",
                    "Documentación y trámites incluidos",
                    "Financiación disponible – consultenos",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-gray-300">
                      <span className="text-yellow-400 font-black mt-0.5 shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right – locations */}
              <div className="space-y-4">
                {[
                  { city: "Palmira", region: "Valle del Cauca", badge: "Stock disponible", color: "green" },
                  { city: "Cali", region: "Valle del Cauca", badge: "Entrega rápida", color: "yellow" },
                  { city: "Colombia", region: "Todo el país", badge: "Despacho nacional", color: "yellow" },
                ].map((loc) => (
                  <div
                    key={loc.city}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.03]"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${loc.color === "green" ? "bg-green-500/20" : "bg-yellow-400/20"}`}>
                      📍
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-black">{loc.city}</div>
                      <div className="text-gray-500 text-xs">{loc.region}</div>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${loc.color === "green" ? "bg-green-500/20 text-green-400" : "bg-yellow-400/20 text-yellow-400"}`}>
                      {loc.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COBERTURA REGIONAL ── */}
      <section className="py-16 md:py-20 bg-[#0d0d0d]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <span className="text-yellow-400 text-xs font-bold uppercase tracking-[0.3em] mb-3 block">Cobertura</span>
            <h2 className="text-2xl md:text-4xl font-black text-white">
              La entregamos donde la necesitas
            </h2>
            <p className="text-gray-500 mt-3 text-sm max-w-xl mx-auto">
              Coordinamos el transporte desde Palmira a cualquier obra en Colombia
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[
              { city: "Cali", dept: "Valle del Cauca", priority: true },
              { city: "Palmira", dept: "Valle · Stock aquí", priority: true },
              { city: "Buenaventura", dept: "Valle del Cauca", priority: false },
              { city: "Tulúa", dept: "Valle del Cauca", priority: false },
              { city: "Buga", dept: "Valle del Cauca", priority: false },
              { city: "Cartago", dept: "Valle del Cauca", priority: false },
              { city: "Popayán", dept: "Cauca", priority: false },
              { city: "Medellín", dept: "Antioquia", priority: false },
              { city: "Bogotá", dept: "Cundinamarca", priority: false },
              { city: "Pasto", dept: "Nariño", priority: false },
              { city: "Pereira", dept: "Risaralda", priority: false },
              { city: "Barranquilla", dept: "Atlántico", priority: false },
            ].map((loc) => (
              <div
                key={loc.city}
                className={`p-3 rounded-xl border text-center transition-all ${
                  loc.priority
                    ? "border-yellow-400/40 bg-yellow-400/10"
                    : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                }`}
              >
                <div className={`font-black text-sm ${loc.priority ? "text-yellow-400" : "text-white"}`}>
                  {loc.city}
                </div>
                <div className="text-gray-500 text-[10px] mt-0.5">{loc.dept}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-[#0a0a0a] to-[#0a0a0a]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(250,204,21,0.08)_0%,_transparent_70%)]" />

        <div className="relative z-10 container mx-auto px-4 text-center max-w-3xl">
          <div className="text-5xl mb-6">🏗️</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            ¿Listo para potenciar<br />
            <span className="text-yellow-400">tu proyecto?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            Habla con nuestro equipo ahora mismo. Te asesoramos sin compromiso y coordinamos la entrega donde la necesites.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              id="final-whatsapp-cta"
              className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-green-500 hover:bg-green-400 text-white font-black text-lg rounded-2xl transition-all duration-300 shadow-[0_0_50px_rgba(34,197,94,0.35)] hover:shadow-[0_0_70px_rgba(34,197,94,0.5)] hover:scale-105"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Hablar por WhatsApp Ahora
            </a>
            <a
              href="tel:+573105753752"
              id="final-call-cta"
              className="inline-flex items-center justify-center gap-2 px-8 py-5 border border-white/20 hover:border-white/40 text-white font-bold rounded-2xl transition-all duration-300 hover:bg-white/5"
            >
              📞 +57 310 575 3752
            </a>
          </div>

          <p className="mt-8 text-gray-600 text-sm">
            📍 Palmira, Valle del Cauca · Despachos a todo Colombia
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-8 bg-[#080808]">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <Link href="/" className="hover:text-yellow-400 transition-colors font-bold text-gray-400">
            ← Volver a Consumaquinayequipos
          </Link>
          <span>© 2026 Consumaquinayequipos · Todos los derechos reservados</span>
          <span>Palmira, Valle del Cauca · Colombia</span>
        </div>
      </footer>

      {/* ── FLOATING WHATSAPP ── */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        id="floating-whatsapp"
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-green-500 text-white shadow-[0_0_30px_rgba(34,197,94,0.5)] hover:bg-green-400 hover:scale-110 transition-all duration-300 flex items-center justify-center group"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="absolute right-full mr-4 bg-black/90 text-white px-3 py-1.5 rounded-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
          ¡Cotiza por WhatsApp!
        </span>
      </a>
    </div>
  );
}
