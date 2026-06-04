import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/currentUser';

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    const purchase = await prisma.purchase.findUnique({
      where: {
        id: id,
        buyerId: currentUser.id
      },
      include: {
        sheetMusic: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
          },
        },
      },
    });

    if (!purchase) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const formattedPurchase = {
      id: purchase.id,
      total: purchase.amountCents / 100,
      purchasedAt: purchase.purchasedAt,
      sheetMusic: purchase.sheetMusic,
    };

    return NextResponse.json(formattedPurchase);
  } catch (error) {
    console.error('Error fetching specific purchase record:', error);
    return NextResponse.json(
      { error: 'Internal server error fetching order' },
      { status: 500 }
    );
  }
}