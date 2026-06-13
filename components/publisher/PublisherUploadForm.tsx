"use client";

import { useState } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
  group: "VOICING" | "INSTRUMENT" | "GENRE";
};

type PublisherUploadFormProps = {
  voicingCategories: Category[];
  instrumentCategories: Category[];
  genreCategories: Category[];
};

//to upload sheet music and related files
export default function PublisherUploadForm({
  voicingCategories,
  instrumentCategories,
  genreCategories,
}: PublisherUploadFormProps) {
  const [title, setTitle] = useState("");
  const [priceCents, setPriceCents] = useState("");
  const [description, setDescription] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [mp3File, setMp3File] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [rightsVerified, setRightsVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function toggleCategory(categoryId: string) {
    // We keep the selected categories in a flat list so the form stays simple
    // even though the UI shows them in three different groups.
    setSelectedCategoryIds((current) =>
      current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId]
    );
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

    // The form is strict here because we want the upload to fail early with a clear
    // message instead of sending half-finished data to the database.
    if (!pdfFile) {
      alert("Please upload the full PDF sheet music file.");
      return;
    }

    if (!imageFile) {
      alert("Please upload image artwork or preview image.");
      return;
    }

    if (selectedCategoryIds.length === 0) {
      alert("Please choose at least one category.");
      return;
    }

    if (!rightsVerified) {
      alert("Please confirm that you own or control the rights to this music.");
      return;
    }

    try {
      setIsSubmitting(true);
      const pdfUpload = await uploadFile(pdfFile, "sheet-music");
      const imageUpload = await uploadFile(imageFile, "images");

      let mp3Upload = null;

      if (mp3File) {
        mp3Upload = await uploadFile(mp3File, "previews");
      }

      const response = await fetch("/api/sheet-music", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          priceCents: Number(priceCents),
          description, // Passed down to backend
          externalUrl: externalUrl || null, // Passed down as null if left blank
          pdfUrl: pdfUpload.url,
          imageUrl: imageUpload.url,
          previewMp3Url: mp3Upload?.url ?? null,
          previewLink: pdfUpload.previewUrl ?? null,
          categoryIds: selectedCategoryIds,
          rightsVerified,
        }),
      });

      if (!response.ok) {
        alert("Sheet music could not be saved.");
        return;
      }

      alert("Sheet music uploaded successfully.");

      // Clear form states
      setTitle("");
      setPriceCents("");
      setDescription("");
      setExternalUrl("");
      setSelectedCategoryIds([]);
      setRightsVerified(false);
      setPdfFile(null);
      setMp3File(null);
      setImageFile(null);

    } catch (error: any) {
        console.error("Upload error:", error);
        alert(error.message || "An error occurred during upload. Please try again.");
      } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-6 rounded-2xl border bg-white p-8 shadow-sm text-black"
    >
      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Title
        </label>

        <input
          className="mt-2 w-full rounded-md border px-3 py-2"
          placeholder="Enter sheet music title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Price (in cents)
        </label>

        <input
          className="mt-2 w-full rounded-md border px-3 py-2"
          placeholder="Example: 499 - would print as $4.99"
          value={priceCents}
          onChange={(event) => setPriceCents(event.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Description
        </label>

        <textarea
          className="mt-2 w-full rounded-md border px-3 py-2"
          rows={4}
          placeholder="Enter arrangement details, context, or performance notes..."
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">
          External Media Link (Optional)
        </label>

        <input
          type="url"
          className="mt-2 w-full rounded-md border px-3 py-2"
          placeholder="Example: https://www.youtube.com/watch?v=..."
          value={externalUrl}
          onChange={(event) => setExternalUrl(event.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Sheet Music PDF
        </label>

        <p className="mt-1 text-xs text-gray-500">
          When you upload this PDF, the system also creates a 2-page sample
          preview for customers to view.
        </p>

        <div className="mt-2 flex items-center gap-4">
          <label className="cursor-pointer rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600">
            Choose File
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(event) =>
                setPdfFile(event.target.files?.[0] ?? null)
              }
              required
            />
          </label>

          <span className="text-sm text-gray-600">
            {pdfFile ? pdfFile.name : "No file selected"}
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Preview MP3 (Optional)
        </label>

        <div className="mt-2 flex items-center gap-4">
          <label className="cursor-pointer rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600">
            Choose File

            <input
              type="file"
              accept="audio/mpeg,audio/mp3"
              className="hidden"
              onChange={(event) =>
                setMp3File(event.target.files?.[0] ?? null)
              }
            />
          </label>

          <span className="text-sm text-gray-600">
            {mp3File ? mp3File.name : "No file selected"}
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Artwork / Preview Image
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
              required
            />
          </label>

          <span className="text-sm text-gray-600">
            {imageFile ? imageFile.name : "No file selected"}
          </span>
        </div>
      </div>

      <CategorySection
        title="Voicings"
        categories={voicingCategories}
        selectedCategoryIds={selectedCategoryIds}
        toggleCategory={toggleCategory}
      />

      {/* INSTRUMENTS */}
      <CategorySection
        title="Instruments"
        categories={instrumentCategories}
        selectedCategoryIds={selectedCategoryIds}
        toggleCategory={toggleCategory}
      />

      {/* GENRES */}
      <CategorySection
        title="Genres"
        categories={genreCategories}
        selectedCategoryIds={selectedCategoryIds}
        toggleCategory={toggleCategory}
      />

      <label className="flex items-start gap-3 rounded-xl border bg-gray-50 p-4 text-sm text-gray-700">
        <input
          type="checkbox"
          className="mt-1"
          checked={rightsVerified}
          onChange={(event) => setRightsVerified(event.target.checked)}
        />

        <span>
          I confirm that I own the copyright to this music or have the proper
          licenses and permissions to upload, distribute, and sell it.
        </span>
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-black px-4 py-3 font-medium text-white transition hover:bg-blue-600"
      >
        {isSubmitting ? "Uploading Files & Generating Preview..." : "Upload Sheet Music"}
      </button>
    </form>
  );
}

function CategorySection({
  title,
  categories,
  selectedCategoryIds,
  toggleCategory,
}: {
  title: string;
  categories: Category[];
  selectedCategoryIds: string[];
  toggleCategory: (categoryId: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700">
        {title}
      </label>

      <div className="mt-2 grid gap-2 rounded-md border bg-gray-50 p-3 md:grid-cols-3">
        {categories.map((category) => (
          <label
            key={category.id}
            className="flex items-center gap-2 text-sm text-gray-700"
          >
            <input
              type="checkbox"
              checked={selectedCategoryIds.includes(category.id)}
              onChange={() => toggleCategory(category.id)}
            />

            {category.name}
          </label>
        ))}
      </div>
    </div>
  );
}