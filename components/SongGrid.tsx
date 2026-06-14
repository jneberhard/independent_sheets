import Image from "next/image";
import Link from "next/link";

// Define a strict interface for the shape of data the grid expects
interface SongWithCategories {
  id: string;
  title: string;
  priceCents: number;
  imageUrl: string | null;
  categories: {
    category: {
      name: string;
      group: string;
    };
  }[];
}

interface SongGridProps {
  songs: SongWithCategories[];
  currentPage: number;
  isPublisher?: boolean; // Toggles between the public view and dashboard controls
}

export function SongGrid({ songs, currentPage, isPublisher = false }: SongGridProps) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {songs.map((song) => {
        const voicings: string[] = [];
        const instruments: string[] = [];

        for (const item of song.categories) {
          if (item.category.group === "VOICING" && voicings.length < 2) {
            voicings.push(item.category.name);
          } else if (item.category.group === "INSTRUMENT" && instruments.length < 1) {
            instruments.push(item.category.name);
          }
          if (voicings.length === 2 && instruments.length === 1) break;
        }

        const formattedPrice = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
        }).format(song.priceCents / 100);

        // Shared inner content
        const renderInnerContent = () => (
          <>
            {/* Image Box */}
            <div className="aspect-[3/4] w-full overflow-hidden bg-gray-50 border-b border-gray-100 relative p-4">
              {song.imageUrl ? (
                <Image
                  src={song.imageUrl}
                  alt={`Cover art for ${song.title}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.03]"
                  priority={currentPage === 1}
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center text-gray-400">
                  <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm font-medium">No Cover Image</span>
                </div>
              )}
            </div>

            {/* Content Area */}
            <div className="flex flex-1 flex-col justify-between p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                  Sheet Music
                </p>

                <h2 className="mt-2 text-xl font-bold leading-tight text-[var(--card)] line-clamp-2 group-hover:text-teal-700">
                  {song.title}
                </h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-bold text-white">
                    {formattedPrice}
                  </span>

                  {voicings.map((name) => (
                    <span key={`voicing-${name}`} className="rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-semibold text-white">
                      {name}
                    </span>
                  ))}

                  {instruments.map((name) => (
                    <span key={`instrument-${name}`} className="rounded-full bg-[var(--secondary)] px-3 py-1 text-xs font-semibold text-black">
                      {name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons Toggled by Role */}
              {!isPublisher ? (
                <div className="mt-6 border-t border-gray-100 pt-4 text-center text-sm font-semibold text-[var(--card)] group-hover:underline">
                  View Details
                </div>
              ) : (
                <div className="mt-6 border-t border-gray-100 pt-4 flex gap-4 justify-between">
                  <Link href={`/music/${song.id}`} className="text-sm font-bold text-teal-700 hover:underline transition rounded">
                    View Details <span className="sr-only">for {song.title}</span>
                  </Link>
                  <Link href={`/dashboard/publisher/music/${song.id}/edit`} className="text-sm font-bold text-gray-600 hover:text-black hover:underline transition rounded">
                    Edit Item <span className="sr-only">{song.title}</span>
                  </Link>
                </div>
              )}
            </div>
          </>
        );

        // Explicitly render valid components so TypeScript knows exactly what props are present
        const cardClassName = "group flex flex-col overflow-hidden rounded-2xl border border-[var(--secondary)] bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl";

        if (isPublisher) {
          return (
            <article key={song.id} className={cardClassName}>
              {renderInnerContent()}
            </article>
          );
        }

        return (
          <Link key={song.id} href={`/music/${song.id}`} className={cardClassName}>
            {renderInnerContent()}
          </Link>
        );
      })}
    </div>
  );
}