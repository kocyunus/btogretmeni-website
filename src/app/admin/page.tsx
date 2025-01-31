'use client';

import React from 'react';
import Link from 'next/link';
import { 
  DocumentTextIcon, 
  CubeIcon, 
  AcademicCapIcon,
  Cog6ToothIcon 
} from '@heroicons/react/24/outline';

export default function AdminPage() {
  React.useEffect(() => {
    // Admin token'ını cookie olarak ayarla
    document.cookie = `admin_token=${process.env.NEXT_PUBLIC_ADMIN_TOKEN}; path=/`;
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          Yönetim Paneli
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Blog Yönetimi */}
          <Link href="/admin/blog" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm 
              border border-gray-200 dark:border-gray-700
              p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                  <DocumentTextIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Blog Yönetimi
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Blog yazılarını oluştur, düzenle ve yönet
              </p>
            </div>
          </Link>

          {/* Proje Yönetimi */}
          <Link href="/admin/games" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm 
              border border-gray-200 dark:border-gray-700
              p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                  <CubeIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Proje Yönetimi
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Oyun ve uygulama projelerini yönet
              </p>
            </div>
          </Link>

          {/* Eğitim Yönetimi */}
          <Link href="/admin/education" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm 
              border border-gray-200 dark:border-gray-700
              p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                  <AcademicCapIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Eğitim Yönetimi
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Eğitim içeriklerini ve kursları yönet
              </p>
            </div>
          </Link>

          {/* Ayarlar */}
          <Link href="/admin/settings" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm 
              border border-gray-200 dark:border-gray-700
              p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Cog6ToothIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Ayarlar
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Site ayarlarını ve tercihleri yönet
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
} 