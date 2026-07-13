'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'motion/react'

interface FadeUpWhenVisibleProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export default function FadeUpWhenVisible({
  children,
  delay = 0,
  className,
}: FadeUpWhenVisibleProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
  }, [])

  const duration = reducedMotion ? 0 : 0.58

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 22 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
      transition={{
        duration,
        delay: reducedMotion ? 0 : delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
    >
      {children}
    </motion.div>
  )
}
