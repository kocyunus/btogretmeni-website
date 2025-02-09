"use client";

import { useGameStore, Command } from '@/store/gameStore';
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { StrictModeDroppable } from './StrictModeDroppable';

interface AnimationState {
  command: string;
  startX: number;
  startY: number;
  isAnimating: boolean;
}

function CommandList({ commands, isRunning, removeCommand }: { 
  commands: Command[],
  isRunning: boolean,
  removeCommand: (index: number) => void 
}) {
  return (
    <StrictModeDroppable droppableId="commands">
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="flex flex-col gap-2"
        >
          {commands.map((cmd, index) => (
            <Draggable 
              key={cmd + "-" + index}
              draggableId={cmd + "-" + index}
              index={index}
              isDragDisabled={isRunning}
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={`
                    group flex items-center justify-between 
                    bg-stone-800/50 rounded-lg px-3 py-2
                    border border-amber-900/30 
                    hover:border-amber-400/30 
                    hover:bg-stone-800/80 
                    transition-all duration-200
                    animate-[commandSettle_0.4s_ease-out]
                    ${!isRunning ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed'}
                    ${snapshot.isDragging ? 'shadow-lg ring-2 ring-amber-400/50 scale-105 rotate-1 z-50 !cursor-grabbing bg-stone-700/90' : ''}
                    ${snapshot.isDragging ? 'shadow-[0_10px_20px_rgba(0,0,0,0.2)]' : ''}
                    touch-none select-none
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400/50 font-mono text-sm">
                      {index + 1}.
                    </span>
                    <span className="font-mono text-amber-400/90">
                      {cmd}
                    </span>
                  </div>
                  <button
                    onClick={() => removeCommand(index)}
                    disabled={isRunning}
                    className="text-red-400/70 opacity-0 group-hover:opacity-100 
                           transition-opacity disabled:opacity-50 hover:text-red-400
                           font-bold px-2"
                    title="Komutu Sil"
                  >
                    ×
                  </button>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </StrictModeDroppable>
  );
}

export default function CommandPanel() {
  const commands = useGameStore((state) => state.commands);
  const maxSteps = useGameStore((state) => state.maxSteps);
  const isRunning = useGameStore((state) => state.isRunning);
  const addCommand = useGameStore((state) => state.addCommand);
  const removeCommand = useGameStore((state) => state.removeCommand);
  const clearCommands = useGameStore((state) => state.clearCommands);
  const runCommands = useGameStore((state) => state.runCommands);
  const stopCommands = useGameStore((state) => state.stopCommands);
  const resetLevel = useGameStore((state) => state.resetLevel);
  const isTutorialActive = useGameStore((state) => state.isTutorialActive);
  const tutorialStep = useGameStore((state) => state.tutorialStep);
  const completeTutorialStep = useGameStore((state) => state.completeTutorialStep);
  const completeTutorial = useGameStore((state) => state.completeTutorial);
  const currentLevel = useGameStore((state) => state.currentLevel);

  // Tutorial'ın sadece birinci ve ikinci seviyede aktif olması için kontrol
  const isTutorialEnabled = (currentLevel === 1 || currentLevel === 2) && isTutorialActive;

  const [animation, setAnimation] = useState<AnimationState | null>(null);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || isRunning) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    const newCommands = Array.from(commands);
    const [movedCommand] = newCommands.splice(sourceIndex, 1);
    newCommands.splice(destinationIndex, 0, movedCommand);

    clearCommands();
    newCommands.forEach(cmd => addCommand(cmd as Command));
  };

  // Komut ekleme fonksiyonu
  const handleAddCommand = (command: Command, e: React.MouseEvent) => {
    if (isRunning) return;

    // Tutorial kontrolü
    if (isTutorialEnabled) {
      if (currentLevel === 1) {
        if (tutorialStep === 'ileri' && command === 'ileri()') {
          completeTutorialStep('ileri');
        } else if (tutorialStep !== 'ileri') {
          return;
        }
      } else if (currentLevel === 2) {
        if (tutorialStep === 'sagaDon' && command === 'sağaDön()') {
          completeTutorialStep('sagaDon');
        } else if (tutorialStep === 'ileri2' && command === 'ileri()') {
          completeTutorialStep('ileri2');
        } else if (tutorialStep !== 'calistir') {
          return;
        }
      }
    }

    // Tıklama pozisyonunu al
    const rect = e.currentTarget.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;

    // Animasyonu başlat
    setAnimation({
      command,
      startX,
      startY,
      isAnimating: true
    });

    // Animasyon bitiminde komutu ekle
    setTimeout(() => {
      addCommand(command);
      setAnimation(null);
    }, 500); // 500ms animasyon süresi
  };

  // Çalıştırma fonksiyonunu güncelle
  const handleRunCommands = async () => {
    if (isTutorialEnabled && tutorialStep === 'calistir') {
      await runCommands();
      completeTutorial();
    } else if (!isTutorialEnabled) {
      runCommands();
    }
  };

  // Tutorial overlay bileşeni
  const TutorialOverlay = () => {
    if (!isTutorialEnabled) return null;

    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {currentLevel === 1 && tutorialStep === 'ileri' && (
          <div className="absolute right-[450px] top-[50%] transform -translate-y-1/2 
                       bg-amber-400 text-black p-4 rounded-lg shadow-xl
                       animate-[bounce_1s_ease-in-out_infinite] pointer-events-none">
            <div className="arrow-right absolute -right-4 top-1/2 transform -translate-y-1/2" />
            <p className="font-bold">İleri komutuna tıklayın!</p>
          </div>
        )}

        {currentLevel === 2 && tutorialStep === 'sagaDon' && (
          <div className="absolute right-[450px] top-[50%] transform -translate-y-1/2 
                       bg-amber-400 text-black p-4 rounded-lg shadow-xl
                       animate-[bounce_1s_ease-in-out_infinite] pointer-events-none">
            <div className="arrow-right absolute -right-4 top-1/2 transform -translate-y-1/2" />
            <p className="font-bold">Önce sağa dönün!</p>
          </div>
        )}

        {currentLevel === 2 && tutorialStep === 'ileri2' && (
          <div className="absolute right-[450px] top-[50%] transform -translate-y-1/2 
                       bg-amber-400 text-black p-4 rounded-lg shadow-xl
                       animate-[bounce_1s_ease-in-out_infinite] pointer-events-none">
            <div className="arrow-right absolute -right-4 top-1/2 transform -translate-y-1/2" />
            <p className="font-bold">Şimdi ileri komutunu kullanın!</p>
          </div>
        )}

        {tutorialStep === 'calistir' && (
          <div className="absolute right-[200px] bottom-[150px] 
                       bg-amber-400 text-black p-4 rounded-lg shadow-xl
                       animate-[bounce_1s_ease-in-out_infinite] pointer-events-none">
            <div className="arrow-down absolute -bottom-4 left-1/2 transform -translate-x-1/2" />
            <p className="font-bold">Şimdi Çalıştır butonuna basın!</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-900/50 backdrop-blur-sm rounded-xl border-2 border-stone-800/50 overflow-hidden">
      {/* Komut Butonları */}
      <div className="flex-none p-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={(e) => handleAddCommand('ileri()', e)}
          disabled={isRunning || commands.length >= maxSteps}
          className="bg-amber-700/50 hover:bg-amber-600/50 disabled:opacity-50 disabled:cursor-not-allowed
                   text-white font-medium py-2 px-4 rounded-lg transition-colors
                   flex items-center justify-center gap-2"
        >
          <span>ileri</span>
          <span className="text-amber-400">()</span>
        </button>
        <button
          onClick={(e) => handleAddCommand('sağaDön()', e)}
          disabled={isRunning || commands.length >= maxSteps}
          className="bg-amber-700/50 hover:bg-amber-600/50 disabled:opacity-50 disabled:cursor-not-allowed
                   text-white font-medium py-2 px-4 rounded-lg transition-colors
                   flex items-center justify-center gap-2"
        >
          <span>sağaDön</span>
          <span className="text-amber-400">()</span>
        </button>
        <button
          onClick={(e) => handleAddCommand('solaDön()', e)}
          disabled={isRunning || commands.length >= maxSteps}
          className="bg-amber-700/50 hover:bg-amber-600/50 disabled:opacity-50 disabled:cursor-not-allowed
                   text-white font-medium py-2 px-4 rounded-lg transition-colors
                   flex items-center justify-center gap-2"
        >
          <span>solaDön</span>
          <span className="text-amber-400">()</span>
        </button>
        <button
          onClick={(e) => handleAddCommand('kır()', e)}
          disabled={isRunning || commands.length >= maxSteps}
          className="bg-amber-700/50 hover:bg-amber-600/50 disabled:opacity-50 disabled:cursor-not-allowed
                   text-white font-medium py-2 px-4 rounded-lg transition-colors
                   flex items-center justify-center gap-2"
        >
          <span>kır</span>
          <span className="text-amber-400">()</span>
        </button>
      </div>

      {/* Komut Listesi */}
      <div className="flex-1 p-2 min-h-0">
        <div className="bg-gray-950/50 rounded-lg p-2 h-full flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-amber-500 flex items-center gap-2">
              📜 Komut Listesi
              <span className="text-sm text-amber-500/70">
                {commands.length} / {maxSteps} adım
              </span>
            </h3>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <StrictModeDroppable droppableId="commands">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-900/50 
                           scrollbar-track-gray-900/30 min-h-[100px]"
                >
                  <CommandList
                    commands={commands}
                    isRunning={isRunning}
                    removeCommand={removeCommand}
                  />
                  {provided.placeholder}
                </div>
              )}
            </StrictModeDroppable>
          </DragDropContext>
        </div>
      </div>

      {/* Kontrol Butonları */}
      <div className="flex-none p-2 grid grid-cols-2 gap-2">
        <button
          onClick={handleRunCommands}
          disabled={isRunning || commands.length === 0}
          className="bg-green-700/50 hover:bg-green-600/50 disabled:opacity-50 disabled:cursor-not-allowed
                   text-white font-medium py-3 px-4 rounded-lg transition-colors
                   flex items-center justify-center gap-2"
        >
          <span>🔥 Çalıştır</span>
        </button>
        <button
          onClick={clearCommands}
          disabled={isRunning || commands.length === 0}
          className="bg-stone-700/50 hover:bg-stone-600/50 disabled:opacity-50 disabled:cursor-not-allowed
                   text-white font-medium py-3 px-4 rounded-lg transition-colors
                   flex items-center justify-center gap-2"
        >
          <span>🧹 Temizle</span>
        </button>
      </div>

      {/* Tutorial Overlay */}
      {isTutorialActive && <TutorialOverlay />}
    </div>
  );
} 