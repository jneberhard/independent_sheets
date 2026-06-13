import Link from "next/link";
import { redirect } from "next/navigation";

import CustomerNav from "@/components/authdashboard/CustomerNav";
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
          
          <div className="group rounded-3xl border border-[var(--accent)] bg-[var(--accent)] p-7 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--card2)]">
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
            href="/account"
            className="group rounded-3xl border border-[var(--primary)] bg-[var(--secondary)] p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="inline-flex rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-black">
              Account
            </div>

            <h2 className="mt-5 text-2xl font-bold text-black">
              Account Editor
            </h2>

            <p className="mt-4 text-sm leading-7 text-black">
              Change account info and password.
            </p>

            <div className="mt-6 text-sm font-semibold text-black group-hover:underline">
              Account Management →
            </div>
          </Link>
        </section>
      </div>
    </main>
  );
}
