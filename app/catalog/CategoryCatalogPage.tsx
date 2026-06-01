import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryGroup } from "@prisma/client";

import { prisma } from "@/lib/prisma";

type CategoryCatalogPageProps = {
  group: CategoryGroup;
  slug: string;
  heading: string;
};

export default async function CategoryCatalogPage({
  group,
  slug,
  heading,
}: CategoryCatalogPageProps) {
  const category = await prisma.category.findUnique({
    where: {
      group_slug: {
        group,
        slug,
      },
    },
    include: {
      sheetMusicCategories: {
        include: {
          sheetMusic: {
            include: {
              categories: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!category) {
    notFound();
  }

  const songs = category.sheetMusicCategories.map((item) => item.sheetMusic);

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-3xl bg-[var(--primary)] p-8 text-white shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--accent)]">
            {heading}
          </p>

          <h1 className="mt-3 text-4xl font-bold">{category.name}</h1>

          <p className="mt-4 text-lg text-[var(--background)]">
            Browse sheet music listed under this category.
          </p>
        </section>

        <section className="mt-8">
          {songs.length === 0 ? (
            <div className="rounded-2xl border border-[var(--secondary)] bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[var(--primary)]">
                No Sheet Music Found
              </h2>

              <p className="mt-3 leading-7 text-gray-700">
                Nothing has been published in {category.name} yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {songs.map((song) => {
                const voicings = song.categories
                  .filter((item) => item.category.group === "VOICING")
                  .map((item) => item.category.name);

                const instruments = song.categories
                  .filter((item) => item.category.group === "INSTRUMENT")
                  .map((item) => item.category.name);

                const genres = song.categories
                  .filter((item) => item.category.group === "GENRE")
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

                          {voicings.map((name) => (
                            <span
                              key={`voicing-${name}`}
                              className="rounded-full bg-[var(--accent)] px-3 py-1 text-sm font-semibold text-white"
                            >
                              {name}
                            </span>
                          ))}

                          {instruments.map((name) => (
                            <span
                              key={`instrument-${name}`}
                              className="rounded-full bg-[var(--secondary)] px-3 py-1 text-sm font-semibold text-[var(--primary)]"
                            >
                              {name}
                            </span>
                          ))}

                          {genres.map((name) => (
                            <span
                              key={`genre-${name}`}
                              className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700"
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="hidden rounded-full bg-[var(--background)] px-4 py-2 text-sm font-semibold text-[var(--primary)] sm:block">
                        View
                      </div>
                    </div>
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
