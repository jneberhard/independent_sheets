import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import AddToCartButton from "@/components/music/AddToCartButton";
import { getCurrentUser } from "@/lib/currentUser";
import DeleteSongButton from "@/components/music/DeleteSong";

type MusicDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MusicDetailPage({ params }: MusicDetailPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();

  const sheetMusic = await prisma.sheetMusic.findUnique({
    where: {
      id,
    },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
    },
  });

  if (!sheetMusic) {
    notFound();
  }

  const formattedItem = {
    id: sheetMusic.id,
    title: sheetMusic.title,
    price: sheetMusic.priceCents / 100,
    imageUrl: sheetMusic.imageUrl,
    categories: sheetMusic.categories,
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-6 sm:p-8 shadow-sm border">

        {/* Top Navigation Row */}
        <div className="mb-6">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Catalog
          </Link>

          {user?.roleId == "role_admin" ? (
            <DeleteSongButton songId={id} />
          ) : null}
        </div>

        <div className="flex flex-col md:flex-row gap-8">

          <div className="w-full md:w-1/3 flex-shrink-0">
            {sheetMusic.imageUrl ? (
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl border">
                <Image
                  src={sheetMusic.imageUrl}
                  alt={sheetMusic.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="flex aspect-[3/4] items-center justify-center rounded-xl bg-gray-100 text-gray-400 border">
                No Artwork
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col justify-between">
            <div>
              {/* Displaying Categories Directly on Details View */}
              <div className="flex flex-wrap gap-1 mb-3">
                {sheetMusic.categories?.map((cat) => (
                  <span
                    key={cat.categoryId}
                    className="inline-flex items-center rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10"
                  >
                    {cat.category.name}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl font-black text-gray-900">
                {sheetMusic.title}
              </h1>

              <p className="mt-2 text-2xl font-bold text-gray-700">
                ${formattedItem.price.toFixed(2)}
              </p>

              {sheetMusic.description && (
                <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                  {sheetMusic.description}
                </p>
              )}
            </div>

            <div className="mt-8 border-t pt-6 flex flex-wrap items-center gap-4">
              <AddToCartButton item={formattedItem} />

              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--primary,border-gray-300)] bg-white px-5 py-2.5 text-sm font-bold text-[var(--primary,#111827)] shadow-sm transition hover:bg-gray-50 active:scale-[0.98]"
              >
                Continue Shopping
              </Link>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}