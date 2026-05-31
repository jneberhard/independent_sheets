import { prisma } from "@/lib/prisma";

export async function ensureUser(session: unknown) {
  const s = session as {
    data?: {
      user?: {
        id: string;
        email: string;
        name: string | null;
      };
      session?: {
        provider?: string;
      };
    };
  };

  if (!s?.data?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = s.data.user.id;
  const email = s.data.user.email;
  const displayName = s.data.user.name;

  // provider may be missing depending on auth method
  const provider =
    typeof s.data.session?.provider === "string"
      ? s.data.session.provider
      : "credentials";

  // 1. Try by ID
  const userById = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      authProvider: true,
      passwordHash: true,
      roleId: true,
    },
  });
  if (userById) return userById;

  // 2. Try by email
  const existingByEmail = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      authProvider: true,
      passwordHash: true,
      roleId: true,
    },
  });

  if (existingByEmail) {
    return prisma.user.update({
      where: { email },
      data: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        authProvider: true,
        passwordHash: true,
        roleId: true,
      },
    });
  }

  // 3. Create new user
  const userRole = await prisma.role.findUnique({
    where: { name: "USER" },
  });

  if (!userRole) throw new Error("USER role missing");

  return prisma.user.create({
    data: {
      id: userId,
      email,
      name: displayName,
      roleId: userRole.id,
      authProvider: provider,
    },
    select: {
      id: true,
      email: true,
      name: true,
      authProvider: true,
      passwordHash: true,
      roleId: true,
    },
  });
}
