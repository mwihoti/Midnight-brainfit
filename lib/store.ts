import { create } from 'zustand'

export interface GameMetrics {
  id: string
  playerId: string
  gameType: 'memory' | 'puzzle'
  score: number
  timeSpent: number
  difficulty: number
  timestamp: string
  encrypted: boolean
}

export interface PlayerProfile {
  id: string
  name: string
  walletAddress: string
  totalScore: number
  gamesPlayed: number
  lastPlayed: string
  metrics: GameMetrics[]
}

interface GameStore {
  player: PlayerProfile | null
  currentGame: 'memory' | 'puzzle' | null
  difficulty: number
  score: number
  timeSpent: number
  isPlaying: boolean

  setPlayer: (player: PlayerProfile) => void
  startGame: (gameType: 'memory' | 'puzzle') => void
  endGame: (finalScore: number, timeSpent: number) => void
  updateScore: (points: number) => void
  updateDifficulty: (level: number) => void
  resetGame: () => void
  addMetrics: (metric: GameMetrics) => void
}

export const useGameStore = create<GameStore>((set) => ({
  player: null,
  currentGame: null,
  difficulty: 1,
  score: 0,
  timeSpent: 0,
  isPlaying: false,

  setPlayer: (player) =>
    set(() => ({
      player,
    })),

  startGame: (gameType) =>
    set(() => ({
      currentGame: gameType,
      score: 0,
      timeSpent: 0,
      isPlaying: true,
    })),

  endGame: (finalScore, timeSpent) =>
    set((state) => ({
      isPlaying: false,
      score: finalScore,
      timeSpent,
      player: state.player
        ? {
            ...state.player,
            totalScore: state.player.totalScore + finalScore,
            gamesPlayed: state.player.gamesPlayed + 1,
            lastPlayed: new Date().toISOString(),
          }
        : null,
    })),

  updateScore: (points) =>
    set((state) => ({
      score: state.score + points,
    })),

  updateDifficulty: (level) =>
    set(() => ({
      difficulty: Math.max(1, Math.min(10, level)),
    })),

  resetGame: () =>
    set(() => ({
      currentGame: null,
      score: 0,
      timeSpent: 0,
      isPlaying: false,
    })),

  addMetrics: (metric) =>
    set((state) => ({
      player: state.player
        ? {
            ...state.player,
            metrics: [...state.player.metrics, metric],
          }
        : null,
    })),
}))
