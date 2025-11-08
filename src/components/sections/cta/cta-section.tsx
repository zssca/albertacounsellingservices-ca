"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Phone, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CTASectionProps {
  headline: string;
  subtitle: string;
  pricing: string;
  avatar?: {
    src: string;
    alt: string;
    name: string;
    title: string;
  };
  serviceHighlights: string[];
  trustElements: string[];
  primaryCta: string;
  supportingMessages: string[];
}

export default function CTASection({
  headline,
  subtitle,
  pricing,
  avatar,
  serviceHighlights,
  trustElements,
  primaryCta,
  supportingMessages
}: CTASectionProps) {
  const phoneNumber = primaryCta.replace(' ', '').replace(/[^0-9+()-\s]/g, '');

  return (
    <section className="w-full py-20 bg-background custom-component no-effects">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-7xl mx-auto">
          <Card className="border shadow-none">
            <CardContent className="p-8 md:p-12">
              {/* Header */}
              <div className="text-center mb-8">
                <Badge variant="secondary" className="px-4 py-2 mb-4">
                  Expert Care Available
                </Badge>
                
                {/* Avatar Section */}
                {avatar && (
                   <div className="flex flex-col items-center mb-8">
                    <div className="relative w-36 h-36 mb-4 rounded-full overflow-hidden ring-4 ring-primary/20">
                      <Image
                        src={avatar.src}
                        alt={avatar.alt}
                        fill
                        className="object-cover"
                        priority
                        quality={95}
                      />
                    </div>
                    <h3 className="text-2xl font-semibold">{avatar.name}</h3>
                    <p className="text-lg text-muted-foreground">{avatar.title}</p>
                  </div>
                )}
                
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  {headline}
                </h2>
                <p className="text-xl text-muted-foreground mb-6">
                  {subtitle}
                </p>
                <div className="text-3xl font-bold text-primary mb-8">
                  {pricing}
                </div>
              </div>

              {/* Service Highlights Grid */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Our Services</h3>
                  <div className="space-y-3">
                    {serviceHighlights.map((service, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Why Choose Us</h3>
                  <div className="space-y-3">
                    {trustElements.map((element, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        <span>{element}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="text-center mb-8">
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                  <Button size="lg" className="text-lg px-8 py-6 shadow-none" asChild>
                    <Link href={`tel:${phoneNumber}`} className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      {primaryCta}
                    </Link>
                  </Button>
                  
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6 shadow-none" asChild>
                    <Link href="/contact" className="flex items-center gap-2">
                      Schedule Consultation
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Supporting Messages */}
              <div className="text-center space-y-2">
                {supportingMessages.map((message, index) => (
                  <p key={index} className="text-sm text-muted-foreground">
                    {message}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}