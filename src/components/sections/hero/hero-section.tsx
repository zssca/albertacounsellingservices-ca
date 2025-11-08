"use client";

import Link from 'next/link';
import Image from 'next/image';
import { memo } from 'react';
import { Phone, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { businessInfo } from '@/data/business';


interface HeroSectionProps {
  headline: string;
  description: string;
  cta: string;
  backgroundImage?: string;
}

const HeroSection = memo(function HeroSection({ 
  headline, 
  description, 
  cta, 
  backgroundImage = '/hero-bg.webp' // Set default background image
}: HeroSectionProps) {
  return (
    <section 
      className="relative min-h-[90vh] w-full flex items-center justify-center bg-background overflow-hidden custom-component no-effects"
      aria-label="Hero section"
    >
      {/* Hero Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={backgroundImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          quality={95}
        />
        {/* Enhanced overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/90" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20">
        <div className="text-center space-y-8">
          {/* Professional Badge */}
          <div className="flex justify-center">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium shadow-none no-effects">
              {businessInfo.psychologist.experienceBadge}
            </Badge>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground balance max-w-5xl mx-auto leading-tight">
            {headline}
          </h1>

          {/* Description with markdown support */}
          <p 
            className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-4xl mx-auto"
            dangerouslySetInnerHTML={{ 
              __html: description.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>') 
            }}
          />

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button size="lg" className="text-lg px-8 py-6 shadow-none" asChild>
              <Link href="/contact" className="flex items-center gap-2">
                {cta}
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-background/80 backdrop-blur-sm shadow-none border-2" asChild>
              <Link 
                href={`tel:${businessInfo.contact.phone}`} 
                className="flex items-center gap-2"
                aria-label={`Call ${businessInfo.contact.phone}`}
              >
                <Phone className="h-5 w-5" aria-hidden="true" />
                {businessInfo.contact.phone}
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2 bg-background/80 backdrop-blur-sm p-4 rounded-lg shadow-none">
              <div className="text-2xl font-bold text-primary">35+</div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </div>
            <div className="space-y-2 bg-background/80 backdrop-blur-sm p-4 rounded-lg shadow-none">
              <div className="text-2xl font-bold text-primary">Registered</div>
              <div className="text-sm text-muted-foreground">Psychologist</div>
            </div>
            <div className="space-y-2 bg-background/80 backdrop-blur-sm p-4 rounded-lg shadow-none">
              <div className="text-2xl font-bold text-primary">Calgary</div>
              <div className="text-sm text-muted-foreground">Based Practice</div>
            </div>
          </div>
          
          {/* Quick Service Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mt-6">
            {['Individual Counselling', 'Couples Therapy', 'Family Counselling', 'Anxiety & Depression'].map((service, i) => (
              <div key={i} className="flex items-center gap-2 bg-background/80 backdrop-blur-sm p-3 rounded-lg shadow-none text-sm font-medium">
                <Check className="h-4 w-4 text-primary" />
                <span>{service}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;