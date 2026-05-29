"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await authClient.signIn.email({
        email,
        password,
      });
      
      router.push("/dashboard");
      router.refresh();

    } catch (error) {
      console.error("Login failed:", error);

      router.push(`/register?email=${encodeURIComponent(email)}`);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm"
      >
        <h1 className="text-3xl font-bold text-gray-900">Login</h1>

        <label className="mt-6 block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          className="mt-2 w-full rounded-md border px-3 py-2"
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
          Login
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          No account?{" "}
          <Link
            href="/register"
            className="font-medium text-black underline hover:text-gray-700"
          >
            Register here
          </Link>
        </p>
      </form>
    </main>
  );
}
