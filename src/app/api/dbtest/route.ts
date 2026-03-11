import { NextResponse } from "next/server";

export async function GET() {
    const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || 'MISSING';
    
    try {
        const { neon } = require('@neondatabase/serverless');
        const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
        const sql = neon(connectionString);
        const result = await sql`SELECT 1 as alive`;
        return NextResponse.json({ status: 'connected', db_url_prefix: dbUrl.substring(0, 30), result });
    } catch (e: any) {
        return NextResponse.json({ status: 'failed', error: e.message, db_url_prefix: dbUrl.substring(0, 30) });
    }
}
