import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/currentUser";
import DeleteSongButton from "@/components/music/DeleteSong";
import SheetMusicDetails from "@/components/music/SheetMusicDetails";

type MusicDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MusicDetailPage({ params }: MusicDetailPageProps) {
  const { id } = await params;
  // Done to check for admin permissions
  const user = await getCurrentUser();

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

        {/* If user is an admin, give them permissions to delete the song on the detail page */}
        {user?.roleId == "role_admin" ? (<DeleteSongButton songId={id} />) : null}

        <SheetMusicDetails id={id} />
        </div>
    </main>
  );
}