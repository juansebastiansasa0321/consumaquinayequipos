"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Tractor } from "lucide-react";

export function SidebarNav() {
  const pathname = usePathname();

  const isResumen = pathname === "/dashboard";
  const isMachines = pathname.startsWith("/dashboard/machines");

  return (
    <nav className="flex-1 p-4 space-y-2">
      <Link 
        href="/dashboard"
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
          isResumen 
            ? "bg-brand-yellow/10 text-brand-yellow" 
            : "text-gray-300 hover:text-white hover:bg-neutral-700"
        }`}
      >
        <LayoutDashboard className="w-5 h-5" />
        Resumen
      </Link>
      <Link 
        href="/dashboard/machines"
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
          isMachines 
            ? "bg-brand-yellow/10 text-brand-yellow" 
            : "text-gray-300 hover:text-white hover:bg-neutral-700"
        }`}
      >
        <Tractor className="w-5 h-5" />
        Mis Anuncios
      </Link>
    </nav>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  const isResumen = pathname === "/dashboard";
  const isMachines = pathname.startsWith("/dashboard/machines");

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-neutral-800 border-t border-neutral-700 flex justify-around p-3 pb-safe z-50">
      <Link 
        href="/dashboard"
        className={`flex flex-col items-center gap-1 transition-colors ${
          isResumen ? "text-brand-yellow" : "text-gray-400 hover:text-white"
        }`}
      >
        <LayoutDashboard className="w-6 h-6" />
        <span className={`text-[10px] ${isResumen ? "font-bold" : "font-medium"}`}>Resumen</span>
      </Link>
      <Link 
        href="/dashboard/machines"
        className={`flex flex-col items-center gap-1 transition-colors ${
          isMachines ? "text-brand-yellow" : "text-gray-400 hover:text-white"
        }`}
      >
        <Tractor className="w-6 h-6" />
        <span className={`text-[10px] ${isMachines ? "font-bold" : "font-medium"}`}>Mis Anuncios</span>
      </Link>
    </nav>
  );
}
