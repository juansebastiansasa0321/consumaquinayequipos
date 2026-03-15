import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const host = req.headers.get("host") || "";
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;
    
    const clientId = process.env.FACEBOOK_APP_ID?.trim();
    const redirectUri = `${baseUrl}/api/auth/facebook/callback`;

    if (!clientId) {
        console.error("Missing FACEBOOK_APP_ID");
        return NextResponse.redirect(new URL('/login?error=Facebook_OAuth_Not_Configured', baseUrl));
    }

    const scope = "email,public_profile";
    // Construct Facebook OAuth URL
    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'email,public_profile',
        auth_type: 'rerequest', // Ensures we ask for declined permissions again
        display: 'popup'
    });

    const facebookAuthUrl = `https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`;

    return NextResponse.redirect(facebookAuthUrl);
}
