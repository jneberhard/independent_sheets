import { notFound } from "next/navigation";
import Link from "next/link";

import { getCurrentUser } from "@/lib/currentUser";
import { getSheetMusicDetails } from "@/lib/music/musicdetails";

type SheetMusicDetailsProps = {
  id: string;
};

export default async function SheetMusicDetails({ id }: SheetMusicDetailsProps) {
  const user = await getCurrentUser();
  const sheetMusic = await getSheetMusicDetails(id, user?.id);

  if (!sheetMusic) {
    notFound();
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-8 rounded-2xl border bg-white p-8 shadow-sm md:grid-cols-2">
        <div className="flex aspect-[3/4] items-center justify-center rounded-xl border">
          {sheetMusic.imageUrl ? (
            <img
              src={sheetMusic.imageUrl}
              alt={sheetMusic.title}
              className="h-full w-full rounded-xl object-contain"
            />
          ) : (
            <span className="text-gray-400">No Preview Available</span>
          )}
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{sheetMusic.title}</h2>

            <p className="mt-4 leading-relaxed text-gray-600">
              {sheetMusic.description || "No description provided."}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {sheetMusic.categories.map((cat) => (
                <span
                  key={cat.categoryId}
                  className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-800 ring-1 ring-inset ring-blue-700/10 transition duration-200 ease-in-out hover:-translate-y-0.5 hover:scale-102"
                >
                  {cat.category.name}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
            <span className="text-2xl font-semibold text-gray-950">
              ${(sheetMusic.priceCents / 100).toFixed(2)}
            </span>

            {sheetMusic.canDownload ? (
              <Link
                href={`/api/sheet-music/${sheetMusic.id}/download`}
                className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
              >
                Download PDF
              </Link>
            ) : (
              <button className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800">
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PDF Component. Hidden for now until preview PDF is in place */}

      {/* <div className="mt-20 h-[600px] w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-inner">
        {sheetMusic.pdfUrl ? (
          <iframe
            src={`${sheetMusic.pdfUrl}#toolbar=0&navpanes=0`}
            className="h-full w-full"
            title={`PDF preview for ${sheetMusic.title}`}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            No preview file attached
          </div>
        )}
      </div> */}
    </div>
  );
}
