import SearchBar from "./SearchBar";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import Image from "next/image";
import MobileMenu from "./MobileMenu";
import HeaderCartIcon from "./HeaderCartIcon";

import { getCurrentUser } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";

export default async function Header() {
  // 1. Get current logged in user safely on the server
  const user = await getCurrentUser();

  // 2. Load categories from database
  const voicingLinks = await prisma.category.findMany({
    where: {
      group: "VOICING",
    },
    orderBy: {
      name: "asc",
    },
  });

  const instrumentLinks = await prisma.category.findMany({
    where: {
      group: "INSTRUMENT",
    },
    orderBy: {
      name: "asc",
    },
  });

  const genreLinks = await prisma.category.findMany({
    where: {
      group: "GENRE",
    },
    orderBy: {
      name: "asc",
    },
  });

  // Logged in status
  const isLoggedIn = !!user;

  // Dashboard link based on role
  const dashboardLink =
    user?.role.name === "ADMIN"
      ? "/dashboard/admin"
      : user?.role.name === "PUBLISHER"
        ? "/dashboard/publisher"
        : "/dashboard";

  return (
    <header className="border-b border-[var(--secondary)] bg-[var(--primary)] text-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">

        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-4">

          {/* Logo Section */}
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="relative w-20 sm:w-24 aspect-square">
              <Image
                src="/logo_1.png"
                alt="Independent Sheets Logo"
                fill
                sizes="(max-width: 640px) 80px, 96px"
                className="object-contain"
                priority
              />
            </div>

            <span className="hidden text-3xl font-bold tracking-tight text-black sm:inline">
              Independent Sheets
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden flex-1 justify-center md:flex">
            <SearchBar />
          </div>

          {/* Desktop Auth and Cart Section */}
          <div className="hidden items-center gap-4 md:flex">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="rounded-md border bg-[var(--card)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="flex flex-col items-end gap-2">
                <span className="text-sm font-medium text-black">
                  Logged in as {user.name ?? user.email}
                </span>

                <div className="flex items-center gap-3">
                  <Link
                    href={dashboardLink}
                    className="rounded-md border bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                  >
                    Dashboard
                  </Link>

                  <LogoutButton />

                  {/* Safely inject our independent client component here */}
                  <HeaderCartIcon />

                </div>
              </div>
            )}
          </div>

          {/* Mobile Section */}
          <div className="flex items-center gap-4 md:hidden">
            <HeaderCartIcon isMobile />

            <div className="flex flex-col items-end gap-1">
              {/* Hamburger Menu */}
              <MobileMenu
                voicingLinks={voicingLinks}
                instrumentLinks={instrumentLinks}
                genreLinks={genreLinks}
              />

              {/* Logged In Mobile Meta Text */}
              {isLoggedIn ? (
                <>
                  <span className="max-w-[140px] truncate text-[10px] font-medium text-[var(--accent)]">
                    {user.name ?? user.email}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      href={dashboardLink}
                      className="rounded-md border bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white"
                    >
                      Dashboard
                    </Link>
                    <LogoutButton />
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-[10px]">
                  <Link href="/login" className="text-white hover:underline">
                    Login
                  </Link>
                  <span className="text-white/40">|</span>
                  <Link href="/register" className="text-[var(--accent)] hover:underline">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-4 md:hidden">
          <SearchBar />
        </div>

        {/* Desktop Bottom Navigation */}
        <nav className="mt-3 hidden items-center justify-center gap-8 border-t border-[var(--secondary)] pt-3 md:flex">
          {/* Home */}
          <Link
            href="/"
            className="text-[var(--background)] hover:text-[var(--accent)] hover:underline"
          >
            Home
          </Link>

          {/* Voicing Dropdown */}
          <div className="group relative">
            <button className="text-[var(--background)] hover:text-[var(--accent)] hover:underline">
              Voicing
            </button>

            <div className="absolute left-0 top-full z-50 hidden w-48 rounded-xl border border-[var(--secondary)] bg-white p-2 shadow-xl group-hover:block">
              {voicingLinks.map((link) => (
                <Link
                  key={link.id}
                  href={`/catalog/voicing/${link.slug}`}
                  className="block rounded px-3 py-2 text-sm text-blue-600 hover:bg-gray-100 hover:text-blue-800"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Instrument Dropdown */}
          <div className="group relative">
            <button className="text-[var(--background)] hover:text-[var(--accent)] hover:underline">
              Instruments
            </button>

            <div className="absolute left-0 top-full z-50 hidden w-48 rounded-xl border border-[var(--secondary)] bg-white p-2 shadow-xl group-hover:block">
              {instrumentLinks.map((link) => (
                <Link
                  key={link.id}
                  href={`/catalog/instrument/${link.slug}`}
                  className="block rounded px-3 py-2 text-sm text-blue-600 hover:bg-gray-100 hover:text-blue-800"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Genre Dropdown */}
          <div className="group relative">
            <button className="text-[var(--background)] hover:text-[var(--accent)] hover:underline">
              Genres
            </button>

            <div className="absolute left-0 top-full z-50 hidden w-48 rounded-xl border border-[var(--secondary)] bg-white p-2 shadow-xl group-hover:block">
              {genreLinks.map((link) => (
                <Link
                  key={link.id}
                  href={`/catalog/genre/${link.slug}`}
                  className="block rounded px-3 py-2 text-sm text-blue-600 hover:bg-gray-100 hover:text-blue-800"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Publisher Signup */}
          <Link
            href="/register/publisher"
            className="text-[var(--background)] hover:text-[var(--accent)] hover:underline"
          >
            Arranger/Publisher Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
}