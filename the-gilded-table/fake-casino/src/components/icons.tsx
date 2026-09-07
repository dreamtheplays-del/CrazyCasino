export function SuitSpade({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2c-2.8 3.6-7.2 7-7.2 11.1a4.6 4.6 0 0 0 7.4 3.6c-.2 2-.9 3.2-2.6 4.3h4.8c-1.7-1.1-2.4-2.3-2.6-4.3a4.6 4.6 0 0 0 7.4-3.6C19.2 9 14.8 5.6 12 2Z" />
    </svg>
  )
}

export function SuitHeart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 21S3 14.7 3 8.6C3 5.5 5.4 3 8.4 3c1.8 0 3.2 1 3.6 2.1C12.4 4 13.8 3 15.6 3 18.6 3 21 5.5 21 8.6 21 14.7 12 21 12 21Z" />
    </svg>
  )
}

export function SuitDiamond({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2 20 12 12 22 4 12Z" />
    </svg>
  )
}

export function SuitClub({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 3a3.3 3.3 0 0 0-3.3 3.3c0 .4.06.77.17 1.13A3.3 3.3 0 1 0 9.9 13.5c-.5 2.6-1.3 4-3 5.2h10.2c-1.7-1.2-2.5-2.6-3-5.2a3.3 3.3 0 1 0 1.03-6.07c.11-.36.17-.73.17-1.13A3.3 3.3 0 0 0 12 3Z" />
    </svg>
  )
}

export function ChipIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className}>
      <circle cx="32" cy="32" r="29" fill="currentColor" opacity="0.15" />
      <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="32" cy="32" r="20" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 6" />
      <circle cx="32" cy="32" r="9" fill="currentColor" />
    </svg>
  )
}

export function DiceIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="8" cy="8" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="16" cy="8" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="8" cy="16" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="16" cy="16" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function WheelIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
    </svg>
  )
}

export function ReelIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="2.5" y="4" width="19" height="16" rx="2" />
      <path d="M9 4v16M15 4v16" />
    </svg>
  )
}

export function PlinkoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <circle cx="6" cy="5" r="1.4" />
      <circle cx="12" cy="5" r="1.4" />
      <circle cx="18" cy="5" r="1.4" />
      <circle cx="9" cy="10" r="1.4" />
      <circle cx="15" cy="10" r="1.4" />
      <circle cx="6" cy="15" r="1.4" />
      <circle cx="12" cy="15" r="1.4" />
      <circle cx="18" cy="15" r="1.4" />
      <path d="M12 15v6l-2-2m2 2 2-2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
