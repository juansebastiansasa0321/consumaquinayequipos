import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sql } from "@/lib/db";

type Machine = {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  hours: number;
  usage_type: string;
  location: string;
  images: string[];
  tags: string[];
  seller_name: string;
  seller_email: string;
  status: string;
};

async function getMachine(id: string): Promise<Machine | null> {
  try {
    const rows = await sql`
      SELECT m.*, u.name as seller_name, u.email as seller_email
      FROM machines m
      LEFT JOIN users u ON m.user_id = u.id
      WHERE m.id = ${id} AND m.status = 'published'
      LIMIT 1
    `;
    if (!rows.length) return null;
    return rows[0] as Machine;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const machine = await getMachine(id);
  if (!machine) return { title: "Máquina no encontrada" };

  const price = machine.price
    ? `${machine.currency === "USD" ? "US$" : "$"}${Number(machine.price).toLocaleString("es-CO")} ${machine.currency === "USD" ? "USD" : "COP"}`
    : "";

  return {
    title: `${machine.title} – Venta en ${machine.location} | Consumaquinayequipos`,
    description: `${machine.title}${price ? ` · ${price}` : ""}. ${machine.location}. ${machine.description?.slice(0, 120) || "Contáctanos por WhatsApp para más información."}`,
    openGraph: {
      title: `${machine.title} | Consumaquinayequipos`,
      description: machine.description?.slice(0, 160) || "",
      images: machine.images?.[0] ? [{ url: machine.images[0] }] : [],
    },
  };
}

const WHATSAPP_BASE = "573105753752";

export default async function MachineLandingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const machine = await getMachine(id);
  if (!machine) notFound();

  const waMessage = encodeURIComponent(
    `¡Hola! Vi la publicación de "${machine.title}" en Consumaquinayequipos y me gustaría recibir más información y el precio.`
  );
  const waUrl = `https://wa.me/${WHATSAPP_BASE}?text=${waMessage}`;

  const priceStr = machine.price
    ? `${machine.currency === "USD" ? "US$" : "$"}${Number(machine.price).toLocaleString("es-CO")} ${machine.currency === "USD" ? "USD" : "COP"}`
    : null;

  // Parse description into spec lines (lines starting with ✅)
  const specLines = machine.description
    ? machine.description.split("\n").filter((l) => l.trim().startsWith("✅")).map((l) => l.replace(/^✅\s*/, "").trim())
    : [];
  const descParagraphs = machine.description
    ? machine.description.split("\n").filter((l) => !l.trim().startsWith("✅") && l.trim().length > 0)
    : [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-[80vh] flex items-end overflow-hidden bg-[#0a0a0a]">
        {machine.images?.[0] && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${machine.images[0]})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-[#0a0a0a]/20" />
          </>
        )}
        {!machine.images?.[0] && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#111] to-[#0a0a0a]" />
        )}

        <div className="relative z-10 container mx-auto px-4 pb-14 pt-20">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {machine.tags?.map((tag) => (
              <span key={tag} className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-400 border border-yellow-400/30">
                {tag}
              </span>
            ))}
            {machine.location && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-gray-300 border border-white/10">
                📍 {machine.location}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black leading-tight mb-4 max-w-3xl">
            {machine.title}
          </h1>

          {priceStr && (
            <div className="text-2xl sm:text-3xl font-black text-yellow-400 mb-6">
              {priceStr}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              id="hero-wa-cta"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-400 text-white font-black text-lg rounded-2xl transition-all hover:scale-105 shadow-[0_0_30px_rgba(34,197,94,0.4)]"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Cotizar por WhatsApp
            </a>
            <Link
              href={`/maquina/${id}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 border border-white/20 hover:border-white/40 text-white font-bold rounded-2xl transition-all hover:bg-white/5"
            >
              Ver en catálogo →
            </Link>
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      {machine.images && machine.images.length > 1 && (
        <section className="py-8 bg-[#0d0d0d]">
          <div className="container mx-auto px-4">
            <div className="flex gap-3 overflow-x-auto pb-3 hide-scrollbar">
              {machine.images.map((img, i) => (
                <div key={i} className="shrink-0 w-48 h-32 rounded-xl overflow-hidden border border-white/10">
                  <img src={img} alt={`${machine.title} foto ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SPECS ── */}
      {specLines.length > 0 && (
        <section className="py-16 bg-[#0a0a0a]">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-10">
              <span className="text-yellow-400 text-xs font-bold uppercase tracking-[0.3em] mb-3 block">Ficha Técnica</span>
              <h2 className="text-3xl md:text-4xl font-black text-white">Especificaciones</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {specLines.map((spec, i) => {
                const [label, ...rest] = spec.split(":");
                const value = rest.join(":").trim();
                return (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group">
                    <span className="text-yellow-400 font-black mt-0.5 shrink-0">✓</span>
                    <div>
                      {value ? (
                        <>
                          <span className="text-gray-500 text-xs uppercase tracking-wider block mb-0.5">{label.trim()}</span>
                          <span className="text-white font-bold text-sm">{value}</span>
                        </>
                      ) : (
                        <span className="text-white text-sm">{label}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── DESCRIPTION ── */}
      {descParagraphs.length > 0 && (
        <section className="py-12 bg-[#0d0d0d]">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl font-black text-white mb-6">Descripción</h2>
            {descParagraphs.map((p, i) => (
              <p key={i} className="text-gray-400 leading-relaxed mb-3">{p}</p>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA FINAL ── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(250,204,21,0.07)_0%,_transparent_70%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-px bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent" />
        <div className="relative z-10 container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 leading-tight">
            ¿Te interesa este equipo?
          </h2>
          <p className="text-gray-400 mb-8">
            Escríbenos por WhatsApp y te respondemos de inmediato con precio, disponibilidad y condiciones.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              id="final-wa-cta"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-green-500 hover:bg-green-400 text-white font-black text-lg rounded-2xl transition-all hover:scale-105 shadow-[0_0_40px_rgba(34,197,94,0.35)]"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Hablar por WhatsApp
            </a>
            <a
              href="tel:+573105753752"
              id="final-call-cta"
              className="inline-flex items-center justify-center gap-2 px-8 py-5 border border-white/20 hover:border-white/40 text-white font-bold rounded-2xl transition-all hover:bg-white/5"
            >
              📞 +57 310 575 3752
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-8 bg-[#080808]">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <Link href="/" className="hover:text-yellow-400 transition-colors font-bold text-gray-400">← Volver al catálogo</Link>
          <span>© 2026 Consumaquinayequipos · {machine.location}</span>
        </div>
      </footer>

      {/* ── FLOATING WA ── */}
      <a
        href={waUrl}
        target="_blank"
        rel="noreferrer"
        id="floating-wa"
        aria-label="WhatsApp"
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-green-500 shadow-[0_0_25px_rgba(34,197,94,0.5)] hover:bg-green-400 hover:scale-110 transition-all group"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="absolute right-full mr-4 bg-black/90 text-white px-3 py-1.5 rounded-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
          ¡Cotiza ahora!
        </span>
      </a>
    </div>
  );
}
