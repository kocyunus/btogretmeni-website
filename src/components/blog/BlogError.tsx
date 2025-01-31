export default function BlogError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-800 rounded-lg p-8">
      <h2 className="text-2xl font-bold text-red-400 mb-4">Bir hata oluştu</h2>
      <p className="text-gray-400">Blog yazıları yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.</p>
    </div>
  );
} 