export default function Loading() {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Producten laden...</h1>
        <p className="text-lg text-gray-500">Een moment geduld terwijl we de lekkerste producten voor je ophalen.</p>
        {/* Optional: Add a more sophisticated skeleton loader here */}
        <div className="mt-8 space-y-4">
          <div className="animate-pulse bg-gray-200 h-8 w-3/4 mx-auto rounded"></div>
          <div className="animate-pulse bg-gray-200 h-8 w-1/2 mx-auto rounded"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-64 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  