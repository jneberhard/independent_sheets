export function convertToCSV(data: any[], headers: string[]): string {
  const headerRow = headers.join(',');
  const rows = data.map(item =>
    headers.map(header => {
      const value = item[header];
      if (value === null || value === undefined) return '';
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  );
  return [headerRow, ...rows].join('\n');
}

export function downloadCSV(data: any[], headers: string[], filename: string) {
  const csv = convertToCSV(data, headers);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function formatRoyaltyExport(royalties: any[]) {
  return royalties.map(r => ({
    'Purchase ID': r.purchaseId,
    'Sheet Music': r.sheetMusicTitle,
    'Publisher': r.publisherName,
    'Buyer': r.buyerName,
    'Total Amount': `$${r.totalAmount.toFixed(2)}`,
    'Artist Amount': `$${r.artistAmount.toFixed(2)}`,
    'Platform Amount': `$${r.platformAmount.toFixed(2)}`,
    'Date': new Date(r.createdAt).toLocaleDateString()
  }));
}

export function formatPayoutExport(payouts: any[]) {
  return payouts.map(p => ({
    'Publisher': p.publisherName,
    'Publisher Email': p.publisherEmail,
    'Total Amount': `$${p.totalAmount.toFixed(2)}`,
    'Transactions': p.transactionCount,
    'Status': p.status,
    'Payment Method': p.preferredPaymentMethod || 'N/A',
    'PayPal Email': p.paypalEmail || 'N/A'
  }));
}

export function formatContractExport(contracts: any[]) {
  return contracts.map(c => ({
    'Publisher': c.publisherName,
    'Publisher Email': c.publisherEmail,
    'Royalty %': c.royaltyPercent,
    'Platform %': c.platformPercent,
    'Start Date': new Date(c.startDate).toLocaleDateString(),
    'End Date': c.endDate ? new Date(c.endDate).toLocaleDateString() : 'Active',
    'Status': c.isActive ? 'Active' : 'Expired',
    'Payment Method': c.paymentMethod || 'N/A'
  }));
}
