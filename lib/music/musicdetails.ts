import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getSheetMusicDetails = cache(async (id: string, userId?: string) => {
  try {
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
        reviews: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                name: true,
              },
            },
          },
        },
        // If userId exists, check if they purchased it to unlock downloads
        purchases: userId
          ? {
              where: {
                buyerId: userId,
              },
              select: {
                id: true,
              },
            }
          : false,
      },
    });

    if (!sheetMusic) {
      return null;
    }

    // A user can download if they are the original publisher/artist OR if they have purchased it
    const canDownload = userId
      ? sheetMusic.artistId === userId || (Array.isArray(sheetMusic.purchases) && sheetMusic.purchases.length > 0)
      : false;

    return {
      ...sheetMusic,
      canDownload,
    };
  } catch (error) {
    console.error(`Failed to fetch sheet music details: ${error}`);
    return null;
  }
});