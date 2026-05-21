import Link from "next/link";
import { prisma } from "@/lib/prisma";

type SearchPageProps = {
  searchParams: Promise<{
    query?: string;
  }>;
};

type SongResult = {
  id: string;
  title: string;
};

//read the search from the URL, queries database, returns matching titles
export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const params = await searchParams;

  const query = params.query ?? "";

  const songs: SongResult[] = await prisma.sheetMusic.findMany({
    where: {
        title: {
        contains: query,
        mode: "insensitive",
        },
    },
    orderBy: {
        title: "asc",
    },
    select: {
        id: true,
        title: true,
    },
    });

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold text-white">
        Search Results
      </h1>

      <p className="mt-2 text-white">
        Results for: <span className="font-medium">{query}</span>
      </p>

      <div className="mt-8 space-y-4">
        {songs.length === 0 && (
          <p className="text-white">
            No matching sheet music found.
          </p>
        )}

        {songs.map((song: SongResult) => (
          <Link
            key={song.id}
            href={`/music/${song.id}`}
            className="block rounded-lg border bg-white p-4 shadow-sm hover:bg-gray-50"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              {song.title}
            </h2>
          </Link>
        ))}
      </div>
    </main>
  );
}