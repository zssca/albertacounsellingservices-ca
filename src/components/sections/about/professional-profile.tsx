"use client";

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { GraduationCap, Award, Clock } from 'lucide-react';

interface Degree {
  degree: string;
  institution: string;
}


interface TimelineItem {
  period: string;
  title: string;
  description: string;
}

interface ProfessionalProfileProps {
  headline: string;
  subtitle: string;
  description: string;
  whyChoose: string;
  image: string;
  bio: string;
  philosophy: {
    quote: string;
    attribution: string;
  };
  timeline: TimelineItem[];
  academic: {
    title: string;
    degrees: Degree[];
  };
  professional: {
    title: string;
    certifications: string[];
  };
}

export default function ProfessionalProfile({
  headline,
  subtitle,
  description,
  whyChoose,
  image,
  bio,
  philosophy,
  timeline,
  academic,
  professional
}: ProfessionalProfileProps) {
  return (
    <section className="w-full py-20 bg-background custom-component no-effects">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <Badge variant="secondary" className="px-4 py-2">
              Professional Profile
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              {headline}
            </h1>
            
            <p className="text-xl text-muted-foreground">
              {subtitle}
            </p>
            
            <p className="text-lg leading-relaxed">
              {description}
            </p>
            
            <div className="flex items-center gap-2 text-sm text-primary font-medium">
              <Award className="h-4 w-4" />
              {whyChoose}
            </div>
          </div>
          
          <div className="relative">
            <div className="relative w-full h-[600px] rounded-2xl overflow-hidden">
              <Image
                src={image}
                alt={headline}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={95}
                priority
              />
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mb-20">
          <Card className="border-none bg-muted/30 shadow-none">
            <CardContent className="p-8 md:p-12">
              <p className="text-lg leading-relaxed mb-8">
                {bio}
              </p>
              
              <blockquote className="border-l-4 border-primary pl-6 italic text-lg leading-relaxed">
                &ldquo;{philosophy.quote}&rdquo;
              </blockquote>
              
              <p className="text-right mt-4 text-muted-foreground">
                {philosophy.attribution}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Professional Journey Timeline */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional Journey</h2>
            <p className="text-xl text-muted-foreground">Three decades of dedicated service</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {timeline.map((item, index) => (
              <Card key={index} className="relative shadow-none">
                <CardHeader className="pb-4">
                  <Badge variant="outline" className="w-fit mb-2">
                    <Clock className="h-3 w-3 mr-1" />
                    {item.period}
                  </Badge>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Education & Credentials */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                {academic.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {academic.degrees.map((degree, index) => (
                <div key={index}>
                  <div className="font-semibold">{degree.degree}</div>
                  <div className="text-sm text-muted-foreground">{degree.institution}</div>
                  {index < academic.degrees.length - 1 && <Separator className="my-3" />}
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                {professional.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {professional.certifications.map((cert, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-sm">{cert}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}