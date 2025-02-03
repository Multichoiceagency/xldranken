export function SkeletonCard() {
    return (
      <div className="animate-pulse border rounded-lg overflow-hidden shadow-sm bg-gray-200">
        <div className="h-48 bg-gray-300"></div>
        <div className="p-4 space-y-2">
          <div className="h-4 bg-gray-400 rounded w-3/4"></div>
          <div className="h-3 bg-gray-400 rounded w-1/2"></div>
        </div>
      </div>
    )
  }
  