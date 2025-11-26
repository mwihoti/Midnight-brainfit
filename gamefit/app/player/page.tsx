'use client'

import Link from 'next/link'
import { ArrowLeft, Gamepad2, Puzzle } from 'lucide-react'

export default function PlayerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950 p-6">
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
          <div className="w-16"></div>
        </div>

        {/* Game Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Memory Game */}
          <Link href="/player/memory">
            <div className="group bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 border border-purple-400/30 hover:border-purple-400 min-h-64 flex flex-col justify-between">
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

          {/* Puzzle Game */}
          <Link href="/player/puzzle">
            <div className="group bg-gradient-to-br from-pink-600 to-pink-800 rounded-xl p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 border border-pink-400/30 hover:border-pink-400 min-h-64 flex flex-col justify-between">
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

        {/* Stats Section */}
        <div className="mt-12 bg-slate-800/50 border border-purple-500/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-purple-300 mb-4">Your Performance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-slate-700/50 rounded p-3">
              <p className="text-slate-400">Games Played</p>
              <p className="text-2xl font-bold text-purple-300">0</p>
            </div>
            <div className="bg-slate-700/50 rounded p-3">
              <p className="text-slate-400">Total Score</p>
              <p className="text-2xl font-bold text-purple-300">0</p>
            </div>
            <div className="bg-slate-700/50 rounded p-3">
              <p className="text-slate-400">Best Streak</p>
              <p className="text-2xl font-bold text-purple-300">0</p>
            </div>
            <div className="bg-slate-700/50 rounded p-3">
              <p className="text-slate-400">Avg Time</p>
              <p className="text-2xl font-bold text-purple-300">--</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
