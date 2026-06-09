import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import EditUserForm from "@/components/admin/EditUserForm";

type EditUserPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminEditUserPage({ params }: EditUserPageProps) {
  // Verify Authentication & Admin Permissions
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.roleId !== "role_admin" && currentUser.role?.name !== "ADMIN") {
    redirect("/dashboard");
  }

  const { id: targetUserId } = await params;

  // Fetch Target User Data & System Roles Concurrently
  const [targetUser, systemRoles] = await Promise.all([
    prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        name: true,
        roleId: true,
        phoneNumber: true,
      },
    }),
    prisma.role.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  if (!targetUser) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="mx-auto max-w-2xl rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Modify User Account</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update personal details, contact information, or adjust administrative access roles for <strong>{targetUser.email}</strong>.
        </p>

        <EditUserForm targetUser={targetUser} systemRoles={systemRoles} />
      </div>
    </main>
  );
}