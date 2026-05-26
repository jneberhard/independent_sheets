import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";

type SheetMusicRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

//code to update route for editing sheet music

export async function PATCH(
  request: Request,
  { params }: SheetMusicRouteProps
) {
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
        { error: "Only publishers can update sheet music" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const existingSheetMusic = await prisma.sheetMusic.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        artistId: true,
      },
    });

    if (!existingSheetMusic) {
      return NextResponse.json(
        { error: "Sheet music not found" },
        { status: 404 }
      );
    }

    if (
      user.role.name !== "ADMIN" &&
      existingSheetMusic.artistId !== user.id
    ) {
      return NextResponse.json(
        { error: "You do not have permission to update this sheet music" },
        { status: 403 }
      );
    }

    const categoryIds = Array.isArray(body.categoryIds)
      ? body.categoryIds.filter((categoryId: unknown) => {
          return typeof categoryId === "string" && categoryId.length > 0;
        })
      : [];

    const updatedSheetMusic = await prisma.$transaction(async (tx) => {
      await tx.sheetMusicCategory.deleteMany({
        where: {
          sheetMusicId: id,
        },
      });

      if (categoryIds.length > 0) {
        await tx.sheetMusicCategory.createMany({
          data: categoryIds.map((categoryId: string) => ({
            sheetMusicId: id,
            categoryId,
          })),
          skipDuplicates: true,
        });
      }

      return tx.sheetMusic.update({
        where: {
          id,
        },
        data: {
          title: body.title,
          description: body.description || null,
          priceCents: Number(body.priceCents),
          imageUrl: body.imageUrl || null,
        },
        include: {
          categories: {
            include: {
              category: true,
            },
          },
        },
      });
    });

    return NextResponse.json(updatedSheetMusic);
  } catch (error) {
    console.error("Update sheet music failed:", error);

    return NextResponse.json(
      { error: "Failed to update sheet music" },
      { status: 500 }
    );
  }
}