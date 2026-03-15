"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Upload, X, Loader2, ArrowLeft, Image as ImageIcon, Sparkles } from "lucide-react";
import Link from "next/link";
import LocationAutocomplete from "@/components/ui/location-autocomplete";

export default function EditMachinePage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [hours, setHours] = useState("");
    const [location, setLocation] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [contactPhone2, setContactPhone2] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [usageType, setUsageType] = useState("hours");
    const [visibilityTier, setVisibilityTier] = useState("basico");
    const [isUrgent, setIsUrgent] = useState(false);
    const [currency, setCurrency] = useState("COP");
    
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
    
    // File upload state for Blob (new files)
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMachine = async () => {
            try {
                const res = await fetch(`/api/dashboard/machines/${id}`);
                const data = await res.json();
                
                if (res.ok && data.machine) {
                    const m = data.machine;
                    setTitle(m.title || "");
                    setDescription(m.description || "");
                    setPrice(m.price ? String(m.price) : "");
                    setHours(m.hours ? String(m.hours) : "");
                    setLocation(m.location || "");
                    setContactPhone(m.contact_phone || "");
                    setContactPhone2(m.contact_phone_2 || "");
                    setContactEmail(m.contact_email || "");
                    setUsageType(m.usage_type || "hours");
                    setVisibilityTier(m.visibility_tier === 'gratis' ? 'basico' : (m.visibility_tier || "basico"));
                    setIsUrgent(m.is_urgent || false);
                    setCurrency(m.currency || "COP");
                    setExistingImages(m.images || []);
                } else {
                    setError(data.error || "No se pudo cargar la máquina.");
                }
            } catch (err) {
                console.error(err);
                setError("Error de conexión al cargar.");
            } finally {
                setLoading(false);
            }
        };
        fetchMachine();
    }, [id]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            const MAX_SIZE = 5 * 1024 * 1024;
            const validFiles = selectedFiles.filter(file => {
                if (file.size > MAX_SIZE) {
                    alert(`La imagen "${file.name}" supera el límite de 5MB.`);
                    return false;
                }
                return true;
            });
            // Tier Limits Validation
            let maxAllowed = Infinity;
            if (visibilityTier === 'basico') maxAllowed = 5;
            if (visibilityTier === 'plata') maxAllowed = 15;

            let finalFiles = validFiles;
            const currentTotal = existingImages.length + files.length;
            
            if (currentTotal + finalFiles.length > maxAllowed) {
                alert(`El plan ${visibilityTier.toUpperCase()} te permite máximo ${maxAllowed} fotos en total.`);
                const remainingSlots = Math.max(0, maxAllowed - currentTotal);
                finalFiles = finalFiles.slice(0, remainingSlots);
            }

            if (finalFiles.length === 0) return;
            
            setFiles(prev => [...prev, ...finalFiles]);
            const newPreviews = finalFiles.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeNewFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (imgUrl: string) => {
        setExistingImages(prev => prev.filter(url => url !== imgUrl));
        setImagesToDelete(prev => [...prev, imgUrl]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        // Basic front-end validation
        if (price) {
            const numPrice = parseFloat(price);
            if (currency === 'COP' && numPrice < 3000000) {
                setError("El precio no puede ser menor a $3.000.000 COP para mantener la calidad del catálogo.");
                setIsSubmitting(false);
                return;
            } else if (currency === 'USD' && numPrice < 1000) {
                setError("El precio no puede ser menor a $1.000 USD para mantener la calidad del catálogo.");
                setIsSubmitting(false);
                return;
            }
        }

        const phoneRegex = /^[0-9+]+$/;
        if (contactPhone && !phoneRegex.test(contactPhone)) {
            setError("El teléfono 1 de contacto solo debe contener números (y opcionalmente el signo +).");
            setIsSubmitting(false);
            return;
        }
        if (contactPhone2 && !phoneRegex.test(contactPhone2)) {
            setError("El teléfono 2 de contacto solo debe contener números (y opcionalmente el signo +).");
            setIsSubmitting(false);
            return;
        }

        try {
            const uploadedUrls = [];
            // Upload new files
            for (const file of files) {
                const uploadRes = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
                    method: 'POST',
                    body: file
                });
                if (!uploadRes.ok) throw new Error("Error al subir imagen");
                const { url } = await uploadRes.json();
                uploadedUrls.push(url);
            }

            const finalImages = [...existingImages, ...uploadedUrls];

            const machineData = {
                title,
                description,
                price: price ? parseFloat(price) : null,
                hours: hours ? parseFloat(hours) : null,
                location,
                contact_phone: contactPhone || null,
                contact_phone_2: contactPhone2 || null,
                contact_email: contactEmail || null,
                usage_type: usageType,
                visibility_tier: visibilityTier,
                is_urgent: visibilityTier === 'basico' ? false : isUrgent,
                currency: currency,
                images: finalImages
            };

            const res = await fetch(`/api/machines/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(machineData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Error al actualizar la máquina");
            }

            router.push("/dashboard/machines");
            router.refresh();

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Ocurrió un error inesperado.");
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-brand-yellow" /></div>;

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <div className="mb-6 flex items-center gap-4">
                <Link href="/dashboard/machines" className="text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white">Editar Máquina</h1>
                    <p className="text-gray-400">Actualiza los datos de tu anuncio.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-center font-medium">
                        {error}
                    </div>
                )}

                <div className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700 shadow-xl space-y-4">
                     <h2 className="text-xl font-bold text-brand-yellow flex items-center gap-2">
                        <Sparkles className="w-5 h-5" /> Tipo de Publicación
                     </h2>
                     <p className="text-sm text-gray-400 mb-4">Elige el alcance que tendrá tu equipo. Ten en cuenta que no pagas comisión por vender.</p>
                     
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                         
                         {/* Basico */}
                         <label className={`cursor-pointer border-2 rounded-xl p-3 sm:p-4 transition-all flex flex-col justify-between ${visibilityTier === 'basico' ? 'border-brand-yellow bg-brand-yellow/10' : 'border-neutral-700 hover:border-neutral-500'}`}>
                             <div>
                                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                    <input type="radio" value="basico" checked={visibilityTier === 'basico'} onChange={() => setVisibilityTier('basico')} className="w-4 h-4 text-brand-yellow shrink-0 bg-neutral-900 border-neutral-600" />
                                    <span className="font-bold text-white text-base sm:text-lg">Básico</span>
                                </div>
                                <ul className="text-xs sm:text-sm text-gray-400 space-y-1 mb-4 pl-6 sm:pl-7 list-disc">
                                    <li>Posición estándar</li>
                                    <li>30 días de duración</li>
                                    <li>Hasta 5 fotos</li>
                                </ul>
                             </div>
                             <div className="pl-6 sm:pl-7 font-bold text-white text-sm sm:text-base">Gratis</div>
                         </label>
                         
                         {/* Plata */}
                         <label className={`cursor-pointer border-2 rounded-xl p-3 sm:p-4 transition-all flex flex-col justify-between ${visibilityTier === 'plata' ? 'border-sky-400 bg-sky-400/10' : 'border-neutral-700 hover:border-neutral-500'}`}>
                             <div>
                                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                    <input type="radio" value="plata" checked={visibilityTier === 'plata'} onChange={() => setVisibilityTier('plata')} className="w-4 h-4 text-sky-400 shrink-0 bg-neutral-900 border-neutral-600" />
                                    <span className="font-bold text-sky-400 text-base sm:text-lg">Plata</span>
                                </div>
                                <ul className="text-xs sm:text-sm text-gray-400 space-y-1 mb-4 pl-6 sm:pl-7 list-disc">
                                    <li>Prioridad Media</li>
                                    <li>Etiqueta "Oportunidad"</li>
                                    <li>Hasta 15 fotos</li>
                                    <li>90 días de duración</li>
                                    <li>Post FB/IG</li>
                                </ul>
                             </div>
                             <div className="pl-6 sm:pl-7">
                                 <div className="font-bold text-white text-sm sm:text-base">$30.000</div>
                             </div>
                         </label>
                         
                         {/* Oro */}
                         <label className={`cursor-pointer border-2 rounded-xl p-3 sm:p-4 transition-all flex flex-col justify-between relative overflow-hidden ${visibilityTier === 'oro' ? 'border-amber-500 bg-amber-500/10' : 'border-neutral-700 hover:border-neutral-500'}`}>
                             <div className="absolute top-0 right-0 bg-amber-500 text-black text-[9px] sm:text-[10px] font-black px-2 py-1 rounded-bl-lg uppercase tracking-wider">Top #1</div>
                             <div>
                                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                    <input type="radio" value="oro" checked={visibilityTier === 'oro'} onChange={() => setVisibilityTier('oro')} className="w-4 h-4 text-amber-500 shrink-0 bg-neutral-900 border-neutral-600" />
                                    <span className="font-bold text-amber-500 text-base sm:text-lg">Oro</span>
                                </div>
                                <ul className="text-xs sm:text-sm text-gray-400 space-y-1 mb-4 pl-6 sm:pl-7 list-disc">
                                    <li className="text-white font-medium">Top 1 Global Catalogo</li>
                                    <li>Etiqueta "Verificado"</li>
                                    <li>Fotos ilimitadas</li>
                                    <li>Duración permanente</li>
                                    <li>Difusión a Base WhatsApp</li>
                                </ul>
                             </div>
                             <div className="pl-6 sm:pl-7">
                                 <div className="font-bold text-white text-sm sm:text-base">$50.000</div>
                             </div>
                         </label>
                     </div>

                     {visibilityTier !== 'basico' && (
                        <div className="mt-6 p-4 sm:p-5 bg-brand-yellow/10 border border-brand-yellow/30 rounded-xl flex items-start gap-4 transition-all">
                            <input 
                                type="checkbox" 
                                id="isUrgent"
                                checked={isUrgent}
                                onChange={(e) => setIsUrgent(e.target.checked)}
                                className="mt-1 w-5 h-5 rounded sm:w-6 sm:h-6 cursor-pointer border-neutral-600 bg-neutral-900 text-brand-yellow focus:ring-brand-yellow focus:ring-offset-neutral-800"
                            />
                            <div>
                                <label htmlFor="isUrgent" className="font-bold text-brand-yellow text-base sm:text-lg cursor-pointer">Destacar como "Venta Urgente"</label>
                                <p className="text-sm text-gray-400 mt-1 leading-relaxed">Tu anuncio resaltará en el catálogo web con un diseño luminoso para atraer compradores más rápido.</p>
                            </div>
                        </div>
                     )}
                </div>

                <div className="bg-neutral-800 p-6 sm:p-8 rounded-2xl border border-neutral-700 shadow-xl space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Título del Anuncio</label>
                        <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
                        <textarea required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Precio - Opcional</label>
                            <div className="flex gap-2">
                                <select 
                                    value={currency} 
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className="px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all w-28"
                                >
                                    <option value="COP">COP</option>
                                    <option value="USD">USD</option>
                                </select>
                                <input 
                                    type="number" 
                                    value={price} 
                                    onChange={(e) => setPrice(e.target.value)} 
                                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow" 
                                    placeholder={currency === 'COP' ? "Ej. 150000000" : "Ej. 45000"}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Ubicación</label>
                            <LocationAutocomplete value={location} onChange={setLocation} />
                            <p className="text-xs text-gray-500 mt-1">Ingresa el municipio y selecciona la sugerencia.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">WhatsApp Principal (Público)</label>
                            <input type="text" required value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Teléfono Secundario (Opcional)</label>
                            <input type="text" value={contactPhone2} onChange={(e) => setContactPhone2(e.target.value)} className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow" />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Correo Electrónico de Contacto (Opcional)</label>
                            <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Uso</label>
                            <select value={usageType} onChange={(e) => setUsageType(e.target.value)} className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow">
                                <option value="hours">Horas de trabajo</option>
                                <option value="km">Kilometraje (km)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Uso ({usageType === 'hours' ? 'Hrs' : 'Km'})</label>
                            <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-yellow" />
                        </div>
                    </div>

                    {/* Image Upload Area */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Fotos de la Máquina</label>
                        
                        {existingImages.length > 0 && (
                            <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {existingImages.map((src, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                                        <img src={src} alt="Existing" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button type="button" onClick={() => removeExistingImage(src)} className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="border-2 border-dashed border-neutral-600 rounded-2xl p-8 hover:bg-neutral-800/50 transition-colors text-center relative cursor-pointer">
                            <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            <div className="flex flex-col items-center gap-3">
                                <div className="p-4 bg-brand-yellow/10 rounded-full">
                                    <Upload className="w-8 h-8 text-brand-yellow" />
                                </div>
                                <div>
                                    <p className="text-white font-medium">Click para agregar más fotos</p>
                                    <p className="text-sm text-gray-400">JPG, PNG, WebP (Máx. 5MB por foto)</p>
                                </div>
                            </div>
                        </div>

                        {previews.length > 0 && (
                            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {previews.map((src, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                                        <img src={src} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button type="button" onClick={() => removeNewFile(idx)} className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-center pt-8 pb-4 border-t border-neutral-700">
                    <button type="submit" disabled={isSubmitting || (files.length === 0 && existingImages.length === 0)} className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-brand-yellow to-yellow-400 text-brand-black font-black rounded-2xl text-lg hover:scale-105 transition-all duration-300 shadow-xl shadow-brand-yellow/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                        {isSubmitting ? <><Loader2 className="w-6 h-6 animate-spin" /> Guardando...</> : "Guardar Cambios"}
                    </button>
                </div>
            </form>
        </div>
    );
}
