"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type SearchResult = {
  id: string;
  title: string;
  price?: number;
};

//search bar function
export default function SearchBar() {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const trimmedSearchTerm = searchTerm.trim();

      //to allow a delay before searching 
    const delayDebounce = setTimeout(async () => {
        if (!trimmedSearchTerm) {
        setSearchResults([]);
        setShowResults(false);
        return;
        }

        try {
        const response = await fetch(
            `/api/search?q=${encodeURIComponent(trimmedSearchTerm)}`
        );

        if (!response.ok) {
            throw new Error("Search failed");
        }

        const data = await response.json();

        setSearchResults(data.sheetMusic || []);
        setShowResults(true);
        } catch (error) {
        console.error(error);
        setSearchResults([]);
        setShowResults(false);
        }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);


  function handleSearch(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Enter" && searchTerm.trim()) {
      router.push(
        `/search?query=${encodeURIComponent(searchTerm.trim())}`
      );

      setShowResults(false);
    }
  }

  return (
    <div className="relative w-full max-w-sm">
      <input
        type="text"
        placeholder="Search song titles..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        onKeyDown={handleSearch}
        onFocus={() =>
          searchResults.length > 0 && setShowResults(true)
        }
        onBlur={() =>
          setTimeout(() => setShowResults(false), 200)
        }
        className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {showResults && searchResults.length > 0 && (
        <ul className="absolute left-0 top-full z-50 mt-1 max-h-64 w-full overflow-auto rounded-md border bg-white shadow-lg">
          {searchResults.map((music) => (
            <li
              key={music.id}
              className="border-b last:border-b-0"
            >
              <Link
                href={`/music/${music.id}`}
                onClick={() => setShowResults(false)}
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                <div className="font-medium text-gray-900">
                  {music.title}
                </div>

                {music.price !== undefined && (
                  <div className="text-xs text-gray-500">
                    ${music.price.toFixed(2)}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}