'use client';

import { useState, useEffect } from 'react';
import { EarningsSummary } from '@/components/admin/EarningsSummary';
import { DateRangeFilter } from '@/components/admin/DateRangeFilter';
import { RoyaltyTable } from '@/components/admin/RoyaltyTable';
import { PayoutTable } from '@/components/admin/PayoutTable';
import { ExportButton } from '@/components/admin/ExportButton';

interface RoyaltyData {
  data: any[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    pages: number;
  };
}

interface SummaryData {
  summary: {
    totalRevenue: number;
    totalArtistPayouts: number;
    totalPlatformRevenue: number;
    totalTransactions: number;
    activeContracts: number;
    royaltyPercentage: number;
    platformPercentage: number;
  };
}

interface PayoutData {
  data: any[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    pages: number;
  };
}

export default function RoyaltyReportsClient() {
  const [activeTab, setActiveTab] = useState<'summary' | 'sales' | 'payouts'>('summary');
  const [royalties, setRoyalties] = useState<RoyaltyData | null>(null);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [payouts, setPayouts] = useState<PayoutData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [royaltiesPage, setRoyaltiesPage] = useState(1);
  const [payoutsPage, setPayoutsPage] = useState(1);

  const fetchData = async () => {
    setIsLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        page: royaltiesPage.toString(),
        pageSize: '50'
      });

      if (dateRange.startDate) params.append('startDate', dateRange.startDate);
      if (dateRange.endDate) params.append('endDate', dateRange.endDate);

      const [royaltiesRes, summaryRes, payoutsRes] = await Promise.all([
        fetch(`/api/admin/royalties?${params}`),
        fetch(
          `/api/admin/royalties-summary?${new URLSearchParams(
            dateRange.startDate || dateRange.endDate ? dateRange : {}
          )}`
        ),
        fetch(`/api/admin/payouts?page=${payoutsPage}&pageSize=50`)
      ]);

      if (!royaltiesRes.ok || !summaryRes.ok || !payoutsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const royaltiesData = await royaltiesRes.json();
      const summaryData = await summaryRes.json();
      const payoutsData = await payoutsRes.json();

      setRoyalties(royaltiesData);
      setSummary(summaryData);
      setPayouts(payoutsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange, royaltiesPage, payoutsPage]);

  const handleDateChange = (startDate: string, endDate: string) => {
    setDateRange({ startDate, endDate });
    setRoyaltiesPage(1);
  };

  const tabs = [
    { id: 'summary', label: 'Summary' },
    { id: 'sales', label: 'Sales History' },
    { id: 'payouts', label: 'Payout History' }
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-secondary/20">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-primary border-b-2 border-primary -mb-[2px]'
                : 'text-secondary hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-md bg-primary/10 text-primary">
          {error}
        </div>
      )}

      {/* Summary Tab */}
      {activeTab === 'summary' && summary && (
        <div className="space-y-6">
          <EarningsSummary
            totalRevenue={summary.summary.totalRevenue}
            totalArtistPayouts={summary.summary.totalArtistPayouts}
            totalPlatformRevenue={summary.summary.totalPlatformRevenue}
            totalTransactions={summary.summary.totalTransactions}
            activeContracts={summary.summary.activeContracts}
          />
        </div>
      )}

      {/* Sales History Tab */}
      {activeTab === 'sales' && (
        <div className="space-y-6">
          <DateRangeFilter
            onDateChange={handleDateChange}
            defaultStartDate={dateRange.startDate}
            defaultEndDate={dateRange.endDate}
          />

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Sales Transactions</h2>
            {royalties && royalties.data.length > 0 && (
              <ExportButton
                data={royalties.data}
                filename="royalties-report"
                dataType="royalties"
              />
            )}
          </div>

          {royalties && (
            <RoyaltyTable
              royalties={royalties.data}
              isLoading={isLoading}
              page={royaltiesPage}
              pageSize={royalties.pagination.pageSize}
              total={royalties.pagination.total}
              onPageChange={setRoyaltiesPage}
            />
          )}
        </div>
      )}

      {/* Payouts Tab */}
      {activeTab === 'payouts' && (
        <div className="space-y-6">
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
              onUpdateStatus={async (publisherId, status) => {
                try {
                  const res = await fetch('/api/admin/payouts', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ publisherId, status })
                  });

                  if (res.ok) {
                    fetchData();
                  }
                } catch (err) {
                  console.error('Failed to update payout status:', err);
                }
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
