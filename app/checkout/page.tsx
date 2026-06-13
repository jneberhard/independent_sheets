'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/lib/auth/client';
import { User, Phone, MapPin, CreditCard, ArrowLeft } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  payment: string;
}

interface OrderPayload {
  items: Array<{ id: string; quantity: number; price: number }>;
  total: number;
  customer: CheckoutFormData & { userId: string };
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: sessionData, isPending: sessionLoading } = authClient.useSession();
  const { cart, clearCart, isHydrated } = useCart();

  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    stateProvince: '',
    postalCode: '',
    payment: 'card',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // 💡 Performance Optimization: Memoize standard pricing sums
  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const fetchProfile = useCallback(async () => {
    const userId = sessionData?.session?.userId;
    if (!userId) return;

    try {
      const response = await fetch(`/api/profile?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to query database profile');

      const profileData = await response.json();

      if (profileData.success && profileData.user) {
        const u = profileData.user;
        setFormData(prev => ({
          ...prev,
          firstName: u.firstName ?? "",
          lastName: u.lastName ?? "",
          phoneNumber: u.phoneNumber ?? "",
          addressLine1: u.addressLine1 ?? "",
          addressLine2: u.addressLine2 ?? "",
          city: u.city ?? "",
          stateProvince: u.stateProvince ?? "",
          postalCode: u.postalCode ?? "",
          payment: "card",
        }));
      }
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError('Could not download your saved address profile. Fields are open for manual entry.');
    } finally {
      if (loading) { setLoading(false); }
    }
  }, [sessionData?.session?.userId, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.phoneNumber.trim() ||
      !formData.addressLine1.trim() ||
      !formData.city.trim() ||
      !formData.stateProvince.trim() ||
      !formData.postalCode.trim()
    ) {
      setError('Please fill in all required fields');
      setSaving(false);
      return;
    }

    const userId = sessionData?.session?.userId;
    if (!userId) {
      setError('User session expired. Please sign in again.');
      setSaving(false);
      return;
    }

    try {
      const profileResponse = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          stateProvince: formData.stateProvince,
          postalCode: formData.postalCode,
        }),
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to update profile information');
      }

      // 💡 Bug Fix: Simplified object data assignments matching standard cart variables
      const orderData: OrderPayload = {
        items: cart.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        total: total,
        customer: {
          ...formData,
          userId,
        }
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to place order');
      }

      setSuccess(true);
      clearCart();

      setTimeout(() => {
        router.push(`/order-success/${result.orderId}`);
      }, 1500);

    } catch (err) {
      console.error('Error placing order:', err);
      setError(err instanceof Error ? err.message : 'Failed to place order');
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (sessionLoading) return;

    const layoutToken = setTimeout(() => {
      if (!sessionData?.session) {
        router.push('/auth/sign-in');
      } else if (sessionData?.session?.userId) {
        fetchProfile();
      }
    }, 0);

    return () => clearTimeout(layoutToken);
  }, [sessionData, sessionLoading, sessionData?.session?.userId, fetchProfile, router]);

  useEffect(() => {
    if (isHydrated && cart.length === 0 && !success) {
      router.push('/cart');
    }
  }, [cart, isHydrated, success, router]);

  if (sessionLoading || (loading && sessionData?.session)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[var(--background)]" role="status">
        <p className="text-sm font-medium animate-pulse text-[var(--foreground)] opacity-70">
          Loading secure checkout gateway...
        </p>
      </div>
    );
  }

  if (!sessionData?.session || cart.length === 0) return null;

  return (
    <main className="min-h-screen bg-[var(--background)] py-6 text-[var(--foreground)]">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 font-bold transition duration-200 text-[var(--primary)] hover:opacity-70 focus-visible:outline-none focus-visible:underline rounded"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Cart
          </Link>
        </div>

        <div className="bg-[var(--card)] rounded-2xl border border-[var(--secondary)] border-opacity-30 shadow-sm p-6 sm:p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-black mb-2">Checkout</h1>
            <p className="text-sm opacity-80">
              Review your billing info to process your digital license authorization.
            </p>
          </header>

          {/* 💡 Accessibility Fix: Explicit `aria-live` components announce async layout changes directly to users */}
          <div aria-live="assertive" className="space-y-4">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 dark:bg-red-950 dark:border-red-900 rounded-xl">
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 dark:bg-green-950 dark:border-green-900 rounded-xl">
                <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                  Order placed successfully! Preparing your delivery access options...
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name Fields Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-bold mb-2 flex items-center gap-2">
                  <User className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
                  <span>First Name <span className="text-red-100" aria-hidden="true">*</span></span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[var(--secondary)] border-opacity-50 bg-transparent text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-bold mb-2 flex items-center gap-2">
                  <User className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
                  <span>Last Name <span className="text-red-100" aria-hidden="true">*</span></span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[var(--secondary)] border-opacity-50 bg-transparent text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  required
                />
              </div>
            </div>

            {/* Phone Number Field */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-bold mb-2 flex items-center gap-2">
                <Phone className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
                <span>Phone Number <span className="text-red-100" aria-hidden="true">*</span></span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-[var(--secondary)] border-opacity-50 bg-transparent text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                placeholder="(555) 123-4567"
                required
              />
            </div>

            {/* Address Lines Group */}
            <fieldset className="space-y-4">
              <legend className="sr-only">Billing Address Details</legend>

              <div>
                <label htmlFor="addressLine1" className="block text-sm font-bold mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
                  <span>Address Line 1 <span className="text-red-100" aria-hidden="true">*</span></span>
                </label>
                <input
                  type="text"
                  id="addressLine1"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[var(--secondary)] border-opacity-50 bg-transparent text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  placeholder="123 Main St"
                  required
                />
              </div>

              <div>
                <label htmlFor="addressLine2" className="block text-sm font-bold mb-2">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  id="addressLine2"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[var(--secondary)] border-opacity-50 bg-transparent text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  placeholder="Apt, Suite, Unit #"
                />
              </div>
            </fieldset>

            {/* City, State, Postal Code Location Clusters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-bold mb-2">
                  City <span className="text-red-100" aria-hidden="true">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[var(--secondary)] border-opacity-50 bg-transparent text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  required
                />
              </div>
              <div>
                <label htmlFor="stateProvince" className="block text-sm font-bold mb-2">
                  State / Province <span className="text-red-100" aria-hidden="true">*</span>
                </label>
                <input
                  type="text"
                  id="stateProvince"
                  name="stateProvince"
                  value={formData.stateProvince}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[var(--secondary)] border-opacity-50 bg-transparent text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  required
                />
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-bold mb-2">
                  ZIP / Postal Code <span className="text-red-100" aria-hidden="true">*</span>
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[var(--secondary)] border-opacity-50 bg-transparent text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  required
                />
              </div>
            </div>

            {/* Payment Options Element */}
            <div>
              <label htmlFor="payment" className="block text-sm font-bold mb-2 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
                <span>Payment Gateway</span>
              </label>
              <select
                id="payment"
                name="payment"
                value={formData.payment}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-[var(--secondary)] border-opacity-50 bg-[var(--card)] text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                <option value="card" className="bg-[var(--card)] text-[var(--foreground)]">Credit/Debit Card (Stripe Secure)</option>
                <option value="paypal" className="bg-[var(--card)] text-[var(--foreground)]">PayPal Instant Transfer</option>
              </select>
            </div>

            {/* Final Conversion Processing Submission Section */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[var(--secondary)] border-opacity-20">
              <span className="text-xl font-black">
                Total Cost: ${(total).toFixed(2)}
              </span>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl transition duration-200 font-bold text-sm shadow-sm bg-[var(--primary)] text-[var(--background)] dark:text-[var(--foreground)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
              >
                {saving ? 'Validating Transaction...' : 'Authorize & Place Order'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}