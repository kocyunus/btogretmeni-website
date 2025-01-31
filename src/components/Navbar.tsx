'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';

const navItems = [
  { name: 'Ana Sayfa', path: '/' },
  { name: 'Hakkımda', path: '/hakkimda' },
  { name: 'Blog', path: '/blog' },
  { name: 'Projeler', path: '/projeler' },
  { name: 'Eğitim', path: '/egitim' },
  { name: 'İletişim', path: '/iletisim' }
];

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? "text-blue-400" : "text-gray-300 hover:text-blue-400"
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center group">
            <span className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors whitespace-nowrap">
              BT Öğretmeni
            </span>
          </Link>

          {/* Masaüstü Menü */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`${isActive(item.path)} transition-colors text-sm font-medium`}
              >
                {item.name}
              </Link>
            ))}
            <ThemeToggle />
          </div>

          {/* Mobil Menü Butonu */}
          <button 
            className="md:hidden text-gray-300 hover:text-blue-400 transition-colors"
            aria-label="Menüyü Aç/Kapat"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>
      </div>

      {/* Mobil Menü (Varsayılan olarak gizli) */}
      <div className="md:hidden hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="block px-3 py-2 text-gray-300 hover:text-blue-400 transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
} 