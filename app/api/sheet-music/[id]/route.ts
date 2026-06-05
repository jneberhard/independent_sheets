import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";
import { del } from "@vercel/blob";

type SheetMusicRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
{ params }: SheetMusicRouteProps
) {
  try {
    const { id } = await params;

    const sheetMusic = await prisma.sheetMusic.findUnique({
      where: {
        id,
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      }
    });

    if (!sheetMusic) {
      return NextResponse.json(
        { error: "Sheet music not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(sheetMusic);

  } catch (error) {
    console.error("Error getting sheet music details: " + error);
  }
}

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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (user.roleId !== "role_admin") {
      return NextResponse.json(
        { error: "Forbidden: Admins only"},
        { status: 403 }
      );
    }

    const { id } = await params;

    const sheetMusic = await prisma.sheetMusic.findUnique({
      where: { id },
      select: {
        id: true,
        imageUrl: true,
        pdfUrl: true,
        previewMp3Url: true,
      },
    });

    if (!sheetMusic) {
      return NextResponse.json(
        { error: "Sheet music not found" },
        { status: 404 }
      );
    }

    const urlsToDelete: string[] = [];
    if (sheetMusic.imageUrl) urlsToDelete.push(sheetMusic.imageUrl);
    if (sheetMusic.pdfUrl) urlsToDelete.push(sheetMusic.pdfUrl);
    if (sheetMusic.previewMp3Url) urlsToDelete.push(sheetMusic.previewMp3Url);

    if (urlsToDelete.length > 0) {
      try {
        await del(urlsToDelete, {
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        console.log("Successfully wiped assets from blob storage");
      } catch (blobError) {
        console.error("Failed to delete assets from blob storage:", blobError);
      }
    }

    const deletedSong = await prisma.$transaction(async (tx) => {
      await tx.sheetMusicCategory.deleteMany({
        where: {
          sheetMusicId: id,
        },
      });

      await tx.reviews.deleteMany({
        where: {
          sheetMusicId: id,
        },
      });

      return tx.sheetMusic.delete({
        where: {
          id,
        },
      });
    });

    return NextResponse.json({
      message: "Song and associated files successfully deleted",
      deletedSong
    });

  } catch (error) {
    console.error(`Failed to delete song: ${error}`);

    return NextResponse.json(
      { error: "Failed to delete song." },
      { status: 500 }
    );
  }
}