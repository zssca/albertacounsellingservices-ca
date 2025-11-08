import { Metadata } from 'next';
import ProfessionalProfile from '@/components/sections/about/professional-profile';
import CTASection from '@/components/sections/cta/cta-section';
import { callToActionSection } from '@/data/homepage';
import { 
  professionalProfile, 
  professionalJourney, 
  educationalCredentials 
} from '@/data/about';
import { siteMetadata } from '@/data/site';

export const metadata: Metadata = {
  title: siteMetadata.pages.about.title,
  description: siteMetadata.pages.about.description,
  keywords: siteMetadata.keywords,
  openGraph: {
    title: siteMetadata.pages.about.title,
    description: siteMetadata.pages.about.description,
    url: `${siteMetadata.url}/about`,
    type: 'website',
  },
  alternates: {
    canonical: `${siteMetadata.url}/about`,
  },
};

export default function AboutPage() {
  return (
    <main>
      <ProfessionalProfile
        headline={professionalProfile.headline}
        subtitle={professionalProfile.subtitle}
        description={professionalProfile.description}
        whyChoose={professionalProfile.whyChoose}
        image={professionalProfile.image}
        bio={professionalProfile.bio}
        philosophy={professionalProfile.philosophy}
        timeline={professionalJourney.timeline}
        academic={educationalCredentials.academic}
        professional={educationalCredentials.professional}
      />
      <CTASection
        headline={callToActionSection.headline}
        subtitle={callToActionSection.subtitle}
        pricing={callToActionSection.pricing}
        avatar={callToActionSection.avatar}
        serviceHighlights={callToActionSection.serviceHighlights}
        trustElements={callToActionSection.trustElements}
        primaryCta={callToActionSection.primaryCta}
        supportingMessages={callToActionSection.supportingMessages}
      />
    </main>
  );
}