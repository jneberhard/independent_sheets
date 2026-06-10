"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type CategoryForEdit = {
  id: string;
  name: string;
  slug: string;
  group: "VOICING" | "INSTRUMENT" | "GENRE";
};

type SheetMusicForEdit = {
  id: string;
  title: string;
  description: string | null;
  externalUrl?: string | null; // Added externalUrl field to types
  priceCents: number;
  imageUrl: string | null;
  pdfUrl?: string | null;
  previewLink?: string | null;
  previewMp3Url?: string | null;
  categories: {
    id: string;
    sheetMusicId: string;
    categoryId: string;
    category: CategoryForEdit;
  }[];
};

type EditSheetMusicFormProps = {
  sheetMusic: SheetMusicForEdit;
  voicings: CategoryForEdit[];
  instrumentations: CategoryForEdit[];
  categories: CategoryForEdit[];
};

//sets up to Edit Sheet Music
export default function EditSheetMusicForm({
  sheetMusic,
  voicings,
  instrumentations,
  categories,
}: EditSheetMusicFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(sheetMusic.title);
  const [description, setDescription] = useState(
    sheetMusic.description ?? ""
  );
  const [externalUrl, setExternalUrl] = useState(
    sheetMusic.externalUrl ?? ""
  ); // Added local state for external media URL
  const [priceCents, setPriceCents] = useState(
    String(sheetMusic.priceCents)
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [mp3File, setMp3File] = useState<File | null>(null);

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    sheetMusic.categories.map((item) => item.categoryId)
  );
  const [isSaving, setIsSaving] = useState(false);

  function toggleCategory(categoryId: string) {
    setSelectedCategoryIds((currentIds) => {
      if (currentIds.includes(categoryId)) {
        return currentIds.filter((id) => id !== categoryId);
      }

      return [...currentIds, categoryId];
    });
  }

  async function uploadFile(file: File, folder: string) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload to ${folder} failed`);
    }

    return response.json();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);

    try {
      let imageUrl = sheetMusic.imageUrl;
      let pdfUrl = sheetMusic.pdfUrl;
      let previewLink = sheetMusic.previewLink;
      let previewMp3Url = sheetMusic.previewMp3Url;

      if (imageFile) {
        const imageUpload = await uploadFile(imageFile, "images");
        imageUrl = imageUpload.url;
      }

      if (pdfFile) {
        const pdfUpload = await uploadFile(pdfFile, "sheet-music");
        pdfUrl = pdfUpload.url;
        previewLink = pdfUpload.previewUrl;
      }

      if (mp3File) {
        const mp3Upload = await uploadFile(mp3File, "previews");
        previewMp3Url = mp3Upload.url;
      }

      const response = await fetch(`/api/sheet-music/${sheetMusic.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          externalUrl: externalUrl || null, // Sent to backend payload
          priceCents: Number(priceCents),
          imageUrl,
          pdfUrl,
          previewLink,
          previewMp3Url,
          categoryIds: selectedCategoryIds,
        }),
      });

      if (!response.ok) {
        throw new Error("Update failed");
      }

      router.push("/dashboard/publisher/music");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Sheet music could not be updated.");
    } finally {
      setIsSaving(false);
    }
  }

  function renderCategoryCheckboxes(
    label: string,
    options: CategoryForEdit[]
  ) {
    return (
      <section className="rounded-xl border bg-gray-50 p-4">
        <h2 className="text-base font-bold text-gray-900">{label}</h2>

        {options.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">
            No options have been added yet.
          </p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {options.map((option) => (
              <label
                key={option.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg border bg-white px-3 py-2 text-sm text-gray-700"
              >
                <input
                  type="checkbox"
                  checked={selectedCategoryIds.includes(option.id)}
                  onChange={() => toggleCategory(option.id)}
                  className="h-4 w-4"
                />
                <span>{option.name}</span>
              </label>
            ))}
          </div>
        )}
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Title
        </label>
        <input
          className="mt-2 w-full rounded-md border px-3 py-2"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Description
        </label>
        <textarea
          className="mt-2 w-full rounded-md border px-3 py-2"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
        />
      </div>

      {/* Added External URL Field Section */}
      <div>
        <label className="block text-sm font-semibold text-gray-700">
          External Media Link (YouTube, SoundCloud, etc.)
        </label>
        <input
          type="url"
          className="mt-2 w-full rounded-md border px-3 py-2"
          placeholder="https://www.youtube.com/watch?v=..."
          value={externalUrl}
          onChange={(event) => setExternalUrl(event.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Price in cents
        </label>
        <input
          className="mt-2 w-full rounded-md border px-3 py-2"
          value={priceCents}
          onChange={(event) => setPriceCents(event.target.value)}
          required
        />
      </div>

      {renderCategoryCheckboxes("Voicing", voicings)}
      {renderCategoryCheckboxes("Instrumentation", instrumentations)}
      {renderCategoryCheckboxes("Categories", categories)}

      <div className="space-y-4 border-t pt-4">
        <h3 className="text-sm font-bold text-gray-900">Media Files Updates</h3>

        {/* Sheet Music PDF Upload Entry */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Replace Full Score PDF (Triggers Sample Auto-Generation)
          </label>
          <div className="mt-2 flex items-center gap-4">
            <label className="cursor-pointer rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600">
              Choose PDF
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(event) => setPdfFile(event.target.files?.[0] ?? null)}
              />
            </label>
            <span className="text-sm text-gray-600">
              {pdfFile ? pdfFile.name : "No new score selected"}
            </span>
          </div>
        </div>

        {/* Audio MP3 Upload Entry */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Upload / Replace Preview MP3
          </label>
          <div className="mt-2 flex items-center gap-4">
            <label className="cursor-pointer rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600">
              Choose MP3
              <input
                type="file"
                accept="audio/mpeg,audio/mp3"
                className="hidden"
                onChange={(event) => setMp3File(event.target.files?.[0] ?? null)}
              />
            </label>
            <span className="text-sm text-gray-600">
              {mp3File ? mp3File.name : "No new audio selected"}
            </span>
          </div>
        </div>

        {/* Image Artwork Interface */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Replace Image Artwork
          </label>
          <div className="mt-2 flex items-center gap-4">
            <label className="cursor-pointer rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600">
              Choose Image
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
              />
            </label>
            <span className="text-sm text-gray-600">
              {imageFile ? imageFile.name : "No new image selected"}
            </span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="w-full rounded-md bg-black px-4 py-3 font-medium text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {isSaving ? "Uploading Files & Saving Changes..." : "Save Changes"}
      </button>
    </form>
  );
}