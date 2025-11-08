"use client";

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, User, Building, ExternalLink, ArrowUp } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { businessInfo } from '@/data/business';
import { navigation } from '@/data/site';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { dynamicServicesData } from '@/data/dynamic-services';

export default function Footer() {
  // Derive and normalize hours for better display
  const hours = businessInfo.officeHours;
  const isClosed = (v?: string) => !v || v.toLowerCase() === 'closed';
  const monThuSame = hours.monday === hours.tuesday && hours.tuesday === hours.wednesday && hours.wednesday === hours.thursday;
  const weekendClosed = isClosed(hours.saturday) && isClosed(hours.sunday);

  // Today summary
  const dayKeys = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'] as const;
  const todayKey = dayKeys[new Date().getDay()] as keyof typeof hours;
  const todayHours = hours[todayKey];

  const mapsQuery = encodeURIComponent(
    businessInfo.contact.address.fullAddress ||
      `${businessInfo.contact.address.street}, ${businessInfo.contact.address.city}, ${businessInfo.contact.address.province} ${businessInfo.contact.address.postalCode}`
  );

  const popularServiceSlugs = [
    'individual-counselling',
    'couples-family-counselling',
    'trauma-abuse-counselling',
    'addictions-counselling',
    'mediation-consultation-counselling',
  ];
  const popularServices = dynamicServicesData.filter((s) => popularServiceSlugs.includes(s.slug)).slice(0, 5);

  return (
    <footer className="relative w-full bg-muted/50 border-t custom-component no-effects" role="contentinfo">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Information & Contact */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center">
                <Image src="/logo.png" alt="Alberta Counselling Services logo" width={200} height={51} className="h-10 w-auto" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Professional counselling services in Calgary with over 35 years of experience helping individuals, couples, and families.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin aria-hidden="true" className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                <div className="space-y-1">
                  <address className="not-italic">
                    <div className="text-sm font-medium text-foreground">{businessInfo.contact.address.street}</div>
                    <div className="text-sm text-muted-foreground">
                      {businessInfo.contact.address.city}, {businessInfo.contact.address.province} {businessInfo.contact.address.postalCode}
                    </div>
                  </address>
                  <Link
                    href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded"
                  >
                    Get directions <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-primary" />
                <Link 
                  href={`tel:${businessInfo.contact.phone}`} 
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded"
                >
                  {businessInfo.contact.phone}
                </Link>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-primary" />
                <Link 
                  href={`mailto:${businessInfo.contact.email}`} 
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded"
                >
                  {businessInfo.contact.email}
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 pt-2">
                {businessInfo.location?.features?.map((f) => (
                  <span
                    key={f}
                    className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs text-primary"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links & Office Hours */}
          <div className="space-y-8">
            {/* Quick Links */}
            <div className="space-y-4">
              <h3 id="footer-quick-links" className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Building aria-hidden="true" className="h-5 w-5 text-primary" />
                Quick Links
              </h3>
              <nav aria-labelledby="footer-quick-links">
                <ul className="space-y-3">
                  {navigation.main.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block text-sm text-muted-foreground hover:text-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Office Hours */}
            <div className="space-y-4">
              <h3 id="footer-office-hours" className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Clock aria-hidden="true" className="h-5 w-5 text-primary" />
                Office Hours
              </h3>
              <div className="space-y-3">
                {monThuSame ? (
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-sm font-medium text-foreground">Mon - Thu</span>
                    <span className="text-sm text-muted-foreground">{hours.monday}</span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-sm font-medium text-foreground">Monday</span>
                      <span className="text-sm text-muted-foreground">{hours.monday}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-sm font-medium text-foreground">Tuesday</span>
                      <span className="text-sm text-muted-foreground">{hours.tuesday}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-sm font-medium text-foreground">Wednesday</span>
                      <span className="text-sm text-muted-foreground">{hours.wednesday}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-sm font-medium text-foreground">Thursday</span>
                      <span className="text-sm text-muted-foreground">{hours.thursday}</span>
                    </div>
                  </>
                )}
                {!isClosed(hours.friday) && (
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-sm font-medium text-foreground">Friday</span>
                    <span className="text-sm text-muted-foreground">{hours.friday}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-foreground">Weekends</span>
                  <span className="text-sm text-muted-foreground">
                    {weekendClosed ? 'Closed' : `Sat: ${hours.saturday} · Sun: ${hours.sunday}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Popular Services */}
          <div className="space-y-4">
            <h3 id="footer-popular-services" className="text-xl font-semibold text-foreground">Popular Services</h3>
            <nav aria-labelledby="footer-popular-services">
              <ul className="space-y-3">
                {popularServices.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}`}
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded"
                    >
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Professional Information */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 id="footer-professional" className="text-xl font-semibold text-foreground flex items-center gap-2">
                <User aria-hidden="true" className="h-5 w-5 text-primary" />
                Professional
              </h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-semibold text-foreground">{businessInfo.psychologist.name}</div>
                <div className="text-sm text-muted-foreground">{businessInfo.psychologist.credentials}</div>
                <div className="text-xs inline-flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  {businessInfo.psychologist.experienceBadge}
                </div>
              </div>
              <div className="pt-2">
                <div className="text-lg font-bold text-primary">{businessInfo.sessionRate}</div>
                <div className="text-xs text-muted-foreground mt-1">per session</div>
              </div>
            </div>

            {/* Resources */}
            <div className="pt-2 space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Resources</h4>
              <nav aria-label="Site resources">
                <ul className="space-y-2">
                  <li>
                    <a href="/sitemap.xml" className="text-sm text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded">Sitemap</a>
                  </li>
                  <li>
                    <a href="/robots.txt" className="text-sm text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded">Robots.txt</a>
                  </li>
                  <li>
                    <a href="/humans.txt" className="text-sm text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded">Humans.txt</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>

        {/* Contact CTA Strip */}
        <div className="mt-10 rounded-lg border border-border bg-background/60 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Ready to talk? We’re accepting new clients.</p>
              <p className="text-xs text-muted-foreground mt-1">Today ({todayKey.charAt(0).toUpperCase() + todayKey.slice(1)}): {todayHours}</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Link
                href={`tel:${businessInfo.contact.phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                aria-label={`Call ${businessInfo.contact.phone}`}
              >
                <Phone className="h-4 w-4" /> {businessInfo.contact.phone}
              </Link>
              <Link
                href={`mailto:${businessInfo.contact.email}`}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                aria-label={`Email ${businessInfo.contact.email}`}
              >
                <Mail className="h-4 w-4" /> Email us
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 rounded-lg border border-border bg-muted/30 p-4 text-xs text-muted-foreground">
          <p>
            If you are in crisis or this is an emergency, call 911 or your local crisis line immediately. Email is not monitored for emergencies.
          </p>
        </div>

        <Separator className="my-12" />
        
        {/* Footer Bottom */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Copyright and Social Links */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="text-sm text-muted-foreground">
              {businessInfo.footer.copyright}
            </div>
            
            {/* Social Media Links */}
            <nav aria-label="Social links">
              <ul className="flex items-center gap-2">
                <li>
                  <Link 
                    href={businessInfo.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 p-2 rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                    aria-label="Facebook"
                  >
                    <Facebook aria-hidden="true" className="h-5 w-5" />
                  </Link>
                </li>
                <li>
                  <Link 
                    href={businessInfo.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 p-2 rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                    aria-label="Instagram"
                  >
                    <Instagram aria-hidden="true" className="h-5 w-5" />
                  </Link>
                </li>
                <li>
                  <Link 
                    href={businessInfo.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 p-2 rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                    aria-label="Twitter"
                  >
                    <Twitter aria-hidden="true" className="h-5 w-5" />
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          
          {/* Additional Info */}
          <div className="text-sm text-muted-foreground text-center sm:text-right">
            <div className="space-y-1">
              <div className="uppercase tracking-wide text-xs text-muted-foreground/80">{businessInfo.footer.established}</div>
              <div className="uppercase tracking-wide text-xs text-muted-foreground/80">{businessInfo.footer.digitalCraft}</div>
            </div>
            <div className="mt-3">
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1 text-primary hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded"
                aria-label="Back to top"
              >
                <ArrowUp aria-hidden="true" className="h-4 w-4" /> Back to top
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}