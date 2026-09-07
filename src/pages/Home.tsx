import { Link } from 'react-router-dom'
import { useBalance } from '../state/BalanceContext'
import { formatChips } from '../lib/format'
import { ReelIcon, WheelIcon, DiceIcon, PlinkoIcon, SuitSpade, ChipIcon } from '../components/icons'

const GAMES = [
  {
    to: '/slots',
    name: 'Brass Reels',
    tag: 'Slots',
    icon: ReelIcon,
    edge: '9.9%',
    blurb: 'Three reels, nine paylines of one, and a jackpot symbol that pays 40×.',
  },
  {
    to: '/blackjack',
    name: 'Table Nine',
    tag: 'Blackjack',
    icon: SuitSpade,
    edge: '~1%',
    blurb: 'Dealer stands on 17, blackjack pays 3:2, single deck reshuffled each hand.',
  },
  {
    to: '/roulette',
    name: 'The Wheel',
    tag: 'Roulette',
    icon: WheelIcon,
    edge: '2.7%',
    blurb: 'Single-zero European wheel. Straight bets, splits, dozens, and outside bets.',
  },
  {
    to: '/dice',
    name: 'Under the Line',
    tag: 'Dice',
    icon: DiceIcon,
    edge: '1.0%',
    blurb: 'Pick a target, roll under it. Lower targets pay more, the house keeps 1%.',
  },
  {
    to: '/plinko',
    name: 'The Drop',
    tag: 'Plinko',
    icon: PlinkoIcon,
    edge: '4.1%',
    blurb: 'Sixteen rows of pegs feed a multiplier rail from 0.2× to 18×.',
  },
]

export default function Home() {
  const { balance } = useBalance()

  return (
    <div className="flex flex-col gap-10">
      <section className="grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-center">
        <div>
          <p className="text-sm tracking-wide text-sage-400">A play-money casino floor</p>
          <h1 className="mt-2 font-display text-4xl leading-tight text-cream-100 sm:text-5xl">
            Every table here runs on <span className="shimmer-text italic">chips that mean nothing</span>, honestly.
          </h1>
          <p className="mt-4 max-w-lg text-sage-300">
            No card on file, no real payouts, no way to lose anything but an evening. Each game states its house edge
            up front, the way a real floor never would — because here, the only thing at stake is your curiosity
            about the math.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/slots"
              className="rounded-md bg-brass-400 px-5 py-2.5 font-medium text-felt-950 transition hover:bg-brass-300"
            >
              Sit down at the reels
            </Link>
            <span className="text-sm text-sage-400">or pick a table below</span>
          </div>
        </div>
        <div className="felt-panel rounded-lg p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-sage-400">Your bankroll</span>
            <ChipIcon className="h-5 w-5 text-brass-300" />
          </div>
          <p className="mt-2 font-mono text-4xl font-semibold tabular text-cream-100">{formatChips(balance)}</p>
          <p className="mt-1 text-xs text-sage-500">chips · resettable any time, worth exactly nothing</p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((game) => {
          const Icon = game.icon
          return (
            <Link
              key={game.to}
              to={game.to}
              className="group felt-panel relative flex flex-col justify-between overflow-hidden rounded-lg p-5 transition-transform hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between">
                <Icon className="h-7 w-7 text-brass-400/80 transition-colors group-hover:text-brass-300" />
                <span className="rounded border border-brass-400/25 px-2 py-0.5 text-[11px] text-sage-400">
                  {game.edge} edge
                </span>
              </div>
              <div className="mt-6">
                <p className="text-xs text-sage-500">{game.tag}</p>
                <h3 className="font-display text-xl text-cream-100">{game.name}</h3>
                <p className="mt-1.5 text-sm text-sage-400">{game.blurb}</p>
              </div>
            </Link>
          )
        })}
      </section>
    </div>
  )
}
