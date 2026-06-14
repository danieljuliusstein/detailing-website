'use client'

import dynamic from 'next/dynamic'
import { ProcessSectionPlaceholder } from '@/components/ProcessSection'

const ProcessSection = dynamic(
  () => import('@/components/ProcessSection').then((m) => m.ProcessSection),
  {
    ssr: false,
    loading: () => <ProcessSectionPlaceholder />,
  }
)

export function ProcessSectionLoader() {
  return <ProcessSection />
}
