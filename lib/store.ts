import { create } from 'zustand'
import type { MintedNFT } from './services/nftService'

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
  nfts: MintedNFT[]
  playedGameTypes: string[]
}

interface GameStore {
  player: PlayerProfile | null
  currentGame: 'memory' | 'puzzle' | null
  difficulty: number
  score: number
  timeSpent: number
  isPlaying: boolean
  pendingNFTs: MintedNFT[]     // NFTs awaiting display in the modal
  networkConnected: boolean

  setPlayer: (player: PlayerProfile) => void
  startGame: (gameType: 'memory' | 'puzzle') => void
  endGame: (finalScore: number, timeSpent: number) => void
  updateScore: (points: number) => void
  updateDifficulty: (level: number) => void
  resetGame: () => void
  addMetrics: (metric: GameMetrics) => void
  addNFT: (nft: MintedNFT) => void
  addPendingNFTs: (nfts: MintedNFT[]) => void
  clearPendingNFTs: () => void
  setNetworkConnected: (connected: boolean) => void
}

export const useGameStore = create<GameStore>((set) => ({
  player: null,
  currentGame: null,
  difficulty: 1,
  score: 0,
  timeSpent: 0,
  isPlaying: false,
  pendingNFTs: [],
  networkConnected: false,

  setPlayer: (player) => set({ player }),

  startGame: (gameType) =>
    set({ currentGame: gameType, score: 0, timeSpent: 0, isPlaying: true }),

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
    set((state) => ({ score: state.score + points })),

  updateDifficulty: (level) =>
    set({ difficulty: Math.max(1, Math.min(10, level)) }),

  resetGame: () =>
    set({ currentGame: null, score: 0, timeSpent: 0, isPlaying: false }),

  addMetrics: (metric) =>
    set((state) => ({
      player: state.player
        ? { ...state.player, metrics: [...state.player.metrics, metric] }
        : null,
    })),

  addNFT: (nft) =>
    set((state) => {
      if (!state.player) return {}
      const alreadyOwned = state.player.nfts.some(
        (n) => n.achievementId === nft.achievementId
      )
      if (alreadyOwned) return {}
      return {
        player: { ...state.player, nfts: [...state.player.nfts, nft] },
      }
    }),

  addPendingNFTs: (nfts) =>
    set((state) => ({ pendingNFTs: [...state.pendingNFTs, ...nfts] })),

  clearPendingNFTs: () => set({ pendingNFTs: [] }),

  setNetworkConnected: (connected) => set({ networkConnected: connected }),
}))

function defaultProfile(walletAddress: string): PlayerProfile {
  return {
    id: walletAddress,
    name: `Player ${walletAddress.slice(0, 6)}`,
    walletAddress,
    totalScore: 0,
    gamesPlayed: 0,
    lastPlayed: '',
    metrics: [],
    nfts: [],
    playedGameTypes: [],
  }
}

/** Initialise or restore a player profile from localStorage */
export function initPlayer(walletAddress: string): PlayerProfile {
  if (typeof window === 'undefined') return defaultProfile(walletAddress)
  try {
    const raw = localStorage.getItem(`player_${walletAddress}`)
    if (raw) return JSON.parse(raw) as PlayerProfile
  } catch {
    // ignore
  }
  return defaultProfile(walletAddress)
}

/** Persist player profile to localStorage */
export function savePlayer(player: PlayerProfile): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(`player_${player.walletAddress}`, JSON.stringify(player))
  } catch {
    // storage full or unavailable
  }
}
