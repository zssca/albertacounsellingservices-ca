"use client";

import Link from 'next/link';
import { ArrowRight, CheckCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { businessInfo } from '@/data/business';

interface ApproachPoint {
  title: string;
  description: string;
}

interface ServiceFeature {
  title: string;
  description: string;
}

interface ServiceDetailProps {
  pageTitle: string;
  subtitle: string;
  approach: {
    title: string;
    description: string;
    points: ApproachPoint[];
  };
  serviceFeatures: ServiceFeature[];
  specializations?: string[];
  therapeuticApproach?: {
    title: string;
    description: string;
    points: ApproachPoint[];
  };
  treatmentSpecializations?: string[];
  cta: string;
}

export default function ServiceDetail({
  pageTitle,
  subtitle,
  approach,
  serviceFeatures,
  specializations,
  therapeuticApproach,
  treatmentSpecializations,
  cta
}: ServiceDetailProps) {
  const mainApproach = therapeuticApproach || approach;
  const mainSpecializations = treatmentSpecializations || specializations;

  return (
    <div className="py-20 custom-component no-effects">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center space-y-6 mb-16">
          <Badge variant="secondary" className="px-4 py-2 no-effects">
            Professional Service
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-7xl mx-auto">
            {pageTitle}
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground">
            {subtitle}
          </p>
        </div>

        {/* Our Approach Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{mainApproach.title}</h2>
            <p className="text-xl text-muted-foreground">
              {mainApproach.description}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {mainApproach.points.map((point, index) => (
              <Card key={index} className="border shadow-none">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{point.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{point.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Service Features Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Service Features</h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive support tailored to your needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceFeatures.map((feature, index) => (
              <Card key={index} className="border shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Specializations Section */}
        {mainSpecializations && mainSpecializations.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Areas of Specialization
              </h2>
              <p className="text-xl text-muted-foreground">
                Expert care across multiple therapeutic areas
              </p>
            </div>
            
            <Card className="border shadow-none">
              <CardContent className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {mainSpecializations.map((spec, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm font-medium">{spec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* CTA Section */}
        <Card className="border shadow-none">
          <CardContent className="p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {cta}
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Take the first step towards healing and growth with our confidential consultation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-lg px-8 py-6 shadow-none">
                <Link href="/contact" className="flex items-center gap-2">
                  Schedule Consultation
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 shadow-none">
                <Link href={`tel:${businessInfo.contact.phone}`} className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  {businessInfo.contact.phone}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}