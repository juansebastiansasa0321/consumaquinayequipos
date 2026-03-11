import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
    const { searchParams } = new URL(request.url);
    const originalFilename = searchParams.get("filename");

    if (!originalFilename) {
        return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    // Add a timestamp to the filename to prevent overwriting images with the same name
    const filename = `${Date.now()}-${originalFilename}`;

    if (!request.body) {
        return NextResponse.json({ error: "Request body is missing" }, { status: 400 });
    }

    try {
        const blob = await put(filename, request.body, {
            access: "public",
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        return NextResponse.json(blob);
    } catch (error: any) {
        console.error("Error uploading to Vercel Blob. Make sure BLOB_READ_WRITE_TOKEN is set:", error);
        return NextResponse.json({ error: error.message || "Error al subir a Vercel Blob" }, { status: 500 });
    }
}
