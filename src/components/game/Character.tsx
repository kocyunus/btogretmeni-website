"use client";

import { Direction } from '@/store/gameStore';
import { useGameStore } from '@/store/gameStore';
import { useState, useEffect } from 'react';

interface CharacterProps {
  position: { x: number; y: number };
  direction: Direction;
}

export default function Character({ position, direction }: CharacterProps) {
  const cellSize = 60;
  const isSuccess = useGameStore((state) => state.isLevelComplete);
  const [showBeam, setShowBeam] = useState(true);
  const [showCharacter, setShowCharacter] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const commands = useGameStore((state) => state.commands);

  useEffect(() => {
    // Işık animasyonu bittikten sonra karakteri göster
    const beamTimer = setTimeout(() => {
      setShowBeam(false);
      setShowCharacter(true);
    }, 400);

    return () => clearTimeout(beamTimer);
  }, []);

  // Kırma animasyonunu kontrol et
  useEffect(() => {
    if (commands[0] === 'kır()' && !isBreaking) {
      setIsBreaking(true);
      setTimeout(() => setIsBreaking(false), 500);
    }
  }, [commands]);

  const getCharacterStyle = () => {
    // Yön için derece hesapla
    const rotations = {
      north: 'rotate-0',
      east: 'rotate-90',
      south: 'rotate-180',
      west: '-rotate-90'
    };

    return `
      ${rotations[direction]}
      transform-gpu
      transition-transform
      duration-300
      ${isSuccess ? 'animate-[victory_0.5s_ease-in-out_infinite]' : ''}
      ${isBreaking ? 'animate-[breaking_0.5s_ease-in-out]' : ''}
    `;
  };

  return (
    <div
      className="absolute transition-all duration-300 ease-out"
      style={{
        width: `${cellSize}px`,
        height: `${cellSize}px`,
        transform: `translate(${position.x * cellSize + 8}px, ${position.y * cellSize + 8}px)`,
        zIndex: 10
      }}
    >
      {/* Kırma Efekti */}
      {isBreaking && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute w-full h-full">
            {/* Enerji Dalgası */}
            <div className="absolute inset-0 animate-[energyWave_0.5s_ease-out]">
              <div className="w-full h-full rounded-full border-4 border-amber-400/50" />
            </div>
            {/* Enerji Parçacıkları */}
            <div className="absolute inset-0 flex items-center justify-center">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-amber-400"
                  style={{
                    animation: `particle_${i} 0.5s ease-out forwards`,
                    transform: `rotate(${i * 45}deg) translateY(-20px)`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Işık Huzmesi Efekti */}
      {showBeam && (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div className="absolute w-6 h-[120px] animate-[beamDown_0.4s_ease-out]">
            {/* Ana Işık */}
            <div className="absolute inset-0 bg-gradient-to-b from-amber-400 via-amber-400/70 to-transparent" />
            
            {/* Işık Parlaması */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-amber-200/50 to-transparent blur-sm" />
            
            {/* Üst Parlama */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-amber-300/50 rounded-full blur-xl animate-[topGlow_0.4s_ease-out]" />
            
            {/* Alt Parlama */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-amber-400/50 rounded-full blur-md" />
          </div>
        </div>
      )}

      {/* Karakter */}
      {showCharacter && (
        <div className={`
          w-full h-full 
          flex items-center justify-center
          ${getCharacterStyle()}
        `}>
          {/* Karakter Görünümü */}
          <div className="relative w-3/4 h-3/4">
            {/* Karakter Gövdesi */}
            <div className={`absolute inset-0 bg-blue-500 rounded-lg shadow-lg
                          ${isSuccess ? 'animate-[glow_0.5s_ease-in-out_infinite]' : ''}`} />
            
            {/* Karakter Yüzü */}
            <div className="absolute inset-x-0 top-1/4 flex justify-center gap-2">
              <div className={`w-2 h-2 bg-white rounded-full shadow-inner
                           ${isSuccess ? 'animate-[wink_0.5s_ease-in-out_infinite]' : ''}`} />
              <div className={`w-2 h-2 bg-white rounded-full shadow-inner
                           ${isSuccess ? 'animate-[wink_0.5s_ease-in-out_infinite]' : ''}`} />
            </div>
            
            {/* Karakter Ağzı */}
            <div className="absolute inset-x-0 bottom-1/4 flex justify-center">
              <div className={`w-4 h-1 bg-white rounded-full shadow-inner
                           ${isSuccess ? 'animate-[smile_0.3s_ease-in-out_forwards]' : ''}`} />
            </div>

            {/* Yön İşareti */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 
                            border-l-[6px] border-l-transparent
                            border-r-[6px] border-r-transparent
                            border-b-[8px] border-b-blue-300" />
            </div>
          </div>
        </div>
      )}

      {/* Sevinç Efekti */}
      {isSuccess && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute w-full h-full animate-[successRing_0.5s_ease-out_forwards]">
            <div className="w-full h-full rounded-full border-4 border-yellow-400/50" />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes beamDown {
          0% { 
            transform: translateY(-50px) scale(1, 0);
            opacity: 0;
            width: 8px;
          }
          10% {
            transform: translateY(-40px) scale(1, 0.3);
            opacity: 1;
            width: 8px;
          }
          30% {
            transform: translateY(-20px) scale(1, 0.7);
            opacity: 1;
            width: 6px;
          }
          60% {
            transform: translateY(0) scale(1, 1);
            opacity: 0.8;
            width: 4px;
          }
          90% {
            transform: translateY(30px) scale(1, 0.5);
            opacity: 0.5;
            width: 2px;
          }
          100% { 
            transform: translateY(50px) scale(1, 0);
            opacity: 0;
            width: 1px;
          }
        }

        @keyframes topGlow {
          0% {
            transform: translate(-50%, 0) scale(0.5);
            opacity: 0;
          }
          30% {
            transform: translate(-50%, 0) scale(1.2);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, 0) scale(0.8);
            opacity: 0;
          }
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes victory {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.1); }
        }

        @keyframes glow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.3); }
        }

        @keyframes wink {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.3); }
        }

        @keyframes smile {
          0% { transform: scaleX(1) translateY(0); }
          100% { transform: scaleX(1.5) translateY(-2px); height: 3px; border-radius: 100%; }
        }

        @keyframes successRing {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }

        @keyframes breaking {
          0% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.2) rotate(-5deg); }
          50% { transform: scale(1.1) rotate(5deg); }
          75% { transform: scale(1.2) rotate(-5deg); }
          100% { transform: scale(1) rotate(0deg); }
        }

        @keyframes energyWave {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }

        @keyframes particle_0 { to { transform: rotate(0deg) translateY(-50px) scale(0); opacity: 0; }}
        @keyframes particle_1 { to { transform: rotate(45deg) translateY(-50px) scale(0); opacity: 0; }}
        @keyframes particle_2 { to { transform: rotate(90deg) translateY(-50px) scale(0); opacity: 0; }}
        @keyframes particle_3 { to { transform: rotate(135deg) translateY(-50px) scale(0); opacity: 0; }}
        @keyframes particle_4 { to { transform: rotate(180deg) translateY(-50px) scale(0); opacity: 0; }}
        @keyframes particle_5 { to { transform: rotate(225deg) translateY(-50px) scale(0); opacity: 0; }}
        @keyframes particle_6 { to { transform: rotate(270deg) translateY(-50px) scale(0); opacity: 0; }}
        @keyframes particle_7 { to { transform: rotate(315deg) translateY(-50px) scale(0); opacity: 0; }}
      `}</style>
    </div>
  );
} 