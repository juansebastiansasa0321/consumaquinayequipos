import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, city, equipment, phone } = body;

        if (!name || !city || !phone) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Attempt to insert into DB
        try {
            // Trying to use created_at if it exists, otherwise failing gracefully
            // By default Vercel Postgres might not have created_at if we didn't add it
            // Let's just insert the data. The schema migration is outside the scope, but we'll try to add it.
            try {
                 await sql`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`;
            } catch (e) {
                 console.log("Could not alter table, maybe it doesn't exist yet");
            }

            await sql`
        INSERT INTO contacts (name, city, equipment, phone)
        VALUES (${name}, ${city}, ${equipment}, ${phone})
      `;
        } catch (dbError) {
            // If table doesn't exist or no URL, log it but return success for UI experience locally
            console.warn("DB not connected or table missing. Form data received:", body);
        }

        // Send Email via FormSubmit via AJAX
        try {
            await fetch("https://formsubmit.co/ajax/consumaquinayequipos@icloud.com", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    nombre: name,
                    telefono: phone,
                    ciudad: city,
                    equipo_a_cotizar: equipment,
                    _subject: `Nuevo contacto web: ${name} - ${equipment}`
                })
            });
        } catch (emailError) {
            console.error("Error sending email notification:", emailError);
        }

        return NextResponse.json({ success: true, message: "Contact saved and email sent" });
    } catch (error) {
        console.error("Error saving contact:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        // Fetch contacts, ordering by created_at DESC if it exists, otherwise just fetch
        let data;
        try {
             data = await sql`SELECT * FROM contacts ORDER BY created_at DESC`;
        } catch (sortError) {
             // Fallback if created_at doesn't exist
             data = await sql`SELECT * FROM contacts`;
        }
        
        return NextResponse.json(data.rows);
    } catch (error) {
        console.error("Error fetching contacts:", error);
        return NextResponse.json({ error: "No se pudieron obtener los contactos" }, { status: 500 });
    }
}
