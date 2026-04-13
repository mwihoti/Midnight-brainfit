'use client'

import { GameMetrics } from '@/lib/store'
import type { MintedNFT } from '@/lib/services/nftService'
import { NFTBadge } from './NFTBadge'

interface GameResultsProps {
  metrics: GameMetrics
  earnedNFTs?: MintedNFT[]
  onClose?: () => void
}

export function GameResults({ metrics, earnedNFTs = [], onClose }: GameResultsProps) {
  const calculatePerformance = () => {
    const baseScore = 100
    const difficultyFactor = metrics.difficulty / 5
    const timeBonus = Math.max(0, 100 - metrics.timeSpent)
    return Math.floor(baseScore * difficultyFactor + timeBonus * 0.1)
  }

  const performance = calculatePerformance()
  const performanceColor =
    performance >= 80 ? 'text-green-400' : performance >= 60 ? 'text-yellow-400' : 'text-red-400'

  return (
    <div className="w-full max-w-md bg-slate-800 border border-purple-500/20 rounded-lg p-6">
      <h2 className="text-xl font-bold text-purple-300 mb-4">Game Results</h2>

      {/* Score */}
      <div className="mb-6 text-center p-4 bg-slate-700/50 rounded-lg">
        <p className="text-sm text-slate-400 mb-2">Score</p>
        <p className="text-4xl font-bold text-purple-300">
          {metrics.score}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-3 bg-slate-700/50 rounded">
          <p className="text-xs text-slate-400">Game Type</p>
          <p className="text-sm font-semibold text-slate-200 capitalize">{metrics.gameType}</p>
        </div>
        <div className="p-3 bg-slate-700/50 rounded">
          <p className="text-xs text-slate-400">Difficulty</p>
          <p className="text-sm font-semibold text-slate-200">{metrics.difficulty}/5</p>
        </div>
        <div className="p-3 bg-slate-700/50 rounded">
          <p className="text-xs text-slate-400">Time Spent</p>
          <p className="text-sm font-semibold text-slate-200">{metrics.timeSpent}s</p>
        </div>
        <div className="p-3 bg-slate-700/50 rounded">
          <p className="text-xs text-slate-400">Performance</p>
          <p className={`text-sm font-semibold ${performanceColor}`}>{performance}%</p>
        </div>
      </div>

      {/* NFTs Earned */}
      {earnedNFTs.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-semibold text-purple-300 mb-3">
            NFTs Earned ({earnedNFTs.length})
          </p>
          <div className="flex gap-3 flex-wrap">
            {earnedNFTs.map((nft) => (
              <NFTBadge key={nft.tokenId} nft={nft} size="sm" showDetails={false} />
            ))}
          </div>
        </div>
      )}

      {/* Encryption Status */}
      <div className={`mb-6 p-3 rounded flex items-center gap-2 ${
        metrics.encrypted
          ? 'bg-green-900/30 border border-green-500/30'
          : 'bg-slate-700/50 border border-slate-600/30'
      }`}>
        <div className={`w-2 h-2 rounded-full ${metrics.encrypted ? 'bg-green-500' : 'bg-slate-500'}`} />
        <span className={`text-xs ${metrics.encrypted ? 'text-green-300' : 'text-slate-400'}`}>
          {metrics.encrypted
            ? 'Data encrypted (AES-256-GCM) and stored on Midnight preprod'
            : 'Stored locally — connect wallet to sync to Midnight'}
        </span>
      </div>

      {/* Actions */}
      {onClose && (
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors text-sm font-semibold"
        >
          Back to Menu
        </button>
      )}
    </div>
  )
}
