import { redirect } from "next/navigation";
import UploadTile from "@/components/authdashboard/dashboardtiles/UploadTile";
import EditUploadTile from "@/components/authdashboard/dashboardtiles/EditUploadTile";
import AnalyticsTile from "@/components/authdashboard/dashboardtiles/AnalyticsTile";
import OrderHistoryTile from "@/components/authdashboard/dashboardtiles/OrderHistoryTile";
import AccountManagementTile from "@/components/authdashboard/dashboardtiles/AccountManagementTile";
import { getCurrentUser } from "@/lib/currentUser";

export default async function PublisherDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role.name !== "PUBLISHER" && user.role.name !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        {/* This opening section is the publisher's home base, so the main actions
            are grouped here instead of spreading them across separate pages. */}
        <section className="rounded-3xl bg-[var(--primary)] p-10 text-white shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--card2)]">
            Publisher Workspace
          </p>

          <h1 className="mt-4 text-4xl font-bold md:text-5xl text-[var(--card2)]">
            Welcome, {user.name ?? user.email}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--background)]">
            Manage your complete sheet music catalog from one place.
            Upload new arrangements, organize music by voicing and
            instrumentation, update listings, and monitor sales and
            royalty activity.
          </p>
        </section>

        {/* These cards point the publisher to the real work areas: upload, manage,
            sales, purchase history, and account editing. */}
        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {/* Tiles on dashboard page. Essentially stylized link components */}
            <UploadTile />
            
            <EditUploadTile />
  
            <AnalyticsTile />
  
            <OrderHistoryTile userId={user.id} />
  
            <AccountManagementTile />
        </section>
      </div>
    </main>
  );
}
