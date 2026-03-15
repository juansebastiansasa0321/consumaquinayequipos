require("dotenv").config({ path: ".env.local" });
const { sql } = require("@vercel/postgres");

async function updateSchema() {
  console.log("Conectando a la base de datos para Analytics/Urgencia...");

  try {
    // 1. Agregar columna whatsapp_clicks
    console.log("Agregando columna whatsapp_clicks...");
    await sql`ALTER TABLE machines ADD COLUMN IF NOT EXISTS whatsapp_clicks INTEGER NOT NULL DEFAULT 0;`;

    // 2. Agregar columna is_urgent
    console.log("Agregando columna is_urgent...");
    await sql`ALTER TABLE machines ADD COLUMN IF NOT EXISTS is_urgent BOOLEAN NOT NULL DEFAULT false;`;

    console.log("¡Migración completada con éxito!");
  } catch (error) {
    console.error("Error durante la migración:", error);
  }
}

updateSchema();
