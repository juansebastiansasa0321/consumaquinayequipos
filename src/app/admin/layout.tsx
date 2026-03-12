export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <nav className="bg-brand-black text-white py-4 px-6 sticky top-0 z-50 shadow-md">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="font-bold text-brand-yellow text-xl">Admin Panel</div>
                    <div className="flex gap-6">
                        <a href="/admin" className="hover:text-brand-yellow transition-colors font-semibold">Maquinaria</a>
                        <a href="/admin/contactos" className="hover:text-brand-yellow transition-colors font-semibold">Contactos</a>
                        <a href="/admin/blog" className="hover:text-brand-yellow transition-colors font-semibold">Blog SEO</a>
                    </div>
                </div>
            </nav>
            {children}
        </div>
    );
}
