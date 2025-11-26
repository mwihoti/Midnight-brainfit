/**
 * Game Service
 * Handles game logic, scoring, and difficulty adjustments
 */

export interface Card {
  id: number
  value: number
  flipped: boolean
  matched: boolean
}

export interface GameConfig {
  difficulty: 1 | 2 | 3 | 4 | 5
  gridSize: 4 | 6 | 8
  pairsCount: number
  timeLimit?: number
}

/**
 * Get game configuration based on difficulty level
 */
export function getGameConfig(difficulty: number): GameConfig {
  const configs = [
    { difficulty: 1, gridSize: 4, pairsCount: 8, timeLimit: 120 },
    { difficulty: 2, gridSize: 6, pairsCount: 18, timeLimit: 180 },
    { difficulty: 3, gridSize: 6, pairsCount: 18, timeLimit: 150 },
    { difficulty: 4, gridSize: 8, pairsCount: 32, timeLimit: 180 },
    { difficulty: 5, gridSize: 8, pairsCount: 32, timeLimit: 120 },
  ]

  const config = configs[Math.min(difficulty - 1, configs.length - 1)]
  return config as GameConfig
}

/**
 * Initialize memory game cards
 */
export function initializeMemoryGame(config: GameConfig): Card[] {
  const cards: Card[] = []
  const totalCards = config.gridSize * config.gridSize

  for (let i = 0; i < totalCards; i++) {
    cards.push({
      id: i,
      value: Math.floor(i / 2),
      flipped: false,
      matched: false,
    })
  }

  return shuffleArray(cards)
}

/**
 * Initialize puzzle game tiles
 */
export function initializePuzzleGame(config: GameConfig): number[] {
  const gridSize = config.gridSize
  const tiles = Array.from({ length: gridSize * gridSize }, (_, i) => i)
  return shuffleArray(tiles)
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Calculate score based on performance
 */
export function calculateScore(
  moves: number,
  timeSpent: number,
  difficulty: number,
  isSolved: boolean
): number {
  if (!isSolved) return 0

  const baseScore = difficulty * 100
  const timeFactor = Math.max(0, 300 - timeSpent) / 300 // Faster is better
  const movesFactor = Math.max(0, 1 - moves / 100)

  return Math.floor(baseScore * (0.5 * timeFactor + 0.5 * movesFactor))
}

/**
 * Auto-adjust difficulty based on performance
 */
export function adjustDifficulty(
  currentDifficulty: number,
  scorePercentage: number
): number {
  if (scorePercentage >= 80) {
    return Math.min(5, currentDifficulty + 1)
  } else if (scorePercentage <= 40) {
    return Math.max(1, currentDifficulty - 1)
  }
  return currentDifficulty
}

/**
 * Check if player is making progress
 */
export function checkProgress(
  currentScore: number,
  previousAverageScore: number
): boolean {
  return currentScore >= previousAverageScore * 0.9
}
