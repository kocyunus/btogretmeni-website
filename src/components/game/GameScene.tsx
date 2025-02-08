"use client";

import { useGameStore } from '@/store/gameStore';
import Character from './Character';
import Grid from './Grid';

export default function GameScene() {
  const { characterPosition, characterDirection } = useGameStore();

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      {/* Oyun Alanı */}
      <div className="absolute inset-0">
        <Grid />
        <Character position={characterPosition} direction={characterDirection} />
      </div>
    </div>
  );
} 