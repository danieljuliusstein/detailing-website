'use client'

import { useRef } from 'react'
import { useInView } from 'motion/react'
import { useCountUp } from '@/hooks/useCountUp'

interface Stat {
  target: number
  format: (v: number) => string
  label: string
  sub: string
  static?: boolean
  staticValue?: string
}

const STATS: Stat[] = [
  {
    target: 47,
    format: (v) => `${v}+`,
    label: 'Google reviews',
    sub: 'Across all reviews',
  },
  {
    target: 50,
    format: (v) => `${(v / 10).toFixed(1)}★`,
    label: 'Star rating',
    sub: '5.0 average rating',
  },
  {
    target: 0,
    format: () => 'Atlanta metro',
    label: 'Service area',
    sub: 'Mobile — we come to you',
    static: true,
    staticValue: 'Atlanta metro',
  },
]

function StatCell({
  stat,
  active,
}: {
  stat: Stat
  active: boolean
}) {
  const count = useCountUp(stat.target, 1200, active && !stat.static)
  const display = stat.static ? stat.staticValue! : stat.format(count)

  return (
    <div className="flex flex-col items-center text-center py-8 px-6">
      <span className="font-mono text-4xl lg:text-5xl font-bold text-white">
        {display}
      </span>
      <span className="text-sm text-white/40 mt-2">{stat.label}</span>
      <span className="text-xs text-white/25 mt-1">{stat.sub}</span>
    </div>
  )
}

export default function StatsBar() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="border-y border-white/6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/6">
        {STATS.map((stat) => (
          <StatCell key={stat.label} stat={stat} active={isInView} />
        ))}
      </div>
    </section>
  )
}
