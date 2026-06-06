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
    const publisherId = searchParams.get('publisherId');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '50');

    const where: any = {};
    if (publisherId) {
      where.artistId = publisherId;
    }

    const contracts = await prisma.contract.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { startDate: 'desc' },
      include: {
        artist: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            publisher: {
              select: { paypalEmail: true, preferredPaymentMethod: true }
            }
          }
        }
      }
    });

    const total = await prisma.contract.count({ where });

    const formattedContracts = contracts.map(contract => ({
      id: contract.id,
      publisherId: contract.artistId,
      publisherName: `${contract.artist.firstName || ''} ${contract.artist.lastName || ''}`.trim(),
      publisherEmail: contract.artist.email,
      royaltyPercent: contract.royaltyPercent,
      platformPercent: 100 - contract.royaltyPercent,
      startDate: contract.startDate,
      endDate: contract.endDate,
      isActive: !contract.endDate || contract.endDate > new Date(),
      paymentMethod: contract.artist.publisher?.preferredPaymentMethod,
      paypalEmail: contract.artist.publisher?.paypalEmail
    }));

    return NextResponse.json({
      data: formattedContracts,
      pagination: {
        page,
        pageSize,
        total,
        pages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    console.error('Error fetching contracts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contracts' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role.name !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { artistId, royaltyPercent, startDate, endDate } = body;

    if (!artistId || !royaltyPercent || !startDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (royaltyPercent < 0 || royaltyPercent > 100) {
      return NextResponse.json(
        { error: 'Royalty percent must be between 0 and 100' },
        { status: 400 }
      );
    }

    const contract = await prisma.contract.create({
      data: {
        artistId,
        royaltyPercent,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null
      },
      include: {
        artist: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      id: contract.id,
      publisherName: `${contract.artist.firstName || ''} ${contract.artist.lastName || ''}`.trim(),
      royaltyPercent: contract.royaltyPercent,
      startDate: contract.startDate,
      endDate: contract.endDate
    });
  } catch (error) {
    console.error('Error creating contract:', error);
    return NextResponse.json(
      { error: 'Failed to create contract' },
      { status: 500 }
    );
  }
}
