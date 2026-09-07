import type { Card } from '../games/blackjackData'
import { SUIT_GLYPH, SUIT_RED } from '../games/blackjackData'

export function PlayingCard({ card, hidden, dealDelay = 0 }: { card: Card; hidden?: boolean; dealDelay?: number }) {
  if (hidden) {
    return (
      <div
        className="flex h-24 w-16 shrink-0 items-center justify-center rounded-md border border-brass-400/40 sm:h-28 sm:w-20"
        style={{
          background:
            'repeating-linear-gradient(45deg, var(--color-felt-700), var(--color-felt-700) 4px, var(--color-felt-800) 4px, var(--color-felt-800) 8px)',
          animation: `deal-in 0.35s ease-out both`,
          animationDelay: `${dealDelay}ms`,
        }}
      >
        <div className="h-8 w-8 rounded-full border border-brass-400/50" />
      </div>
    )
  }

  const red = SUIT_RED[card.suit]
  return (
    <div
      className="flex h-24 w-16 shrink-0 flex-col justify-between rounded-md border border-brass-400/30 bg-cream-100 px-1.5 py-1 shadow-md sm:h-28 sm:w-20"
      style={{ animation: `deal-in 0.35s ease-out both`, animationDelay: `${dealDelay}ms` }}
    >
      <span className={`font-mono text-sm font-bold leading-none ${red ? 'text-ember-600' : 'text-felt-950'}`}>{card.rank}</span>
      <span className={`self-center text-2xl leading-none ${red ? 'text-ember-600' : 'text-felt-950'}`}>{SUIT_GLYPH[card.suit]}</span>
      <span className={`self-end rotate-180 font-mono text-sm font-bold leading-none ${red ? 'text-ember-600' : 'text-felt-950'}`}>
        {card.rank}
      </span>
    </div>
  )
}
