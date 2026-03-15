import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { LogOut } from "lucide-react";
import { SidebarNav, MobileNav } from "./NavComponents";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  let userName = "Usuario";
  
  if (token) {
    try {
      const JWT_SECRET = new TextEncoder().encode(
        process.env.JWT_SECRET || 'fallback_secret_for_local_development_only'
      );
      const { payload } = await jwtVerify(token, JWT_SECRET);
      userName = (payload.name as string) || (payload.email as string);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-800 border-r border-neutral-700 hidden md:flex flex-col">
        <div className="p-6 border-b border-neutral-700">
          <h2 className="text-xl font-bold text-brand-yellow truncate">
            {userName}
          </h2>
          <p className="text-sm text-gray-400">Panel de Control</p>
        </div>
        
        <SidebarNav />

        <div className="p-4 border-t border-neutral-700">
          <form action="/api/auth/logout" method="POST">
             <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-neutral-600 text-gray-400 hover:bg-neutral-700 hover:text-white rounded-lg transition-colors font-medium">
               <LogOut className="w-4 h-4" />
               Cerrar Sesión
             </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden bg-neutral-800 border-b border-neutral-700 p-4 flex justify-between items-center z-10 sticky top-0">
            <span className="font-bold text-brand-yellow truncate max-w-[200px]">{userName}</span>
             <form action="/api/auth/logout" method="POST">
                 <button type="submit" className="text-gray-400 hover:text-white p-2">
                    <LogOut className="w-5 h-5" />
                 </button>
             </form>
        </header>

        <div className="p-4 sm:p-6 lg:p-10 flex-1 overflow-y-auto pb-24 md:pb-10">
          {children}
        </div>

        <MobileNav />
      </main>
    </div>
  );
}
