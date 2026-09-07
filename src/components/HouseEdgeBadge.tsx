export default function HouseEdgeBadge({ edge, note }: { edge: number; note?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-brass-400/20 bg-felt-900/50 px-3 py-1.5 text-xs text-sage-300">
      <span className="font-mono font-semibold text-brass-300">{edge.toFixed(1)}%</span>
      <span>house edge{note ? ` · ${note}` : ''}</span>
    </div>
  )
}
