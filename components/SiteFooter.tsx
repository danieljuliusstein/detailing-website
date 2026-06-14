import Link from 'next/link'
import { BusinessLogo } from '@/components/BusinessLogo'
import { NAV_LINKS, SITE } from '@/lib/content'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-brand">
          <BusinessLogo width={28} height={28} />
          <span className="footer-brand-name">{SITE.name}</span>
        </div>
        <div className="footer-links">
          {NAV_LINKS.map((link) => (
            <Link key={link.label} href={link.href} className="footer-link">
              {link.label}
            </Link>
          ))}
          <a
            href={`https://instagram.com/${SITE.instagram.replace('@', '')}`}
            className="footer-link"
            rel="noopener noreferrer"
            target="_blank"
          >
            {SITE.instagram}
          </a>
        </div>
        <p className="footer-legal">
          © {year} {SITE.name} · by {SITE.owner} ·{' '}
          <span className="footer-personal">
            <a href={SITE.personalSite} rel="noopener noreferrer" target="_blank">
              {SITE.personalSite.replace(/^https?:\/\//, '')}
            </a>
          </span>
        </p>
      </div>
    </footer>
  )
}
