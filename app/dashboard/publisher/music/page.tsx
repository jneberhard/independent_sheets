import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";

const ITEMS_PER_PAGE = 12;

export default async function PublisherMusicPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role.name !== "PUBLISHER" && user.role.name !== "ADMIN") {
    redirect("/dashboard");
  }

  // Admins can see the full list for support/testing, while publishers only see
  // the music they personally uploaded.
  const sheetMusic = await prisma.sheetMusic.findMany({
    where:
      user.role.name === "ADMIN"
        ? {}
        : {
            artistId: user.id,
          },
    take: ITEMS_PER_PAGE,
    select: {
      id: true,
      title: true,
      priceCents: true,
      description: true,
      imageUrl: true,
      categories: {
        select: {
          categoryId: true,
          category: {
            select: {
              name: true,
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
    <main className="min-h-screen bg-gray-50 px-6 py-12 text-gray-900">
      <div className="mx-auto max-w-6xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Sheet Music
            </h1>
            <p className="mt-2 text-gray-700">
              View and manage sheet music you have uploaded.
            </p>
          </div>

          <Link
            href="/dashboard/publisher/upload"
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            Upload New Music
          </Link>
        </div>

        {sheetMusic.length === 0 ? (
          <div role="status" className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-6 text-gray-700 font-medium">
            No sheet music uploaded yet.
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sheetMusic.map((music) => (
              <article
                key={music.id}
                className="flex flex-col justify-between overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div>
                  {music.imageUrl ? (
                    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                      <Image
                        src={music.imageUrl}
                        alt={`Cover artwork for ${music.title}`}
                        width={400} // 💡 Max display size in the grid column
                        height={260}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // 💡 Tells browser exactly what size image to fetch
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-102"
                        priority={sheetMusic.indexOf(music) < 3} // 💡 Performance: Preloads first 3 images above the fold to maximize LCP
                      />
                    </div>
                  ) : (
                    <div className="flex h-48 w-full items-center justify-center bg-gray-100 text-gray-700 font-medium" aria-hidden="true">
                      No cover image
                    </div>
                  )}

                  <div className="p-4">
                    <div className="mb-2 flex flex-wrap gap-1" aria-label="Music categories">
                      {music.categories?.map((cat) => (
                        <span
                          key={cat.categoryId}
                          className="inline-flex items-center rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-800 ring-1 ring-inset ring-blue-700/20"
                        >
                          {cat.category.name}
                        </span>
                      ))}
                    </div>

                    <h2 className="text-lg font-bold text-gray-900 line-clamp-1">
                      {music.title}
                    </h2>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      ${(music.priceCents / 100).toFixed(2)}
                    </p>

                    {music.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-gray-700">
                        {music.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-3 bg-gray-50/50 flex gap-4">
                  <Link
                    href={`/music/${music.id}`}
                    className="text-sm font-bold text-blue-700 hover:text-blue-900 transition focus-visible:outline-none focus-visible:underline rounded"
                  >
                    View Details <span className="sr-only">for {music.title}</span>
                  </Link>

                  <Link
                    href={`/dashboard/publisher/music/${music.id}/edit`}
                    className="text-sm font-bold text-gray-700 hover:text-gray-900 transition focus-visible:outline-none focus-visible:underline rounded"
                  >
                    Edit <span className="sr-only">{music.title}</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}