import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/currentUser';

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role.name !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const searchParams = req.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where: any = {};

    if (startDate) {
      where.createdAt = { gte: new Date(startDate) };
    }
    if (endDate) {
      if (where.createdAt) {
        where.createdAt.lte = new Date(endDate);
      } else {
        where.createdAt = { lte: new Date(endDate) };
      }
    }

    const royalties = await prisma.royalty.findMany({
      where,
      include: {
        purchase: {
          include: {
            sheetMusic: {
              select: { artistId: true }
            }
          }
        }
      }
    });

    const contracts = await prisma.contract.findMany();

    const totalArtistAmount = royalties.reduce((sum, r) => sum + r.artistAmount, 0);
    const totalPlatformAmount = royalties.reduce((sum, r) => sum + r.platformAmount, 0);
    const totalRevenue = totalArtistAmount + totalPlatformAmount;

    const earningsByPublisher: Record<string, { name: string; amount: number }> = {};

    royalties.forEach(royalty => {
      const publisherId = royalty.purchase.sheetMusic.artistId;
      if (!earningsByPublisher[publisherId]) {
        earningsByPublisher[publisherId] = { name: publisherId, amount: 0 };
      }
      earningsByPublisher[publisherId].amount += royalty.artistAmount;
    });

    return NextResponse.json({
      summary: {
        totalRevenue: totalRevenue / 100,
        totalArtistPayouts: totalArtistAmount / 100,
        totalPlatformRevenue: totalPlatformAmount / 100,
        royaltyPercentage: 75,
        platformPercentage: 25,
        totalTransactions: royalties.length,
        activeContracts: contracts.filter(c => !c.endDate || c.endDate > new Date()).length
      },
      earningsByPublisher: Object.entries(earningsByPublisher).map(([id, data]) => ({
        publisherId: id,
        totalEarnings: data.amount / 100
      }))
    });
  } catch (error) {
    console.error('Error fetching royalty summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch royalty summary' },
      { status: 500 }
    );
  }
}
