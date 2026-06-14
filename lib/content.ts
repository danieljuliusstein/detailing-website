export type ServiceIconName = 'full' | 'interior' | 'exterior' | 'default'

export const SITE = {
  name: 'Atlas Detailing',
  location: 'Atlanta, GA',
  locationMetro: 'Atlanta metro area',
  owner: 'Daniel Stein',
  personalSite: process.env.NEXT_PUBLIC_PERSONAL_SITE_URL ?? 'https://danieljuliusstein.com',
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE ?? '@atlasdetailing',
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? '',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? '',
}

export interface ServiceDisplay {
  id: string
  icon: ServiceIconName
  name: string
  description: string
  priceLabel: string
  barFill: number
  badge?: { text: string; variant: 'green' | 'blue' }
}

export const FALLBACK_SERVICES: ServiceDisplay[] = [
  {
    id: 'full-detail',
    icon: 'full',
    name: 'Full Detail',
    description:
      'Interior deep clean + exterior hand wash, clay bar, wax, tire dressing. 4–6 hrs.',
    priceLabel: 'From $250',
    barFill: 100,
    badge: { text: 'Most popular', variant: 'green' },
  },
  {
    id: 'interior-detail',
    icon: 'interior',
    name: 'Interior Detail',
    description: 'Vacuum, seat shampoo, steam clean, leather conditioning. 2–3 hrs.',
    priceLabel: 'From $130',
    barFill: 60,
  },
  {
    id: 'exterior-wash',
    icon: 'exterior',
    name: 'Exterior Wash & Wax',
    description: 'Hand wash, dry, wax, wheel clean, tire shine. 1.5 hrs.',
    priceLabel: 'From $75',
    barFill: 35,
  },
]

export const STEPS = [
  {
    num: '01',
    title: 'Book online',
    desc: 'Pick your service, date, and time. Takes under two minutes.',
  },
  {
    num: '02',
    title: 'We confirm',
    desc: 'You receive a confirmation with your appointment details.',
  },
  {
    num: '03',
    title: 'We come to you',
    desc: 'Mobile service at your home, office, or preferred location.',
  },
  {
    num: '04',
    title: 'Enjoy the result',
    desc: 'Drive away with a vehicle that looks and feels renewed.',
  },
]

export const REVIEWS = [
  {
    text: 'My SUV looked brand new inside and out. Professional, on time, and thorough on every surface.',
    author: 'Marcus T.',
    vehicle: '2021 BMW X5',
  },
  {
    text: 'Booked online on a Sunday and they were at my driveway Tuesday morning. Easiest detail I have ever scheduled.',
    author: 'Sarah K.',
    vehicle: '2019 Tesla Model 3',
  },
  {
    text: 'The interior detail removed years of pet hair and stains I thought were permanent. Worth every dollar.',
    author: 'James R.',
    vehicle: '2020 Ford F-150',
  },
]

export const NAV_LINKS = [
  { href: '/services', label: 'Services' },
  { href: '/#gallery', label: 'Gallery' },
  { href: '/#services', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
]
