import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CategoryGroup } from "@prisma/client";
import { SongGrid } from "@/components/SongGrid";

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
  // Find the requested category active filter context first
  const activeCategory = await prisma.category.findFirst({
    where: {
      slug: slug,
      group: group,
    },
  });

  if (!activeCategory) {
    notFound();
  }

  // Query sheet music entries filtered specifically down to this active category cross-join relation
  // Matching the strict select matrix required by our shared SongGrid
  const songs = await prisma.sheetMusic.findMany({
    where: {
      categories: {
        some: {
          category: {
            slug: slug,
            group: group,
          },
        },
      },
    },
    select: {
      id: true,
      title: true,
      priceCents: true,
      imageUrl: true,
      categories: {
        select: {
          category: {
            select: {
              name: true,
              group: true,
            },
          },
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
        <section className="mb-12 rounded-3xl bg-[var(--primary)] p-10 shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--card)]">
            {heading} Collection
          </p>
          <h1 className="mt-3 text-5xl font-extrabold tracking-tight text-[var(--card2)]">
            {activeCategory.name} Sheet Music
          </h1>
          <p className="mt-5 max-w-2xl text-xl leading-8 text-[var(--background)]/90">
            Browse our curated selection of professional arrangements optimized specifically for {activeCategory.name}.
          </p>
        </section>

        {songs.length === 0 ? (
          <div className="rounded-2xl border border-[var(--secondary)] bg-white p-12 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-[var(--card)]">
              No Pieces Found
            </h2>
            <p className="mt-4 leading-7 text-gray-600">
              We don&apos;t have any arrangements listed under {activeCategory.name} at the moment. Check back soon!
            </p>
          </div>
        ) : (
          /* Beautifully clean implementation using the shared component, passing currentPage as 1 since it's unpaginated */
          <SongGrid songs={songs} currentPage={1} />
        )}
      </div>
    </main>
  );
}