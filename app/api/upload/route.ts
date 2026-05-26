import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

//API route the uploads files to Vercel Blob storage
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

    const pathname = folder
      ? `${folder}/${filename}`
      : filename;

    const access =
      folder === "images" || folder === "previews"
        ? "public"
        : "public";

    const blob = await put(pathname, file, {
      access,
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      pathname: blob.pathname,
    });

  } catch (error) {
    console.error("Upload failed:", error);

    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}