import { Prisma } from "@prisma/client";

export type SheetMusicWithCategories = Prisma.SheetMusicGetPayload<{
  include: {
    categories: {
      include: {
        category: true;
      };
    };
  };
}>;

export async function getSheetMusicDetails(id: string): Promise<SheetMusicWithCategories | null> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
    const res = await fetch(`${baseUrl}/api/sheet-music/${id}`);

    if (!res.ok) {
        if (res.status == 404) return null;
        throw new Error(`Failed to fetch sheet music details: ${res.statusText}`);
    }

    return res.json();
}