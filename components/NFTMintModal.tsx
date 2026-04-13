'use client'

import { useEffect, useState } from 'react'
import type { MintedNFT } from '@/lib/services/nftService'
import { getRarityStyle } from '@/lib/services/nftService'
import { X, ExternalLink } from 'lucide-react'

interface NFTMintModalProps {
  nfts: MintedNFT[]
  onClose: () => void
}

export function NFTMintModal({ nfts, onClose }: NFTMintModalProps) {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Slight delay so CSS transition runs
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [])

  if (nfts.length === 0) return null

  const current = nfts[index]
  const { metadata } = current
  const rarity = getRarityStyle(metadata.rarity)
  const isLast = index === nfts.length - 1

  const handleNext = () => {
    if (isLast) {
      handleClose()
    } else {
      setIndex((i) => i + 1)
    }
  }

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 300)
  }

  const truncatedTx =
    current.txHash.length > 20
      ? `${current.txHash.slice(0, 10)}…${current.txHash.slice(-8)}`
      : current.txHash

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        visible ? 'bg-black/70 backdrop-blur-sm' : 'bg-transparent'
      }`}
      onClick={handleClose}
    >
      <div
        className={`relative w-full max-w-sm bg-slate-900 border border-purple-500/40 rounded-2xl p-8 text-center transition-all duration-300 ${
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Counter */}
        {nfts.length > 1 && (
          <p className="text-xs text-slate-400 mb-3">
            {index + 1} / {nfts.length}
          </p>
        )}

        {/* Header */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-600/30 border border-purple-500/40 rounded-full text-xs text-purple-300 font-semibold mb-3">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            NFT Minted on Midnight Preprod
          </div>
          <p className="text-xl font-bold text-white">New Achievement Unlocked!</p>
        </div>

        {/* NFT card */}
        <div
          className={`mx-auto w-48 h-52 rounded-2xl bg-gradient-to-br ${metadata.gradient} border ${metadata.borderColor} flex flex-col items-center justify-center gap-3 mb-6 shadow-2xl`}
          style={{
            boxShadow:
              metadata.rarity === 'legendary'
                ? '0 0 40px rgba(251, 191, 36, 0.4)'
                : metadata.rarity === 'epic'
                ? '0 0 30px rgba(168, 85, 247, 0.3)'
                : undefined,
          }}
        >
          <span className="text-6xl drop-shadow-lg">{metadata.emoji}</span>
          <div className="text-center">
            <p className="text-white font-bold text-sm">{metadata.name}</p>
            <p className={`text-xs font-semibold uppercase tracking-wider mt-0.5 ${rarity.color}`}>
              {rarity.label}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-300 text-sm mb-4">{metadata.description}</p>

        {/* Tx hash */}
        <div className="mb-6 p-3 bg-slate-800 rounded-lg text-left">
          <p className="text-xs text-slate-400 mb-1">
            {current.network === 'midnight-preprod' ? 'On-chain tx' : 'Local record'}
          </p>
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                current.network === 'midnight-preprod' ? 'bg-green-400' : 'bg-slate-500'
              }`}
            />
            <code className="text-xs text-slate-300 font-mono">{truncatedTx}</code>
            {current.network === 'midnight-preprod' && (
              <ExternalLink className="w-3 h-3 text-slate-400 flex-shrink-0" />
            )}
          </div>
        </div>

        {/* Action */}
        <button
          onClick={handleNext}
          className="w-full py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-semibold transition-colors"
        >
          {isLast ? 'View My Collection' : `Next Achievement (${nfts.length - index - 1} more)`}
        </button>
      </div>
    </div>
  )
}
