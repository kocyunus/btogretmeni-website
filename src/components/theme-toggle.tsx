"use client"

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="w-8 h-8 flex items-center justify-center">
        <span className="sr-only">Tema değiştirici yükleniyor</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
      title={theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
    >
      <span className="sr-only">
        {theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
      </span>
      {theme === 'dark' ? (
        <FaSun className="w-4 h-4" />
      ) : (
        <FaMoon className="w-4 h-4" />
      )}
    </button>
  );
} 