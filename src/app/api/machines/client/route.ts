import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback_secret_for_local_development_only'
);

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userId = payload.id as string;

        const body = await req.json();
        const { 
            title, 
            description, 
            price, 
            hours, 
            location, 
            tags, 
            images, 
            usage_type,
            visibility_tier,
            contact_phone,
            contact_phone_2,
            contact_email,
            is_urgent,
            currency
        } = body;

        // Handle expiration logic based on new monetization tiers
        let expiresAtQuery = sql`CURRENT_TIMESTAMP + (30 * INTERVAL '1 day')`; // defaults to basico
        
        if (visibility_tier === 'plata') {
            expiresAtQuery = sql`CURRENT_TIMESTAMP + (90 * INTERVAL '1 day')`;
        } else if (visibility_tier === 'oro') {
            expiresAtQuery = sql`NULL`; // Oro never expires
        }

        // Base SEO generation (can be improved later)
        const seo_title = `${title} en venta | ConsuMáquina y Equipos`;
        const seo_description = `Encuentra ${title} en ${location}. ${description.substring(0, 100)}...`;

        await sql`
            INSERT INTO machines (
                title, 
                description, 
                price, 
                hours, 
                location, 
                tags, 
                images, 
                usage_type,
                user_id,
                status,
                visibility_tier,
                seo_title,
                seo_description,
                display_order,
                is_featured,
                contact_phone,
                contact_phone_2,
                contact_email,
                expires_at,
                is_urgent,
                currency
            )
            VALUES (
                ${title},
                ${description},
                ${price ? Number(price) : null},
                ${hours ? Number(hours) : null},
                ${location},
                ${tags as any}, 
                ${images as any},
                ${usage_type || 'hours'},
                ${userId},
                'published',
                ${visibility_tier || 'basico'},
                ${seo_title},
                ${seo_description},
                0,
                false,
                ${contact_phone || null},
                ${contact_phone_2 || null},
                ${contact_email || null},
                ${expiresAtQuery},
                ${is_urgent ? true : false},
                ${currency || 'COP'}
            )
        `;

        return NextResponse.json({ success: true, message: "Machine published successfully by client!" });

    } catch (error) {
        console.error("Client DB POST Error:", error);
        return NextResponse.json({ error: "Failed to publish machine." }, { status: 500 });
    }
}
