'use client';

import { DollarSign, TrendingUp, Wallet } from 'lucide-react';

interface EarningsSummaryProps {
  totalRevenue: number;
  totalArtistPayouts: number;
  totalPlatformRevenue: number;
  totalTransactions: number;
  activeContracts: number;
}

export function EarningsSummary({
  totalRevenue,
  totalArtistPayouts,
  totalPlatformRevenue,
  totalTransactions,
  activeContracts
}: EarningsSummaryProps) {
  const cards = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-primary'
    },
    {
      title: 'Artist Payouts',
      value: `$${totalArtistPayouts.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-accent'
    },
    {
      title: 'Platform Revenue',
      value: `$${totalPlatformRevenue.toFixed(2)}`,
      icon: Wallet,
      color: 'text-secondary'
    },
    {
      title: 'Transactions',
      value: totalTransactions.toString(),
      icon: DollarSign,
      color: 'text-primary'
    },
    {
      title: 'Active Contracts',
      value: activeContracts.toString(),
      icon: TrendingUp,
      color: 'text-accent'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="p-4 bg-card rounded-lg border border-secondary/20 hover:border-secondary/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-secondary mb-2">{card.title}</p>
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
              </div>
              <Icon className={`w-5 h-5 ${card.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
