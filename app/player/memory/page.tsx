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

        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-purple-300 mb-12 text-center">Memory Game</h1>
          
          <div className="bg-gradient-to-br from-purple-900/40 to-slate-900/40 border border-purple-500/30 rounded-xl p-12 text-center space-y-6">
            <div className="text-6xl">🎮</div>
            <h2 className="text-2xl font-bold text-purple-200">Coming Soon</h2>
            <p className="text-slate-300 text-lg">The Memory Game is under development and will be available soon.</p>
            <p className="text-slate-400 text-sm">Challenge your memory with our interactive card-matching game designed for cognitive training.</p>
            
            <div className="pt-6">
              <Link href="/player">
                <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors">
                  Back to Games
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
