'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight, ShoppingBag } from 'lucide-react';
import Image from "next/image";
import CustomerNav from "@/components/authdashboard/CustomerNav";

interface FormattedPurchase {
  id: string;
  total: number;
  purchasedAt: string;
  userId: string;
  sheetMusic: {
    id: string;
    title: string;
    imageUrl: string | null;
  };
}

export default function OrderSuccess() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : null;

  const [order, setOrder] = useState<FormattedPurchase | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
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

    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-[var(--rust)] font-medium">Loading details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <h1 className="text-2xl font-bold text-[var(--navy)]">Order not found</h1>
        <p className="text-gray-500 text-sm mt-1">This transaction link may have expired or is invalid.</p>
        <Link href="/" className="text-[var(--rust)] hover:underline mt-4 inline-block font-semibold">Back to the store</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* Top Level Nav Optional Context Placement */}
      <div className="mb-6">
        <CustomerNav />
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Thanks for the Purchase Header */}
        <div className="bg-emerald-50 p-8 text-center border-b border-emerald-100">
          <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Thank you for your purchase!</h1>
          <p className="text-gray-600 mt-2">Your digital music sheet is unlocked and ready for download.</p>
          <div className="mt-4 inline-block bg-white px-4 py-2 rounded-full text-xs font-mono text-gray-500 border border-emerald-200 shadow-sm">
            Transaction ID: {id}
          </div>
        </div>

        <div className="p-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-800">
            <Package className="h-5 w-5 text-[var(--rust)]" />
            Asset Access Summary
          </h2>

          {/* Item Row Render Logic */}
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0">
              <div className="flex gap-4 items-center">
                <div className="h-20 w-16 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center border border-gray-100 shadow-sm relative">
                  {order.sheetMusic?.imageUrl ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={order.sheetMusic.imageUrl}
                        alt={order.sheetMusic.title}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  ) : (
                    <span className="text-[10px] text-gray-400 font-medium tracking-tight uppercase px-1 text-center">Sheet Music</span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-base">{order.sheetMusic?.title || 'Digital Sheet Music Asset'}</p>
                  <p className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-md inline-block mt-1">
                    Instant Access Granted
                  </p>
                </div>
              </div>
              <span className="font-bold text-gray-900 text-lg">${order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Aggregate Calculation Summary Panel */}
          <div className="bg-gray-50 p-6 rounded-xl space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Digital Delivery Charge</span>
              <span className="text-emerald-600 font-semibold uppercase text-xs tracking-wider">Free</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-[var(--navy)] pt-3 border-t border-gray-200">
              <span>Total Debited</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Dynamic Navigation Row Layout */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/"
              className="flex-1 bg-gray-900 text-white text-center py-4 rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.99]"
            >
              <ShoppingBag className="h-5 w-5" />
              Continue Shopping
            </Link>

            <Link
              href={`/dashboard/purchases/${order.userId}`}
              className="flex-1 bg-white border-2 border-gray-200 text-gray-700 text-center py-4 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              View My Purchases
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}