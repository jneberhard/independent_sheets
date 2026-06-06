export function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function calculateSplit(totalCents: number, royaltyPercent: number = 75) {
  const artistAmount = Math.round(totalCents * (royaltyPercent / 100));
  const platformAmount = totalCents - artistAmount;
  return { artistAmount, platformAmount };
}

export function aggregateByPeriod(
  royalties: any[],
  periodType: 'day' | 'week' | 'month' | 'year' = 'month'
) {
  const grouped: Record<string, number> = {};

  royalties.forEach(royalty => {
    const date = new Date(royalty.createdAt);
    let key = '';

    switch (periodType) {
      case 'day':
        key = date.toISOString().split('T')[0];
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      case 'year':
        key = String(date.getFullYear());
        break;
    }

    grouped[key] = (grouped[key] || 0) + (royalty.artistAmount + royalty.platformAmount);
  });

  return Object.entries(grouped)
    .map(([period, amount]) => ({
      period,
      totalRevenue: amount / 100,
      artistPayout: (amount * 0.75) / 100,
      platformRevenue: (amount * 0.25) / 100
    }))
    .sort((a, b) => a.period.localeCompare(b.period));
}

export function getTopPerformers(royalties: any[], limit: number = 10) {
  const performerMap = new Map<string, any>();

  royalties.forEach(royalty => {
    const key = royalty.purchase.sheetMusic.id;
    if (!performerMap.has(key)) {
      performerMap.set(key, {
        sheetMusicId: key,
        title: royalty.purchase.sheetMusic.title,
        sales: 0,
        totalRevenue: 0,
        artistEarnings: 0
      });
    }

    const performer = performerMap.get(key)!;
    performer.sales += 1;
    performer.totalRevenue += royalty.purchase.amountCents;
    performer.artistEarnings += royalty.artistAmount;
  });

  return Array.from(performerMap.values())
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, limit)
    .map(item => ({
      ...item,
      totalRevenue: item.totalRevenue / 100,
      artistEarnings: item.artistEarnings / 100
    }));
}

export function calculateMetrics(royalties: any[]) {
  if (royalties.length === 0) {
    return {
      totalRevenue: 0,
      averageTransaction: 0,
      totalTransactions: 0,
      totalArtistPayouts: 0,
      totalPlatformRevenue: 0
    };
  }

  const totalArtistAmount = royalties.reduce((sum, r) => sum + r.artistAmount, 0);
  const totalPlatformAmount = royalties.reduce((sum, r) => sum + r.platformAmount, 0);
  const totalRevenue = totalArtistAmount + totalPlatformAmount;

  return {
    totalRevenue: totalRevenue / 100,
    averageTransaction: totalRevenue / royalties.length / 100,
    totalTransactions: royalties.length,
    totalArtistPayouts: totalArtistAmount / 100,
    totalPlatformRevenue: totalPlatformAmount / 100
  };
}
