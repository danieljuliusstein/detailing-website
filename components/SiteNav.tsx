'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BusinessLogo } from '@/components/BusinessLogo'
import { NAV_LINKS, SITE } from '@/lib/content'
import { bookingPageUrl } from '@/lib/api'

export function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="nav">
      <div className="container">
        <Link href="/" className="nav-brand" onClick={() => setMenuOpen(false)}>
          <BusinessLogo width={32} height={32} />
          <span className="nav-brand-name">{SITE.name}</span>
        </Link>

        <div className={`nav-links${menuOpen ? ' nav-links--open' : ''}`}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="nav-link"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          <a href={bookingPageUrl()} className="btn btn-primary btn-sm nav-book">
            Book now →
          </a>
          <button
            type="button"
            className="nav-menu-btn"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className={`nav-menu-icon${menuOpen ? ' nav-menu-icon--open' : ''}`} aria-hidden="true" />
          </button>
        </div>
      </div>
    </nav>
  )
}
