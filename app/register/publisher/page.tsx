import Image from "next/image";

export default function PublisherRegisterPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold">
        Join Independent Sheets as a Composer or Arranger
      </h1>
      <p className="mt-3 text-base">
        Upload and sell your original compositions and licensed arrangements to musicians worldwide.
      </p>

      <div className="mt-6 overflow-hidden rounded-lg border">
        <Image
          src="/songwriter.png"
          alt="Composer or arranger signup"
          width={1200}
          height={500}
          className="h-auto w-full object-cover"
          priority
        />
      </div>

      <section className="mt-8 space-y-4">
        <h2 className="text-2xl font-semibold">Become a Publisher on Independent Sheets</h2>
        <p>
          Independent Sheets allows composers, arrangers, and music creators to serve as the publisher
          of their own musical works through our digital marketplace.
        </p>
      </section>

      <section className="mt-8">
        <h3 className="text-xl font-semibold">Publisher Signup Form</h3>
        <form className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <input className="rounded border p-2" placeholder="First Name *" />
          <input className="rounded border p-2" placeholder="Last Name *" />
          <input className="rounded border p-2 md:col-span-2" placeholder="Display/Publisher Name *" />
          <input className="rounded border p-2" placeholder="Email Address *" />
          <input className="rounded border p-2" placeholder="Phone Number (Optional)" />
          <input className="rounded border p-2 md:col-span-2" placeholder="Address Line 1 *" />
          <input className="rounded border p-2 md:col-span-2" placeholder="Address Line 2 (Optional)" />
          <input className="rounded border p-2" placeholder="City *" />
          <input className="rounded border p-2" placeholder="State/Province *" />
          <input className="rounded border p-2" placeholder="Postal Code *" />
          <input className="rounded border p-2" placeholder="Country *" />

          <textarea className="rounded border p-2 md:col-span-2" placeholder="About Me / Biography (Optional)" />
          <input className="rounded border p-2 md:col-span-2" placeholder="Website URL (Optional)" />
          <input className="rounded border p-2 md:col-span-2" placeholder="YouTube Channel (Optional)" />
          <input className="rounded border p-2 md:col-span-2" placeholder="Spotify Link (Optional)" />

          <p className="rounded border border-gray-300 bg-gray-50 p-3 text-sm md:col-span-2">
            For paid downloads, publishers receive <strong>75%</strong> of each sale. Independent Sheets retains{" "}
            <strong>25%</strong> as the platform fee.
          </p>

          <div className="rounded border border-gray-300 bg-gray-50 p-3 text-sm md:col-span-2">
            <p className="font-semibold">Royalty / Payment</p>
            <p className="mt-1">
              Current royalty split: <strong>Publisher 75%</strong> / <strong>Independent Sheets 25%</strong>.
            </p>
          </div>

          <label className="md:col-span-2 flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-1" />
            <span>
              I certify that I own the copyright to the uploaded material or have obtained
              the necessary permissions/licenses to distribute and sell this music. I understand and agree to the
              current royalty split: Publisher 75% / Independent Sheets 25%.
            </span>
          </label>

          <button
            type="button"
            className="rounded bg-black px-4 py-2 text-white md:col-span-2"
          >
            Create Publisher Account
          </button>
        </form>
      </section>
    </main>
  );
}
