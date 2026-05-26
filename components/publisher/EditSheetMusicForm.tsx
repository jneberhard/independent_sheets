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
  priceCents: number;
  imageUrl: string | null;
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
  const [priceCents, setPriceCents] = useState(
    String(sheetMusic.priceCents)
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
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

  async function uploadImage(file: File) {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("folder", "images");

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    return response.json();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSaving(true);

    try {
      let imageUrl = sheetMusic.imageUrl;

      if (imageFile) {
        const imageUpload = await uploadImage(imageFile);
        imageUrl = imageUpload.url;
      }

      const response = await fetch(`/api/sheet-music/${sheetMusic.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          priceCents: Number(priceCents),
          imageUrl,
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

      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Re-upload Image Artwork
        </label>

        <div className="mt-2 flex items-center gap-4">
          <label className="cursor-pointer rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600">
            Choose File
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(event) =>
                setImageFile(event.target.files?.[0] ?? null)
              }
            />
          </label>

          <span className="text-sm text-gray-600">
            {imageFile ? imageFile.name : "No new image selected"}
          </span>
        </div>

        {sheetMusic.imageUrl && (
          <p className="mt-2 text-xs text-gray-500">
            Current image URL saved.
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="w-full rounded-md bg-black px-4 py-3 font-medium text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}