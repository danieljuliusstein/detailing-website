import { CtaBanner, GallerySection } from '@/components/CtaBanner'
import { HeroSection } from '@/components/HeroSection'
import { ProcessSectionLoader } from '@/components/ProcessSectionLoader'
import { ReviewsSection } from '@/components/ReviewsSection'
import { ServicesSection } from '@/components/ServicesSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <ProcessSectionLoader />
      <GallerySection />
      <ReviewsSection />
      <CtaBanner />
    </>
  )
}
