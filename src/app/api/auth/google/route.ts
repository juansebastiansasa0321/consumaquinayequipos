import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const host = req.headers.get("host") || "";
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;
    
    const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    if (!clientId) {
        console.error("Missing GOOGLE_CLIENT_ID");
        return NextResponse.redirect(new URL('/login?error=Google_OAuth_Not_Configured', baseUrl));
    }

    const scope = "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=online`;

    return NextResponse.redirect(authUrl);
}
