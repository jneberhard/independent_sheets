"use client";

import { useState, useEffect } from "react";
import { exportSummaryCsv, exportDetailedCsv } from "@/lib/export/salesExport";
import { ChevronDown, Star, Download, TrendingUp, Users } from "lucide-react";

interface Song {
  id: string;
  title: string;
}

interface AggregatedSale {
  songId: string;
  songTitle: string;
  salesCount: number;
  totalRevenueCents: number;
  royaltyAmountCents: number;
  platformAmountCents: number;
  downloadCount: number;
  reviewCount: number;
  averageRating: number;
  viewCount: number;
  wishlistCount: number;
  purchases: DetailedPurchase[];
}

interface DetailedPurchase {
  purchaseId: string;
  buyerEmail: string;
  buyerName: string | null;
  amountCents: number;
  purchasedAt: Date;
  royaltyAmountCents: number;
  platformAmountCents: number;
}

interface ApiResponse {
  aggregated: AggregatedSale[];
  detailed: DetailedPurchase[];
  metrics: {
    totalSales: number;
    totalRevenueCents: number;
    totalRoyaltyCents: number;
    totalPlatformCents: number;
    totalDownloads: number;
    totalReviews: number;
    averageRating: number;
    totalViews: number;
  };
}

export function SalesReportClient({ songs }: { songs: Song[] }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
  const [salesData, setSalesData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSalesData();
  }, []);

  async function fetchSalesData() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      selectedSongs.forEach((id) => params.append("songIds", id));

      const response = await fetch(`/api/sales?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch sales data");

      const data = await response.json();
      setSalesData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange() {
    fetchSalesData();
  }

  function toggleRowExpanded(songId: string) {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(songId)) {
      newExpanded.delete(songId);
    } else {
      newExpanded.add(songId);
    }
    setExpandedRows(newExpanded);
  }

  function handleSongToggle(songId: string) {
    const newSelected = new Set(selectedSongs);
    if (newSelected.has(songId)) {
      newSelected.delete(songId);
    } else {
      newSelected.add(songId);
    }
    setSelectedSongs(Array.from(newSelected));
  }

  function handleExportSummary() {
    if (salesData?.aggregated) {
      exportSummaryCsv(
        salesData.aggregated.map((s) => ({
          songTitle: s.songTitle,
          salesCount: s.salesCount,
          totalRevenueCents: s.totalRevenueCents,
          royaltyAmountCents: s.royaltyAmountCents,
          platformAmountCents: s.platformAmountCents,
        }))
      );
    }
  }

  function handleExportDetailed() {
    if (salesData?.detailed) {
      const detailed = salesData.detailed.map((d) => ({
        songTitle: d.songTitle,
        buyerEmail: d.buyerEmail,
        buyerName: d.buyerName,
        amountCents: d.amountCents,
        purchasedAt: new Date(d.purchasedAt),
        royaltyAmountCents: d.royaltyAmountCents,
        platformAmountCents: d.platformAmountCents,
      }));
      exportDetailedCsv(detailed);
    }
  }

  const metrics = salesData?.metrics;

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-gray-900">Sales & Performance Report</h1>
        <p className="mt-2 text-gray-600">Reviews, purchases, downloads, customer activity & royalty earnings</p>

        {/* Filters */}
        <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                onBlur={handleFilterChange}
                className="mt-2 w-full rounded-md border px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                onBlur={handleFilterChange}
                className="mt-2 w-full rounded-md border px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Songs</label>
              <div className="mt-2 max-h-40 overflow-y-auto rounded-md border">
                {songs.map((song) => (
                  <label key={song.id} className="flex items-center border-b px-3 py-2 hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={selectedSongs.includes(song.id)}
                      onChange={() => {
                        handleSongToggle(song.id);
                      }}
                      onClick={handleFilterChange}
                      className="h-4 w-4"
                    />
                    <span className="ml-2 text-sm">{song.title}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        {metrics && (
          <>
            {/* Revenue & Royalties */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900">Royalty Earnings & Revenue</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <MetricCard label="Total Revenue" value={`$${(metrics.totalRevenueCents / 100).toFixed(2)}`} />
                <MetricCard
                  label="Your Royalties"
                  value={`$${(metrics.totalRoyaltyCents / 100).toFixed(2)}`}
                  highlight="success"
                />
                <MetricCard
                  label="Platform Share"
                  value={`$${(metrics.totalPlatformCents / 100).toFixed(2)}`}
                  icon={<TrendingUp size={20} />}
                />
              </div>
            </div>

            {/* Sales & Downloads */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900">Purchases & Downloads</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <MetricCard label="Total Purchases" value={metrics.totalSales.toString()} />
                <MetricCard
                  label="Total Downloads"
                  value={metrics.totalDownloads.toString()}
                  icon={<Download size={20} />}
                />
              </div>
            </div>

            {/* Reviews & Engagement */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900">Customer Reviews & Engagement</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <MetricCard label="Total Reviews" value={metrics.totalReviews.toString()} />
                <MetricCard
                  label="Average Rating"
                  value={`${metrics.averageRating} / 5`}
                  icon={<Star size={20} className="text-yellow-500" />}
                />
                <MetricCard
                  label="Profile Views"
                  value={metrics.totalViews.toString()}
                  icon={<Users size={20} />}
                />
              </div>
            </div>
          </>
        )}

        {/* Table */}
        {error && <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}

        {loading ? (
          <div className="mt-8 text-center text-gray-600">Loading sales data...</div>
        ) : salesData?.aggregated.length === 0 ? (
          <div className="mt-8 rounded-lg border bg-white p-8 text-center text-gray-600">
            No sales data found for the selected filters.
          </div>
        ) : (
          <div className="mt-8 rounded-lg border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900"></th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Song Title</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Sales</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Downloads</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Reviews</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Rating</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Revenue</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Your Royalty</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData?.aggregated.map((sale) => (
                    <tbody key={sale.songId}>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleRowExpanded(sale.songId)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <ChevronDown
                              size={20}
                              className={`transform transition ${expandedRows.has(sale.songId) ? "rotate-180" : ""}`}
                            />
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{sale.songTitle}</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-900">{sale.salesCount}</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-900">{sale.downloadCount}</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-900">{sale.reviewCount}</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-900">
                          <div className="flex items-center justify-center gap-1">
                            <Star size={16} className="text-yellow-500" />
                            {sale.averageRating > 0 ? `${sale.averageRating}` : "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                          ${(sale.totalRevenueCents / 100).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-semibold text-green-600">
                          ${(sale.royaltyAmountCents / 100).toFixed(2)}
                        </td>
                      </tr>

                      {expandedRows.has(sale.songId) && (
                        <tr className="border-b bg-gray-50">
                          <td colSpan={8} className="px-6 py-4">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b text-gray-700">
                                  <th className="px-4 py-2 text-left">Buyer Email</th>
                                  <th className="px-4 py-2 text-left">Buyer Name</th>
                                  <th className="px-4 py-2 text-left">Purchase Date</th>
                                  <th className="px-4 py-2 text-right">Sale Amount</th>
                                  <th className="px-4 py-2 text-right">Your Royalty</th>
                                </tr>
                              </thead>
                              <tbody>
                                {sale.purchases.map((purchase) => (
                                  <tr key={purchase.purchaseId} className="border-b">
                                    <td className="px-4 py-2 text-gray-700">{purchase.buyerEmail}</td>
                                    <td className="px-4 py-2 text-gray-700">{purchase.buyerName || "-"}</td>
                                    <td className="px-4 py-2 text-gray-700">
                                      {new Date(purchase.purchasedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-2 text-right text-gray-700">
                                      ${(purchase.amountCents / 100).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-2 text-right font-medium text-green-600">
                                      ${(purchase.royaltyAmountCents / 100).toFixed(2)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Export Buttons */}
        {salesData && salesData.aggregated.length > 0 && (
          <div className="mt-8 flex gap-4">
            <button
              onClick={handleExportSummary}
              className="rounded-md bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
            >
              Export Summary to CSV
            </button>
            <button
              onClick={handleExportDetailed}
              className="rounded-md bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
            >
              Export Detailed to CSV
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
  icon,
  highlight,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  highlight?: "success" | undefined;
}) {
  return (
    <div className={`rounded-lg border p-6 shadow-sm ${highlight === "success" ? "border-green-200 bg-green-50" : "bg-white"}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className={`mt-2 text-2xl font-bold ${highlight === "success" ? "text-green-700" : "text-gray-900"}`}>
            {value}
          </p>
        </div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
    </div>
  );
}
