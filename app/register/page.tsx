"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await authClient.signUp.email({
      name,
      email,
      password,
    });

    router.refresh();
    router.push("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm"
      >
        <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>

        <label className="mt-6 block text-sm font-medium text-black">
          Name
        </label>
        <input
          className="mt-2 w-full rounded-md border px-3 py-2 text-black"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

        <label className="mt-4 block text-sm font-medium text-black">
          Email
        </label>
        <input
          type="email"
          className="mt-2 w-full rounded-md border px-3 py-2 text-black"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label className="mt-4 block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          className="mt-2 w-full rounded-md border px-3 py-2"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button
          type="submit"
          className="mt-6 w-full rounded-md bg-black px-4 py-2 font-medium text-white hover:bg-gray-800"
        >
          Register
        </button>
      </form>
    </main>
  );
}