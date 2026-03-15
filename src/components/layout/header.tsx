"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header({ userName }: { userName?: string | null }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-brand-gray/20 bg-brand-black/95 backdrop-blur supports-[backdrop-filter]:bg-brand-black/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* User Greeting / Publish Button on the left of Logo */}
                    {userName ? (
                        <Link href="/dashboard" className="hover:opacity-80 transition-opacity font-semibold text-white bg-white/10 px-3 py-1.5 rounded-lg text-sm truncate max-w-[120px] flex items-center border border-white/5">
                            Hola, {userName.split(' ')[0]}
                        </Link>
                    ) : (
                        <Link href="/dashboard" className="hover:opacity-80 transition-opacity text-white font-bold bg-white/10 px-3 py-1.5 rounded-lg text-sm hidden sm:block border border-white/5">
                            Publicar
                        </Link>
                    )}

                    <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
                        {/* Logomark */}
                        <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-brand-yellow rounded-xl overflow-hidden shrink-0 shadow-lg shadow-brand-yellow/20 group-hover:scale-105 transition-transform">
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-yellow to-yellow-500" />
                            <span className="relative z-10 font-black text-brand-black text-xl sm:text-2xl leading-none italic pr-0.5 mt-0.5">C</span>
                        </div>
                        {/* Logotype */}
                        <div className="flex flex-col">
                            <span className="font-black text-lg sm:text-xl text-white leading-none tracking-tight">Consu<span className="text-brand-yellow">maquina</span></span>
                            <span className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] leading-none mt-1">y Equipos</span>
                        </div>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-300">
                    <Link href="/" className="hover:text-brand-yellow transition-colors">Inicio</Link>
                    <Link href="/#catalogo" className="hover:text-brand-yellow transition-colors">Catálogo</Link>
                    
                    {userName ? (
                        <>
                            <Link href="/dashboard/machines" className="hover:text-brand-yellow transition-colors text-brand-yellow font-bold">Tus Anuncios</Link>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="hover:text-brand-yellow transition-colors">Ingresar</Link>
                        </>
                    )}

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
                        {userName ? (
                            <>
                                <Link 
                                    href="/dashboard" 
                                    className="hover:text-brand-yellow transition-colors block text-white font-semibold"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Hola, {userName}
                                </Link>
                                <Link 
                                    href="/dashboard/machines" 
                                    className="hover:text-brand-yellow transition-colors block text-brand-yellow font-bold"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Tus Anuncios
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link 
                                    href="/dashboard" 
                                    className="hover:text-brand-yellow transition-colors block text-white font-bold"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Publicar Equipo
                                </Link>
                                <Link 
                                    href="/login" 
                                    className="hover:text-brand-yellow transition-colors block"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Ingresar
                                </Link>
                            </>
                        )}
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
