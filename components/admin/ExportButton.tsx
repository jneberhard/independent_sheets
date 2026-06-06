'use client';

import { Download } from 'lucide-react';
import { downloadCSV, formatRoyaltyExport, formatPayoutExport, formatContractExport } from '@/lib/admin/exportUtils';

interface ExportButtonProps {
  data: any[];
  filename: string;
  dataType: 'royalties' | 'payouts' | 'contracts';
}

export function ExportButton({ data, filename, dataType }: ExportButtonProps) {
  const handleExport = () => {
    let exportData = data;

    switch (dataType) {
      case 'royalties':
        exportData = formatRoyaltyExport(data);
        break;
      case 'payouts':
        exportData = formatPayoutExport(data);
        break;
      case 'contracts':
        exportData = formatContractExport(data);
        break;
    }

    const headers = Object.keys(exportData[0] || {});
    downloadCSV(exportData, headers, `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <button
      onClick={handleExport}
      disabled={data.length === 0}
      className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
    >
      <Download className="w-4 h-4" />
      Export CSV
    </button>
  );
}
