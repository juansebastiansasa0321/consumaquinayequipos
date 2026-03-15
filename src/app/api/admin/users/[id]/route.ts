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

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const adminPayload = await verifyAdmin();
        if (!adminPayload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;

        // Prevent self-deletion
        if (adminPayload.userId === id) {
            return NextResponse.json({ error: "No puedes eliminar tu propia cuenta" }, { status: 400 });
        }

        // Hard delete machines first (cascade)
        await sql`DELETE FROM machines WHERE user_id = ${id}`;
        
        // Delete user
        await sql`DELETE FROM users WHERE id = ${id}`;

        return NextResponse.json({ success: true, message: "User and their machines deleted successfully." });
    } catch (error) {
        console.error("DB DELETE Admin User Error:", error);
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const adminPayload = await verifyAdmin();
        if (!adminPayload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;

        // Prevent modifying own role
        if (adminPayload.userId === id) {
            return NextResponse.json({ error: "No puedes cambiar tu propio rol" }, { status: 400 });
        }

        const body = await req.json();
        const newRole = body.role === 'admin' ? 'admin' : 'client';

        await sql`UPDATE users SET role = ${newRole} WHERE id = ${id}`;

        return NextResponse.json({ success: true, message: "User role updated successfully." });
    } catch (error) {
        console.error("DB PUT Admin User Role Error:", error);
        return NextResponse.json({ error: "Failed to update user role" }, { status: 500 });
    }
}
