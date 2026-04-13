'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { MemoryGame } from '@/components/MemoryGame'
import { GameResults } from '@/components/GameResults'
import { NFTMintModal } from '@/components/NFTMintModal'
import { useGameStore, initPlayer, savePlayer } from '@/lib/store'
import { checkAchievements, mintNFTs, getLocalNFTs } from '@/lib/services/nftService'
import { storeMetricsOnChain } from '@/lib/services/midnightService'
import type { MintedNFT } from '@/lib/services/nftService'
import type { GameMetrics } from '@/lib/store'

export default function MemoryGamePage() {
  const router = useRouter()
  const difficulty = useGameStore((s) => s.difficulty)
  const store = useGameStore()

  const [gameMetrics, setGameMetrics] = useState<GameMetrics | null>(null)
  const [newNFTs, setNewNFTs] = useState<MintedNFT[]>([])
  const [showNFTModal, setShowNFTModal] = useState(false)
  const [minting, setMinting] = useState(false)
  const [mintError, setMintError] = useState<string | null>(null)

  const handleComplete = useCallback(
    async (score: number, timeSpent: number, moves: number) => {
      const walletAddress =
        localStorage.getItem('walletAddress') || `guest_${Date.now()}`

      const player = store.player ?? initPlayer(walletAddress)

      const metric: GameMetrics = {
        id: `${Date.now()}`,
        playerId: player.id,
        gameType: 'memory',
        score,
        timeSpent,
        difficulty,
        timestamp: new Date().toISOString(),
        encrypted: true,
      }

      setGameMetrics(metric)

      const updatedGamesPlayed = player.gamesPlayed + 1
      const updatedPlayedTypes = Array.from(
        new Set([...player.playedGameTypes, 'memory'])
      )

      const updatedPlayer = {
        ...player,
        gamesPlayed: updatedGamesPlayed,
        totalScore: player.totalScore + score,
        lastPlayed: new Date().toISOString(),
        metrics: [...player.metrics, metric],
        playedGameTypes: updatedPlayedTypes,
      }

      store.setPlayer(updatedPlayer)
      store.endGame(score, timeSpent)
      store.addMetrics(metric)

      storeMetricsOnChain(walletAddress, JSON.stringify(metric)).catch(() => undefined)

      const ownedIds = getLocalNFTs(walletAddress).map((n) => n.achievementId)
      const earnedIds = checkAchievements(
        { gameType: 'memory', score, timeSpent, moves, difficulty },
        ownedIds,
        updatedGamesPlayed,
        new Set(updatedPlayedTypes)
      )

      if (earnedIds.length > 0) {
        setMinting(true)
        try {
          const minted = await mintNFTs(walletAddress, earnedIds)
          minted.forEach((nft) => store.addNFT(nft))
          savePlayer({ ...updatedPlayer, nfts: [...updatedPlayer.nfts, ...minted] })
          setNewNFTs(minted)
          setShowNFTModal(true)
        } catch (err) {
          console.error('NFT minting failed:', err)
          setMintError('NFTs could not be minted right now. Progress saved locally.')
          savePlayer(updatedPlayer)
        } finally {
          setMinting(false)
        }
      } else {
        savePlayer(updatedPlayer)
      }
    },
    [difficulty, store]
  )

  const handleNFTModalClose = () => {
    setShowNFTModal(false)
    router.push('/player/nfts')
  }

  return (
    <div className="min-h-screen bg-[#000009] p-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/player">
          <button className="flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-colors mb-8">
            <ArrowLeft className="w-5 h-5" />
            Back to Games
          </button>
        </Link>

        <h1 className="text-3xl font-bold text-purple-300 mb-8 text-center">Memory Game</h1>

        {minting ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
            <p className="text-slate-300 text-sm">Minting your NFT on Midnight preprod…</p>
          </div>
        ) : gameMetrics ? (
          <div className="flex flex-col items-center gap-6">
            {mintError && (
              <div className="w-full max-w-md p-3 bg-yellow-900/30 border border-yellow-500/40 rounded-lg text-sm text-yellow-300">
                {mintError}
              </div>
            )}
            <GameResults
              metrics={gameMetrics}
              earnedNFTs={newNFTs}
              onClose={() => router.push('/player')}
            />
          </div>
        ) : (
          <MemoryGame onComplete={handleComplete} />
        )}
      </div>

      {showNFTModal && (
        <NFTMintModal nfts={newNFTs} onClose={handleNFTModalClose} />
      )}
    </div>
  )
}
