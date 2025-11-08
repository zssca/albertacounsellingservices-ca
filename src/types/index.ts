// Business Information Types
export interface BusinessInfo {
  name: string;
  established: string;
  website: string;
  sessionRate: string;
  psychologist: {
    name: string;
    credentials: string;
    experience: string;
    title: string;
    subtitle: string;
    experienceBadge: string;
  };
  contact: {
    phone: string;
    email: string;
    address: {
      street: string;
      city: string;
      province: string;
      postalCode: string;
      fullAddress: string;
    };
  };
  officeHours: Record<string, string>;
  location: {
    description: string;
    features: string[];
  };
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  footer: {
    copyright: string;
    established: string;
    digitalCraft: string;
  };
}

// Service Types
export interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  specializations?: string[];
}

export interface ServiceDetail {
  pageTitle: string;
  subtitle: string;
  approach: {
    title: string;
    description: string;
    points: ApproachPoint[];
  };
  serviceFeatures: ServiceFeature[];
  cta: string;
}

export interface ApproachPoint {
  title: string;
  description: string;
}

export interface ServiceFeature {
  title: string;
  description: string;
}

// Content Types
export interface Testimonial {
  id: string;
  name: string;
  text: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface FAQData {
  headline: string;
  subtitle: string;
  questions: FAQ[];
}

// Navigation Types
export interface NavigationItem {
  label: string;
  href: string;
}

export interface Navigation {
  main: NavigationItem[];
}

// SEO Types
export interface SiteMetadata {
  title: string;
  description: string;
  keywords: string[];
  url: string;
  image: string;
  author: string;
  pages: {
    home: {
      title: string;
      description: string;
    };
    about: {
      title: string;
      description: string;
    };
    services: {
      title: string;
      description: string;
    };
    contact: {
      title: string;
      description: string;
    };
    individual: {
      title: string;
      description: string;
    };
    coupleFamily: {
      title: string;
      description: string;
    };
    abuse: {
      title: string;
      description: string;
    };
  };
}

// Component Props Types
export interface HeroSectionProps {
  headline: string;
  description: string;
  cta: string;
  backgroundImage?: string;
}

export interface CTASectionProps {
  headline: string;
  subtitle: string;
  pricing: string;
  serviceHighlights: string[];
  trustElements: string[];
  primaryCta: string;
  supportingMessages: string[];
}