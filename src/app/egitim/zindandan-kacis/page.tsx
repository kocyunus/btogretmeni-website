"use client";

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/solid";
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

export default function ZindandanKacisPage() {
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
    <main className="h-screen overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-950 via-stone-950 to-gray-950">
      {/* Arka Plan Efektleri */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-[url('/images/dungeon-texture.png')] bg-repeat opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-900/5 to-amber-900/10" />
      </div>

      {/* Meşale Efektleri */}
      <div className="fixed top-0 left-0 w-32 h-32 animate-[torchLight_4s_ease-in-out_infinite]">
        <div className="absolute inset-0 bg-gradient-radial from-amber-500/20 via-amber-500/5 to-transparent" />
      </div>
      <div className="fixed top-0 right-0 w-32 h-32 animate-[torchLight_4s_ease-in-out_infinite_0.5s]">
        <div className="absolute inset-0 bg-gradient-radial from-amber-500/20 via-amber-500/5 to-transparent" />
      </div>

      <div className="h-full flex flex-col p-2">
        {/* Üst Alan - Seviyeler */}
        <section className="flex-none mb-1">
          <div className="relative">
            {/* Kaydırma Göstergesi */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1 z-20">
              <div className="w-6 h-1 bg-amber-500/30 rounded-full animate-[pulse_2s_ease-in-out_infinite]" />
              <div className="w-6 h-1 bg-amber-500/20 rounded-full animate-[pulse_2s_ease-in-out_infinite_0.2s]" />
              <div className="w-6 h-1 bg-amber-500/10 rounded-full animate-[pulse_2s_ease-in-out_infinite_0.4s]" />
            </div>

            {/* Kaydırma Gölgeleri */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-950 via-gray-950/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-950 via-gray-950/80 to-transparent z-10 pointer-events-none" />
            
            {/* Kaydırılabilir Level Listesi */}
            <div 
              className="overflow-x-auto pb-6 pt-1 px-4 scrollbar-thin scrollbar-track-gray-900/50 scrollbar-thumb-amber-900/50 hover:scrollbar-thumb-amber-700/50 select-none touch-pan-x level-scroll-container"
              onWheel={(e) => {
                const container = e.currentTarget;
                const rect = container.getBoundingClientRect();
                const isInsideLevelArea = 
                  e.clientX >= rect.left && 
                  e.clientX <= rect.right && 
                  e.clientY >= rect.top && 
                  e.clientY <= rect.bottom;

                if (isInsideLevelArea) {
                  // deltaY değerini kullanarak orantılı scroll
                  const multiplier = 2.5; // Scroll hızı çarpanı
                  const scrollAmount = e.deltaY * multiplier;
                  
                  // Smooth scroll ile hareket et
                  container.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                  });
                }
              }}
              style={{ 
                scrollBehavior: 'smooth',
                touchAction: 'pan-x pinch-zoom'
              }}
            >
              <div className="flex gap-3 min-w-max px-16 cursor-grab active:cursor-grabbing">
                {levels.map((level) => {
                  const isUnlocked = level.id === 1 || completedLevels.includes(level.id - 1);
                  const isActive = level.id === currentLevel;
                  const isCompleted = completedLevels.includes(level.id);

                  // Her iki seviyede bir farklı tema
                  const themeIndex = Math.floor((level.id - 1) / 2) % 3;
                  const theme = themeIndex === 0 ? {
                    bg: 'from-stone-800/80 to-stone-900/80',
                    border: 'border-amber-900/50',
                    glow: 'amber',
                    icon: '🏰'
                  } : themeIndex === 1 ? {
                    bg: 'from-slate-800/80 to-slate-900/80',
                    border: 'border-blue-900/50',
                    glow: 'blue',
                    icon: '⚔️'
                  } : {
                    bg: 'from-violet-800/80 to-indigo-900/80',
                    border: 'border-violet-500/30',
                    glow: 'violet',
                    icon: '🔮'
                  };

                  return (
                    <div 
                      key={level.id}
                      data-level-id={level.id}
                      onClick={() => handleLevelClick(level.id)}
                      className={`
                        flex-none w-[180px] h-[100px]
                        relative p-3 rounded-xl border-2
                        backdrop-blur-sm
                        transition-all duration-300
                        group
                        ${isActive 
                          ? `bg-gradient-to-b ${theme.bg} ${theme.border} shadow-lg shadow-${theme.glow}-500/20 scale-105`
                          : isUnlocked 
                          ? `bg-gradient-to-b ${theme.bg} ${theme.border} cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-${theme.glow}-500/30`
                          : 'bg-gray-900/50 border-gray-800 opacity-75 grayscale'
                        }
                        ${isActive ? `ring-2 ring-${theme.glow}-400/30` : ''}
                        overflow-hidden
                      `}
                    >
                      {/* Arka Plan Efekti */}
                      <div className="absolute inset-0 pointer-events-none">
                        <div className={`absolute inset-0 bg-gradient-to-br from-${theme.glow}-500/5 via-transparent to-${theme.glow}-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                        {isActive && (
                          <div className={`absolute inset-0 bg-gradient-to-r from-${theme.glow}-500/0 via-${theme.glow}-500/10 to-${theme.glow}-500/0 animate-[shimmer_2s_infinite]`} />
                        )}
                      </div>

                      {/* Seviye Başlığı ve İkon */}
                      <div className="flex items-center justify-between mb-2 relative z-10">
                        <div className="flex items-center gap-2">
                          <span className={`text-lg ${isActive ? 'animate-[bounce_2s_ease-in-out_infinite]' : ''}`}>{theme.icon}</span>
                          <h3 className={`text-sm font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent group-hover:from-${theme.glow}-200 group-hover:to-white transition-all duration-300`}>
                            Seviye {level.id}
                          </h3>
                        </div>
                        {isUnlocked ? (
                          <div className={`w-3 h-3 rounded-full ${isCompleted ? 'bg-green-500' : `bg-${theme.glow}-500`} 
                                      animate-[pulse_2s_ease-in-out_infinite] shadow-lg shadow-${theme.glow}-500/30`} />
                        ) : (
                          <LockClosedIcon className="w-4 h-4 text-gray-600" />
                        )}
                      </div>
                      
                      {/* Seviye Başlığı */}
                      <h4 className={`text-xs font-medium mb-2 text-gray-400 group-hover:text-${theme.glow}-200/90 transition-colors duration-300`}>
                        {level.title}
                      </h4>
                      
                      {/* İlerleme Çubuğu */}
                      {isUnlocked && (
                        <div className="h-1 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              isCompleted 
                                ? 'bg-green-500' 
                                : isActive 
                                ? `bg-${theme.glow}-500 animate-[pulse_2s_ease-in-out_infinite]` 
                                : `bg-${theme.glow}-700/50`
                            }`}
                            style={{ width: isCompleted ? "100%" : isActive ? "50%" : "0%" }}
                          />
                        </div>
                      )}
                      
                      {/* Kilitli Seviye Efekti */}
                      {!isUnlocked && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-xl 
                                    flex items-center justify-center">
                          <div className="text-center">
                            <LockClosedIcon className="w-6 h-6 text-gray-500 mx-auto mb-1" />
                            <p className="text-[10px] text-gray-400">Kilitli</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Alt Alan - Oyun ve Komutlar */}
        <div className="flex gap-2 flex-1 min-h-0 h-[calc(100vh-140px)]">
          {/* Sol Panel - Oyun Alanı */}
          <div className="flex-1 bg-gray-900/50 rounded-xl backdrop-blur-sm
                       border-2 border-stone-800/50 relative overflow-hidden flex items-center justify-center">
            {/* Meşale Efektleri */}
            <div className="absolute top-0 left-0 w-32 h-32">
              <div className="absolute inset-0 bg-gradient-radial from-amber-500/10 via-amber-500/5 to-transparent 
                           animate-[torchLight_4s_ease-in-out_infinite]" />
            </div>
            <div className="absolute top-0 right-0 w-32 h-32">
              <div className="absolute inset-0 bg-gradient-radial from-amber-500/10 via-amber-500/5 to-transparent 
                           animate-[torchLight_4s_ease-in-out_infinite_0.5s]" />
            </div>

            <div className="aspect-square h-[calc(100vh-180px)] max-h-[800px]">
              <GameScene />
            </div>
          </div>

          {/* Sağ Panel - Komut Paneli */}
          <div className="w-[350px]">
            <CommandPanel />
          </div>
        </div>
      </div>

      {/* Başarı Ekranı */}
      <SuccessModal />

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes torchLight {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        /* Scrollbar stilleri */
        .scrollbar-thin::-webkit-scrollbar {
          height: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(217, 119, 6, 0.3);
          border-radius: 3px;
          transition: all 0.3s;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(217, 119, 6, 0.5);
        }
      `}</style>
    </main>
  );
} 