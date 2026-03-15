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
        console.error("Facebook OAuth Error:", error);
        return NextResponse.redirect(`${baseUrl}/login?error=Facebook_Auth_Failed`);
    }

    if (!code) {
        return NextResponse.redirect(`${baseUrl}/login?error=No_Code_Provided`);
    }

    const clientId = process.env.FACEBOOK_APP_ID?.trim();
    const clientSecret = process.env.FACEBOOK_APP_SECRET?.trim();
    const redirectUri = `${baseUrl}/api/auth/facebook/callback`;

    try {
        // 1. Exchange 'code' for 'access_token' via Facebook Graph API
        const tokenRes = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?client_id=${clientId}&redirect_uri=${redirectUri}&client_secret=${clientSecret}&code=${code}`);

        const tokenData = await tokenRes.json();
        
        if (!tokenData.access_token) {
            console.error("Failed to exchange Facebook token:", tokenData);
            return NextResponse.redirect(`${baseUrl}/login?error=Token_Exchange_Failed&details=${encodeURIComponent(tokenData.error?.message || 'unknown')}`);
        }

        // 2. Use access_token to fetch user profile info (must explicitly request fields)
        const userRes = await fetch(`https://graph.facebook.com/v19.0/me?fields=id,name,email&access_token=${tokenData.access_token}`);

        const userData = await userRes.json();

        let userEmail = userData.email;
        
        if (!userEmail) {
            console.warn("No email in Facebook response. Using fallback placeholder.");
            // Generate a guaranteed unique placeholder email for the database
            userEmail = `${userData.id}@facebook.user.consumaquina.com`;
        }

        // 3. Find or Create User in Database
        let user;
        const existingCheck = await sql`SELECT * FROM users WHERE email = ${userEmail} OR facebook_id = ${userData.id} LIMIT 1`;
        
        if (existingCheck.length > 0) {
            user = existingCheck[0];
            // Optionally link the facebook_id if it wasn't linked yet
            if (!user.facebook_id) {
                await sql`UPDATE users SET facebook_id = ${userData.id} WHERE id = ${user.id}`;
            }
        } else {
            // Create a new user with 'facebook' provider
            const secureRandomPassword = crypto.randomBytes(32).toString('hex');
            const hashedPassword = await bcrypt.hash(secureRandomPassword, 10);
            
            const insertReq = await sql`
                INSERT INTO users (name, email, password_hash, role, provider, facebook_id)
                VALUES (${userData.name || 'Usuario de Facebook'}, ${userEmail}, ${hashedPassword}, 'client', 'facebook', ${userData.id})
                RETURNING *;
            `;
            user = insertReq[0];
        }

        // 4. Generate JWT Session Token
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

    } catch (err: any) {
        console.error("Facebook Callback Error:", err);
        return NextResponse.redirect(`${baseUrl}/login?error=Server_Error`);
    }
}
