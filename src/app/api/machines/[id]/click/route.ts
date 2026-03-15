import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Falta el ID de la máquina" }, { status: 400 });
    }

    if (!process.env.POSTGRES_URL) {
      // Degrado gracefully si no hay DB (útil para dev/build)
      return NextResponse.json({ success: true, message: "Modo mock: Clic registrado" });
    }

    // Incrementamos el contador de clics de WhatsApp atómicamente
    await sql`
      UPDATE machines 
      SET whatsapp_clicks = COALESCE(whatsapp_clicks, 0) + 1 
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true, message: "Clic registrado correctamente" });
  } catch (error) {
    console.error("Error registrando clic de WhatsApp:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error instanceof Error ? error.message : "Desconocido" },
      { status: 500 }
    );
  }
}
