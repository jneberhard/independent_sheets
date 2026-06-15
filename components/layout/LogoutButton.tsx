"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { useCart } from "@/app/context/CartContext";

export default function LogoutButton() {
  const router = useRouter();
  const { clearCart } = useCart();

  async function handleLogout() {
    try {
      // Clears the cart upon logout
      clearCart();
      
      // Then attempts to signout
      await authClient.signOut();

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed: ", error);
    }
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