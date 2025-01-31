'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Hata loglaması
    console.error('Sayfa hatası:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-6xl font-bold text-red-600 dark:text-red-400">Hata</h1>
        <h2 className="mt-4 text-3xl font-semibold">Bir Şeyler Ters Gitti</h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Üzgünüz, bir hata oluştu. Lütfen tekrar deneyin.
        </p>
        <div className="mt-8">
          <button
            onClick={reset}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base 
              font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    </div>
  );
} 