'use client';

import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface PayoutRecord {
  publisherId: string;
  publisherName: string;
  publisherEmail: string;
  totalAmount: number;
  transactionCount: number;
  status: 'pending' | 'paid' | 'failed';
  paypalEmail?: string;
  preferredPaymentMethod?: string;
}

interface PayoutTableProps {
  payouts: PayoutRecord[];
  isLoading?: boolean;
  onUpdateStatus: (publisherId: string, newStatus: string) => void;
}

export function PayoutTable({
  payouts,
  isLoading = false,
  onUpdateStatus
}: PayoutTableProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-accent" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-primary" />;
      default:
        return <Clock className="w-4 h-4 text-secondary" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-accent/10 text-accent';
      case 'failed':
        return 'bg-primary/10 text-primary';
      default:
        return 'bg-secondary/10 text-secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-secondary">
        Loading payouts...
      </div>
    );
  }

  if (payouts.length === 0) {
    return (
      <div className="p-8 text-center text-secondary">
        No payouts found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-secondary/20 rounded-lg">
      <table className="w-full text-sm">
        <thead className="bg-secondary/5 border-b border-secondary/20">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-secondary">Publisher</th>
            <th className="px-4 py-3 text-left font-medium text-secondary">Email</th>
            <th className="px-4 py-3 text-right font-medium text-secondary">Amount</th>
            <th className="px-4 py-3 text-center font-medium text-secondary">Transactions</th>
            <th className="px-4 py-3 text-left font-medium text-secondary">Payment Method</th>
            <th className="px-4 py-3 text-center font-medium text-secondary">Status</th>
            <th className="px-4 py-3 text-center font-medium text-secondary">Action</th>
          </tr>
        </thead>
        <tbody>
          {payouts.map((payout) => (
            <tr
              key={payout.publisherId}
              className="border-b border-secondary/10 hover:bg-secondary/5 transition-colors"
            >
              <td className="px-4 py-3 text-foreground font-medium">
                {payout.publisherName}
              </td>
              <td className="px-4 py-3 text-secondary">{payout.publisherEmail}</td>
              <td className="px-4 py-3 text-right text-foreground font-bold">
                ${payout.totalAmount.toFixed(2)}
              </td>
              <td className="px-4 py-3 text-center text-secondary">
                {payout.transactionCount}
              </td>
              <td className="px-4 py-3 text-secondary text-xs">
                {payout.preferredPaymentMethod === 'paypal' && payout.paypalEmail
                  ? payout.paypalEmail
                  : payout.preferredPaymentMethod || 'N/A'}
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  {getStatusIcon(payout.status)}
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      payout.status
                    )}`}
                  >
                    {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-center">
                <select
                  value={payout.status}
                  onChange={(e) => onUpdateStatus(payout.publisherId, e.target.value)}
                  className="px-2 py-1 rounded-md border border-secondary/20 bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
