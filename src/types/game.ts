export interface Game {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  playStoreUrl?: string;
  appStoreUrl?: string;
  screenshots: string[];
  rating: number;
  downloads: string;
  category: string;
  tags: string[];
  technologies: string[];
  releaseDate: string;
  createdAt: Date;
  updatedAt?: Date;
  isPublished: boolean;
  features?: string[];
  requirements?: {
    android?: string;
    ios?: string;
  };
  developer: {
    name: string;
    website?: string;
  };
  version: string;
  size?: string;
  lastUpdate?: Date;
  privacyPolicy?: string;
  termsOfService?: string;
  supportEmail?: string;
  status: 'draft' | 'published' | 'archived';
}

export type Command = 'ileri()' | 'sağaDön()' | 'solaDön()' | 'kır()';

export interface GameState {
  commands: Command[];
  maxCommands: number;
  isRunning: boolean;
  currentLevel: number;
  completedLevels: number[];
  levels: Level[];
  isTutorialActive: boolean;
  tutorialStep: string;
  startExecution: () => void;
  stopExecution: () => void;
  addCommand: (command: Command) => void;
  removeCommand: (index: number) => void;
  clearCommands: () => void;
  loadLevel: (levelId: number) => void;
  resetLevel: () => void;
  handleNextLevel: () => void;
}

export interface Level {
  id: number;
  title: string;
  description: string;
  maxCommands: number;
  grid: string[][];
  playerPosition: Position;
  playerDirection: Direction;
  targetPosition: Position;
  obstacles: Obstacle[];
  enemies: Enemy[];
}

export interface Position {
  x: number;
  y: number;
}

export type Direction = 'north' | 'east' | 'south' | 'west';

export interface Obstacle {
  position: Position;
  type: 'wall' | 'rock' | 'spikes';
}

export interface Enemy {
  position: Position;
  type: 'goblin' | 'skeleton' | 'boss';
  health: number;
  direction: Direction;
} 