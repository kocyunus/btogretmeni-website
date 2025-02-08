"use client";

import { create } from 'zustand';
import { StateCreator } from 'zustand';

export type Direction = 'north' | 'east' | 'south' | 'west';
export type Command = 'ileri()' | 'sağaDön()' | 'solaDön()' | 'kır()';

interface Position {
  x: number;
  y: number;
}

// Seviye verileri
const gameLevels = [
  {
    id: 1,
    title: "Başlangıç",
    description: "Temel hareketleri öğren",
    grid: [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 2, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1],
    ],
    startPosition: { x: 2, y: 2 },
    exitPosition: { x: 3, y: 2 },
    maxSteps: 1,
  },
  {
    id: 2,
    title: "Dönüşler",
    description: "Dönüş komutlarını kullanmayı öğren",
    grid: [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 2, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1],
    ],
    startPosition: { x: 2, y: 2 },
    exitPosition: { x: 2, y: 3 },
    maxSteps: 2,
  },
  {
    id: 3,
    title: "Labirent",
    description: "Karmaşık yolları çöz",
    grid: [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 2, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1],
    ],
    startPosition: { x: 2, y: 2 },
    exitPosition: { x: 3, y: 1 },
    maxSteps: 3,
  },
  {
    id: 4,
    title: "Uzun Yolculuk",
    description: "Daha uzun bir rotayı planla",
    grid: [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 2, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1],
    ],
    startPosition: { x: 1, y: 1 },
    exitPosition: { x: 3, y: 2 },
    maxSteps: 10,
  },
  {
    id: 5,
    title: "Büyük Final",
    description: "Tüm öğrendiklerini kullan",
    grid: [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 2, 1],
      [1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 1, 0, 0, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1],
    ],
    startPosition: { x: 2, y: 3 },
    exitPosition: { x: 5, y: 1 },
    maxSteps: 6,
  },
  {
    id: 6,
    title: "Kırılabilir Duvarlar",
    description: "Engelleri kırmayı öğren",
    grid: [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 5, 0, 2, 1],
      [1, 1, 1, 1, 1, 1, 1],
    ],
    startPosition: { x: 2, y: 2 },
    exitPosition: { x: 5, y: 2 },
    maxSteps: 4,
  },
  {
    id: 7,
    title: "Çoklu Engeller",
    description: "Birden fazla engeli aşarak hedefe ulaş",
    grid: [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 5, 0, 0, 2, 1],
      [1, 0, 1, 5, 0, 0, 1],
      [1, 0, 5, 0, 5, 0, 1],
      [1, 1, 1, 1, 1, 1, 1],
    ],
    startPosition: { x: 1, y: 1 },
    exitPosition: { x: 5, y: 1 },
    maxSteps: 8,
  },
  {
    id: 8,
    title: "Labirent ve Engeller",
    description: "Karmaşık bir yolda ilerle",
    grid: [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 5, 0, 5, 2, 1],
      [1, 5, 1, 1, 1, 5, 1],
      [1, 0, 5, 0, 5, 0, 1],
      [1, 1, 1, 1, 1, 1, 1],
    ],
    startPosition: { x: 1, y: 3 },
    exitPosition: { x: 5, y: 1 },
    maxSteps: 8,
  },
  {
    id: 9,
    title: "Stratejik Yıkım",
    description: "Doğru engelleri seç",
    grid: [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 5, 0, 5, 2, 1],
      [1, 5, 1, 1, 1, 0, 1],
      [1, 0, 5, 0, 5, 0, 1],
      [1, 1, 1, 1, 1, 1, 1],
    ],
    startPosition: { x: 1, y: 1 },
    exitPosition: { x: 5, y: 1 },
    maxSteps: 12,
  },
  {
    id: 10,
    title: "Büyük Final II",
    description: "Tüm yeteneklerini kullan",
    grid: [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 5, 1, 0, 2, 1],
      [1, 5, 1, 1, 5, 0, 1],
      [1, 0, 5, 1, 0, 5, 1],
      [1, 0, 0, 5, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1],
    ],
    startPosition: { x: 4, y: 4 },
    exitPosition: { x: 5, y: 1 },
    maxSteps: 15,
  },
  {
    id: 11,
    title: "Labirent Yıkımı",
    description: "Doğru duvarları kırarak yolunu bul",
    grid: [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 5, 1, 5, 2, 1],
      [1, 5, 1, 5, 1, 0, 1],
      [1, 0, 5, 0, 5, 0, 1],
      [1, 1, 1, 1, 1, 1, 1],
    ],
    startPosition: { x: 3, y: 3 },
    exitPosition: { x: 5, y: 1 },
    maxSteps: 10,
  },
];

interface GameState {
  // Karakter durumu
  characterPosition: Position;
  characterDirection: Direction;
  
  // Komut sistemi
  commands: Command[];
  isRunning: boolean;
  
  // Seviye durumu
  currentLevel: number;
  completedLevels: number[];
  maxSteps: number;
  grid: number[][];
  startPosition: Position;
  exitPosition: Position;
  hasKey: boolean;
  isLevelComplete: boolean;
  showSuccessModal: boolean;
  levels: typeof gameLevels;
  
  // Tutorial durumu
  isTutorialActive: boolean;
  tutorialStep: 'ileri' | 'calistir' | 'completed' | 'sagaDon' | 'ileri2';
  hasCompletedTutorial: boolean;
  hasCompletedLevel2Tutorial: boolean;
  
  // Metodlar
  addCommand: (command: Command) => void;
  removeCommand: (index: number) => void;
  clearCommands: () => void;
  runCommands: () => void;
  stopCommands: () => void;
  moveCharacter: (newPosition: Position) => void;
  rotateCharacter: (newDirection: Direction) => void;
  collectKey: () => void;
  checkLevelComplete: () => void;
  resetLevel: () => void;
  loadLevel: (levelId: number) => void;
  goToNextLevel: () => void;
  breakWall: () => void;
  
  // Tutorial metodları
  startTutorial: () => void;
  completeTutorialStep: (step: 'ileri' | 'calistir' | 'sagaDon' | 'ileri2') => void;
  completeTutorial: () => void;
}

interface GameProgress {
  currentLevel: number;
  completedLevels: number[];
}

// Local Storage işlemleri için yardımcı fonksiyonlar
const saveProgress = (progress: GameProgress) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('gameProgress', JSON.stringify(progress));
    } catch (error) {
      console.error('Progress kaydedilirken hata:', error);
    }
  }
};

const loadProgress = (): GameProgress => {
  if (typeof window === 'undefined') {
    return { currentLevel: 1, completedLevels: [] };
  }

  try {
    const saved = localStorage.getItem('gameProgress');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Progress yüklenirken hata:', error);
  }
  
  return { currentLevel: 1, completedLevels: [] };
};

type GameStore = StateCreator<GameState>;

export const useGameStore = create<GameState>((set, get) => {
  // Başlangıç durumu
  const initialState = {
    currentLevel: 1,
    completedLevels: [] as number[],
    characterPosition: gameLevels[0].startPosition,
    characterDirection: 'east' as Direction,
    commands: [] as Command[],
    isRunning: false,
    hasKey: true,
    isLevelComplete: false,
    showSuccessModal: false,
    grid: gameLevels[0].grid,
    startPosition: gameLevels[0].startPosition,
    exitPosition: gameLevels[0].exitPosition,
    maxSteps: gameLevels[0].maxSteps,
    levels: gameLevels,
    
    // Tutorial durumu
    isTutorialActive: false,
    tutorialStep: 'ileri' as 'ileri' | 'calistir' | 'completed' | 'sagaDon' | 'ileri2',
    hasCompletedTutorial: false,
    hasCompletedLevel2Tutorial: false,
  };

  // Client tarafında ise kayıtlı ilerlemeyi yükle
  if (typeof window !== 'undefined') {
    const savedProgress = loadProgress();
    const levelIndex = savedProgress.currentLevel - 1;
    if (levelIndex >= 0 && levelIndex < gameLevels.length) {
      initialState.currentLevel = savedProgress.currentLevel;
      initialState.completedLevels = savedProgress.completedLevels;
      initialState.characterPosition = gameLevels[levelIndex].startPosition;
      initialState.grid = gameLevels[levelIndex].grid;
      initialState.startPosition = gameLevels[levelIndex].startPosition;
      initialState.exitPosition = gameLevels[levelIndex].exitPosition;
      initialState.maxSteps = gameLevels[levelIndex].maxSteps;
    }
  }

  return {
    ...initialState,
    // Metodlar
    addCommand: (command) => {
      const { commands, isRunning } = get();
      if (!isRunning) {
        set((state) => ({
          commands: [...state.commands, command],
        }));
      }
    },

    removeCommand: (index) => {
      if (!get().isRunning) {
        set((state) => ({
          commands: state.commands.filter((_, i) => i !== index),
        }));
      }
    },

    clearCommands: () => {
      if (!get().isRunning) {
        set({ commands: [] });
      }
    },

    runCommands: async () => {
      const state = get();
      if (state.isRunning || state.commands.length === 0) return;

      set({ isRunning: true });

      for (const command of state.commands) {
        if (!get().isRunning) break;

        await new Promise(resolve => setTimeout(resolve, 500));

        switch (command) {
          case 'ileri()': {
            const { characterPosition, characterDirection } = get();
            const newPosition = { ...characterPosition };

            switch (characterDirection) {
              case 'north':
                newPosition.y -= 1;
                break;
              case 'east':
                newPosition.x += 1;
                break;
              case 'south':
                newPosition.y += 1;
                break;
              case 'west':
                newPosition.x -= 1;
                break;
            }

            get().moveCharacter(newPosition);
            break;
          }

          case 'sağaDön()': {
            const rotations: Record<Direction, Direction> = {
              north: 'east',
              east: 'south',
              south: 'west',
              west: 'north',
            };
            get().rotateCharacter(rotations[get().characterDirection]);
            break;
          }

          case 'solaDön()': {
            const rotations: Record<Direction, Direction> = {
              north: 'west',
              east: 'north',
              south: 'east',
              west: 'south',
            };
            get().rotateCharacter(rotations[get().characterDirection]);
            break;
          }

          case 'kır()': {
            get().breakWall();
            break;
          }
        }

        // Her hareket sonrası seviye tamamlanma kontrolü
        get().checkLevelComplete();
      }

      set({ isRunning: false });
    },

    stopCommands: () => {
      set({ isRunning: false });
    },

    moveCharacter: (newPosition) => {
      const { grid, hasKey, characterDirection } = get();
      const cell = grid[newPosition.y]?.[newPosition.x];
      
      // Duvar kontrolü
      if (cell === 1) return;
      
      // Kapı kontrolü
      if (cell === 2 && !hasKey) return;
      
      // Kırılabilir engel kontrolü
      if (cell === 5) return;
      
      // Anahtar toplama
      if (cell === 3) {
        set({ hasKey: true });
        const newGrid = [...grid];
        newGrid[newPosition.y][newPosition.x] = 0;
        set({ grid: newGrid });
      }
      
      // Tuzak kontrolü
      if (cell === 4) {
        get().resetLevel();
        return;
      }
      
      set({ characterPosition: newPosition });
    },

    rotateCharacter: (newDirection) => {
      set({ characterDirection: newDirection });
    },

    collectKey: () => {
      set({ hasKey: true });
    },

    checkLevelComplete: () => {
      const { characterPosition, exitPosition, currentLevel, completedLevels } = get();
      if (
        characterPosition.x === exitPosition.x &&
        characterPosition.y === exitPosition.y
      ) {
        // Seviyeyi tamamlandı olarak işaretle
        const newCompletedLevels = [...completedLevels];
        if (!newCompletedLevels.includes(currentLevel)) {
          newCompletedLevels.push(currentLevel);
          set({ completedLevels: newCompletedLevels });
          
          // İlerlemeyi kaydet
          saveProgress({
            currentLevel,
            completedLevels: newCompletedLevels
          });
        }

        // Sevinç animasyonunu göster
        set({ isLevelComplete: true });
        
        // Komutları durdur
        get().stopCommands();

        // Başarı ekranını geciktirerek göster
        setTimeout(() => {
          set({ showSuccessModal: true });
        }, 1500);
      }
    },

    resetLevel: () => {
      // Önce tüm breaking sınıflarını temizle
      if (typeof document !== 'undefined') {
        document.querySelectorAll('.breaking').forEach(element => {
          element.classList.remove('breaking');
        });
      }

      // 100ms bekleyip grid'i sıfırla
      setTimeout(() => {
        const level = gameLevels[get().currentLevel - 1];
        set({
          characterPosition: level.startPosition,
          characterDirection: 'east',
          hasKey: true,
          commands: [],
          isRunning: false,
          isLevelComplete: false,
          showSuccessModal: false,
          grid: JSON.parse(JSON.stringify(level.grid)), // Derin kopya oluştur
        });
      }, 100);
    },

    // Seviye yükleme metodu
    loadLevel: (levelId: number) => {
      const level = gameLevels[levelId - 1];
      if (!level) return;

      // Önce tüm breaking sınıflarını temizle
      if (typeof document !== 'undefined') {
        document.querySelectorAll('.breaking').forEach(element => {
          element.classList.remove('breaking');
        });
      }

      // Oyun durumunu sıfırla
      set({
        currentLevel: levelId,
        characterPosition: level.startPosition,
        characterDirection: 'east',
        commands: [],
        isRunning: false,
        hasKey: true,
        isLevelComplete: false,
        showSuccessModal: false,
        grid: JSON.parse(JSON.stringify(level.grid)), // Derin kopya oluştur
        startPosition: level.startPosition,
        exitPosition: level.exitPosition,
        maxSteps: level.maxSteps,
        // Tutorial durumunu sıfırla
        isTutorialActive: false,
        tutorialStep: 'ileri' as 'ileri' | 'calistir' | 'completed' | 'sagaDon' | 'ileri2',
      });

      // İlerlemeyi kaydet
      saveProgress({
        currentLevel: levelId,
        completedLevels: get().completedLevels
      });

      // Tutorial'ı başlat (eğer gerekiyorsa)
      setTimeout(() => {
        const state = get();
        if (levelId === 1 && !state.hasCompletedTutorial) {
          set({ 
            isTutorialActive: true,
            tutorialStep: 'ileri',
            commands: []
          });
        } else if (levelId === 2 && !state.hasCompletedLevel2Tutorial) {
          set({ 
            isTutorialActive: true,
            tutorialStep: 'sagaDon',
            commands: []
          });
        }
      }, 100);
    },

    // Sonraki seviyeye geçme metodu
    goToNextLevel: () => {
      const nextLevel = get().currentLevel + 1;
      if (nextLevel <= gameLevels.length) {
        get().loadLevel(nextLevel);
      }
    },

    // Yeni metod: Engel kırma
    breakWall: () => {
      const { characterPosition, characterDirection, grid } = get();
      let targetX = characterPosition.x;
      let targetY = characterPosition.y;

      // Karakterin baktığı yöndeki hücreyi hesapla
      switch (characterDirection) {
        case 'north':
          targetY -= 1;
          break;
        case 'east':
          targetX += 1;
          break;
        case 'south':
          targetY += 1;
          break;
        case 'west':
          targetX -= 1;
          break;
      }

      // Hedef hücrede kırılabilir engel varsa kır
      const targetCell = grid[targetY]?.[targetX];
      if (targetCell === 5) {
        // Önce breaking sınıfını ekle
        if (typeof document !== 'undefined') {
          // Önce varsa eski breaking sınıfını temizle
          document.querySelectorAll('.breaking').forEach(element => {
            element.classList.remove('breaking');
          });

          // Yeni hedef elementi bul ve breaking sınıfını ekle
          const targetElement = document.querySelector(`[data-cell="${targetX}-${targetY}"]`);
          if (targetElement) {
            targetElement.classList.add('breaking');
            
            // Animasyon bittikten sonra engeli kaldır (300ms)
            setTimeout(() => {
              const newGrid = [...grid];
              newGrid[targetY][targetX] = 0;
              set({ grid: newGrid });
            }, 300);
          }
        }
      }
    },

    // Tutorial metodları
    startTutorial: () => {
      const state = get();
      const currentLevel = state.currentLevel;

      if (currentLevel === 1 && !state.hasCompletedTutorial) {
        set({ 
          isTutorialActive: true,
          tutorialStep: 'ileri',
          commands: []
        });
      } else if (currentLevel === 2 && !state.hasCompletedLevel2Tutorial) {
        set({ 
          isTutorialActive: true,
          tutorialStep: 'sagaDon',
          commands: []
        });
      }
    },

    completeTutorialStep: (step) => {
      const state = get();
      const currentLevel = state.currentLevel;

      if (currentLevel === 1) {
        if (step === 'ileri') {
          set({ tutorialStep: 'calistir' });
        } else if (step === 'calistir') {
          set({ tutorialStep: 'completed' });
        }
      } else if (currentLevel === 2) {
        if (step === 'sagaDon') {
          set({ tutorialStep: 'ileri2' });
        } else if (step === 'ileri2') {
          set({ tutorialStep: 'calistir' });
        } else if (step === 'calistir') {
          set({ tutorialStep: 'completed' });
        }
      }
    },

    completeTutorial: () => {
      const state = get();
      const currentLevel = state.currentLevel;

      if (currentLevel === 1) {
        localStorage.setItem('tutorialCompleted', 'true');
        set({ 
          isTutorialActive: false, 
          hasCompletedTutorial: true,
          tutorialStep: 'completed' 
        });
      } else if (currentLevel === 2) {
        localStorage.setItem('level2TutorialCompleted', 'true');
        set({ 
          isTutorialActive: false, 
          hasCompletedLevel2Tutorial: true,
          tutorialStep: 'completed' 
        });
      }
    },
  };
}); 