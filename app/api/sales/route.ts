import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { getCurrentUser } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || (user.role.name !== "PUBLISHER" && user.role.name !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const songIds = searchParams.getAll("songIds");

    // Keep the filter small and obvious so we can reuse it for the total report
    // and for focused checks on a specific song or time range.
    const purchaseFilter: Prisma.PurchaseWhereInput = {};

    if (startDate || endDate) {
      const purchasedAtFilter: Prisma.DateTimeFilter = {};

      if (startDate) {
        purchasedAtFilter.gte = new Date(startDate);
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        purchasedAtFilter.lte = end;
      }

      purchaseFilter.purchasedAt = purchasedAtFilter;
    }

    const sheetMusicWhere: Prisma.SheetMusicWhereInput = {
      ...(user.role.name === "PUBLISHER" ? { artistId: user.id } : {}),
      ...(songIds.length > 0 ? { id: { in: songIds } } : {}),
    };

    const songs = await prisma.sheetMusic.findMany({
      where: sheetMusicWhere,
      select: {
        id: true,
        title: true,
        purchases: {
          where: purchaseFilter,
          select: {
            id: true,
            amountCents: true,
            purchasedAt: true,
            buyer: {
              select: {
                email: true,
                name: true,
              },
            },
            royalty: {
              select: {
                artistAmount: true,
                platformAmount: true,
              },
            },
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        title: "asc",
      },
    });

    const aggregated = songs.map((song) => {
      const reviewCount = song.reviews.length;
      const averageRating =
        reviewCount > 0
          ? Math.round(
              (song.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount) * 10
            ) / 10
          : 0;

      const purchases = song.purchases.map((purchase) => ({
        purchaseId: purchase.id,
        buyerEmail: purchase.buyer.email,
        buyerName: purchase.buyer.name,
        amountCents: purchase.amountCents,
        purchasedAt: purchase.purchasedAt.toISOString(),
        royaltyAmountCents: purchase.royalty?.artistAmount ?? 0,
        platformAmountCents: purchase.royalty?.platformAmount ?? 0,
      }));

      return {
        songId: song.id,
        songTitle: song.title,
        salesCount: purchases.length,
        totalRevenueCents: purchases.reduce((sum, purchase) => sum + purchase.amountCents, 0),
        royaltyAmountCents: purchases.reduce((sum, purchase) => sum + purchase.royaltyAmountCents, 0),
        platformAmountCents: purchases.reduce((sum, purchase) => sum + purchase.platformAmountCents, 0),
        reviewCount,
        averageRating,
        purchases,
      };
    });

    const metrics = {
      totalSales: aggregated.reduce((sum, song) => sum + song.salesCount, 0),
      totalRevenueCents: aggregated.reduce((sum, song) => sum + song.totalRevenueCents, 0),
      totalRoyaltyCents: aggregated.reduce((sum, song) => sum + song.royaltyAmountCents, 0),
      totalPlatformCents: aggregated.reduce((sum, song) => sum + song.platformAmountCents, 0),
      totalReviews: aggregated.reduce((sum, song) => sum + song.reviewCount, 0),
      averageRating:
        aggregated.length > 0
          ? Math.round(
              (aggregated.reduce((sum, song) => sum + song.averageRating, 0) / aggregated.length) * 10
            ) / 10
          : 0,
    };

    return NextResponse.json({
      aggregated,
      metrics,
    });
  } catch (error) {
    console.error("Sales API error:", error);

    return NextResponse.json({ error: "Failed to load sales data" }, { status: 500 });
  }
}
