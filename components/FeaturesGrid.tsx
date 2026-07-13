'use client'

import { useState } from 'react'
import { Car, Shield, Calendar, Bell, Camera, Star } from 'lucide-react'
import FadeUpWhenVisible from '@/components/FadeUpWhenVisible'

interface FeatureCard {
  title: string
  description: string
  icon: React.ElementType
  colSpan: string
}

const FEATURES: FeatureCard[] = [
  {
    title: 'Mobile Service',
    description: 'We come to your home, office, or wherever is convenient. No drop-off, no waiting room.',
    icon: Car,
    colSpan: 'md:col-span-2',
  },
  {
    title: 'Fully Insured',
    description: 'Every job is backed by full liability insurance for your peace of mind.',
    icon: Shield,
    colSpan: 'md:col-span-1',
  },
  {
    title: 'Online Booking',
    description: 'Pick your service, date, and time in minutes — available 24/7.',
    icon: Calendar,
    colSpan: 'md:col-span-1',
  },
  {
    title: 'Instant Confirmation',
    description: 'Get a booking confirmation immediately after you schedule.',
    icon: Bell,
    colSpan: 'md:col-span-1',
  },
  {
    title: 'Before & After Photos',
    description: 'Every detail job includes a photo set so you can see the transformation.',
    icon: Camera,
    colSpan: 'md:col-span-1',
  },
  {
    title: '5-Star Rated',
    description: 'Over 47 Google reviews with a perfect 5.0 average across the Atlanta metro.',
    icon: Star,
    colSpan: 'md:col-span-2',
  },
]

function FeatureCardItem({ feature, index }: { feature: FeatureCard; index: number }) {
  const [hovered, setHovered] = useState(false)
  const Icon = feature.icon

  return (
    <FadeUpWhenVisible delay={index * 0.06} className={`col-span-1 ${feature.colSpan}`}>
      <div
        className="relative overflow-hidden rounded-2xl border border-white/[0.06] p-6 transition-all bg-white/[0.02] hover:bg-white/[0.04] h-full"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Hover radial gradient overlay */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background:
              'radial-gradient(circle at 50% 0%, rgba(76,175,80,0.08), transparent 70%)',
            opacity: hovered ? 1 : 0,
          }}
        />

        {/* Icon */}
        <div
          className="relative mb-4 inline-flex items-center justify-center rounded-lg"
          style={{
            width: '40px',
            height: '40px',
            background: 'rgba(76,175,80,0.10)',
            border: '1px solid rgba(76,175,80,0.18)',
          }}
        >
          <Icon size={18} style={{ color: '#4caf50' }} />
        </div>

        {/* Title */}
        <p
          className="relative font-bold"
          style={{ fontSize: '15px', marginBottom: '6px', color: 'rgba(255,255,255,0.92)' }}
        >
          {feature.title}
        </p>

        {/* Description */}
        <p
          className="relative"
          style={{ fontSize: '13.5px', lineHeight: 1.65, color: 'rgba(255,255,255,0.45)' }}
        >
          {feature.description}
        </p>
      </div>
    </FadeUpWhenVisible>
  )
}

export function FeaturesGrid() {
  return (
    <section className="section">
      <div className="container">
        {/* Eyebrow + heading */}
        <FadeUpWhenVisible>
          <p
            className="font-mono"
            style={{
              fontSize: '11px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#4caf50',
              marginBottom: '12px',
            }}
          >
            Why Atlas
          </p>
        </FadeUpWhenVisible>
        <FadeUpWhenVisible delay={0.05}>
          <h2
            className="font-bold tracking-tight"
            style={{
              fontSize: 'clamp(28px, 4vw, 42px)',
              lineHeight: 1.15,
              marginBottom: '40px',
              maxWidth: '520px',
              color: 'rgba(255,255,255,0.92)',
            }}
          >
            Everything included, nothing to figure out.
          </h2>
        </FadeUpWhenVisible>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURES.map((feature, i) => (
            <FeatureCardItem key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
