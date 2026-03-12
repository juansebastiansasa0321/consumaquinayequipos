import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET a single blog post by ID or Slug
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        
        let result;
        // Check if ID is numeric (ID) or string (slug)
        if (!isNaN(Number(id))) {
            result = await sql`SELECT * FROM blog_posts WHERE id = ${Number(id)}`;
        } else {
            result = await sql`SELECT * FROM blog_posts WHERE slug = ${id}`;
        }

        if (result.length === 0) {
            return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
        }

        return NextResponse.json(result[0]);
    } catch (error) {
        console.error('Error fetching blog post:', error);
        return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
    }
}

// UPDATE a blog post
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const numericId = parseInt(id, 10);
        
        if (isNaN(numericId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const body = await request.json();
        const {
            title,
            slug,
            excerpt,
            content,
            featured_image,
            author,
            is_published,
            tags,
            meta_title,
            meta_description
        } = body;

        const result = await sql`
            UPDATE blog_posts
            SET 
                title = ${title},
                slug = ${slug},
                excerpt = ${excerpt},
                content = ${content},
                featured_image = ${featured_image || null},
                author = ${author || 'Admin'},
                is_published = ${is_published},
                tags = ${tags ? tags.map(String) : []}::text[],
                meta_title = ${meta_title || null},
                meta_description = ${meta_description || null},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${numericId}
            RETURNING *;
        `;

        if (result.length === 0) {
           return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json(result[0]);
    } catch (error) {
        console.error('Error updating blog post:', error);
        return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
    }
}

// DELETE a blog post
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const numericId = parseInt(id, 10);

        if (isNaN(numericId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        await sql`DELETE FROM blog_posts WHERE id = ${numericId}`;
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting blog post:', error);
        return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
    }
}
