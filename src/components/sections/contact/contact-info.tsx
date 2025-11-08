"use client";

import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Car, Bus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ContactMethod {
  title: string;
  value: string;
  displayValue?: string;
  icon: string;
}

interface OfficeHours {
  title: string;
  schedule: Array<{
    day: string;
    hours: string;
  }>;
}

interface LocationDetails {
  title: string;
  features: string[];
}

interface ContactInfoProps {
  headline: string;
  description: string;
  contactMethods: {
    email: ContactMethod;
    phone: ContactMethod;
    location: {
      title: string;
      address: {
        street: string;
        city: string;
        province: string;
        postalCode: string;
      };
      icon: string;
    };
  };
  officeHours: OfficeHours;
  locationDetails: LocationDetails;
}

export default function ContactInfo({
  headline,
  description,
  contactMethods,
  officeHours,
  locationDetails
}: ContactInfoProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'mail': return <Mail className="h-6 w-6" />;
      case 'phone': return <Phone className="h-6 w-6" />;
      case 'map-pin': return <MapPin className="h-6 w-6" />;
      default: return <Mail className="h-6 w-6" />;
    }
  };

  return (
    <section className="w-full py-20 bg-background custom-component no-effects">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center space-y-6 mb-16">
          <Badge variant="secondary" className="px-4 py-2">
            Contact Us
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            {headline}
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Methods */}
          <div className="space-y-8">
            {/* Phone */}
            <Card className="border shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  {getIcon(contactMethods.phone.icon)}
                  {contactMethods.phone.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Link 
                    href={`tel:${contactMethods.phone.value}`}
                    className="text-2xl font-bold text-primary"
                  >
                    {contactMethods.phone.displayValue || contactMethods.phone.value}
                  </Link>
                  <p className="text-muted-foreground">
                    Call us during business hours for immediate support and to schedule your consultation.
                  </p>
                  <Button asChild className="w-full shadow-none">
                    <Link href={`tel:${contactMethods.phone.value}`}>
                      Call Now
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Email */}
            <Card className="border shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  {getIcon(contactMethods.email.icon)}
                  {contactMethods.email.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Link 
                    href={`mailto:${contactMethods.email.value}`}
                    className="text-lg font-medium text-primary break-all"
                  >
                    {contactMethods.email.value}
                  </Link>
                  <p className="text-muted-foreground">
                    Send us an email anytime and we&apos;ll get back to you within 24 hours.
                  </p>
                  <Button variant="outline" asChild className="w-full shadow-none">
                    <Link href={`mailto:${contactMethods.email.value}`}>
                      Send Email
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Location & Hours */}
          <div className="space-y-8">
            {/* Location */}
            <Card className="border shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  {getIcon(contactMethods.location.icon)}
                  {contactMethods.location.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-lg">
                    <div className="font-medium">{contactMethods.location.address.street}</div>
                    <div>{contactMethods.location.address.city}, {contactMethods.location.address.province} {contactMethods.location.address.postalCode}</div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-primary">{locationDetails.title}</h4>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        {locationDetails.features[0]}
                      </div>
                      <div className="flex items-center gap-2">
                        <Bus className="h-4 w-4" />
                        {locationDetails.features[1]}
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" asChild className="w-full shadow-none">
                    <Link 
                      href={`https://maps.google.com/?q=${encodeURIComponent(`${contactMethods.location.address.street}, ${contactMethods.location.address.city}, ${contactMethods.location.address.province} ${contactMethods.location.address.postalCode}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get Directions
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Office Hours */}
            <Card className="border shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Clock className="h-6 w-6" />
                  {officeHours.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {officeHours.schedule.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="font-medium">{schedule.day}:</span>
                      <span className="text-muted-foreground">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        
      </div>
    </section>
  );
}