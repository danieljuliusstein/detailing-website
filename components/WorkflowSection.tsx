'use client'

/**
 * WorkflowSection — Task 5.1
 *
 * Exports four step mockup sub-components plus a placeholder WorkflowSection.
 * The full sticky-scroll layout is implemented in Task 5.2.
 *
 * All blue-600 / blue-400 values from the reference design are replaced with
 * #4caf50 (green) throughout.
 */

import { Car, MapPin, Camera, CheckCircle, Navigation } from 'lucide-react'

// ─── Card shell constant ──────────────────────────────────────────────────────

const CARD_STYLE: React.CSSProperties = {
  borderRadius: '16px',
  overflow: 'hidden',
  border: '1px solid rgba(255,255,255,0.08)',
  background: '#0D0D1A',
  boxShadow: '0 30px 80px -10px rgba(0,0,0,0.7)',
  width: '100%',
}

// ─── BookingMockup ────────────────────────────────────────────────────────────

/**
 * Step 1 — "Book online"
 * Form card showing a booking being created with Atlas Detailing content.
 */
export function BookingMockup() {
  const fields: [string, string][] = [
    ['Service', 'Full Detail'],
    ['Date', 'Thursday, June 12'],
    ['Time', '10:00 AM'],
    ['Vehicle', '2022 Tesla Model S'],
  ]

  return (
    <div style={{ ...CARD_STYLE, maxWidth: '340px' }}>
      {/* Header */}
      <div
        style={{
          padding: '14px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'rgba(76,175,80,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Car size={13} style={{ color: '#4caf50' }} />
        </div>
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>New Booking</span>
        <span
          style={{
            marginLeft: 'auto',
            fontSize: '10px',
            fontFamily: 'monospace',
            color: '#4caf50',
            background: 'rgba(76,175,80,0.1)',
            padding: '2px 8px',
            borderRadius: '9999px',
          }}
        >
          Live
        </span>
      </div>

      {/* Fields */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {fields.map(([label, value]) => (
          <div
            key={label}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <span
              style={{
                fontSize: '11px',
                color: 'rgba(255,255,255,0.35)',
                fontFamily: 'monospace',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {label}
            </span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{value}</span>
          </div>
        ))}

        {/* Divider + price */}
        <div
          style={{
            paddingTop: '10px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              color: 'rgba(255,255,255,0.35)',
              fontFamily: 'monospace',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Estimate
          </span>
          <span
            style={{ fontSize: '16px', fontWeight: 700, color: '#4caf50', fontFamily: 'monospace' }}
          >
            $250.00
          </span>
        </div>

        {/* CTA button */}
        <button
          type="button"
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '12px',
            background: '#4caf50',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            marginTop: '4px',
          }}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  )
}

// ─── CalendarMockup ───────────────────────────────────────────────────────────

/**
 * Step 2 — "We confirm"
 * Week calendar with the new Tesla booking highlighted in green.
 */
export function CalendarMockup() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dates = [9, 10, 11, 12, 13, 14]

  const existing = [
    { day: 0, label: 'BMW M4',      color: '#7C3AED' },
    { day: 0, label: 'Porsche 911', color: '#2563EB' },
    { day: 1, label: 'Audi RS7',    color: '#0891B2' },
    { day: 2, label: 'Ranger Rov.', color: '#059669' },
    { day: 2, label: 'Merc AMG',    color: '#7C3AED' },
    { day: 4, label: 'F-150',       color: '#EA580C' },
    { day: 5, label: 'Corvette',    color: '#CA8A04' },
    { day: 5, label: 'Mustang GT',  color: '#DB2777' },
  ]

  // Thursday (index 3) is the highlighted new booking
  const HIGHLIGHT_COL = 3

  return (
    <div style={{ ...CARD_STYLE, maxWidth: '440px' }}>
      {/* Header */}
      <div
        style={{
          padding: '12px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>June 9–14, 2025</span>
        <span
          style={{ fontSize: '10px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)' }}
        >
          Week view
        </span>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Day headers */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '4px',
            marginBottom: '12px',
          }}
        >
          {days.map((d, i) => (
            <div
              key={d}
              style={{
                textAlign: 'center',
                padding: '6px 2px',
                borderRadius: '8px',
                background: i === HIGHLIGHT_COL ? 'rgba(76,175,80,0.15)' : 'transparent',
              }}
            >
              <div
                style={{
                  fontSize: '9px',
                  fontFamily: 'monospace',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.3)',
                }}
              >
                {d}
              </div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  marginTop: '2px',
                  color: i === HIGHLIGHT_COL ? '#4caf50' : 'rgba(255,255,255,0.7)',
                }}
              >
                {dates[i]}
              </div>
            </div>
          ))}
        </div>

        {/* Booking slots */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '4px',
            minHeight: '130px',
          }}
        >
          {days.map((_, col) => (
            <div key={col} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {existing
                .filter((j) => j.day === col)
                .map((job, ji) => (
                  <div
                    key={ji}
                    style={{
                      borderRadius: '6px',
                      padding: '6px',
                      background: job.color + '55',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '9px',
                        fontWeight: 600,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: job.color + 'FF',
                      }}
                    >
                      {job.label}
                    </div>
                  </div>
                ))}

              {/* New Tesla booking — highlighted in green */}
              {col === HIGHLIGHT_COL && (
                <div
                  style={{
                    borderRadius: '6px',
                    padding: '6px',
                    background: 'rgba(76,175,80,0.35)',
                    outline: '1px solid rgba(76,175,80,0.6)',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{ fontSize: '9px', fontWeight: 700, color: '#a5d6a7' }}
                  >
                    Tesla S
                  </div>
                  <div style={{ fontSize: '9px', color: 'rgba(165,214,167,0.7)' }}>
                    10 AM ✦
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── LocationMockup ───────────────────────────────────────────────────────────

/**
 * Step 3 — "We come to you"
 * Map/location card showing mobile service arriving at the customer's address.
 */
export function LocationMockup() {
  return (
    <div style={{ ...CARD_STYLE, maxWidth: '340px' }}>
      {/* Header */}
      <div
        style={{
          padding: '14px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'rgba(76,175,80,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Navigation size={13} style={{ color: '#4caf50' }} />
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>We come to you</div>
          <div
            style={{
              fontSize: '10px',
              color: 'rgba(255,255,255,0.35)',
              fontFamily: 'monospace',
              marginTop: '1px',
            }}
          >
            Mobile · Atlanta, GA
          </div>
        </div>
        {/* ETA badge */}
        <div
          style={{
            marginLeft: 'auto',
            fontSize: '10px',
            fontFamily: 'monospace',
            color: '#4caf50',
            background: 'rgba(76,175,80,0.1)',
            border: '1px solid rgba(76,175,80,0.2)',
            padding: '3px 8px',
            borderRadius: '9999px',
          }}
        >
          ETA 9:45 AM
        </div>
      </div>

      {/* Map placeholder */}
      <div
        style={{
          margin: '16px',
          borderRadius: '10px',
          height: '120px',
          background:
            'linear-gradient(135deg, rgba(76,175,80,0.04) 0%, rgba(255,255,255,0.02) 100%)',
          border: '1px solid rgba(255,255,255,0.06)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Faint grid lines to suggest a map */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Destination marker */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50% 50% 50% 0',
              transform: 'rotate(-45deg)',
              background: '#4caf50',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(76,175,80,0.5)',
            }}
          >
            <MapPin
              size={14}
              style={{ color: '#fff', transform: 'rotate(45deg)' }}
            />
          </div>
        </div>
        {/* Pulse ring */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            border: '1.5px solid rgba(76,175,80,0.3)',
          }}
        />
      </div>

      {/* Address row */}
      <div
        style={{
          padding: '0 20px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              color: 'rgba(255,255,255,0.35)',
              fontFamily: 'monospace',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Address
          </span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>
            Your driveway
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              color: 'rgba(255,255,255,0.35)',
              fontFamily: 'monospace',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Status
          </span>
          <span
            style={{
              fontSize: '11px',
              color: '#4caf50',
              background: 'rgba(76,175,80,0.1)',
              padding: '2px 8px',
              borderRadius: '9999px',
              fontFamily: 'monospace',
            }}
          >
            En route
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── ResultMockup ─────────────────────────────────────────────────────────────

/**
 * Step 4 — "Enjoy the result"
 * Before/after photo placeholder card with "Photos included" badge.
 */
export function ResultMockup() {
  return (
    <div style={{ ...CARD_STYLE, maxWidth: '340px' }}>
      {/* Header */}
      <div
        style={{
          padding: '14px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'rgba(76,175,80,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Camera size={13} style={{ color: '#4caf50' }} />
        </div>
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>
          Before &amp; After
        </span>
        {/* "Photos included" badge */}
        <div
          style={{
            marginLeft: 'auto',
            fontSize: '10px',
            fontFamily: 'monospace',
            color: '#4caf50',
            background: 'rgba(76,175,80,0.1)',
            border: '1px solid rgba(76,175,80,0.2)',
            padding: '3px 8px',
            borderRadius: '9999px',
          }}
        >
          Photos included
        </div>
      </div>

      {/* Before / After photo panels */}
      <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {/* Before */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span
            style={{
              fontSize: '9px',
              fontFamily: 'monospace',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.3)',
              textAlign: 'center',
            }}
          >
            Before
          </span>
          <div
            style={{
              height: '96px',
              borderRadius: '8px',
              background:
                'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Subtle car silhouette suggestion */}
            <div
              style={{
                width: '48px',
                height: '20px',
                borderRadius: '4px 4px 0 0',
                background: 'rgba(255,255,255,0.06)',
              }}
            />
          </div>
        </div>

        {/* After */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span
            style={{
              fontSize: '9px',
              fontFamily: 'monospace',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'rgba(76,175,80,0.8)',
              textAlign: 'center',
            }}
          >
            After
          </span>
          <div
            style={{
              height: '96px',
              borderRadius: '8px',
              background:
                'linear-gradient(160deg, rgba(76,175,80,0.08) 0%, rgba(76,175,80,0.02) 100%)',
              border: '1px solid rgba(76,175,80,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(76,175,80,0.08)',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '20px',
                borderRadius: '4px 4px 0 0',
                background: 'rgba(76,175,80,0.25)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Footer caption */}
      <div
        style={{
          padding: '0 16px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <CheckCircle size={13} style={{ color: '#4caf50', flexShrink: 0 }} />
        <span
          style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.45)',
            fontFamily: 'monospace',
          }}
        >
          Before &amp; After sent automatically
        </span>
      </div>
    </div>
  )
}

// ─── Placeholder WorkflowSection ─────────────────────────────────────────────
// Full sticky-scroll layout is implemented in Task 5.2.

export function WorkflowSection() {
  return null
}
