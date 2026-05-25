"use client";

import { useState } from "react";

export default function PublisherUploadForm() {
  const [title, setTitle] = useState("");
  const [priceCents, setPriceCents] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [mp3File, setMp3File] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function uploadFile(file: File, folder: string) {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("folder", folder);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("File upload failed");
    }

    return response.json();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!pdfFile) {
      setErrorMessage("Please upload the full PDF sheet music file.");
      return;
    }

    if (!imageFile) {
      setErrorMessage("Please upload image artwork or preview image.");
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
          pdfUrl: pdfUpload.url,
          imageUrl: imageUpload.url,
          previewMp3Url: mp3Upload?.url ?? null,
        }),
      });

      if (!response.ok) {
        setErrorMessage("Sheet music could not be saved.");
        return;
      }

      alert("Sheet music uploaded successfully.");

      setTitle("");
      setPriceCents("");
      setPdfFile(null);
      setMp3File(null);
      setImageFile(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "File upload failed.";
      if (message.toLowerCase().includes("blob")) {
        setErrorMessage("Upload failed: Blob storage token is missing or invalid.");
        return;
      }
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-6 rounded-2xl border bg-white p-8 shadow-sm"
    >
      {errorMessage ? (
        <p className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}
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
          Sheet Music PDF
        </label>

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

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-black px-4 py-3 font-medium text-white transition hover:bg-blue-600"
      >
        {isSubmitting ? "Uploading..." : "Upload Sheet Music"}
      </button>
    </form>
  );
}
