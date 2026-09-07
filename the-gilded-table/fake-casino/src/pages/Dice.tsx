import { useState } from 'react'
import { useBalance } from '../state/BalanceContext'
import BetControls from '../components/BetControls'
import HouseEdgeBadge from '../components/HouseEdgeBadge'
import { formatChips } from '../lib/format'

const HOUSE_EDGE = 0.01 // 1%
const MIN_TARGET = 2
const MAX_TARGET = 95

function payoutMultiplier(target: number) {
  // Fair multiplier for rolling under `target` (out of 100) is 100/target.
  // Shave the house edge off the payout, not the odds, same as most dice games.
  return ((100 / target) * (1 - HOUSE_EDGE))
}

type Roll = { roll: number; target: number; win: boolean; delta: number }

export default function Dice() {
  const { balance, wager, canAfford } = useBalance()
  const [target, setTarget] = useState(50)
  const [bet, setBet] = useState(10)
  const [rolling, setRolling] = useState(false)
  const [lastRoll, setLastRoll] = useState<Roll | null>(null)
  const [rollHistory, setRollHistory] = useState<Roll[]>([])
  const [displayRoll, setDisplayRoll] = useState(50)

  const multiplier = payoutMultiplier(target)
  const winChance = target - 1 // rolling 1..99, win if roll < target (roll from 1-99)

  function play() {
    if (rolling || !canAfford(bet)) return
    setRolling(true)

    const outcome = Math.floor(Math.random() * 99) + 1 // 1..99
    const win = outcome < target
    const delta = win ? Math.round(bet * (multiplier - 1) * 100) / 100 : -bet

    let ticks = 0
    const maxTicks = 14
    const interval = setInterval(() => {
      ticks += 1
      setDisplayRoll(Math.floor(Math.random() * 99) + 1)
      if (ticks >= maxTicks) {
        clearInterval(interval)
        setDisplayRoll(outcome)
        wager('Dice', delta)
        const entry = { roll: outcome, target, win, delta }
        setLastRoll(entry)
        setRollHistory((prev) => [entry, ...prev].slice(0, 12))
        setRolling(false)
      }
    }, 45)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-sage-500">Dice</p>
          <h1 className="font-display text-2xl text-cream-100">Under the Line</h1>
        </div>
        <HouseEdgeBadge edge={1.0} note="fixed" />
      </div>

      <div className="felt-panel rounded-lg p-6">
        <div className="flex flex-col items-center gap-2 py-6">
          <div
            className={`flex h-28 w-28 items-center justify-center rounded-xl border-2 font-mono text-4xl font-bold tabular transition-colors ${
              lastRoll && !rolling
                ? lastRoll.win
                  ? 'border-brass-300 text-brass-200 shadow-[0_0_30px_-6px_rgba(216,180,99,0.6)]'
                  : 'border-ember-500/70 text-ember-400'
                : 'border-brass-400/30 text-cream-100'
            }`}
          >
            {displayRoll}
          </div>
          <p className="text-xs text-sage-500">rolls 1–99 · win if roll is under your target</p>
        </div>

        <div className="mx-auto max-w-xl">
          <div className="mb-2 flex items-center justify-between text-xs text-sage-400">
            <span>Target: under {target}</span>
            <span>{winChance}% chance to win</span>
          </div>
          <input
            type="range"
            min={MIN_TARGET}
            max={MAX_TARGET}
            value={target}
            disabled={rolling}
            onChange={(e) => setTarget(Number(e.target.value))}
            className="w-full accent-brass-400"
          />
          <div className="mt-3 flex items-center justify-between rounded-md border border-brass-400/20 bg-felt-900/50 px-4 py-2.5 text-sm">
            <span className="text-sage-400">Payout multiplier</span>
            <span className="font-mono font-semibold text-brass-300">{multiplier.toFixed(4)}×</span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <BetControls bet={bet} setBet={setBet} min={1} max={Math.max(1, Math.min(500, Math.floor(balance)))} disabled={rolling} />
          <button
            onClick={play}
            disabled={rolling || !canAfford(bet)}
            className="rounded-md bg-brass-400 px-6 py-2.5 font-medium text-felt-950 transition hover:bg-brass-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {rolling ? 'Rolling…' : `Roll for ${formatChips(bet)}`}
          </button>
        </div>
        {!canAfford(bet) && <p className="mt-2 text-xs text-ember-400">Not enough chips for that bet.</p>}
      </div>

      {rollHistory.length > 0 && (
        <div className="felt-panel rounded-lg p-4">
          <p className="mb-2 text-xs text-sage-500">Recent rolls</p>
          <div className="flex flex-wrap gap-2">
            {rollHistory.map((r, i) => (
              <span
                key={i}
                className={`rounded px-2 py-1 font-mono text-xs tabular ${
                  r.win ? 'bg-brass-400/15 text-brass-300' : 'bg-ember-500/10 text-ember-400'
                }`}
              >
                {r.roll}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
