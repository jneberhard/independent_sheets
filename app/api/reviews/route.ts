import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { sheetMusicId, reviewText, rating: rawRating } = body;

    if (!sheetMusicId || typeof sheetMusicId !== "string") {
      return NextResponse.json({ error: "Missing sheet music ID" }, { status: 400 });
    }

    if (typeof reviewText !== "string" || reviewText.trim().length < 5) {
      return NextResponse.json({ error: "Review must be at least 5 characters long" }, { status: 400 });
    }

    const rating = Number(rawRating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const newReview = await prisma.reviews.create({
      data: {
        reviewText,
        rating,
        userId: user.id,
        sheetMusicId,
      },
    });

    return NextResponse.json(newReview);
  } catch (error) {
    console.error("Create review failed:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}