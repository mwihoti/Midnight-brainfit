'use client'

import Link from 'next/link'
import { ArrowLeft, Gamepad2, Puzzle, Award } from 'lucide-react'
import { WalletConnector } from '@/components/WalletConnector'
import { useGameStore } from '@/lib/store'

export default function PlayerPage() {
  const player = useGameStore((s) => s.player)

  const gamesPlayed = player?.gamesPlayed ?? 0
  const totalScore = player?.totalScore ?? 0
  const nftCount = player?.nfts?.length ?? 0
  const avgTime =
    player?.metrics && player.metrics.length > 0
      ? Math.round(player.metrics.reduce((sum, m) => sum + m.timeSpent, 0) / player.metrics.length)
      : null

  return (
    <div className="min-h-screen bg-[#000009] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/">
            <button className="flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          </Link>
          <h1 className="text-3xl font-bold text-purple-300">Select a Game</h1>
          <WalletConnector />
        </div>

        {/* Game Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Link href="/player/memory">
            <div className="group bg-purple-800 rounded-xl p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 border border-purple-400/30 hover:border-purple-400 min-h-64 flex flex-col justify-between">
              <div>
                <Gamepad2 className="w-12 h-12 text-purple-200 mb-4" />
                <h2 className="text-2xl font-bold text-white mb-3">Memory Game</h2>
                <p className="text-purple-100 text-sm">
                  Test and strengthen your memory with this classic card-matching game. Find all pairs to complete each level.
                </p>
              </div>
              <div className="text-purple-200 text-sm font-semibold">Start Game →</div>
            </div>
          </Link>

          <Link href="/player/puzzle">
            <div className="group bg-pink-800 rounded-xl p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 border border-pink-400/30 hover:border-pink-400 min-h-64 flex flex-col justify-between">
              <div>
                <Puzzle className="w-12 h-12 text-pink-200 mb-4" />
                <h2 className="text-2xl font-bold text-white mb-3">Puzzle Game</h2>
                <p className="text-pink-100 text-sm">
                  Solve puzzles by rearranging tiles in the correct order. Challenge yourself with increasing difficulty levels.
                </p>
              </div>
              <div className="text-pink-200 text-sm font-semibold">Start Game →</div>
            </div>
          </Link>
        </div>

        {/* NFT Collection CTA */}
        <Link href="/player/nfts">
          <div className="mb-8 p-5 bg-slate-800/60 border border-slate-700/50 hover:border-purple-500/40 rounded-xl flex items-center justify-between cursor-pointer transition-all hover:bg-slate-800">
            <div className="flex items-center gap-4">
              <Award className="w-8 h-8 text-purple-400" />
              <div>
                <p className="font-semibold text-purple-200">My NFT Collection</p>
                <p className="text-sm text-slate-400">
                  {nftCount > 0
                    ? `${nftCount} achievement NFT${nftCount !== 1 ? 's' : ''} on Midnight preprod`
                    : 'Play games to earn NFTs on Midnight preprod'}
                </p>
              </div>
            </div>
            <span className="text-purple-300 font-semibold text-sm">View →</span>
          </div>
        </Link>

        {/* Stats Section */}
        <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-purple-300 mb-4">Your Performance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-slate-700/50 rounded p-3">
              <p className="text-slate-400">Games Played</p>
              <p className="text-2xl font-bold text-purple-300">{gamesPlayed}</p>
            </div>
            <div className="bg-slate-700/50 rounded p-3">
              <p className="text-slate-400">Total Score</p>
              <p className="text-2xl font-bold text-purple-300">{totalScore.toLocaleString()}</p>
            </div>
            <div className="bg-slate-700/50 rounded p-3">
              <p className="text-slate-400">NFTs Earned</p>
              <p className="text-2xl font-bold text-purple-300">{nftCount}</p>
            </div>
            <div className="bg-slate-700/50 rounded p-3">
              <p className="text-slate-400">Avg Time</p>
              <p className="text-2xl font-bold text-purple-300">
                {avgTime !== null ? `${avgTime}s` : '--'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
