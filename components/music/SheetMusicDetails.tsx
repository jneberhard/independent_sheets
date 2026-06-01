import { notFound } from "next/navigation";
import { getSheetMusicDetails } from "@/lib/music/musicdetails";
import Link from "next/link";

type SheetMusicDetailsProps = {
  id: string;
};

export default async function SheetMusicDetails({ id }: SheetMusicDetailsProps) {

    // Discuss with team - calling it w/ API from here is tidier w/ code and more reusable, but
    // seems to load slower
    const sheetMusic = await getSheetMusicDetails(id);

    if (!sheetMusic) {
        notFound();
    }

    return (
        <div>
            <div className="rounded-2xl border bg-white p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="rounded-xl aspect-[3/4] flex items-center justify-center">
                    {sheetMusic.imageUrl ? (<img src={sheetMusic.imageUrl} alt={sheetMusic.title} className="rounded-xl object-contain h-full w-full" />)
                    : (<span className="text-gray-400">No Preview Available</span>)}
                </div>

                <div className="flex flex-col justify-between">
                    <div>
                    <h2 className="text-3xl font-bold text-gray-900">{sheetMusic.title}</h2>
                    <p className="mt-4 text-gray-600 leading-relaxed">
                        {sheetMusic.description || "No description provided."}
                    </p>

                        <div className="mt-6 flex flex-wrap gap-2">
                            {sheetMusic.categories.map((cat) => (
                                // Link would be super cool to have but it's not necessary. Asking team about adding it
                            // <Link href={`/catalog/voicing/${cat.category.name}`} key={cat.categoryId} >
                                <span
                                // Comment this line if Link is utilized
                                key={cat.categoryId}
                                //
                                className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-800 ring-1 ring-inset ring-blue-700/10 transition duration-200 ease-in-out hover:-translate-y-0.5 hover:scale-102"
                            >
                                {cat.category.name}
                            </span>
                            // </Link>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-2xl font-semibold text-gray-950">
                        ${(sheetMusic.priceCents / 100).toFixed(2)}
                    </span>
                    <button className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800">
                        Add to Cart
                    </button>
                    </div>
                </div>
            </div>

            {/* PDF Component. Hidden for now until preview PDF is in place */}

            {/* <div className="w-full h-[600px] rounded-xl border border-gray-200 overflow-hidden shadow-inner bg-gray-100 mt-20">
            {sheetMusic.pdfUrl ? (
                <iframe
                src={`${sheetMusic.pdfUrl}#toolbar=0&navpanes=0`}
                className="w-full h-full"
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