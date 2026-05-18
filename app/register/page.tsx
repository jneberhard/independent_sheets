export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          Songwriter Registration
        </h1>

        <div className="mt-10 rounded-2xl border bg-white p-10 shadow-sm">
          <h2 className="text-3xl font-semibold text-gray-900">
            Coming Soon
          </h2>

          <p className="mt-4 text-gray-600">
            We are currently building songwriter registration and music
            upload functionality for Independent Sheets.
          </p>

          <p className="mt-4 text-gray-600">
            Soon composers, arrangers, and publishers will be able to:
          </p>

          <ul className="mt-6 space-y-3 text-left text-gray-700">
            <li>• Create songwriter accounts</li>
            <li>• Upload PDF sheet music</li>
            <li>• Add MP3 previews and media links</li>
            <li>• Set pricing for downloadable music</li>
            <li>• Track sales and royalty reports</li>
          </ul>
        </div>

        <p className="mt-10 text-sm text-gray-500">
          © 2026 Independent Sheets
        </p>
      </div>
    </main>
  );
}