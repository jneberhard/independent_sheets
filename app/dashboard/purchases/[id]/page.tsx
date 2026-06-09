import { getCurrentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";
import PurchaseHistory from "@/components/authdashboard/PurchaseHistory";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PurchasesPage({ params }: PageProps) {
  const user = await getCurrentUser();
  const { id } = await params;

  if (!user) {
    redirect("/login");
  }

  // Cross-user access protection logic
  if (id !== user.id) {
    redirect(`/dashboard/purchases/${user.id}`);
  }

  // Fallback string composition logic
  const horizontalDisplayName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
  const analyticalContextLabel = user.email;

  return (
    // 1. Changed layout from a centered flex-box to a natural vertical layout shell
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* 2. Structured Dashboard Context Header Block */}
        <div className="mb-8 pb-5 border-b border-gray-200">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--navy)]">
            Order History
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Securely viewing data for Account:{" "}
            <span className="font-semibold text-gray-700">{analyticalContextLabel}</span>
          </p>
        </div>

        {/* 3. Main Data Mapping View Panel */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6 md:p-8">
          <PurchaseHistory
            userId={user.id}
            userName={horizontalDisplayName}
          />
        </div>

      </div>
    </main>
  );
}