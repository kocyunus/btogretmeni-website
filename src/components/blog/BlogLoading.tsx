interface BlogLoadingProps {
  type?: 'list' | 'detail';
}

export default function BlogLoading({ type = 'list' }: BlogLoadingProps) {
  if (type === 'detail') {
    return (
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl overflow-hidden animate-pulse">
        {/* Gradient başlık alanı yükleniyor */}
        <div className="bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 p-8 md:p-16">
          <div className="space-y-6 text-center">
            <div className="h-12 bg-gray-600 rounded-lg mx-auto max-w-2xl" />
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gray-600 rounded-full" />
                <div className="h-4 w-24 bg-gray-600 rounded" />
              </div>
              <div className="flex items-center gap-4">
                <div className="h-4 w-32 bg-gray-600 rounded" />
                <div className="h-4 w-4 bg-gray-600 rounded-full" />
                <div className="h-4 w-24 bg-gray-600 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* İçerik alanı yükleniyor */}
        <div className="p-8">
          <div className="space-y-4">
            <div className="h-4 bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-700 rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden animate-pulse">
          <div className="h-48 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700" />
          <div className="p-6">
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-700 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
} 