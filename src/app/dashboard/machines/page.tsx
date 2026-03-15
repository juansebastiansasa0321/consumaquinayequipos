"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Tag, Loader2, Sparkles, MessageCircle, Clock } from "lucide-react";

type Machine = {
    id: string;
    title: string;
    price: number | null;
    status: string;
    visibility_tier: "gratis" | "plata" | "oro" | "oro_premium";
    created_at: string;
    expires_at: string | null;
    whatsapp_clicks: number;
    images: string[];
};

export default function ClientMachinesPage() {
    const [machines, setMachines] = useState<Machine[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMachines();
    }, []);

    const fetchMachines = async () => {
        try {
            const res = await fetch("/api/dashboard/machines");
            const data = await res.json();
            if (data.machines) {
                setMachines(data.machines);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Seguro que deseas eliminar esta máquina? No se puede deshacer.")) return;
        try {
            const res = await fetch(`/api/machines/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchMachines(); // Refresh list
            } else {
                alert("Hubo un error al eliminar la máquina.");
            }
        } catch (err) {
            console.error(err);
            alert("Error de conexión");
        }
    };

    const handleEdit = (id: string) => {
        // Redirigir a la página de edición
        window.location.href = `/dashboard/machines/${id}/edit`;
    };

    const getDaysRemaining = (expiresAt: string | null) => {
        if (!expiresAt) return { text: "Sin Límite", isExpired: false, isWarning: false };
        const now = new Date();
        const exp = new Date(expiresAt);
        const diffTime = exp.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 0) return { text: "Vencida", isExpired: true, isWarning: false };
        if (diffDays <= 5) return { text: `Quedan ${diffDays} días`, isExpired: false, isWarning: true };
        return { text: `Quedan ${diffDays} días`, isExpired: false, isWarning: false };
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-neutral-800 p-6 rounded-2xl border border-neutral-700 shadow-xl">
                <div>
                    <h1 className="text-2xl font-bold text-white">Mis Máquinas</h1>
                    <p className="text-gray-400 text-sm">Gestiona tu inventario y destaca tus anuncios.</p>
                </div>
                <Link
                    href="/dashboard/machines/new"
                    className="flex items-center gap-2 px-4 py-2 bg-brand-yellow hover:bg-yellow-400 text-brand-black font-semibold rounded-xl transition-colors shadow-lg shadow-brand-yellow/20"
                >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">Nueva Máquina</span>
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-yellow" />
                </div>
            ) : machines.length === 0 ? (
                <div className="text-center bg-neutral-800 rounded-2xl border border-neutral-700 p-12 shadow-xl">
                    <Tag className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">No tienes máquinas publicadas</h3>
                    <p className="text-gray-400 mb-6">Empieza a vender publicando tu primer anuncio gratis.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {machines.map((machine) => (
                        <div key={machine.id} className="bg-neutral-800 rounded-2xl border border-neutral-700 overflow-hidden flex flex-col sm:flex-row hover:border-neutral-600 transition-colors shadow-lg">
                            <div className="sm:w-48 h-48 sm:h-auto bg-neutral-900 relative">
                                {machine.images && machine.images.length > 0 ? (
                                    <img src={machine.images[0]} alt={machine.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-neutral-600">
                                        Sin Imagen
                                    </div>
                                )}
                                {machine.visibility_tier !== "gratis" && (
                                     <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-amber-600 text-black text-xs font-bold px-2 py-1 rounded-md shadow flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" />
                                        {machine.visibility_tier.replace('_', ' ').toUpperCase()}
                                     </div>
                                )}
                                {machine.expires_at && new Date(machine.expires_at) < new Date() && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <span className="bg-red-500 text-white font-bold px-3 py-1 rounded-lg shadow-lg">Publicación Vencida</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-white line-clamp-1">{machine.title}</h3>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-lg ${machine.status === 'published' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                                                {machine.status === 'published' ? 'Pública' : 'Borrador'}
                                            </span>
                                            {machine.expires_at ? (() => {
                                                const timer = getDaysRemaining(machine.expires_at);
                                                return (
                                                    <span className={`text-[10px] sm:text-xs flex items-center gap-1 px-2 py-1 rounded-md mb-1 font-bold ${
                                                        timer.isExpired ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                                                        : timer.isWarning ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' 
                                                        : 'bg-neutral-700/50 text-gray-300'
                                                    }`}>
                                                        <Clock className="w-3 h-3" /> {timer.text}
                                                    </span>
                                                );
                                            })() : (
                                                <span className="text-[10px] sm:text-xs flex items-center gap-1 px-2 py-1 rounded-md mb-1 font-bold bg-neutral-700/50 text-gray-300">
                                                    <Clock className="w-3 h-3" /> Permanente
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col gap-2 mb-4">
                                        <p className="text-2xl font-bold text-brand-yellow">
                                            {machine.price ? `$${Number(machine.price).toLocaleString()}` : "Consultar precio"}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center gap-1.5 bg-[#25D366]/10 text-[#25D366] px-2.5 py-1 rounded-lg text-sm font-bold border border-[#25D366]/20">
                                                <MessageCircle className="w-4 h-4" />
                                                {machine.whatsapp_clicks || 0} clics ganados
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 sm:flex sm:flex-row items-center gap-2 sm:gap-4 pt-4 border-t border-neutral-700 w-full mt-4">
                                    <button onClick={() => handleEdit(machine.id)} className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2.5 bg-neutral-700 hover:bg-neutral-600 border border-neutral-600 rounded-xl text-white text-sm sm:text-base font-medium transition-colors shadow-sm active:scale-95">
                                        <Edit className="w-4 h-4" />
                                        Editar
                                    </button>
                                    <button onClick={() => handleDelete(machine.id)} className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-red-500 text-sm sm:text-base font-medium transition-colors shadow-sm active:scale-95">
                                        <Trash2 className="w-4 h-4" />
                                        Eliminar
                                    </button>
                                    <Link 
                                        href={`/maquina/${machine.id}`}
                                        target="_blank" 
                                        className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-yellow/10 hover:bg-brand-yellow/20 border border-brand-yellow/30 text-brand-yellow font-medium rounded-xl transition-colors sm:ml-auto shadow-sm active:scale-95"
                                    >
                                        Ver en tienda →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
