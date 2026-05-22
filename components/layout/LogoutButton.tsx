"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await authClient.signOut();

    router.push("/");
    router.refresh();

  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
    >
      Logout
    </button>
  );
}