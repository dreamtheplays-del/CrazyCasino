import { useMemo, useState } from 'react'
import { useBalance } from '../state/BalanceContext'
import BetControls from '../components/BetControls'
import HouseEdgeBadge from '../components/HouseEdgeBadge'
import { formatChips } from '../lib/format'
import { ROWS, MULTIPLIERS, dropBall } from '../games/plinkoData'

// All board geometry is in percentages of the container, so the board
// scales fluidly instead of needing horizontal scroll on small screens.
const BOARD_ASPECT = 480 / 300 // width / height
const SLOT_PCT = 100 / (ROWS + 1)

function pegRows() {
  const rows: { xPct: number; yPct: number }[][] = []
  for (let row = 0; row < ROWS; row++) {
    const count = row + 3
    const yPct = 6 + (row * 82) / (ROWS - 1)
    const spacingPct = 100 / (count + 1)
    const pegs = Array.from({ length: count }, (_, j) => ({ xPct: spacingPct * (j + 1), yPct }))
    rows.push(pegs)
  }
  return rows
}

export default function Plinko() {
  const { balance, wager, canAfford } = useBalance()
  const [bet, setBet] = useState(10)
  const [dropping, setDropping] = useState(false)
  const [ballPos, setBallPos] = useState<{ xPct: number; yPct: number } | null>(null)
  const [landedSlot, setLandedSlot] = useState<number | null>(null)
  const [lastResult, setLastResult] = useState<{ slot: number; delta: number } | null>(null)
  const pegs = useMemo(pegRows, [])

  function drop() {
    if (dropping || !canAfford(bet)) return
    setDropping(true)
    setLandedSlot(null)
    setLastResult(null)

    const { path, slot } = dropBall()
    let posUnits = ROWS / 2
    let step = 0
    setBallPos({ xPct: posUnits * SLOT_PCT + SLOT_PCT / 2, yPct: 0 })

    const interval = window.setInterval(() => {
      posUnits += path[step] * 0.5
      step += 1
      const yPct = (step / ROWS) * 94
      setBallPos({ xPct: posUnits * SLOT_PCT + SLOT_PCT / 2, yPct })

      if (step >= ROWS) {
        clearInterval(interval)
        const multiplier = MULTIPLIERS[slot]
        const delta = Math.round(bet * (multiplier - 1) * 100) / 100
        window.setTimeout(() => {
          wager('Plinko', delta)
          setLandedSlot(slot)
          setLastResult({ slot, delta })
          setDropping(false)
        }, 150)
      }
    }, 120)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-sage-500">Plinko</p>
          <h1 className="font-display text-2xl text-cream-100">The Drop</h1>
        </div>
        <HouseEdgeBadge edge={4.1} note="measured" />
      </div>

      <div className="felt-panel flex flex-col items-center gap-4 rounded-lg p-4 sm:p-6">
        <div className="relative w-full max-w-[480px]" style={{ aspectRatio: BOARD_ASPECT }}>
          {pegs.map((row, ri) =>
            row.map((peg, pi) => (
              <span
                key={`${ri}-${pi}`}
                className="absolute h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brass-400/40 sm:h-1.5 sm:w-1.5"
                style={{ left: `${peg.xPct}%`, top: `${peg.yPct}%` }}
              />
            )),
          )}
          {ballPos && (
            <span
              className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brass-300 shadow-[0_0_10px_2px_rgba(216,180,99,0.7)]"
              style={{
                left: `${ballPos.xPct}%`,
                top: `${ballPos.yPct}%`,
                transition: 'left 120ms linear, top 120ms linear',
              }}
            />
          )}
        </div>

        <div
          className="grid w-full max-w-[480px] gap-[2px]"
          style={{ gridTemplateColumns: `repeat(${MULTIPLIERS.length}, minmax(0, 1fr))` }}
        >
          {MULTIPLIERS.map((m, i) => (
            <div
              key={i}
              className={`min-w-0 overflow-hidden rounded-sm border py-1 text-center font-mono text-[8px] font-semibold whitespace-nowrap transition-colors sm:py-1.5 sm:text-[10px] ${
                landedSlot === i
                  ? 'border-brass-200 bg-brass-300 text-felt-950'
                  : m >= 3
                    ? 'border-ember-600/30 bg-ember-500/20 text-ember-300'
                    : m >= 1
                      ? 'border-brass-400/20 bg-brass-400/15 text-brass-300'
                      : 'border-felt-700 bg-felt-900/70 text-sage-400'
              }`}
            >
              {m}×
            </div>
          ))}
        </div>

        {lastResult && (
          <p className={`floater font-mono text-sm font-semibold ${lastResult.delta > 0 ? 'text-brass-300' : 'text-ember-400'}`}>
            Landed {MULTIPLIERS[lastResult.slot]}× — {lastResult.delta >= 0 ? '+' : ''}
            {formatChips(lastResult.delta)}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-4">
          <BetControls bet={bet} setBet={setBet} min={1} max={Math.max(1, Math.min(200, Math.floor(balance)))} disabled={dropping} />
          <button
            onClick={drop}
            disabled={dropping || !canAfford(bet)}
            className="rounded-md bg-brass-400 px-6 py-2.5 font-medium text-felt-950 transition hover:bg-brass-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {dropping ? 'Dropping…' : `Drop for ${formatChips(bet)}`}
          </button>
        </div>
      </div>
    </div>
  )
}
