import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth/server';

// GET handler to retrieve details of a specific purchase order for the authenticated user
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data: session } = await auth.getSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized credentials context.' }, { status: 401 });
    }

    const purchase = await prisma.purchase.findUnique({
      where: { id: id },
      include: {
        sheetMusic: {
          select: {
            id: true,
            title: true,
            description: true,
            priceCents: true,
            pdfUrl: true,
            imageUrl: true,
            artist: {
              select: {
                firstName: true,
                lastName: true,
              }
            }
          }
        }
      }
    });

    if (!purchase) {
      return NextResponse.json({ error: 'Asset generation record not found' }, { status: 404 });
    }

    if (purchase.buyerId !== session.user.id) {
      return NextResponse.json({ error: 'Access to digital token prohibited.' }, { status: 403 });
    }

    // Define the expected structure of the purchase with nested sheet music details
    const formattedResponse = {
      purchaseId: purchase.id,
      purchasedAt: purchase.purchasedAt,
      amountPaid: purchase.amountCents / 100,
      item: {
        id: purchase.sheetMusic.id,
        title: purchase.sheetMusic.title,
        description: purchase.sheetMusic.description,
        pdfUrl: purchase.sheetMusic.pdfUrl,
        imageUrl: purchase.sheetMusic.imageUrl,
        artistName: `${purchase.sheetMusic.artist.firstName || ''} ${purchase.sheetMusic.artist.lastName || ''}`.trim(),
      }
    };

    return NextResponse.json(formattedResponse);
  } catch (error: unknown) {
    console.error('Critical breakdown loading unique dynamic purchase identifier:', error);
    return NextResponse.json({ error: 'Failed to fetch customer invoice authorization parameters.' }, { status: 500 });
  }
}