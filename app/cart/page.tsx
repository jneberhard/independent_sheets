'use client';

import Image from "next/image";
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';
import { Trash2, ShoppingCart, Music, ArrowLeft, CreditCard } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } = useCart();

  // Convert absolute numbers to float format
  const total = cart.reduce(
    (sum: number, item) => sum + item.price * item.quantity, 0
  );

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Header Action Row */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--secondary)] pb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[var(--primary)] p-2 text-white">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--primary)]">
              Your Shopping Cart
            </h1>
          </div>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="self-start text-sm font-semibold text-red-600 hover:text-red-800 hover:underline transition"
            >
              Clear All Items
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          /* Empty State View */
          <div className="mx-auto max-w-md rounded-2xl border border-[var(--secondary)] bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--background)] text-[var(--primary)]">
              <ShoppingCart className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--primary)]">
              Your cart is empty
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Looks like you have not added any sheet music items to your order collection yet.
            </p>
            <Link href="/catalog" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow transition hover:opacity-90">
              <ArrowLeft className="h-4 w-4" />
              Browse Full Catalog
            </Link>
          </div>
        ) : (
          /* Main Layout Columns */
          <div className="grid gap-8 lg:grid-cols-12 items-start">

            {/* Left Column: Product List */}
            <div className="space-y-4 lg:col-span-7 xl:col-span-8">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 sm:gap-6 rounded-2xl border border-[var(--secondary)] bg-white p-4 sm:p-6 shadow-sm transition hover:shadow-md"
                >
                  {/* Image Container */}
                  <div className="relative h-24 w-18 sm:h-28 sm:w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50 border border-gray-100 shadow-sm">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">
                        <Music className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  {/* Product Details Area */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-[var(--primary)] text-base sm:text-lg line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-xs text-gray-400">
                          Unit Price: ${item.price.toFixed(2)}
                        </p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="rounded-lg p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 transition"
                        title="Remove piece"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Quantity & Math Calculations Line */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-gray-50 pt-3">
                      <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-1">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="flex h-7 w-7 items-center justify-center rounded text-base font-bold text-gray-600 hover:bg-white active:bg-gray-100 transition"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-[var(--primary)]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQuantity(item.id)}
                          className="flex h-7 w-7 items-center justify-center rounded text-base font-bold text-gray-600 hover:bg-white active:bg-gray-100 transition"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-base font-bold text-[var(--primary)]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-6">
              <div className="rounded-2xl border border-[var(--secondary)] bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-[var(--primary)] border-b border-gray-100 pb-4">
                  Order Summary
                </h2>

                <div className="mt-4 space-y-3">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Total items</span>
                    <span className="font-medium text-[var(--primary)]">
                      {cart.reduce((sum, i) => sum + i.quantity, 0)} copies
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Format</span>
                    <span className="font-medium text-emerald-600">Digital Distribution License (PDF)</span>
                  </div>

                  <div className="border-t border-gray-100 pt-4 flex items-baseline justify-between">
                    <span className="text-base font-bold text-[var(--primary)]">Total Cost</span>
                    <span className="text-3xl font-black text-[var(--primary)]">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Link href="/checkout" className="block w-full">
                    <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] py-3.5 text-center text-sm font-bold text-white shadow-md transition hover:opacity-90 active:scale-[0.99]">
                      <CreditCard className="h-4 w-4" />
                      Proceed to Checkout
                    </button>
                  </Link>

                  <Link href="/catalog" className="block w-full">
                    <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--primary)] bg-white py-3 text-center text-sm font-bold text-[var(--primary)] transition hover:bg-[var(--background)] active:scale-[0.99]">
                      <ArrowLeft className="h-4 w-4" />
                      Continue Shopping
                    </button>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}