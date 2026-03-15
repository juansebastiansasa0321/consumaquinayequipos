"use client";

import { MessageCircle } from "lucide-react";

interface ContactSellerButtonProps {
    phone: string;
    message: string;
    machineId: string;
}

export function ContactSellerButton({ phone, message, machineId }: ContactSellerButtonProps) {
    const handleClick = () => {
        // Llama a la API de tracking de manera silenciosa y no-bloqueante
        fetch(`/api/machines/${machineId}/click`, { method: "POST" })
            .catch(console.error);
    };
    
    return (
        <a
            href={`https://wa.me/${phone}?text=${message}`}
            target="_blank"
            rel="noreferrer"
            onClick={handleClick}
            className="flex-1 flex items-center justify-center gap-2 bg-brand-yellow hover:bg-yellow-400 text-brand-black font-bold py-4 rounded-xl transition-all shadow-md shadow-brand-yellow/20"
        >
            <MessageCircle className="w-5 h-5" /> Contactar por WhatsApp
        </a>
    );
}
