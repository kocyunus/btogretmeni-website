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

  // Komut butonları için konfigürasyon
  const commandButtons: {
    command: Command;
    label: string;
    description: string;
    isHighlighted?: boolean;
  }[] = [
    {
      command: 'ileri()',
      label: 'ileri',
      description: 'Karakteri bir adım ileri götür',
      isHighlighted: (isTutorialEnabled && tutorialStep === 'ileri') || 
                    (isTutorialEnabled && tutorialStep === 'ileri2')
    },
    {
      command: 'sağaDön()',
      label: 'sağaDön',
      description: '90 derece sağa dön',
      isHighlighted: isTutorialEnabled && tutorialStep === 'sagaDon'
    },
    {
      command: 'solaDön()',
      label: 'solaDön',
      description: '90 derece sola dön'
    },
    {
      command: 'kır()',
      label: 'kır',
      description: 'Önündeki kırılabilir engeli yok et'
    }
  ];

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
    <div className="relative">
      <TutorialOverlay />
      
      <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border-2 border-stone-800/50 relative overflow-hidden">
        {/* Arka Plan Efektleri */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('/images/scroll-texture.png')] bg-repeat opacity-5" />
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-amber-500/5" />
        </div>

        {/* Meşale Efekti */}
        <div className="absolute -top-10 right-0 w-32 h-32">
          <div className="absolute inset-0 bg-gradient-radial from-amber-500/20 via-amber-500/5 to-transparent 
                       animate-[torchLight_4s_ease-in-out_infinite]" />
        </div>

        {/* Animasyon Elementi */}
        {animation && (
          <div
            className="absolute pointer-events-none font-mono text-xl font-bold
                       z-50 flex items-center gap-2"
            style={{
              left: animation.startX,
              top: animation.startY,
              animation: 'commandPop 0.4s cubic-bezier(.22,1.28,.54,.87) forwards'
            }}
          >
            <div className="bg-gradient-to-r from-amber-500 to-orange-600
                          text-white px-4 py-2 rounded-lg
                          shadow-[0_0_20px_rgba(245,158,11,0.6)]
                          border-2 border-amber-400
                          animate-[commandShake_0.2s_ease-in-out_2]">
              {animation.command}
            </div>
          </div>
        )}

        {/* Komut Butonları */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 relative">
          {commandButtons.map(({ command, label, description, isHighlighted }) => (
            <button
              key={command}
              onClick={(e) => {
                const target = e.currentTarget;
                if (target) {
                  target.style.animation = 'buttonPress 0.15s ease-in-out';
                  handleAddCommand(command, e);
                  setTimeout(() => {
                    if (target && target.style) {
                      target.style.animation = '';
                    }
                  }, 150);
                }
              }}
              disabled={isRunning || commands.length >= maxSteps}
              className={`
                relative px-3 py-2
                ${isHighlighted 
                  ? 'bg-gradient-to-b from-amber-500/90 to-amber-600/90 hover:from-amber-400/90 hover:to-amber-500/90 text-white animate-[pulse_2s_ease-in-out_infinite] ring-2 ring-amber-400/50 scale-110 z-20'
                  : 'bg-gradient-to-b from-amber-900/80 to-amber-950/80 hover:from-amber-800/80 hover:to-amber-900/80 text-amber-400'}
                disabled:from-gray-800/50 disabled:to-gray-900/50
                rounded-lg transition-all
                group font-mono text-sm sm:text-base
                border border-amber-700/30 hover:border-amber-500/50
                hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]
                active:shadow-[0_0_30px_rgba(245,158,11,0.3)]
                disabled:hover:translate-y-0 disabled:hover:border-gray-800/30
                disabled:text-gray-600 disabled:hover:shadow-none
                backdrop-blur-sm
                w-full truncate
              `}
              title={description}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isHighlighted && <span className="text-lg">⭐</span>}
                {label}
              </span>
              {/* Buton Parıltı Efekti */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 
                           transition-opacity duration-300 pointer-events-none">
                <div className={`absolute inset-0 bg-gradient-to-r 
                             from-amber-500/0 via-amber-500/10 to-amber-500/0 
                             animate-[shimmer_2s_infinite]
                             ${isHighlighted ? 'via-amber-400/30' : ''}`} />
              </div>
            </button>
          ))}
        </div>

        {/* Komut Listesi */}
        <div className="mb-4 relative">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-amber-400 font-bold text-sm flex items-center gap-2">
              📜 Komut Listesi
              {commands.length > 1 && (
                <span className="text-xs text-amber-400/70 hidden sm:inline">
                  (Sıralamayı değiştirmek için sürükle)
                </span>
              )}
            </h3>
            <span className="text-xs text-amber-400/70">
              {commands.length} / {maxSteps} adım
            </span>
          </div>
          <div className="bg-gradient-to-b from-stone-900/90 to-stone-950/90 p-2 rounded-lg
                        min-h-[100px] max-h-[calc(100vh-20rem)]
                        overflow-y-auto scrollbar-thin scrollbar-thumb-amber-900/50 scrollbar-track-transparent
                        border border-amber-800/30 shadow-[inset_0_0_30px_rgba(0,0,0,0.5)]
                        backdrop-blur-sm relative hover:scrollbar-thumb-amber-700/50
                        transition-all duration-300 ease-in-out">
            {/* Parşömen Dokusu */}
            <div className="absolute inset-0 bg-[url('/images/parchment-texture.png')] bg-repeat opacity-5" />
            
            <div className="relative">
              {commands.length === 0 ? (
                <div className="text-amber-400/50 text-center py-2 text-sm">
                  Komut eklemek için yukarıdaki butonları kullanın
                </div>
              ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <CommandList 
                    commands={commands}
                    isRunning={isRunning}
                    removeCommand={removeCommand}
                  />
                </DragDropContext>
              )}
            </div>
          </div>
        </div>

        {/* Kontrol Butonları */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={handleRunCommands}
            disabled={isRunning || commands.length === 0 || 
                    (isTutorialEnabled && tutorialStep !== 'calistir')}
            className="col-span-2 px-4 py-2 
                     bg-gradient-to-b from-amber-600/90 to-amber-800/90
                     hover:from-amber-500/90 hover:to-amber-700/90
                     disabled:from-gray-800/50 disabled:to-gray-900/50
                     text-white rounded-lg transition-all font-medium text-sm
                     border border-amber-500/30 hover:border-amber-400/50
                     hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]
                     hover:-translate-y-0.5 active:translate-y-0
                     disabled:hover:translate-y-0 disabled:hover:shadow-none
                     disabled:border-gray-800/30 disabled:text-gray-600
                     backdrop-blur-sm
                     animate-[torchGlow_2s_ease-in-out_infinite]
                     relative group"
          >
            <span className="relative z-10">
              {isRunning ? '⚡ Çalışıyor...' : '🔥 Çalıştır'}
            </span>
            {/* Buton Parıltı Efekti */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 
                         transition-opacity duration-300 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r 
                           from-amber-500/0 via-amber-500/10 to-amber-500/0 
                           animate-[shimmer_2s_infinite]" />
            </div>
          </button>
          
          <button
            onClick={clearCommands}
            disabled={isRunning || commands.length === 0}
            className="px-4 py-2 
                     bg-gradient-to-b from-stone-700/90 to-stone-800/90
                     hover:from-stone-600/90 hover:to-stone-700/90
                     disabled:from-gray-800/50 disabled:to-gray-900/50
                     text-white rounded-lg transition-all font-medium text-sm
                     border border-stone-500/30 hover:border-stone-400/50
                     hover:shadow-[0_0_15px_rgba(120,113,108,0.3)]
                     hover:-translate-y-0.5 active:translate-y-0
                     disabled:hover:translate-y-0 disabled:hover:shadow-none
                     disabled:border-gray-800/30 disabled:text-gray-600
                     backdrop-blur-sm
                     relative group"
          >
            <span className="relative z-10">🧹 Temizle</span>
            {/* Buton Parıltı Efekti */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 
                         transition-opacity duration-300 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r 
                           from-stone-500/0 via-stone-500/10 to-stone-500/0 
                           animate-[shimmer_2s_infinite]" />
            </div>
          </button>

          <button
            onClick={resetLevel}
            disabled={isRunning}
            className="px-4 py-2 
                     bg-gradient-to-b from-blue-900/90 to-blue-950/90
                     hover:from-blue-800/90 hover:to-blue-900/90
                     disabled:from-gray-800/50 disabled:to-gray-900/50
                     text-white rounded-lg transition-all font-medium text-sm
                     border border-blue-500/30 hover:border-blue-400/50
                     hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]
                     hover:-translate-y-0.5 active:translate-y-0
                     disabled:hover:translate-y-0 disabled:hover:shadow-none
                     disabled:border-gray-800/30 disabled:text-gray-600
                     backdrop-blur-sm
                     relative group"
          >
            <span className="relative z-10">🔄 Tekrar</span>
            {/* Buton Parıltı Efekti */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 
                         transition-opacity duration-300 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r 
                           from-blue-500/0 via-blue-500/10 to-blue-500/0 
                           animate-[shimmer_2s_infinite]" />
            </div>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes commandPop {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0;
          }
          20% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 1;
          }
          40% {
            transform: translate(-40%, -30%) scale(1.1);
          }
          60% {
            transform: translate(-20%, 20%) scale(1);
          }
          80% {
            transform: translate(0%, 60%) scale(0.9);
          }
          100% {
            transform: translate(0, 100px) scale(0.7);
            opacity: 0;
          }
        }

        @keyframes commandShake {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-8deg) scale(1.1); }
          50% { transform: rotate(0deg) scale(1); }
          75% { transform: rotate(8deg) scale(1.1); }
          100% { transform: rotate(0deg) scale(1); }
        }

        @keyframes commandSettle {
          0% { 
            transform: scale(1.1) translateY(-4px);
            box-shadow: 0 6px 8px rgba(0,0,0,0.2);
          }
          20% { 
            transform: scale(1.05) translateY(-2px) rotate(-1deg);
            box-shadow: 0 4px 6px rgba(0,0,0,0.15);
          }
          40% { 
            transform: scale(1.02) translateY(0px) rotate(1deg);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          60% { 
            transform: scale(0.98) translateY(1px) rotate(-0.5deg);
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          }
          80% { 
            transform: scale(1.01) translateY(0px) rotate(0.5deg);
          }
          100% { 
            transform: scale(1) translateY(0) rotate(0);
          }
        }

        @keyframes torchLight {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        @keyframes buttonPress {
          0% { transform: scale(1); }
          50% { transform: scale(0.92); }
          100% { transform: scale(1); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .arrow-right {
          width: 0; 
          height: 0; 
          border-top: 10px solid transparent;
          border-bottom: 10px solid transparent;
          border-left: 10px solid rgb(251, 191, 36);
        }
        .arrow-down {
          width: 0; 
          height: 0; 
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 10px solid rgb(251, 191, 36);
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
} 