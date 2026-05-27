import { redirect } from "next/navigation";

import EditSheetMusicForm from "@/components/publisher/EditSheetMusicForm";
import { getCurrentUser } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";

type EditSheetMusicPageProps = {
  params: Promise<{
    id: string;
  }>;
};

//server page for the Edit Sheet Music
export default async function EditSheetMusicPage({
  params,
}: EditSheetMusicPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role.name !== "PUBLISHER" && user.role.name !== "ADMIN") {
    redirect("/dashboard");
  }

  const { id } = await params;

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
    redirect("/dashboard/publisher/music");
  }

  if (user.role.name !== "ADMIN" && sheetMusic.artistId !== user.id) {
    redirect("/dashboard/publisher/music");
  }

  const [voicings, instrumentations, categories] = await Promise.all([
    prisma.category.findMany({
      where: {
        group: "VOICING",
      },
      orderBy: {
        name: "asc",
      },
    }),

    prisma.category.findMany({
      where: {
        group: "INSTRUMENT",
      },
      orderBy: {
        name: "asc",
      },
    }),

    prisma.category.findMany({
      where: {
        group: "GENRE",
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-4xl rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">
          Edit Sheet Music
        </h1>

        <p className="mt-2 text-gray-600">
          Update the image artwork, title, price, or description.
        </p>

        <EditSheetMusicForm
          sheetMusic={sheetMusic}
          voicings={voicings}
          instrumentations={instrumentations}
          categories={categories}
        />
      </div>
    </main>
  );
}