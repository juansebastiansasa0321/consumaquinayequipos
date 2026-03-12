import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET all blog posts
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const onlyPublished = searchParams.get('published') === 'true';

        let results;
        if (onlyPublished) {
            results = await sql`
                SELECT * FROM blog_posts 
                WHERE is_published = true 
                ORDER BY published_at DESC
            `;
        } else {
            results = await sql`
                SELECT * FROM blog_posts 
                ORDER BY created_at DESC
            `;
        }
        return NextResponse.json(results);
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
    }
}

// CREATE a new blog post
export async function POST(request: Request) {
    try {
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
            INSERT INTO blog_posts (
                title, slug, excerpt, content, featured_image, 
                author, is_published, tags, meta_title, meta_description
            )
            VALUES (
                ${title}, ${slug}, ${excerpt}, ${content}, ${featured_image || null},
                ${author || 'Admin'}, ${is_published}, ${tags ? tags.map(String) : []}::text[], 
                ${meta_title || null}, ${meta_description || null}
            )
            RETURNING *;
        `;

        return NextResponse.json(result[0]);
    } catch (error) {
        console.error('Error creating blog post:', error);
        return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
    }
}
