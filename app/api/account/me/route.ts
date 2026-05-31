import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/server";
import type { User } from "@prisma/client";

type AuthSession = {
  data: {
    user: {
      id: string;
      email: string;
      name: string | null;
    };
    session: {
      id: string;
      token: string;
      provider: string
      expiresAt: string;
      createdAt: string;
      updatedAt: string;
      ipAddress: string;
      userAgent: string;
      userId: string;
      impersonatedBy: string | null;
      activeOrganizationId: string | null;
    };
  } | null;
  error: unknown;
};

// Utility: ensure user exists in Prisma
async function ensureUser(session: AuthSession): Promise<User> {
  if (!session?.data?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.data.user.id;
  const email = session.data.user.email;
  const displayName = session.data.user.name;

  let user: User | null = null;

  // 1. Try by ID
  user = await prisma.user.findUnique({ where: { id: userId } });
  if (user) return user;

  // 2. Try by email
  const existingByEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (existingByEmail) {
    return prisma.user.update({
      where: { email },
      data: { id: userId },
    });
  }

  // 3. Create new user with default role
  const userRole = await prisma.role.findUnique({
    where: { name: "USER" },
  });

  if (!userRole) {
    throw new Error("USER role missing in database");
  }

  //Detect provider from Neon Auth session
  const provider = session.data.session.provider ?? "credentials";

  return prisma.user.create({
    data: {
      id: userId,
      email,
      name: displayName,
      roleId: userRole.id,
      authProvider: provider,
    },
  });
}

// ---------------- GET ----------------
export async function GET() {
  const session = (await auth.getSession()) as AuthSession;

  if (!session?.data?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await ensureUser(session);

  const result = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      name: true,
      email: true,
      addressLine1: true,
      addressLine2: true,
      city: true,
      stateProvince: true,
      postalCode: true,
      country: true,
      phoneNumber: true,
    },
  });

  return NextResponse.json(result);
}

// ---------------- PUT ----------------
export async function PUT(req: Request) {
  const session = (await auth.getSession()) as AuthSession;

  if (!session?.data?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await ensureUser(session);
  const body = await req.json();

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      name: body.name,
      addressLine1: body.addressLine1,
      addressLine2: body.addressLine2,
      city: body.city,
      stateProvince: body.stateProvince,
      postalCode: body.postalCode,
      country: body.country,
      phoneNumber: body.phoneNumber,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      name: true,
      email: true,
      addressLine1: true,
      addressLine2: true,
      city: true,
      stateProvince: true,
      postalCode: true,
      country: true,
      phoneNumber: true,
    },
  });

  return NextResponse.json(updated);
}
