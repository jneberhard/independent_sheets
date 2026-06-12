"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { ChevronDown, Star, TrendingUp } from "lucide-react";

type Song = {
  id: string;
  title: string;
};

type PurchaseRow = {
  purchaseId: string;
  buyerEmail: string;
  buyerName: string | null;
  amountCents: number;
  purchasedAt: string;
  royaltyAmountCents: number;
  platformAmountCents: number;
};

type SongReport = {
  songId: string;
  songTitle: string;
  salesCount: number;
  totalRevenueCents: number;
  royaltyAmountCents: number;
  platformAmountCents: number;
  reviewCount: number;
  averageRating: number;
  purchases: PurchaseRow[];
};

type SalesApiResponse = {
  aggregated: SongReport[];
  metrics: {
    totalSales: number;
    totalRevenueCents: number;
    totalRoyaltyCents: number;
    totalPlatformCents: number;
    totalReviews: number;
    averageRating: number;
  };
};

function money(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function SalesReportClient({ songs }: { songs: Song[] }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
  const [salesData, setSalesData] = useState<SalesApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");

  const selectedCount = useMemo(() => selectedSongs.length, [selectedSongs]);

  useEffect(() => {
    void fetchSalesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchSalesData() {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      selectedSongs.forEach((songId) => params.append("songIds", songId));

      const response = await fetch(`/api/sales?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch sales data");
      }

      const data = (await response.json()) as SalesApiResponse;
      setSalesData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load sales data");
    } finally {
      setLoading(false);
    }
  }

  function toggleSong(songId: string) {
    setSelectedSongs((current) =>
      current.includes(songId) ? current.filter((id) => id !== songId) : [...current, songId]
    );
  }

  function toggleRow(songId: string) {
    setExpandedRows((current) => {
      const next = new Set(current);
      if (next.has(songId)) {
        next.delete(songId);
      } else {
        next.add(songId);
      }
      return next;
    });
  }

  const metrics = salesData?.metrics;

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12 text-gray-900">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-gray-900">Sales & Performance Report</h1>
        <p className="mt-2 text-gray-700">
          A simple view of purchases, royalties, reviews, and how each song is performing.
        </p>

        {/* Filters Panel Configuration */}
        <section
          className="mt-8 rounded-2xl border bg-white p-6 shadow-sm"
          aria-label="Report Filters"
        >
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label
                htmlFor="start-date-input"
                className="block text-sm font-medium text-gray-900"
              >
                Start Date
              </label>
              <input
                id="start-date-input"
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              />
            </div>

            <div>
              <label
                htmlFor="end-date-input"
                className="block text-sm font-medium text-gray-900"
              >
                End Date
              </label>
              <input
                id="end-date-input"
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              />
            </div>

            <div>
              <label id="songs-list-label" className="block text-sm font-medium text-gray-900">
                Songs
              </label>
              <div
                aria-labelledby="songs-list-label"
                role="group"
                className="mt-2 max-h-44 overflow-y-auto rounded-md border border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              >
                {songs.map((song) => (
                  <label
                    key={song.id}
                    className="flex items-center gap-2 border-b px-3 py-2 text-sm text-gray-900 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSongs.includes(song.id)}
                      onChange={() => toggleSong(song.id)}
                      className="rounded border-gray-300 text-black focus:ring-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    />
                    <span>{song.title}</span>
                  </label>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-700 font-medium">
                Selected songs: {selectedCount}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void fetchSalesData()}
            className="mt-4 rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            Refresh Report
          </button>
        </section>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-red-800 font-medium"
          >
            {error}
          </div>
        )}

        {metrics && (
          <section className="mt-8 grid gap-4 md:grid-cols-4" aria-label="Metrics Overview">
            <MetricCard label="Total Sales" value={metrics.totalSales.toString()} />
            <MetricCard label="Total Revenue" value={money(metrics.totalRevenueCents)} icon={<TrendingUp size={18} />} />
            <MetricCard label="Your Royalty" value={money(metrics.totalRoyaltyCents)} highlight />
            <MetricCard label="Average Rating" value={`${metrics.averageRating} / 5`} icon={<Star size={18} />} />
          </section>
        )}

        {loading ? (
          <div role="status" aria-live="polite" className="mt-8 rounded-2xl border bg-white p-8 text-center text-gray-700 font-medium">
            Loading sales data...
          </div>
        ) : salesData?.aggregated.length === 0 ? (
          <div role="status" aria-live="polite" className="mt-8 rounded-2xl border bg-white p-8 text-center text-gray-700 font-medium">
            No sales data found for the filters you selected.
          </div>
        ) : (
          <section className="mt-8 overflow-hidden rounded-2xl border bg-white shadow-sm" aria-label="Detailed Sales Breakdown">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <caption className="sr-only">Aggregated song performance breakdown statement</caption>
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th scope="col" className="px-5 py-3 text-left text-sm font-semibold text-gray-900"><span className="sr-only">Actions</span></th>
                    <th scope="col" className="px-5 py-3 text-left text-sm font-semibold text-gray-900">Song</th>
                    <th scope="col" className="px-5 py-3 text-center text-sm font-semibold text-gray-900">Sales</th>
                    <th scope="col" className="px-5 py-3 text-center text-sm font-semibold text-gray-900">Reviews</th>
                    <th scope="col" className="px-5 py-3 text-center text-sm font-semibold text-gray-900">Rating</th>
                    <th scope="col" className="px-5 py-3 text-right text-sm font-semibold text-gray-900">Revenue</th>
                    <th scope="col" className="px-5 py-3 text-right text-sm font-semibold text-gray-900">Royalty</th>
                  </tr>
                </thead>

                <tbody>
                  {salesData?.aggregated.map((song) => {
                    const isExpanded = expandedRows.has(song.songId);
                    return (
                      <Fragment key={song.songId}>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() => toggleRow(song.songId)}
                              className="text-gray-700 transition hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded"
                              aria-label={isExpanded ? `Hide purchase details for ${song.songTitle}` : `View purchase details for ${song.songTitle}`}
                              aria-expanded={isExpanded}
                            >
                              <ChevronDown
                                size={18}
                                className={isExpanded ? "rotate-180 transition-transform" : "transition-transform"}
                              />
                            </button>
                          </td>
                          <td className="px-5 py-4 text-sm font-medium text-gray-900">{song.songTitle}</td>
                          <td className="px-5 py-4 text-center text-sm text-gray-900">{song.salesCount}</td>
                          <td className="px-5 py-4 text-center text-sm text-gray-900">{song.reviewCount}</td>
                          <td className="px-5 py-4 text-center text-sm text-gray-900">
                            {song.averageRating > 0 ? song.averageRating : "-"}
                          </td>
                          <td className="px-5 py-4 text-right text-sm text-gray-900">{money(song.totalRevenueCents)}</td>
                          <td className="px-5 py-4 text-right text-sm font-semibold text-green-700">
                            {money(song.royaltyAmountCents)}
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr className="border-b bg-gray-50">
                            <td colSpan={7} className="px-5 py-4">
                              <div className="rounded-xl border border-gray-200 bg-white p-4">
                                <h3 className="text-sm font-semibold text-gray-900">Purchase historical line logs</h3>
                                <div className="mt-4 overflow-x-auto">
                                  <table className="w-full text-sm border-collapse">
                                    <caption className="sr-only">{`Individual orders breakdown for ${song.songTitle}`}</caption>
                                    <thead>
                                      <tr className="border-b text-left text-gray-900 font-semibold">
                                        <th scope="col" className="px-3 py-2">Buyer</th>
                                        <th scope="col" className="px-3 py-2">Email</th>
                                        <th scope="col" className="px-3 py-2">Date</th>
                                        <th scope="col" className="px-3 py-2 text-right">Amount</th>
                                        <th scope="col" className="px-3 py-2 text-right">Royalty</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {song.purchases.map((purchase) => (
                                        <tr key={purchase.purchaseId} className="border-b last:border-b-0">
                                          <td className="px-3 py-2 text-gray-900">{purchase.buyerName || "-"}</td>
                                          <td className="px-3 py-2 text-gray-900">{purchase.buyerEmail}</td>
                                          <td className="px-3 py-2 text-gray-900">
                                            {new Date(purchase.purchasedAt).toLocaleDateString()}
                                          </td>
                                          <td className="px-3 py-2 text-right text-gray-900">{money(purchase.amountCents)}</td>
                                          <td className="px-3 py-2 text-right text-green-700 font-semibold">
                                            {money(purchase.royaltyAmountCents)}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
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
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${highlight ? "border-green-300 bg-green-50" : "bg-white border-gray-200"}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`text-sm font-semibold ${highlight ? "text-green-800" : "text-gray-900"}`}>{label}</p>
          <p className={`mt-2 text-2xl font-bold ${highlight ? "text-green-800" : "text-gray-900"}`}>{value}</p>
        </div>
        {icon && <div className={highlight ? "text-green-700" : "text-gray-500"} aria-hidden="true">{icon}</div>}
      </div>
    </div>
  );
}