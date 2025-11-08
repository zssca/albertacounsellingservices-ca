import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DynamicServiceDetail from '@/components/sections/services/dynamic-service-detail';
import CTASection from '@/components/sections/cta/cta-section';
import { callToActionSection } from '@/data/homepage';
import { getServiceBySlug, getAllServiceSlugs } from '@/data/dynamic-services';
import { siteMetadata } from '@/data/site';
import { ServiceStructuredData, FAQStructuredData } from '@/components/seo/structured-data';

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllServiceSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  
  if (!service) {
    return {
      title: 'Service Not Found | Alberta Counselling Services',
      description: 'The service you are looking for could not be found.',
    };
  }

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    keywords: service.keywords,
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url: `${siteMetadata.url}/services/${service.slug}`,
      type: 'website',
      images: [
        {
          url: service.image,
          width: 1200,
          height: 630,
          alt: service.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: service.metaTitle,
      description: service.metaDescription,
      images: [service.image],
    },
    alternates: {
      canonical: `${siteMetadata.url}/services/${service.slug}`,
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <main>
      {/* JSON-LD */}
      {service && <ServiceStructuredData service={service} />}
      {service?.faq?.length ? (
        <FAQStructuredData faq={{ questions: service.faq }} />
      ) : null}

      <DynamicServiceDetail service={service!} />
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
    </main>
  );
}