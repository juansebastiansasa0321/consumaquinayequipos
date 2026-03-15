import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Consumaquinayequipos | Maquinaria Pesada Chocó y Cauca",
  description: "Distribución especializada de maquinaria pesada, motores industriales y excavadoras de 21 toneladas (Zoomlion) para los sectores de minería e infraestructura en las regiones de Chocó y el Cauca, Colombia.",
};

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import WhatsAppButton from "@/components/ui/whatsapp-button";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  let userName = null;

  if (token) {
    try {
      const JWT_SECRET = new TextEncoder().encode(
        process.env.JWT_SECRET || 'fallback_secret_for_local_development_only'
      );
      const { payload } = await jwtVerify(token, JWT_SECRET);
      userName = (payload.name as string) || (payload.email as string)?.split('@')[0];
    } catch (e) {
      console.error("Invalid token in layout", e);
    }
  }

  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-brand-background text-brand-foreground min-h-screen flex flex-col overflow-x-hidden`}>
        <Header userName={userName} />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
