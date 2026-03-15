"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin } from "lucide-react";

// List of major Colombian departments and cities
const colombianLocations = [
    "Bogotá, D.C.",
    "Medellín, Antioquia",
    "Cali, Valle del Cauca",
    "Barranquilla, Atlántico",
    "Cartagena, Bolívar",
    "Cúcuta, Norte de Santander",
    "Bucaramanga, Santander",
    "Soacha, Cundinamarca",
    "Pereira, Risaralda",
    "Santa Marta, Magdalena",
    "Ibagué, Tolima",
    "Pasto, Nariño",
    "Manizales, Caldas",
    "Neiva, Huila",
    "Villavicencio, Meta",
    "Armenia, Quindío",
    "Valledupar, Cesar",
    "Montería, Córdoba",
    "Sincelejo, Sucre",
    "Popayán, Cauca",
    "Tunja, Boyacá",
    "Riohacha, La Guajira",
    "Florencia, Caquetá",
    "Quibdó, Chocó",
    "Arauca, Arauca",
    "Yopal, Casanare",
    "Mocoa, Putumayo",
    "San José del Guaviare, Guaviare",
    "Leticia, Amazonas",
    "Inírida, Guainía",
    "Mitú, Vaupés",
    "Puerto Carreño, Vichada"
];

interface LocationAutocompleteProps {
    value: string;
    onChange: (val: string) => void;
}

export default function LocationAutocomplete({ value, onChange }: LocationAutocompleteProps) {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        onChange(val);
        
        if (val.length > 0) {
            const filtered = colombianLocations.filter(loc => 
                loc.toLowerCase().includes(val.toLowerCase())
            );
            setSuggestions(filtered);
            setIsOpen(true);
        } else {
            setSuggestions([]);
            setIsOpen(false);
        }
    };

    const handleSelect = (suggestion: string) => {
        onChange(suggestion);
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            <input
                type="text"
                required
                value={value}
                onChange={handleChange}
                onFocus={() => { if (suggestions.length > 0) setIsOpen(true); }}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all"
                placeholder="Ej. Bogotá, D.C."
                autoComplete="off"
            />
            {isOpen && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-neutral-800 border border-neutral-600 rounded-xl max-h-60 overflow-y-auto shadow-2xl">
                    {suggestions.map((suggestion, idx) => (
                        <li 
                            key={idx}
                            onClick={() => handleSelect(suggestion)}
                            className="px-4 py-3 text-white hover:bg-neutral-700 cursor-pointer flex items-center gap-2 border-b border-neutral-700/50 last:border-0"
                        >
                            <MapPin className="w-4 h-4 text-brand-yellow" />
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
