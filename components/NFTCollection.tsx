'use client'

import Link from 'next/link'
import type { MintedNFT } from '@/lib/services/nftService'
import { ACHIEVEMENTS } from '@/lib/services/nftService'
import { NFTBadge } from './NFTBadge'
import { Lock } from 'lucide-react'

interface NFTCollectionProps {
  nfts: MintedNFT[]
  walletAddress?: string
  showLocked?: boolean
}

export function NFTCollection({ nfts, showLocked = true }: NFTCollectionProps) {
  const ownedIds = new Set(nfts.map((n) => n.achievementId))
  const allAchievements = Object.values(ACHIEVEMENTS)

  if (nfts.length === 0 && !showLocked) {
    return (
      <div className="text-center py-12">
        <p className="text-5xl mb-4">🎮</p>
        <p className="text-slate-300 font-semibold mb-2">No NFTs yet</p>
        <p className="text-slate-400 text-sm mb-6">
          Play games to earn achievement NFTs on Midnight preprod
        </p>
        <Link href="/player">
          <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold transition-colors">
            Start Playing
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Summary */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-slate-400">
            {nfts.length} / {allAchievements.length} earned
          </p>
          <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1 w-48">
            <div
              className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${(nfts.length / allAchievements.length) * 100}%` }}
            />
          </div>
        </div>
        <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
          Midnight preprod
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {allAchievements.map((achievement) => {
          const owned = ownedIds.has(achievement.id)
          const nft = nfts.find((n) => n.achievementId === achievement.id)

          if (owned && nft) {
            return (
              <div key={achievement.id} className="transform hover:scale-105 transition-transform duration-200">
                <NFTBadge nft={nft} size="md" />
              </div>
            )
          }

          if (!showLocked) return null

          return (
            <div
              key={achievement.id}
              className="p-4 rounded-xl border border-slate-700/50 bg-slate-800/50 flex flex-col items-center gap-2 opacity-50"
            >
              <div className="relative">
                <span className="text-4xl grayscale">{achievement.emoji}</span>
                <Lock className="w-4 h-4 text-slate-400 absolute -bottom-1 -right-1" />
              </div>
              <p className="text-slate-400 font-semibold text-sm text-center">{achievement.name}</p>
              <p className="text-slate-500 text-xs text-center leading-snug">{achievement.condition}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
