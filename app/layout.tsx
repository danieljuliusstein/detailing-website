import type { Metadata, Viewport } from 'next'
import { DM_Sans } from 'next/font/google'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'
import { PostHogInit } from '@/components/PostHogInit'
import { businessLogoUrl } from '@/lib/api'
import './globals.css'

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
})

/** Syne via Google Fonts CDN — next/font was bundling the same woff2 for all weights (400–800), causing synthetic bold/stretch on h1/h2. */
const SYNE_FONT_URL =
  'https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap'

export const metadata: Metadata = {
  title: 'Atlas Detailing — Premium Mobile Car Detailing',
  description: 'Book premium mobile car detailing in Atlanta. Interior, exterior, and full details at your location.',
  icons: { icon: businessLogoUrl(), apple: businessLogoUrl() },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={dmSans.variable} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={SYNE_FONT_URL} rel="stylesheet" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"
        />
      </head>
      <body suppressHydrationWarning>
        <PostHogInit />
        <SiteNav />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
