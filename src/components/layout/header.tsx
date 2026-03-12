"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-brand-gray/20 bg-brand-black/95 backdrop-blur supports-[backdrop-filter]:bg-brand-black/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-3 group">
                    {/* Logomark */}
                    <div className="relative flex items-center justify-center w-9 h-9 bg-brand-yellow rounded-xl overflow-hidden shrink-0 shadow-lg shadow-brand-yellow/20 group-hover:scale-105 transition-transform">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-yellow to-yellow-500" />
                        <span className="relative z-10 font-black text-brand-black text-2xl leading-none italic pr-0.5 mt-0.5">C</span>
                    </div>
                    {/* Logotype */}
                    <div className="flex flex-col">
                        <span className="font-black text-xl text-white leading-none tracking-tight">Consu<span className="text-brand-yellow">maquina</span></span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] leading-none mt-1">y Equipos</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-300">
                    <Link href="/" className="hover:text-brand-yellow transition-colors">Inicio</Link>
                    <Link href="/#catalogo" className="hover:text-brand-yellow transition-colors">Catálogo</Link>
                    <Link href="/contacto" className="px-4 py-2 bg-brand-yellow text-brand-black rounded-md font-bold hover:bg-yellow-400 transition-colors">Contactar</Link>
                </nav>

                {/* Mobile Toggle */}
                <button 
                    className="md:hidden text-white p-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Nav Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-brand-gray/20 bg-brand-black">
                    <nav className="flex flex-col px-4 py-4 space-y-4 text-sm font-medium text-gray-300">
                        <Link 
                            href="/" 
                            className="hover:text-brand-yellow transition-colors block"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Inicio
                        </Link>
                        <Link 
                            href="/#catalogo" 
                            className="hover:text-brand-yellow transition-colors block"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Catálogo
                        </Link>
                        <Link 
                            href="/contacto" 
                            className="inline-block px-4 py-2 bg-brand-yellow text-brand-black rounded-md font-bold hover:bg-yellow-400 transition-colors text-center"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Contactar
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
