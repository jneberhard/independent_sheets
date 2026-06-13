"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  email: string;
  authProvider: string;

  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  stateProvince?: string | null;
  postalCode?: string | null;
  country?: string | null;
  phoneNumber?: string | null;
};

type Tab = "profile" | "security";

export default function AccountForm({ user }: { user: User }) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    name: user.name ?? "",
    email: user.email ?? "",
    phoneNumber: user.phoneNumber ?? "",
    addressLine1: user.addressLine1 ?? "",
    addressLine2: user.addressLine2 ?? "",
    city: user.city ?? "",
    stateProvince: user.stateProvince ?? "",
    postalCode: user.postalCode ?? "",
    country: user.country ?? "",
  });

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/account/me", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "Save failed");
      }

      setSuccess("Profile updated successfully");
      router.refresh();
    } catch {
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Account Settings</h1>

      {/* Tabs */}
      <div className="mt-6 flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 my-1 text-sm font-medium border-b-2 ${
            activeTab === "profile"
              ? "bg-white text-black rounded-lg "
              : "border-transparent text-gray-200"
          }`}
        >
          Profile
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2 my-1 text-sm font-medium border-b-2 ${
            activeTab === "security"
              ? "bg-white text-black rounded-lg"
              : "border-transparent text-gray-200"
          }`}
        >
          Security
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {success && (
        <p className="mt-4 rounded border border-green-200 bg-green-50 p-2 text-sm text-green-700">
          {success}
        </p>
      )}

      {/* PROFILE TAB */}
      {activeTab === "profile" && (
        <form onSubmit={handleSave} className="mt-6 space-y-4">
          {/* First + Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
              <input
                id="firstName"
                className="w-full rounded border p-2"
                placeholder="First Name"
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
              <input
                id="lastName"
                className="w-full rounded border p-2"
                placeholder="Last Name"
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
              />
            </div>
          </div>

          {/* Display Name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="displayName" className="text-sm font-medium">Display Name</label>
            <input
              id="displayName"
              className="w-full rounded border p-2"
              placeholder="Display Name (optional)"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input
              id="email"
              className="w-full rounded border p-2 bg-gray-100 text-gray-600"
              value={form.email}
              disabled
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1">
            <label htmlFor="phoneNumber" className="text-sm font-medium">Phone Number</label>
            <input
              id="phoneNumber"
              className="w-full rounded border p-2"
              placeholder="Phone Number"
              value={form.phoneNumber}
              onChange={(e) => updateField("phoneNumber", e.target.value)}
            />
          </div>

          {/* Address */}
          <div className="flex flex-col gap-1">
            <label htmlFor="addressLine1" className="text-sm font-medium">Address Line 1</label>
            <input
              id="addressLine1"
              className="w-full rounded border p-2"
              placeholder="Address Line 1"
              value={form.addressLine1}
              onChange={(e) => updateField("addressLine1", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="addressLine2" className="text-sm font-medium">Address Line 2</label>
            <input
              id="addressLine2"
              className="w-full rounded border p-2"
              placeholder="Address Line 2"
              value={form.addressLine2}
              onChange={(e) => updateField("addressLine2", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="city" className="text-sm font-medium">City</label>
              <input
                id="city"
                className="w-full rounded border p-2"
                placeholder="City"
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="stateProvince" className="text-sm font-medium">State</label>
              <input
                id="stateProvince"
                className="w-full rounded border p-2"
                placeholder="State / Province"
                value={form.stateProvince}
                onChange={(e) => updateField("stateProvince", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="postalCode" className="text-sm font-medium">Postal Code</label>
              <input
                id="postalCode"
                className="w-full rounded border p-2"
                placeholder="Postal Code"
                value={form.postalCode}
                onChange={(e) => updateField("postalCode", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="country" className="text-sm font-medium">Country</label>
              <input
                id="country"
                className="w-full rounded border p-2"
                placeholder="Country"
                value={form.country}
                onChange={(e) => updateField("country", e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded bg-[var(--accent)] px-4 py-2 text-white hover:bg-[var(--accent)]/90"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      )}

      {/* SECURITY TAB */}
      {activeTab === "security" && (
        <div className="mt-6 space-y-6">
          {user.authProvider !== "credentials" ? (
            <div className="rounded border p-4 bg-gray-50">
              <h2 className="text-lg font-semibold">Security</h2>
              <p className="text-sm text-gray-600 mt-2">
                This account uses Google or another OAuth provider. Password
                changes must be done through your provider.
              </p>
            </div>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setSaving(true);
                setError("");
                setSuccess("");

                if (newPassword !== confirmPassword) {
                  setError("New passwords do not match");
                  setSaving(false);
                  return;
                }

                const res = await fetch("/api/account/change-password", {
                  method: "POST",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    currentPassword,
                    newPassword,
                  }),
                });

                const data = await res.json();

                if (!res.ok) {
                  setError(data.error || "Failed to change password");
                } else {
                  setSuccess("Password updated successfully");
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }

                setSaving(false);
              }}
              className="space-y-4 rounded border p-4 bg-gray-50"
            >
              <h2 className="text-lg font-semibold text-black">Change Password</h2>

              {error && (
                <p className="text-sm text-red-600 border border-red-200 bg-red-50 p-2 rounded">
                  {error}
                </p>
              )}

              {success && (
                <p className="text-sm text-green-700 border border-green-200 bg-green-50 p-2 rounded">
                  {success}
                </p>
              )}

              {/* Current Password */}
              <div className="relative text-black flex flex-col gap-1">
                <label htmlFor="currentPassword" className="text-sm font-medium">Current Password</label>
                <input
                  id="currentPassword"
                  type={showCurrent ? "text" : "password"}
                  className="w-full rounded border p-2 pr-10"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-2 top-8 text-sm text-gray-600"
                >
                  {showCurrent ? "Hide" : "Show"}
                </button>
              </div>

              {/* New Password */}
              <div className="relative text-black flex flex-col gap-1">
                <label htmlFor="newPassword" className="text-sm font-medium">New Password</label>
                <input
                  id="newPassword"
                  type={showNew ? "text" : "password"}
                  className="w-full rounded border p-2 pr-10"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-2 top-8 text-sm text-gray-600"
                >
                  {showNew ? "Hide" : "Show"}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative text-black flex flex-col gap-1">
                <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  className="w-full rounded border p-2 pr-10"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-2 top-8 text-sm text-gray-600"
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={saving}
                className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
              >
                {saving ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}
        </div>
      )}
    </main>
  );
}