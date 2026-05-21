export default function Footer() {
  return (
    <footer className="w-full border-t bg-amber-100">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-6 py-6 md:flex-row">
        <p className="text-gray-800">
          © 2026 Independent Sheets. All rights reserved.
        </p>
        <div className="mx-auto flex flex-row gap-4">
          <a href="https://www.instagram.com/"><img src="../socialicons/instagram.png" width="40" alt="Icon of Instagram. Click to visit instagram's website"/></a>
          <a href="https://www.twitter.com"><img src="../socialicons/twitter.png" width="40" alt="Icon of Twitter. Click to visit twitter's website"/></a>
          <a href="https://www.tiktok.com"><img src="../socialicons/tik-tok.png" width="40" alt="Icon of TikTok. Click to visit TikTok's website"/></a>
        </div>
        <div className="text-gray-800 text-left"><span>Team Members:</span>
          <ul className="text-sm">
            <li>James Eberhard</li>
            <li>Boitumelo Hebert Meletse</li>
            <li>Benjamin Wasden</li>
            <li>Happiness Nonkululeko Ncube</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}