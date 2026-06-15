import { redirect } from "next/navigation";
import OrderHistoryTile from "@/components/authdashboard/dashboardtiles/OrderHistoryTile";
import AccountManagementTile from "@/components/authdashboard/dashboardtiles/AccountManagementTile";
import { getCurrentUser } from "@/lib/currentUser";

export default async function PublisherDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role.name == "PUBLISHER") {
    redirect("/dashboard/publisher");
  }
  else if (user.role.name == "ADMIN") {
    redirect("/dashboard/admin");
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-3xl bg-[var(--card2)] p-10 text-white shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
            Customer Dashboard
          </p>

          <h1 className="mt-4 text-4xl font-bold md:text-5xl">
            Welcome, {user.name ?? user.email}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-white">
            Manage your complete Account and Purchases.
          </p>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {/* Tiles on dashboard page. Essentially stylized link components */}
          <OrderHistoryTile userId={user.id} />
          
          <AccountManagementTile />
        </section>
      </div>
    </main>
  );
}
