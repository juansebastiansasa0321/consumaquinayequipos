require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function main() {
  console.log('Connecting to Vercel Postgres to update monetization schema...');

  try {
    // 1. Add new columns
    console.log('Adding new columns (expires_at, contact_phone_2, contact_email)...');
    await sql`ALTER TABLE machines ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;`;
    await sql`ALTER TABLE machines ADD COLUMN IF NOT EXISTS contact_phone_2 VARCHAR(50);`;
    await sql`ALTER TABLE machines ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255);`;

    // 2. Temporarily drop constraint and migrate data
    console.log('Migrating existing visibility_tier values to new format...');
    await sql`ALTER TABLE machines DROP CONSTRAINT IF EXISTS machines_visibility_tier_check;`;
    await sql`UPDATE machines SET visibility_tier = 'basico' WHERE visibility_tier IN ('gratis', 'free');`;
    await sql`UPDATE machines SET visibility_tier = 'plata' WHERE visibility_tier = 'featured';`;
    await sql`UPDATE machines SET visibility_tier = 'oro' WHERE visibility_tier = 'premium';`;

    // 3. Re-apply strict constraint
    console.log('Applying strict constraint for visibility_tier (basico, plata, oro)...');
    await sql`ALTER TABLE machines ADD CONSTRAINT machines_visibility_tier_check CHECK (visibility_tier IN ('basico', 'plata', 'oro'));`;

    console.log('Monetization schema updated successfully.');
  } catch (error) {
    console.error('Error updating schema:', error);
  } finally {
    process.exit(0);
  }
}

main();
