require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env.development.local' });
process.env.POSTGRES_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;
const { sql } = require('@vercel/postgres');

async function alterTables() {
  try {
    console.log("Altering tables...");
    await sql`
      ALTER TABLE machines
      ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
    `;
    console.log("Machines table altered successfully.");
  } catch (err) {
    console.error("Error altering tables:", err);
  }
}

alterTables();
