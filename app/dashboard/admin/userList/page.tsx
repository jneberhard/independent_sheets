import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import UserTable from "@/components/admin/UserTable";

export const dynamic = "force-dynamic";

export default async function AdminUserListPage() {
  //Authenticate and authorize session role
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  // Double check authorization against your admin role convention
  if (currentUser.roleId !== "role_admin" && currentUser.role?.name !== "ADMIN") {
    redirect("/dashboard");
  }

  // Fetch all users along with their role
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      roleId: true,
      createdAt: true,
      role: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="mx-auto max-w-7xl">

        {/* Header Block */}
        <div className="sm:flex sm:items-center sm:justify-between border-b pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              User Management
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              A comprehensive directory of all registered accounts. Review data, adjust permissions, toggle activation states, or remove entries.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
              Total Accounts: {users.length}
            </span>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <UserTable initialUsers={users} />
        </div>

      </div>
    </main>
  );
}