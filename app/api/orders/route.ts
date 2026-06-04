import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth/server';
import { getCurrentUser } from "@/lib/currentUser";

/**
 * GET: Fetch all digital purchases for the logged-in buyer profile context
 */
export async function GET() {
  try {
    const { data: session } = await auth.getSession();

    // Check auth status based on server-session architecture
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const purchases = await prisma.purchase.findMany({
      where: { buyerId: session.user.id },
      orderBy: { purchasedAt: 'desc' },
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

    // Format output payload structures cleanly for display components
    const formattedPurchases = purchases.map((purchase) => ({
      id: purchase.id,
      total: purchase.amountCents / 100, // Converts cents back to dollars for the frontend layout
      purchasedAt: purchase.purchasedAt,
      sheetMusic: purchase.sheetMusic,
    }));

    return NextResponse.json(formattedPurchases);
  } catch (error) {
    console.error('Error fetching system digital purchases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction purchase records' },
      { status: 500 }
    );
  }
}

/**
 * POST: Finalize digital authorization checkout transaction pipelines
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, customer } = body;

    // 2. Swap this block to look EXACTLY like your profile route
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

    // 2. Fetch target user via the guaranteed server-verified id string
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

    const result = await prisma.$transaction(async (tx) => {

      if (Object.keys(profileUpdates).length > 0) {
        await tx.user.update({
          where: { id: targetUserId },
          data: profileUpdates
        });
      }

      const completedPurchases = [];

      for (const item of items) {
        const pieceOfMusic = await tx.sheetMusic.findUnique({
          where: { id: item.id },
          select: { priceCents: true, title: true, artistId: true }
        });

        if (!pieceOfMusic) {
          throw new Error(`CRITICAL_MISSING_PIECE:${item.id}`);
        }

        const singlePurchase = await tx.purchase.create({
          data: {
            buyerId: targetUserId, // Guarantees this points to an existing database user
            sheetMusicId: item.id,
            amountCents: pieceOfMusic.priceCents * (item.quantity || 1),
          }
        });

        completedPurchases.push(singlePurchase);
      }

      return completedPurchases[0];
    });

    return NextResponse.json({
      success: true,
      orderId: result.id
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