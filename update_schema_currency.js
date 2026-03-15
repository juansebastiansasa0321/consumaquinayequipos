require("dotenv").config({ path: ".env.local" });
const { sql } = require("@vercel/postgres");

async function addCurrency() {
  console.log("Conectando a la base de datos para Multimoneda...");

  try {
    console.log("Agregando columna currency...");
    await sql`ALTER TABLE machines ADD COLUMN IF NOT EXISTS currency VARCHAR(3) NOT NULL DEFAULT 'COP';`;

    console.log("¡Migración completada con éxito!");
  } catch (error) {
    console.error("Error durante la migración:", error);
  }
}

addCurrency();
