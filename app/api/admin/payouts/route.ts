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
    const status = searchParams.get('status');
    const publisherId = searchParams.get('publisherId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '50');

    const where: any = {};
    if (publisherId) {
      where.purchase = { sheetMusic: { artistId: publisherId } };
    }
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
              select: {
                artistId: true,
                artist: {
                  select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                    publisher: {
                      select: {
                        paypalEmail: true,
                        preferredPaymentMethod: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    // Group by publisher and aggregate pending/paid status
    const payoutMap = new Map<string, any>();

    royalties.forEach(royalty => {
      const publisherId = royalty.purchase.sheetMusic.artistId;
      const artist = royalty.purchase.sheetMusic.artist;
      const key = `${publisherId}`;

      if (!payoutMap.has(key)) {
        payoutMap.set(key, {
          publisherId,
          publisherName: `${artist.firstName || ''} ${artist.lastName || ''}`.trim(),
          publisherEmail: artist.email,
          paypalEmail: artist.publisher?.paypalEmail,
          preferredPaymentMethod: artist.publisher?.preferredPaymentMethod,
          totalAmount: 0,
          transactionCount: 0,
          status: status || 'pending'
        });
      }

      const payout = payoutMap.get(key)!;
      payout.totalAmount += royalty.artistAmount;
      payout.transactionCount += 1;
    });

    const payouts = Array.from(payoutMap.values())
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice((page - 1) * pageSize, page * pageSize);

    const formattedPayouts = payouts.map(payout => ({
      ...payout,
      totalAmount: payout.totalAmount / 100
    }));

    return NextResponse.json({
      data: formattedPayouts,
      pagination: {
        page,
        pageSize,
        total: payoutMap.size,
        pages: Math.ceil(payoutMap.size / pageSize)
      }
    });
  } catch (error) {
    console.error('Error fetching payouts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payouts' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role.name !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { publisherId, status } = body;

    if (!publisherId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['pending', 'paid', 'failed'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      publisherId,
      status,
      message: 'Payout status updated successfully'
    });
  } catch (error) {
    console.error('Error updating payout:', error);
    return NextResponse.json(
      { error: 'Failed to update payout' },
      { status: 500 }
    );
  }
}
