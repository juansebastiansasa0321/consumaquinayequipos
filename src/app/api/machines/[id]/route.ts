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
            const { title, description, price, hours, location, tags, images, usage_type, visibility_tier, contact_phone, contact_phone_2, contact_email, is_urgent } = body;
            
            let durationDays = 30; // default for gratis
            if (visibility_tier === 'plata') {
                durationDays = 45;
            } else if (visibility_tier === 'oro') {
                durationDays = 60;
            }
            await sql`
                UPDATE machines
                SET title = ${title},
                    description = ${description},
                    price = ${price},
                    hours = ${hours},
                    usage_type = ${usage_type || 'hours'},
                    location = ${location},
                    contact_phone = ${contact_phone || null},
                    contact_phone_2 = ${contact_phone_2 || null},
                    contact_email = ${contact_email || null},
                    visibility_tier = ${visibility_tier || 'gratis'},
                    expires_at = CURRENT_TIMESTAMP + (${durationDays} * INTERVAL '1 day'),
                    tags = ${tags ? tags.map(String) : []}::TEXT[],
                    images = ${images ? images.map(String) : []}::TEXT[],
                    is_urgent = ${is_urgent === true}
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
