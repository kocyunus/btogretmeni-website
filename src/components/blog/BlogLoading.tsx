interface Props {
  type: 'list' | 'detail';
}

export default function BlogLoading({ type }: Props) {
  if (type === 'detail') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 rounded-lg mb-8">
          <div className="h-8 bg-white/20 rounded w-3/4 mb-4"></div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20"></div>
            <div className="h-4 bg-white/20 rounded w-32"></div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
        </div>

        {/* Tags */}
        <div className="mt-8">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-4"></div>
          <div className="flex gap-2">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((n) => (
          <div key={n} className="animate-pulse">
            <div className="bg-gray-800/50 rounded-xl overflow-hidden">
              <div className="h-52 bg-gradient-to-r from-indigo-500/50 via-purple-500/50 to-pink-500/50"></div>
              <div className="p-8">
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                </div>
                <div className="mt-6 flex gap-2">
                  <div className="h-6 bg-gray-700 rounded w-16"></div>
                  <div className="h-6 bg-gray-700 rounded w-20"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 