import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';

if (!connectionString) {
    console.warn('WARNING: No database connection string found. Set DATABASE_URL or POSTGRES_URL.');
}

export const sql = neon(connectionString);
