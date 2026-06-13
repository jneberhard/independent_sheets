"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import GoogleSignInButton from "@/components/authentication/GoogleSignInButton";
import { authClient } from "@/lib/auth/client";

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPassword = (password: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password);

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setEmailError("");
    setPasswordError("");

    // We validate early so the user gets a clear message before we call auth.
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    if (!isValidPassword(password)) {
      setPasswordError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    try {
      // Sign in through Neon Auth first, then use our local role lookup to send
      // the user to the right dashboard.
      await authClient.signIn.email({
        email,
        password,
      });

      const response = await fetch("/api/auth/me");

      if (!response.ok) {
        throw new Error("Failed to load user role");
      }

      const data = await response.json();

      if (data.role === "PUBLISHER") {
        router.push("/dashboard/publisher");
      } else if (data.role === "ADMIN") {
        router.push("/dashboard/admin");
      } else {
        // Normal users land on the customer dashboard.
        router.push("/dashboard");
      }

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

        <p className="mt-2 text-sm text-gray-600">
          Sign in to continue to your dashboard and manage your sheet music.
        </p>

        <label className="mt-6 block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          autoComplete="email"
          inputMode="email"
          className="mt-2 w-full rounded-md border px-3 py-2"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}

        <label className="mt-4 block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative mt-2">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full rounded-md border px-3 py-2 pr-20"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {passwordError && (
            <p className="mt-1 text-sm text-red-600">{passwordError}</p>
          )}

          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-600 hover:text-black"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-md bg-black px-4 py-2 font-medium text-white hover:bg-gray-800"
        >
          Login
        </button>

        <GoogleSignInButton />

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
