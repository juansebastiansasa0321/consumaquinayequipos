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
  title: "Excavadora Zoomlion 21 Toneladas en Cali | Consumaquinayequipos",
  description: "Venta de excavadora hidráulica Zoomlion ZE215E de 21 toneladas en Cali, Valle del Cauca. Motor Cummins 173 HP. Entrega inmediata. También minicargadores, volquetas y maquinaria pesada para minería e infraestructura en Colombia. Cotiza por WhatsApp: +57 310 575 3752.",
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
};

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import WhatsAppButton from "@/components/ui/whatsapp-button";
import { cookies, headers } from "next/headers";
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

  // Leer el pathname del header que pone el middleware
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isLandingPage = pathname.endsWith("/landing");

  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-brand-background text-brand-foreground min-h-screen flex flex-col overflow-x-hidden`}>
        {!isLandingPage && <Header userName={userName} />}
        <main className="flex-1">
          {children}
        </main>
        {!isLandingPage && <Footer />}
        {!isLandingPage && <WhatsAppButton />}
      </body>
    </html>
  );
}

