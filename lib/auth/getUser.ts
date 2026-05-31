import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

export async function getUser() {
  const session = await auth.getSession();

  const userId = session?.data?.user?.id;

  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      role: true,
    },
  });

  return user;
}