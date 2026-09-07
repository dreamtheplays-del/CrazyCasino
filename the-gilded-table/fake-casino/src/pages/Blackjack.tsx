import { useState } from 'react'
import { useBalance } from '../state/BalanceContext'
import BetControls from '../components/BetControls'
import HouseEdgeBadge from '../components/HouseEdgeBadge'
import { PlayingCard } from '../components/PlayingCard'
import { formatChips } from '../lib/format'
import { freshShoe, handTotal, isBlackjack, type Card } from '../games/blackjackData'

type Phase = 'betting' | 'player' | 'dealer' | 'result'

export default function Blackjack() {
  const { wager, canAfford, balance } = useBalance()
  const [bet, setBet] = useState(10)
  const [shoe, setShoe] = useState<Card[]>(() => freshShoe())
  const [player, setPlayer] = useState<Card[]>([])
  const [dealer, setDealer] = useState<Card[]>([])
  const [phase, setPhase] = useState<Phase>('betting')
  const [outcome, setOutcome] = useState<{ text: string; delta: number } | null>(null)

  function draw(deck: Card[]): [Card, Card[]] {
    let d = deck
    if (d.length < 8) d = freshShoe()
    const card = d[0]
    return [card, d.slice(1)]
  }

  function deal() {
    if (phase !== 'betting' && phase !== 'result') return
    if (!canAfford(bet)) return
    let deck = shoe.length < 12 ? freshShoe() : shoe
    const p: Card[] = []
    const d: Card[] = []
    let c: Card
    ;[c, deck] = draw(deck); p.push(c)
    ;[c, deck] = draw(deck); d.push(c)
    ;[c, deck] = draw(deck); p.push(c)
    ;[c, deck] = draw(deck); d.push(c)

    setShoe(deck)
    setPlayer(p)
    setDealer(d)
    setOutcome(null)

    if (isBlackjack(p) || isBlackjack(d)) {
      resolve(p, d, deck, false)
    } else {
      setPhase('player')
    }
  }

  function hit() {
    if (phase !== 'player') return
    let deck = shoe
    let c: Card
    ;[c, deck] = draw(deck)
    const p = [...player, c]
    setPlayer(p)
    setShoe(deck)
    if (handTotal(p).total > 21) {
      resolve(p, dealer, deck, false)
    }
  }

  function stand() {
    if (phase !== 'player') return
    runDealer(player, dealer, shoe, false)
  }

  function double() {
    if (phase !== 'player' || player.length !== 2 || !canAfford(bet * 2)) return
    let deck = shoe
    let c: Card
    ;[c, deck] = draw(deck)
    const p = [...player, c]
    setPlayer(p)
    setShoe(deck)
    if (handTotal(p).total > 21) {
      resolve(p, dealer, deck, true)
    } else {
      runDealer(p, dealer, deck, true)
    }
  }

  function runDealer(p: Card[], startingDealer: Card[], deck: Card[], isDoubled: boolean) {
    setPhase('dealer')
    let d = [...startingDealer]
    let currentDeck = deck
    function step() {
      const total = handTotal(d).total
      if (total < 17) {
        let c: Card
        ;[c, currentDeck] = draw(currentDeck)
        d = [...d, c]
        setDealer(d)
        setShoe(currentDeck)
        window.setTimeout(step, 550)
      } else {
        window.setTimeout(() => resolve(p, d, currentDeck, isDoubled), 400)
      }
    }
    window.setTimeout(step, 550)
  }

  function resolve(p: Card[], d: Card[], _deck: Card[], isDoubled: boolean) {
    setDealer(d)
    const pTotal = handTotal(p).total
    const dTotal = handTotal(d).total
    const wagerAmount = isDoubled ? bet * 2 : bet
    const pBJ = isBlackjack(p)
    const dBJ = isBlackjack(d)

    let delta = 0
    let text = ''

    if (pTotal > 21) {
      delta = -wagerAmount
      text = 'Bust — dealer wins'
    } else if (pBJ && dBJ) {
      delta = 0
      text = 'Both blackjack — push'
    } else if (pBJ) {
      delta = bet * 1.5
      text = 'Blackjack! Pays 3:2'
    } else if (dBJ) {
      delta = -wagerAmount
      text = 'Dealer blackjack'
    } else if (dTotal > 21) {
      delta = wagerAmount
      text = 'Dealer busts — you win'
    } else if (pTotal > dTotal) {
      delta = wagerAmount
      text = 'You win'
    } else if (pTotal < dTotal) {
      delta = -wagerAmount
      text = 'Dealer wins'
    } else {
      delta = 0
      text = 'Push'
    }

    delta = Math.round(delta * 100) / 100
    wager('Blackjack', delta)
    setOutcome({ text, delta })
    setPhase('result')
  }

  const pTotal = player.length ? handTotal(player).total : 0
  const dTotal = dealer.length ? handTotal(dealer).total : 0
  const showDealerHidden = phase === 'player'
  const canDouble = phase === 'player' && player.length === 2 && canAfford(bet * 2)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-sage-500">Blackjack</p>
          <h1 className="font-display text-2xl text-cream-100">Table Nine</h1>
        </div>
        <HouseEdgeBadge edge={1.0} note="basic strategy" />
      </div>

      <div className="felt-panel min-h-[420px] rounded-lg p-6">
        <div className="flex flex-col gap-8">
          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-sage-500">
              <span>Dealer</span>
              {dealer.length > 0 && <span className="font-mono tabular">{showDealerHidden ? '?' : dTotal}</span>}
            </div>
            <div className="flex gap-2">
              {dealer.map((c, i) => (
                <PlayingCard key={c.id + i} card={c} hidden={showDealerHidden && i === 1} dealDelay={i * 120} />
              ))}
              {dealer.length === 0 && <div className="h-28 w-full rounded-md border border-dashed border-brass-400/15" />}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-sage-500">
              <span>You</span>
              {player.length > 0 && <span className="font-mono tabular">{pTotal}</span>}
            </div>
            <div className="flex gap-2">
              {player.map((c, i) => (
                <PlayingCard key={c.id + i} card={c} dealDelay={i * 120} />
              ))}
              {player.length === 0 && <div className="h-28 w-full rounded-md border border-dashed border-brass-400/15" />}
            </div>
          </div>

          {outcome && (
            <p className={`floater font-mono text-sm font-semibold ${outcome.delta > 0 ? 'text-brass-300' : outcome.delta < 0 ? 'text-ember-400' : 'text-sage-400'}`}>
              {outcome.text} {outcome.delta !== 0 && `(${outcome.delta > 0 ? '+' : ''}${formatChips(outcome.delta)})`}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-brass-400/15 pt-5">
            {(phase === 'betting' || phase === 'result') && (
              <>
                <BetControls bet={bet} setBet={setBet} min={1} max={Math.max(1, Math.min(250, Math.floor(balance)))} />
                <button
                  onClick={deal}
                  disabled={!canAfford(bet)}
                  className="rounded-md bg-brass-400 px-6 py-2.5 font-medium text-felt-950 transition hover:bg-brass-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Deal for {formatChips(bet)}
                </button>
              </>
            )}
            {phase === 'player' && (
              <div className="flex flex-wrap gap-2">
                <button onClick={hit} className="rounded-md border border-brass-400/40 px-5 py-2.5 font-medium text-brass-300 hover:bg-brass-400/10">
                  Hit
                </button>
                <button onClick={stand} className="rounded-md bg-brass-400 px-5 py-2.5 font-medium text-felt-950 hover:bg-brass-300">
                  Stand
                </button>
                <button
                  onClick={double}
                  disabled={!canDouble}
                  className="rounded-md border border-brass-400/40 px-5 py-2.5 font-medium text-brass-300 hover:bg-brass-400/10 disabled:opacity-30"
                >
                  Double
                </button>
              </div>
            )}
            {phase === 'dealer' && <p className="text-sm text-sage-400">Dealer drawing…</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
