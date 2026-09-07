import { formatChips } from '../lib/format'

type Props = {
  bet: number
  setBet: (n: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
}

const QUICK = [1, 5, 10, 25]

export default function BetControls({ bet, setBet, min = 1, max = 500, step = 1, disabled }: Props) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n))

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center overflow-hidden rounded-md border border-brass-400/25">
        <button
          disabled={disabled}
          onClick={() => setBet(clamp(bet - step))}
          className="px-3 py-2 text-brass-300 hover:bg-brass-400/10 disabled:opacity-40"
        >
          −
        </button>
        <div className="px-3 py-2 font-mono tabular text-sm text-cream-100">{formatChips(bet)}</div>
        <button
          disabled={disabled}
          onClick={() => setBet(clamp(bet + step))}
          className="px-3 py-2 text-brass-300 hover:bg-brass-400/10 disabled:opacity-40"
        >
          +
        </button>
      </div>
      <div className="flex items-center gap-1.5">
        {QUICK.map((q) => (
          <button
            key={q}
            disabled={disabled}
            onClick={() => setBet(clamp(q))}
            className="rounded-md border border-brass-400/20 px-2.5 py-1.5 text-xs text-sage-300 hover:border-brass-400/50 hover:text-brass-300 disabled:opacity-40"
          >
            {q}
          </button>
        ))}
        <button
          disabled={disabled}
          onClick={() => setBet(clamp(bet * 2))}
          className="rounded-md border border-brass-400/20 px-2.5 py-1.5 text-xs text-sage-300 hover:border-brass-400/50 hover:text-brass-300 disabled:opacity-40"
        >
          2×
        </button>
        <button
          disabled={disabled}
          onClick={() => setBet(clamp(max))}
          className="rounded-md border border-brass-400/20 px-2.5 py-1.5 text-xs text-sage-300 hover:border-brass-400/50 hover:text-brass-300 disabled:opacity-40"
        >
          Max
        </button>
      </div>
    </div>
  )
}
