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

    // Block Google/OAuth users from executing standard password changes
    if (dbUser.authProvider !== "credentials") {
      return NextResponse.json(
        {
          error:
            "This account uses OAuth (Google). Password updates must be managed through your identity provider.",
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

    // 1. Validate current password against local database (if a password hash already exists)
    if (dbUser.passwordHash) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to make updates." },
          { status: 400 }
        );
      }

      const isValid = await bcrypt.compare(currentPassword, dbUser.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      }
    }

    // 2. Synchronize the credential change to Neon Auth first
    // This securely invalidates current tokens and forces an upstream update
    const { error: authError } = await auth.changePassword({
      currentPassword: currentPassword || "", // Fallback empty string if setting a password for the first time
      newPassword: newPassword,
      revokeOtherSessions: true,
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message || "Failed to update authentication server records." },
        { status: 400 }
      );
    }

    // 3. Hash the new password for your local Prisma fallback layer
    const newHash = await bcrypt.hash(newPassword, 12);

    // 4. Update the local Prisma database
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { passwordHash: newHash },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Password sync failure encountered:", err);

    // Explicitly parse error types to avoid "unexpected any" violations
    const errorMessage = err instanceof Error ? err.message : "Internal server error";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}