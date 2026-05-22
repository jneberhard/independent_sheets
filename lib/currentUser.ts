import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  const { data: session } = await auth.getSession();

  if (!session?.user?.email) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      role: true,
      publisher: true,
    },
  });
}