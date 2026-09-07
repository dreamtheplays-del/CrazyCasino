import { Link, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useBalance } from '../state/BalanceContext'
import { formatChips } from '../lib/format'
import { ChipIcon, SuitClub } from './icons'

function BalanceChip() {
  const { balance, resetBankroll, canAfford } = useBalance()
  const prev = useRef(balance)
  const [pulse, setPulse] = useState<'up' | 'down' | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => {
    if (balance > prev.current) setPulse('up')
    else if (balance < prev.current) setPulse('down')
    prev.current = balance
    const t = setTimeout(() => setPulse(null), 500)
    return () => clearTimeout(t)
  }, [balance])

  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex items-center gap-2 rounded-md border px-3 py-1.5 transition-colors duration-300 ${
          pulse === 'up'
            ? 'border-brass-300 bg-brass-400/15'
            : pulse === 'down'
              ? 'border-ember-500/60 bg-ember-500/10'
              : 'border-brass-400/30 bg-felt-900/60'
        }`}
      >
        <ChipIcon className="h-4 w-4 text-brass-300" />
        <span className="tabular font-mono text-sm font-semibold text-cream-100">{formatChips(balance)}</span>
        <span className="text-xs text-sage-400">chips</span>
      </div>
      {!canAfford(1) && !confirmReset && (
        <button
          onClick={() => setConfirmReset(true)}
          className="rounded-md border border-ember-500/50 px-2.5 py-1.5 text-xs font-medium text-ember-400 hover:bg-ember-500/10"
        >
          Out of chips
        </button>
      )}
      {confirmReset && (
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-sage-400">Refill 1,000?</span>
          <button
            onClick={() => {
              resetBankroll()
              setConfirmReset(false)
            }}
            className="rounded border border-brass-400/50 px-2 py-1 font-medium text-brass-300 hover:bg-brass-400/10"
          >
            Yes
          </button>
          <button onClick={() => setConfirmReset(false)} className="rounded px-2 py-1 text-sage-500 hover:text-sage-300">
            No
          </button>
        </div>
      )}
    </div>
  )
}

const NAV = [
  { to: '/', label: 'Lobby' },
  { to: '/slots', label: 'Slots' },
  { to: '/blackjack', label: 'Blackjack' },
  { to: '/roulette', label: 'Roulette' },
  { to: '/dice', label: 'Dice' },
  { to: '/plinko', label: 'Plinko' },
]

export default function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-brass-400/15 bg-felt-950/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3">
          <Link to="/" className="flex items-center gap-2">
            <SuitClub className="h-5 w-5 text-brass-400" />
            <span className="font-display text-lg tracking-tight text-cream-100">
              The Gilded <span className="italic text-brass-300">Table</span>
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-1">
            {NAV.map((item) => {
              const active = location.pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                    active ? 'bg-brass-400/15 text-brass-300' : 'text-sage-300 hover:text-cream-100'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <BalanceChip />
        </div>
        <div className="brass-rule opacity-40" />
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">
        <Outlet />
      </main>
      <footer className="mx-auto max-w-6xl px-5 pb-10 pt-6 text-center text-xs text-sage-500">
        Play-money only — no real wagers, no real payouts, no purchase ever necessary. Every table lists its house edge in plain sight.
      </footer>
    </div>
  )
}
