"use client";

import GameBoard from '@/components/game/GameBoard';
import CommandPanel from '@/components/game/CommandPanel';

export default function GamePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4">
      <div className="container mx-auto h-[calc(100vh-2rem)]">
        {/* Mobil Ekranlarda Dikey, Masaüstünde Yatay Düzen */}
        <div className="h-full grid grid-rows-[1fr_auto] md:grid-rows-1 md:grid-cols-[1fr_400px] gap-4">
          {/* Oyun Alanı */}
          <div className="relative">
            <GameBoard />
          </div>

          {/* Komut Paneli */}
          <div className="relative">
            <CommandPanel />
          </div>
        </div>
      </div>
    </main>
  );
} 