export function formatChips(value: number): string {
  const rounded = Math.round(value * 100) / 100
  return rounded.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

export function randomInt(min: number, maxInclusive: number): number {
  return Math.floor(Math.random() * (maxInclusive - min + 1)) + min
}

export function pickWeighted<T>(items: { value: T; weight: number }[]): T {
  const total = items.reduce((sum, i) => sum + i.weight, 0)
  let roll = Math.random() * total
  for (const item of items) {
    if (roll < item.weight) return item.value
    roll -= item.weight
  }
  return items[items.length - 1].value
}
