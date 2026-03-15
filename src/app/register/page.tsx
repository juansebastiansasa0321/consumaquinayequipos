"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(data.error || "Error al registrarse");
      }
    } catch (err) {
      setError("Ocurrió un error de red.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
            <div className="bg-brand-yellow p-3 rounded-xl mb-6">
                <Building2 className="w-10 h-10 text-brand-black" />
            </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-white">
          Crea tu Cuenta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-medium text-brand-yellow hover:text-yellow-400 transition-colors">
            Inicia sesión aquí
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-neutral-800 py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-neutral-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Nombre o Empresa
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-neutral-600 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow bg-neutral-900 text-white transition-colors"
                  placeholder="Tu nombre aquí"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Correo Electrónico
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-neutral-600 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow bg-neutral-900 text-white transition-colors"
                  placeholder="ejemplo@correo.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-neutral-600 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow bg-neutral-900 text-white transition-colors"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-brand-black bg-brand-yellow hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-yellow focus:ring-offset-neutral-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Registrarse y Publicar"}
              </button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-neutral-800 text-gray-400">O también puedes</span>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href="/api/auth/google"
                  className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-neutral-600 rounded-xl shadow-sm bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 focus:outline-none transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  Registrarse con Google
                </a>

                <a
                  href="/api/auth/facebook"
                  className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-[#1877F2] rounded-xl shadow-sm bg-[#1877F2] text-sm font-bold text-white hover:bg-[#1664d9] focus:outline-none transition-colors mt-4"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Registrarse con Facebook
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
