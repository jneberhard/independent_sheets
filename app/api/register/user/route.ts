import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { email, name } = body;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const userRole = await prisma.role.findUnique({
      where: {
        name: "USER",
      },
    });

    if (!userRole) {
      return NextResponse.json(
        { error: "USER role not found" },
        { status: 500 }
      );
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
        roleId: userRole.id,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}