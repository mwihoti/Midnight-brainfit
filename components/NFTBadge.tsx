'use client'

import type { MintedNFT } from '@/lib/services/nftService'
import { getRarityStyle } from '@/lib/services/nftService'

interface NFTBadgeProps {
  nft: MintedNFT
  size?: 'sm' | 'md' | 'lg'
  showDetails?: boolean
}

export function NFTBadge({ nft, size = 'md', showDetails = true }: NFTBadgeProps) {
  const { metadata } = nft
  const rarity = getRarityStyle(metadata.rarity)

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  }

  const emojiSizes = {
    sm: 'text-3xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  }

  return (
    <div
      className={`relative bg-gradient-to-br ${metadata.gradient} ${sizeClasses[size]} rounded-xl border ${metadata.borderColor} flex flex-col items-center gap-2 shadow-lg`}
    >
      {/* Rarity glow for epic/legendary */}
      {(metadata.rarity === 'epic' || metadata.rarity === 'legendary') && (
        <div
          className={`absolute inset-0 rounded-xl bg-gradient-to-br ${metadata.gradient} opacity-20 blur-sm pointer-events-none`}
        />
      )}

      {/* NFT badge icon */}
      <span className={`${emojiSizes[size]} drop-shadow-lg`}>{metadata.emoji}</span>

      {showDetails && (
        <>
          <p className="text-white font-bold text-sm text-center leading-tight">
            {metadata.name}
          </p>
          <span
            className={`text-xs font-semibold uppercase tracking-wider ${rarity.color}`}
          >
            {rarity.label}
          </span>
          <p className="text-white/70 text-xs text-center leading-snug">
            {metadata.description}
          </p>

          {/* Network badge */}
          <div
            className={`flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs ${
              nft.network === 'midnight-preprod'
                ? 'bg-green-900/60 text-green-300 border border-green-500/30'
                : 'bg-slate-700/60 text-slate-400 border border-slate-500/30'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                nft.network === 'midnight-preprod' ? 'bg-green-400' : 'bg-slate-500'
              }`}
            />
            {nft.network === 'midnight-preprod' ? 'Midnight preprod' : 'Local'}
          </div>
        </>
      )}
    </div>
  )
}
