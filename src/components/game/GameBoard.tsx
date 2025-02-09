import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import TutorialOverlay from './TutorialOverlay';

// Types
interface Wall {
  x: number;
  y: number;
}

interface BreakableWall extends Wall {
  broken: boolean;
}

interface Target {
  x: number;
  y: number;
}

interface LevelData {
  title: string;
  walls: Wall[];
  breakableWalls: BreakableWall[];
  target: Target;
}

// Sabit değerler
const BOARD_SIZE = 8;
const MIN_CELL_SIZE = 30;
const MAX_CELL_SIZE = 60;

export default function GameBoard() {
  const {
    currentLevel,
    levelData,
    characterPosition,
    characterRotation,
    isRunning,
    showSuccess,
    isTutorialActive,
    resetLevel,
    handleNextLevel
  } = useGameStore();

  // Hücre boyutu state'i
  const [cellSize, setCellSize] = useState(MIN_CELL_SIZE);

  // Ekran boyutuna göre hücre boyutunu ayarla
  useEffect(() => {
    const updateCellSize = () => {
      const container = document.querySelector('.game-board-container');
      if (!container) return;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      // En küçük kenarı baz al
      const minDimension = Math.min(containerWidth, containerHeight);
      
      // Padding için pay bırak
      const availableSpace = minDimension - 32; // 2rem padding
      
      // Tahta boyutuna göre hücre boyutunu hesapla
      const calculatedSize = Math.floor(availableSpace / BOARD_SIZE);
      
      // Min ve max değerler arasında sınırla
      const newCellSize = Math.max(
        MIN_CELL_SIZE,
        Math.min(MAX_CELL_SIZE, calculatedSize)
      );
      
      setCellSize(newCellSize);
    };

    // İlk yüklemede ve ekran boyutu değiştiğinde güncelle
    updateCellSize();
    window.addEventListener('resize', updateCellSize);
    
    return () => {
      window.removeEventListener('resize', updateCellSize);
    };
  }, []);

  return (
    <div className="h-full flex flex-col bg-gray-900/50 backdrop-blur-sm rounded-xl border-2 border-stone-800/50 overflow-hidden">
      {/* Üst Bilgi Çubuğu */}
      <div className="flex-none p-2 flex items-center justify-between border-b border-stone-800/50">
        <div className="flex items-center gap-2">
          <span className="text-amber-500">🎮 Seviye {currentLevel}</span>
          <span className="text-xs text-amber-500/70">
            ({levelData?.title || 'Yükleniyor...'})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetLevel}
            disabled={isRunning}
            className="bg-blue-700/50 hover:bg-blue-600/50 disabled:opacity-50 
                     text-white text-sm py-1 px-3 rounded-lg transition-colors
                     flex items-center gap-1"
          >
            <span>🔄</span>
            <span className="hidden sm:inline">Tekrar</span>
          </button>
        </div>
      </div>

      {/* Oyun Alanı */}
      <div className="flex-1 p-2 min-h-0 relative game-board-container">
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="relative"
            style={{
              width: cellSize * BOARD_SIZE,
              height: cellSize * BOARD_SIZE,
            }}
          >
            {/* Izgara Çizgileri */}
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
              {Array.from({ length: 64 }).map((_, i) => (
                <div
                  key={i}
                  className="border border-stone-800/30"
                />
              ))}
            </div>

            {/* Oyun Elemanları */}
            {levelData?.walls.map((wall, index) => (
              <div
                key={`wall-${index}`}
                className="absolute bg-stone-800"
                style={{
                  width: cellSize,
                  height: cellSize,
                  left: wall.x * cellSize,
                  top: wall.y * cellSize,
                }}
              />
            ))}

            {levelData?.breakableWalls.map((wall, index) => (
              <div
                key={`breakable-${index}`}
                className={`absolute transition-all duration-300
                          ${wall.broken ? 'opacity-0 scale-150' : 'opacity-100 scale-100'}
                          bg-amber-900/80 border border-amber-800/50`}
                style={{
                  width: cellSize,
                  height: cellSize,
                  left: wall.x * cellSize,
                  top: wall.y * cellSize,
                }}
              />
            ))}

            {/* Karakter */}
            <div
              className="absolute transition-all duration-300 ease-out"
              style={{
                width: cellSize,
                height: cellSize,
                left: characterPosition.x * cellSize,
                top: characterPosition.y * cellSize,
                transform: `rotate(${characterRotation}deg)`,
              }}
            >
              <div className="w-full h-full relative">
                <Image
                  src="/images/character.png"
                  alt="Karakter"
                  fill
                  className="object-contain p-1"
                />
              </div>
            </div>

            {/* Hedef */}
            <div
              className="absolute bg-green-500/20 border-2 border-green-500/50 rounded-lg"
              style={{
                width: cellSize,
                height: cellSize,
                left: levelData?.target.x * cellSize,
                top: levelData?.target.y * cellSize,
              }}
            />
          </div>
        </div>
      </div>

      {/* Alt Bilgi Çubuğu */}
      <div className="flex-none p-2 border-t border-stone-800/50">
        <div className="text-xs text-amber-500/70 text-center">
          {isRunning ? '⚡ Komutlar çalıştırılıyor...' : '🎯 Hedefe ulaşmak için komutları kullan'}
        </div>
      </div>

      {/* Başarı Ekranı */}
      {showSuccess && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm 
                       flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl border-2 border-green-500
                         shadow-[0_0_50px_rgba(34,197,94,0.3)]
                         animate-[successPop_0.5s_ease-out]">
            <h2 className="text-2xl font-bold text-green-500 mb-4 text-center">
              🎉 Tebrikler!
            </h2>
            <p className="text-gray-300 mb-6 text-center">
              Bu seviyeyi başarıyla tamamladın!
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleNextLevel}
                className="bg-green-600 hover:bg-green-500 text-white
                         font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Sonraki Seviye ➡️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tutorial Overlay */}
      {isTutorialActive && <TutorialOverlay />}
    </div>
  );
} 