import Image from "next/image";


export default function Footer() {
  return (
    <footer className="w-full border-t bg-[var(--primary)]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-6 md:flex-row text-black">
        <div className="text-center md:text-left"><span>Team Members:</span>
          <ul className="text-sm space-y-1">
            <li>James Eberhard</li>
            <li>Boitumelo Hebert Meletse</li>
            <li>Benjamin Wasden</li>
            <li>Happiness Nonkululeko Ncube</li>
          </ul>
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
    </footer>
  );
}