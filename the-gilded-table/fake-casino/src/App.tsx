import { HashRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Slots from './pages/Slots'
import Blackjack from './pages/Blackjack'
import Roulette from './pages/Roulette'
import Dice from './pages/Dice'
import Plinko from './pages/Plinko'
import { BalanceProvider } from './state/BalanceContext'

export default function App() {
  return (
    <BalanceProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/slots" element={<Slots />} />
            <Route path="/blackjack" element={<Blackjack />} />
            <Route path="/roulette" element={<Roulette />} />
            <Route path="/dice" element={<Dice />} />
            <Route path="/plinko" element={<Plinko />} />
          </Route>
        </Routes>
      </HashRouter>
    </BalanceProvider>
  )
}
