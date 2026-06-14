import Link from 'next/link'
import { SITE } from '@/lib/content'

export function GallerySection() {
  return (
    <section className="section" id="gallery">
      <div className="container">
        <p className="eyebrow">Our work</p>
        <h2>Results that speak for themselves.</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 14,
            marginTop: 36,
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="img-placeholder" style={{ aspectRatio: '16 / 10' }} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function CtaBanner() {
  return (
    <section className="section">
      <div className="container">
        <div className="cta-banner">
          <div>
            <h2>Ready to book?</h2>
            <p className="lead">
              {SITE.locationMetro} · Available 7 days a week.
            </p>
          </div>
          <div className="cta-actions">
            <Link href="/book" className="btn btn-primary">
              Book now →
            </Link>
            <Link href="/contact" className="btn btn-secondary">
              Get in touch
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
