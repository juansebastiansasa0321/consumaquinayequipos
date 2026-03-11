"use client";

import { useEffect, useState } from "react";
import { Users, MapPin, Phone, Settings2, Loader2, Calendar } from "lucide-react";

interface Contact {
    id: string;
    name: string;
    city: string;
    equipment: string;
    phone: string;
    created_at?: string;
    status?: string;
}

export default function AdminContacts() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchContacts = async () => {
        try {
            const response = await fetch("/api/contact");
            if (response.ok) {
                const data = await response.json();
                setContacts(data);
            } else {
                setError("Error al obtener los contactos");
            }
        } catch (err) {
            console.error(err);
            setError("Error de red");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("¿Seguro que deseas eliminar este contacto?")) return;
        try {
            await fetch(`/api/contact/${id}`, { method: 'DELETE' });
            fetchContacts();
        } catch (err) {
            console.error(err);
        }
    };

    const toggleStatus = async (contact: Contact) => {
        const newStatus = contact.status === 'contacted' ? 'pending' : 'contacted';
        try {
            await fetch(`/api/contact/${contact.id}`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });
            fetchContacts();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 flex justify-center items-center">
                <Loader2 className="w-12 h-12 text-brand-yellow animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-brand-black flex items-center gap-3">
                            <Users className="w-8 h-8 text-brand-yellow" />
                            Directorio de Contactos
                        </h1>
                        <p className="text-gray-500 mt-2">Lista de clientes que han solicitado información desde la web.</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 mb-6">
                        {error}
                    </div>
                )}

                {!loading && contacts.length === 0 && !error && (
                    <div className="bg-white p-12 rounded-2xl border text-center text-gray-500">
                        <p>No hay contactos registrados aún.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contacts.map((contact) => (
                        <div key={contact.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden flex flex-col h-full">
                            <div className={`absolute top-0 left-0 w-2 h-full ${contact.status === 'contacted' ? 'bg-green-500' : 'bg-brand-yellow'}`}></div>
                            
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-4 pl-2">
                                    <h3 className="text-xl font-bold text-brand-black">{contact.name}</h3>
                                    <span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold ${contact.status === 'contacted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {contact.status === 'contacted' ? 'Contactado' : 'Pendiente'}
                                    </span>
                                </div>
                                
                                <div className="space-y-3 text-sm text-gray-600 pl-2 mb-6">
                                    <p className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-400" /> {contact.phone}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400" /> {contact.city}
                                    </p>
                                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mt-4">
                                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1 font-semibold">
                                            <Settings2 className="w-3 h-3" /> Equipo de interés
                                        </p>
                                        <p className="font-medium text-brand-black">{contact.equipment}</p>
                                    </div>
                                    {contact.created_at && (
                                        <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> 
                                            {new Date(contact.created_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Actions Footer */}
                            <div className="pt-4 border-t border-gray-100 pl-2 mt-auto grid grid-cols-2 gap-2">
                                <a 
                                    href={`https://wa.me/57${contact.phone.replace(/\D/g,'')}?text=Hola%20${encodeURIComponent(contact.name)},%20te%20contacto%20de%20Consum%C3%A1quina%20y%20Equipos%20en%20respuesta%20a%20tu%20inter%C3%A9s%20por%20${encodeURIComponent(contact.equipment)}...`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="col-span-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold text-sm text-center transition-colors flex items-center justify-center gap-2 shadow-sm"
                                >
                                   Contacto por WhatsApp
                                </a>
                                <button 
                                    onClick={() => toggleStatus(contact)}
                                    className="px-2 py-2 text-xs font-bold rounded-lg border transition-colors bg-gray-50 text-gray-700 hover:bg-gray-100"
                                >
                                    {contact.status === 'contacted' ? 'Marcar Pendiente' : 'Marcar Contactado'}
                                </button>
                                <button 
                                    onClick={() => handleDelete(contact.id)}
                                    className="px-2 py-2 text-xs font-bold rounded-lg border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                >
                                    Eliminar
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
