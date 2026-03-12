"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, Plus, X, Loader2, Save, Trash2, Star, ArrowUp, ArrowDown, Pencil } from "lucide-react";

type Machine = {
    id: string;
    title: string;
    price: number;
    hours: number;
    location: string;
    tags: string[];
    images: string[];
    is_featured: boolean;
    display_order: number;
};

export default function AdminDashboard() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [images, setImages] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [priceInput, setPriceInput] = useState("");
    const [usageType, setUsageType] = useState<"hours" | "km">("hours");
    const formRef = useRef<HTMLFormElement>(null);

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, "");
        setPriceInput(raw ? Number(raw).toLocaleString("es-CO") : "");
    };

    const [machines, setMachines] = useState<Machine[]>([]);
    const [isFetching, setIsFetching] = useState(true);

    const fetchMachines = async () => {
        setIsFetching(true);
        try {
            const res = await fetch("/api/machines");
            const data = await res.json();
            if (data.machines) setMachines(data.machines);
        } catch (err) {
            console.error(err);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchMachines();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setLoading(true);
        const file = e.target.files[0];
        try {
            const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
                method: "POST",
                body: file,
            });
            const blob = await response.json();
            if (blob.url) {
                setImages(prev => [...prev, blob.url]);
            } else {
                alert("Error al subir la imagen. Verifica Vercel Blob.");
            }
        } catch (err) {
            console.error(err);
            alert("Error en la subida.");
        } finally {
            setLoading(false);
        }
    };

    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const removeImage = (imgToRemove: string) => {
        setImages(images.filter(img => img !== imgToRemove));
    };

    const handleEdit = (machine: Machine) => {
        setEditingId(machine.id);
        setImages(machine.images || []);
        setTags(machine.tags || []);
        setSuccess(false);
        // populate text inputs via form ref
        setTimeout(() => {
            if (!formRef.current) return;
            const f = formRef.current;
            (f.querySelector('[name="title"]') as HTMLInputElement).value = machine.title || '';
            (f.querySelector('[name="description"]') as HTMLTextAreaElement).value = (machine as any).description || '';
            (f.querySelector('[name="hours"]') as HTMLInputElement).value = machine.hours ? String(machine.hours) : '';
            (f.querySelector('[name="location"]') as HTMLInputElement).value = machine.location || '';
        }, 50);
        setPriceInput(machine.price ? machine.price.toLocaleString("es-CO") : "");
        setUsageType((machine as any).usage_type === 'km' ? 'km' : 'hours');
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setImages([]);
        setTags([]);
        setPriceInput("");
        setUsageType("hours");
        setSuccess(false);
        formRef.current?.reset();
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        const formData = new FormData(e.currentTarget);
        const data = {
            title: formData.get("title"),
            description: formData.get("description"),
            price: Number(priceInput.replace(/\D/g, "")) || 0,
            hours: formData.get("hours") || 0,
            usage_type: usageType,
            location: formData.get("location"),
            tags,
            images
        };

        try {
            const url = editingId ? `/api/machines/${editingId}` : "/api/machines";
            const method = editingId ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setSuccess(true);
                (e.target as HTMLFormElement).reset();
                setTags([]);
                setImages([]);
                setPriceInput("");
                setUsageType("hours");
                setEditingId(null);
                fetchMachines();
            } else {
                const err = await res.json();
                alert(err.error || "Error al guardar en BD");
            }
        } catch (err) {
            console.error(err);
            alert("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Seguro que deseas eliminar esta máquina?")) return;
        try {
            await fetch(`/api/machines/${id}`, { method: 'DELETE' });
            fetchMachines();
        } catch (err) {
            console.error(err);
        }
    };

    const handleFeature = async (id: string) => {
        try {
            await fetch(`/api/machines/${id}`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_featured: true })
            });
            fetchMachines();
        } catch (err) {
            console.error(err);
        }
    };

    const handleOrder = async (machine: Machine, direction: 'up' | 'down') => {
        const currentIndex = machines.findIndex(m => m.id === machine.id);
        if (direction === 'up' && currentIndex === 0) return;
        if (direction === 'down' && currentIndex === machines.length - 1) return;

        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        const targetMachine = machines[targetIndex];

        // Swap their display_order values
        const currentOrder = machine.display_order || currentIndex;
        const targetOrder = targetMachine.display_order || targetIndex;

        try {
            await Promise.all([
                fetch(`/api/machines/${machine.id}`, {
                    method: 'PUT',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ display_order: targetOrder })
                }),
                fetch(`/api/machines/${targetMachine.id}`, {
                    method: 'PUT',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ display_order: currentOrder })
                })
            ]);
            fetchMachines();
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-12">
                
                {/* Section 1: Create */}
                <div>
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-brand-black">{editingId ? 'Editar Máquina' : 'Panel de Administración'}</h1>
                            <p className="text-gray-500">{editingId ? 'Modifica la información de esta máquina y guarda los cambios.' : 'Agrega nuevas maquinarias al catálogo público.'}</p>
                        </div>
                        {editingId && (
                            <button type="button" onClick={handleCancelEdit} className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 border border-gray-200 hover:border-red-300 px-4 py-2 rounded-xl transition-colors bg-white shadow-sm">
                                <X className="w-4 h-4" /> Cancelar
                            </button>
                        )}
                    </div>

                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
                            <strong className="font-bold">¡Éxito! </strong>
                            <span className="block sm:inline">Máquina guardada correctamente en el catálogo.</span>
                        </div>
                    )}

                    <form ref={formRef} onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
                        {/* Images Section */}
                        <section>
                            <h2 className="text-xl font-bold border-b pb-2 mb-4 text-brand-black">Fotos de la Máquina</h2>
                            <div className="flex flex-wrap gap-4 mb-4">
                                {images.map(img => (
                                    <div key={img} className="relative w-32 h-32 rounded-lg border overflow-hidden">
                                        <img src={img} alt="Uploaded" className="object-cover w-full h-full" />
                                        <button type="button" onClick={() => removeImage(img)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <label className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    {loading ? <Loader2 className="animate-spin w-8 h-8 text-gray-400" /> : <Upload className="w-8 h-8 text-gray-400" />}
                                    <span className="text-xs text-gray-500 mt-2">Subir Foto</span>
                                    <input type="file" accept="image/*" onChange={handleFileUpload} disabled={loading} className="hidden" />
                                </label>
                            </div>
                            <p className="text-xs text-gray-500 mb-3">Nota: Al subir la foto se guarda en Vercel Blob automáticamente.</p>
                            {/* Photo Format Guide */}
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
                                <p className="font-bold text-amber-800 mb-2">📸 Recomendaciones para mejores fotos</p>
                                <ul className="space-y-1 text-amber-700 text-xs">
                                    <li><span className="font-semibold">🖼️ Dimensiones ideales:</span> 1200 × 800 px (proporción 3:2) — perfecta para el catálogo y el hero</li>
                                    <li><span className="font-semibold">📐 Orientación:</span> Horizontal (paisaje), nunca vertical</li>
                                    <li><span className="font-semibold">⚖️ Tamaño máximo:</span> Menos de 5 MB para subir rápido</li>
                                    <li><span className="font-semibold">✅ Formato:</span> JPG o WebP (mejor calidad y velocidad)</li>
                                    <li><span className="font-semibold">💡 Tip:</span> La primera foto que subas será la que aparezca en el catálogo y en el hero del sitio</li>
                                    <li><span className="font-semibold">🔧 Comprimir fotos gratis:</span> <a href="https://squoosh.app" target="_blank" rel="noreferrer" className="underline hover:text-amber-900">squoosh.app</a></li>
                                </ul>
                            </div>
                        </section>

                        {/* Details Section */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Título / Nombre del Equipo *</label>
                                <input required name="title" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow/50 outline-none text-gray-900 bg-white" placeholder="Ej: Excavadora Zoomlion 21T" />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Descripción Completa</label>
                                <textarea name="description" rows={5} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow/50 outline-none text-gray-900 bg-white" placeholder="Características detalladas, estado, mantenimientos..."></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Precio (COP)</label>
                                <input type="text" value={priceInput} onChange={handlePriceChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow/50 outline-none text-gray-900 bg-white" placeholder="Ej: 350.000.000" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Uso (Horas / Km)</label>
                                <div className="flex gap-2 mb-2">
                                    <button type="button" onClick={() => setUsageType('hours')} className={`flex-1 py-1 rounded border text-sm font-semibold transition-colors ${usageType === 'hours' ? 'bg-brand-black text-white border-brand-black' : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'}`}>Horas</button>
                                    <button type="button" onClick={() => setUsageType('km')} className={`flex-1 py-1 rounded border text-sm font-semibold transition-colors ${usageType === 'km' ? 'bg-brand-black text-white border-brand-black' : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'}`}>Kilómetros</button>
                                </div>
                                <input type="number" name="hours" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow/50 outline-none text-gray-900 bg-white" placeholder={`Ej: ${usageType === 'hours' ? '1200' : '45000'}`} />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Ubicación</label>
                                <input name="location" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow/50 outline-none text-gray-900 bg-white" placeholder="Ej: Quibdó, Chocó" />
                            </div>
                        </section>

                        {/* Tags Section */}
                        <section>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Etiquetas (Visibles en las cards)</label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    value={tagInput}
                                    onChange={e => setTagInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-yellow/50 text-gray-900 bg-white"
                                    placeholder="Ej: Oportunidad, Entrega Inmediata"
                                />
                                <button type="button" onClick={addTag} className="bg-gray-100 text-gray-900 hover:bg-gray-200 px-4 rounded-lg flex items-center font-semibold border border-gray-300">
                                    <Plus className="w-4 h-4 mr-1" /> Añadir
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {tags.map(tag => (
                                    <span key={tag} className="bg-brand-yellow/20 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 border border-brand-yellow/30">
                                        {tag} <button type="button" onClick={() => removeTag(tag)}><X className="w-3 h-3 hover:text-red-600" /></button>
                                    </span>
                                ))}
                            </div>
                        </section>

                        <hr className="my-6 border-gray-200" />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-black text-white hover:bg-gray-900 font-bold py-4 rounded-xl shadow flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />} Guardar Máquina en el Catálogo
                        </button>
                    </form>
                </div>

                {/* Section 2: Manage */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6 text-brand-black">Catálogo Actual</h2>
                    
                    {isFetching ? (
                        <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
                    ) : machines.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No hay máquinas en el catálogo.</p>
                    ) : (
                        <div className="space-y-4">
                            {machines.map((machine, index) => (
                                <div key={machine.id} className="flex items-center gap-4 p-4 border rounded-xl hover:border-brand-yellow/50 transition-colors bg-gray-50/50">
                                    <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0 relative">
                                        {machine.images?.[0] ? (
                                            <img src={machine.images[0]} alt={machine.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-[10px] text-gray-500 flex h-full items-center justify-center text-center">Sin imagen</span>
                                        )}
                                        {machine.is_featured && (
                                            <div className="absolute top-0 right-0 bg-brand-yellow p-0.5 rounded-bl-lg">
                                                <Star className="w-3 h-3 text-brand-black fill-brand-black" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 truncate flex items-center gap-2">
                                            {machine.title}
                                            {machine.is_featured && <span className="text-[10px] bg-brand-yellow px-2 py-0.5 rounded-full uppercase tracking-wider text-brand-black">Destacada</span>}
                                        </h3>
                                        <p className="text-sm text-gray-500 truncate mb-1">{machine.location} • ${machine.price ? Number(machine.price).toLocaleString("es-CO") : 0}</p>
                                        <div className="flex flex-wrap gap-1">
                                            {machine.tags?.map(tag => (
                                                <span key={tag} className="text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex flex-col gap-1 border-r pr-2 mr-2">
                                            <button 
                                                onClick={() => handleOrder(machine, 'up')}
                                                disabled={index === 0}
                                                className="p-1 hover:bg-gray-200 rounded text-gray-500 disabled:opacity-30 disabled:hover:bg-transparent"
                                                title="Mover arriba"
                                            >
                                                <ArrowUp className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleOrder(machine, 'down')}
                                                disabled={index === machines.length - 1}
                                                className="p-1 hover:bg-gray-200 rounded text-gray-500 disabled:opacity-30 disabled:hover:bg-transparent"
                                                title="Mover abajo"
                                            >
                                                <ArrowDown className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <button 
                                            onClick={() => handleFeature(machine.id)}
                                            className={`p-2 rounded-lg transition-colors ${machine.is_featured ? 'bg-brand-yellow text-brand-black' : 'bg-gray-100 text-gray-600 hover:bg-yellow-100'}`}
                                            title="Marcar como Destacada"
                                        >
                                            <Star className={`w-5 h-5 ${machine.is_featured ? 'fill-brand-black' : ''}`} />
                                        </button>
                                        <button 
                                            onClick={() => handleEdit(machine)}
                                            className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                            title="Editar máquina"
                                        >
                                            <Pencil className="w-5 h-5" />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(machine.id)}
                                            className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                            title="Eliminar máquina"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
