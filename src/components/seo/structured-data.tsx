import { businessInfo } from '@/data/business';
import { siteMetadata } from '@/data/site';
import type { DynamicService } from '@/data/dynamic-services';

const absoluteUrl = (path: string) => {
  try {
    if (path.startsWith('http')) return path;
    const base = siteMetadata.url.replace(/\/$/, '');
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `${base}${normalized}`;
  } catch {
    return path;
  }
};

const ids = {
  organization: `${siteMetadata.url}/#organization`,
  localBusiness: `${siteMetadata.url}/#localbusiness`,
};

export function BusinessStructuredData() {
  const sameAs = [
    businessInfo.social.facebook,
    businessInfo.social.instagram,
    businessInfo.social.twitter,
  ].filter((u) => u && u !== '#');

  const hourEntries = [
    { day: 'Monday', hours: businessInfo.officeHours.monday },
    { day: 'Tuesday', hours: businessInfo.officeHours.tuesday },
    { day: 'Wednesday', hours: businessInfo.officeHours.wednesday },
    { day: 'Thursday', hours: businessInfo.officeHours.thursday },
    { day: 'Friday', hours: businessInfo.officeHours.friday },
    { day: 'Saturday', hours: businessInfo.officeHours.saturday },
    { day: 'Sunday', hours: businessInfo.officeHours.sunday },
  ] as const;

  const openingHoursSpecification = hourEntries
    .filter(({ hours }) => typeof hours === 'string' && hours && hours.toLowerCase() !== 'closed')
    .map(({ day, hours }) => {
      const [opens, closes] = (hours as string).replace(/\s/gi, '').split('-');
      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: day,
        opens,
        closes,
      };
    });

  const hasMap = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    businessInfo.contact.address.fullAddress || `${businessInfo.contact.address.street}, ${businessInfo.contact.address.city}, ${businessInfo.contact.address.province} ${businessInfo.contact.address.postalCode}`
  )}`;

  // Build offer catalog from services (lightweight: only names and URLs)
  const services = [
    { name: 'Individual Counselling', url: absoluteUrl('/services/individual-counselling') },
    { name: 'Couples & Marriage Counselling', url: absoluteUrl('/services/couples-family-counselling') },
    { name: 'Anxiety & Depression Counselling', url: absoluteUrl('/services/anxiety-depression-counselling') },
    { name: 'Trauma & Abuse Counselling', url: absoluteUrl('/services/trauma-abuse-counselling') },
    { name: 'Stress Management Counselling', url: absoluteUrl('/services/stress-management-counselling') },
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': ids.localBusiness,
    name: businessInfo.name,
    description:
      'Professional counselling services in Calgary offering relationship counselling, marriage therapy, family counselling, and individual therapy with over 35 years of experience.',
    url: siteMetadata.url,
    telephone: businessInfo.contact.phone,
    email: businessInfo.contact.email,
    image: absoluteUrl('/logo.png'),
    logo: absoluteUrl('/logo.png'),
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: businessInfo.contact.address.street,
      addressLocality: businessInfo.contact.address.city,
      addressRegion: businessInfo.contact.address.province,
      postalCode: businessInfo.contact.address.postalCode,
      addressCountry: 'CA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 51.0447,
      longitude: -114.0719,
    },
    hasMap,
    openingHoursSpecification,
    areaServed: {
      '@type': 'City',
      name: 'Calgary',
      addressRegion: 'AB',
      addressCountry: 'CA',
    },
    founder: {
      '@type': 'Person',
      name: businessInfo.psychologist.name,
      jobTitle: businessInfo.psychologist.title,
      description:
        'Experienced registered psychologist specializing in relationship counselling, family therapy, and individual counselling with over 35 years of clinical experience.',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: businessInfo.contact.phone,
      contactType: 'customer service',
      areaServed: 'CA',
      availableLanguage: ['en'],
    },
    knowsAbout: [
      'Individual counselling',
      'Couples counselling',
      'Marriage therapy',
      'Family counselling',
      'Anxiety counselling',
      'Depression therapy',
      'PTSD therapy',
      'Stress management counselling',
    ],
    serviceOffered: [
      'Individual Counselling',
      'Couples & Marriage Counselling',
      'Family Therapy',
      'Anxiety & Depression Counselling',
      'Trauma & Abuse Counselling',
      'Stress Management Counselling',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Counselling Services',
      itemListElement: services.map((s, i) => ({
        '@type': 'Offer',
        name: s.name,
        url: s.url,
        position: i + 1,
        itemOffered: {
          '@type': 'Service',
          name: s.name,
          provider: { '@id': ids.localBusiness },
        },
      })),
    },
    sameAs: sameAs.length ? sameAs : undefined,
  } as const;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function OrganizationStructuredData() {
  const sameAs = [
    businessInfo.social.facebook,
    businessInfo.social.instagram,
    businessInfo.social.twitter,
  ].filter((u) => u && u !== '#');

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ids.organization,
    name: businessInfo.name,
    url: siteMetadata.url,
    logo: absoluteUrl('/logo.png'),
    sameAs: sameAs.length ? sameAs : undefined,
  } as const;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function ServiceStructuredData({ service }: { service: DynamicService }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    serviceType: service.shortTitle,
    description: service.metaDescription || service.fullDescription,
    provider: {
      '@id': ids.localBusiness,
    },
    areaServed: 'Calgary, AB',
    url: `${siteMetadata.url}/services/${service.slug}`,
    image: absoluteUrl(service.image),
    keywords: service.keywords?.slice(0, 12),
    offers: {
      '@type': 'Offer',
      price: businessInfo.sessionRate?.match(/\d+/)?.[0] || '160',
      priceCurrency: 'CAD',
      availability: 'https://schema.org/InStock',
    },
  } as const;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function ServicesItemListStructuredData({ services }: { services: DynamicService[] }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: services.map((svc, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${siteMetadata.url}/services/${svc.slug}`,
      name: svc.title,
      image: absoluteUrl(svc.image),
      description: svc.metaDescription,
    })),
  } as const;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function BreadcrumbListStructuredData({ items }: { items: Array<{ name: string; url: string }> }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  } as const;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function FAQStructuredData({
  faq,
}: {
  faq: { questions: Array<{ question: string; answer: string }> };
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  } as const;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function WebsiteStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: siteMetadata.url,
    name: siteMetadata.title,
    inLanguage: 'en-CA',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteMetadata.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    publisher: { '@id': ids.organization },
  } as const;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function ReviewsStructuredData({ testimonials }: { testimonials: Array<{ name: string; text: string }> }) {
  const graph = testimonials.map((t) => ({
    '@type': 'Review',
    reviewBody: t.text,
    author: { '@type': 'Person', name: t.name },
    itemReviewed: { '@id': ids.localBusiness },
  }));

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': graph,
  } as const;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}