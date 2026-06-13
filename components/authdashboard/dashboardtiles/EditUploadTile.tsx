import Link from "next/link";

export default function EditUploadTile() {
    return(
        <Link
          href="/dashboard/publisher/music"
          className="group rounded-3xl border border-[var(--accent)] bg-[var(--accent)] p-7 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">
            Manage
          </div>
          <h2 className="mt-5 text-2xl font-bold">My Sheet Music</h2>
          <p className="mt-4 text-sm leading-7 text-white">
            Edit uploaded music, update pricing, and manage metadata.
          </p>
          <div className="mt-6 text-sm font-semibold text-white group-hover:underline">
            View catalog →
          </div>
        </Link>
    );
}