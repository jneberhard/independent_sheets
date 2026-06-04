import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function FullCatalogPage() {
  const songs = await prisma.sheetMusic.findMany({
    include: {
      categories: {
        include: {
          category: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <section className="mb-12 rounded-3xl bg-[var(--primary)] p-10 text-white shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
            Explore
          </p>
          <h1 className="mt-3 text-5xl font-extrabold tracking-tight">
            Complete Catalog
          </h1>
          <p className="mt-5 max-w-2xl text-xl leading-8 text-[var(--background)]/90">
            Browse our full selection of professional sheet music, from
            classical masterpieces to modern jazz essentials.
          </p>
        </section>

        {songs.length === 0 ? (
          <div className="rounded-2xl border border-[var(--secondary)] bg-white p-12 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-[var(--primary)]">
              No Sheet Music Published
            </h2>
            <p className="mt-4 leading-7 text-gray-600">
              Check back soon—new pieces are being added to the catalog
              regularly.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {songs.map((song) => {
              const voicings = song.categories
                .filter((item) => item.category.group === "VOICING")
                .map((item) => item.category.name);

              const instruments = song.categories
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
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--secondary)] bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
                  {/* image section */ }
                  <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100">
                    {song.imageUrl ? (
                      <Image
                        src={song.imageUrl}
                        alt={`Cover art for ${song.title}`}
                        width={400}
                        height={533}
                        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center text-gray-400">
                        <svg
                          className="h-12 w-12"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span className="text-sm font-medium">
                          No Cover Image
                        </span>
                      </div>
                    )}
                  </div>

                  {/* information section */ }
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                        Sheet Music
                      </p>

                      <h2 className="mt-2 text-xl font-bold leading-tight text-[var(--primary)] line-clamp-2 group-hover:text-teal-700">
                        {song.title}
                      </h2>

                      {/* Tags/Badges section */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-[var(--background)] px-3 py-1 text-xs font-bold text-[var(--primary)]">
                          {formattedPrice}
                        </span>

                        {voicings.slice(0, 2).map((name) => (
                          <span
                            key={`voicing-${name}`}
                            className="rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-semibold text-white"
                          >
                            {name}
                          </span>
                        ))}

                        {instruments.slice(0, 1).map((name) => (
                          <span
                            key={`instrument-${name}`}
                            className="rounded-full bg-[var(--secondary)] px-3 py-1 text-xs font-semibold text-[var(--primary)]"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 border-t border-gray-100 pt-4 text-center text-sm font-semibold text-[var(--primary)] group-hover:underline">
                      View Details
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}