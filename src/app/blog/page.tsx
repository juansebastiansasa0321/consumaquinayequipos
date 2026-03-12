export const dynamic = 'force-dynamic';
import Image from "next/image";
import Link from "next/link";
import { sql } from "@/lib/db";
import { ArrowLeft, ArrowRight, Calendar, User, BookOpen } from "lucide-react";

export const metadata = {
  title: "Blog - Consumaquinayequipos",
  description: "Noticias, consejos y guías sobre maquinaria pesada, excavadoras y equipos industriales para minería en Chocó y Cauca.",
  openGraph: {
    title: "Blog de Maquinaria Pesada | Consumaquinayequipos",
    description: "Expertos en equipos industriales y minería en Colombia.",
  }
};

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  author: string;
  published_at: Date;
  tags: string[];
};

async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    if (!process.env.POSTGRES_URL) return [];
    const rows = await sql`
      SELECT id, title, slug, excerpt, featured_image, author, published_at, tags 
      FROM blog_posts 
      WHERE is_published = true 
      ORDER BY published_at DESC
    `;
    return rows as BlogPost[];
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Blog Header */}
      <div className="bg-brand-black text-white pt-24 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-brand-yellow font-medium transition-colors text-sm mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </Link>
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-brand-yellow/10 text-brand-yellow font-bold text-xs tracking-widest uppercase border border-brand-yellow/20">
            Últimas Novedades
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Maquinaria al <span className="text-brand-yellow">Día</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            Noticias, consejos de mantenimiento y guías expertas sobre equipos pesados para el sector minero y de construcción en Colombia.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 max-w-6xl">
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-brand-black mb-2">Próximamente</h2>
            <p className="text-gray-500">Estamos preparando artículos increíbles sobre maquinaria pesada. ¡Vuelve pronto!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col border border-gray-100">
                <div className="relative h-60 w-full bg-gray-100 overflow-hidden">
                  {post.featured_image ? (
                    <Image
                      src={post.featured_image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-brand-black text-brand-yellow font-bold text-xl">CE</div>
                  )}
                  {post.tags?.[0] && (
                    <div className="absolute top-4 left-4 bg-brand-yellow text-brand-black text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg">
                      {post.tags[0]}
                    </div>
                  )}
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 mb-4">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(post.published_at).toLocaleDateString('es-CO', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {post.author}</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-brand-black mb-3 line-clamp-2 leading-tight group-hover:text-brand-yellow transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto flex items-center gap-2 text-sm font-bold text-brand-black group-hover:text-brand-yellow transition-colors">
                    Leer artículo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
