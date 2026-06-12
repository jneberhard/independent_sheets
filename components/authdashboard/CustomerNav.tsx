"use client";

import Link from "next/link";

export default function CustomerNav({ userId }: { userId?: string }) {
  const destinationUrl = userId
    ? `/dashboard/purchases/${userId}`
    : "/dashboard";

  return (
    <nav className="mt-4 text-sm" aria-label="Customer portal shortcuts">
      <Link
        href={destinationUrl}
        className="text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 rounded px-1.5 py-1"
      >
        My Purchase History
        <span className="ml-1 inline-block" aria-hidden="true">→</span>
      </Link>
    </nav>
  );
}