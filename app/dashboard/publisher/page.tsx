import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";
import Link from "next/link";

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
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-5xl rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">Publisher Dashboard</h1>

        <p className="mt-4 text-gray-600">
          Welcome, {user.name ?? user.email}.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Link
            href="/dashboard/publisher/upload"
            className="rounded-lg border bg-white p-5 shadow-sm transition hover:bg-blue-50 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              Upload Sheet Music
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Add a PDF, preview MP3, artwork, price, and description.
            </p>
          </Link>

          <Link
            href="/dashboard/publisher/music"
            className="rounded-lg border bg-white p-5 shadow-sm transition hover:bg-blue-50 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              My Sheet Music
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              View and manage music you have uploaded.
            </p>
          </Link>

          <Link
            href="/dashboard/publisher/sales"
            className="rounded-lg border bg-white p-5 shadow-sm transition hover:bg-blue-50 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              Sales Reports
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Review purchases, downloads, and royalty earnings.
            </p>
          </Link>
        </div>


      </div>
    </main>
  );
}