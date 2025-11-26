'use client'

import { useState, useEffect } from 'react'
import { useGameStore } from '@/lib/store'
import { initializeMemoryGame, calculateScore } from '@/lib/services/gameService'
import { Card } from '@/lib/services/gameService'
import { RotateCcw, Volume2, VolumeX } from 'lucide-react'

export function MemoryGame() {
  const store = useGameStore()
  const [cards, setCards] = useState<Card[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Initialize game
  useEffect(() => {
    const newCards = initializeMemoryGame({ difficulty: 1, gridSize: 4, pairsCount: 8 })
    setCards(newCards)
  }, [])

  // Timer
  useEffect(() => {
    if (isComplete) {
      return
    }
    const timer = setInterval(() => setTime((t) => t + 1), 1000)
    return () => clearInterval(timer)
  }, [isComplete])

  // Check for matches
  useEffect(() => {
    if (flipped.length !== 2) return

    const [first, second] = flipped
    if (cards[first].value === cards[second].value) {
      setMatched([...matched, first, second])
      setFlipped([])
      playSound('success')
    } else {
      setTimeout(() => setFlipped([]), 600)
      playSound('error')
    }

    setMoves((m) => m + 1)
  }, [flipped, cards, matched])

  // Check win condition
  useEffect(() => {
    if (matched.length > 0 && matched.length === cards.length) {
      setIsComplete(true)
      const score = calculateScore(moves, time, store.difficulty, true)
      store.updateScore(score)
    }
  }, [matched, cards.length, moves, time, store])

  const handleCardClick = (index: number) => {
    if (
      flipped.includes(index) ||
      matched.includes(index) ||
      flipped.length === 2 ||
      isComplete
    )
      return
    setFlipped([...flipped, index])
  }

  const playSound = (type: 'success' | 'error') => {
    if (!soundEnabled) return
    // In production, load and play actual sound files
    console.log('Playing sound:', type)
  }

  const resetGame = () => {
    const newCards = initializeMemoryGame({ difficulty: 1, gridSize: 4, pairsCount: 8 })
    setCards(newCards)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setTime(0)
    setIsComplete(false)
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-700 rounded p-3 text-center">
          <p className="text-xs text-slate-400">Moves</p>
          <p className="text-2xl font-bold text-purple-300">{moves}</p>
        </div>
        <div className="bg-slate-700 rounded p-3 text-center">
          <p className="text-xs text-slate-400">Time</p>
          <p className="text-2xl font-bold text-purple-300">{time}s</p>
        </div>
        <div className="bg-slate-700 rounded p-3 text-center">
          <p className="text-xs text-slate-400">Pairs</p>
          <p className="text-2xl font-bold text-purple-300">{matched.length / 2}/8</p>
        </div>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {cards.map((card, idx) => (
          <button
            key={idx}
            onClick={() => handleCardClick(idx)}
            className={`aspect-square rounded-lg font-bold text-2xl transition-all duration-200 ${
              flipped.includes(idx) || matched.includes(idx)
                ? 'bg-purple-500 text-white cursor-pointer'
                : 'bg-slate-600 text-slate-600 hover:bg-slate-500 cursor-pointer'
            }`}
          >
            {flipped.includes(idx) || matched.includes(idx) ? card.value + 1 : '?'}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
        >
          {soundEnabled ? (
            <Volume2 className="w-5 h-5" />
          ) : (
            <VolumeX className="w-5 h-5" />
          )}
        </button>
        <button
          onClick={resetGame}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Completion Message */}
      {isComplete && (
        <div className="mt-6 p-4 bg-green-900/30 border border-green-500 rounded text-center">
          <p className="text-green-300 font-semibold">🎉 Level Complete!</p>
          <p className="text-sm text-slate-300 mt-2">
            Score: {store.score} | Time: {time}s
          </p>
        </div>
      )}
    </div>
  )
}
