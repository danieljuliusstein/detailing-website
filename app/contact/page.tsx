import Link from 'next/link'
import { fetchBusinessInfo, bookingPageUrl } from '@/lib/api'
import { SITE } from '@/lib/content'

export const dynamic = 'force-dynamic'

export default async function ContactPage() {
  let phone = SITE.phone
  let email = SITE.email

  try {
    const res = await fetchBusinessInfo()
    if (res.business) {
      phone = res.business.phone || phone
      email = res.business.email || email
    }
  } catch {
    // fall back to env / static copy
  }

  const hasContact = Boolean(phone || email)

  return (
    <section className="section">
      <div className="container subpage-stack">
        <p className="eyebrow">Contact</p>
        <h1>Get in touch</h1>
        <p className="lead subpage-lead">
          Prefer to book online? Use the calendar on the home page — it updates our schedule in real time.
        </p>

        <div className="card-raised contact-panel">
          {phone ? (
            <p className="contact-row">
              <span className="cal-section-label contact-label">Phone</span>
              <a href={`tel:${phone.replace(/\D/g, '')}`} className="contact-value">
                {phone}
              </a>
            </p>
          ) : null}
          {email ? (
            <p className="contact-row">
              <span className="cal-section-label contact-label">Email</span>
              <a href={`mailto:${email}`} className="contact-value">
                {email}
              </a>
            </p>
          ) : null}
          {!hasContact ? (
            <p className="lead contact-empty">
              Contact details are not published yet. Book online below or check back soon.
            </p>
          ) : null}
          <p className="lead contact-location">{SITE.locationMetro}</p>
        </div>

        <p className="subpage-actions">
          <a href={bookingPageUrl()} className="btn btn-primary">
            Book online instead →
          </a>
        </p>
      </div>
    </section>
  )
}
