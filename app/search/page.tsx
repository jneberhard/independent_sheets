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
  priceCents: number;
  categories: {
    category: {
      id: string;
      name: string;
      group: "VOICING" | "INSTRUMENT" | "GENRE";
    };
  }[];
};

// Read the search query from the URL,
// query the database,
// and return matching titles
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
      priceCents: true,
      categories: {
        include: {
          category: {
            select: {
              id: true,
              name: true,
              group: true,
            },
          },
        },
      },
    },
  });

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-12">
      <div className="mx-auto max-w-5xl">
        {/* Header Section */}
        <section className="rounded-3xl bg-[var(--primary)] p-8 text-white shadow-lg">
          <h1 className="mt-3 text-4xl font-bold">Search Results</h1>

          <p className="mt-4 text-lg text-[var(--background)]">
            Results for:{" "}
            <span className="font-semibold">
              {query || "All Sheet Music"}
            </span>
          </p>
        </section>

        {/* Results Section */}
        <section className="mt-8">
          {songs.length === 0 ? (
            <div className="rounded-2xl border border-[var(--secondary)] bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[var(--primary)]">
                No Results Found
              </h2>

              <p className="mt-3 leading-7 text-gray-700">
                We could not find any sheet music matching your search.
                Try another title, voicing, instrumentation, or genre.
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {songs.map((song: SongResult) => {
                const voicings = song.categories
                  .filter((item) => item.category.group === "VOICING")
                  .map((item) => item.category.name);

                const instrumentations = song.categories
                  .filter((item) => item.category.group === "INSTRUMENT")
                  .map((item) => item.category.name);

                const formattedPrice = new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(song.priceCents / 100);

                return (
                  <Link
                    key={song.id}
                    href={`/music/${song.id}`}
                    className="group rounded-2xl border border-[var(--secondary)] bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium uppercase tracking-wide text-[var(--accent)]">
                          Sheet Music
                        </p>

                        <h2 className="mt-2 text-2xl font-bold text-[var(--primary)]">
                          {song.title}
                        </h2>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="rounded-full bg-[var(--background)] px-3 py-1 text-sm font-semibold text-[var(--primary)]">
                            {formattedPrice}
                          </span>

                          {voicings.length > 0 && (
                            <span className="rounded-full bg-[var(--accent)] px-3 py-1 text-sm font-semibold text-white">
                              Voicing: {voicings.join(", ")}
                            </span>
                          )}

                          {instrumentations.length > 0 && (
                            <span className="rounded-full bg-[var(--secondary)] px-3 py-1 text-sm font-semibold text-[var(--primary)]">
                              Instrumentation: {instrumentations.join(", ")}
                            </span>
                          )}

                          {voicings.length === 0 && instrumentations.length === 0 && (
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-600">
                              No voicing or instrumentation listed
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="hidden rounded-full bg-[var(--background)] px-4 py-2 text-sm font-semibold text-[var(--primary)] sm:block">
                        View →
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-gray-700">
                      View this sheet music listing to see details,
                      preview information, and purchasing options.
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}