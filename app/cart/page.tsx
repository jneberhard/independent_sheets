import { getCurrentUser } from "@/lib/currentUser";
import CartPageComponent from "@/components/cart/CartPage";
import { redirect } from "next/navigation";

export default async function CartPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <CartPageComponent />
  )
}