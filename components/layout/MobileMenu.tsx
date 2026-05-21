"use client";

import Link from "next/link";
import { useState } from "react";

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

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-md border px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {isOpen && (
        <div className="absolute left-0 top-20 z-50 w-full border-b bg-white px-6 py-4 shadow-md">
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-gray-900">Voicing</p>
              <div className="mt-2 space-y-2">
                {voicingLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-blue-600 hover:underline"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="font-semibold text-gray-900">Instruments</p>
              <div className="mt-2 space-y-2">
                {instrumentLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-blue-600 hover:underline"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/register/publisher"
              onClick={() => setIsOpen(false)}
              className="block font-medium text-blue-600 hover:underline"
            >
              Arranger Sign Up
            </Link>
          </div>
        </div>
          )}
          <div className="border-t pt-4">
            <div className="flex flex-col gap-3">
                <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="rounded-md border px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                Login
                </Link>

                <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="rounded-md bg-black px-4 py-2 text-center text-sm font-medium text-white hover:bg-gray-800"
                >
                Register
                </Link>
            </div>
            </div>
    </div>
  );
}