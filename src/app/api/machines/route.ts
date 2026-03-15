import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const locationFilter = url.searchParams.get("location");

        let rows;
        if (locationFilter) {
            rows = await sql`
                SELECT m.*, u.name as seller_name 
                FROM machines m
                LEFT JOIN users u ON m.user_id = u.id
                WHERE m.status = 'published' 
                  AND (m.expires_at > CURRENT_TIMESTAMP OR m.expires_at IS NULL)
                  AND m.location ILIKE ${`%${locationFilter}%`}
                ORDER BY 
                    CASE m.visibility_tier
                        WHEN 'oro' THEN 1
                        WHEN 'plata' THEN 2
                        WHEN 'basico' THEN 3
                        ELSE 4
                    END ASC,
                    m.created_at DESC
            `;
        } else {
            rows = await sql`
                SELECT m.*, u.name as seller_name 
                FROM machines m
                LEFT JOIN users u ON m.user_id = u.id
                WHERE m.status = 'published' 
                  AND (m.expires_at > CURRENT_TIMESTAMP OR m.expires_at IS NULL)
                ORDER BY 
                    CASE m.visibility_tier
                        WHEN 'oro' THEN 1
                        WHEN 'plata' THEN 2
                        WHEN 'basico' THEN 3
                        ELSE 4
                    END ASC,
                    m.created_at DESC
            `;
        }
        return NextResponse.json({ machines: rows });
    } catch (error) {
        console.error("DB GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch machines", machines: [] }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, description, price, hours, location, tags, images, usage_type } = body;

        // We store arrays directly as Postgres text arrays in the SQL string thanks to `@vercel/postgres` or as JSON
        // @vercel/postgres actually requires careful syntax for arrays, but jsonb/string[] both can work.
        // For simplicity, assuming tags and images are arrays of strings. Let's serialize arrays to postgres array syntax manually or use JSON.
        // Given schema is TEXT[], we can pass an array in the tagged template logic.
        await sql`
      INSERT INTO machines (title, description, price, hours, location, tags, images, display_order, is_featured, usage_type)
      VALUES (
        ${title},
        ${description},
        ${price ? Number(price) : null},
        ${hours ? Number(hours) : null},
        ${location},
        ${tags as any}, 
        ${images as any},
        0,
        false,
        ${usage_type || 'hours'}
      )
    `;

        return NextResponse.json({ success: true, message: "Machine added successfully!" });
    } catch (error) {
        console.error("DB POST Error:", error);
        return NextResponse.json({ error: "Failed to add machine. Make sure POSTGRES_URL is set and table exists." }, { status: 500 });
    }
}
