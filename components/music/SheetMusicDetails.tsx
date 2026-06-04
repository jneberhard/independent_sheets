import Link from "next/link";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
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
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8 rounded-2xl border border-[var(--secondary)] bg-white p-6 sm:p-8 shadow-sm md:grid-cols-2">

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

        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-[var(--primary)]">
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
            <span className="text-3xl font-black text-[var(--primary)]">
              ${decimalPrice.toFixed(2)}
            </span>

            {sheetMusic.canDownload ? (

              <Link
                href={`/api/sheet-music/${sheetMusic.id}/download`}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:opacity-90 transition"
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
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--primary)] bg-white py-3 text-center text-sm font-bold text-[var(--primary)] transition hover:bg-[var(--background)] active:scale-[0.99]">
                Continue Shopping
              </button>
            </Link>

            <Link href="/cart" className="flex-1">
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-transparent bg-slate-100 py-3 text-center text-sm font-bold text-[var(--primary)] transition hover:bg-slate-200 active:scale-[0.99]">
                Go to Checkout
              </button>
            </Link>

          </div>
        </div>
      </div>

      <ReviewsSection
        sheetMusicId={sheetMusic.id}
        reviews={sheetMusic.reviews}
        currentUser={user}
      />
    </div>
  );
}