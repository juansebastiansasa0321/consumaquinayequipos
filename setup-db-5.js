require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env.development.local' });
process.env.POSTGRES_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;
const { sql } = require('@vercel/postgres');

async function addContactPhone() {
    try {
        console.log("Adding contact_phone to machines table...");
        await sql`
            ALTER TABLE machines
            ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50);
        `;
        console.log("Column contact_phone added successfully.");
    } catch (err) {
        console.error("DB Error:", err);
    }
}

addContactPhone();
