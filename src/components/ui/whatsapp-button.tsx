import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
    const phoneNumber = "573054265677";
    const message = encodeURIComponent("¡Hola! Vengo de la página web de Consumaquinayequipos y me gustaría cotizar maquinaria.");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-transform hover:scale-110 flex items-center justify-center group"
            aria-label="Contactar por WhatsApp"
        >
            <MessageCircle className="w-8 h-8" />
            <span className="absolute right-full mr-4 bg-brand-black text-white px-3 py-1 rounded-md text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                ¡Cotiza por WhatsApp!
            </span>
        </a>
    );
}
