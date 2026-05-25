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

  const sheetMusic = await prisma.sheetMusic.findMany({
    where:
      user.role.name === "ADMIN"
        ? {}
        : {
            artistId: user.id,
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
                className="overflow-hidden rounded-xl border bg-white shadow-sm"
              >
                {music.imageUrl ? (
                  <Image
                    src={music.imageUrl}
                    alt={music.title}
                    width={500}
                    height={350}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center bg-gray-100 text-gray-500">
                    No image
                  </div>
                )}

                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {music.title}
                  </h2>

                  <p className="mt-1 text-sm text-gray-600">
                    ${(music.priceCents / 100).toFixed(2)}
                  </p>

                  {music.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                      {music.description}
                    </p>
                  )}

                  <div className="mt-4 flex gap-3">
                    <Link
                      href={`/music/${music.id}`}
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      View
                    </Link>

                    <Link
                      href={`/dashboard/publisher/music/${music.id}/edit`}
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}