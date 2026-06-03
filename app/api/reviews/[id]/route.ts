import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";

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

    const { id: reviewId } = await params;

    const existingReview = await prisma.reviews.findUnique({
      where: { id: reviewId },
      select: { userId: true },
    });

    if (!existingReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    };

    const isAdmin = user.roleId === "role_admin";
    const isAuthor = user.id === existingReview.userId;

    if (!isAdmin && !isAuthor) {
      return NextResponse.json(
        { error: "Forbidden: Admins only" },
        { status: 403 }
      );
    }

    const deletedReview = await prisma.reviews.delete({
      where: {
        id: reviewId,
      },
    });

    return NextResponse.json({ 
      message: "Review successfully deleted", 
      deletedReview 
    });

  } catch (error) {
    console.error("Delete review failed:", error);

    return NextResponse.json(
      { error: "Failed to delete review. It may have already been removed." },
      { status: 500 }
    );
  }
}