"use client"

import Image from "next/image";
import { useState } from "react";

export default function Footer() {
  const [isOpen, setIsOpen] = useState(false);
  const teamMembers = [
    {name: "Benjamin Wasden"},
    {name: "Boitumelo Hebert Meletse"},
    {name: "Happiness Nonkululeko Ncube"},
    {name: "James Eberhard"},
  ];

  return (
    <footer className="w-full border-t bg-[var(--primary)]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-6 md:flex-row text-black">
        <div className="text-center md:text-left">
          <button onClick={() => setIsOpen(true)} className="ml-2 px-3 py-1 bg-[var(--card2)] text-white rounded transition hover:opacity-80">Team Info</button>
        </div>
        <div className="flex flex-row gap-4">
          <a href="https://www.instagram.com/"><Image src="/socialicons/instagram.png" height={40} width={40} alt="Icon of Instagram. Click to visit instagram's website" className="transition duration-200 ease-in-out hover:-translate-y-1 hover:scale-110"/></a>
          <a href="https://www.twitter.com"><Image src="/socialicons/twitter.png" height={40} width={40} alt="Icon of Twitter. Click to visit twitter's website" className="transition duration-200 ease-in-out hover:-translate-y-1 hover:scale-110"/></a>
          <a href="https://www.tiktok.com"><Image src="/socialicons/tik-tok.png" height={40} width={40} alt="Icon of TikTok. Click to visit TikTok's website" className="transition duration-200 ease-in-out hover:-translate-y-1 hover:scale-110"/></a>
        </div>
        <p className="text-sm text-center">
          © 2026 Independent Sheets. All rights reserved.
        </p>
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Dark Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Modal Content Window */}
          <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all z-10 text-gray-900">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-xl font-bold leading-6 text-gray-900">
                Independent Sheets Credits
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold text-lg">x</button>
            </div>

            {/* Team Info */}
            <div className="space-y-4">
              {teamMembers.map((member, index) => (
                <div key={index} className="border-b last:border-0 pb-3 last:pb-0">
                  <h4 className="font-semibold text-base text-[var(--card2)]">{member.name}</h4>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </footer>
  );
}