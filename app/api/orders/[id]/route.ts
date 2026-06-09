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

    const { id: orderId } = await context.params;

    console.log("🔍 API Route hit! Target Order ID:", orderId);
    console.log("👤 Authenticated User ID:", currentUser.id);

    // Fetch the parent order record along with all nested purchase items and music details
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        buyerId: currentUser.id
      },
      include: {
        purchases: {
          include: {
            sheetMusic: {
              select: {
                id: true,
                title: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      console.error(`❌ DB Lookup returned nothing for Order ID: ${orderId} and User ID: ${currentUser.id}`);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    type PurchaseWithSheetMusic = {
      id: string;
      quantity: number;
      amountCents: number;
      sheetMusic: {
        id: string;
        title: string;
        imageUrl: string | null;
      };
    };
    // Format the clean relational data into the structure your frontend expects
    const formattedOrderDetails = {
      id: order.id,
      total: order.totalCents / 100,
      purchasedAt: order.createdAt,
      userId: order.buyerId,
      items: (order.purchases as PurchaseWithSheetMusic[]).map((purchase: PurchaseWithSheetMusic) => ({
        id: purchase.id,
        quantity: purchase.quantity,
        priceAtPurchase: (purchase.amountCents / 100) / purchase.quantity,
        sheetMusic: purchase.sheetMusic,
      })),
    };

    return NextResponse.json(formattedOrderDetails);
  } catch (error) {
    console.error('Error fetching specific purchase order:', error);
    return NextResponse.json(
      { error: 'Internal server error fetching order' },
      { status: 500 }
    );
  }
}