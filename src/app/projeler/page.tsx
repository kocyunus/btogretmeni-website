'use client';

import React from 'react';

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-100 mb-8">Projeler</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Yakında yeni projeler eklenecek */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <p className="text-gray-400">Yakında yeni projeler eklenecektir.</p>
        </div>
      </div>
    </div>
  );
} 