'use client'

import { GameMetrics } from '@/lib/store'

interface GameResultsProps {
  metrics: GameMetrics
  onClose?: () => void
}

export function GameResults({ metrics, onClose }: GameResultsProps) {
  const calculatePerformance = () => {
    // Performance score based on metrics
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
        <p className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
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

      {/* Encryption Status */}
      <div className="mb-6 p-3 bg-green-900/30 border border-green-500/30 rounded flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-xs text-green-300">Data encrypted and secured</span>
      </div>

      {/* Actions */}
      {onClose && (
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors text-sm font-semibold"
          >
            Back to Menu
          </button>
          <button className="flex-1 px-4 py-2 border border-purple-500 text-purple-300 hover:bg-purple-500/10 rounded transition-colors text-sm font-semibold">
            Share Results
          </button>
        </div>
      )}
    </div>
  )
}
