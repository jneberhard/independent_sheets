import { auth } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { data: session } = await auth.getSession();

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-5xl rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

        <p className="mt-4 text-gray-600">
          Welcome, {session?.user?.name ?? session?.user?.email}.
        </p>

        <p className="mt-2 text-gray-600">
          This protected dashboard will eventually show purchases, uploads, and
          account tools.
        </p>
      </div>
    </main>
  );
}