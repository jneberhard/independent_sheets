import Link from "next/link";
import { redirect } from "next/navigation";

import CustomerNav from "@/components/authdashboard/CustomerNav";
import { getCurrentUser } from "@/lib/currentUser";

export default async function PublisherDashboardPage() {
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
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Admin Workspace
          </p>

          <h1 className="mt-4 text-4xl font-bold md:text-5xl">
            Welcome, {user.name ?? user.email}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--background)]">
            Manage your complete sheet music catalog from one place.
            Upload new arrangements, organize music by voicing and
            instrumentation, update listings, and monitor sales and
            royalty activity. As an admin, you also have access to user management and
            platform analytics to oversee overall performance and user engagement.
          </p>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <Link
            href="/dashboard/publisher/upload"
            className="group rounded-3xl border border-[var(--secondary)] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="inline-flex rounded-full bg-[var(--background)] px-4 py-2 text-sm font-semibold text-[var(--primary)]">
              Upload
            </div>

            <h2 className="mt-5 text-2xl font-bold text-[var(--primary)]">
              Upload Sheet Music
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-700">
              Add a new PDF score, preview MP3, artwork image,
              title, description, and pricing information.
            </p>

            <div className="mt-6 text-sm font-semibold text-[var(--primary)] group-hover:underline">
              Start uploading →
            </div>
          </Link>

          <Link
            href="/dashboard/publisher/music"
            className="group rounded-3xl border border-[var(--accent)] bg-[var(--accent)] p-7 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--primary)]">
              Manage
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              My Sheet Music
            </h2>

            <p className="mt-4 text-sm leading-7 text-white">
              Edit uploaded music, update pricing, and manage metadata.
            </p>

            <div className="mt-6 text-sm font-semibold text-white group-hover:underline">
              View catalog →
            </div>
          </Link>

          <Link
            href="/dashboard/admin/royalties"
            className="group rounded-3xl border border-[var(--primary)] bg-[var(--secondary)] p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="inline-flex rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white">
              Analytics
            </div>

            <h2 className="mt-5 text-2xl font-bold text-[var(--primary)]">
              Royalty Reports
            </h2>

            <p className="mt-4 text-sm leading-7 text-[var(--primary)]">
              View sales, earnings, and publisher payouts.
            </p>

            <div className="mt-6 text-sm font-semibold text-[var(--primary)] group-hover:underline">
              View reports →
            </div>
          </Link>

          <div className="group rounded-3xl border border-[var(--accent)] bg-[var(--accent)] p-7 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--primary)]">
              Purchases
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              Purchased Sheet Music
            </h2>

            <p className="mt-4 text-sm leading-7 text-white">
              See your purchase history.
            </p>

            <CustomerNav userId={user.id} />
          </div>

          <Link
            href="/dashboard/admin/contracts"
            className="group rounded-3xl border border-[var(--primary)] bg-[var(--secondary)] p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="inline-flex rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white">
              Management
            </div>

            <h2 className="mt-5 text-2xl font-bold text-[var(--primary)]">
              Contract Management
            </h2>

            <p className="mt-4 text-sm leading-7 text-[var(--primary)]">
              Manage publisher contracts and royalty percentages.
            </p>

            <div className="mt-6 text-sm font-semibold text-[var(--primary)] group-hover:underline">
              Manage contracts →
            </div>
          </Link>

          <Link
            href="/dashboard/admin/payouts"
            className="group rounded-3xl border border-[var(--accent)] bg-[var(--accent)] p-7 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--primary)]">
              Payments
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              Payout Management
            </h2>

            <p className="mt-4 text-sm leading-7 text-white">
              Track and process publisher payments.
            </p>

            <div className="mt-6 text-sm font-semibold text-white group-hover:underline">
              Manage payouts →
            </div>
          </Link>
        </section>
      </div>
    </main>
  );
}
