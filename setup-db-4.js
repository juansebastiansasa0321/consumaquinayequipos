require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env.development.local' });
process.env.POSTGRES_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;
const { sql } = require('@vercel/postgres');

async function alterMachinesTable() {
  try {
    console.log("Altering machines table for usage_type...");
    await sql`
      ALTER TABLE machines
      ADD COLUMN IF NOT EXISTS usage_type VARCHAR(20) DEFAULT 'hours';
    `;
    console.log("Machines table altered successfully.");
  } catch (err) {
    console.error("Error altering machines table:", err);
  }
}

alterMachinesTable();
