import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const publisherRole = await prisma.role.findUnique({
      where: {
        name: "PUBLISHER",
      },
    });

    if (!publisherRole) {
      return NextResponse.json(
        { error: "PUBLISHER role not found" },
        { status: 500 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: `${body.firstName} ${body.lastName}`,
        roleId: publisherRole.id,
        publisher: {
          create: {
            firstName: body.firstName,
            lastName: body.lastName,
            displayName: body.displayName,
            addressLine1: body.addressLine1,
            addressLine2: body.addressLine2 || null,
            city: body.city,
            stateProvince: body.stateProvince,
            postalCode: body.postalCode,
            country: body.country,
            phoneNumber: body.phoneNumber || null,
            biography: body.biography || null,
            websiteUrl: body.websiteUrl || null,
            youtubeUrl: body.youtubeUrl || null,
            spotifyUrl: body.spotifyUrl || null,
            primaryCategories: body.primaryCategories || null,
            primaryVoicings: body.primaryVoicings || null,
            uploadingOriginalWorks: body.uploadingOriginalWorks,
            uploadingArrangements: body.uploadingArrangements,
            ownsOrControlsRights: body.ownsOrControlsRights,
            acceptedAgreement: body.acceptedAgreement,
            paypalEmail: body.paypalEmail || null,
            preferredPaymentMethod: body.preferredPaymentMethod || null,
          },
        },
      },
      include: {
        publisher: true,
        role: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create publisher" },
      { status: 500 }
    );
  }
}