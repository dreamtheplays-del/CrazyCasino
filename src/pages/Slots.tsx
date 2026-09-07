import { useRef, useState } from 'react'
import { useBalance } from '../state/BalanceContext'
import BetControls from '../components/BetControls'
import HouseEdgeBadge from '../components/HouseEdgeBadge'
import { formatChips } from '../lib/format'
import { SYMBOLS, spinSymbol, resolveSpin, SLOTS_HOUSE_EDGE, type SlotSymbol } from '../games/slotsData'

const REEL_STOP_DELAYS = [700, 1050, 1450]

function Reel({ symbol, spinning, justLanded, index }: { symbol: SlotSymbol; spinning: boolean; justLanded: boolean; index: number }) {
  return (
    <div
      className={`relative flex h-28 w-24 items-center justify-center overflow-hidden rounded-lg border-2 bg-felt-950/80 text-5xl transition-all duration-300 sm:h-32 sm:w-28 ${
        justLanded ? 'border-brass-300 shadow-[0_0_28px_-4px_rgba(216,180,99,0.65)]' : 'border-brass-400/25'
      }`}
    >
      <span
        className={`select-none transition-transform ${spinning ? 'blur-[2px] scale-y-110 opacity-80' : 'scale-100 opacity-100'} ${
          justLanded ? 'animate-[bounce_0.5s_ease-in-out_1]' : ''
        }`}
        style={{ animationDelay: `${index * 60}ms` }}
      >
        {symbol.glyph}
      </span>
    </div>
  )
}

export default function Slots() {
  const { balance, wager, canAfford } = useBalance()
  const [bet, setBet] = useState(10)
  const [reels, setReels] = useState<SlotSymbol[]>([SYMBOLS[0], SYMBOLS[1], SYMBOLS[2]])
  const [spinningIdx, setSpinningIdx] = useState<[boolean, boolean, boolean]>([false, false, false])
  const [landedIdx, setLandedIdx] = useState<[boolean, boolean, boolean]>([false, false, false])
  const [message, setMessage] = useState<{ text: string; win: boolean } | null>(null)
  const timers = useRef<number[]>([])

  function clearTimers() {
    timers.current.forEach((t) => clearInterval(t))
    timers.current = []
  }

  function spin() {
    if (spinningIdx.some(Boolean) || !canAfford(bet)) return
    clearTimers()
    setMessage(null)
    setLandedIdx([false, false, false])
    setSpinningIdx([true, true, true])

    const finalReels: SlotSymbol[] = [spinSymbol(), spinSymbol(), spinSymbol()]

    finalReels.forEach((_, i) => {
      const interval = window.setInterval(() => {
        setReels((prev) => {
          const copy = [...prev] as [SlotSymbol, SlotSymbol, SlotSymbol]
          copy[i] = spinSymbol()
          return copy
        })
      }, 70)
      timers.current.push(interval)

      window.setTimeout(() => {
        clearInterval(interval)
        setReels((prev) => {
          const copy = [...prev] as [SlotSymbol, SlotSymbol, SlotSymbol]
          copy[i] = finalReels[i]
          return copy
        })
        setSpinningIdx((prev) => {
          const copy = [...prev] as [boolean, boolean, boolean]
          copy[i] = false
          return copy
        })

        if (i === 2) {
          const { multiplier, label } = resolveSpin(finalReels)
          const delta = multiplier > 0 ? Math.round(bet * multiplier * 100) / 100 - bet : -bet
          wager('Slots', delta)
          setLandedIdx(multiplier > 0 ? [true, true, true] : [false, false, false])
          setMessage(
            multiplier > 0
              ? { text: `${label} — +${formatChips(bet * multiplier - bet)}`, win: true }
              : { text: 'No match — try again', win: false },
          )
        }
      }, REEL_STOP_DELAYS[i])
    })
  }

  const spinning = spinningIdx.some(Boolean)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-sage-500">Slots</p>
          <h1 className="font-display text-2xl text-cream-100">Brass Reels</h1>
        </div>
        <HouseEdgeBadge edge={SLOTS_HOUSE_EDGE} note="measured" />
      </div>

      <div className="felt-panel rounded-lg p-6">
        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-3 sm:gap-4">
            {reels.map((s, i) => (
              <Reel key={i} symbol={s} spinning={spinningIdx[i]} justLanded={landedIdx[i]} index={i} />
            ))}
          </div>

          <div className="h-6 text-center">
            {message && (
              <p className={`floater font-mono text-sm font-semibold ${message.win ? 'text-brass-300' : 'text-sage-500'}`}>
                {message.text}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <BetControls bet={bet} setBet={setBet} min={1} max={Math.max(1, Math.min(200, Math.floor(balance)))} disabled={spinning} />
            <button
              onClick={spin}
              disabled={spinning || !canAfford(bet)}
              className="rounded-md bg-brass-400 px-8 py-2.5 font-medium text-felt-950 transition hover:bg-brass-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {spinning ? 'Spinning…' : 'Pull the lever'}
            </button>
          </div>
          {!canAfford(bet) && <p className="text-xs text-ember-400">Not enough chips for that bet.</p>}
        </div>
      </div>

      <div className="felt-panel rounded-lg p-5">
        <p className="mb-3 text-xs text-sage-500">Paytable — 3 of a kind (payline), fixed bet multiplier</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {SYMBOLS.map((s) => (
            <div key={s.name} className="flex items-center justify-between rounded-md border border-brass-400/15 bg-felt-900/40 px-3 py-2">
              <span className="text-2xl">{s.glyph}</span>
              <span className="font-mono text-sm text-brass-300">{s.triplePayout}×</span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-sage-500">A pair of cherries or lemons also pays out at a smaller multiplier.</p>
      </div>
    </div>
  )
}
