'use client';

import { useState, useEffect } from 'react';
import { PayoutTable } from '@/components/admin/PayoutTable';
import { ExportButton } from '@/components/admin/ExportButton';
import { DateRangeFilter } from '@/components/admin/DateRangeFilter';

interface PayoutData {
  data: any[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    pages: number;
  };
}

export default function PayoutManagementClient() {
  const [payouts, setPayouts] = useState<PayoutData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [statusFilter, setStatusFilter] = useState<'pending' | 'paid' | 'failed' | 'all'>('all');

  const fetchPayouts = async () => {
    setIsLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: '50'
      });

      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (dateRange.startDate) params.append('startDate', dateRange.startDate);
      if (dateRange.endDate) params.append('endDate', dateRange.endDate);

      const res = await fetch(`/api/admin/payouts?${params}`);
      if (!res.ok) throw new Error('Failed to fetch payouts');
      const data = await res.json();
      setPayouts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load payouts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, [page, statusFilter, dateRange]);

  const handleUpdateStatus = async (publisherId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/payouts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publisherId, status: newStatus })
      });

      if (!res.ok) throw new Error('Failed to update payout status');
      fetchPayouts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update payout');
    }
  };

  const handleDateChange = (startDate: string, endDate: string) => {
    setDateRange({ startDate, endDate });
    setPage(1);
  };

  const pendingCount = payouts?.data.filter(p => p.status === 'pending').length || 0;
  const paidCount = payouts?.data.filter(p => p.status === 'paid').length || 0;
  const failedCount = payouts?.data.filter(p => p.status === 'failed').length || 0;

  return (
    <div className="space-y-6">
      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-card rounded-lg border border-secondary/20">
          <p className="text-sm text-secondary mb-1">Pending</p>
          <p className="text-2xl font-bold text-secondary">{pendingCount}</p>
        </div>
        <div className="p-4 bg-card rounded-lg border border-secondary/20">
          <p className="text-sm text-accent mb-1">Paid</p>
          <p className="text-2xl font-bold text-accent">{paidCount}</p>
        </div>
        <div className="p-4 bg-card rounded-lg border border-secondary/20">
          <p className="text-sm text-primary mb-1">Failed</p>
          <p className="text-2xl font-bold text-primary">{failedCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DateRangeFilter
          onDateChange={handleDateChange}
          defaultStartDate={dateRange.startDate}
          defaultEndDate={dateRange.endDate}
        />

        <div className="flex flex-col gap-4 p-4 bg-card rounded-lg border border-secondary/20">
          <label className="block text-sm font-medium text-foreground">Status Filter</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setPage(1);
            }}
            className="px-3 py-2 border border-secondary/20 rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-md bg-primary/10 text-primary">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Publisher Payouts</h2>
        {payouts && payouts.data.length > 0 && (
          <ExportButton
            data={payouts.data}
            filename="payouts-report"
            dataType="payouts"
          />
        )}
      </div>

      {payouts && (
        <PayoutTable
          payouts={payouts.data}
          isLoading={isLoading}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}
