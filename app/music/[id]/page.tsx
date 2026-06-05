import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/currentUser";
import { getSheetMusicDetails } from "@/lib/music/musicdetails";
import DeleteSongButton from "@/components/music/DeleteSong";
import SheetMusicDetails from "@/components/music/SheetMusicDetails";

type MusicDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MusicDetailPage({ params }: MusicDetailPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();

  const sheetMusic = await getSheetMusicDetails(id)

  if (!sheetMusic) {
    notFound();
  }

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
        </div>

        {user?.roleId == "role_admin" ? (<DeleteSongButton songId={id} />) : null}

        <SheetMusicDetails id={sheetMusic.id} />
        </div>
    </main>
  );
}