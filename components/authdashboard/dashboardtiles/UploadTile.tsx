import Link from "next/link";

export default function UploadTile() {
    return (
        <Link
          href="/dashboard/publisher/upload"
          className="group rounded-3xl border border-[var(--secondary)] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="inline-flex rounded-full bg-[var(--background)] px-4 py-2 text-sm font-semibold text-white">
            Upload
          </div>
          <h2 className="mt-5 text-2xl font-bold text-[var(--accent)]">
            Upload Sheet Music
          </h2>
          <p className="mt-4 text-sm leading-7 text-gray-700">
            Add a new PDF score, preview MP3, artwork image, title,
            description, and pricing information.
          </p>
          <div className="mt-6 text-sm font-semibold text-[var(--accent)] group-hover:underline">
            Start uploading →
          </div>
        </Link>
    );
}