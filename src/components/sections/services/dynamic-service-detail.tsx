"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, CheckCircle, Phone, Users, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { businessInfo } from '@/data/business';
import { DynamicService } from '@/data/dynamic-services';
import { getServiceBySlug } from '@/data/dynamic-services';

interface DynamicServiceDetailProps {
  service: DynamicService;
}

export default function DynamicServiceDetail({ service }: DynamicServiceDetailProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="py-20 custom-component no-effects">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <Badge variant="secondary" className="px-4 py-2 no-effects">
              Professional Service
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              {service.heroTitle}
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              {service.heroDescription}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="shadow-none" asChild>
                <Link href="/contact" className="flex items-center gap-2">
                  Schedule Consultation
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" className="shadow-none" asChild>
                <Link href={`tel:${businessInfo.contact.phone}`} className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  {businessInfo.contact.phone}
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="relative">
            {!imageError ? (
              <Image
                src={service.image}
                alt={service.imageAlt || service.title}
                width={600}
                height={400}
                className="rounded-2xl object-cover w-full h-[400px]"
                onError={handleImageError}
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={95}
                priority
              />
            ) : (
              <div className="w-full h-[400px] rounded-2xl bg-muted flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">Alberta Counselling Services</div>
                  <div className="text-sm text-muted-foreground">{service.shortTitle}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Service Overview */}
        <div className="mb-16">
          <div className="max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About Our {service.shortTitle}</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {service.fullDescription}
            </p>
          </div>
        </div>

        {/* Tabbed Content */}
        <div className="mb-16">
          <Tabs defaultValue="approach" className="w-full">
            {/* Use shared responsive Tabs styles (wrap on mobile, evenly distribute on md+) */}
            <TabsList aria-label="Service details">
              <TabsTrigger value="approach">Our Approach</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="process">Process</TabsTrigger>
              <TabsTrigger value="who">Who We Help</TabsTrigger>
            </TabsList>

            <TabsContent value="approach" className="mt-8">
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-4">{service.approach.title}</h3>
                  <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    {service.approach.description}
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {service.approach.points.map((point, index) => (
                    <Card key={index} className="border shadow-none">
                      <CardHeader>
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <Target className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{point.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{point.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="benefits" className="mt-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-6">Key Benefits</h3>
                  <div className="space-y-3">
                    {service.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Card className="border shadow-none">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-6 w-6 text-primary" />
                      Service Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {service.serviceFeatures.map((feature, index) => (
                      <div key={index}>
                        <h4 className="font-semibold mb-2">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="process" className="mt-8">
              <div className="max-w-7xl mx-auto">
                <h3 className="text-2xl font-bold mb-8 text-center">Our Treatment Process</h3>
                <div className="space-y-6">
                  {service.processSteps.map((step, index) => (
                    <Card key={index} className="border-l-4 border-l-primary shadow-none">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                            {step.step}
                          </div>
                          <div>
                            <h4 className="text-xl font-semibold mb-2">{step.title}</h4>
                            <p className="text-muted-foreground">{step.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="who" className="mt-8">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-bold mb-6">Who Can Benefit</h3>
                  <div className="space-y-3">
                    {service.whoCanBenefit.map((person, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{person}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {service.specializations.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold mb-6">Areas of Specialization</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {service.specializations.map((spec, index) => (
                        <Badge key={index} variant="outline" className="justify-start p-3 text-sm">
                          <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* FAQ Section */}
        {service.faq.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">
                Common questions about {service.shortTitle.toLowerCase()}
              </p>
            </div>
            
            <div className="max-w-7xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {service.faq.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`} className="border rounded-lg px-6 bg-card">
                    <AccordionTrigger className="text-left hover:no-underline py-6">
                      <span className="text-lg font-semibold pr-4">
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 pt-2 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        )}

        {/* Related Services (Internal Linking) */}
        {service.relatedServices && service.relatedServices.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Related Services in Calgary</h2>
              <p className="text-lg text-muted-foreground">Explore other services that may support your goals.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {service.relatedServices
                .map((slug) => getServiceBySlug(slug))
                .filter((svc): svc is DynamicService => Boolean(svc))
                .map((svc) => (
                  <Card key={svc.slug} className="border shadow-none">
                    <CardHeader>
                      <CardTitle className="text-xl">{svc.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{svc.metaDescription}</p>
                      <Button asChild variant="outline" className="shadow-none">
                        <Link href={`/services/${svc.slug}`} className="flex items-center gap-2">
                          Learn more
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}
        
        
      </div>
    </div>
  );
}