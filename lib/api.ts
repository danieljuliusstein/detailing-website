const API_BASE = (process.env.NEXT_PUBLIC_APP_API_URL ?? 'http://localhost:3000').replace(/\/$/, '')
const BOOKING_SLUG = (process.env.NEXT_PUBLIC_BOOKING_SLUG ?? 'atlas-detailing').trim()

export function bookingSlug() {
  return BOOKING_SLUG
}

/** Full URL to the operator app booking page (`/book/{slug}`). */
export function bookingPageUrl(params?: Record<string, string>) {
  const base = `${API_BASE}/book/${encodeURIComponent(BOOKING_SLUG)}`
  if (!params || Object.keys(params).length === 0) return base
  const qs = new URLSearchParams(params).toString()
  return `${base}?${qs}`
}

function publicApi(path: string) {
  return `${API_BASE}/api/public/${encodeURIComponent(BOOKING_SLUG)}${path}`
}

export function appApiUrl(path = '') {
  return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`
}

export function businessLogoUrl() {
  return appApiUrl('/api/business-logo')
}

export interface PublicPackage {
  id: string
  name: string
  base_price: number
  description?: string
}

export interface AvailabilitySlot {
  time: string
  label: string
  available: boolean
}

export interface BookingPayload {
  packageId: string
  date: string
  startTime: string
  locationType: 'mobile' | 'fixed'
  vehicleType: string
  name: string
  phone: string
  email?: string
  address?: string
  notes?: string
}

export interface PublicBusinessInfo {
  name: string
  phone: string
  email: string
  address: string
}

export interface BookingResult {
  ok: boolean
  booking?: {
    jobId: string
    clientId: string
    date: string
    startTime?: string
    packageName: string
    clientName: string
  }
  error?: string
}

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(path.startsWith('http') ? path : `${API_BASE}${path}`, { cache: 'no-store' })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Request failed')
  return data as T
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Request failed')
  return data as T
}

export function fetchPackages() {
  return apiGet<{ packages: PublicPackage[] }>(publicApi('/packages'))
}

export function fetchBusinessInfo() {
  return apiGet<{ business: PublicBusinessInfo | null }>(publicApi('/business'))
}

export function fetchAvailability(date: string, packageId?: string) {
  const qs = new URLSearchParams({ date })
  if (packageId) qs.set('packageId', packageId)
  return apiGet<{ date: string; slots: AvailabilitySlot[] }>(
    `${publicApi('/availability')}?${qs.toString()}`
  )
}

export function submitBooking(payload: BookingPayload) {
  return apiPost<BookingResult>(publicApi('/booking'), payload)
}

export function formatPrice(centsOrDollars: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(centsOrDollars)
}
