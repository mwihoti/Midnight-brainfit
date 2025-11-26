'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function MemoryGamePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/player">
          <button className="flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-colors mb-8">
            <ArrowLeft className="w-5 h-5" />
            Back to Games
          </button>
        </Link>

        <h1 className="text-3xl font-bold text-purple-300 mb-8">Memory Game</h1>
        
        <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-8 text-center">
          <p className="text-slate-300 mb-4">Memory Game Component will be loaded here</p>
          <p className="text-slate-500 text-sm">Game logic is ready to be integrated</p>
        </div>
      </div>
    </div>
  )
}
