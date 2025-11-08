"use client";

import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Service {
  id: string;
  title: string;
  buttonTitle?: string;
  description: string;
  image: string;
  specializations?: string[];
}

interface ServicesOverviewProps {
  headline: string;
  description: string;
  services: Service[];
}

export default function ServicesOverview({ headline, description, services }: ServicesOverviewProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (serviceId: string) => {
    setImageErrors(prev => ({ ...prev, [serviceId]: true }));
  };

  // Map homepage service IDs to dynamic service slugs
  const idToSlug: Record<string, string> = {
    'individual': 'individual-counselling',
    'couple-family': 'couples-family-counselling',
    'demographic': 'demographic-specific-counselling',
    'disorders': 'disorders-counselling',
    'abuse': 'trauma-abuse-counselling',
    'career': 'career-education-counselling',
    'mediation': 'mediation-consultation-counselling',
    'addictions': 'addictions-counselling',
    'other': 'other-specializations-counselling',
  };

  const getServiceHref = (id: string) => idToSlug[id] ? `/services/${idToSlug[id]}` : '/services';

  return (
    <section className="w-full py-20 bg-background custom-component no-effects">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            {headline}
          </h2>
          <p className="text-xl text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className="border overflow-hidden shadow-none flex flex-col h-full p-0">
              <div className="relative aspect-[3/2] overflow-hidden bg-muted">
                {!imageErrors[service.id] ? (
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    onError={() => handleImageError(service.id)}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={95}
                    priority={service.id === services[0]?.id}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-2">Alberta Counselling Services</div>
                      <div className="text-sm text-muted-foreground">{service.title}</div>
                    </div>
                  </div>
                )}
              </div>
              
              <CardHeader className="px-6 pt-6">
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <CardDescription className="text-base">
                  {service.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col px-6 pb-6">
                <div className="flex-1"></div>
                <div className="mt-6">
                  <Button variant="outline" className="w-full shadow-none" asChild>
                    <Link href={getServiceHref(service.id)} className="button-text-truncate-container">
                      <span className="button-text-truncate text-left flex-1">Learn More About {service.buttonTitle || service.title}</span>
                      <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link href="/services">
              View All Services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}