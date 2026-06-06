'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { ContractTable } from '@/components/admin/ContractTable';
import { ContractForm } from '@/components/admin/ContractForm';
import { ExportButton } from '@/components/admin/ExportButton';

interface ContractData {
  data: any[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    pages: number;
  };
}

export default function ContractManagementClient() {
  const [contracts, setContracts] = useState<ContractData | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingContract, setEditingContract] = useState<any | null>(null);
  const [page, setPage] = useState(1);

  const fetchContracts = async () => {
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/contracts?page=${page}&pageSize=50`);
      if (!res.ok) throw new Error('Failed to fetch contracts');
      const data = await res.json();
      setContracts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load contracts');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  useEffect(() => {
    fetchContracts();
    fetchUsers();
  }, [page]);

  const handleCreateContract = async (data: any) => {
    try {
      const method = editingContract ? 'PUT' : 'POST';
      const url = editingContract
        ? `/api/admin/contracts/${editingContract.id}`
        : '/api/admin/contracts';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error('Failed to save contract');

      setShowForm(false);
      setEditingContract(null);
      fetchContracts();
    } catch (err) {
      throw err;
    }
  };

  const handleEditContract = (contract: any) => {
    setEditingContract(contract);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-foreground">Active Contracts</h2>
          <p className="text-secondary text-sm">
            {contracts?.pagination.total || 0} total contracts
          </p>
        </div>

        <div className="flex items-center gap-2">
          {contracts && contracts.data.length > 0 && (
            <ExportButton
              data={contracts.data}
              filename="contracts-report"
              dataType="contracts"
            />
          )}
          <button
            onClick={() => {
              setEditingContract(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            New Contract
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-md bg-primary/10 text-primary">
          {error}
        </div>
      )}

      {contracts && (
        <ContractTable
          contracts={contracts.data}
          isLoading={isLoading}
          onEditContract={handleEditContract}
        />
      )}

      {showForm && (
        <ContractForm
          users={users}
          onSubmit={handleCreateContract}
          onCancel={() => {
            setShowForm(false);
            setEditingContract(null);
          }}
          initialData={editingContract}
        />
      )}
    </div>
  );
}
