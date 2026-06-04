'use client';

import { useEffect, useState, useCallback } from 'react';
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

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
      console.error('Error fetching data directly from database:', err);
      setError('Could not download your saved address profile. Fields are open for manual entry.');
    } finally {
      setLoading(false);
    }
  }, [sessionData?.session?.userId]);

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
        headers: {
          "Content-Type": "application/json",
        },
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

      const orderData: OrderPayload = {
        items: cart.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price > 100 ? item.price / 100 : item.price,
        })),
        total: total > 100 ? total / 100 : total,
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

  // Fixed Lifecycle Monitor (Safe from synchronous rendering loops)
  useEffect(() => {
    if (sessionLoading) return;

    // Defers routing / background execution outside of React's paint window
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
      <div className="flex min-h-[50vh] items-center justify-center bg-[var(--background)]">
        <p className="text-sm font-medium animate-pulse text-[var(--foreground)] opacity-70">
          Loading secure checkout gateway...
        </p>
      </div>
    );
  }

  if (!sessionData?.session || cart.length === 0) return null;

  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-200 py-6 text-[var(--foreground)]">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 font-bold transition duration-200 text-[var(--primary)] hover:opacity-70"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>
        </div>

        <div className="bg-[var(--card)] rounded-2xl border border-[var(--secondary)] border-opacity-30 shadow-sm p-6 sm:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-black mb-2">Checkout</h1>
            <p className="text-sm opacity-80">
              Review your billing info to process your digital license authorization.
            </p>
          </div>

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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-bold mb-2 flex items-center gap-2">
                  <User className="h-4 w-4 text-[var(--accent)]" /> First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[var(--secondary)] border-opacity-50 outline-none bg-transparent transition focus:border-[var(--accent)] text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-bold mb-2 flex items-center gap-2">
                  <User className="h-4 w-4 text-[var(--accent)]" /> Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[var(--secondary)] border-opacity-50 outline-none bg-transparent transition focus:border-[var(--accent)] text-sm"
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-bold mb-2 flex items-center gap-2">
                <Phone className="h-4 w-4 text-[var(--accent)]" /> Phone Number *
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-[var(--secondary)] border-opacity-50 outline-none bg-transparent transition focus:border-[var(--accent)] text-sm"
                placeholder="(555) 123-4567"
                required
              />
            </div>

            {/* Address Line 1 */}
            <div>
              <label htmlFor="addressLine1" className="block text-sm font-bold mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[var(--accent)]" /> Address Line 1 *
              </label>
              <input
                type="text"
                id="addressLine1"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-[var(--secondary)] border-opacity-50 outline-none bg-transparent transition focus:border-[var(--accent)] text-sm"
                placeholder="123 Main St"
                required
              />
            </div>

            {/* Address Line 2 */}
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
                className="w-full px-4 py-2.5 rounded-xl border-2 border-[var(--secondary)] border-opacity-50 outline-none bg-transparent transition focus:border-[var(--accent)] text-sm"
                placeholder="Apt, Suite, Unit #"
              />
            </div>

            {/* City, State, Postal Code Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-bold mb-2">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[var(--secondary)] border-opacity-50 outline-none bg-transparent transition focus:border-[var(--accent)] text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="stateProvince" className="block text-sm font-bold mb-2">State / Province *</label>
                <input
                  type="text"
                  id="stateProvince"
                  name="stateProvince"
                  value={formData.stateProvince}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[var(--secondary)] border-opacity-50 outline-none bg-transparent transition focus:border-[var(--accent)] text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-bold mb-2">ZIP / Postal Code *</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[var(--secondary)] border-opacity-50 outline-none bg-transparent transition focus:border-[var(--accent)] text-sm"
                  required
                />
              </div>
            </div>

            {/* Payment Gateway Selector */}
            <div>
              <label htmlFor="payment" className="block text-sm font-bold mb-2 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-[var(--accent)]" /> Payment Gateway
              </label>
              <select
                id="payment"
                name="payment"
                value={formData.payment}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-[var(--secondary)] border-opacity-50 outline-none bg-[var(--card)] transition focus:border-[var(--accent)] text-sm font-medium"
              >
                <option value="card" className="bg-[var(--card)] text-[var(--foreground)]">Credit/Debit Card (Stripe Secure)</option>
                <option value="paypal" className="bg-[var(--card)] text-[var(--foreground)]">PayPal Instant Transfer</option>
              </select>
            </div>

            {/* Total Cost and Submission Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[var(--secondary)] border-opacity-20">
              <span className="text-xl font-black">Total Cost: ${total.toFixed(2)}</span>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl transition duration-200 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm shadow-sm bg-[var(--primary)] text-[var(--background)] dark:text-[var(--foreground)] hover:brightness-110"
              >
                {saving ? 'Validating Transaction...' : 'Authorize & Place Order'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}