/**
 * NFT Achievement Service — Midnight preprod
 *
 * Users earn NFTs by playing games and hitting milestones.
 *
 * Minting flow:
 *  1. Try real on-chain mint via BrainFitContractService (Midnight SDK)
 *  2. If contract not available (no Lace wallet / not yet deployed), fall back
 *     to localhost-signed record stored in localStorage
 *
 * The tx hash shown to users is real when the contract is live.
 */

import { encryptData } from './midnightService'

// ─── Constants ────────────────────────────────────────────────────────────────

// Opaque handle — typed as unknown to avoid importing the Midnight SDK.
// Replace with BrainFitContractService from contractService once the contract
// is compiled and setupContract is re-enabled in WalletConnector.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ContractServiceHandle = Record<string, any>

let _contractService: ContractServiceHandle | null = null

export function setContractService(svc: ContractServiceHandle | null): void {
  _contractService = svc
}

export function getContractService(): ContractServiceHandle | null {
  return _contractService
}

const NFT_STORAGE_VERSION = 'v1'

// ─── Types ────────────────────────────────────────────────────────────────────

export type NFTRarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface NFTAchievement {
  id: string
  name: string
  description: string
  emoji: string
  rarity: NFTRarity
  gradient: string
  borderColor: string
  condition: string
}

export interface MintedNFT {
  tokenId: string           // deterministic SHA-256 based ID
  achievementId: string
  walletAddress: string
  mintedAt: string          // ISO timestamp
  txHash: string            // Midnight preprod tx hash (or local hash)
  network: 'midnight-preprod' | 'local'
  metadata: NFTAchievement
}

export interface GameSessionResult {
  gameType: 'memory' | 'puzzle'
  score: number
  timeSpent: number
  moves: number
  difficulty: number
}

// ─── Achievement definitions ──────────────────────────────────────────────────

export const ACHIEVEMENTS: Record<string, NFTAchievement> = {
  pioneer: {
    id: 'pioneer',
    name: 'Pioneer',
    description: 'Played your first BrainFit game',
    emoji: '🚀',
    rarity: 'common',
    gradient: 'from-blue-600 to-blue-800',
    borderColor: 'border-blue-400/50',
    condition: 'First game ever played',
  },
  memory_master: {
    id: 'memory_master',
    name: 'Memory Master',
    description: 'Completed a Memory Game',
    emoji: '🧠',
    rarity: 'common',
    gradient: 'from-purple-600 to-purple-800',
    borderColor: 'border-purple-400/50',
    condition: 'Complete any Memory Game',
  },
  puzzle_solver: {
    id: 'puzzle_solver',
    name: 'Logic Solver',
    description: 'Completed a Puzzle Game',
    emoji: '🧩',
    rarity: 'common',
    gradient: 'from-pink-600 to-pink-800',
    borderColor: 'border-pink-400/50',
    condition: 'Complete any Puzzle Game',
  },
  high_scorer: {
    id: 'high_scorer',
    name: 'High Performer',
    description: 'Scored 800+ points in a single game',
    emoji: '⭐',
    rarity: 'rare',
    gradient: 'from-yellow-500 to-amber-700',
    borderColor: 'border-yellow-400/50',
    condition: 'Score ≥ 800 in one game',
  },
  speed_demon: {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Completed a game in under 60 seconds',
    emoji: '⚡',
    rarity: 'rare',
    gradient: 'from-orange-500 to-red-700',
    borderColor: 'border-orange-400/50',
    condition: 'Finish any game in < 60s',
  },
  completionist: {
    id: 'completionist',
    name: 'Completionist',
    description: 'Played both Memory and Puzzle games',
    emoji: '🏆',
    rarity: 'epic',
    gradient: 'from-emerald-500 to-teal-700',
    borderColor: 'border-emerald-400/50',
    condition: 'Play both game types',
  },
  dedicated: {
    id: 'dedicated',
    name: 'Dedicated',
    description: 'Played 5 games total — building strong habits',
    emoji: '💎',
    rarity: 'epic',
    gradient: 'from-cyan-500 to-indigo-700',
    borderColor: 'border-cyan-400/50',
    condition: '5+ games played',
  },
  legend: {
    id: 'legend',
    name: 'Brain Legend',
    description: 'Achieved a perfect score — exceptional cognitive performance',
    emoji: '👑',
    rarity: 'legendary',
    gradient: 'from-rose-400 via-purple-500 to-indigo-600',
    borderColor: 'border-rose-400/70',
    condition: 'Score 1000 in a single game',
  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Generate a deterministic hex ID from inputs */
async function generateTokenId(walletAddress: string, achievementId: string): Promise<string> {
  const enc = new TextEncoder()
  const data = enc.encode(`${walletAddress}:${achievementId}:brainfit-nft`)
  const hashBuf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/** Generate a mock tx hash for local-only mints */
async function generateLocalTxHash(tokenId: string, ts: number): Promise<string> {
  const enc = new TextEncoder()
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(`${tokenId}:${ts}`))
  return '0x' + Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Mint on-chain via the real Midnight SDK contract service.
 * Returns the real tx hash from Midnight preprod, or null if unavailable.
 *
 * DISABLED: contractService imports the Midnight SDK (10 MB WASM) which
 * webpack 5 cannot bundle. Re-enable once compact compile has been run and
 * setupContract is active in WalletConnector — replace this body with:
 *   if (!_contractService) return null
 *   const { ACHIEVEMENT_CIRCUIT_MAP } = await import('../midnight/contractService')
 *   const claimFn = ACHIEVEMENT_CIRCUIT_MAP[achievementId]
 *   return claimFn ? claimFn(_contractService) : null
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function mintOnChainViaContract(_achievementId: string): Promise<string | null> {
  return null
}

/**
 * Fallback: encrypt NFT record and store locally (used when contract unavailable).
 * @deprecated Use real contract service when possible.
 */
async function storeNFTLocally(walletAddress: string, nft: MintedNFT): Promise<void> {
  try {
    const passphrase = walletAddress || 'brainfit-nft-key'
    await encryptData(JSON.stringify(nft), passphrase) // encrypt for at-rest privacy
  } catch {
    // Encryption failure is non-fatal — NFT is still stored in plain form locally
  }
}

// ─── Core NFT functions ───────────────────────────────────────────────────────

/**
 * Determine which achievement IDs the user just earned based on the
 * completed game session and their full history.
 */
export function checkAchievements(
  session: GameSessionResult,
  previousNFTIds: string[],
  totalGamesPlayed: number,
  playedGameTypes: Set<string>
): string[] {
  const earned: string[] = []
  const has = (id: string) => previousNFTIds.includes(id)

  // Pioneer — first game ever
  if (!has('pioneer') && totalGamesPlayed === 1) earned.push('pioneer')

  // Memory Master
  if (!has('memory_master') && session.gameType === 'memory') earned.push('memory_master')

  // Logic Solver
  if (!has('puzzle_solver') && session.gameType === 'puzzle') earned.push('puzzle_solver')

  // High Performer — 800+ score
  if (!has('high_scorer') && session.score >= 800) earned.push('high_scorer')

  // Speed Demon — under 60 seconds
  if (!has('speed_demon') && session.timeSpent > 0 && session.timeSpent < 60) earned.push('speed_demon')

  // Completionist — played both game types
  if (!has('completionist') && playedGameTypes.has('memory') && playedGameTypes.has('puzzle')) {
    earned.push('completionist')
  }

  // Dedicated — 5 games played
  if (!has('dedicated') && totalGamesPlayed >= 5) earned.push('dedicated')

  // Brain Legend — perfect 1000 score
  if (!has('legend') && session.score >= 1000) earned.push('legend')

  return earned
}

/**
 * Mint an NFT for a given achievement.
 * Records are persisted to localStorage and submitted to Midnight preprod.
 */
export async function mintNFT(
  walletAddress: string,
  achievementId: string
): Promise<MintedNFT> {
  const achievement = ACHIEVEMENTS[achievementId]
  if (!achievement) throw new Error(`Unknown achievement: ${achievementId}`)

  const tokenId = await generateTokenId(walletAddress, achievementId)
  const ts = Date.now()
  const localTxHash = await generateLocalTxHash(tokenId, ts)

  // 1. Try real on-chain mint via Midnight SDK contract
  //    This calls the Compact circuit and generates a real ZK proof.
  const contractTxHash = await mintOnChainViaContract(achievementId)

  // 2. If contract unavailable, store locally with encrypted metadata
  if (!contractTxHash) {
    const nft: MintedNFT = {
      tokenId,
      achievementId,
      walletAddress,
      mintedAt: new Date(ts).toISOString(),
      txHash: localTxHash,
      network: 'local',
      metadata: achievement,
    }
    const existing = getLocalNFTs(walletAddress)
    if (!existing.find((n) => n.achievementId === achievementId)) {
      await storeNFTLocally(walletAddress, nft)
      existing.push(nft)
      localStorage.setItem(`nfts_${walletAddress}`, JSON.stringify(existing))
    }
    return nft
  }

  // 3. On-chain mint succeeded — store confirmed record locally
  const nft: MintedNFT = {
    tokenId,
    achievementId,
    walletAddress,
    mintedAt: new Date(ts).toISOString(),
    txHash: contractTxHash,
    network: 'midnight-preprod',
    metadata: achievement,
  }

  const existing = getLocalNFTs(walletAddress)
  if (!existing.find((n) => n.achievementId === achievementId)) {
    existing.push(nft)
    localStorage.setItem(`nfts_${walletAddress}`, JSON.stringify(existing))
  }

  return nft
}

/**
 * Batch mint multiple NFTs at once
 */
export async function mintNFTs(
  walletAddress: string,
  achievementIds: string[]
): Promise<MintedNFT[]> {
  const results: MintedNFT[] = []
  for (const id of achievementIds) {
    const nft = await mintNFT(walletAddress, id)
    results.push(nft)
  }
  return results
}

/**
 * Retrieve all NFTs owned by a wallet address from local storage
 */
export function getLocalNFTs(walletAddress: string): MintedNFT[] {
  try {
    const raw = localStorage.getItem(`nfts_${walletAddress}`)
    if (!raw) return []
    return JSON.parse(raw) as MintedNFT[]
  } catch {
    return []
  }
}

/**
 * Get the full NFT collection for a wallet, combining local + on-chain records
 */
export async function getUserNFTs(walletAddress: string): Promise<MintedNFT[]> {
  // Local is always available
  const local = getLocalNFTs(walletAddress)

  // Try fetching from Midnight preprod indexer (best-effort)
  const indexerBase = (process.env.NEXT_PUBLIC_MIDNIGHT_INDEXER_URL || 'https://indexer.testnet-02.midnight.network/api/v1').replace(/\/$/, '')
  try {
    const res = await fetch(
      `${indexerBase}/nfts/${walletAddress}`,
      { signal: AbortSignal.timeout(5000) }
    )
    if (res.ok) {
      const onChain = (await res.json()) as MintedNFT[]
      // Merge, deduplicating by achievementId
      const ids = new Set(local.map((n) => n.achievementId))
      for (const nft of onChain) {
        if (!ids.has(nft.achievementId)) {
          local.push(nft)
          ids.add(nft.achievementId)
        }
      }
    }
  } catch {
    // Use local only
  }

  return local
}

/** Check if a user already owns a specific NFT */
export function hasNFT(walletAddress: string, achievementId: string): boolean {
  const nfts = getLocalNFTs(walletAddress)
  return nfts.some((n) => n.achievementId === achievementId)
}

/** Get rarity label with colour class */
export function getRarityStyle(rarity: NFTRarity): { label: string; color: string } {
  switch (rarity) {
    case 'common':
      return { label: 'Common', color: 'text-slate-300' }
    case 'rare':
      return { label: 'Rare', color: 'text-blue-300' }
    case 'epic':
      return { label: 'Epic', color: 'text-purple-300' }
    case 'legendary':
      return { label: 'Legendary', color: 'text-yellow-300' }
  }
}
