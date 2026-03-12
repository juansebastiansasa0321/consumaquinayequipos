"use client";

import { useState } from "react";
import { Send, MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name"),
            city: formData.get("city"),
            equipment: formData.get("equipment"),
            phone: formData.get("phone"),
        };

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setSuccess(true);
                (e.target as HTMLFormElement).reset();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen py-10 md:py-16">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-10 md:mb-14">
                    <div className="inline-flex items-center gap-2 bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                        Maquinaria Pesada
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black mb-3 text-brand-black">Contáctanos</h1>
                    <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base">
                        ¿Buscas maquinaria para tu proyecto? Déjanos tus datos y un asesor te contactará enseguida.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

                    {/* Left Side: Contact Info */}
                    <div className="bg-brand-black text-white p-7 md:p-12 flex flex-col justify-between">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-brand-yellow">Información de Contacto</h2>

                            <div className="space-y-6 md:space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                        <MapPin className="text-brand-yellow w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm md:text-base">Areas de Cobertura</h3>
                                        <p className="text-gray-400 text-xs md:text-sm mt-1">Chocó, Cauca y Valle del Cauca, Colombia.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                        <Phone className="text-brand-yellow w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm md:text-base">Teléfono / WhatsApp</h3>
                                        <a href="https://wa.me/573054265677" className="text-gray-400 text-xs md:text-sm mt-1 hover:text-brand-yellow transition-colors block">+57 305 426 5677</a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                        <Mail className="text-brand-yellow w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm md:text-base">Correo Electrónico</h3>
                                        <p className="text-gray-400 text-xs mt-1 break-all">consumaquinayequipos@icloud.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-4">
                            <a href="https://instagram.com/consumaquinayequipos" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-brand-yellow hover:text-brand-black transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="https://facebook.com/consumaquinayequipos" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-brand-yellow hover:text-brand-black transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Right Side: Contact Form */}
                    <div className="p-7 md:p-10">
                        <h2 className="text-xl md:text-2xl font-bold mb-5 text-brand-black">Solicitar Cotización</h2>

                        {success ? (
                            <div className="bg-green-50 text-green-800 p-8 rounded-2xl border border-green-200 text-center shadow-sm">
                                <CheckCircle2 className="w-20 h-20 mx-auto mb-6 text-green-500" />
                                <h3 className="font-bold text-2xl mb-3">¡Mensaje Enviado con Éxito!</h3>
                                <p className="text-lg mb-6">Gracias por contactarnos. Un asesor especializado se comunicará contigo al número proporcionado a la brevedad posible.</p>
                                
                                <div className="bg-white p-6 rounded-xl border border-green-100 mb-6">
                                    <p className="font-semibold text-gray-700 mb-4">¿Prefieres atención inmediata?</p>
                                    <a 
                                        href="https://wa.me/573054265677?text=Hola,%20acabo%20de%20llenar%20el%20formulario%20en%20su%20sitio%20web%20y%20me%20gustar%C3%ADa%20recibir%20m%C3%A1s%20informaci%C3%B3n." 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 px-6 rounded-lg transition-colors w-full sm:w-auto"
                                    >
                                        <MessageCircle className="w-5 h-5" /> Contactar por WhatsApp
                                    </a>
                                </div>

                                <button onClick={() => setSuccess(false)} className="text-green-700 hover:text-green-800 underline font-bold transition-colors">Volver al formulario</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre Completo *</label>
                                    <input required name="name" type="text" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-brand-black focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/20 outline-none transition-all" placeholder="Ej. Juan Pérez" />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono *</label>
                                        <input required name="phone" type="tel" minLength={10} maxLength={15} pattern="[0-9\s\-\+\(\)]+" title="Ingresa un número de teléfono válido (ej. 300 123 4567)" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-brand-black focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/20 outline-none transition-all" placeholder="Ej. 300 123 4567" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Ciudad *</label>
                                        <input required name="city" type="text" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-brand-black focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/20 outline-none transition-all" placeholder="Ej. Quibdó" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Equipo a Cotizar / Interés *</label>
                                    <input required name="equipment" type="text" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-brand-black focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/20 outline-none transition-all" placeholder="Ej. Excavadora Zoomlion 21T" />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-brand-yellow hover:bg-yellow-400 text-brand-black font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Enviando..." : (
                                        <>Enviar Solicitud <Send className="w-5 h-5" /></>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

// Temporary CheckCircle2 and MessageCircle import since they were missing above
import { CheckCircle2, MessageCircle } from "lucide-react";
