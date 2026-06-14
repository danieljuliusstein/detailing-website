import type { ReactNode } from 'react'
import type { ServiceIconName } from '@/lib/content'

const ICONS: Record<ServiceIconName, ReactNode> = {
  full: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3.5 14.2 9H20l-4.8 3.5 1.8 5.5L12 14.8 7 18l1.8-5.5L4 9h5.8L12 3.5Z"
        fill="currentColor"
      />
    </svg>
  ),
  interior: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 9h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Zm1-3h10a2 2 0 0 1 2 2v1H5V8a2 2 0 0 1 2-2Z"
        fill="currentColor"
      />
    </svg>
  ),
  exterior: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21.5c4.2-3.2 6.5-6.8 6.5-11a6.5 6.5 0 1 0-13 0c0 4.2 2.3 7.8 6.5 11Z"
        fill="currentColor"
      />
    </svg>
  ),
  default: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 11h14l-1.2 5.5a1.5 1.5 0 0 1-1.5 1.2H7.7a1.5 1.5 0 0 1-1.5-1.2L5 11Zm1.5-4h11L18 9H6l.5-2ZM7.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm9 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
        fill="currentColor"
      />
    </svg>
  ),
}

export function ServiceIcon({ name }: { name: ServiceIconName }) {
  return <span className="service-icon">{ICONS[name] ?? ICONS.default}</span>
}

export function serviceIconForName(name: string): ServiceIconName {
  const n = name.toLowerCase()
  if (n.includes('full')) return 'full'
  if (n.includes('interior')) return 'interior'
  if (n.includes('exterior') || n.includes('wash') || n.includes('wax')) return 'exterior'
  return 'default'
}
