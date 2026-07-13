'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'motion/react'
import { bookingPageUrl, fetchAvailability, type AvailabilitySlot } from '@/lib/api'

// ---------------------------------------------------------------------------
// Animation helpers
// ---------------------------------------------------------------------------

function makeFadeUp(delay: number, reducedMotion: boolean) {
  return {
    initial: 'hidden',
    animate: 'show',
    variants: {
      hidden: { opacity: 0, y: 22 },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          duration: reducedMotion ? 0 : 0.58,
          delay: reducedMotion ? 0 : delay,
          ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number],
        },
      },
    },
  }
}

// ---------------------------------------------------------------------------
// HeroSection
// ---------------------------------------------------------------------------

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
  }, [])

  // Parallax: as the section scrolls out of view the calendar widget drops 60px.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const calendarY = useTransform(scrollYProgress, [0, 1], ['0px', '60px'])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
    >
      {/* Radial glow background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(76,175,80,0.15), transparent)',
        }}
      />

      {/* Grid texture overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage:
            'radial-gradient(ellipse 80% 80% at 50% 20%, black, transparent)',
          opacity: 0.4,
        }}
      />

      <div className="container relative" style={{ paddingTop: '96px', paddingBottom: '64px' }}>
        {/* Centered content column */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

          {/* Announcement badge — delay 0 */}
          <motion.div
            className="flex justify-center"
            style={{ marginBottom: '28px' }}
            {...makeFadeUp(0, reducedMotion)}
          >
            <div
              className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.03] px-4 py-1.5 rounded-full"
              style={{ fontSize: '11px', fontFamily: 'var(--font-body)', fontWeight: 500, color: 'rgba(255,255,255,0.5)' }}
            >
              <span
                className="animate-pulse rounded-full"
                style={{
                  width: '6px',
                  height: '6px',
                  background: '#4caf50',
                  flexShrink: 0,
                  display: 'inline-block',
                }}
              />
              <span className="font-mono" style={{ fontSize: '11px' }}>Now serving the Atlanta metro area</span>
            </div>
          </motion.div>

          {/* Headline — delay 0.1s */}
          <motion.h1
            className="font-extrabold tracking-tight"
            style={{
              fontSize: 'clamp(40px, 7vw, 80px)',
              lineHeight: 1.05,
              marginBottom: '24px',
              maxWidth: '900px',
            }}
            {...makeFadeUp(0.1, reducedMotion)}
          >
            <span className="block">Your car deserves</span>
            <span className="block">
              <span style={{ color: '#4caf50' }}>better care.</span>
            </span>
          </motion.h1>

          {/* Subtitle — delay 0.2s */}
          <motion.p
            className="text-white/60"
            style={{
              fontSize: 'clamp(15px, 1.6vw, 18px)',
              lineHeight: 1.7,
              maxWidth: '520px',
              marginBottom: '36px',
            }}
            {...makeFadeUp(0.2, reducedMotion)}
          >
            Professional interior and exterior detailing at your location — no shop drop-off,
            no waiting room. Book online and we handle the rest.
          </motion.p>

          {/* CTAs — delay 0.3s */}
          <motion.div
            className="hero-ctas"
            style={{ justifyContent: 'center', marginBottom: '28px' }}
            {...makeFadeUp(0.3, reducedMotion)}
          >
            <a
              href={bookingPageUrl()}
              className="btn btn-primary"
              style={{
                boxShadow: '0 0 24px rgba(76,175,80,0.35)',
                transition: 'box-shadow 0.15s, opacity 0.12s, transform 0.1s',
              }}
            >
              Book now →
            </a>
            <Link
              href="/services"
              className="btn btn-secondary"
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              View services
            </Link>
          </motion.div>

          {/* Trust chips — delay 0.4s */}
          <motion.div
            className="chip-row"
            style={{ justifyContent: 'center', marginBottom: '48px' }}
            {...makeFadeUp(0.4, reducedMotion)}
          >
            <span className="chip">
              <span className="chip-dot" />
              ★ 5.0 · 47 reviews
            </span>
            <span className="chip">
              <span className="chip-dot" />
              Fully insured
            </span>
            <span className="chip">
              <span className="chip-dot" />
              Mobile service
            </span>
          </motion.div>

          {/* Calendar widget — parallax translateY */}
          <motion.div
            style={{
              width: '100%',
              maxWidth: '440px',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: '#0D0D1A',
              boxShadow: '0 32px 80px -10px rgba(0,0,0,0.7)',
              overflow: 'hidden',
              translateY: reducedMotion ? '0px' : calendarY,
            }}
            id="book"
          >
            <HeroCalendarWidget />
          </motion.div>

        </div>
      </div>
    </section>
  )
}

function isoDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export function HeroCalendarWidget() {
  const today = todayIso()
  const initial = new Date()
  const [year, setYear] = useState(initial.getFullYear())
  const [month, setMonth] = useState(initial.getMonth())
  const [selectedDate, setSelectedDate] = useState(today)
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  const [selectedTime, setSelectedTime] = useState('')
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [shake, setShake] = useState(false)

  const monthLabel = useMemo(
    () => new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    [year, month]
  )

  const calendarCells = useMemo(() => {
    const firstDow = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells: { key: string; day?: number; date?: string; state: 'empty' | 'taken' | 'available' }[] = []

    for (let i = 0; i < firstDow; i++) {
      cells.push({ key: `e-${i}`, state: 'empty' })
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const date = isoDate(year, month, d)
      const state = date < today ? 'taken' : 'available'
      cells.push({ key: date, day: d, date, state })
    }
    return cells
  }, [year, month, today])

  const loadSlots = useCallback(async (date: string) => {
    setLoadingSlots(true)
    setSelectedTime('')
    try {
      const res = await fetchAvailability(date)
      setSlots(res.slots)
    } catch {
      setSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }, [])

  useEffect(() => {
    if (selectedDate) loadSlots(selectedDate)
  }, [selectedDate, loadSlots])

  function prevMonth() {
    if (month === 0) {
      setMonth(11)
      setYear((y) => y - 1)
    } else {
      setMonth((m) => m - 1)
    }
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0)
      setYear((y) => y + 1)
    } else {
      setMonth((m) => m + 1)
    }
  }

  function selectDay(date: string) {
    setSelectedDate(date)
  }

  function formatSlotLabel(date: string) {
    const dt = new Date(date + 'T12:00:00')
    return dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  function handleBookSlot() {
    if (!selectedDate || !selectedTime) {
      setShake(true)
      window.setTimeout(() => setShake(false), 400)
      return
    }
    const params = new URLSearchParams({ date: selectedDate, time: selectedTime })
    window.location.href = bookingPageUrl(Object.fromEntries(params))
  }

  return (
    <div className="cal-widget" style={{ background: 'transparent', border: 'none', borderRadius: 0 }}>
      <div className="cal-header">
        <button type="button" className="cal-arrow" onClick={prevMonth} aria-label="Previous month">
          ‹
        </button>
        <span className="cal-title">{monthLabel}</span>
        <button type="button" className="cal-arrow" onClick={nextMonth} aria-label="Next month">
          ›
        </button>
      </div>

      <div className="cal-grid">
        {DAY_LABELS.map((label) => (
          <span key={label} className="cal-day-label">
            {label}
          </span>
        ))}
        {calendarCells.map((cell) => {
          if (cell.state === 'empty' || !cell.day || !cell.date) {
            return <span key={cell.key} className="cal-day empty" />
          }
          const isSelected = cell.date === selectedDate
          const className = [
            'cal-day',
            cell.state,
            isSelected ? 'selected' : '',
          ]
            .filter(Boolean)
            .join(' ')
          if (cell.state === 'taken') {
            return (
              <span key={cell.key} className={className}>
                {cell.day}
              </span>
            )
          }
          return (
            <button key={cell.key} type="button" className={className} onClick={() => selectDay(cell.date!)}>
              {cell.day}
            </button>
          )
        })}
      </div>

      <p className="cal-section-label">
        {loadingSlots ? 'Loading times…' : `Available times · ${formatSlotLabel(selectedDate)}`}
      </p>
      <div className="slots-grid">
        {slots.length === 0 && !loadingSlots ? (
          <span className="slot taken" style={{ gridColumn: '1 / -1' }}>
            No slots configured
          </span>
        ) : (
          slots.map((slot) => {
            const className = [
              'slot',
              !slot.available ? 'taken' : '',
              selectedTime === slot.time ? 'active' : '',
            ]
              .filter(Boolean)
              .join(' ')
            if (!slot.available) {
              return (
                <span key={slot.time} className={className}>
                  {slot.label} · taken
                </span>
              )
            }
            return (
              <button
                key={slot.time}
                type="button"
                className={className}
                onClick={() => setSelectedTime(slot.time)}
              >
                {slot.label}
              </button>
            )
          })
        )}
      </div>

      <button
        type="button"
        className={`btn btn-primary btn-full${shake ? ' shake' : ''}`}
        onClick={handleBookSlot}
      >
        Book this slot →
      </button>
    </div>
  )
}
