'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface ContractFormProps {
  users: Array<{ id: string; email: string; firstName?: string; lastName?: string }>;
  onSubmit: (data: {
    artistId: string;
    royaltyPercent: number;
    startDate: string;
    endDate?: string;
  }) => Promise<void>;
  onCancel: () => void;
  initialData?: {
    id: string;
    publisherId: string;
    royaltyPercent: number;
    startDate: string;
    endDate?: string;
  };
}

export function ContractForm({
  users,
  onSubmit,
  onCancel,
  initialData
}: ContractFormProps) {
  const [formData, setFormData] = useState({
    artistId: initialData?.publisherId || '',
    royaltyPercent: initialData?.royaltyPercent || 75,
    startDate: initialData?.startDate?.split('T')[0] || '',
    endDate: initialData?.endDate?.split('T')[0] || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'royaltyPercent' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.artistId || !formData.startDate) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.royaltyPercent < 0 || formData.royaltyPercent > 100) {
      setError('Royalty percent must be between 0 and 100');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        artistId: formData.artistId,
        royaltyPercent: formData.royaltyPercent,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save contract');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-lg max-w-md w-full p-6 border border-secondary/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">
            {initialData ? 'Edit Contract' : 'New Contract'}
          </h2>
          <button
            onClick={onCancel}
            className="text-secondary hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Publisher *
            </label>
            <select
              name="artistId"
              value={formData.artistId}
              onChange={handleChange}
              disabled={!!initialData}
              className="w-full px-3 py-2 border border-secondary/20 rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
            >
              <option value="">Select a publisher</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Royalty Percentage *
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                name="royaltyPercent"
                min="0"
                max="100"
                value={formData.royaltyPercent}
                onChange={handleChange}
                className="flex-1"
              />
              <span className="text-foreground font-medium w-12 text-center">
                {formData.royaltyPercent.toFixed(1)}%
              </span>
            </div>
            <p className="text-xs text-secondary mt-1">
              Platform gets {(100 - formData.royaltyPercent).toFixed(1)}%
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Start Date *
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-secondary/20 rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              End Date (optional)
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-secondary/20 rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <p className="text-xs text-secondary mt-1">
              Leave empty for ongoing contracts
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-md bg-primary/10 text-primary text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 rounded-md border border-secondary/20 text-secondary hover:bg-secondary/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-colors font-medium"
            >
              {isSubmitting ? 'Saving...' : 'Save Contract'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
