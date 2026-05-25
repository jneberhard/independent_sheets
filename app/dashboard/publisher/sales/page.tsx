export default function ComingSoonPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12">
      <div className="w-full max-w-2xl rounded-2xl border bg-white p-10 text-center shadow-sm">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          Coming Soon
        </h1>

        <p className="mt-6 text-lg text-gray-600">
          This section of Independent Sheets is currently under development.
        </p>

        <p className="mt-3 text-sm text-gray-500">
          Check back soon for new features and updates.
        </p>

        <div className="mt-8">
          <div className="mx-auto h-2 w-40 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-600" />
          </div>
        </div>
      </div>
    </main>
  );
}