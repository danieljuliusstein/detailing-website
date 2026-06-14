'use client'

import { useState } from 'react'
import { businessLogoUrl } from '@/lib/api'

type BusinessLogoProps = {
  width: number
  height: number
  className?: string
}

export function BusinessLogo({ width, height, className }: BusinessLogoProps) {
  const [failed, setFailed] = useState(false)

  if (failed) return null

  return (
    <img
      src={businessLogoUrl()}
      alt=""
      width={width}
      height={height}
      className={className}
      suppressHydrationWarning
      onError={() => setFailed(true)}
    />
  )
}
