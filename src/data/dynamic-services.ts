export interface DynamicService {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  heroTitle: string;
  heroDescription: string;
  image: string;
  imageAlt?: string;
  fullDescription: string;
  specializations: string[];
  approach: {
    title: string;
    description: string;
    points: Array<{
      title: string;
      description: string;
    }>;
  };
  serviceFeatures: Array<{
    title: string;
    description: string;
  }>;
  benefits: string[];
  whoCanBenefit: string[];
  processSteps: Array<{
    step: number;
    title: string;
    description: string;
  }>;
  faq: Array<{
    question: string;
    answer: string;
  }>;
  relatedServices: string[];
  cta: string;
}

// Import individual service data files
import { individualCounsellingData } from './services/individual-counselling';
import { couplesFamilyCounsellingData } from './services/couples-family-counselling';
import { anxietyDepressionCounsellingData } from './services/anxiety-depression-counselling';
import { traumaAbuseCounsellingData } from './services/trauma-abuse-counselling';
import { stressManagementCounsellingData } from './services/stress-management-counselling';
import { demographicSpecificCounsellingData } from './services/demographic-specific-counselling';
import { disordersCounsellingData } from './services/disorders-counselling';
import { careerEducationCounsellingData } from './services/career-education-counselling';
import { mediationConsultationCounsellingData } from './services/mediation-consultation-counselling';
import { addictionsCounsellingData } from './services/addictions-counselling';
import { otherSpecializationsCounsellingData } from './services/other-specializations-counselling';

export const dynamicServicesData: DynamicService[] = [
  individualCounsellingData,
  couplesFamilyCounsellingData,
  anxietyDepressionCounsellingData,
  traumaAbuseCounsellingData,
  stressManagementCounsellingData,
  demographicSpecificCounsellingData,
  disordersCounsellingData,
  careerEducationCounsellingData,
  mediationConsultationCounsellingData,
  addictionsCounsellingData,
  otherSpecializationsCounsellingData,
];

export const getServiceBySlug = (slug: string): DynamicService | undefined => {
  return dynamicServicesData.find(service => service.slug === slug);
};

export const getAllServiceSlugs = (): string[] => {
  return dynamicServicesData.map(service => service.slug);
};