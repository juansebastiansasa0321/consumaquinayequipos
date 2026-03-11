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
        <div className="bg-gray-50 min-h-screen py-16">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-brand-black">Contáctanos</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        ¿Buscas maquinaria pesada para tu proyecto? Déjanos tus datos y un asesor especializado te contactará enseguida.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-2xl shadow-xl overflow-hidden">

                    {/* Left Side: Contact Info */}
                    <div className="bg-brand-black text-white p-12 flex flex-col justify-center">
                        <h2 className="text-3xl font-bold mb-8 text-brand-yellow">Información de Contacto</h2>

                        <div className="space-y-8 flex-1">
                            <div className="flex items-start gap-4">
                                <MapPin className="text-brand-yellow w-8 h-8 shrink-0" />
                                <div>
                                    <h3 className="font-bold text-lg">Áreas de Cobertura</h3>
                                    <p className="text-gray-400">Atendemos especialmente a las regiones de Chocó, Cauca y Valle del Cauca, Colombia.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <Phone className="text-brand-yellow w-8 h-8 shrink-0" />
                                <div>
                                    <h3 className="font-bold text-lg">Teléfono / WhatsApp</h3>
                                    <p className="text-gray-400">+57 305 426 5677</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <Mail className="text-brand-yellow w-8 h-8 shrink-0" />
                                <div>
                                    <h3 className="font-bold text-lg">Correo Electrónico</h3>
                                    <p className="text-gray-400">consumaquinayequipos@icloud.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 flex items-center gap-6">
                            <a href="https://instagram.com/consumaquinayequipos" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-yellow hover:text-brand-black transition-colors">
                                <Instagram className="w-6 h-6" />
                            </a>
                            <a href="https://facebook.com/consumaquinayequipos" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-yellow hover:text-brand-black transition-colors">
                                <Facebook className="w-6 h-6" />
                            </a>
                        </div>
                    </div>

                    {/* Right Side: Contact Form */}
                    <div className="p-12">
                        <h2 className="text-2xl font-bold mb-6 text-brand-black">Solicitar Cotización</h2>

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

                                <div className="grid grid-cols-2 gap-6">
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
