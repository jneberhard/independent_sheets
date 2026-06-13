"use client";

import Link from "next/link";
import { useState } from "react";

type CategoryLink = {
  id: string;
  name: string;
  slug: string;
};

type MobileMenuProps = {
  voicingLinks: CategoryLink[];
  instrumentLinks: CategoryLink[];
  genreLinks: CategoryLink[];
};

export default function MobileMenu({
  voicingLinks,
  instrumentLinks,
  genreLinks,
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen((current) => !current)}
        className="rounded-md border px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        ☰
      </button>

      {isOpen && (
        <div className="absolute left-0 top-20 z-50 w-full border-b bg-white px-6 py-4 shadow-md">
          <div className="space-y-5">
            <Link
              href="/"
              onClick={closeMenu}
              className="block font-medium text-blue-600 hover:underline"
            >
              Home
            </Link>

            <Link
              href="/catalog"
              onClick={closeMenu}
              className="block font-medium text-blue-600 hover:underline"
            >
              Full Catalog
            </Link>

            <MobileSection
              title="Voicing"
              links={voicingLinks}
              basePath="/catalog/voicing"
              closeMenu={closeMenu}
            />

            <MobileSection
              title="Instruments"
              links={instrumentLinks}
              basePath="/catalog/instrument"
              closeMenu={closeMenu}
            />

            <MobileSection
              title="Genres"
              links={genreLinks}
              basePath="/catalog/genre"
              closeMenu={closeMenu}
            />

            <Link
              href="/register/publisher"
              onClick={closeMenu}
              className="block font-medium text-blue-600 hover:underline"
            >
              Arranger/Publisher Sign Up
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileSection({
  title,
  links,
  basePath,
  closeMenu,
}: {
  title: string;
  links: CategoryLink[];
  basePath: string;
  closeMenu: () => void;
}) {
  return (
    <div>
      <p className="font-semibold text-gray-900">{title}</p>

      {links.length === 0 ? (
        <p className="mt-2 text-sm text-gray-500">No options available.</p>
      ) : (
        <div className="mt-2 grid grid-cols-2 gap-2">
          {links.map((link) => (
            <Link
              key={link.id}
              href={`${basePath}/${link.slug}`}
              onClick={closeMenu}
              className="block rounded px-3 py-2 text-sm text-blue-600 hover:bg-gray-100 hover:underline"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}