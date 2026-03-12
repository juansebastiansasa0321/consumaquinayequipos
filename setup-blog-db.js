const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function setupBlog() {
    console.log('Connecting to Vercel Postgres to create blog tables...');
    
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS blog_posts (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                slug VARCHAR(255) UNIQUE NOT NULL,
                excerpt TEXT,
                content TEXT NOT NULL,
                featured_image TEXT,
                author VARCHAR(100) DEFAULT 'Admin',
                is_published BOOLEAN DEFAULT true,
                tags TEXT[] DEFAULT '{}',
                meta_title VARCHAR(255),
                meta_description TEXT,
                published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;
        
        console.log('✅ Success! The "blog_posts" table has been created successfully.');
        
    } catch (error) {
        console.error('❌ Failed to create table:', error);
    }
}

setupBlog();
