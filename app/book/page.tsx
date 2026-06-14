'use client'

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  fetchAvailability,
  fetchPackages,
  formatPrice,
  submitBooking,
  type AvailabilitySlot,
  type PublicPackage,
} from '@/lib/api'

const VEHICLE_TYPES = [
  { id: 'sedan', label: 'Sedan' },
  { id: 'suv', label: 'SUV' },
  { id: 'truck', label: 'Truck' },
  { id: 'van', label: 'Van' },
  { id: 'other', label: 'Other' },
]

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function addDays(iso: string, days: number) {
  const d = new Date(iso + 'T12:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function BookPageContent() {
  const searchParams = useSearchParams()
  const presetDate = searchParams.get('date')?.trim() ?? ''
  const presetTime = searchParams.get('time')?.trim() ?? ''

  const [step, setStep] = useState(presetDate && presetTime ? 3 : presetDate ? 2 : 1)
  const [packages, setPackages] = useState<PublicPackage[]>([])
  const [loadingPackages, setLoadingPackages] = useState(true)
  const [packageId, setPackageId] = useState('')
  const [date, setDate] = useState(presetDate || todayIso())
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [startTime, setStartTime] = useState(presetTime)
  const [locationType, setLocationType] = useState<'mobile' | 'fixed'>('mobile')
  const [vehicleType, setVehicleType] = useState('sedan')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [confirmed, setConfirmed] = useState<{ packageName: string; date: string; startTime?: string } | null>(
    null
  )

  const selectedPackage = useMemo(
    () => packages.find((p) => p.id === packageId),
    [packages, packageId]
  )

  const minDate = todayIso()
  const maxDate = addDays(minDate, 60)

  useEffect(() => {
    let cancelled = false
    setLoadingPackages(true)
    fetchPackages()
      .then((res) => {
        if (cancelled) return
        setPackages(res.packages)
        if (res.packages.length === 1) setPackageId(res.packages[0].id)
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load packages')
      })
      .finally(() => {
        if (!cancelled) setLoadingPackages(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const loadSlots = useCallback(async (d: string) => {
    setLoadingSlots(true)
    setError('')
    try {
      const res = await fetchAvailability(d)
      setSlots(res.slots)
      if (!presetTime) setStartTime('')
    } catch (e) {
      setSlots([])
      setError(e instanceof Error ? e.message : 'Could not load availability')
    } finally {
      setLoadingSlots(false)
    }
  }, [presetTime])

  useEffect(() => {
    if (step >= 2 && date) loadSlots(date)
  }, [step, date, loadSlots])

  async function handleSubmit() {
    setError('')
    setSubmitting(true)
    try {
      const res = await submitBooking({
        packageId,
        date,
        startTime,
        locationType,
        vehicleType,
        name,
        phone,
        email: email || undefined,
        address: address || undefined,
        notes: notes || undefined,
      })
      if (res.booking) {
        setConfirmed({
          packageName: res.booking.packageName,
          date: res.booking.date,
          startTime: res.booking.startTime,
        })
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Booking failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (confirmed) {
    return (
      <div className="container book-page-header">
        <p className="eyebrow">Confirmed</p>
        <div className="success-banner">
          <h1 style={{ fontSize: 24, marginBottom: 8 }}>You&apos;re booked</h1>
          <p>
            {confirmed.packageName} on {confirmed.date}
            {confirmed.startTime ? ` at ${confirmed.startTime}` : ''}.
          </p>
          <p className="lead" style={{ marginTop: 8 }}>
            We&apos;ll confirm details by phone or email if needed.
          </p>
        </div>
      </div>
    )
  }

  const stepLabel =
    step === 1 ? 'Choose service' : step === 2 ? 'Date & time' : 'Your details'

  return (
    <div className="container book-page-header">
      <p className="eyebrow">Book online</p>
      <h1>Schedule a detail</h1>
      <p className="lead" style={{ marginBottom: 28 }}>
        Step {step} of 3 — {stepLabel}
      </p>

      {error ? <div className="error-banner">{error}</div> : null}

      {step === 1 ? (
        <section className="card-raised book-step-card">
          {loadingPackages ? (
            <p className="lead">Loading packages…</p>
          ) : packages.length === 0 ? (
            <p className="lead">
              Packages could not be loaded from the operator app. Ensure PocketBase is running and active
              packages exist in the admin app, then refresh.
            </p>
          ) : (
            <div className="book-package-list">
              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  type="button"
                  className={`book-package-option${packageId === pkg.id ? ' active' : ''}`}
                  onClick={() => setPackageId(pkg.id)}
                >
                  <h3 className="service-name">{pkg.name}</h3>
                  {pkg.description ? <p className="service-desc">{pkg.description}</p> : null}
                  <p className="service-price">{formatPrice(pkg.base_price)}</p>
                </button>
              ))}
            </div>
          )}
          <div className="book-step-actions book-step-actions--end">
            <button type="button" className="btn btn-primary" disabled={!packageId} onClick={() => setStep(2)}>
              Continue →
            </button>
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="card-raised book-step-card">
          <div className="field">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              min={minDate}
              max={maxDate}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <p className="cal-section-label">Available times</p>
          {loadingSlots ? (
            <p className="lead">Loading times…</p>
          ) : (
            <div className="slots-grid">
              {slots.map((slot) => {
                const className = [
                  'slot',
                  !slot.available ? 'taken' : '',
                  startTime === slot.time ? 'active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')
                if (!slot.available) {
                  return (
                    <span key={slot.time} className={className}>
                      {slot.label}
                    </span>
                  )
                }
                return (
                  <button key={slot.time} type="button" className={className} onClick={() => setStartTime(slot.time)}>
                    {slot.label}
                  </button>
                )
              })}
            </div>
          )}

          {selectedPackage ? (
            <p className="book-summary">
              {selectedPackage.name} · {formatPrice(selectedPackage.base_price)}
            </p>
          ) : null}

          <div className="book-step-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
              Back
            </button>
            <button type="button" className="btn btn-primary" disabled={!startTime} onClick={() => setStep(3)}>
              Continue →
            </button>
          </div>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="card-raised book-step-card">
          {date && startTime ? (
            <p className="cal-section-label" style={{ marginBottom: 14 }}>
              {date} · {startTime}
            </p>
          ) : null}
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="phone">Phone</label>
            <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="email">Email (optional)</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="address">Service address</label>
            <input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street, city"
            />
          </div>
          <div className="field">
            <label htmlFor="vehicle">Vehicle type</label>
            <select id="vehicle" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
              {VEHICLE_TYPES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Location</label>
            <div className="chip-row">
              {(['mobile', 'fixed'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`chip${locationType === type ? ' active' : ''}`}
                  onClick={() => setLocationType(type)}
                >
                  {type === 'mobile' ? 'Mobile (we come to you)' : 'Fixed location'}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <label htmlFor="notes">Notes (optional)</label>
            <textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <div className="book-step-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>
              Back
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={submitting || !name.trim() || !phone.trim() || !packageId}
              onClick={handleSubmit}
            >
              {submitting ? 'Booking…' : 'Confirm booking →'}
            </button>
          </div>
        </section>
      ) : null}
    </div>
  )
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="container book-page-header"><p className="lead">Loading…</p></div>}>
      <BookPageContent />
    </Suspense>
  )
}
