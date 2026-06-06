'use client';

import { Edit2, ChevronRight } from 'lucide-react';

interface ContractRecord {
  id: string;
  publisherId: string;
  publisherName: string;
  publisherEmail: string;
  royaltyPercent: number;
  platformPercent: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  paymentMethod?: string;
  paypalEmail?: string;
}

interface ContractTableProps {
  contracts: ContractRecord[];
  isLoading?: boolean;
  onEditContract: (contract: ContractRecord) => void;
}

export function ContractTable({
  contracts,
  isLoading = false,
  onEditContract
}: ContractTableProps) {
  if (isLoading) {
    return (
      <div className="p-8 text-center text-secondary">
        Loading contracts...
      </div>
    );
  }

  if (contracts.length === 0) {
    return (
      <div className="p-8 text-center text-secondary">
        No contracts found.
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
            <th className="px-4 py-3 text-center font-medium text-secondary">Royalty %</th>
            <th className="px-4 py-3 text-center font-medium text-secondary">Platform %</th>
            <th className="px-4 py-3 text-left font-medium text-secondary">Start Date</th>
            <th className="px-4 py-3 text-left font-medium text-secondary">End Date</th>
            <th className="px-4 py-3 text-center font-medium text-secondary">Status</th>
            <th className="px-4 py-3 text-center font-medium text-secondary">Action</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract) => (
            <tr
              key={contract.id}
              className="border-b border-secondary/10 hover:bg-secondary/5 transition-colors"
            >
              <td className="px-4 py-3 text-foreground font-medium">
                {contract.publisherName}
              </td>
              <td className="px-4 py-3 text-secondary">{contract.publisherEmail}</td>
              <td className="px-4 py-3 text-center text-accent font-medium">
                {contract.royaltyPercent.toFixed(1)}%
              </td>
              <td className="px-4 py-3 text-center text-primary font-medium">
                {contract.platformPercent.toFixed(1)}%
              </td>
              <td className="px-4 py-3 text-secondary">
                {new Date(contract.startDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-secondary">
                {contract.endDate
                  ? new Date(contract.endDate).toLocaleDateString()
                  : 'Ongoing'}
              </td>
              <td className="px-4 py-3 text-center">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    contract.isActive
                      ? 'bg-accent/10 text-accent'
                      : 'bg-secondary/10 text-secondary'
                  }`}
                >
                  {contract.isActive ? 'Active' : 'Expired'}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => onEditContract(contract)}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-primary hover:bg-primary/10 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
