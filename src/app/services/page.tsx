import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { dynamicServicesData } from '@/data/dynamic-services';
import { siteMetadata } from '@/data/site';
import CTASection from '@/components/sections/cta/cta-section';
import { callToActionSection } from '@/data/homepage';
import { ServicesItemListStructuredData } from '@/components/seo/structured-data';

export const metadata: Metadata = {
  title: siteMetadata.pages.services.title,
  description: siteMetadata.pages.services.description,
  keywords: siteMetadata.keywords,
  openGraph: {
    title: siteMetadata.pages.services.title,
    description: siteMetadata.pages.services.description,
    url: `${siteMetadata.url}/services`,
    type: 'website',
  },
};

export default function ServicesPage() {
  const services = dynamicServicesData;
  return (
    <main className="w-full">
      {/* JSON-LD */}
      <ServicesItemListStructuredData services={services} />
      <section className="w-full py-20 bg-background custom-component no-effects">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center space-y-6 mb-16">
          <Badge variant="secondary" className="px-4 py-2">
            Our Services
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Comprehensive Counselling Services
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground">
            Professional therapy and counselling services designed to support your mental health and relationship needs with over 35 years of expertise.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Card key={service.slug} id={service.slug} className="border overflow-hidden shadow-none flex flex-col h-full p-0">
              <div className="relative aspect-[3/2] overflow-hidden bg-muted">
                <Image
                  src={service.image}
                  alt={service.imageAlt || service.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  quality={95}
                  priority={index < 3}
                />
              </div>

              <CardHeader className="px-6 pt-6">
                <CardTitle className="text-xl">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {service.metaDescription}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col px-6 pb-6">
                <p className="text-sm text-muted-foreground">
                  {service.fullDescription}
                </p>
                <div className="mt-6">
                  <Button asChild variant="outline" className="w-full shadow-none">
                    <Link href={`/services/${service.slug}`} className="button-text-truncate-container">
                      <span className="button-text-truncate text-left flex-1">Learn More About {service.shortTitle}</span>
                      <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
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
        </div>
      </section>
    </main>
  );
}