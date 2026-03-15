import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { sql } from "@/lib/db";
import { Tractor, TrendingUp, Eye } from "lucide-react";
import Link from "next/link";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback_secret_for_local_development_only"
);

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    let userId = "";
    try {
        if (token) {
            const { payload } = await jwtVerify(token, JWT_SECRET);
            userId = payload.id as string;
        }
    } catch (e) {
        console.error("Invalid token on dashboard start", e);
    }

    let stats = {
        totalMachines: 0,
        published: 0,
        premium: 0,
    };

        if (userId) {
        try {
            const rows = await sql`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
          SUM(CASE WHEN visibility_tier != 'free' THEN 1 ELSE 0 END) as premium
        FROM machines 
        WHERE user_id = ${userId}
      `;
            if (rows.length > 0) {
                stats.totalMachines = Number(rows[0].total) || 0;
                stats.published = Number(rows[0].published) || 0;
                stats.premium = Number(rows[0].premium) || 0;
            }
        } catch (e) {
            console.error("Error fetching stats:", e);
        }
    }

    return (
        <div className="space-y-6 md:space-y-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Resumen de Cuenta</h1>

            <div className="grid grid-cols-3 gap-3 md:gap-6">
                <div className="bg-neutral-800 p-3 md:p-6 rounded-2xl border border-neutral-700 shadow-xl flex flex-col items-center justify-center text-center">
                    <div className="p-2 md:p-3 bg-brand-yellow/20 text-brand-yellow rounded-xl mb-2 md:mb-3">
                        <Tractor className="w-5 h-5 md:w-8 md:h-8" />
                    </div>
                    <p className="text-[10px] md:text-sm text-gray-400 font-medium leading-tight mb-1">Total</p>
                    <p className="text-xl md:text-3xl font-bold text-white">{stats.totalMachines}</p>
                </div>

                <div className="bg-neutral-800 p-3 md:p-6 rounded-2xl border border-neutral-700 shadow-xl flex flex-col items-center justify-center text-center">
                    <div className="p-2 md:p-3 bg-green-500/20 text-green-500 rounded-xl mb-2 md:mb-3">
                        <Eye className="w-5 h-5 md:w-8 md:h-8" />
                    </div>
                    <p className="text-[10px] md:text-sm text-gray-400 font-medium leading-tight mb-1">Públicas</p>
                    <p className="text-xl md:text-3xl font-bold text-white">{stats.published}</p>
                </div>

                <div className="bg-neutral-800 p-3 md:p-6 rounded-2xl border border-neutral-700 shadow-xl flex flex-col items-center justify-center text-center">
                    <div className="p-2 md:p-3 bg-purple-500/20 text-purple-400 rounded-xl mb-2 md:mb-3">
                        <TrendingUp className="w-5 h-5 md:w-8 md:h-8" />
                    </div>
                    <p className="text-[10px] md:text-sm text-gray-400 font-medium leading-tight mb-1">Premium</p>
                    <p className="text-xl md:text-3xl font-bold text-white">{stats.premium}</p>
                </div>
            </div>

            <div className="bg-neutral-800 rounded-2xl border border-neutral-700 p-6 md:p-8 text-center max-w-2xl mx-auto mt-8 md:mt-12 shadow-2xl">
                <Tractor className="w-12 h-12 md:w-16 md:h-16 text-brand-yellow mx-auto mb-4" />
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Gestiona tu equipo</h2>
                <p className="text-sm md:text-base text-gray-400 mb-6 px-4">
                    Añade nueva maquinaria a nuestro catálogo o administra tus anuncios actuales.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 px-4">
                    <Link
                        href="/dashboard/machines/new"
                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 md:py-4 border border-transparent text-sm md:text-base font-bold rounded-xl text-brand-black bg-brand-yellow hover:bg-yellow-400 transition-colors shadow-lg shadow-brand-yellow/20"
                    >
                        Publicar Nueva
                    </Link>
                    <Link
                        href="/dashboard/machines"
                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 md:py-4 border-2 border-neutral-600 text-sm md:text-base font-bold rounded-xl text-white hover:bg-neutral-700 hover:border-neutral-500 transition-colors"
                    >
                        Ver Mis Anuncios
                    </Link>
                </div>
            </div>
        </div>
    );
}
