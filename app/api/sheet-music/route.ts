import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (user.role.name !== "PUBLISHER" && user.role.name !== "ADMIN") {
      return NextResponse.json(
        { error: "Only publishers can upload sheet music" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const sheetMusic = await prisma.sheetMusic.create({
      data: {
        title: body.title,
        description: body.description || null,
        priceCents: body.priceCents,
        pdfUrl: body.pdfUrl,
        imageUrl: body.imageUrl || null,
        previewMp3Url: body.previewMp3Url || null,
        previewLink: body.previewLink || null,
        artistId: user.id,
      },
    });

    return NextResponse.json(sheetMusic);
  } catch (error) {
    console.error("Create sheet music failed:", error);

    return NextResponse.json(
      { error: "Failed to create sheet music" },
      { status: 500 }
    );
  }
}