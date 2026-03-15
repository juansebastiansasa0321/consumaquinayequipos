import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback_secret_for_local_development_only'
);

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userId = payload.id as string;

        const machines = await sql`
            SELECT id, title, price, status, visibility_tier, created_at, images, expires_at, whatsapp_clicks
            FROM machines
            WHERE user_id = ${userId}
            ORDER BY created_at DESC
        `;

        return NextResponse.json({ machines: machines });

    } catch (error) {
        console.error('Error fetching client machines:', error);
        return NextResponse.json({ error: 'Failed to fetch machines' }, { status: 500 });
    }
}
