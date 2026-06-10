import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";

// DELETE handler to completely purge a user record
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    const { id: targetUserId } = await params;

    // Security Check: Block unauthenticated users
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Authorization Check: Restrict strictly to admins
    if (currentUser.roleId !== "role_admin" && currentUser.role?.name !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden access" }, { status: 403 });
    }

    // Self-Harm Protection Check
    if (currentUser.id === targetUserId) {
      return NextResponse.json(
        { error: "Security restriction: Admins cannot delete their own profile session." },
        { status: 400 }
      );
    }

    // Perform database deletion
    await prisma.user.delete({
      where: { id: targetUserId },
    });

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("User deletion server crash:", error);
    return NextResponse.json(
      { error: "Internal operational error occurred during database modification." },
      { status: 500 }
    );
  }
}

// PATCH handler to update user details (name, email, role)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    const { id: targetUserId } = await params;
    const body = await request.json();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (currentUser.roleId !== "role_admin" && currentUser.role?.name !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden access" }, { status: 403 });
    }

    const { name, email, roleId } = body;

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(roleId !== undefined && { roleId }),
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("User update operational error:", error);
    return NextResponse.json(
      { error: "Could not modify the user's data settings." },
      { status: 500 }
    );
  }
}