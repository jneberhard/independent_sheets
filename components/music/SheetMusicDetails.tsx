import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, Music, FileText } from "lucide-react";
import Image from "next/image";
import { getCurrentUser } from "@/lib/currentUser";
import { getSheetMusicDetails } from "@/lib/music/musicdetails";
import ReviewsSection from "./ReviewsSection";
import AddToCartButton from "./AddToCartButton";

type SheetMusicDetailsProps = {
  id: string;
};

export default async function SheetMusicDetails({ id }: SheetMusicDetailsProps) {
  const user = await getCurrentUser();
  const sheetMusic = await getSheetMusicDetails(id, user?.id);

  if (!sheetMusic) {
    notFound();
  }

  const decimalPrice = sheetMusic.priceCents / 100;

  return (
    <div>
      <div className="space-y-8">
        {/* PREVIEW AUDIO & SCORE EXTENSION PANEL */}
      <div className="grid gap-6 rounded-2xl border border-[var(--secondary)] bg-white p-6 sm:p-8 shadow-sm">
        <h3 className="text-xl font-bold text-black mb-2">Free Previews</h3>

        {/* Audio Layer */}
        {sheetMusic.previewMp3Url ? (
          <div className="rounded-xl border bg-slate-50 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Music className="h-4 w-4 text-gray-900" />
              <span>Audio Demo Preview</span>
            </div>
            <audio
              src={sheetMusic.previewMp3Url}
              controls
              controlsList="nodownload"
              className="w-full focus:outline-none"
            />
          </div>
        ) : null}

        {/* 2-Page Watermarked Sample */}
        {sheetMusic.previewLink ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FileText className="h-4 w-4 text-gray-900" />
              <span>Score Sample Excerpt (First 2 Pages)</span>
            </div>
            <div className="overflow-hidden rounded-xl border bg-gray-100 shadow-inner">
              <iframe
                src={`${sheetMusic.previewLink}#toolbar=0&navpanes=0`}
                className="h-[600px] w-full border-0"
                title={`Sample Score - ${sheetMusic.title}`}
              />
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-400">
            No partial look-ahead score copy is generated for this entry.
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 gap-8 rounded-2xl border border-[var(--secondary)] bg-white p-6 sm:p-8 shadow-sm md:grid-cols-2">

          {/*Image Preview Section */}
        <div className="relative flex aspect-[3/4] w-full items-center justify-center rounded-xl border border-[var(--secondary)] bg-[var(--background)] overflow-hidden">
          {sheetMusic.imageUrl ? (
            <Image
              src={sheetMusic.imageUrl}
              alt={sheetMusic.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
            />
          ) : (
            <span className="text-gray-400 font-medium">No Preview Available</span>
          )}
        </div>

        {/* Details Section */}
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-black">
              {sheetMusic.title}
            </h2>

            <p className="mt-4 leading-relaxed text-gray-600 text-sm sm:text-base">
              {sheetMusic.description || "No description provided for this collection."}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {sheetMusic.categories.map((cat) => (
                <span
                  key={cat.categoryId}
                  className="inline-flex items-center rounded-md bg-[var(--background)] px-2.5 py-1 text-xs font-semibold text-[var(--primary)] border border-[var(--secondary)] transition hover:-translate-y-0.5"
                >
                  {cat.category.name}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-[var(--secondary)] pt-6">
            <span className="text-3xl font-black text-black">
              ${decimalPrice.toFixed(2)}
            </span>

            {sheetMusic.canDownload ? (
              <Link
                href={`/api/sheet-music/${sheetMusic.id}/download`}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-bold text-black shadow-sm hover:opacity-70 transition"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Link>
            ) : (

              <AddToCartButton
                item={{
                  id: sheetMusic.id,
                  title: sheetMusic.title,
                  price: decimalPrice,
                  imageUrl: sheetMusic.imageUrl
                }}
              />
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <Link href="/catalog" className="flex-1">
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--primary)] bg-white py-3 text-center text-sm font-bold text-black transition hover:bg-[var(--background)] hover:text-white active:scale-[0.99]">
                Continue Shopping
              </button>
            </Link>

            <Link href="/cart" className="flex-1">
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-transparent bg-slate-100 py-3 text-center text-sm font-bold text-black transition hover:bg-slate-200 active:scale-[0.99]">
                Go to Checkout
              </button>
            </Link>

          </div>
        </div>
      </div>

    </div>
    <ReviewsSection sheetMusicId={sheetMusic.id} reviews={sheetMusic.reviews} currentUser={user} />
    </div>
  );
}