# The Gilded Table

A play-money casino. Every "chip" is fake, resets are free, and every table
shows its house edge up front — the whole point is to feel the games out
without any of them costing anything.

**Games:** Slots ("Brass Reels"), Blackjack ("Table Nine"), Roulette ("The
Wheel"), Dice ("Under the Line"), and Plinko ("The Drop"). Each has a real,
simulated house edge baked into its math (listed on its page) — nothing here
is 50/50 or player-favored, same as a real floor, just with nothing on the
line.

Built with React + TypeScript + Vite + Tailwind CSS v4. No backend — your
balance lives in `localStorage` on your own device.

## Run it locally

```bash
npm install
npm run dev
```

Then open the URL it prints (usually `http://localhost:5173`).

## Deploy it yourself (GitHub + Vercel)

### 1. Push this project to GitHub

From inside this project folder:

```bash
git init
git add .
git commit -m "Initial commit: The Gilded Table"
```

Then create a new, empty repository on GitHub (github.com -> New repository
-- don't initialize it with a README, since this project already has one),
and push:

```bash
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git branch -M main
git push -u origin main
```

### 2. Import it into Vercel

1. Go to vercel.com and sign in (you can sign in directly with your GitHub
   account).
2. Click **Add New -> Project**.
3. Select the GitHub repository you just pushed. If you don't see it, click
   **Adjust GitHub App Permissions** and grant Vercel access to it.
4. Vercel auto-detects this as a **Vite** project -- the defaults it fills in
   are already correct:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
5. Click **Deploy**. It takes about a minute.

You'll get a live `your-project.vercel.app` URL. Every future `git push` to
`main` automatically redeploys it.

### That's it

No environment variables, no database, no API keys -- it's a fully static
site. The `vercel.json` in this repo just makes sure page refreshes and
direct links keep working (belt-and-suspenders on top of the app's built-in
hash-based routing).

## Project structure

```
src/
  pages/        One file per game (Home, Slots, Blackjack, Roulette, Dice, Plinko)
  games/        Pure game-logic modules (paytables, deck logic, odds) -- no UI
  components/   Shared UI: layout, cards, bet controls, icons
  state/        Global fake-chip balance (persisted to localStorage)
```

Each game's math lives in its own file under `src/games/`, separate from the
page component, if you want to tune odds or add new games.

## Disclaimer

This is a fictional, play-money casino for entertainment and demonstration
purposes. No real money, cryptocurrency, or anything of value is ever
wagered, deposited, or paid out. Don't repurpose this for real-money
gambling -- most jurisdictions require a gambling license for that.
