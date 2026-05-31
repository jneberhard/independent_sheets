import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getSheetMusicDetails = cache(async (id: string) => {
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
        }
        });

        return sheetMusic || null;

    } catch (error) {
        console.error(`Failed to fetch sheet music details: ${error}`);
        return null;
    }
});