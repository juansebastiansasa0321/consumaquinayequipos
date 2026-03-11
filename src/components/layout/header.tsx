"use client";

import Link from "next/link";
import { Hammer, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-brand-gray/20 bg-brand-black/95 backdrop-blur supports-[backdrop-filter]:bg-brand-black/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <Hammer className="h-6 w-6 text-brand-yellow" />
                    <span className="font-bold text-xl text-white">Consumaquinayequipos</span>
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
