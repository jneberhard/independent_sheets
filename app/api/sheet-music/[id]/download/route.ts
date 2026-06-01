import { get } from "@vercel/blob";
import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sheetMusic = await prisma.sheetMusic.findUnique({
      where: { id },
      include: {
        purchases: {
          where: {
            buyerId: user.id,
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (!sheetMusic) {
      return NextResponse.json({ error: "Sheet music not found" }, { status: 404 });
    }

    const canDownload =
      sheetMusic.artistId === user.id || sheetMusic.purchases.length > 0;

    if (!canDownload) {
      return NextResponse.json(
        { error: "You need to purchase this sheet music first" },
        { status: 403 }
      );
    }

    if (sheetMusic.pdfUrl.includes(".blob.vercel-storage.com")) {
      const blob = await get(sheetMusic.pdfUrl, {
        access: "private",
      });

      if (!blob) {
        return NextResponse.json(
          { error: "Download file not found" },
          { status: 404 }
        );
      }

      return NextResponse.redirect(blob.blob.downloadUrl);
    }

    return NextResponse.redirect(sheetMusic.pdfUrl);
  } catch (error) {
    console.error("Download failed:", error);

    return NextResponse.json(
      { error: "Download failed" },
      { status: 500 }
    );
  }
}
