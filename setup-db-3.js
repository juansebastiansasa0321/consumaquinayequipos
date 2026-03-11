require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env.development.local' });
process.env.POSTGRES_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;
const { sql } = require('@vercel/postgres');

async function alterContactsTable() {
  try {
    console.log("Altering contacts table...");
    await sql`
      ALTER TABLE contacts
      ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';
    `;
    console.log("Contacts table altered successfully.");
  } catch (err) {
    console.error("Error altering contacts table:", err);
  }
}

alterContactsTable();
