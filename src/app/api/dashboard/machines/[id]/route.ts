import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback_secret_for_local_development_only'
);

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: paramId } = await params;
        const id = parseInt(paramId, 10);
        if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userId = payload.id as string;

        const machines = await sql`
            SELECT *
            FROM machines
            WHERE id = ${id} AND user_id = ${userId}
            LIMIT 1
        `;

        if (machines.length === 0) {
            return NextResponse.json({ error: 'Machine not found or not authorized' }, { status: 404 });
        }

        return NextResponse.json({ machine: machines[0] });

    } catch (error) {
        console.error('Error fetching machine for edit:', error);
        return NextResponse.json({ error: 'Failed to fetch machine' }, { status: 500 });
    }
}
