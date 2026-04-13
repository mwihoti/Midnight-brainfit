'use client'

import { useState, useEffect } from 'react'
import { useGameStore } from '@/lib/store'
import { initializeMemoryGame, calculateScore } from '@/lib/services/gameService'
import { Card } from '@/lib/services/gameService'
import { RotateCcw } from 'lucide-react'

const SYMBOL_POOL = [
  '★', '♦', '♠', '♥', '▲', '●', '■', '✦',
  '♣', '♘', '♙', '♟', '⬟', '⬡', '◆', '⬢',
  '⊕', '⊗', '⊘', '⊙', '△', '▽', '◇', '○',
]

function pickSymbols(): string[] {
  const pool = [...SYMBOL_POOL]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, 8)
}

interface MemoryGameProps {
  onComplete?: (score: number, timeSpent: number, moves: number) => void
}

export function MemoryGame({ onComplete }: MemoryGameProps) {
  const store = useGameStore()
  const [symbols, setSymbols] = useState<string[]>(() => pickSymbols())
  const [cards, setCards] = useState<Card[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [completionHandled, setCompletionHandled] = useState(false)

  useEffect(() => {
    const diff = Math.max(1, Math.min(5, store.difficulty)) as 1 | 2 | 3 | 4 | 5
    const newCards = initializeMemoryGame({ difficulty: diff, gridSize: 4, pairsCount: 8 })
    setCards(newCards)
  }, [store.difficulty])

  useEffect(() => {
    if (isComplete) return
    const timer = setInterval(() => setTime((t) => t + 1), 1000)
    return () => clearInterval(timer)
  }, [isComplete])

  useEffect(() => {
    if (flipped.length !== 2) return
    const [first, second] = flipped
    if (cards[first].value === cards[second].value) {
      setMatched((m) => [...m, first, second])
      setFlipped([])
    } else {
      setTimeout(() => setFlipped([]), 600)
    }
    setMoves((m) => m + 1)
  }, [flipped, cards])

  useEffect(() => {
    if (matched.length > 0 && matched.length === cards.length && !completionHandled) {
      setIsComplete(true)
      setCompletionHandled(true)
      const score = calculateScore(moves, time, store.difficulty, true)
      store.updateScore(score)
      onComplete?.(score, time, moves)
    }
  }, [matched, cards.length, moves, time, store, onComplete, completionHandled])

  const handleCardClick = (index: number) => {
    if (flipped.includes(index) || matched.includes(index) || flipped.length === 2 || isComplete)
      return
    setFlipped((f) => [...f, index])
  }

  const resetGame = () => {
    const diff = Math.max(1, Math.min(5, store.difficulty)) as 1 | 2 | 3 | 4 | 5
    const newCards = initializeMemoryGame({ difficulty: diff, gridSize: 4, pairsCount: 8 })
    setSymbols(pickSymbols())
    setCards(newCards)
    setFlipped([])
    setMatched([])
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
              matched.includes(idx)
                ? 'bg-purple-700 text-white scale-105 opacity-60'
                : flipped.includes(idx)
                ? 'bg-purple-500 text-white scale-105'
                : 'bg-slate-600 text-slate-400 hover:bg-slate-500 cursor-pointer'
            }`}
          >
            {flipped.includes(idx) || matched.includes(idx) ? symbols[card.value] : '?'}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={resetGame}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Completion */}
      {isComplete && (
        <div className="mt-6 p-4 bg-green-900/30 border border-green-500 rounded text-center">
          <p className="text-green-300 font-semibold">Level Complete!</p>
          <p className="text-sm text-slate-300 mt-2">
            Score: {store.score} | Time: {time}s
          </p>
        </div>
      )}
    </div>
  )
}
