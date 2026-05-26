import { prisma } from "@/lib/prisma";
import { Prisma, RoleName } from "@prisma/client";
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
        name: RoleName.USER,
      },
    });

    if (!userRole) {
      return NextResponse.json(
        { error: "No default user role found (USER)" },
        { status: 500 }
      );
    }

    let user;
    try {
      user = await prisma.user.create({
        data: {
          email,
          name,
          roleId: userRole.id,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return NextResponse.json(
          { error: "User already exists" },
          { status: 400 }
        );
      }
      throw error;
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
