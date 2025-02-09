"use client";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl mb-8">Sayfa Bulunamadı</h2>
        <p className="text-gray-400 mb-8">
          Aradığınız sayfa bulunamadı veya taşınmış olabilir.
        </p>
        <a
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Ana Sayfaya Dön
        </a>
      </div>
    </div>
  );
} 