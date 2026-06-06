import { getCurrentUser } from '@/lib/currentUser';
import { redirect } from 'next/navigation';
import PayoutManagementClient from '@/components/admin/PayoutManagementClient';

export default async function PayoutManagementPage() {
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Payout Management</h1>
          <p className="text-secondary">Track and manage publisher payments</p>
        </div>

        <PayoutManagementClient />
      </div>
    </div>
  );
}
