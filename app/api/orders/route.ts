import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from "@/lib/currentUser";

// GET: Fetch all digital purchases for the logged-in buyer profile context
export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    // Check auth status based on server-session architecture
    if (!currentUser?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch orders instead of individual purchases to keep things grouped
    const orders = await prisma.order.findMany({
      where: { buyerId: currentUser.id },
      orderBy: { createdAt: 'desc' },
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

    // Format output payload structures cleanly for the PurchaseHistory table component
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      total: order.totalCents / 100,
      purchasedAt: order.createdAt,
      itemCount: order.purchases.reduce((sum, p) => sum + p.quantity, 0),
      items: order.purchases.map((p) => ({
        id: p.id,
        title: p.sheetMusic?.title || 'Digital Sheet Music',
        imageUrl: p.sheetMusic?.imageUrl,
        quantity: p.quantity,
      }))
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error('Error fetching system digital orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction order records' },
      { status: 500 }
    );
  }
}

//POST: Finalize digital authorization checkout transaction pipelines
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, customer } = body;

    const currentUser = await getCurrentUser();
    const targetUserId = currentUser?.id || customer?.userId;

    if (!targetUserId) {
      return NextResponse.json(
        { success: false, error: 'Authentication missing or user context expired.' },
        { status: 401 }
      );
    }

    const {
      firstName,
      lastName,
      phoneNumber,
      addressLine1,
      addressLine2,
      city,
      stateProvince,
      postalCode
    } = customer;

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Authorization cart collection is empty' }, { status: 400 });
    }

    // Fetch existing user profile data to determine if any updates are needed based on the incoming transaction context
    const existingUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        firstName: true,
        lastName: true,
        phoneNumber: true,
        addressLine1: true,
        addressLine2: true,
        city: true,
        stateProvince: true,
        postalCode: true,
      }
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'Logged-in profile record could not be confirmed in database.' },
        { status: 404 }
      );
    }

    const profileUpdates: Record<string, string> = {};

    if (!existingUser.firstName && firstName) profileUpdates.firstName = firstName;
    if (!existingUser.lastName && lastName) profileUpdates.lastName = lastName;
    if (!existingUser.phoneNumber && phoneNumber) profileUpdates.phoneNumber = phoneNumber;
    if (!existingUser.addressLine1 && addressLine1) profileUpdates.addressLine1 = addressLine1;
    if (!existingUser.addressLine2 && addressLine2) profileUpdates.addressLine2 = addressLine2;
    if (!existingUser.city && city) profileUpdates.city = city;
    if (!existingUser.stateProvince && stateProvince) profileUpdates.stateProvince = stateProvince;
    if (!existingUser.postalCode && postalCode) profileUpdates.postalCode = postalCode;

    //  UPDATED TRANSACTION PIPELINE
    const parentOrder = await prisma.$transaction(async (tx) => {
      // Handle background profile context updates first
      if (Object.keys(profileUpdates).length > 0) {
        await tx.user.update({
          where: { id: targetUserId },
          data: profileUpdates
        });
      }

      let grandTotalCents = 0;
      const orderItemsToCreate = [];

      // Validate items array pricing snapshots from DB
      for (const item of items) {
        const pieceOfMusic = await tx.sheetMusic.findUnique({
          where: { id: item.id },
          select: { priceCents: true }
        });

        if (!pieceOfMusic) {
          throw new Error(`CRITICAL_MISSING_PIECE:${item.id}`);
        }

        const itemQty = item.quantity || 1;
        const totalItemCostCents = pieceOfMusic.priceCents * itemQty;
        grandTotalCents += totalItemCostCents;

        orderItemsToCreate.push({
          buyerId: targetUserId,
          sheetMusicId: item.id,
          amountCents: totalItemCostCents,
          quantity: itemQty
        });
      }

      // Create the single Parent Order record, nesting the generated line purchases inside it
      const createdOrder = await tx.order.create({
        data: {
          buyerId: targetUserId,
          totalCents: grandTotalCents,
          purchases: {
            create: orderItemsToCreate
          }
        }
      });

      return createdOrder;
    });

    // Safely hand back the actual Master parent invoice Order record ID to the client application execution context
    return NextResponse.json({
      success: true,
      orderId: parentOrder.id
    });

  } catch (err: unknown) {
    console.error('Critical transactional breakdown inside order routing routine:', err);

    if (err instanceof Error) {
      if (err.message.startsWith('CRITICAL_MISSING_PIECE')) {
        return NextResponse.json(
          { success: false, error: 'One or more files have been removed from platform catalogs.' },
          { status: 404 }
        );
      }
    }

    const errorDetails = err as { code?: string };
    if (errorDetails?.code === 'P2003') {
      return NextResponse.json(
        { success: false, error: 'Foreign key constraint violation. One or more items or user references are invalid.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal error processing the order' },
      { status: 500 }
    );
  }
}