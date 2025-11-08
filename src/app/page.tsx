import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import HeroSection from '@/components/sections/hero/hero-section';
import { 
  heroSection, 
  servicesOverview, 
  callToActionSection,
  testimonials, 
  faqData 
} from '@/data/homepage';
import { siteMetadata } from '@/data/site';
import { SectionSkeleton } from '@/components/ui/section-skeleton';
import { FAQStructuredData, ReviewsStructuredData } from '@/components/seo/structured-data';

// Dynamic imports for better code splitting
const ServicesOverview = dynamic(
  () => import('@/components/sections/services/services-overview'),
  { 
    loading: () => <SectionSkeleton lines={3} />,
    ssr: true 
  }
);

const TestimonialsSection = dynamic(
  () => import('@/components/sections/testimonials/testimonials-section'),
  { 
    loading: () => <SectionSkeleton lines={1} />,
    ssr: true 
  }
);

const FAQSection = dynamic(
  () => import('@/components/sections/faq/faq-section'),
  { 
    loading: () => <SectionSkeleton lines={0} />,
    ssr: true 
  }
);

const CTASection = dynamic(
  () => import('@/components/sections/cta/cta-section'),
  { 
    loading: () => <SectionSkeleton lines={0} />,
    ssr: true 
  }
);

export const metadata: Metadata = {
  title: siteMetadata.pages.home.title,
  description: siteMetadata.pages.home.description,
  keywords: siteMetadata.keywords,
  openGraph: {
    title: siteMetadata.pages.home.title,
    description: siteMetadata.pages.home.description,
    url: siteMetadata.url,
    type: 'website',
  },
};

export default function Home() {
  return (
    <>
      {/* FAQ JSON-LD for rich results */}
      <FAQStructuredData faq={{ questions: faqData.questions }} />
      {/* Reviews JSON-LD for trust signals */}
      <ReviewsStructuredData testimonials={testimonials} />

      <HeroSection 
        headline={heroSection.headline}
        description={heroSection.description}
        cta={heroSection.cta}
        backgroundImage={heroSection.backgroundImage}
      />
      
      <CTASection 
        headline={callToActionSection.headline}
        subtitle={callToActionSection.subtitle}
        pricing={callToActionSection.pricing}
        avatar={callToActionSection.avatar}
        serviceHighlights={callToActionSection.serviceHighlights}
        trustElements={callToActionSection.trustElements}
        primaryCta={callToActionSection.primaryCta}
        supportingMessages={callToActionSection.supportingMessages}
      />
      
      <ServicesOverview 
        headline={servicesOverview.headline}
        description={servicesOverview.description}
        services={servicesOverview.services}
      />
      
      <TestimonialsSection testimonials={testimonials} />
      
      <FAQSection faqData={faqData} />
    </>
  );
}
