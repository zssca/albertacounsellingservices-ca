"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { BreadcrumbListStructuredData } from '@/components/seo/structured-data';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function PageBreadcrumb() {
  const pathname = usePathname();
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split('/').filter(segment => segment !== '');
    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];
    
    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Convert segment to readable label
      let label = segment.charAt(0).toUpperCase() + segment.slice(1);
      
      // Handle special cases
      switch (segment) {
        case 'couples-family':
          label = 'Couples & Family';
          break;
        case 'individual':
          label = 'Individual Counselling';
          break;
        case 'abuse':
          label = 'Abuse Counselling';
          break;
        default:
          label = label.replace(/-/g, ' ');
          break;
      }
      
      // Only add href if it's not the last item
      const isLast = index === pathSegments.length - 1;
      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath
      });
    });
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();
  
  // Don't show breadcrumbs on homepage
  if (pathname === '/') {
    return null;
  }

  const structuredItems = breadcrumbs.map((b) => ({
    name: b.label,
    url: b.href || `${typeof window !== 'undefined' ? window.location.origin : ''}${pathname}`,
  }));

  return (
    <>
      {/* Breadcrumb JSON-LD */}
      <BreadcrumbListStructuredData items={structuredItems} />
      <div className="w-full border-b bg-background custom-component no-effects">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.label} className="flex items-center">
                  <BreadcrumbItem>
                    {crumb.href ? (
                      <BreadcrumbLink asChild>
                        <Link href={crumb.href} className="hover:underline">
                          {crumb.label}
                        </Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
    </>
  );
}