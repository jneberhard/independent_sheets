import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";
import { SongGrid } from "@/components/SongGrid";

export const dynamic = "force-dynamic";

interface CatalogPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function PublisherMusicPage({ searchParams }: CatalogPageProps) {
  const user = await getCurrentUser();
  if (!user || (user.role.name !== "PUBLISHER" && user.role.name !== "ADMIN")) {
    redirect(!user ? "/login" : "/dashboard");
  }

  const resolvedParams = await searchParams;
  const currentPage = Math.max(1, parseInt(resolvedParams.page || "1", 10));
  const pageSize = 12;
  const skipValue = (currentPage - 1) * pageSize;

  const queryConditions = user.role.name === "ADMIN" ? {} : { artistId: user.id };

  const [songs, totalSongsCount] = await prisma.$transaction([
    prisma.sheetMusic.findMany({
      where: queryConditions,
      take: pageSize,
      skip: skipValue,
      select: {
        id: true,
        title: true,
        priceCents: true,
        imageUrl: true,
        categories: {
          select: {
            category: { select: { name: true, group: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.sheetMusic.count({ where: queryConditions }),
  ]);

  const totalPages = Math.ceil(totalSongsCount / pageSize) || 1;

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <section className="mb-12 rounded-3xl bg-[var(--primary)] p-10 text-white shadow-xl flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-black">Management Portal</p>
            <h1 className="mt-3 text-5xl font-extrabold tracking-tight text-[var(--card2)]">My Sheet Music</h1>
          </div>
          <Link href="/dashboard/publisher/upload" className="shrink-0 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-black shadow-md hover:bg-gray-50">
            Upload New Music
          </Link>
        </section>

        {songs.length === 0 ? (
          <div className="rounded-2xl border border-[var(--secondary)] bg-white p-12 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-[var(--card)]">No Sheet Music Uploaded Yet</h2>
          </div>
        ) : (
          <>
            {/* 💡 Using our shared component here with the isPublisher flag enabled */}
            <SongGrid songs={songs} currentPage={currentPage} isPublisher />

            {/* Pagination controls pointed to dashboard route */}
            <nav className="mt-14 flex flex-col items-center justify-center gap-4 border-t border-gray-600 pt-6 sm:flex-row sm:justify-between">
              <p className="text-sm font-medium text-white">
                Showing page <span className="font-bold text-white">{currentPage}</span> of <span className="font-bold text-white">{totalPages}</span>
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/dashboard/publisher/music?page=${currentPage - 1}`} className={`rounded border px-3 py-1.5 text-sm text-black font-semibold ${currentPage <= 1 ? "pointer-events-none opacity-40 bg-gray-100" : "bg-white"}`}>Previous</Link>
                {Array.from({ length: totalPages }, (_, i) => (
                  <Link key={i} href={`/dashboard/publisher/music?page=${i + 1}`} className={`rounded px-3.5 py-1.5 text-sm text-black font-bold ${i + 1 === currentPage ? "bg-black text-white" : "bg-white border"}`}>{i + 1}</Link>
                ))}
                <Link href={`/dashboard/publisher/music?page=${currentPage + 1}`} className={`rounded border px-3 py-1.5 text-sm text-black font-semibold ${currentPage >= totalPages ? "pointer-events-none opacity-40 bg-gray-100" : "bg-white"}`}>Next</Link>
              </div>
            </nav>
          </>
        )}
      </div>
    </main>
  );
}