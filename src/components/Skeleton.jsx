export function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl shimmer" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-32 rounded-lg shimmer" />
          <div className="h-3 w-20 rounded-lg shimmer" />
        </div>
        <div className="h-6 w-24 rounded-lg shimmer" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full shimmer" />
            <div className="h-3 flex-1 rounded-lg shimmer" style={{ maxWidth: `${60 + i * 15}%` }} />
            <div className="h-3 w-16 rounded-lg shimmer" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <div className="h-7 w-40 rounded-lg shimmer" />
        <div className="h-4 w-28 rounded-lg shimmer" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-44 rounded-2xl shimmer" />
        ))}
      </div>
      <div className="h-40 rounded-2xl shimmer" />
    </div>
  )
}
