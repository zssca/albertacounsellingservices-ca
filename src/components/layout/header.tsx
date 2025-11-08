"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { navigation } from '@/data/site';
import { businessInfo } from '@/data/business';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  // Helper to format hours safely
  const hours = businessInfo.officeHours;
  const isClosed = (v?: string) => !v || v.toLowerCase() === 'closed';

  // Attempt a concise grouping for display
  const monThuSame = hours.monday === hours.tuesday && hours.tuesday === hours.wednesday && hours.wednesday === hours.thursday;
  const weekendClosed = isClosed(hours.saturday) && isClosed(hours.sunday);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-20 items-center justify-between w-full">
        <Link href="/" className="flex items-center space-x-3">
          <div className="relative">
            <Image 
              src="/logo.png" 
              alt="Alberta Counselling Services" 
              width={200} 
              height={51}
              quality={95}
              priority
              className="w-auto logo-image"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navigation.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-foreground/80 relative py-2 px-1 hover:text-primary no-effects"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Phone CTA & Mobile Menu */}
        <div className="flex items-center space-x-4">
          <Button asChild variant="default" size="default" className="hidden lg:flex font-semibold shadow-none">
            <Link href={`tel:${businessInfo.contact.phone}`} className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span className="hidden xl:inline">Call</span> {businessInfo.contact.phone}
            </Link>
          </Button>

          {/* Mobile Menu Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="default" className="border-primary/20 shadow-none">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] sm:w-[350px] p-0 shadow-none">
              {/* Accessible title for screen readers */}
              <SheetHeader className="sr-only">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>

              {/* Mobile Menu Header */}
              <div className="px-6 py-6 border-b border-border">
                <h2 className="text-xl font-semibold text-foreground">Menu</h2>
              </div>
              
              {/* Navigation Links */}
              <div className="px-4 py-4">
                <nav className="flex flex-col space-y-1">
                  {navigation.main.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-base py-3 px-4 rounded-md hover:bg-muted/50 hover:text-primary flex items-center justify-between group no-effects"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="font-medium">{item.label}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 opacity-50"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </Link>
                  ))}
                </nav>
              </div>
              
              {/* Contact Section */}
              <div className="px-6 py-6 border-t border-border mt-auto">
                <div className="space-y-4">
                  <div className="text-sm font-medium text-muted-foreground">Contact Us</div>
                  <Button asChild variant="default" className="w-full font-semibold shadow-none">
                    <Link href={`tel:${businessInfo.contact.phone}`} className="flex items-center justify-center gap-2">
                      <Phone className="h-4 w-4" />
                      Call {businessInfo.contact.phone}
                    </Link>
                  </Button>
                  
                  <div className="bg-muted/30 p-4 rounded-lg text-sm">
                    <div className="font-medium mb-2 text-foreground">Office Hours</div>
                    <div className="text-muted-foreground text-xs space-y-1">
                      {monThuSame ? (
                        <p>Mon - Thu: {hours.monday}</p>
                      ) : (
                        <>
                          <p>Mon: {hours.monday}</p>
                          <p>Tue: {hours.tuesday}</p>
                          <p>Wed: {hours.wednesday}</p>
                          <p>Thu: {hours.thursday}</p>
                        </>
                      )}
                      {!isClosed(hours.friday) && <p>Fri: {hours.friday}</p>}
                      {weekendClosed ? (
                        <p>Sat - Sun: Closed</p>
                      ) : (
                        <>
                          <p>Sat: {hours.saturday}</p>
                          <p>Sun: {hours.sunday}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}