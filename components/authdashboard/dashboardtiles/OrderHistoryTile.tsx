"use client"

import Link from "next/link";

export default function OrderHistoryTile({ userId }: { userId: string }) {
    return (
        <Link
          href={`/dashboard/purchases/${userId}`}
          className="group rounded-3xl border border-[var(--accent)] bg-[var(--accent)] p-7 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl block"
        >
          <div className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">
            Purchases
          </div>
          <h2 className="mt-5 text-2xl font-bold">Purchased Sheet Music</h2>
          <p className="mt-4 text-sm leading-7 text-white">
            Your order history.
          </p>
          <div className="mt-6 text-sm font-semibold text-white group-hover:underline">
            Order History →
          </div>
        </Link>
    );
}