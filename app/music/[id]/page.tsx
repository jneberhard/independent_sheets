import { Suspense } from "react";
import SheetMusicDetails from "@/components/music/SheetMusicDetails";

type MusicPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MusicPage({ params }: MusicPageProps) {
  const { id } = await params;

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 px-6 py-12">
      <div className="w-full max-w-4xl">
        <Suspense fallback={<div className="text-center py-10">Loading sheet music details...</div>}>
          <SheetMusicDetails id={id} />
        </Suspense>
      </div>
    </main>
  );
}