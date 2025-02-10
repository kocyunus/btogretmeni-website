"use client";

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { PlayIcon, StopIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { Command } from '@/types/game';

export default function CommandPanel() {
  const [mounted, setMounted] = useState(false);
  const commands = useGameStore((state) => state.commands);
  const maxCommands = useGameStore((state) => state.maxCommands);
  const isRunning = useGameStore((state) => state.isRunning);
  const addCommand = useGameStore((state) => state.addCommand);
  const removeCommand = useGameStore((state) => state.removeCommand);
  const clearCommands = useGameStore((state) => state.clearCommands);
  const startExecution = useGameStore((state) => state.startExecution);
  const stopExecution = useGameStore((state) => state.stopExecution);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleCommandClick = (command: Command) => {
    if (commands.length < maxCommands && !isRunning) {
      addCommand(command);
    }
  };

  const handleRemoveCommand = (index: number) => {
    if (!isRunning) {
      removeCommand(index);
    }
  };

  const handleClearCommands = () => {
    if (!isRunning) {
      clearCommands();
    }
  };

  const handleStartExecution = () => {
    if (commands.length > 0 && !isRunning) {
      startExecution();
    }
  };

  const handleStopExecution = () => {
    if (isRunning) {
      stopExecution();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900/50 backdrop-blur-sm rounded-xl border-2 border-stone-800/50">
      {/* Üst Kısım - Komut Butonları */}
      <div className="p-2 border-b border-stone-800/50">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleCommandClick('ileri()')}
            disabled={commands.length >= maxCommands || isRunning}
            className="p-2 rounded-lg border border-amber-900/50 bg-gradient-to-b from-stone-800/80 to-stone-900/80 text-white text-sm font-medium
                     hover:from-stone-700/80 hover:to-stone-800/80 transition-colors duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
          >
            <span className="text-lg">⬆️</span>
            İleri Git
          </button>
          <button
            onClick={() => handleCommandClick('sağaDön()')}
            disabled={commands.length >= maxCommands || isRunning}
            className="p-2 rounded-lg border border-amber-900/50 bg-gradient-to-b from-stone-800/80 to-stone-900/80 text-white text-sm font-medium
                     hover:from-stone-700/80 hover:to-stone-800/80 transition-colors duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
          >
            <span className="text-lg">↪️</span>
            Sağa Dön
          </button>
          <button
            onClick={() => handleCommandClick('solaDön()')}
            disabled={commands.length >= maxCommands || isRunning}
            className="p-2 rounded-lg border border-amber-900/50 bg-gradient-to-b from-stone-800/80 to-stone-900/80 text-white text-sm font-medium
                     hover:from-stone-700/80 hover:to-stone-800/80 transition-colors duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
          >
            <span className="text-lg">↩️</span>
            Sola Dön
          </button>
          <button
            onClick={() => handleCommandClick('kır()')}
            disabled={commands.length >= maxCommands || isRunning}
            className="p-2 rounded-lg border border-amber-900/50 bg-gradient-to-b from-stone-800/80 to-stone-900/80 text-white text-sm font-medium
                     hover:from-stone-700/80 hover:to-stone-800/80 transition-colors duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
          >
            <span className="text-lg">⚔️</span>
            Kır
          </button>
        </div>
      </div>

      {/* Orta Kısım - Seçilen Komutlar */}
      <div className="flex-1 p-2 overflow-y-auto min-h-0">
        <div className="space-y-2">
          {commands.map((command, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-lg bg-gray-800/50 border border-gray-700/50"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {command === 'ileri()' && '⬆️'}
                  {command === 'sağaDön()' && '↪️'}
                  {command === 'solaDön()' && '↩️'}
                  {command === 'kır()' && '⚔️'}
                </span>
                <span className="text-sm text-gray-300">
                  {command === 'ileri()' && 'İleri Git'}
                  {command === 'sağaDön()' && 'Sağa Dön'}
                  {command === 'solaDön()' && 'Sola Dön'}
                  {command === 'kır()' && 'Kır'}
                </span>
              </div>
              <button
                onClick={() => handleRemoveCommand(index)}
                disabled={isRunning}
                className="text-gray-500 hover:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✕
              </button>
            </div>
          ))}
          {commands.length === 0 && (
            <div className="text-center py-4 text-gray-500 text-sm">
              Henüz komut seçilmedi
            </div>
          )}
        </div>
      </div>

      {/* Alt Kısım - Kontrol Butonları */}
      <div className="p-2 border-t border-stone-800/50">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleStartExecution}
            disabled={commands.length === 0 || isRunning}
            className="col-span-2 p-2 rounded-lg bg-gradient-to-b from-amber-600 to-amber-700
                     hover:from-amber-500 hover:to-amber-600
                     disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed
                     text-white font-medium
                     flex items-center justify-center gap-2"
          >
            <PlayIcon className="w-5 h-5" />
            Çalıştır
          </button>
          <button
            onClick={handleClearCommands}
            disabled={commands.length === 0 || isRunning}
            className="p-2 rounded-lg bg-gradient-to-b from-gray-700 to-gray-800
                     hover:from-gray-600 hover:to-gray-700
                     disabled:opacity-50 disabled:cursor-not-allowed
                     text-white
                     flex items-center justify-center"
          >
            <ArrowPathIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-2 text-center text-xs text-gray-500">
          {maxCommands - commands.length} komut hakkınız kaldı
        </div>
      </div>
    </div>
  );
} 