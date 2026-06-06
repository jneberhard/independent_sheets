import { getCurrentUser } from '@/lib/currentUser';
import { redirect } from 'next/navigation';
import ContractManagementClient from '@/components/admin/ContractManagementClient';

export default async function ContractManagementPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  if (user.role.name !== 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Contract Management</h1>
          <p className="text-secondary">Manage publisher contracts and royalty agreements</p>
        </div>

        <ContractManagementClient />
      </div>
    </div>
  );
}
