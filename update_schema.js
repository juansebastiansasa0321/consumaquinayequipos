require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env.development.local' });
process.env.POSTGRES_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;
const { sql } = require('@vercel/postgres');

async function run() {
    try {
        console.log("Adding provider column...");
        await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS provider VARCHAR(50) DEFAULT 'local'`;
        console.log("Adding google_id column...");
        await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE`;
        console.log("Done!");
    } catch(err) {
        console.error(err);
    }
}
run();
