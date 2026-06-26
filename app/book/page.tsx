import { redirect } from 'next/navigation'
import { bookingPageUrl } from '@/lib/api'

export default async function BookRedirectPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const query: Record<string, string> = {}
  for (const [key, value] of Object.entries(sp)) {
    if (typeof value === 'string' && value) query[key] = value
  }
  redirect(bookingPageUrl(Object.keys(query).length ? query : undefined))
}
