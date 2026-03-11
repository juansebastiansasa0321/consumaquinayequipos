import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

// Delete a contact
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: paramId } = await params;
        const id = parseInt(paramId);
        if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

        await sql`DELETE FROM contacts WHERE id = ${id}`;
        return NextResponse.json({ success: true, message: "Contact deleted" });
    } catch (error) {
        console.error("Error deleting contact:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Update a contact (status)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: paramId } = await params;
        const id = parseInt(paramId);
        if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

        const body = await req.json();
        
        if (body.status) {
            await sql`UPDATE contacts SET status = ${body.status} WHERE id = ${id}`;
        }
        
        return NextResponse.json({ success: true, message: "Contact updated" });
    } catch (error) {
        console.error("Error updating contact:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
