import { NextRequest, NextResponse } from "next/server";
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

    const dateFilter = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter.lte = end;
    }

    const purchases = await prisma.purchase.findMany({
      where: {
        ...(dateFilter && Object.keys(dateFilter).length > 0 && {
          purchasedAt: dateFilter,
        }),
        sheetMusic: {
          ...(user.role.name === "PUBLISHER" && {
            artistId: user.id,
          }),
          ...(songIds.length > 0 && {
            id: { in: songIds },
          }),
        },
      },
      include: {
        sheetMusic: {
          select: {
            id: true,
            title: true,
            artistId: true,
          },
        },
        buyer: {
          select: {
            email: true,
            name: true,
          },
        },
        royalty: true,
      },
    });

    // Fetch reviews for the songs
    const songIdSet = new Set(purchases.map((p) => p.sheetMusic.id));
    const reviews = await prisma.review.findMany({
      where: {
        sheetMusicId: {
          in: Array.from(songIdSet),
        },
      },
    });

    // Fetch downloads for the songs
    const downloads = await prisma.download.findMany({
      where: {
        sheetMusicId: {
          in: Array.from(songIdSet),
        },
      },
    });

    // Fetch customer activity for the songs
    const activities = await prisma.customerActivity.findMany({
      where: {
        sheetMusicId: {
          in: Array.from(songIdSet),
        },
      },
    });

    // Aggregate sales by song
    const salesByRoyalty = new Map();
    const detailedSales = [];

    for (const purchase of purchases) {
      const songKey = purchase.sheetMusic.id;

      if (!salesByRoyalty.has(songKey)) {
        const songReviews = reviews.filter((r) => r.sheetMusicId === songKey);
        const avgRating =
          songReviews.length > 0
            ? Math.round((songReviews.reduce((sum, r) => sum + r.rating, 0) / songReviews.length) * 10) / 10
            : 0;

        const songDownloads = downloads.filter((d) => d.sheetMusicId === songKey).length;
        const songActivities = activities.filter((a) => a.sheetMusicId === songKey);

        salesByRoyalty.set(songKey, {
          songId: purchase.sheetMusic.id,
          songTitle: purchase.sheetMusic.title,
          artistId: purchase.sheetMusic.artistId,
          salesCount: 0,
          totalRevenueCents: 0,
          royaltyAmountCents: 0,
          platformAmountCents: 0,
          downloadCount: songDownloads,
          reviewCount: songReviews.length,
          averageRating: avgRating,
          viewCount: songActivities.filter((a) => a.activityType === "view").length,
          wishlistCount: songActivities.filter((a) => a.activityType === "wishlist").length,
          purchases: [],
        });
      }

      const songData = salesByRoyalty.get(songKey);
      songData.salesCount += 1;
      songData.totalRevenueCents += purchase.amountCents;

      if (purchase.royalty) {
        songData.royaltyAmountCents += purchase.royalty.artistAmount;
        songData.platformAmountCents += purchase.royalty.platformAmount;
      }

      songData.purchases.push({
        purchaseId: purchase.id,
        buyerEmail: purchase.buyer.email,
        buyerName: purchase.buyer.name,
        amountCents: purchase.amountCents,
        purchasedAt: purchase.purchasedAt,
        royaltyAmountCents: purchase.royalty?.artistAmount || 0,
        platformAmountCents: purchase.royalty?.platformAmount || 0,
      });

      detailedSales.push({
        songId: purchase.sheetMusic.id,
        songTitle: purchase.sheetMusic.title,
        buyerEmail: purchase.buyer.email,
        buyerName: purchase.buyer.name,
        amountCents: purchase.amountCents,
        purchasedAt: purchase.purchasedAt,
        royaltyAmountCents: purchase.royalty?.artistAmount || 0,
        platformAmountCents: purchase.royalty?.platformAmount || 0,
      });
    }

    const aggregatedSales = Array.from(salesByRoyalty.values());

    const totalMetrics = {
      totalSales: purchases.length,
      totalRevenueCents: aggregatedSales.reduce((sum, s) => sum + s.totalRevenueCents, 0),
      totalRoyaltyCents: aggregatedSales.reduce((sum, s) => sum + s.royaltyAmountCents, 0),
      totalPlatformCents: aggregatedSales.reduce((sum, s) => sum + s.platformAmountCents, 0),
      totalDownloads: aggregatedSales.reduce((sum, s) => sum + s.downloadCount, 0),
      totalReviews: aggregatedSales.reduce((sum, s) => sum + s.reviewCount, 0),
      averageRating:
        aggregatedSales.length > 0
          ? Math.round(
              (aggregatedSales.reduce((sum, s) => sum + s.averageRating, 0) / aggregatedSales.length) * 10
            ) / 10
          : 0,
      totalViews: aggregatedSales.reduce((sum, s) => sum + s.viewCount, 0),
    };

    return NextResponse.json({
      aggregated: aggregatedSales,
      detailed: detailedSales,
      metrics: totalMetrics,
    });
  } catch (error) {
    console.error("Sales API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
