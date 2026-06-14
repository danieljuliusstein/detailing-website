'use client'

import { useCallback, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STOP_PCTS = [12, 37, 62, 87]
const SEGMENTS = STOP_PCTS.length - 1

const STEPS = [
  {
    num: '01',
    tag: 'Start here',
    title: 'Book online',
    desc: 'Pick your service, date, and time. Under two minutes, no account needed.',
    icon: 'ti-clock',
    detail: 'Under 2 min',
  },
  {
    num: '02',
    tag: 'Instant',
    title: 'We confirm',
    desc: 'Confirmation with your details and a morning-of reminder sent automatically.',
    icon: 'ti-mail',
    detail: 'Email + SMS',
  },
  {
    num: '03',
    tag: 'Mobile',
    title: 'We come to you',
    desc: 'Our team arrives at your home, office, or preferred spot — fully equipped.',
    icon: 'ti-map-pin',
    detail: 'Atlanta metro',
  },
  {
    num: '04',
    tag: 'Done',
    title: 'Enjoy the result',
    desc: 'Drive away renewed. Before & after photos sent automatically.',
    icon: 'ti-camera',
    detail: 'Photos included',
  },
]

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const carRef = useRef<HTMLDivElement>(null)
  const pinRefs = useRef<(HTMLDivElement | null)[]>([])
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  const bobTl = useRef<gsap.core.Timeline | null>(null)
  const parkedRef = useRef(false)
  const revealedRef = useRef(new Set<number>([0]))

  const getTrackWidth = () => trackRef.current?.offsetWidth ?? 0
  const carX = (pct: number) => (getTrackWidth() * pct) / 100 - 48
  const pinX = (pct: number) => (getTrackWidth() * pct) / 100

  const positionPins = useCallback(() => {
    STOP_PCTS.forEach((pct, i) => {
      if (pinRefs.current[i]) {
        gsap.set(pinRefs.current[i], { left: pinX(pct) })
      }
    })
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const car = carRef.current
    if (!section || !car) return

    positionPins()

    const ctx = gsap.context(() => {
      const pins = pinRefs.current.filter(Boolean) as HTMLDivElement[]
      const steps = stepRefs.current.filter(Boolean) as HTMLDivElement[]

      gsap.set(car, { x: carX(STOP_PCTS[0]), y: 0 })
      gsap.set(pins, { opacity: 0, y: -20, scaleY: 0.6 })
      gsap.set(steps, { opacity: 0, y: 8 })

      if (pins[0]) gsap.set(pins[0], { opacity: 1, y: 0, scaleY: 1 })
      if (steps[0]) gsap.set(steps[0], { opacity: 1, y: 0 })

      const bob = gsap.timeline({ repeat: -1, yoyo: true })
      bobTl.current = bob
      bob.to(car, { y: -4, duration: 0.35, ease: 'sine.inOut' })

      const revealAt = (index: number) => {
        const segStart = (index - 1) / SEGMENTS
        return segStart + (1 / SEGMENTS) * 0.35
      }

      const revealStop = (index: number) => {
        if (revealedRef.current.has(index)) return
        revealedRef.current.add(index)
        if (pins[index]) {
          gsap.to(pins[index], {
            opacity: 1,
            y: 0,
            scaleY: 1,
            duration: 0.45,
            ease: 'power2.out',
            overwrite: true,
          })
        }
        if (steps[index]) {
          gsap.to(steps[index], {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: 'power2.out',
            overwrite: true,
          })
        }
      }

      const parkCar = () => {
        if (parkedRef.current) return
        parkedRef.current = true
        bob.pause()
        gsap.to(car, { y: 0, duration: 0.3, ease: 'power2.out', overwrite: true })
        car.classList.add('car-wrap--parked')
      }

      const unparkCar = () => {
        if (!parkedRef.current) return
        parkedRef.current = false
        car.classList.remove('car-wrap--parked')
        bob.play()
      }

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom 58%',
          scrub: 0.35,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress

            for (let i = 1; i < STOP_PCTS.length; i++) {
              if (progress >= revealAt(i)) {
                revealStop(i)
              }
            }

            if (progress >= 0.98) {
              parkCar()
            } else {
              unparkCar()
            }
          },
        },
      })

      const segmentDur = 1 / SEGMENTS

      for (let i = 1; i < STOP_PCTS.length; i++) {
        const segStart = (i - 1) * segmentDur

        tl.to(car, { x: carX(STOP_PCTS[i]), duration: segmentDur }, segStart)
      }
    }, section)

    const onRefresh = () => positionPins()
    ScrollTrigger.addEventListener('refreshInit', onRefresh)

    return () => {
      ScrollTrigger.removeEventListener('refreshInit', onRefresh)
      parkedRef.current = false
      revealedRef.current = new Set([0])
      bobTl.current?.kill()
      bobTl.current = null
      ctx.revert()
    }
  }, [positionPins])

  return (
    <section ref={sectionRef} className="section process-section">
      <div className="process-inner">
        <div className="container">
          <p className="eyebrow">The process</p>
          <h2 className="process-headline">
            Four steps to a <span>spotless car.</span>
          </h2>

          <div ref={trackRef} className="track-area" suppressHydrationWarning>
            <div className="ground-line" />

            {STEPS.map((_, i) => (
              <div
                key={`pin-${i}`}
                ref={(el) => {
                  pinRefs.current[i] = el
                }}
                className="pin"
              >
                <svg width="20" height="28" viewBox="0 0 20 28" fill="none" aria-hidden suppressHydrationWarning>
                  <path
                    d="M10 27 C10 27 1 17.5 1 10 C1 5.03 5.03 1 10 1 C14.97 1 19 5.03 19 10 C19 17.5 10 27 10 27Z"
                    fill="#0f1f0f"
                    stroke="var(--green)"
                    strokeWidth="1.3"
                  />
                  <circle cx="10" cy="10" r="4" fill="var(--green)" />
                </svg>
              </div>
            ))}

            <div ref={carRef} className="car-wrap">
              <div className="smoke-group">
                <div className="puff puff-a" />
                <div className="puff puff-b" />
                <div className="puff puff-c" />
              </div>
              <svg width="96" height="52" viewBox="0 0 96 52" fill="none" aria-hidden suppressHydrationWarning>
                <path
                  d="M6 32 L6 22 Q6 20 8 20 L18 20 Q20 20 22 18 L30 10 Q32 8 36 8 L60 8 Q64 8 66 10 L72 18 Q74 20 76 20 L86 20 Q88 20 88 22 L88 32 Z"
                  fill="#132213"
                  stroke="var(--green)"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
                <path
                  d="M32 10 L28 18 L54 18 L54 10 Z"
                  fill="rgba(76, 175, 80, 0.13)"
                  stroke="rgba(76, 175, 80, 0.33)"
                  strokeWidth="0.8"
                />
                <path
                  d="M56 10 L56 18 L70 18 L64 10 Z"
                  fill="rgba(76, 175, 80, 0.13)"
                  stroke="rgba(76, 175, 80, 0.33)"
                  strokeWidth="0.8"
                />
                <line x1="54" y1="18" x2="54" y2="32" stroke="rgba(76, 175, 80, 0.2)" strokeWidth="0.8" />
                <rect x="84" y="22" width="5" height="4" rx="1" fill="var(--green)" opacity="0.9" />
                <rect x="7" y="22" width="4" height="4" rx="1" fill="#ff6655" opacity="0.7" />
                <g className="wheel-rear">
                  <circle cx="22" cy="38" r="6" fill="#0a0a0a" stroke="var(--green)" strokeWidth="1.4" />
                  <circle cx="22" cy="38" r="2.5" fill="#132213" stroke="var(--green)" strokeWidth="0.8" />
                  <line x1="22" y1="33" x2="22" y2="43" stroke="var(--green)" strokeWidth="0.7" opacity="0.6" />
                  <line x1="17" y1="38" x2="27" y2="38" stroke="var(--green)" strokeWidth="0.7" opacity="0.6" />
                  <line x1="18.5" y1="34.5" x2="25.5" y2="41.5" stroke="var(--green)" strokeWidth="0.7" opacity="0.6" />
                  <line x1="18.5" y1="41.5" x2="25.5" y2="34.5" stroke="var(--green)" strokeWidth="0.7" opacity="0.6" />
                </g>
                <g className="wheel-front">
                  <circle cx="72" cy="38" r="6" fill="#0a0a0a" stroke="var(--green)" strokeWidth="1.4" />
                  <circle cx="72" cy="38" r="2.5" fill="#132213" stroke="var(--green)" strokeWidth="0.8" />
                  <line x1="72" y1="33" x2="72" y2="43" stroke="var(--green)" strokeWidth="0.7" opacity="0.6" />
                  <line x1="67" y1="38" x2="77" y2="38" stroke="var(--green)" strokeWidth="0.7" opacity="0.6" />
                  <line x1="68.5" y1="34.5" x2="75.5" y2="41.5" stroke="var(--green)" strokeWidth="0.7" opacity="0.6" />
                  <line x1="68.5" y1="41.5" x2="75.5" y2="34.5" stroke="var(--green)" strokeWidth="0.7" opacity="0.6" />
                </g>
              </svg>
            </div>
          </div>

          <div className="process-steps">
            {STEPS.map((s, i) => (
              <div
                key={s.num}
                ref={(el) => {
                  stepRefs.current[i] = el
                }}
                className="process-step"
              >
                <span className="process-step-num">{s.num}</span>
                <span className="process-step-tag">{s.tag}</span>
                <p className="process-step-title">{s.title}</p>
                <p className="process-step-desc">{s.desc}</p>
                <div className="process-step-detail">
                  <i className={`ti ${s.icon}`} aria-hidden="true" />
                  {s.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function ProcessSectionPlaceholder() {
  return (
    <section className="section process-section" aria-busy="true">
      <div className="process-inner">
        <div className="container">
          <p className="eyebrow">The process</p>
          <h2 className="process-headline">
            Four steps to a <span>spotless car.</span>
          </h2>
          <div className="track-area">
            <div className="ground-line" />
          </div>
          <div className="process-steps">
            {STEPS.map((s) => (
              <div key={s.num} className="process-step process-step--static">
                <span className="process-step-num">{s.num}</span>
                <span className="process-step-tag">{s.tag}</span>
                <p className="process-step-title">{s.title}</p>
                <p className="process-step-desc">{s.desc}</p>
                <div className="process-step-detail">
                  <i className={`ti ${s.icon}`} aria-hidden="true" />
                  {s.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

