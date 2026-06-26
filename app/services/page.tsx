import Link from 'next/link'
import { fetchPackages, formatPrice, bookingPageUrl } from '@/lib/api'
import { ServiceIcon, serviceIconForName } from '@/components/ServiceIcon'
import { FALLBACK_SERVICES } from '@/lib/content'

export const dynamic = 'force-dynamic'

export default async function ServicesPage() {
  let items = [...FALLBACK_SERVICES]
  let loadError = ''
  let usingFallback = true

  try {
    const res = await fetchPackages()
    if (res.packages.length > 0) {
      usingFallback = false
      items = res.packages.map((pkg, i) => {
        const fallback = FALLBACK_SERVICES[i]
        return {
          id: pkg.id,
          icon: fallback?.icon ?? serviceIconForName(pkg.name),
          name: pkg.name,
          description: pkg.description ?? fallback?.description ?? '',
          priceLabel: `From ${formatPrice(pkg.base_price)}`,
          badge: i === 0 ? { text: 'Most popular', variant: 'green' as const } : fallback?.badge,
          barFill: 0,
        }
      })
    }
  } catch (e) {
    loadError = e instanceof Error ? e.message : 'Could not load services'
  }

  return (
    <section className="section">
      <div className="container subpage-stack subpage-stack--wide">
        <p className="eyebrow">Services & pricing</p>
        <h1>Everything your car needs.</h1>
        <p className="lead subpage-lead">
          Packages synced from our operator app — what you see here is what we offer today.
        </p>

        {loadError ? <div className="error-banner">{loadError}</div> : null}
        {!loadError && usingFallback ? (
          <div className="error-banner">
            Showing sample pricing — live packages could not be loaded from the operator app. Check that
            PocketBase is running and packages are active in the admin app.
          </div>
        ) : null}

        <div className="services-grid services-grid--catalog">
          {items.map((item) => (
            <article key={item.id} className="service-card">
              <ServiceIcon name={item.icon} />
              <h2 className="service-name">{item.name}</h2>
              {item.description ? <p className="service-desc">{item.description}</p> : null}
              <p className="service-price">{item.priceLabel}</p>
              {item.badge ? (
                <p className="service-badge-row">
                  <span className={`badge badge-${item.badge.variant}`}>{item.badge.text}</span>
                </p>
              ) : null}
            </article>
          ))}
        </div>

        <p className="subpage-actions subpage-actions--center">
          <a href={bookingPageUrl()} className="btn btn-primary">
            Book a package →
          </a>
        </p>
      </div>
    </section>
  )
}
