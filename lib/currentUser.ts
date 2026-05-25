import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  const { data: session } = await auth.getSession();

  if (!session?.user?.email) {
    return null;
  }

  let user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      role: true,
      publisher: true,
    },
  });

  if (user) {
    return user;
  }

  const userRole = await prisma.role.findUnique({
    where: {
      name: "USER",
    },
  });

  if (!userRole) {
    throw new Error("USER role not found. Run pnpm prisma db seed.");
  }

  user = await prisma.user.create({
    data: {
      email: session.user.email,
      name: session.user.name ?? session.user.email,
      roleId: userRole.id,
    },
    include: {
      role: true,
      publisher: true,
    },
  });

  return user;
}