"use client";

import { useRouter } from "next/navigation";
import { useState, useId } from "react";

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
  externalUrl?: string | null;
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

export default function EditSheetMusicForm({
  sheetMusic,
  voicings,
  instrumentations,
  categories,
}: EditSheetMusicFormProps) {
  const router = useRouter();

  const titleFieldId = useId();
  const descriptionFieldId = useId();
  const externalUrlFieldId = useId();
  const priceFieldId = useId();
  const pdfFieldId = useId();
  const mp3FieldId = useId();
  const imageFieldId = useId();

  const [title, setTitle] = useState(sheetMusic.title);
  const [description, setDescription] = useState(sheetMusic.description ?? "");
  const [externalUrl, setExternalUrl] = useState(sheetMusic.externalUrl ?? "");
  const [priceCents, setPriceCents] = useState(String(sheetMusic.priceCents));
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
    // Parse data regardless of what result is
    // This is done to get error msg in case the error is caused
    // by encryption/password protection
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error(parseError)
      throw new Error(`Server returned status ${response.status} and couldn't read response.`);
    }
    if (!response.ok) {
      if (data && data.error) {
        throw new Error(data.error);
      }
      throw new Error("File upload failed on the server.");
    }
    return data;
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
          externalUrl: externalUrl || null,
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
      } catch (error: any) {
          console.error("Upload error:", error);
        alert(error.message || "An error occurred during upload. Please try again.");
      } finally {
        setIsSaving(false);
    }
  }

  function renderCategoryCheckboxes(label: string, options: CategoryForEdit[]) {
    return (
      <fieldset className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <legend className="text-base font-bold text-gray-900 px-1">{label}</legend>

        {options.length === 0 ? (
          <p className="mt-3 text-sm text-gray-700">
            No options have been added yet.
          </p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {options.map((option) => {
              const checkboxId = `cat-${option.id}`;
              return (
                <label
                  key={option.id}
                  htmlFor={checkboxId}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 font-medium shadow-sm hover:bg-gray-50"
                >
                  <input
                    id={checkboxId}
                    type="checkbox"
                    checked={selectedCategoryIds.includes(option.id)}
                    onChange={() => toggleCategory(option.id)}
                    className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                  />
                  <span>{option.name}</span>
                </label>
              );
            })}
          </div>
        )}
      </fieldset>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6 text-gray-900">

      {/* Title Field */}
      <div>
        <label htmlFor={titleFieldId} className="block text-sm font-semibold text-gray-900">
          Title
        </label>
        <input
          id={titleFieldId}
          type="text"
          className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </div>

      {/* Description Field */}
      <div>
        <label htmlFor={descriptionFieldId} className="block text-sm font-semibold text-gray-900">
          Description
        </label>
        <textarea
          id={descriptionFieldId}
          className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
        />
      </div>

      {/* External URL Field */}
      <div>
        <label htmlFor={externalUrlFieldId} className="block text-sm font-semibold text-gray-900">
          External Media Link (YouTube, SoundCloud, etc.)
        </label>
        <input
          id={externalUrlFieldId}
          type="url"
          className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          placeholder="https://www.youtube.com/watch?v=..."
          value={externalUrl}
          onChange={(event) => setExternalUrl(event.target.value)}
        />
      </div>

      {/* Price Field */}
      <div>
        <label htmlFor={priceFieldId} className="block text-sm font-semibold text-gray-900">
          Price in cents
        </label>
        <input
          id={priceFieldId}
          type="number"
          className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          value={priceCents}
          onChange={(event) => setPriceCents(event.target.value)}
          required
        />
      </div>

      {/* Dynamic Category Blocks */}
      {renderCategoryCheckboxes("Voicing", voicings)}
      {renderCategoryCheckboxes("Instrumentation", instrumentations)}
      {renderCategoryCheckboxes("Categories", categories)}

      {/* Media Updates Cluster */}
      <div className="space-y-4 border-t border-gray-200 pt-4">
        <h3 className="text-sm font-bold text-gray-900">Media Files Updates</h3>

        {/* PDF File Entry */}
        <div>
          <label htmlFor={pdfFieldId} className="block text-sm font-semibold text-gray-900">
            Replace Full Score PDF (Triggers Sample Auto-Generation)
          </label>
          <div className="mt-2 flex items-center gap-4">
            <input
              id={pdfFieldId}
              type="file"
              accept="application/pdf"
              className="sr-only"
              onChange={(event) => setPdfFile(event.target.files?.[0] ?? null)}
            />
            <label
              htmlFor={pdfFieldId}
              className="cursor-pointer rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 focus-within:ring-2 focus-within:ring-black focus-within:ring-offset-2"
            >
              Choose PDF
            </label>
            <span className="text-sm text-gray-700" aria-live="polite">
              {pdfFile ? pdfFile.name : "No new score selected"}
            </span>
          </div>
        </div>

        {/* Audio MP3 Entry */}
        <div>
          <label htmlFor={mp3FieldId} className="block text-sm font-semibold text-gray-900">
            Upload / Replace Preview MP3
          </label>
          <div className="mt-2 flex items-center gap-4">
            <input
              id={mp3FieldId}
              type="file"
              accept="audio/mpeg,audio/mp3"
              className="sr-only"
              onChange={(event) => setMp3File(event.target.files?.[0] ?? null)}
            />
            <label
              htmlFor={mp3FieldId}
              className="cursor-pointer rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 focus-within:ring-2 focus-within:ring-black focus-within:ring-offset-2"
            >
              Choose MP3
            </label>
            <span className="text-sm text-gray-700" aria-live="polite">
              {mp3File ? mp3File.name : "No new audio selected"}
            </span>
          </div>
        </div>

        {/* Artwork Image Entry */}
        <div>
          <label htmlFor={imageFieldId} className="block text-sm font-semibold text-gray-900">
            Replace Image Artwork
          </label>
          <div className="mt-2 flex items-center gap-4">
            <input
              id={imageFieldId}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
            />
            <label
              htmlFor={imageFieldId}
              className="cursor-pointer rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 focus-within:ring-2 focus-within:ring-black focus-within:ring-offset-2"
            >
              Choose Image
            </label>
            <span className="text-sm text-gray-700" aria-live="polite">
              {imageFile ? imageFile.name : "No new image selected"}
            </span>
          </div>
        </div>
      </div>

      {/* Action Form Footer Submit Button */}
      <button
        type="submit"
        disabled={isSaving}
        className="w-full rounded-md bg-black px-4 py-3 font-medium text-white transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {isSaving ? "Uploading Files & Saving Changes..." : "Save Changes"}
      </button>
    </form>
  );
}