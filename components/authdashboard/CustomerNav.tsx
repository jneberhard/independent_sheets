"use client";

import Link from "next/link";

export default function CustomerNav({ userId }: { userId?: string }) {
  if (!userId) return null;

  return (
    <nav className="mt-4 text-sm text-blue-800">
      <Link
        href={`/dashboard/purchases/${userId}`}
        className="hover:underline"
      >
        My Purchase History
      </Link>
    </nav>
  );
}