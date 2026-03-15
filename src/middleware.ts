import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_for_local_development_only'
);

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect Dashboard and Admin routes
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
        const token = request.cookies.get('auth-token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            const { payload } = await jwtVerify(token, JWT_SECRET);

            // Special check: Only Admins can access /admin
            if (pathname.startsWith('/admin') && payload.role !== 'admin') {
               return NextResponse.redirect(new URL('/dashboard', request.url));
            }

            // Client/Admin can access dashboard
            return NextResponse.next();

        } catch (error) {
            // Invalid token
            console.error("JWT Verification failed in middleware.", error);
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('auth-token');
            return response;
        }
    }

    // Redirect logged in users away from auth pages
    if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
        const token = request.cookies.get('auth-token')?.value;
        if (token) {
             try {
                await jwtVerify(token, JWT_SECRET);
                return NextResponse.redirect(new URL('/dashboard', request.url));
             } catch(e) {}
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/register'],
};
