export function exportSummaryCsv(
  aggregatedSales: Array<{
    songTitle: string;
    salesCount: number;
    totalRevenueCents: number;
    royaltyAmountCents: number;
    platformAmountCents: number;
  }>,
  filename: string = "sales_summary.csv"
) {
  const headers = ["Song Title", "# Sales", "Total Revenue", "Royalty Amount", "Platform Amount"];
  const rows = aggregatedSales.map((sale) => [
    escapeCSV(sale.songTitle),
    sale.salesCount.toString(),
    formatCents(sale.totalRevenueCents),
    formatCents(sale.royaltyAmountCents),
    formatCents(sale.platformAmountCents),
  ]);

  downloadCsv(headers, rows, filename);
}

export function exportDetailedCsv(
  detailedSales: Array<{
    songTitle: string;
    buyerEmail: string;
    buyerName: string | null;
    amountCents: number;
    purchasedAt: Date;
    royaltyAmountCents: number;
    platformAmountCents: number;
  }>,
  filename: string = "sales_detailed.csv"
) {
  const headers = [
    "Song Title",
    "Buyer Email",
    "Buyer Name",
    "Purchase Date",
    "Sale Amount",
    "Royalty Portion",
    "Platform Portion",
  ];

  const rows = detailedSales.map((sale) => [
    escapeCSV(sale.songTitle),
    escapeCSV(sale.buyerEmail),
    escapeCSV(sale.buyerName || ""),
    new Date(sale.purchasedAt).toISOString().split("T")[0],
    formatCents(sale.amountCents),
    formatCents(sale.royaltyAmountCents),
    formatCents(sale.platformAmountCents),
  ]);

  downloadCsv(headers, rows, filename);
}

function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function formatCents(cents: number): string {
  return (cents / 100).toFixed(2);
}

function downloadCsv(headers: string[], rows: string[][], filename: string) {
  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
