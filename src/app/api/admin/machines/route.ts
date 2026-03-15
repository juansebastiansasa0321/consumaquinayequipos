import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback_secret_for_local_development_only'
);

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
        if (!adminPayload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Fetch ALL machines with user data attached, ignoring public filters
        const rows = await sql`
            SELECT 
                m.*, 
                u.name as seller_name,
                u.email as seller_email
            FROM machines m
            LEFT JOIN users u ON m.user_id = u.id
            ORDER BY m.created_at DESC
        `;
        return NextResponse.json({ machines: rows }); 
    } catch (error) {
        console.error("DB GET Admin Machines Error:", error);
        return NextResponse.json({ error: "Failed to fetch all machines", machines: [] }, { status: 500 });
    }
}
