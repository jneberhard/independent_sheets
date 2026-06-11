import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";

export default async function PublisherMusicPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role.name !== "PUBLISHER" && user.role.name !== "ADMIN") {
    redirect("/dashboard");
  }

  // UPDATED: Include categories relation mapping via Prisma query
  const sheetMusic = await prisma.sheetMusic.findMany({
    where:
      user.role.name === "ADMIN"
        ? {}
        : {
            artistId: user.id,
          },
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
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-6xl rounded-2xl border bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Sheet Music
            </h1>

            <p className="mt-2 text-gray-600">
              View and manage sheet music you have uploaded.
            </p>
          </div>

          <Link
            href="/dashboard/publisher/upload"
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
          >
            Upload New Music
          </Link>
        </div>

        {sheetMusic.length === 0 ? (
          <div className="mt-8 rounded-lg border bg-gray-50 p-6 text-gray-600">
            No sheet music uploaded yet.
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sheetMusic.map((music) => (
              <div
                key={music.id}
                className="flex flex-col justify-between overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md"
              >
                <div>
                  {music.imageUrl ? (
                    <Image
                      src={music.imageUrl}
                      alt={music.title}
                      width={500}
                      height={350}
                      unoptimized
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-gray-100 text-gray-500">
                      No image
                    </div>
                  )}

                  <div className="p-4">
                    {/* NEW: Responsive Category Tags Block */}
                    <div className="mb-2 flex flex-wrap gap-1">
                      {music.categories?.map((cat) => (
                        <span
                          key={cat.categoryId}
                          className="inline-flex items-center rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10"
                        >
                          {cat.category.name}
                        </span>
                      ))}
                    </div>

                    <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {music.title}
                    </h2>

                    <p className="mt-1 text-sm font-medium text-gray-600">
                      ${(music.priceCents / 100).toFixed(2)}
                    </p>

                    {music.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                        {music.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Sticky bottom card actions layout layout block */}
                <div className="border-t border-gray-100 px-4 py-3 bg-gray-50/50 flex gap-4">
                  <Link
                    href={`/music/${music.id}`}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
                  >
                    View Details
                  </Link>

                  <Link
                    href={`/dashboard/publisher/music/${music.id}/edit`}
                    className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition"
                  >
                    Edit
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
