import { redirect } from "next/navigation";

import PublisherUploadForm from "@/components/publisher/PublisherUploadForm";
import { getCurrentUser } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma"

//upload sheet music page
export default async function PublisherUploadPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role.name !== "PUBLISHER" && user.role.name !== "ADMIN") {
    redirect("/dashboard");
  }

  const categories = await prisma.category.findMany({
    orderBy: [
      {
        group: "asc",
      },
      {
        name: "asc",
      },
    ],
  });

  // The upload form gets categories split into three groups so the UI can show
  // voicing, instrument, and genre selectors separately.
  const voicingCategories = categories.filter(
    (category) => category.group === "VOICING"
  );

  const instrumentCategories = categories.filter(
    (category) => category.group === "INSTRUMENT"
  );

  const genreCategories = categories.filter(
    (category) => category.group === "GENRE"
  );

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-5xl rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">
          Upload Sheet Music
        </h1>

        <p className="mt-4 text-gray-600">
          Add a PDF, preview MP3, artwork image, title, description, and price.
        </p>

        <PublisherUploadForm
          voicingCategories={voicingCategories}
          instrumentCategories={instrumentCategories}
          genreCategories={genreCategories}
        />
      </div>
    </main>
  );
}
