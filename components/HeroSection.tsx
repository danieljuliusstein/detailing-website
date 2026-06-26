'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { SITE } from '@/lib/content'
import { bookingPageUrl, fetchAvailability, type AvailabilitySlot } from '@/lib/api'

export function HeroSection() {
  return (
    <section className="hero">
      <div className="container">
        <div>
          <p className="eyebrow">Premium mobile detailing · {SITE.location}</p>
          <h1 className="hero-head">Your car deserves better care.</h1>
          <p className="lead hero-sub">
            Professional interior and exterior detailing at your location — no shop drop-off, no
            waiting room. Book online and we handle the rest.
          </p>
          <div className="hero-ctas">
            <a href={bookingPageUrl()} className="btn btn-primary">
              Book an appointment →
            </a>
            <Link href="/services" className="btn btn-secondary">
              View services
            </Link>
          </div>
          <div className="chip-row">
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
          </div>
        </div>
        <HeroCalendarWidget />
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
    <div className="cal-widget" id="book">
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
