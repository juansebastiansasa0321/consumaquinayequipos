// Setup script for the new Neon database
const { neon } = require('@neondatabase/serverless');

const sql = neon('postgresql://neondb_owner:npg_Z3byav2rcgnB@ep-morning-shadow-a41evzje.us-east-1.aws.neon.tech/neondb?sslmode=require');

async function setup() {
    console.log("Setting up database tables...");
    
    // Create machines table
    await sql`
        CREATE TABLE IF NOT EXISTS machines (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            price NUMERIC,
            hours NUMERIC,
            location TEXT,
            tags TEXT[],
            images TEXT[],
            is_featured BOOLEAN DEFAULT false,
            display_order INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    console.log("✅ machines table created");
    
    // Create contacts table
    await sql`
        CREATE TABLE IF NOT EXISTS contacts (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            city TEXT,
            equipment TEXT,
            phone TEXT NOT NULL,
            status VARCHAR(50) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    console.log("✅ contacts table created");
    
    console.log("\n✅ Database setup complete!");
}

setup().catch(console.error);
