import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// Delete a machine
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: paramId } = await params;
        const id = parseInt(paramId);
        if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

        await sql`DELETE FROM machines WHERE id = ${id}`;
        return NextResponse.json({ success: true, message: "Machine deleted" });
    } catch (error) {
        console.error("DB DELETE Error:", error);
        return NextResponse.json({ error: "Failed to delete machine" }, { status: 500 });
    }
}

// Update a machine (e.g. is_featured, display_order)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: paramId } = await params;
        const id = parseInt(paramId);
        if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

        const body = await req.json();

        // Check which fields are being updated
        if (body.title) {
            // Full update
            const { title, description, price, hours, location, tags, images } = body;
            await sql`
                UPDATE machines
                SET title = ${title},
                    description = ${description},
                    price = ${price},
                    hours = ${hours},
                    location = ${location},
                    tags = ${tags ? tags.map(String) : []}::TEXT[],
                    images = ${images ? images.map(String) : []}::TEXT[]
                WHERE id = ${id}
            `;
        } else if ('is_featured' in body) {
            // If setting one to true, we might want to set all others to false first if we only want 1 featured machine
            if (body.is_featured === true) {
                await sql`UPDATE machines SET is_featured = false`;
            }
            await sql`UPDATE machines SET is_featured = ${body.is_featured} WHERE id = ${id}`;
        } else if ('display_order' in body) {
            await sql`UPDATE machines SET display_order = ${body.display_order} WHERE id = ${id}`;
        }

        return NextResponse.json({ success: true, message: "Machine updated" });
    } catch (error) {
        console.error("DB PUT Error:", error);
        return NextResponse.json({ error: "Failed to update machine" }, { status: 500 });
    }
}
