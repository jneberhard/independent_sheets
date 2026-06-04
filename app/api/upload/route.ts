import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

// API route that uploads files to Vercel Blob storage
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const folder = formData.get("folder") as string | null;
    const filename = `${Date.now()}-${file.name}`;
    const pathname = folder ? `${folder}/${filename}` : filename;

    const access = "public";  //changed to public

    const token = process.env.BLOB_READ_WRITE_TOKEN;

    if (!token) {
      console.error("❌ ERROR: BLOB_READ_WRITE_TOKEN is missing or completely unreadable by Next.js!");
      return NextResponse.json(
        { error: "Server missing storage credentials configurations" },
        { status: 500 }
      );
    }

    const blob = await put(pathname, file, {
      access,
      token,
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      pathname: blob.pathname,
    });

  } catch (error) {
    console.error("Upload failed internally:", error);

    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}