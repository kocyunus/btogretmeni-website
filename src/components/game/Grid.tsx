"use client";

import { useGameStore } from '@/store/gameStore';
import Character from './Character';

export default function Grid() {
  const grid = useGameStore((state) => state.grid);
  const hasKey = useGameStore((state) => state.hasKey);
  const characterPosition = useGameStore((state) => state.characterPosition);
  const characterDirection = useGameStore((state) => state.characterDirection);
  const currentLevel = useGameStore((state) => state.currentLevel);
  const cellSize = 60;

  const getDungeonTheme = (level: number) => {
    // Her iki seviyede bir farklı tema
    const themes = {
      dungeon1: {
        background: 'bg-stone-900',
        wall: 'bg-stone-800 border-stone-900',
        path: 'bg-stone-700 border-stone-600',
        door: 'bg-green-700 border-green-800',
      },
      dungeon2: {
        background: 'bg-slate-900',
        wall: 'bg-slate-800 border-blue-900',
        path: 'bg-slate-700 border-blue-800/30',
        door: 'bg-cyan-600 border-cyan-700',
      },
      dungeon3: {
        background: 'bg-purple-950',
        wall: 'bg-purple-900 border-purple-800',
        path: 'bg-purple-800 border-purple-700/30',
        door: 'bg-fuchsia-600 border-fuchsia-500',
      }
    };

    // Seviye numarasına göre tema seç
    const themeIndex = Math.floor((level - 1) / 2) % 3;
    return themeIndex === 0 ? themes.dungeon1 : 
           themeIndex === 1 ? themes.dungeon2 : 
           themes.dungeon3;
  };

  // Hücre tipi için CSS sınıfları
  const getCellClass = (cell: number) => {
    const theme = getDungeonTheme(currentLevel);
    
    switch (cell) {
      case 0: // Boş yol
        return `${theme.path} border-b-2 border-r-2`;
      case 1: // Duvar
        return `${theme.wall} border-2 shadow-inner`;
      case 2: // Kapı
        return `${theme.door} border-2`;
      case 3: // Anahtar
        return 'bg-yellow-500';
      case 4: // Tuzak
        return 'bg-red-800';
      case 5: // Kırılabilir Engel
        return `relative bg-[#D2B48C] border-2 border-[#BC8F8F]
                before:absolute before:inset-0 
                before:bg-gradient-to-br before:from-[#DEB887]/20 before:to-[#B8860B]/30
                before:mix-blend-overlay before:pointer-events-none
                shadow-[inset_0_0_15px_rgba(0,0,0,0.4)]
                animate-[breakableWall_2s_ease-in-out_infinite]
                hover:animate-[breakableWallHover_1s_ease-in-out_infinite]
                group overflow-hidden
                [&.breaking]:animate-[wallBreak_0.3s_ease-in-out_forwards]`;
      default:
        return theme.path;
    }
  };

  // Parçalanma efekti için yeni bir bileşen
  const BreakingParticles = () => (
    <div className="absolute inset-0 opacity-0 group-[.breaking]:opacity-100">
      {/* Tahta Parçaları */}
      {[...Array(12)].map((_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute left-1/2 top-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2"
          style={{
            backgroundColor: '#8B4513',
            transform: `rotate(${i * 30}deg)`,
            clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
            animation: `particle${i} 0.3s ease-out forwards`,
            boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.4)'
          }}
        >
          <div className="absolute inset-0 bg-[#A0522D]/20" />
        </div>
      ))}

      {/* Küçük Parçacıklar */}
      {[...Array(8)].map((_, i) => (
        <div
          key={`small-${i}`}
          className="absolute left-1/2 top-1/2 w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 bg-[#8B4513] rounded-sm"
          style={{
            animation: `smallParticle${i} 0.2s ease-out forwards 0.1s`,
          }}
        />
      ))}

      {/* Toz Efekti */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 animate-[dust_0.3s_ease-out_forwards]">
          {[...Array(6)].map((_, i) => (
            <div
              key={`dust-${i}`}
              className="absolute left-1/2 top-1/2 w-1 h-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D2B48C]/30"
              style={{
                animation: `dust${i} 0.2s ease-out forwards 0.1s`,
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes wallBreak {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0; }
        }

        @keyframes particle0 { to { transform: translate(30px, -30px) rotate(180deg) scale(0); }}
        @keyframes particle1 { to { transform: translate(-30px, -30px) rotate(-180deg) scale(0); }}
        @keyframes particle2 { to { transform: translate(30px, 30px) rotate(180deg) scale(0); }}
        @keyframes particle3 { to { transform: translate(-30px, 30px) rotate(-180deg) scale(0); }}
        @keyframes particle4 { to { transform: translate(40px, 0px) rotate(90deg) scale(0); }}
        @keyframes particle5 { to { transform: translate(-40px, 0px) rotate(-90deg) scale(0); }}
        @keyframes particle6 { to { transform: translate(0px, 40px) rotate(90deg) scale(0); }}
        @keyframes particle7 { to { transform: translate(0px, -40px) rotate(-90deg) scale(0); }}
        @keyframes particle8 { to { transform: translate(35px, -20px) rotate(135deg) scale(0); }}
        @keyframes particle9 { to { transform: translate(-35px, -20px) rotate(-135deg) scale(0); }}
        @keyframes particle10 { to { transform: translate(35px, 20px) rotate(45deg) scale(0); }}
        @keyframes particle11 { to { transform: translate(-35px, 20px) rotate(-45deg) scale(0); }}

        @keyframes smallParticle0 { to { transform: translate(20px, -20px) scale(0); }}
        @keyframes smallParticle1 { to { transform: translate(-20px, -20px) scale(0); }}
        @keyframes smallParticle2 { to { transform: translate(20px, 20px) scale(0); }}
        @keyframes smallParticle3 { to { transform: translate(-20px, 20px) scale(0); }}
        @keyframes smallParticle4 { to { transform: translate(25px, 0px) scale(0); }}
        @keyframes smallParticle5 { to { transform: translate(-25px, 0px) scale(0); }}
        @keyframes smallParticle6 { to { transform: translate(0px, 25px) scale(0); }}
        @keyframes smallParticle7 { to { transform: translate(0px, -25px) scale(0); }}

        @keyframes dust0 { to { transform: translate(15px, -15px) scale(2) opacity(0); }}
        @keyframes dust1 { to { transform: translate(-15px, -15px) scale(2) opacity(0); }}
        @keyframes dust2 { to { transform: translate(15px, 15px) scale(2) opacity(0); }}
        @keyframes dust3 { to { transform: translate(-15px, 15px) scale(2) opacity(0); }}
        @keyframes dust4 { to { transform: translate(20px, 0px) scale(2) opacity(0); }}
        @keyframes dust5 { to { transform: translate(-20px, 0px) scale(2) opacity(0); }}
      `}</style>
    </div>
  );

  // Hücre içeriği
  const getCellContent = (cell: number) => {
    switch (cell) {
      case 2: // Kapı
        return '🚪';
      case 3: // Anahtar
        return '🔑';
      case 4: // Tuzak
        return '💀';
      case 5: // Kırılabilir Engel
        return (
          <>
            {/* Ana Çatlak Deseni */}
            <div className="absolute inset-0">
              {/* Dağınık Çatlaklar */}
              <div className="absolute w-full h-full">
                {/* Sol Üst Çatlaklar */}
                <div className="absolute left-[10%] top-[15%] w-[30%] h-0.5 bg-[#8B4513]/80 transform rotate-[35deg]" />
                <div className="absolute left-[5%] top-[25%] w-[20%] h-0.5 bg-[#8B4513]/60 transform rotate-[-15deg]" />
                <div className="absolute left-[25%] top-[10%] w-[15%] h-px bg-[#8B4513]/40 transform rotate-[65deg]" />
                
                {/* Sağ Üst Çatlaklar */}
                <div className="absolute right-[15%] top-[20%] w-[25%] h-0.5 bg-[#8B4513]/70 transform rotate-[-45deg]" />
                <div className="absolute right-[8%] top-[35%] w-[18%] h-px bg-[#8B4513]/50 transform rotate-[25deg]" />
                
                {/* Orta Çatlaklar */}
                <div className="absolute left-[40%] top-[45%] w-[35%] h-0.5 bg-[#8B4513] transform rotate-[5deg]" />
                <div className="absolute right-[35%] top-[55%] w-[30%] h-0.5 bg-[#8B4513]/90 transform rotate-[-8deg]" />
                
                {/* Sol Alt Çatlaklar */}
                <div className="absolute left-[12%] bottom-[30%] w-[28%] h-0.5 bg-[#8B4513]/75 transform rotate-[18deg]" />
                <div className="absolute left-[20%] bottom-[15%] w-[22%] h-px bg-[#8B4513]/45 transform rotate-[-28deg]" />
                
                {/* Sağ Alt Çatlaklar */}
                <div className="absolute right-[10%] bottom-[25%] w-[25%] h-0.5 bg-[#8B4513]/65 transform rotate-[-55deg]" />
                <div className="absolute right-[22%] bottom-[12%] w-[20%] h-px bg-[#8B4513]/55 transform rotate-[38deg]" />
                
                {/* İnce Bağlantı Çatlakları */}
                <div className="absolute left-[35%] top-[30%] w-[12%] h-px bg-[#8B4513]/40 transform rotate-[75deg]" />
                <div className="absolute right-[42%] bottom-[40%] w-[10%] h-px bg-[#8B4513]/30 transform rotate-[-65deg]" />
                <div className="absolute left-[45%] bottom-[35%] w-[8%] h-px bg-[#8B4513]/35 transform rotate-[42deg]" />
              </div>
              
              {/* Gölgelendirme */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#8B4513]/5 to-[#8B4513]/15" />
            </div>
            
            {/* Toprak Dokusu */}
            <div className="absolute inset-0">
              <div className="absolute top-[15%] left-[20%] w-1 h-1 rounded-full bg-[#A0522D]/40" />
              <div className="absolute top-[45%] right-[15%] w-1.5 h-1.5 rounded-full bg-[#A0522D]/35" />
              <div className="absolute bottom-[25%] left-[35%] w-1 h-1 rounded-full bg-[#A0522D]/45" />
              <div className="absolute top-[75%] right-[30%] w-2 h-2 rounded-full bg-[#A0522D]/30" />
              <div className="absolute top-[30%] left-[60%] w-1.5 h-1.5 rounded-full bg-[#A0522D]/35" />
              <div className="absolute bottom-[40%] right-[45%] w-1 h-1 rounded-full bg-[#A0522D]/40" />
            </div>

            {/* Parçalanma Efekti */}
            <BreakingParticles />
          </>
        );
      default:
        return '';
    }
  };

  // Sütun için gecikme hesaplama
  const getColumnDelay = (x: number, totalColumns: number) => {
    const middleColumn = Math.floor(totalColumns / 2);
    const distanceFromMiddle = Math.abs(x - middleColumn);
    return distanceFromMiddle * 0.05; // Gecikmeyi 0.05 saniyeye düşürdük
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative" key={currentLevel}>
        <div 
          className={`grid gap-0 ${getDungeonTheme(currentLevel).background} p-2 rounded-lg shadow-2xl`}
          style={{
            gridTemplateColumns: `repeat(${grid[0].length}, ${cellSize}px)`,
          }}
        >
          {grid.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                data-cell={`${x}-${y}`}
                className={`
                  flex items-center justify-center
                  text-2xl
                  ${getCellClass(cell)}
                  animate-[tileAppear_0.3s_ease-out_forwards]
                `}
                style={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                  animationDelay: `${getColumnDelay(x, grid[0].length)}s`,
                  opacity: 0,
                  transform: 'scale(0.5) translateY(-10px)',
                }}
              >
                {getCellContent(cell)}
              </div>
            ))
          )}
        </div>
        
        {/* Karakter */}
        <div className="absolute top-0 left-0 w-full h-full">
          <Character
            position={characterPosition}
            direction={characterDirection}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes tileAppear {
          0% {
            opacity: 0;
            transform: scale(0.5) translateY(-10px);
          }
          50% {
            opacity: 1;
            transform: scale(1.1) translateY(3px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes breakableWall {
          0%, 100% { 
            border-color: #BC8F8F;
            box-shadow: inset 0 0 15px rgba(0,0,0,0.4),
                        0 0 10px rgba(188,143,143,0.3);
          }
          50% { 
            border-color: #D2B48C;
            box-shadow: inset 0 0 15px rgba(0,0,0,0.3),
                        0 0 20px rgba(210,180,140,0.4);
          }
        }

        @keyframes breakableWallHover {
          0%, 100% { 
            transform: scale(1);
            filter: brightness(1.2) contrast(1.1);
          }
          50% { 
            transform: scale(1.02);
            filter: brightness(1.4) contrast(1.2);
          }
        }

        @keyframes wallBreak {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0; }
        }
      `}</style>
    </div>
  );
} 