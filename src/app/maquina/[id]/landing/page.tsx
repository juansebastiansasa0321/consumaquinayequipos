export const dynamic = 'force-dynamic';
import Image from "next/image";
import type { Metadata } from "next";
import { Clock, MapPin, CheckCircle2, Tag, MessageCircle, Mail } from "lucide-react";
import { sql } from "@/lib/db";
import { notFound } from "next/navigation";
import { MachineGallery } from "@/components/ui/machine-gallery";
import { ContactSellerButton } from "@/components/ui/contact-seller-button";

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
  contact_phone?: string;
  contact_phone_2?: string;
  contact_email?: string;
  currency?: string;
};

async function getMachine(id: string): Promise<Machine | null> {
  try {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;
    const rows = await sql`SELECT * FROM machines WHERE id = ${numericId} AND status = 'published'`;
    if (rows.length === 0) return null;
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
    ? `${machine.currency === "USD" ? "US$" : "$"}${Number(machine.price).toLocaleString("es-CO")}`
    : "";

  return {
    title: `${machine.title}${price ? ` · ${price}` : ""} | Consumaquinayequipos`,
    description: `${machine.title}. ${machine.location}. ${machine.description?.slice(0, 130) || "Contáctanos por WhatsApp."}`,
    openGraph: {
      title: machine.title,
      images: machine.images?.[0] ? [{ url: machine.images[0] }] : [],
    },
  };
}

export default async function MachineLandingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const machine = await getMachine(id);
  if (!machine) notFound();

  const contactNumberRaw = machine.contact_phone || "573105753752";
  const contactPhoneNumber = contactNumberRaw.replace(/\D/g, "");
  const message = encodeURIComponent(
    `Hola, vi la publicación de "${machine.title}" en Consumaquinayequipos y me gustaría recibir más información.`
  );
  const contactNumber2Raw = machine.contact_phone_2 || "";
  const contactPhoneNumber2 = contactNumber2Raw.replace(/\D/g, "");

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <div className="container mx-auto px-4 py-6 md:py-10 max-w-5xl">

        {/* === HERO CARD === */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mb-6">

          {/* Gallery */}
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

          {/* Title + Stats */}
          <div className="px-6 pt-4 pb-2">
            <h1 className="text-2xl md:text-3xl font-black text-brand-black leading-tight mb-3">
              {machine.title}
            </h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
              {machine.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-brand-yellow" /> {machine.location}
                </span>
              )}
              {machine.hours > 0 && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-brand-yellow" />
                  {machine.hours.toLocaleString()} {machine.usage_type === "km" ? "km" : "horas de uso"}
                </span>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="px-6 py-3 border-t border-gray-100 mt-2">
            <span className="text-2xl md:text-3xl font-black text-brand-black">
              {machine.price
                ? `${machine.currency === "USD" ? "US$" : "$"}${Number(machine.price).toLocaleString("es-CO")} ${machine.currency === "USD" ? "USD" : ""}`
                : "Precio a consultar"}
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="px-6 py-5 flex flex-col gap-3 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row gap-3">
              <ContactSellerButton
                phone={contactPhoneNumber}
                message={message}
                machineId={machine.id}
              />
            </div>

            {(contactPhoneNumber2 || machine.contact_email) && (
              <div className="flex flex-col sm:flex-row gap-3">
                {contactPhoneNumber2 && (
                  <a
                    href={`https://wa.me/${contactPhoneNumber2}?text=${message}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-brand-black font-bold py-3 text-sm rounded-xl transition-all"
                  >
                    <MessageCircle className="w-4 h-4" /> Contacto alternativo
                  </a>
                )}
                {machine.contact_email && (
                  <a
                    href={`mailto:${machine.contact_email}?subject=Interés en ${machine.title}&body=Hola, estoy interesado en recibir más información sobre esta máquina.`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-brand-black font-bold py-3 text-sm rounded-xl transition-all"
                  >
                    <Mail className="w-4 h-4" /> Enviar Correo
                  </a>
                )}
              </div>
            )}

            <a
              href={`https://wa.me/${contactPhoneNumber}?text=${message}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 border-2 border-brand-black text-brand-black font-bold py-3 rounded-xl hover:bg-brand-black hover:text-white transition-all mt-2"
            >
              Más información por WhatsApp
            </a>
          </div>

          <p className="text-xs text-center text-gray-400 pb-4 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Venta verificada por Consumaquinayequipos
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

        {/* Location card */}
        {machine.location && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-yellow/20 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-brand-yellow" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Ubicación</p>
              <p className="font-bold text-brand-black">{machine.location}</p>
              <p className="text-xs text-gray-500">Despachos a todo Colombia</p>
            </div>
          </div>
        )}

      </div>

      {/* Footer mínimo */}
      <footer className="border-t border-gray-200 py-5 bg-white mt-8">
        <p className="text-center text-xs text-gray-400">
          © 2026 Consumaquinayequipos · {machine.location}
        </p>
      </footer>
    </div>
  );
}
