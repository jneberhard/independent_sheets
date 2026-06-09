import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

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

    const access = "public";
    const token = process.env.BLOB_READ_WRITE_TOKEN;

    if (!token) {
      console.error("❌ ERROR: BLOB_READ_WRITE_TOKEN is missing or completely unreadable by Next.js!");
      return NextResponse.json(
        { error: "Server missing storage credentials configurations" },
        { status: 500 }
      );
    }

    //AUTOMATICALLY EXTRACT 2-PAGE SAMPLE FOR SHEET MUSIC ---
    if (folder === "sheet-music" && file.type === "application/pdf") {
      const arrayBuffer = await file.arrayBuffer();

      // Load original file and create empty container document
      const originalDoc = await PDFDocument.load(arrayBuffer);
      const sampleDoc = await PDFDocument.create();

      // Extract up to 2 pages safely
      const pageCount = originalDoc.getPageCount();
      const pagesToExtract = Math.min(pageCount, 2);

      const copiedPages = await sampleDoc.copyPages(
        originalDoc,
        Array.from({ length: pagesToExtract }, (_, i) => i)
      );
      copiedPages.forEach((page) => sampleDoc.addPage(page));

      // Serialize sample document to binary bytes
      const samplePdfBytes = await sampleDoc.save();

      // Establish paths (Keeping your exact filename construction pattern)
      const samplePathname = `sheet-music/previews/sample-${filename}`;

      const sampleBuffer = Buffer.from(samplePdfBytes);

      // Concurrent upload to Vercel Blob
      const [mainBlob, sampleBlob] = await Promise.all([
        put(pathname, file, { access, token }),
        put(samplePathname, sampleBuffer, {
          access,
          token,
          contentType: "application/pdf"
        })
      ]);

      return NextResponse.json({
        success: true,
        url: mainBlob.url,
        pathname: mainBlob.pathname,
        previewUrl: sampleBlob.url,
      });
    }

    // STANDARD FILE UPLOADS (IMAGES, MP3, COVERS) ---
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