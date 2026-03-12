import Link from "next/link";
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-brand-black border-t border-brand-gray/30 text-gray-400 py-12">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <Link href="/" className="flex items-center space-x-3 mb-4 inline-flex">
                        <div className="relative flex items-center justify-center w-8 h-8 bg-brand-yellow rounded-lg overflow-hidden shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-yellow to-yellow-500" />
                            <span className="relative z-10 font-black text-brand-black text-xl leading-none italic pr-0.5 mt-0.5">C</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-lg text-white leading-none tracking-tight">Consu<span className="text-brand-yellow">maquina</span></span>
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] leading-none mt-1">y Equipos</span>
                        </div>
                    </Link>
                    <p className="text-sm">Distribución especializada de maquinaria pesada, motores industriales y excavadoras para minería e infraestructura.</p>
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg mb-4">Cobertura</h3>
                    <ul className="space-y-2 text-sm flex flex-col">
                        <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-yellow" /> Chocó</li>
                        <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-yellow" /> Cauca</li>
                        <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-yellow" /> Valle del Cauca</li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg mb-4">Contacto</h3>
                    <ul className="space-y-3 text-sm flex flex-col">
                        <li>
                            <a href="tel:+573054265677" className="flex items-center gap-2 hover:text-brand-yellow transition-colors">
                                <Phone className="w-4 h-4 text-brand-yellow" /> +57 305 426 5677
                            </a>
                        </li>
                        <li>
                            <a href="mailto:consumaquinayequipos@icloud.com" className="flex items-center gap-2 hover:text-brand-yellow transition-colors break-all">
                                <Mail className="w-4 h-4 text-brand-yellow shrink-0" /> consumaquinayequipos@icloud.com
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg mb-4">Redes Sociales</h3>
                    <div className="flex space-x-4">
                        <a href="https://instagram.com/consumaquinayequipos" target="_blank" rel="noopener noreferrer" className="hover:text-brand-yellow">
                            <Instagram className="w-6 h-6" />
                        </a>
                        <a href="https://facebook.com/profile.php?id=61567117565706" target="_blank" rel="noopener noreferrer" className="hover:text-brand-yellow">
                            <Facebook className="w-6 h-6" />
                        </a>
                    </div>
                </div>
            </div>
            <div className="mt-8 pt-8 border-t border-brand-gray/30 text-center text-xs">
                &copy; {new Date().getFullYear()} Consumaquinayequipos. Todos los derechos reservados.
            </div>
        </footer>
    );
}
