require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env.development.local' });
process.env.POSTGRES_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;
const { sql } = require('@vercel/postgres');

async function setupMonetization() {
    try {
        console.log("Adding Monetization Columns to machines table...");

        await sql`
            ALTER TABLE machines
            ADD COLUMN IF NOT EXISTS contact_phone_2 VARCHAR(50) NULL,
            ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255) NULL,
            ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE NULL,
            ADD COLUMN IF NOT EXISTS republished_at TIMESTAMP WITH TIME ZONE NULL;
        `;

        console.log("Columns added successfully.");
        
        // We will also update any existing null expires_at dates for published machines to have a default 30 days from now 
        // to prevent them from instantly disappearing when we implement the filter.
        console.log("Setting default expires_at for existing machines...");
        await sql`
            UPDATE machines 
            SET expires_at = CURRENT_TIMESTAMP + INTERVAL '30 days'
            WHERE expires_at IS NULL AND status = 'published';
        `;
        console.log("Default expires_at set.");

        console.log("Monetization DB setup complete!");

    } catch (err) {
        console.error("Error setting up monetization db:", err);
    }
}

setupMonetization();
