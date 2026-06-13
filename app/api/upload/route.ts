import { put } from "@vercel/blob";
import { PDFDocument } from "pdf-lib";
import { NextResponse } from "next/server";

// POST handler to upload a file to Vercel Blob Storage, with special handling
// for sheet music PDFs to automatically generate a 2-page sample preview.
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

    // The folder keeps uploads organized, and we can tighten access rules later
    // if we split private PDF files from public preview assets.
    const access = "public";

    const token = process.env.BLOB_READ_WRITE_TOKEN;

    if (!token) {
      console.error(
        "BLOB_READ_WRITE_TOKEN is missing or unreadable by Next.js."
      );
      return NextResponse.json(
        { error: "Server missing storage credentials configurations" },
        { status: 500 }
      );
    }

    // For sheet music PDFs, we generate a 2-page preview sample so customers
    // can see the opening pages without exposing the whole file.
    if (folder === "sheet-music" && file.type === "application/pdf") {
      const arrayBuffer = await file.arrayBuffer();
      
      try {
        const originalDoc = await PDFDocument.load(arrayBuffer);
        const sampleDoc = await PDFDocument.create();

        const pageCount = originalDoc.getPageCount();
        const pagesToExtract = Math.min(pageCount, 2);
        const copiedPages = await sampleDoc.copyPages(
          originalDoc,
          Array.from({ length: pagesToExtract }, (_, index) => index)
        );

        copiedPages.forEach((page) => sampleDoc.addPage(page));

        const samplePdfBytes = await sampleDoc.save();
        const samplePathname = `sheet-music/previews/sample-${filename}`;
        const sampleBuffer = Buffer.from(samplePdfBytes);

        const [mainBlob, sampleBlob] = await Promise.all([
          put(pathname, file, { access, token }),
          put(samplePathname, sampleBuffer, {
            access,
            token,
            contentType: "application/pdf",
          }),
        ]);

        return NextResponse.json({
          success: true,
          url: mainBlob.url,
          pathname: mainBlob.pathname,
          previewUrl: sampleBlob.url,
        });

      } catch (pdfError: any) {
        console.error("PDF processing failed:", pdfError);

        // Check if the error is specifically due to encryption/restrictions
        if (pdfError?.message?.includes("encrypted")) {
          return NextResponse.json(
            { 
              error: "This PDF is encrypted or has copy/print restrictions enabled. Please remove these restrictions so a 2-page sample preview can be generated."
            },
            { status: 400 }
          );
        }

        // Generic fallback if PDF reading fails for another reason (e.g., file corruption)
        return NextResponse.json(
          { error: "Could not read the PDF file. The file may be corrupted." },
          { status: 400 }
        );
      }
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