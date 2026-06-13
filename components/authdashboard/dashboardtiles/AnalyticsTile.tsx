import Link from "next/link";

export default function AnalyticsTile() {
    return(
        <Link
          href="/dashboard/publisher/sales"
          className="group rounded-3xl border border-[var(--primary)] bg-[var(--secondary)] p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="inline-flex rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-black">
            Analytics
          </div>
          <h2 className="mt-5 text-2xl font-bold text-black">
            Sales Reports
          </h2>
          <p className="mt-4 text-sm leading-7 text-black">
            Review purchases and royalty earnings.
          </p>
          <div className="mt-6 text-sm font-semibold text-black group-hover:underline">
            Review sales →
          </div>
        </Link>
    );
}