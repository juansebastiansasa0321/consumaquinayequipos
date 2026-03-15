import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        // Check if user exists
        const existingUsers = await sql`SELECT id FROM users WHERE email = ${email}`;
        if (existingUsers.length > 0) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
        }

        const hashed = await hashPassword(password);

        // Insert new user
        const result = await sql`
            INSERT INTO users (name, email, password_hash, role)
            VALUES (${name || null}, ${email}, ${hashed}, 'client')
            RETURNING id, name, email, role
        `;
        const newUser = result[0];

        // Create JWT token and set cookie
        const token = await signToken({
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
        });

        const cookieStore = await cookies();
        cookieStore.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 1 week
            path: '/',
        });

        return NextResponse.json({ user: newUser, success: true });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Failed to register account' }, { status: 500 });
    }
}
