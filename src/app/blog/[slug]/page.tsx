export const dynamic = 'force-dynamic';
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { sql } from "@/lib/db";
import { ArrowLeft, Calendar, User, Tag, Share2, Facebook, Twitter, Linkedin } from "lucide-react";

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  author: string;
  published_at: Date;
  tags: string[];
  meta_title: string;
  meta_description: string;
};

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    if (!process.env.POSTGRES_URL) return null;
    const rows = await sql`
      SELECT * FROM blog_posts 
      WHERE slug = ${slug} AND is_published = true
      LIMIT 1
    `;
    if (rows.length === 0) return null;
    return rows[0] as BlogPost;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  
  if (!post) {
    return {
      title: "Artículo no encontrado | Consumaquinayequipos"
    }
  }

  return {
    title: post.meta_title || `${post.title} | Consumaquinayequipos`,
    description: post.meta_description || post.excerpt,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      images: post.featured_image ? [post.featured_image] : [],
      type: "article",
    }
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  // Helper to format the HTML content securely (using dangerouslySetInnerHTML in the component)
  // In a real app we might want to sanitize this, but since it's an internal admin tool, it's acceptable for now.

  return (
    <article className="bg-white min-h-screen pb-24">
      {/* Article Header (Hero) */}
      <header className="relative w-full h-[50vh] min-h-[400px] flex items-end justify-center bg-brand-black pt-20">
        {post.featured_image && (
          <div className="absolute inset-0 z-0">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover opacity-40"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/80 to-transparent" />
          </div>
        )}
        
        <div className="container relative z-10 mx-auto px-4 pb-16 text-center max-w-4xl">
           <Link href="/blog" className="inline-flex items-center text-gray-400 hover:text-brand-yellow font-medium transition-colors text-sm mb-8 gap-2">
            <ArrowLeft className="w-4 h-4" /> Volver al Blog
          </Link>
          
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {post.tags?.map(tag => (
              <span key={tag} className="bg-brand-yellow text-brand-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-center gap-6 text-gray-300 text-sm font-medium">
            <span className="flex items-center gap-2"><User className="w-4 h-4 text-brand-yellow" /> {post.author}</span>
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-brand-yellow" /> {new Date(post.published_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="bg-gray-50 border-l-4 border-brand-yellow p-6 rounded-r-2xl mb-12 text-lg text-gray-700 font-medium italic">
          {post.excerpt}
        </div>

        {/* Prose Content Container */}
        <div className="prose prose-lg prose-yellow max-w-none text-gray-800 
          prose-headings:font-bold prose-headings:text-brand-black 
          prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-100
          prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
          prose-p:leading-relaxed prose-p:mb-6
          prose-a:text-brand-yellow prose-a:font-bold prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-2xl prose-img:shadow-xl prose-img:my-10
          prose-li:my-2 prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Article Footer & Sharing */}
        <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
             <Tag className="w-5 h-5 text-gray-400" />
             <div className="flex gap-2">
                {post.tags?.map(tag => (
                    <Link href={`/blog?tag=${tag}`} key={tag} className="text-sm font-bold text-gray-600 hover:text-brand-yellow transition-colors">
                        #{tag}
                    </Link>
                ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Share2 className="w-4 h-4" /> Compartir
            </span>
            <div className="flex items-center gap-2">
                {/* Realistically, these would use encodeURIComponent(window.location.href) on client side, using static placeholders for now */}
                <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#1877F2] hover:text-white transition-colors">
                    <Facebook className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#1DA1F2] hover:text-white transition-colors">
                    <Twitter className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#0A66C2] hover:text-white transition-colors">
                    <Linkedin className="w-4 h-4" />
                </button>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-brand-black rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/zoomlion.png')] opacity-10 bg-cover bg-center mix-blend-overlay" />
            <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-black mb-4">¿Buscas equipo para tu proyecto?</h3>
                <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                    Consulta nuestro catálogo o contáctanos directamente para asesoría especializada en maquinaria pesada en el Cauca y Chocó.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/#catalogo" className="bg-brand-yellow text-brand-black px-8 py-4 rounded-xl font-bold hover:bg-yellow-400 transition-colors shadow-lg shadow-brand-yellow/20">
                        Ver Catálogo
                    </Link>
                    <Link href="/contacto" className="bg-white/10 text-white backdrop-blur border border-white/20 px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-brand-black transition-colors">
                        Contactar Asesor
                    </Link>
                </div>
            </div>
        </div>
      </div>
    </article>
  );
}
