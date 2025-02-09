"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">Hata!</h1>
        <h2 className="text-2xl mb-8">Bir şeyler yanlış gitti</h2>
        <p className="text-gray-400 mb-8">
          {error.message || "Beklenmeyen bir hata oluştu."}
        </p>
        <div className="space-x-4">
          <button
            onClick={reset}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Tekrar Dene
          </button>
          <a
            href="/"
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors inline-block"
          >
            Ana Sayfaya Dön
          </a>
        </div>
      </div>
    </div>
  );
} 