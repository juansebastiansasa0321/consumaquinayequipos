"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Loader2, Save, FileImage, X, Search, CheckCircle2 } from "lucide-react";
import Image from "next/image";

type BlogPost = {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  author: string;
  is_published: boolean;
  tags: string[];
  meta_title: string;
  meta_description: string;
  published_at?: Date;
};

const emptyPost: BlogPost = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featured_image: "",
  author: "Admin Consumaquina",
  is_published: true,
  tags: [],
  meta_title: "",
  meta_description: ""
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Fetching all posts including drafts
      const res = await fetch('/api/blog');
      const data = await res.json();
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      alert("Error cargando los artículos del blog.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;
    
    // Auto-generate slug if empty
    let finalPost = { ...editingPost };
    if (!finalPost.slug) {
        finalPost.slug = finalPost.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    setIsSaving(true);
    try {
      const isUpdate = !!finalPost.id;
      const url = isUpdate ? `/api/blog/${finalPost.id}` : '/api/blog';
      const method = isUpdate ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPost)
      });

      if (!res.ok) throw new Error('Failed to save post');
      
      await fetchPosts();
      setEditingPost(null);
    } catch (error) {
      console.error("Error saving:", error);
      alert("Error al guardar el artículo.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este artículo permanentemente?")) return;
    try {
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete post');
      setPosts(posts.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Error al eliminar el artículo.");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingPost) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      const blob = await response.json();
      setEditingPost({ ...editingPost, featured_image: blob.url });
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error al subir la imagen");
    }
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim() && editingPost) {
      e.preventDefault();
      if (!editingPost.tags) editingPost.tags = [];
      if (!editingPost.tags.includes(tagInput.trim())) {
        setEditingPost({
          ...editingPost,
          tags: [...editingPost.tags, tagInput.trim()]
        });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    if (!editingPost) return;
    setEditingPost({
      ...editingPost,
      tags: editingPost.tags.filter(t => t !== tagToRemove)
    });
  };

  const filteredPosts = posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-brand-black flex items-center gap-2">
            Gestión del Blog Experto
          </h1>
          <p className="text-gray-500 text-sm mt-1">Crea y administra artículos para mejorar tu posicionamiento SEO en Google.</p>
        </div>
        <button
          onClick={() => setEditingPost(emptyPost)}
          className="bg-brand-yellow hover:bg-yellow-400 text-brand-black px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" /> Nuevo Artículo
        </button>
      </div>

      {editingPost ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-brand-black px-6 py-4 flex justify-between items-center text-white">
                <h2 className="font-bold text-lg">{editingPost.id ? 'Editar Artículo' : 'Crear Nuevo Artículo SEO'}</h2>
                <button onClick={() => setEditingPost(null)} className="text-gray-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 md:p-8 space-y-8">
                {/* 1. Basic Info */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-brand-black border-b pb-2 flex items-center gap-2">
                        <span className="bg-brand-yellow w-6 h-6 rounded-full inline-flex items-center justify-center text-xs">1</span> 
                        Información Principal
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-gray-700">Título del Artículo (H1)</label>
                            <input
                                required
                                value={editingPost.title}
                                onChange={e => setEditingPost({...editingPost, title: e.target.value})}
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-brand-yellow outline-none transition-colors text-lg font-medium"
                                placeholder="Ej: Las 5 ventajas de la Zoomlion 21T en Minería..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Autor</label>
                            <input
                                required
                                value={editingPost.author}
                                onChange={e => setEditingPost({...editingPost, author: e.target.value})}
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none"
                            />
                        </div>
                        <div className="space-y-2 flex flex-col justify-center pt-6">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={editingPost.is_published}
                                    onChange={e => setEditingPost({...editingPost, is_published: e.target.checked})}
                                    className="w-5 h-5 rounded border-gray-300 text-brand-yellow focus:ring-brand-yellow"
                                />
                                <span className="font-bold text-brand-black flex items-center gap-2">
                                    {editingPost.is_published ? <span className="text-green-600 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Publicado</span> : <span className="text-gray-500">Borrador Oculto</span>}
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* 2. Media & Intro */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-brand-black border-b pb-2 flex items-center gap-2">
                        <span className="bg-brand-yellow w-6 h-6 rounded-full inline-flex items-center justify-center text-xs">2</span> 
                        Media y Resumen
                    </h3>
                    
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-700">Imagen Principal (Miniatura y Portada)</label>
                        {editingPost.featured_image ? (
                            <div className="relative w-full md:w-1/2 h-64 rounded-xl overflow-hidden border-2 border-brand-yellow group">
                                <Image src={editingPost.featured_image} alt="Cover" fill className="object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <button
                                        type="button"
                                        onClick={() => setEditingPost({...editingPost, featured_image: ''})}
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" /> Cambiar Imagen
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full md:w-1/2">
                                <label className="flex flex-col items-center justify-center h-40 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-brand-yellow transition-all">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <FileImage className="w-8 h-8 text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-600 font-medium">Subir foto de portada</p>
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Introducción (Resumen corto)</label>
                        <textarea
                            required
                            value={editingPost.excerpt}
                            onChange={e => setEditingPost({...editingPost, excerpt: e.target.value})}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 h-24 focus:border-brand-yellow outline-none resize-none"
                            placeholder="Este texto aparecerá en la tarjeta del blog y sirve como gancho..."
                        />
                    </div>
                </div>

                {/* 3. Content */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-brand-black border-b pb-2 flex items-center gap-2">
                        <span className="bg-brand-yellow w-6 h-6 rounded-full inline-flex items-center justify-center text-xs">3</span> 
                        Contenido del Artículo
                    </h3>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-500">Escribe el contenido completo. Puedes usar etiquetas HTML básicas como &lt;h2&gt;, &lt;p&gt;, &lt;b&gt;, &lt;ul&gt; para dar formato visual.</label>
                        <textarea
                            required
                            value={editingPost.content}
                            onChange={e => setEditingPost({...editingPost, content: e.target.value})}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 h-96 focus:border-brand-yellow outline-none font-mono text-sm bg-gray-50 leading-relaxed"
                            placeholder="<p>Las excavadoras Zoomlion son líderes en...</p>&#10;<h2>1. Motor Potente</h2>&#10;<p>Su motor Cummins garantiza...</p>"
                        />
                    </div>
                </div>

                {/* 4. SEO & Metadata */}
                <div className="space-y-6 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                    <h3 className="text-lg font-bold text-blue-900 border-b border-blue-200 pb-2 flex items-center gap-2">
                        <span className="bg-blue-600 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs">4</span> 
                        Ajustes de SEO Avanzado (Google)
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-blue-900">Slug (URL amigable)</label>
                            <input
                                value={editingPost.slug}
                                onChange={e => setEditingPost({...editingPost, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                                className="w-full border-2 border-blue-200 rounded-xl px-4 py-2 outline-none text-sm text-blue-800 bg-white"
                                placeholder="ventajas-zoomlion-21t (Si lo dejas en blanco, se auto-genera)"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-blue-900">Etiquetas (Keywords)</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {editingPost.tags?.map(tag => (
                                    <span key={tag} className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 border border-blue-200">
                                        {tag}
                                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-blue-900"><X className="w-3 h-3" /></button>
                                    </span>
                                ))}
                            </div>
                            <input
                                value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                onKeyDown={addTag}
                                className="w-full border-2 border-blue-200 rounded-xl px-4 py-2 outline-none text-sm bg-white"
                                placeholder="Escribe una etiqueta y presiona 'Enter' (ej: Excavadoras)"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-blue-900">Meta Título SEO (Opcional, sobrescribe H1 en Google)</label>
                            <input
                                value={editingPost.meta_title}
                                onChange={e => setEditingPost({...editingPost, meta_title: e.target.value})}
                                maxLength={60}
                                className="w-full border-2 border-blue-200 rounded-xl px-4 py-2 outline-none text-sm bg-white"
                                placeholder="Max 60 caracteres recomendados"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-blue-900">Meta Descripción SEO (Opcional, para snippet de Google)</label>
                            <textarea
                                value={editingPost.meta_description}
                                onChange={e => setEditingPost({...editingPost, meta_description: e.target.value})}
                                maxLength={160}
                                className="w-full border-2 border-blue-200 rounded-xl px-4 py-2 h-20 outline-none resize-none text-sm bg-white"
                                placeholder="Max 160 caracteres. Resumen atractivo para que el usuario haga clic en Google."
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t">
                    <button type="button" onClick={() => setEditingPost(null)} className="px-6 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
                        Cancelar
                    </button>
                    <button type="submit" disabled={isSaving} className="bg-brand-black text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50">
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {editingPost.id ? 'Actualizar Artículo' : 'Publicar Artículo'}
                    </button>
                </div>
            </form>
        </div>
      ) : (
        /* Posts List View */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Buscar artículos por título..." 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-brand-yellow outline-none"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-yellow" /></div>
            ) : filteredPosts.length === 0 ? (
                <div className="text-center py-16 px-4">
                    <p className="text-gray-500 mb-4">No hay artículos publicados aún. Empieza a crear contenido para atraer clientes desde Google.</p>
                </div>
            ) : (
                <div className="divide-y divide-gray-100">
                    {filteredPosts.map(post => (
                        <div key={post.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-12 bg-gray-200 rounded-lg overflow-hidden relative shrink-0">
                                    {post.featured_image ? (
                                        <Image src={post.featured_image} alt="" fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Sin img</div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-brand-black line-clamp-1">{post.title}</h3>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                        <span className={post.is_published ? "text-green-600 font-bold" : "text-amber-600 font-bold"}>
                                            {post.is_published ? "Público" : "Borrador"}
                                        </span>
                                        <span>/blog/{post.slug}</span>
                                        <span>• {new Date(post.published_at!).toLocaleDateString('es-CO')}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setEditingPost(post)} className="p-2 text-gray-600 hover:text-brand-yellow hover:bg-yellow-50 rounded-lg transition-colors">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => post.id && handleDelete(post.id)} className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      )}
    </div>
  );
}
