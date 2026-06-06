'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RoyaltyRecord {
  id: string;
  purchaseId: string;
  sheetMusicTitle: string;
  publisherName: string;
  buyerName: string;
  totalAmount: number;
  artistAmount: number;
  platformAmount: number;
  createdAt: string;
}

interface RoyaltyTableProps {
  royalties: RoyaltyRecord[];
  isLoading?: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function RoyaltyTable({
  royalties,
  isLoading = false,
  page,
  pageSize,
  total,
  onPageChange
}: RoyaltyTableProps) {
  const totalPages = Math.ceil(total / pageSize);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-secondary">
        Loading royalties...
      </div>
    );
  }

  if (royalties.length === 0) {
    return (
      <div className="p-8 text-center text-secondary">
        No royalties found for the selected filters.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border border-secondary/20 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-secondary/5 border-b border-secondary/20">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-secondary">Sheet Music</th>
              <th className="px-4 py-3 text-left font-medium text-secondary">Publisher</th>
              <th className="px-4 py-3 text-left font-medium text-secondary">Buyer</th>
              <th className="px-4 py-3 text-right font-medium text-secondary">Total</th>
              <th className="px-4 py-3 text-right font-medium text-secondary">Artist</th>
              <th className="px-4 py-3 text-right font-medium text-secondary">Platform</th>
              <th className="px-4 py-3 text-left font-medium text-secondary">Date</th>
            </tr>
          </thead>
          <tbody>
            {royalties.map((royalty) => (
              <tr
                key={royalty.id}
                className="border-b border-secondary/10 hover:bg-secondary/5 transition-colors"
              >
                <td className="px-4 py-3 text-foreground font-medium max-w-xs truncate">
                  {royalty.sheetMusicTitle}
                </td>
                <td className="px-4 py-3 text-foreground">{royalty.publisherName}</td>
                <td className="px-4 py-3 text-secondary">{royalty.buyerName}</td>
                <td className="px-4 py-3 text-right text-foreground font-medium">
                  ${royalty.totalAmount.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right text-accent">
                  ${royalty.artistAmount.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right text-primary">
                  ${royalty.platformAmount.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-secondary">
                  {new Date(royalty.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-secondary">
            Page {page} of {totalPages} ({total} total)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-2 rounded-md border border-secondary/20 text-secondary hover:bg-secondary/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-2 rounded-md border border-secondary/20 text-secondary hover:bg-secondary/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
