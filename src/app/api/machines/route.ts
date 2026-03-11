import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET() {
    try {
        const { rows } = await sql`SELECT * FROM machines ORDER BY created_at DESC`;
        return NextResponse.json({ machines: rows });
    } catch (error) {
        console.error("DB GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch machines", machines: [] }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, description, price, hours, location, tags, images } = body;

        // We store arrays directly as Postgres text arrays in the SQL string thanks to `@vercel/postgres` or as JSON
        // @vercel/postgres actually requires careful syntax for arrays, but jsonb/string[] both can work.
        // For simplicity, assuming tags and images are arrays of strings. Let's serialize arrays to postgres array syntax manually or use JSON.
        // Given schema is TEXT[], we can pass an array in the tagged template logic.
        await sql`
      INSERT INTO machines (title, description, price, hours, location, tags, images)
      VALUES (
        ${title},
        ${description},
        ${price ? Number(price) : null},
        ${hours ? Number(hours) : null},
        ${location},
        ${tags as any}, 
        ${images as any}
      )
    `;

        return NextResponse.json({ success: true, message: "Machine added successfully!" });
    } catch (error) {
        console.error("DB POST Error:", error);
        return NextResponse.json({ error: "Failed to add machine. Make sure POSTGRES_URL is set and table exists." }, { status: 500 });
    }
}
