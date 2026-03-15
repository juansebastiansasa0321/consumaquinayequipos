import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { SignJWT } from "jose";
import bcrypt from "bcrypt";
import crypto from "crypto";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback_secret_for_local_development_only'
);

export async function GET(req: Request) {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");
    
    // Dynamically match environments so Localhost testings stay local and Vercel stays on Vercel
    const host = req.headers.get("host") || "";
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    if (error) {
        console.error("Google OAuth Error:", error);
        return NextResponse.redirect(`${baseUrl}/login?error=Google_Auth_Failed`);
    }

    if (!code) {
        return NextResponse.redirect(`${baseUrl}/login?error=No_Code_Provided`);
    }

    const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    try {
        // 1. Exchange 'code' for 'access_token'
        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                code,
                client_id: clientId || '',
                client_secret: clientSecret || '',
                redirect_uri: redirectUri,
                grant_type: "authorization_code"
            })
        });

        const tokenData = await tokenRes.json();
        
        if (!tokenData.access_token) {
            console.error("Failed to exchange token:", tokenData);
            return NextResponse.redirect(`${baseUrl}/login?error=Token_Exchange_Failed&details=${encodeURIComponent(tokenData.error_description || tokenData.error || 'unknown')}`);
        }

        // 2. Use access_token to fetch user profile info
        const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });

        const userData = await userRes.json();

        if (!userData.email) {
            console.error("No email in Google response:", userData);
            return NextResponse.redirect(`${baseUrl}/login?error=Email_Required`);
        }

        // 3. Find or Create User in Database
        let user;
        const existingCheck = await sql`SELECT * FROM users WHERE email = ${userData.email} LIMIT 1`;
        
        if (existingCheck.length > 0) {
            user = existingCheck[0];
            // Optional: You could update name/picture here if you wanted.
        } else {
            // Create a new user with 'google' provider
            const secureRandomPassword = crypto.randomBytes(32).toString('hex');
            const hashedPassword = await bcrypt.hash(secureRandomPassword, 10);
            
            const insertReq = await sql`
                INSERT INTO users (name, email, password_hash, role, provider)
                VALUES (${userData.name || 'Usuario de Google'}, ${userData.email}, ${hashedPassword}, 'client', 'google')
                RETURNING *;
            `;
            user = insertReq[0];
        }

        // 4. Generate JWT Session Token (matching our custom Auth logic)
        const token = await new SignJWT({ 
            userId: user.id, 
            email: user.email, 
            role: user.role 
        })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(JWT_SECRET);

        // 5. Set Cookie and Redirect to Dashboard
        const response = NextResponse.redirect(`${baseUrl}/dashboard`);
        
        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 // 7 days
        });

        return response;

    } catch (err) {
        console.error("Google Callback Error:", err);
        return NextResponse.redirect(`${baseUrl}/login?error=Server_Error`);
    }
}
