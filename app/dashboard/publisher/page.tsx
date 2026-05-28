import { redirect } from "next/navigation";
import Link from "next/link";

import { getCurrentUser } from "@/lib/currentUser";

export default async function PublisherDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (
    user.role.name !== "PUBLISHER" &&
    user.role.name !== "ADMIN"
  ) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        {/* HERO */}
        <section className="rounded-3xl bg-[var(--primary)] p-10 text-white shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Publisher Workspace
          </p>

          <h1 className="mt-4 text-4xl font-bold md:text-5xl">
            Welcome, {user.name ?? user.email}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--background)]">
            Manage your complete sheet music catalog from one place.
            Upload new arrangements, organize music by voicing and
            instrumentation, update listings, and monitor sales and
            royalty activity.
          </p>
        </section>

        {/* QUICK ACTIONS */}
        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {/* Upload */}
          <Link
            href="/dashboard/publisher/upload"
            className="group rounded-3xl border border-[var(--secondary)] bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="inline-flex rounded-full bg-[var(--background)] px-4 py-2 text-sm font-semibold text-[var(--primary)]">
              Upload
            </div>

            <h2 className="mt-5 text-2xl font-bold text-[var(--primary)]">
              Upload Sheet Music
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-700">
              Add a new PDF score, preview MP3, artwork image,
              title, description, and pricing information for your
              music catalog.
            </p>

            <div className="mt-6 text-sm font-semibold text-[var(--primary)] group-hover:underline">
              Start uploading →
            </div>
          </Link>

          {/* Manage */}
          <Link
            href="/dashboard/publisher/music"
            className="group rounded-3xl border border-[var(--accent)] bg-[var(--accent)] p-7 text-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--primary)]">
              Manage
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              My Sheet Music
            </h2>

            <p className="mt-4 text-sm leading-7 text-white">
              Edit uploaded music, change artwork, update pricing,
              revise descriptions, and manage voicing,
              instrumentation, and genre categories.
            </p>

            <div className="mt-6 text-sm font-semibold text-white group-hover:underline">
              View catalog →
            </div>
          </Link>

          {/* Sales */}
          <Link
            href="/dashboard/publisher/sales"
            className="group rounded-3xl border border-[var(--primary)] bg-[var(--secondary)] p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="inline-flex rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white">
              Analytics
            </div>

            <h2 className="mt-5 text-2xl font-bold text-[var(--primary)]">
              Sales Reports
            </h2>

            <p className="mt-4 text-sm leading-7 text-[var(--primary)]">
              Review purchases, downloads, customer activity,
              and royalty earnings to better understand how your
              music is performing.
            </p>

            <div className="mt-6 text-sm font-semibold text-[var(--primary)] group-hover:underline">
              Review sales →
            </div>
          </Link>
        </section>

        {/* INFO SECTION */}
        <section className="mt-10 rounded-3xl border border-[var(--secondary)] bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-bold text-[var(--primary)]">
            How the Publisher Dashboard Works
          </h2>

          <p className="mt-4 max-w-4xl text-gray-700 leading-7">
            Independent Sheets allows publishers and composers to
            manage digital sheet music in one centralized platform.
            Each uploaded title can include categorized metadata,
            preview audio, artwork, pricing, and downloadable PDF
            sheet music.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-[var(--background)] p-6">
              <h3 className="text-lg font-bold text-[var(--primary)]">
                1. Upload Your Music
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-700">
                Upload the complete score PDF along with cover
                artwork and optional MP3 previews so customers can
                preview your arrangement before purchase.
              </p>
            </div>

            <div className="rounded-2xl bg-[var(--background)] p-6">
              <h3 className="text-lg font-bold text-[var(--primary)]">
                2. Organize by Category
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-700">
                Assign voicing types, instrumentation, and genres
                so your music appears correctly in browsing and
                search results.
              </p>
            </div>

            <div className="rounded-2xl bg-[var(--background)] p-6">
              <h3 className="text-lg font-bold text-[var(--primary)]">
                3. Track Performance
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-700">
                Monitor downloads, purchases, and royalty activity
                to understand how your catalog is performing over
                time.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}