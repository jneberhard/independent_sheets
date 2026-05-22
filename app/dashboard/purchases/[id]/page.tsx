import { auth } from "@/lib/auth/server";
import PurchaseHistory from "@/components/authdashboard/PurchaseHistory";

export default async function PurchasesPage() {
    const { data: session } = await auth.getSession();
    // Ensure route protection here!

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="max-w-2xl text-center">
        <PurchaseHistory />

        <div className="mt-10 rounded-2xl border bg-white p-10 shadow-sm">
          <h2 className="text-3xl font-semibold text-gray-900">
            Coming Soon
          </h2>

          <p className="mt-4 text-gray-600">
            This section of Independent Sheets is currently under development.
          </p>
        </div>
      </div>
    </main>
  );
}