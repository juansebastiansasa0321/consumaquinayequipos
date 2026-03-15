require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env.development.local' });
process.env.POSTGRES_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;
const { sql } = require('@vercel/postgres');

async function setupMarketplace() {
    try {
        console.log("Setting up Marketplace Database Tables...");

        console.log("Creating users table...");
        await sql`
            CREATE TABLE IF NOT EXISTS users (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                name VARCHAR(255) NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'client',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;
        console.log("Users table created successfully.");

        console.log("Altering machines table for marketplace...");
        await sql`
            ALTER TABLE machines
            ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL,
            ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'published',
            ADD COLUMN IF NOT EXISTS visibility_tier VARCHAR(50) DEFAULT 'free',
            ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255),
            ADD COLUMN IF NOT EXISTS seo_description TEXT;
        `;
        console.log("Machines table altered successfully.");

        // Optionally, create an default admin user if none exists and assign existing machines to them
        console.log("Checking for default admin...");
        const adminCheck = await sql`SELECT id FROM users WHERE email = 'admin@consumaquina.com' LIMIT 1;`;
        let adminId;

        // Note: In production you'd use a strong tool like bcrypt to hash the password
        // For this initialization, we'll insert a plain text stub or a known bcrypt hash for 'admin123'
        // Let's use a bcrypt hash for 'admin123' for simplicity of the admin login later
        // Hash generated via bcrypt.hashSync('admin123', 10)
        const passwordHash = '$2a$10$QO20f2tW7B.O.Hw36z.14OO.B.IStJtA2qJ8N4J8V88wP3.H4O78e'; 

        if (adminCheck.rows.length === 0) {
            console.log("Creating default admin user...");
            const insertAdmin = await sql`
                INSERT INTO users (name, email, password_hash, role)
                VALUES ('Admin', 'admin@consumaquina.com', ${passwordHash}, 'admin')
                RETURNING id;
            `;
            adminId = insertAdmin.rows[0].id;
        } else {
            adminId = adminCheck.rows[0].id;
        }

        console.log("Assigning existing machines to default admin...");
        await sql`
            UPDATE machines
            SET user_id = ${adminId}
            WHERE user_id IS NULL;
        `;
        console.log("Existing machines assigned.");

        console.log("Marketplace DB setup complete!");

    } catch (err) {
        console.error("Error setting up marketplace db:", err);
    }
}

setupMarketplace();
