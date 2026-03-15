import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback_secret_for_local_development_only'
);

// Helper to verify Admin JWT
async function verifyAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        if (payload.role !== 'admin') return null;
        return payload;
    } catch {
        return null;
    }
}

export async function GET() {
    try {
        const adminPayload = await verifyAdmin();
        if (!adminPayload) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch users along with the count of their published machines
        const usersResult = await sql`
            SELECT 
                u.id, 
                u.name, 
                u.email, 
                u.role, 
                u.created_at,
                COUNT(m.id) as machines_count
            FROM users u
            LEFT JOIN machines m ON u.id = m.user_id
            GROUP BY u.id
            ORDER BY u.created_at DESC
        `;

        return NextResponse.json({ users: usersResult });
    } catch (error) {
        console.error("DB GET Admin Users Error:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
