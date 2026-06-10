import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";

// PATCH handler to toggle the active status of a user
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    const { id: targetUserId } = await params;
    const { active } = await request.json();

    // Security check
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Admin verification
    if (currentUser.roleId !== "role_admin" && currentUser.role?.name !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden access" }, { status: 403 });
    }

    // Self-Inactivation protection block
    if (currentUser.id === targetUserId && active === false) {
      return NextResponse.json(
        { error: "Security restriction: Admins cannot de-activate their own profile." },
        { status: 400 }
      );
    }

    // Update mutation block execution
    const updatedUser = await prisma.user.update({
      where: {
        id: targetUserId,
      },
      data: {
        active: Boolean(active),
      },
    });

    return NextResponse.json({
      success: true,
      message: "User state mutated successfully",
      active: updatedUser.active
    });

  } catch (error) {
    console.error("Toggle active endpoint failed:", error);
    return NextResponse.json(
      { error: "Could not modify status parameters on database tables." },
      { status: 500 }
    );
  }
}