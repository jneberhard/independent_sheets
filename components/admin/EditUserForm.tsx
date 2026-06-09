"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type SystemRole = {
  id: string;
  name: string;
};

type TargetUserFields = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  name: string | null;
  roleId: string;
  phoneNumber: string | null;
};

type EditUserFormProps = {
  targetUser: TargetUserFields;
  systemRoles: SystemRole[];
};

export default function EditUserForm({ targetUser, systemRoles }: EditUserFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // Initialize state inputs with current database metadata records
  const [firstName, setFirstName] = useState(targetUser.firstName ?? "");
  const [lastName, setLastName] = useState(targetUser.lastName ?? "");
  const [name, setName] = useState(targetUser.name ?? "");
  const [phoneNumber, setPhoneNumber] = useState(targetUser.phoneNumber ?? "");
  const [roleId, setRoleId] = useState(targetUser.roleId);

  // Automatically sync combined display name if parts change
  const handleNamePartsChange = (first: string, last: string) => {
    setFirstName(first);
    setLastName(last);
    if (first || last) {
      setName(`${first} ${last}`.trim());
    }
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch(`/api/admin/users/${targetUser.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          name,
          phoneNumber,
          roleId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to patch user profile");
      }

      alert("Account information updated successfully.");
      router.push("/dashboard/admin/userList");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Changes could not be persisted to the database.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {/* Name Input Grid Row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-gray-700">First Name</label>
          <input
            type="text"
            className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
            value={firstName}
            onChange={(e) => handleNamePartsChange(e.target.value, lastName)}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">Last Name</label>
          <input
            type="text"
            className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
            value={lastName}
            onChange={(e) => handleNamePartsChange(firstName, e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">Combined Display Name</label>
        <input
          type="text"
          className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-black bg-gray-50"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. John Doe"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
        <input
          type="tel"
          className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="(555) 555-5555"
        />
      </div>

      {/* Access Permission Role Selector */}
      <div>
        <label className="block text-sm font-semibold text-gray-700">Account Access Level (Role)</label>
        <select
          className="mt-2 block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-black bg-white"
          value={roleId}
          onChange={(e) => setRoleId(e.target.value)}
          required
        >
          {systemRoles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
      </div>

      {/* Button Row Operations */}
      <div className="flex flex-col sm:flex-row items-center gap-4 border-t pt-6">
        <Link
          href="/dashboard/admin/userList"
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Cancel
        </Link>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full sm:flex-1 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isSaving ? "Updating Account Details..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}