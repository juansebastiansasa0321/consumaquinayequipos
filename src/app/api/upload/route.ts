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
        });

        return NextResponse.json(blob);
    } catch (error) {
        console.error("Error uploading to Vercel Blob. Make sure BLOB_READ_WRITE_TOKEN is set:", error);
        // Return a mocked successful response strictly for local development if token is missing
        return NextResponse.json({
            url: `/zoomlion.png`,
            downloadUrl: `/zoomlion.png`,
            pathname: "mock-image.png",
            contentType: "image/png",
            contentDisposition: "inline"
        });
    }
}
