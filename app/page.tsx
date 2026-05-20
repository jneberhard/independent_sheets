import Image from "next/image";

export default function Home() {
  return (
    <>
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative h-[500px] w-full">
          <Image
            src="/hero.png"
            alt="Independent Sheets Hero"
            fill
            priority
            className="object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Hero Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
            <h1 className="text-5xl font-bold tracking-tight">
              Independent Sheets
            </h1>

            <p className="mt-4 max-w-2xl text-lg">
              Discover quality sheet music for choirs, soloists,
              and instrumental ensembles. Explore new music.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="flex items-center justify-center px-6 py-16">
          <div className="max-w-2xl text-center">
            <div className="rounded-2xl border bg-white p-10 shadow-sm">
              <h2 className="text-3xl font-semibold text-gray-900">
                Coming Soon
              </h2>

              <p className="mt-4 text-gray-600">
                This is the main page space.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}