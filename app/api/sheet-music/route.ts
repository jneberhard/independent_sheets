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

    const categoryIds = Array.isArray(body.categoryIds)
      ? body.categoryIds.filter((categoryId: unknown) => {
          return typeof categoryId === "string" && categoryId.length > 0;
        })
      : [];

    if (categoryIds.length === 0) {
      return NextResponse.json(
        { error: "At least one category is required" },
        { status: 400 }
      );
    }

    const sheetMusic = await prisma.sheetMusic.create({
      data: {
        title: body.title,
        description: body.description || null,
        priceCents: Number(body.priceCents),
        pdfUrl: body.pdfUrl,
        imageUrl: body.imageUrl || null,
        previewMp3Url: body.previewMp3Url || null,
        previewLink: body.previewLink || null,
        artistId: user.id,
        categories: {
          create: categoryIds.map((categoryId: string) => ({
            categoryId,
          })),
        },
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
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
