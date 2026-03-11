import Link from "next/link";
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-brand-black border-t border-brand-gray/30 text-gray-400 py-12">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-white font-bold text-lg mb-4">Consumaquinayequipos</h3>
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
