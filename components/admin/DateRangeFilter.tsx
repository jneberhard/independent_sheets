'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';

interface DateRangeFilterProps {
  onDateChange: (startDate: string, endDate: string) => void;
  defaultStartDate?: string;
  defaultEndDate?: string;
}

export function DateRangeFilter({
  onDateChange,
  defaultStartDate = '',
  defaultEndDate = ''
}: DateRangeFilterProps) {
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    onDateChange(newStartDate, endDate);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    onDateChange(startDate, newEndDate);
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    onDateChange('', '');
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-card rounded-lg border border-secondary/20">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-secondary" />
        <h3 className="font-medium text-foreground">Date Range</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-secondary mb-2">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            className="w-full px-3 py-2 border border-secondary/20 rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div>
          <label className="block text-sm text-secondary mb-2">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            className="w-full px-3 py-2 border border-secondary/20 rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {(startDate || endDate) && (
        <button
          onClick={handleReset}
          className="w-full px-3 py-2 text-sm bg-secondary/10 text-secondary rounded-md hover:bg-secondary/20 transition-colors"
        >
          Clear Dates
        </button>
      )}
    </div>
  );
}
