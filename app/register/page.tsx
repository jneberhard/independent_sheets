"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import GoogleSignInButton from "@/components/authentication/GoogleSignInButton";

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPassword = (password: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password);

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    // Email validation
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    // Password validation
    if (!isValidPassword(password)) {
      setPasswordError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    // Confirm password match
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      return;
    }

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
      router.push("/");
    } catch (error: unknown) {
      console.error("Registration error:", error);

      if (error instanceof Error && error.message) {
        setError(
          "This email is already in use. If you've created an account with Google, please use the Google button."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  }

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
          {/* Name */}
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            className="mt-2 w-full rounded-md border px-3 py-2 text-black"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          {/* Email */}
          <label className="mt-4 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            autoComplete="email"
            inputMode="email"
            className="mt-2 w-full rounded-md border px-3 py-2 text-black"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          {emailError && (
            <p className="mt-1 text-sm text-red-600">{emailError}</p>
          )}

          {/* Password */}
          <label className="mt-4 block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative mt-2">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              className="w-full rounded-md border px-3 py-2 pr-20 text-black"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-600 hover:text-black"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {passwordError && (
            <p className="mt-1 text-sm text-red-600">{passwordError}</p>
          )}

          {/* Confirm Password */}
          <label className="mt-4 block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="relative mt-2">
            <input
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              className="w-full rounded-md border px-3 py-2 pr-20 text-black"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-600 hover:text-black"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
          {confirmPasswordError && (
            <p className="mt-1 text-sm text-red-600">
              {confirmPasswordError}
            </p>
          )}

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