import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/currentUser';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role.name !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { royaltyPercent, endDate } = body;

    if (royaltyPercent !== undefined && (royaltyPercent < 0 || royaltyPercent > 100)) {
      return NextResponse.json(
        { error: 'Royalty percent must be between 0 and 100' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (royaltyPercent !== undefined) {
      updateData.royaltyPercent = royaltyPercent;
    }
    if (endDate !== undefined) {
      updateData.endDate = endDate ? new Date(endDate) : null;
    }

    const contract = await prisma.contract.update({
      where: { id },
      data: updateData,
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
      endDate: contract.endDate,
      isActive: !contract.endDate || contract.endDate > new Date()
    });
  } catch (error) {
    console.error('Error updating contract:', error);
    if ((error as any)?.code === 'P2025') {
      return NextResponse.json(
        { error: 'Contract not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update contract' },
      { status: 500 }
    );
  }
}
