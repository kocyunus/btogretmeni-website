"use client";

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { StarIcon } from '@heroicons/react/24/solid';

export default function SuccessModal() {
  const [mounted, setMounted] = useState(false);
  const currentLevel = useGameStore((state) => state.currentLevel);
  const levels = useGameStore((state) => state.levels);
  const loadLevel = useGameStore((state) => state.loadLevel);
  const completeLevel = useGameStore((state) => state.completeLevel);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleNextLevel = () => {
    completeLevel(currentLevel);
    loadLevel(currentLevel + 1);
  };

  const handleRetry = () => {
    loadLevel(currentLevel);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900/90 rounded-xl border-2 border-amber-500/50 p-6 max-w-md w-full mx-4">
        <div className="text-center">
          {/* Başarı İkonu */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <StarIcon className="w-16 h-16 text-amber-500 animate-[spin_3s_linear_infinite]" />
              <StarIcon className="absolute inset-0 w-16 h-16 text-amber-400 animate-[spin_2s_linear_infinite]" />
              <StarIcon className="absolute inset-0 w-16 h-16 text-amber-300 animate-[spin_4s_linear_infinite]" />
            </div>
          </div>

          {/* Başlık */}
          <h2 className="text-2xl font-bold text-white mb-2">
            Tebrikler! 🎉
          </h2>

          {/* Alt Başlık */}
          <p className="text-gray-400 mb-6">
            {levels[currentLevel - 1].title} seviyesini tamamladınız!
          </p>

          {/* Butonlar */}
          <div className="flex flex-col gap-2">
            {currentLevel < levels.length && (
              <button
                onClick={handleNextLevel}
                className="w-full py-3 px-4 rounded-lg bg-gradient-to-b from-amber-600 to-amber-700
                       hover:from-amber-500 hover:to-amber-600
                       text-white font-medium
                       transition-all duration-200
                       flex items-center justify-center gap-2"
              >
                Sonraki Seviye
              </button>
            )}
            <button
              onClick={handleRetry}
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-b from-gray-700 to-gray-800
                     hover:from-gray-600 hover:to-gray-700
                     text-white font-medium
                     transition-all duration-200
                     flex items-center justify-center gap-2"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 