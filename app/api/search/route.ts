import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET handler to search for sheet music by title based on a query parameter
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({
      sheetMusic: [],
    });
  }

  const sheetMusic = await prisma.sheetMusic.findMany({
    where: {
      title: {
        contains: query,
        mode: "insensitive",
      },
    },
    take: 10,
    orderBy: {
      title: "asc",
    },
    select: {
      id: true,
      title: true,
    },
  });

  return NextResponse.json({
    sheetMusic,
  });
}