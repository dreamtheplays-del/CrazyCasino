import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'gilded-table:balance'
const HISTORY_KEY = 'gilded-table:history'
const STARTING_BALANCE = 1000

export type LedgerEntry = {
  id: string
  game: string
  delta: number
  balanceAfter: number
  at: number
}

type BalanceContextValue = {
  balance: number
  history: LedgerEntry[]
  wager: (game: string, delta: number) => number
  resetBankroll: () => void
  canAfford: (amount: number) => boolean
}

const BalanceContext = createContext<BalanceContextValue | null>(null)

function readInitialBalance(): number {
  if (typeof window === 'undefined') return STARTING_BALANCE
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return STARTING_BALANCE
  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : STARTING_BALANCE
}

function readInitialHistory(): LedgerEntry[] {
  if (typeof window === 'undefined') return []
  const raw = window.localStorage.getItem(HISTORY_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.slice(0, 40) : []
  } catch {
    return []
  }
}

export function BalanceProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState<number>(readInitialBalance)
  const [history, setHistory] = useState<LedgerEntry[]>(readInitialHistory)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, String(balance))
  }, [balance])

  useEffect(() => {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 40)))
  }, [history])

  const wager = useCallback((game: string, delta: number) => {
    let next = 0
    setBalance((prev) => {
      next = Math.max(0, Math.round((prev + delta) * 100) / 100)
      return next
    })
    setHistory((prev) => [
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, game, delta, balanceAfter: next, at: Date.now() },
      ...prev,
    ].slice(0, 40))
    return next
  }, [])

  const resetBankroll = useCallback(() => {
    setBalance(STARTING_BALANCE)
    setHistory([])
  }, [])

  const canAfford = useCallback((amount: number) => balance >= amount, [balance])

  const value = useMemo(
    () => ({ balance, history, wager, resetBankroll, canAfford }),
    [balance, history, wager, resetBankroll, canAfford],
  )

  return <BalanceContext.Provider value={value}>{children}</BalanceContext.Provider>
}

export function useBalance() {
  const ctx = useContext(BalanceContext)
  if (!ctx) throw new Error('useBalance must be used within BalanceProvider')
  return ctx
}

export const STARTING_BANKROLL = STARTING_BALANCE
