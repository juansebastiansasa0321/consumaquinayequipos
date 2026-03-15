const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.prodcheck' }); // using .env.prodcheck which we know has the DB url

async function updateSchema() {
  try {
    const result = await sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS facebook_id VARCHAR(255) UNIQUE;
    `;
    console.log("Migration successful:", result);
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

updateSchema();
