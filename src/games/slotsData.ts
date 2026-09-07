export type SlotSymbol = {
  name: string
  glyph: string
  weight: number
  triplePayout: number
  pairPayout?: number
}

export const SYMBOLS: SlotSymbol[] = [
  { name: 'cherry', glyph: '\u{1F352}', weight: 34, triplePayout: 3, pairPayout: 1 },
  { name: 'lemon', glyph: '\u{1F34B}', weight: 26, triplePayout: 6, pairPayout: 1.8 },
  { name: 'clover', glyph: '\u{1F340}', weight: 20, triplePayout: 12 },
  { name: 'bell', glyph: '\u{1F514}', weight: 12, triplePayout: 30 },
  { name: 'diamond', glyph: '\u{1F48E}', weight: 6, triplePayout: 110 },
  { name: 'seven', glyph: '7', weight: 2, triplePayout: 900 },
]

const TOTAL_WEIGHT = SYMBOLS.reduce((s, x) => s + x.weight, 0)

export function spinSymbol(): SlotSymbol {
  let roll = Math.random() * TOTAL_WEIGHT
  for (const s of SYMBOLS) {
    if (roll < s.weight) return s
    roll -= s.weight
  }
  return SYMBOLS[SYMBOLS.length - 1]
}

export function resolveSpin(reels: SlotSymbol[]): { multiplier: number; label: string } {
  const [a, b, c] = reels
  if (a.name === b.name && b.name === c.name) {
    return { multiplier: a.triplePayout, label: a.name === 'seven' ? 'JACKPOT' : 'Triple match' }
  }
  const counts: Record<string, number> = {}
  for (const s of reels) counts[s.name] = (counts[s.name] || 0) + 1
  for (const s of SYMBOLS) {
    if (counts[s.name] === 2 && s.pairPayout) {
      return { multiplier: s.pairPayout, label: `Pair of ${s.name}s` }
    }
  }
  return { multiplier: 0, label: 'No match' }
}

// ~9.9% house edge measured over 8M simulated spins with this paytable.
export const SLOTS_HOUSE_EDGE = 9.9
