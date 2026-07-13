'use client'

import { useEffect } from 'react'
import posthog from 'posthog-js'

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim()
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() || 'https://us.i.posthog.com'

let started = false

export function PostHogInit() {
  useEffect(() => {
    if (!key || started) return
    started = true
    posthog.init(key, {
      api_host: host,
      person_profiles: 'identified_only',
      capture_pageview: true,
      capture_pageleave: true,
    })
    posthog.capture('waitlist_page_view')
  }, [])

  return null
}
