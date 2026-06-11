import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Calendar, FileMusic, ArrowRight } from "lucide-react";

interface PurchaseHistoryProps {
  userId: string;
  userName: string;
}

export default async function PurchaseHistory({ userId, userName }: PurchaseHistoryProps) {
  // Fetch grouped Orders
  const orders = await prisma.order.findMany({
    where: {
      buyerId: userId,
    },
    include: {
      purchases: {
        include: {
          sheetMusic: {
            include: {
              artist: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="text-left text-gray-800">
      <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
        Purchase History
      </h3>
      {/* test to see if there are any orders */}
      {orders.length === 0 ? (
        <p className="mt-3 text-gray-500">
          No purchases yet for {userName}. Once you buy sheet music, it will show here.
        </p>
      ) : (
        <div className="mt-6 space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:border-gray-300 transition-all"
            >
              {/* Order Metadata Top Row Layout */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>
                    {order.createdAt.toLocaleDateString("en-ZA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="font-mono text-xs text-gray-500">
                    Order Ref: #{order.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>
                {/* displays total amount paid */}
                <div className="text-right">
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block">Total Paid</span>
                  <span className="text-xl font-extrabold text-[var(--navy,#111827)]">
                    ${(order.totalCents / 100).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Nested Items Mapping List Wrapper */}
              <div className="space-y-4">
                {order.purchases.map((purchase) => (
                  <div key={purchase.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex items-start gap-3">
                      <FileMusic className="h-5 w-5 text-[var(--rust,#c2410c)] mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-gray-900 text-base">
                          {purchase.sheetMusic.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-0.5">
                          By {purchase.sheetMusic.artist.name ?? purchase.sheetMusic.artist.email}
                        </p>
                        {purchase.quantity > 1 && (
                          <span className="mt-1 inline-block text-xs bg-white border border-gray-200 text-gray-700 px-2 py-0.5 rounded-md font-semibold">
                            Qty: {purchase.quantity}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Download link hook specifically targeting this piece of music */}
                    <div className="flex-shrink-0">
                      <Link
                        href={`/api/sheet-music/${purchase.sheetMusicId}/download`}
                        className="inline-flex w-full sm:w-auto justify-center rounded-xl bg-white border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                      >
                        Download PDF
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* View Receipt Link Action Button Footer Row */}
              <div className="mt-5 pt-3 border-t border-gray-100 text-right">
                <Link
                  href={`/order-success/${order.id}`}
                  className="inline-flex items-center gap-1 text-sm font-bold text-[var(--rust,#c2410c)] hover:underline"
                >
                  View full order snapshot
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}