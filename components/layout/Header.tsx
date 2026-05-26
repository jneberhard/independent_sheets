import SearchBar from "./SearchBar";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import Image from "next/image";
import MobileMenu from "./MobileMenu";
import { getCurrentUser } from "@/lib/currentUser";
//for future use
//import ShoppingCart from "../cart/Cart";
import { prisma } from "@/lib/prisma";


export default async function Header() {

  const user = await getCurrentUser();

  const voicingLinks = await prisma.category.findMany({
    where: { group: "VOICING" },
    orderBy: { name: "asc" },
  });

  const instrumentLinks = await prisma.category.findMany({
    where: { group: "INSTRUMENT" },
    orderBy: { name: "asc" },
  });

  const genreLinks = await prisma.category.findMany({
    where: { group: "GENRE" },
    orderBy: { name: "asc" },
  });

  const isLoggedIn = !!user;
  const dashboardLink =
    user?.role.name === "ADMIN"
      ? "/dashboard/admin"
      : user?.role.name === "PUBLISHER"
        ? "/dashboard/publisher"
        : "/dashboard";


  return (
    <header className="border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-6 py-4">
        {/* Top Row */}
        <div className="flex items-center justify-between gap-6">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <Image
              src="/logo_1.png"
              alt="Independent Sheets Logo"
              width={0}
              height={0}
              sizes="100vw"
              className="h-auto w-24"
              priority
            />

            <span className="text-2xl font-bold tracking-tight text-gray-900">
              Independent Sheets
            </span>
          </Link>

          {/* Search */}
          <div className="hidden flex-1 justify-center md:flex">
            <SearchBar />
          </div>

          {/* Right top header */}
          <div className="hidden items-center gap-4 md:flex">
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
              <div className="flex flex-col items-end gap-2">
                <span className="text-sm font-medium text-green-600">
                  Logged in as {user?.name ?? user?.email}
                </span>

                <div className="flex items-center gap-3">
                  <Link
                    href={dashboardLink}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Dashboard
                  </Link>

                  <LogoutButton />

                </div>
              </div>
            )}
          </div>
          {/* MOBILE VIEW */}
          <MobileMenu />
        </div>

        {/* MOBILE SEARCH */}
        <div className="mt-4 md:hidden">
          <SearchBar />
        </div>

        {/* BOTTOM NAV */}
        <nav className="mt-2 hidden items-center justify-center gap-8 border-t pt-2 md:flex">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            Home
          </Link>
          {/* Voicing Dropdown */}
          <div className="group relative">
            <button className="text-blue-600 hover:text-blue-800 hover:underline">
              Voicing
            </button>

            <div className="absolute left-0 top-full z-50 hidden w-48 rounded-md border bg-white p-2 shadow-lg group-hover:block">
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

          {/* Instruments Dropdown */}
          <div className="group relative">
            <button className="text-blue-600 hover:text-blue-800 hover:underline">
              Instruments
            </button>

            <div className="absolute left-0 top-full z-50 hidden w-48 rounded-md border bg-white p-2 shadow-lg group-hover:block">
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

          {/* Genres Dropdown */}
          <div className="group relative">
            <button className="text-blue-600 hover:text-blue-800 hover:underline">
              Genres
            </button>

            <div className="absolute left-0 top-full z-50 hidden w-48 rounded-md border bg-white p-2 shadow-lg group-hover:block">
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

          {/* Arranger signup link */}
          <div>
            <Link
              href="/register/publisher"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Arranger/Publisher Sign Up
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}