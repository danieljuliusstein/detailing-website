'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Cubic ease-out: starts fast, decelerates to a stop.
 * easing(0) = 0, easing(1) = 1
 */
export const easeOut = (p: number): number => 1 - Math.pow(1 - p, 3)

/**
 * Animates a number from 0 to `target` over `duration` milliseconds,
 * using a cubic ease-out curve.
 *
 * @param target   The value to count up to.
 * @param duration Animation duration in ms. Default: 1200.
 * @param active   When false, returns 0 immediately without animating.
 *                 When target === 0, returns 0 immediately.
 * @returns        The current animated value in the range [0, target].
 */
export function useCountUp(
  target: number,
  duration: number = 1200,
  active: boolean = true,
): number {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    // Cancel any in-flight animation before starting a new one
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    startTimeRef.current = null

    // Short-circuit cases
    if (!active) {
      setValue(0)
      return
    }

    if (target === 0) {
      setValue(0)
      return
    }

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp
      }

      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOut(progress)

      setValue(Math.round(easedProgress * target))

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        rafRef.current = null
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [target, duration, active])

  return value
}
