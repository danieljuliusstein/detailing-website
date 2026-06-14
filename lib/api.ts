const API_BASE = (process.env.NEXT_PUBLIC_APP_API_URL ?? 'http://localhost:3000').replace(/\/$/, '')

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
  const res = await fetch(`${API_BASE}${path}`, { cache: 'no-store' })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Request failed')
  return data as T
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Request failed')
  return data as T
}

export function fetchPackages() {
  return apiGet<{ packages: PublicPackage[] }>('/api/public/packages')
}

export function fetchBusinessInfo() {
  return apiGet<{ business: PublicBusinessInfo | null }>('/api/public/business')
}

export function fetchAvailability(date: string) {
  return apiGet<{ date: string; slots: AvailabilitySlot[] }>(
    `/api/public/availability?date=${encodeURIComponent(date)}`
  )
}

export function submitBooking(payload: BookingPayload) {
  return apiPost<BookingResult>('/api/public/booking', payload)
}

export function formatPrice(centsOrDollars: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(centsOrDollars)
}
