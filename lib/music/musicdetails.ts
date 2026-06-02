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

    const canDownload = userId
      ? sheetMusic.artistId === userId || sheetMusic.purchases.length > 0
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
