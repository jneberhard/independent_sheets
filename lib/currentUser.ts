import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { Prisma, RoleName } from "@prisma/client";

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
      name: RoleName.USER,
    },
  });

  if (!userRole) {
    throw new Error(
      "No default user role found (USER). Run pnpm prisma db seed."
    );
  }

  try {
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
  } catch (error) {
    // If another request created the user first, fetch and return it.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
        include: {
          role: true,
          publisher: true,
        },
      });

      if (existingUser) {
        return existingUser;
      }
    }

    throw error;
  }

  return user;
}
