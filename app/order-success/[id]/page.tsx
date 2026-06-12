'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight, ShoppingBag } from 'lucide-react';
import Image from "next/image";

interface OrderItem {
  id: string;
  quantity: number;
  priceAtPurchase: number;
  sheetMusic: {
    id: string;
    title: string;
    imageUrl: string | null;
  };
}

interface FormattedOrderDetails {
  id: string;
  total: number;
  purchasedAt: string;
  userId: string;
  items: OrderItem[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderSuccess({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams?.id || null;

  const [order, setOrder] = useState<FormattedOrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/orders/${id}`);

        if (!response.ok) {
          setOrder(null);
          return;
        }

        const data = await response.json();
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-live="polite">
        <div className="animate-pulse text-[var(--rust)] font-medium">Loading receipt details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <main className="max-w-md mx-auto text-center py-20 px-4">
        <h1 className="text-2xl font-bold text-[var(--navy)]">Order not found</h1>
        <p className="text-gray-500 text-sm mt-1">This transaction link may have expired or is invalid.</p>
        <Link
          href="/"
          className="text-[var(--rust)] hover:underline mt-4 inline-block font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rust)] rounded"
        >
          Back to the store
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto py-10 px-4 text-gray-900">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

        {/* Thanks for the Purchase Header */}
        <div className="bg-emerald-50 p-8 text-center border-b border-emerald-100">
          <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" aria-hidden="true" />
          <h1 className="text-3xl font-bold text-gray-900">Thank you for your purchase!</h1>
          <p className="text-gray-600 mt-2">Your digital music sheets are unlocked and ready for download.</p>
          <div className="mt-4 inline-block bg-white px-4 py-2 rounded-full text-xs font-mono text-gray-500 border border-emerald-200 shadow-sm">
            <span className="sr-only">Receipt reference number: </span>
            Transaction ID: {id}
          </div>
        </div>

        <div className="p-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-800">
            <Package className="h-5 w-5 text-[var(--rust)]" aria-hidden="true" />
            Asset Access Summary
          </h2>

          {/* Dynamic Item Loop Render Logic */}
          <div className="space-y-4 mb-8">
            {order.items && order.items.length > 0 ? (
              order.items.map((item) => (
                <article key={item.id} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0">
                  <div className="flex gap-4 items-center">

                    {/* Cover Thumbnail Container */}
                    <div className="h-20 w-16 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center border border-gray-100 shadow-sm relative flex-shrink-0">
                      {item.sheetMusic?.imageUrl ? (
                        <Image
                          src={item.sheetMusic.imageUrl}
                          alt={`Cover design for ${item.sheetMusic.title}`}
                          fill
                          sizes="64px" // 💡 Performance: Shrinks memory buffers for small image cards
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-[10px] text-gray-400 font-medium tracking-tight uppercase px-1 text-center" aria-hidden="true">
                          Score
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-900 text-base">
                        {item.sheetMusic?.title || 'Digital Sheet Music Asset'}
                      </h3>

                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="text-xs bg-gray-100 text-gray-700 font-semibold px-2 py-0.5 rounded-md">
                          Qty: {item.quantity}
                        </span>
                        <span className="text-xs text-green-700 font-medium bg-green-50 px-2 py-0.5 rounded-md inline-block">
                          Instant Access Granted
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Item calculated total line */}
                  <div className="text-right flex-shrink-0">
                    <span className="font-bold text-gray-900 text-lg">
                      <span className="sr-only">Subtotal: </span>
                      ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                    </span>
                    {item.quantity > 1 && (
                      <p className="text-xs text-gray-400 mt-0.5">(${item.priceAtPurchase.toFixed(2)} each)</p>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <p className="text-sm text-gray-500 py-4 text-center">No individual digital sheets found on this record.</p>
            )}
          </div>

          {/* Aggregate Calculation Summary Panel */}
          <div className="bg-gray-50 p-6 rounded-xl space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Digital Delivery Charge</span>
              <span className="text-emerald-700 font-semibold uppercase text-xs tracking-wider">Free</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
              <span>Total Debited</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Dynamic Navigation Row Layout */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/"
              className="flex-1 bg-gray-900 text-white text-center py-4 rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
            >
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              Continue Shopping
            </Link>

            <Link
              href={`/dashboard/purchases/${order.userId}`}
              className="flex-1 bg-white border-2 border-gray-200 text-gray-700 text-center py-4 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
            >
              View My Purchases
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}