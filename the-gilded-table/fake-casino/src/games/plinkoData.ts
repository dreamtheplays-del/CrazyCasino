export const ROWS = 16
export const SLOT_COUNT = ROWS + 1

// Symmetric payout rail, tuned to ~4.1% house edge (95.9% RTP) over the
// binomial distribution of a 16-row Galton board.
export const MULTIPLIERS = [
  16, 8, 3, 1.9, 1.29, 1.11, 0.92, 0.87, 0.83, 0.87, 0.92, 1.11, 1.29, 1.9, 3, 8, 16,
]

export function dropBall(): { path: (-1 | 1)[]; slot: number } {
  const path: (-1 | 1)[] = []
  let rightMoves = 0
  for (let i = 0; i < ROWS; i++) {
    const goRight = Math.random() < 0.5
    path.push(goRight ? 1 : -1)
    if (goRight) rightMoves += 1
  }
  return { path, slot: rightMoves }
}
