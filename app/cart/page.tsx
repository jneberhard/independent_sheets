'use client';

import Image from "next/image";
import Link from 'next/link';
import { useMemo } from 'react';
import { useCart } from '@/app/context/CartContext';
import { Trash2, ShoppingCart, Music, ArrowLeft, CreditCard } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } = useCart();

  const total = useMemo(() => {
    return cart.reduce((sum: number, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const totalQuantity = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-12 sm:px-6 lg:px-8 text-gray-900">
      <div className="mx-auto max-w-6xl">

        {/* Header Action Row */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--secondary)] pb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[var(--primary)] p-2 text-white">
              <ShoppingCart className="h-6 w-6" aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--primary)]">
              Your Shopping Cart
            </h1>
          </div>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="self-start text-sm font-semibold text-red-600 hover:text-red-800 hover:underline transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded"
            >
              Clear All Items
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          /* Empty State View */
          <div className="mx-auto max-w-md rounded-2xl border border-[var(--secondary)] bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--background)] text-[var(--primary)]">
              <ShoppingCart className="h-10 w-10" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--primary)]">
              Your cart is empty
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Looks like you have not added any sheet music items to your order collection yet.
            </p>
            <Link
              href="/catalog"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Browse Full Catalog
            </Link>
          </div>
        ) : (
          /* Main Layout Columns */
          <div className="grid gap-8 lg:grid-cols-12 items-start">

            {/* Left Column: Product List */}
            <div className="space-y-4 lg:col-span-7 xl:col-span-8">
              {cart.map((item) => (
                <article
                  key={item.id}
                  className="flex gap-4 sm:gap-6 rounded-2xl border border-[var(--secondary)] bg-white p-4 sm:p-6 shadow-sm transition hover:shadow-md"
                >
                  {/* Image Thumbnail Container */}
                  <div className="relative h-28 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50 border border-gray-100 shadow-sm">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={`Cover thumbnail artwork for ${item.title}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400" aria-hidden="true">
                        <Music className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  {/* Product Details Area */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {/* Dynamic Category Badges Block */}
                        {item.categories && item.categories.length > 0 && (
                          <div className="mb-1 flex flex-wrap gap-1" aria-label="Item classifications">
                            {item.categories.map((cat, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 ring-1 ring-inset ring-blue-700/10 uppercase tracking-wider"
                              >
                                {cat.category.name}
                              </span>
                            ))}
                          </div>
                        )}

                        <h2 className="font-bold text-[var(--primary)] text-base sm:text-lg line-clamp-2">
                          {item.title}
                        </h2>
                        <p className="mt-1 text-xs text-gray-500">
                          Unit Price: ${item.price.toFixed(2)}
                        </p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                        title={`Remove ${item.title} from cart`}
                        aria-label={`Remove ${item.title} from cart`}
                      >
                        <Trash2 className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>

                    {/* Quantity & Math Calculations Line */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-gray-50 pt-3">
                      <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-1">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="flex h-7 w-7 items-center justify-center rounded text-base font-bold text-gray-600 hover:bg-white active:bg-gray-100 transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400"
                          aria-label={`Decrease quantity for ${item.title}`}
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-[var(--primary)]" aria-live="polite">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQuantity(item.id)}
                          className="flex h-7 w-7 items-center justify-center rounded text-base font-bold text-gray-600 hover:bg-white active:bg-gray-100 transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400"
                          aria-label={`Increase quantity for ${item.title}`}
                        >
                          +
                        </button>
                      </div>

                      <span className="text-base font-bold text-[var(--primary)]">
                        <span className="sr-only">Total product price: </span>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Right Column: Checkout Summary Card */}
            <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-6">
              <section className="rounded-2xl border border-[var(--secondary)] bg-white p-6 shadow-sm" aria-labelledby="summary-heading">
                <h2 id="summary-heading" className="text-lg font-bold text-[var(--primary)] border-b border-gray-100 pb-4">
                  Order Summary
                </h2>

                <div className="mt-4 space-y-3">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Total items</span>
                    <span className="font-medium text-[var(--primary)]">
                      {totalQuantity} copies
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Format</span>
                    <span className="font-medium text-emerald-700">Digital Distribution License (PDF)</span>
                  </div>

                  <div className="border-t border-gray-100 pt-4 flex items-baseline justify-between">
                    <span className="text-base font-bold text-[var(--primary)]">Total Cost</span>
                    <span className="text-3xl font-black text-[var(--primary)]">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Link
                    href="/checkout"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] py-3.5 text-center text-sm font-bold text-white shadow-md transition hover:opacity-90 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
                  >
                    <CreditCard className="h-4 w-4" aria-hidden="true" />
                    Proceed to Checkout
                  </Link>

                  <Link
                    href="/catalog"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--primary)] bg-white py-3 text-center text-sm font-bold text-[var(--primary)] transition hover:bg-[var(--background)] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Continue Shopping
                  </Link>
                </div>
              </section>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}