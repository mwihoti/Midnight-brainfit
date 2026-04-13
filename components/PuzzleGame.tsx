'use client'

import { useState, useEffect } from 'react'
import { useGameStore } from '@/lib/store'
import { initializePuzzleGame, calculateScore } from '@/lib/services/gameService'
import { RotateCcw } from 'lucide-react'

interface PuzzleGameProps {
  onComplete?: (score: number, timeSpent: number, moves: number) => void
}

export function PuzzleGame({ onComplete }: PuzzleGameProps) {
  const store = useGameStore()
  const [tiles, setTiles] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [completionHandled, setCompletionHandled] = useState(false)

  useEffect(() => {
    const diff = Math.max(1, Math.min(5, store.difficulty)) as 1 | 2 | 3 | 4 | 5
    const newTiles = initializePuzzleGame({ difficulty: diff, gridSize: 4, pairsCount: 8 })
    setTiles(newTiles)
  }, [store.difficulty])

  useEffect(() => {
    if (isComplete) return
    const timer = setInterval(() => setTime((t) => t + 1), 1000)
    return () => clearInterval(timer)
  }, [isComplete])

  useEffect(() => {
    if (tiles.length === 0) return
    const isSolved = tiles.every((tile, idx) => tile === idx)
    if (isSolved && moves > 0 && !completionHandled) {
      setIsComplete(true)
      setCompletionHandled(true)
      const score = calculateScore(moves, time, store.difficulty, true)
      store.updateScore(score)
      onComplete?.(score, time, moves)
    }
  }, [tiles, moves, time, store, onComplete, completionHandled])

  const handleTileClick = (idx: number) => {
    if (isComplete) return
    const emptyIdx = tiles.indexOf(16)
    if (emptyIdx === -1) return
    const row = Math.floor(idx / 4)
    const col = idx % 4
    const emptyRow = Math.floor(emptyIdx / 4)
    const emptyCol = emptyIdx % 4

    if (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    ) {
      const newTiles = [...tiles]
      ;[newTiles[idx], newTiles[emptyIdx]] = [newTiles[emptyIdx], newTiles[idx]]
      setTiles(newTiles)
      setMoves((m) => m + 1)
    }
  }

  const resetGame = () => {
    const diff = Math.max(1, Math.min(5, store.difficulty)) as 1 | 2 | 3 | 4 | 5
    const newTiles = initializePuzzleGame({ difficulty: diff, gridSize: 4, pairsCount: 8 })
    setTiles(newTiles)
    setMoves(0)
    setTime(0)
    setIsComplete(false)
    setCompletionHandled(false)
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-700 rounded p-3 text-center">
          <p className="text-xs text-slate-400">Moves</p>
          <p className="text-2xl font-bold text-pink-300">{moves}</p>
        </div>
        <div className="bg-slate-700 rounded p-3 text-center">
          <p className="text-xs text-slate-400">Time</p>
          <p className="text-2xl font-bold text-pink-300">{time}s</p>
        </div>
        <div className="bg-slate-700 rounded p-3 text-center">
          <p className="text-xs text-slate-400">Misplaced</p>
          <p className="text-2xl font-bold text-pink-300">
            {tiles.filter((t, i) => t !== 16 && t !== i).length}
          </p>
        </div>
      </div>

      {/* Puzzle Grid */}
      <div className="grid grid-cols-4 gap-2 mb-6 p-4 bg-slate-800 rounded-lg">
        {tiles.map((tile, idx) => (
          <button
            key={idx}
            onClick={() => handleTileClick(idx)}
            className={`aspect-square rounded font-bold text-lg transition-all duration-200 ${
              tile === 16
                ? 'bg-slate-700 cursor-default'
                : 'bg-pink-600 hover:bg-pink-500 cursor-pointer text-white'
            }`}
          >
            {tile !== 16 && tile + 1}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={resetGame}
          className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Completion */}
      {isComplete && (
        <div className="mt-6 p-4 bg-green-900/30 border border-green-500 rounded text-center">
          <p className="text-green-300 font-semibold">Puzzle Solved!</p>
          <p className="text-sm text-slate-300 mt-2">
            Score: {store.score} | Time: {time}s
          </p>
        </div>
      )}
    </div>
  )
}
