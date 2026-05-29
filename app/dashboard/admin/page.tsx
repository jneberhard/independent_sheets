import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role.name !== "ADMIN") {
    redirect("/dashboard");
  }
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-5xl rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

        <p className="mt-4 text-gray-600">
          Welcome, {user.name ?? user.email}.
        </p>

        <p className="mt-2 text-gray-600">
          This protected ADMIN dashboard will eventually show purchases, uploads, and
          account tools.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Link
            href="/dashboard/publisher/sales"
            className="rounded-lg border bg-gradient-to-br from-blue-50 to-blue-100 p-6 hover:shadow-md transition-shadow"
          >
            <h2 className="font-semibold text-gray-900">Sales Report</h2>
            <p className="mt-2 text-sm text-gray-600">
              View all sales across the platform with detailed metrics and export options.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}