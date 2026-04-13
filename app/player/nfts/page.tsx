'use client'

import Link from 'next/link'
import { ArrowLeft, Award } from 'lucide-react'
import { useGameStore } from '@/lib/store'
import { NFTCollection } from '@/components/NFTCollection'
import { WalletConnector } from '@/components/WalletConnector'

export default function NFTsPage() {
  const player = useGameStore((s) => s.player)
  const nfts = player?.nfts ?? []
  const walletAddress = player?.walletAddress

  return (
    <div className="min-h-screen bg-[#000009] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/player">
            <button className="flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          </Link>
          <WalletConnector />
        </div>

        {/* Title */}
        <div className="flex items-center gap-3 mb-2">
          <Award className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold text-purple-300">My NFT Collection</h1>
        </div>
        <p className="text-slate-400 text-sm mb-8">
          Achievement NFTs minted on{' '}
          <span className="text-purple-300 font-medium">Midnight preprod</span> — encrypted and
          privately stored on-chain.
        </p>

        {/* Wallet info */}
        {walletAddress && (
          <div className="mb-6 p-3 bg-slate-800/60 border border-slate-700/50 rounded-lg flex items-center gap-3">
            <div className="w-2 h-2 bg-purple-400 rounded-full" />
            <div>
              <p className="text-xs text-slate-400">Wallet address</p>
              <p className="text-sm font-mono text-slate-200 break-all">{walletAddress}</p>
            </div>
          </div>
        )}

        {/* Collection */}
        {walletAddress ? (
          <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-6">
            <NFTCollection nfts={nfts} walletAddress={walletAddress} showLocked />
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-800/50 border border-slate-700/30 rounded-xl">
            <p className="text-slate-300 font-semibold mb-2">Connect your wallet to view NFTs</p>
            <p className="text-slate-400 text-sm mb-6">
              Your NFTs are tied to your wallet address on Midnight preprod
            </p>
            <WalletConnector />
          </div>
        )}

        {/* Network note */}
        <div className="mt-6 p-4 bg-slate-800/30 border border-purple-500/10 rounded-lg">
          <p className="text-xs text-slate-400 leading-relaxed">
            <span className="text-purple-300 font-medium">Midnight preprod</span> — NFT data is
            AES-256-GCM encrypted before leaving your device and submitted to the Midnight testnet-02
            network. When the preprod node is unreachable, NFTs are stored locally and re-submitted
            automatically on reconnect.
          </p>
        </div>
      </div>
    </div>
  )
}
