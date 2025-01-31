'use client';

import React from 'react';

export default function EducationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-100 mb-8">Eğitsel İçerikler</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Yakında yeni içerikler eklenecek */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <p className="text-gray-400">Yakında yeni eğitsel içerikler eklenecektir.</p>
        </div>
      </div>
    </div>
  );
} 