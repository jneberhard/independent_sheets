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
    const publisherId = searchParams.get('publisherId');
    const sheetMusicId = searchParams.get('sheetMusicId');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '50');

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
    if (publisherId) {
      where.purchase = { sheetMusic: { artistId: publisherId } };
    }
    if (sheetMusicId) {
      where.purchase = { sheetMusicId };
    }

    const royalties = await prisma.royalty.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        purchase: {
          include: {
            buyer: {
              select: { id: true, firstName: true, lastName: true, email: true }
            },
            sheetMusic: {
              select: {
                id: true,
                title: true,
                artistId: true,
                artist: {
                  select: { id: true, firstName: true, lastName: true, email: true }
                }
              }
            }
          }
        }
      }
    });

    const total = await prisma.royalty.count({ where });

    const formattedRoyalties = royalties.map(royalty => ({
      id: royalty.id,
      purchaseId: royalty.purchase.id,
      sheetMusicTitle: royalty.purchase.sheetMusic.title,
      publisherName: `${royalty.purchase.sheetMusic.artist.firstName || ''} ${royalty.purchase.sheetMusic.artist.lastName || ''}`.trim(),
      publisherId: royalty.purchase.sheetMusic.artistId,
      buyerName: `${royalty.purchase.buyer.firstName || ''} ${royalty.purchase.buyer.lastName || ''}`.trim(),
      buyerEmail: royalty.purchase.buyer.email,
      totalAmount: royalty.purchase.amountCents / 100,
      artistAmount: royalty.artistAmount / 100,
      platformAmount: royalty.platformAmount / 100,
      createdAt: royalty.createdAt
    }));

    return NextResponse.json({
      data: formattedRoyalties,
      pagination: {
        page,
        pageSize,
        total,
        pages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    console.error('Error fetching royalties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch royalties' },
      { status: 500 }
    );
  }
}
