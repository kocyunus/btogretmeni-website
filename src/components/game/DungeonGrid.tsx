"use client";

import { useGameStore } from '@/store/gameStore';
import { Box } from '@react-three/drei';

export default function DungeonGrid() {
  const grid = useGameStore((state) => state.grid);

  return (
    <group>
      {/* Zemin */}
      <Box
        args={[8, 0.2, 8]}
        position={[3.5, -0.1, 3.5]}
        receiveShadow
      >
        <meshStandardMaterial color="#2a2a2a" />
      </Box>

      {/* Duvarlar ve Kapı */}
      {grid.map((row, y) =>
        row.map((cell, x) => {
          if (cell === 0) return null; // Boş hücre

          return (
            <Box
              key={`${x}-${y}`}
              args={[1, cell === 2 ? 1.5 : 2, 1]} // Kapı daha alçak
              position={[x, cell === 2 ? 0.75 : 1, y]}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial
                color={cell === 2 ? "#8b4513" : "#666"} // Kapı kahverengi, duvar gri
                roughness={0.7}
                metalness={0.1}
              />
            </Box>
          );
        })
      )}
    </group>
  );
} 