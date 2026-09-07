export const WHEEL_ORDER = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
  16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
]

export const RED_NUMBERS = new Set([
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
])

export function colorOf(n: number): 'red' | 'black' | 'green' {
  if (n === 0) return 'green'
  return RED_NUMBERS.has(n) ? 'red' : 'black'
}

export type BetKind =
  | { type: 'straight'; n: number }
  | { type: 'red' | 'black' | 'odd' | 'even' | 'low' | 'high' }
  | { type: 'dozen'; d: 1 | 2 | 3 }
  | { type: 'column'; c: 1 | 2 | 3 }

export function betKey(bet: BetKind): string {
  if (bet.type === 'straight') return `straight-${bet.n}`
  if (bet.type === 'dozen') return `dozen-${bet.d}`
  if (bet.type === 'column') return `column-${bet.c}`
  return bet.type
}

export function payoutFor(bet: BetKind, winning: number): number {
  // returns total return multiplier including stake (0 = loses stake)
  const color = colorOf(winning)
  switch (bet.type) {
    case 'straight':
      return bet.n === winning ? 36 : 0
    case 'red':
      return color === 'red' ? 2 : 0
    case 'black':
      return color === 'black' ? 2 : 0
    case 'odd':
      return winning !== 0 && winning % 2 === 1 ? 2 : 0
    case 'even':
      return winning !== 0 && winning % 2 === 0 ? 2 : 0
    case 'low':
      return winning >= 1 && winning <= 18 ? 2 : 0
    case 'high':
      return winning >= 19 && winning <= 36 ? 2 : 0
    case 'dozen': {
      const range = bet.d === 1 ? [1, 12] : bet.d === 2 ? [13, 24] : [25, 36]
      return winning >= range[0] && winning <= range[1] ? 3 : 0
    }
    case 'column': {
      if (winning === 0) return 0
      const col = ((winning - 1) % 3) + 1
      return col === bet.c ? 3 : 0
    }
  }
}
