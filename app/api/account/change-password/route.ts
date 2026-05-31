import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/server";
import { ensureUser } from "@/lib/auth/ensureUser";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const session = await auth.getSession();

    if (!session?.data?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ensureUser guarantees the user exists in Prisma and returns the DB row
    const dbUser = await ensureUser(session);

    // Block Google users
    if (dbUser.authProvider !== "credentials") {
      return NextResponse.json(
        {
          error:
            "This account uses OAuth (Google/Apple). Password changes must be done through your provider.",
        },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = await req.json();

    if (!newPassword) {
      return NextResponse.json(
        { error: "Missing new password" },
        { status: 400 }
      );
    }

    // First-time password setup (passwordHash is null)
    if (!dbUser.passwordHash) {
      const newHash = await bcrypt.hash(newPassword, 12);

      await prisma.user.update({
        where: { id: dbUser.id },
        data: { passwordHash: newHash },
      });

      return NextResponse.json({ success: true });
    }

    // Validate current password
    const isValid = await bcrypt.compare(
      currentPassword,
      dbUser.passwordHash
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Update password
    const newHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: dbUser.id },
      data: { passwordHash: newHash },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
