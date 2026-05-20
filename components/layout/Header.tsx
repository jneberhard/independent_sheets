import Link from "next/link";
import { auth } from "@/lib/auth/server";
import LogoutButton from "./LogoutButton";

const voicingLinks = [
  { label: "SATB", href: "/catalog/voicing/satb" },
  { label: "SSAA", href: "/catalog/voicing/ssaa" },
  { label: "TTBB", href: "/catalog/voicing/ttbb" },
  { label: "Piano/Vocal", href: "/catalog/voicing/piano-vocal" },
];

const instrumentLinks = [
  { label: "Trumpet", href: "/catalog/instrument/trumpet" },
  { label: "Flute", href: "/catalog/instrument/flute" },
  { label: "Clarinet", href: "/catalog/instrument/clarinet" },
  { label: "Saxophone", href: "/catalog/instrument/saxophone" },
  { label: "Trombone", href: "/catalog/instrument/trombone" },
  { label: "Violin", href: "/catalog/instrument/violin" },
  { label: "Viola", href: "/catalog/instrument/viola" },
  { label: "Piano", href: "/catalog/instrument/piano" },
];

export default async function Header() {
  const { data: session } = await auth.getSession();

  const isLoggedIn = !!session?.user;

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Left Side */}
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-gray-900"
          >
            Independent Sheets
          </Link>

          <nav className="flex items-center gap-8">
            {/* Voicing Dropdown */}
            <div className="group relative">
              <button className="text-blue-600 hover:text-blue-800 hover:underline">
                Voicing
              </button>

              <div className="absolute left-0 top-full z-50 hidden w-48 rounded-md border bg-white p-2 shadow-lg group-hover:block">
                {voicingLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block rounded px-3 py-2 text-sm text-blue-600 hover:bg-gray-100 hover:text-blue-800"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Instruments Dropdown */}
            <div className="group relative">
              <button className="text-blue-600 hover:text-blue-800 hover:underline">
                Instruments
              </button>

              <div className="absolute left-0 top-full z-50 hidden w-48 rounded-md border bg-white p-2 shadow-lg group-hover:block">
                {instrumentLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block rounded px-3 py-2 text-sm text-blue-600 hover:bg-gray-100 hover:text-blue-800"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            {/* Arranger signup link */}
            <div >
              <button className="text-blue-600 hover:text-blue-800 hover:underline">
                Arranger Sign Up
              </button>
            </div>
          </nav>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {!isLoggedIn && (
            <>
              <Link
                href="/login"
                className="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Register
              </Link>
            </>
          )}

          {isLoggedIn && (
            <>
              <span className="text-sm font-medium text-green-600">
                Logged in as{" "}
                {session?.user?.name ?? session?.user?.email}
              </span>

              <LogoutButton />
            </>
          )}
        </div>
      </div>
    </header>
  );
}