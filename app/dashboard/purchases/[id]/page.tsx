import { getCurrentUser } from "@/lib/currentUser";
import { redirect, notFound } from "next/navigation";
import PurchaseHistory from "@/components/authdashboard/PurchaseHistory";


interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PurchasesPage({ params }: PageProps) {
    const user = await getCurrentUser();
    const { id } = await params;

    
    if (!user) {
      // This is already done by middleware, but this helps to clear error
      // from software not being sure if user will be null
        redirect("/login");
    }

    // Checking if user id matches with logged in user
    if (id !== user.id) {
        redirect(`/dashboard/purchases/${user.id}`);
    }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="max-w-2xl text-center">
        <PurchaseHistory 
        userId={user.id}
        userName={user.name ?? user.email} />

        <div className="mt-10 rounded-2xl border bg-white p-10 shadow-sm">
          <h2 className="text-3xl font-semibold text-gray-900">{user.name} Order History</h2>
          <p className="mt-4 text-gray-600">
            Securely viewing data for ID: {id}
          </p>
        </div>
      </div>
    </main>
  );
}