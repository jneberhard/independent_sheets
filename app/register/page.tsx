"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import GoogleSignInButton from "@/components/authentication/GoogleSignInButton";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      await authClient.signUp.email({
        name,
        email,
        password,
      });

      await fetch("/api/register/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
        }),
      });

      router.refresh();
      // Change this so it logs them in in the future
      router.push("/");
    } catch (error: any) {
      
      if (error && error.message) {
        setError("This email is already in use. If you've created an account with Google, please use the Google button.");
      } else {
        setError("An unexpected error occured. Please try again.");
      }
    }
  }
//   async function handleGoogleRegister() {
//   try {
//     await authClient.signIn.social({
//       provider: "google",
//       callbackURL: "/dashboard",
//     });
//   } catch (error) {
//     console.error("Google registration failed:", error);
//   }
// }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">
          Create Your Account
        </h1>

        <p className="mt-3 text-sm text-gray-600">
          Sign up to purchase, download, and manage your sheet music library.
        </p>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-3 border border-red-200">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="mt-8">
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            className="mt-2 w-full rounded-md border px-3 py-2"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <label className="mt-4 block text-sm font-medium text-gray-700">
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
            Create Account
          </button>
          <GoogleSignInButton />
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Are you a composer or arranger?{" "}
          <Link
            href="/register/publisher"
            className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            Become a publisher
          </Link>
        </p>

        <p className="mt-3 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}