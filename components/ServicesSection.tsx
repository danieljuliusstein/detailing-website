import Link from 'next/link'
import { fetchPackages, formatPrice, bookingPageUrl } from '@/lib/api'
import { ServiceIcon, serviceIconForName } from '@/components/ServiceIcon'
import { ServicesFallbackNotice } from '@/components/ServicesFallbackNotice'
import { FALLBACK_SERVICES, type ServiceDisplay } from '@/lib/content'

function packageToService(
  pkg: { id: string; name: string; base_price: number; description?: string },
  index: number
): ServiceDisplay {
  const fallback = FALLBACK_SERVICES.find((s) => s.name.toLowerCase() === pkg.name.toLowerCase())
  const barFills = [100, 60, 35, 80]
  return {
    id: pkg.id,
    icon: fallback?.icon ?? serviceIconForName(pkg.name),
    name: pkg.name,
    description: pkg.description ?? fallback?.description ?? '',
    priceLabel: `From ${formatPrice(pkg.base_price)}`,
    barFill: fallback?.barFill ?? barFills[index % barFills.length],
    badge: index === 0 ? { text: 'Most popular', variant: 'green' } : fallback?.badge,
  }
}

export async function ServicesSection() {
  let services = FALLBACK_SERVICES
  let usingFallback = true

  try {
    const res = await fetchPackages()
    if (res.packages.length > 0) {
      usingFallback = false
      services = res.packages.slice(0, 3).map(packageToService)
    }
  } catch {
    // use fallback
  }

  return (
    <section className="section" id="services">
      <div className="container">
        <p className="eyebrow">Services & pricing</p>
        <h2>Everything your car needs.</h2>
        {usingFallback ? <ServicesFallbackNotice /> : null}
        <div className="services-grid">
          {services.map((service) => (
            <article key={service.id} className="service-card">
              <ServiceIcon name={service.icon} />
              <h3 className="service-name">{service.name}</h3>
              <p className="service-desc">{service.description}</p>
              <p className="service-price">{service.priceLabel}</p>
              {service.badge ? (
                <p style={{ marginTop: 10 }}>
                  <span className={`badge badge-${service.badge.variant}`}>{service.badge.text}</span>
                </p>
              ) : null}
              <div className="service-bar">
                <div className="service-bar-fill" style={{ width: `${service.barFill}%` }} />
              </div>
            </article>
          ))}
        </div>
        <p style={{ marginTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a href={bookingPageUrl()} className="btn btn-primary">
            Book a service →
          </a>
          <Link href="/services" className="btn btn-secondary">
            All services →
          </Link>
        </p>
      </div>
    </section>
  )
}
