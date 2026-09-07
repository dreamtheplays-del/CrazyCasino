import { useMemo, useState } from 'react'
import { useBalance } from '../state/BalanceContext'
import BetControls from '../components/BetControls'
import HouseEdgeBadge from '../components/HouseEdgeBadge'
import { formatChips } from '../lib/format'
import { WHEEL_ORDER, colorOf, betKey, payoutFor, type BetKind } from '../games/rouletteData'

type PlacedBet = { bet: BetKind; label: string; amount: number }

const COLUMN_ROWS: number[][] = [1, 2, 3].map((row) =>
  Array.from({ length: 12 }, (_, col) => 3 - row + 1 + col * 3),
)

export default function Roulette() {
  const { balance, wager, canAfford } = useBalance()
  const [chip, setChip] = useState(5)
  const [bets, setBets] = useState<Record<string, PlacedBet>>({})
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState<{ n: number; net: number } | null>(null)

  const totalWagered = useMemo(() => Object.values(bets).reduce((s, b) => s + b.amount, 0), [bets])

  function place(bet: BetKind, label: string) {
    if (spinning) return
    if (totalWagered + chip > balance) return
    setResult(null)
    setBets((prev) => {
      const key = betKey(bet)
      const existing = prev[key]
      return { ...prev, [key]: { bet, label, amount: (existing?.amount ?? 0) + chip } }
    })
  }

  function clearBets() {
    if (spinning) return
    setBets({})
    setResult(null)
  }

  function spin() {
    if (spinning || totalWagered === 0 || totalWagered > balance) return
    setSpinning(true)

    const winningNumber = WHEEL_ORDER[Math.floor(Math.random() * WHEEL_ORDER.length)]
    const idx = WHEEL_ORDER.indexOf(winningNumber)
    const segAngle = 360 / WHEEL_ORDER.length
    // land the pointer (top, 0deg) on the middle of the winning segment after several full spins
    const targetAngle = 360 * 6 - idx * segAngle - segAngle / 2
    setRotation((prev) => prev + (targetAngle - (prev % 360)))

    setTimeout(() => {
      let totalReturn = 0
      for (const pb of Object.values(bets)) {
        const mult = payoutFor(pb.bet, winningNumber)
        totalReturn += pb.amount * mult
      }
      const net = Math.round((totalReturn - totalWagered) * 100) / 100
      wager('Roulette', net)
      setResult({ n: winningNumber, net })
      setBets({})
      setSpinning(false)
    }, 3400)
  }

  const chipOn = (key: string) => bets[key]?.amount

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-sage-500">Roulette</p>
          <h1 className="font-display text-2xl text-cream-100">The Wheel</h1>
        </div>
        <HouseEdgeBadge edge={2.7} note="single zero" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="felt-panel flex flex-col items-center justify-center gap-4 rounded-lg p-6">
          <div className="relative h-52 w-52">
            <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1 text-brass-300">▼</div>
            <div
              className="h-full w-full rounded-full border-4 border-brass-500 shadow-[0_0_40px_-10px_rgba(216,180,99,0.5)]"
              style={{
                transition: spinning ? 'transform 3.4s cubic-bezier(0.15,0.85,0.25,1)' : undefined,
                transform: `rotate(${rotation}deg)`,
                background: `conic-gradient(${WHEEL_ORDER.map((n, i) => {
                  const c = colorOf(n)
                  const color = c === 'red' ? '#9E332C' : c === 'black' ? '#0A281F' : '#2B7457'
                  const step = 360 / WHEEL_ORDER.length
                  return `${color} ${i * step}deg ${(i + 1) * step}deg`
                }).join(',')})`,
              }}
            />
            <div className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full border border-brass-400/40 bg-felt-900 font-mono text-lg font-semibold text-brass-200">
              {result ? result.n : '—'}
            </div>
          </div>
          {result && (
            <p className={`font-mono text-sm ${result.net > 0 ? 'text-brass-300' : result.net < 0 ? 'text-ember-400' : 'text-sage-400'}`}>
              {result.net > 0 ? `+${formatChips(result.net)}` : result.net < 0 ? formatChips(result.net) : 'Push'}
            </p>
          )}
          <div className="w-full text-center">
            <p className="text-xs text-sage-500">chip value</p>
            <div className="mt-1">
              <BetControls bet={chip} setBet={setChip} min={1} max={100} disabled={spinning} />
            </div>
          </div>
        </div>

        <div className="felt-panel rounded-lg p-4">
          <div className="flex gap-1">
            <button
              onClick={() => place({ type: 'straight', n: 0 }, '0')}
              className={`flex w-10 items-center justify-center rounded border text-sm font-medium ${
                chipOn('straight-0') ? 'border-brass-300 bg-brass-400/20 text-brass-200' : 'border-felt-600 bg-felt-800 text-sage-300'
              } hover:border-brass-400/60`}
              style={{ minHeight: '96px' }}
            >
              0
            </button>
            <div className="flex flex-1 flex-col gap-1">
              {COLUMN_ROWS.map((row, ri) => (
                <div key={ri} className="grid grid-cols-12 gap-1">
                  {row.map((n) => {
                    const key = `straight-${n}`
                    const color = colorOf(n)
                    return (
                      <button
                        key={n}
                        onClick={() => place({ type: 'straight', n }, String(n))}
                        className={`relative rounded border py-2 text-xs font-medium transition-colors ${
                          color === 'red'
                            ? 'border-ember-600/40 bg-ember-500/20 text-ember-300'
                            : 'border-felt-600 bg-felt-800 text-sage-200'
                        } ${chipOn(key) ? 'ring-2 ring-brass-300' : ''} hover:brightness-125`}
                      >
                        {n}
                        {chipOn(key) && (
                          <span className="absolute -right-1 -top-1 rounded-full bg-brass-400 px-1 text-[9px] font-bold text-felt-950">
                            {chipOn(key)}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              ))}
              <div className="grid grid-cols-3 gap-1">
                {([1, 2, 3] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => place({ type: 'column', c }, `Column ${c}`)}
                    className={`relative rounded border border-felt-600 bg-felt-800 py-1.5 text-xs text-sage-300 hover:border-brass-400/50 ${
                      chipOn(`column-${c}`) ? 'ring-2 ring-brass-300' : ''
                    }`}
                  >
                    2:1
                    {chipOn(`column-${c}`) && (
                      <span className="absolute -right-1 -top-1 rounded-full bg-brass-400 px-1 text-[9px] font-bold text-felt-950">
                        {chipOn(`column-${c}`)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-1">
            {([1, 2, 3] as const).map((d) => (
              <button
                key={d}
                onClick={() => place({ type: 'dozen', d }, `Dozen ${d}`)}
                className={`relative rounded border border-felt-600 bg-felt-800 py-2 text-xs text-sage-300 hover:border-brass-400/50 ${
                  chipOn(`dozen-${d}`) ? 'ring-2 ring-brass-300' : ''
                }`}
              >
                {d === 1 ? '1st 12' : d === 2 ? '2nd 12' : '3rd 12'}
                {chipOn(`dozen-${d}`) && (
                  <span className="absolute -right-1 -top-1 rounded-full bg-brass-400 px-1 text-[9px] font-bold text-felt-950">
                    {chipOn(`dozen-${d}`)}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-6 gap-1">
            {[
              { type: 'low' as const, label: '1–18' },
              { type: 'even' as const, label: 'Even' },
              { type: 'red' as const, label: 'Red' },
              { type: 'black' as const, label: 'Black' },
              { type: 'odd' as const, label: 'Odd' },
              { type: 'high' as const, label: '19–36' },
            ].map((o) => (
              <button
                key={o.type}
                onClick={() => place({ type: o.type }, o.label)}
                className={`relative rounded border border-felt-600 py-2 text-xs font-medium hover:border-brass-400/50 ${
                  o.type === 'red'
                    ? 'bg-ember-500/20 text-ember-300'
                    : o.type === 'black'
                      ? 'bg-felt-950 text-sage-200'
                      : 'bg-felt-800 text-sage-300'
                } ${chipOn(o.type) ? 'ring-2 ring-brass-300' : ''}`}
              >
                {o.label}
                {chipOn(o.type) && (
                  <span className="absolute -right-1 -top-1 rounded-full bg-brass-400 px-1 text-[9px] font-bold text-felt-950">
                    {chipOn(o.type)}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-brass-400/15 pt-4">
            <div className="text-sm text-sage-400">
              At risk: <span className="font-mono text-cream-100">{formatChips(totalWagered)}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={clearBets}
                disabled={spinning || totalWagered === 0}
                className="rounded-md border border-brass-400/25 px-4 py-2 text-sm text-sage-300 hover:border-brass-400/50 disabled:opacity-40"
              >
                Clear
              </button>
              <button
                onClick={spin}
                disabled={spinning || totalWagered === 0 || !canAfford(totalWagered)}
                className="rounded-md bg-brass-400 px-6 py-2 font-medium text-felt-950 hover:bg-brass-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {spinning ? 'Spinning…' : 'Spin'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
