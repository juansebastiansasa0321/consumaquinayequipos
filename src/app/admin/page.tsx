"use client";

import { useState } from "react";
import { Upload, Plus, X, Loader2, Save } from "lucide-react";

export default function AdminDashboard() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [images, setImages] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        setLoading(true);
        const file = e.target.files[0];
        try {
            // Connect to the Vercel Blob via our API route
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        const formData = new FormData(e.currentTarget);
        const data = {
            title: formData.get("title"),
            description: formData.get("description"),
            price: formData.get("price") || 0,
            hours: formData.get("hours") || 0,
            location: formData.get("location"),
            tags,
            images
        };

        try {
            const res = await fetch("/api/machines", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setSuccess(true);
                (e.target as HTMLFormElement).reset();
                setTags([]);
                setImages([]);
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

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-brand-black">Panel de Administración</h1>
                    <p className="text-gray-500">Agrega nuevas maquinarias al catálogo público.</p>
                </div>

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
                        <strong className="font-bold">¡Éxito! </strong>
                        <span className="block sm:inline">Máquina guardada correctamente en el catálogo.</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">

                    {/* Images Section */}
                    <section>
                        <h2 className="text-xl font-bold border-b pb-2 mb-4">Fotos de la Máquina</h2>
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
                        <p className="text-xs text-gray-400">Nota: Al subir la foto se guarda en Vercel Blob automáticamente.</p>
                    </section>

                    {/* Details Section */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Título / Nombre del Equipo *</label>
                            <input required name="title" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-yellow/50 outline-none" placeholder="Ej: Excavadora Zoomlion 21T" />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción Completa</label>
                            <textarea name="description" rows={5} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-yellow/50 outline-none" placeholder="Características detalladas, estado, mantenimientos..."></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Precio (COP)</label>
                            <input type="number" name="price" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-yellow/50 outline-none" placeholder="Ej: 350000000" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Horas de Uso</label>
                            <input type="number" name="hours" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-yellow/50 outline-none" placeholder="Ej: 1200" />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Ubicación</label>
                            <input name="location" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-yellow/50 outline-none" placeholder="Ej: Quibdó, Chocó" />
                        </div>
                    </section>

                    {/* Tags Section */}
                    <section>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Etiquetas (Visibles en las cards)</label>
                        <div className="flex gap-2 mb-3">
                            <input
                                value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                className="flex-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-brand-yellow/50"
                                placeholder="Ej: Oportunidad, Entrega Inmediata"
                            />
                            <button type="button" onClick={addTag} className="bg-gray-100 hover:bg-gray-200 px-4 rounded-lg flex items-center font-semibold border">
                                <Plus className="w-4 h-4 mr-1" /> Añadir
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {tags.map(tag => (
                                <span key={tag} className="bg-brand-yellow/20 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                    {tag} <button type="button" onClick={() => removeTag(tag)}><X className="w-3 h-3 hover:text-red-500" /></button>
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
        </div>
    );
}
