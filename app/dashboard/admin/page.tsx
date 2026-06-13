import Link from "next/link";
import { redirect } from "next/navigation";
import UploadTile from "@/components/authdashboard/dashboardtiles/UploadTile";
import EditUploadTile from "@/components/authdashboard/dashboardtiles/EditUploadTile";
import AnalyticsTile from "@/components/authdashboard/dashboardtiles/AnalyticsTile";
import OrderHistoryTile from "@/components/authdashboard/dashboardtiles/OrderHistoryTile";
import AccountManagementTile from "@/components/authdashboard/dashboardtiles/AccountManagementTile";
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
    <main className="min-h-screen bg-[var(--background)] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-3xl bg-[var(--primary)] p-10 text-white shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--card2)]">
            Admin Workspace
          </p>

          <h1 className="mt-4 text-4xl font-bold md:text-5xl text-[var(--card2)]">
            Welcome, {user.name ?? user.email}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--background)]">
            Manage the platform from one place. Review uploads, organize
            catalog items, monitor sales and royalty activity, and keep user
            management close at hand.
          </p>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">

          <UploadTile />

          <EditUploadTile />

          <AnalyticsTile />

          <OrderHistoryTile userId={user.id} />

          <AccountManagementTile />

          <Link
            href="/dashboard/admin/userList"
            className="group rounded-3xl border border-[var(--secondary)] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="inline-flex rounded-full bg-[var(--background)] px-4 py-2 text-sm font-semibold text-white">
              Users
            </div>

            <h2 className="mt-5 text-2xl font-bold text-[var(--accent)]">
              User List
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-700">
              View users on the platform, then edit, update, or manage them.
            </p>

            <div className="mt-6 text-sm font-semibold text-[var(--accent)] group-hover:underline">
              View User List →
            </div>
          </Link>
        </section>
      </div>
    </main>
  );
}
