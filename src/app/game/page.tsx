"use client";

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { LockClosedIcon } from "@heroicons/react/24/solid";
import CommandPanel from "@/components/game/CommandPanel";
import SuccessModal from "@/components/game/SuccessModal";
import { useGameStore } from "@/store/gameStore";

// GameScene'i client-side rendering ile yükle
const GameScene = dynamic(() => import('@/components/game/GameScene'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
    </div>
  ),
});

// Seviye bilgileri
const levels = [
  {
    id: 1,
    title: "Temel Hareketler",
    description: "Karakteri hareket ettirmeyi ve basit komutları öğrenin",
  },
  {
    id: 2,
    title: "Döngüler",
    description: "Tekrarlı hareketleri döngülerle kontrol edin",
  },
  {
    id: 3,
    title: "Koşullar",
    description: "Engelleri koşul ifadeleriyle aşın",
  }
];

// Statik sayfa olarak işaretle
export const dynamic = 'force-static';

export default function GamePage() {
  const [mounted, setMounted] = useState(false);
  const currentLevel = useGameStore((state) => state.currentLevel);
  const completedLevels = useGameStore((state) => state.completedLevels);
  const loadLevel = useGameStore((state) => state.loadLevel);
  const levels = useGameStore((state) => state.levels);
  const startTutorial = useGameStore((state) => state.startTutorial);
  const [showAlert, setShowAlert] = useState(false);

  // Client tarafında mount olduktan sonra içeriği göster
  useEffect(() => {
    setMounted(true);
    // Tutorial'ı başlat
    startTutorial();
  }, [startTutorial]);

  // Level değiştirme fonksiyonu
  const handleLevelClick = (levelId: number) => {
    const isUnlocked = levelId === 1 || completedLevels.includes(levelId - 1);
    
    if (!isUnlocked) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      return;
    }

    loadLevel(levelId);
    
    // Aktif seviyeyi ortala
    setTimeout(() => {
      const levelElement = document.querySelector(`[data-level-id="${levelId}"]`);
      const container = document.querySelector('.level-scroll-container');
      if (levelElement && container) {
        const containerWidth = container.clientWidth;
        const elementLeft = levelElement.getBoundingClientRect().left;
        const containerLeft = container.getBoundingClientRect().left;
        const scrollLeft = elementLeft - containerLeft - (containerWidth / 2) + (levelElement.clientWidth / 2);
        
        container.scrollTo({
          left: container.scrollLeft + scrollLeft,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  // Sunucu tarafında veya mount olmadan önce loading göster
  if (!mounted) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Ana Grid Container */}
      <div className="grid grid-rows-[auto_1fr] md:grid-rows-[1fr] md:grid-cols-[1fr_300px] gap-4 h-[calc(100vh-2rem)]">
        {/* Sol Panel - Oyun Alanı */}
        <div className="h-[50vh] md:h-full relative">
          <GameScene />
        </div>

        {/* Sağ Panel - Komutlar */}
        <div className="flex flex-col h-[calc(50vh-1rem)] md:h-full">
          <CommandPanel />
        </div>
      </div>
    </div>
  );
} 