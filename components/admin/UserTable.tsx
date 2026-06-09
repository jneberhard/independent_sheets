"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Edit } from "lucide-react";

type RoleData = {
  id: string;
  name: string;
};

type UserRow = {
  id: string;
  name: string | null;
  email: string | null;
  roleId: string;
  createdAt: Date;
  active?: boolean;
  role: RoleData | null;
};

type UserTableProps = {
  initialUsers: UserRow[];
};

export default function UserTable({ initialUsers }: UserTableProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isProcessing] = useState<string | null>(null);

  // Filter users dynamically based on name or email inputs
  const filteredUsers = initialUsers.filter((user) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = user.name?.toLowerCase().includes(query) ?? false;
    const emailMatch = user.email?.toLowerCase().includes(query) ?? false;
    return nameMatch || emailMatch;
  });

  /*  Handle User Deletion
  async function handleDelete(userId: string, userName: string) {
    const confirmed = confirm(`Are you absolutely sure you want to permanently delete ${userName || "this user"}?`);
    if (!confirmed) return;

    try {
      setIsProcessing(userId);
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete user");

      alert("User deleted successfully.");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Could not delete user account.");
    } finally {
      setIsProcessing(null);
    }
  }*/

  /* Toggle Account Active Status (Inactivate / Reactivate)
  async function handleToggleActive(userId: string, currentStatus: boolean) {
    try {
      setIsProcessing(userId);
      const response = await fetch(`/api/admin/users/${userId}/toggle-active`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Could not update user activation status.");
    } finally {
      setIsProcessing(null);
    }
  }*/

  // Route to detailed User Editing Sub-View
  function handleEditRedirect(userId: string) {
    router.push(`/dashboard/admin/userList/${userId}/edit`);
  }

  return (
    <div className="w-full">
      {/* Search Input Box */}
      <div className="p-5 border-b bg-gray-50/50">
        <div className="relative max-w-md rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full rounded-xl border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Search accounts by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main Table Interface */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <tr>
              <th scope="col" className="px-6 py-4">User Details</th>
              <th scope="col" className="px-6 py-4">Assigned Role</th>
              <th scope="col" className="px-6 py-4">Joined Date</th>
              <th scope="col" className="px-6 py-4">Account Status</th>
              <th scope="col" className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                  No matching user accounts found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const isUserActive = user.active !== false; // Default true if property undefined
                const processing = isProcessing === user.id;

                return (
                  <tr key={user.id} className="hover:bg-gray-50/70 transition-colors">
                    {/* Column 1: Details */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="font-semibold text-gray-900">{user.name || "Unnamed User"}</div>
                      <div className="text-xs text-gray-500">{user.email || "No email available"}</div>
                    </td>

                    {/* Column 2: Role */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold tracking-wide border ${
                        user.role?.name === "ADMIN"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : user.role?.name === "PUBLISHER"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      }`}>
                        {user.role?.name || "No Role"}
                      </span>
                    </td>

                    {/* Column 3: Registration Timestamp */}
                    <td className="whitespace-nowrap px-6 py-4 text-gray-600 text-xs">
                      {new Date(user.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>

                    {/* Column 4: Account Status Toggle Flag */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                        isUserActive
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                          : "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${isUserActive ? "bg-emerald-500" : "bg-rose-500"}`} />
                        {isUserActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Column 5: Action Button Panel Controls */}
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit Action Button */}
                        <button
                          onClick={() => handleEditRedirect(user.id)}
                          disabled={processing}
                          className="p-1.5 text-gray-500 hover:text-blue-600 rounded-md hover:bg-gray-100 transition disabled:opacity-40"
                          title="Edit User Info"
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        {/* Inactivate/Reactivate Action Button
                        <button
                          onClick={() => handleToggleActive(user.id, isUserActive)}
                          disabled={processing}
                          className={`p-1.5 rounded-md hover:bg-gray-100 transition disabled:opacity-40 ${
                            isUserActive ? "text-amber-500 hover:text-amber-600" : "text-emerald-500 hover:text-emerald-600"
                          }`}
                          title={isUserActive ? "Inactivate Account" : "Reactivate Account"}
                        >
                          {isUserActive ? <ShieldAlert className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </button>*/}

                        {/* Delete Action Button
                        <button
                          onClick={() => handleDelete(user.id, user.name ?? "")}
                          disabled={processing}
                          className="p-1.5 text-gray-500 hover:text-rose-600 rounded-md hover:bg-gray-100 transition disabled:opacity-40"
                          title="Permanently Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>  */}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}