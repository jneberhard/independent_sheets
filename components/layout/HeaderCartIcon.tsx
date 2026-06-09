'use client';

import Link from "next/link";
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../app/context/CartContext';

interface HeaderCartIconProps {
  isMobile?: boolean;
}

export default function HeaderCartIcon({ isMobile = false }: HeaderCartIconProps) {
  const { cartCount } = useCart();

  return (
    <Link
      href="/cart"
      className={`relative p-2 hover:bg-white/10 rounded-full cursor-pointer transition ${
        isMobile ? "text-white" : ""
      }`}
      >
          
      <ShoppingCart className={`${isMobile ? "h-5 w-5" : "h-6 w-6"} text-black`} />

      {cartCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold shadow-md">
          {cartCount > 9 ? '9+' : cartCount}
        </span>
      )}
    </Link>
  );
}