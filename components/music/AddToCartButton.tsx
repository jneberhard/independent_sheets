'use client';

import { useCart } from "@/app/context/CartContext";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

type AddToCartButtonProps = {
  item: {
    id: string;
    title: string;
    price: number;
    imageUrl?: string | null;
  };
};

export default function AddToCartButton({ item }: AddToCartButtonProps) {
  const { addToCart, cart } = useCart();
  const [added, setAdded] = useState(false);

  // Check if item is already in the cart
  const isInCart = cart.some((cartItem) => cartItem.id === item.id);

  const handleAdd = () => {
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      quantity: 1,
      stock: 1, // Sheet music is digital, so stock can be treated as 1 per customer
      imageUrl: item.imageUrl || undefined,
    });

    setAdded(true);
    // Reset the success state bounce after 2 seconds
    setTimeout(() => setAdded(false), 2000);
  };

  if (isInCart) {
    return (
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition"
      >
        <Check className="h-4 w-4" />
        In Cart — View Pages
      </Link>
    );
  }

  return (
    <button
      onClick={handleAdd}
      className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-sm transition active:scale-[0.98] ${
        added
          ? "bg-emerald-600 animate-pulse"
          : "bg-[var(--accent)] hover:opacity-90"
      }`}
    >
      <ShoppingCart className="h-4 w-4" />
      {added ? "Added!" : "Add to Cart"}
    </button>
  );
}