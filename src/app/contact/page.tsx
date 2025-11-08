import { Metadata } from 'next';
import ContactInfo from '@/components/sections/contact/contact-info';
import CTASection from '@/components/sections/cta/cta-section';
import { callToActionSection } from '@/data/homepage';
import { contactPageData } from '@/data/contact';
import { siteMetadata } from '@/data/site';

export const metadata: Metadata = {
  title: siteMetadata.pages.contact.title,
  description: siteMetadata.pages.contact.description,
  keywords: siteMetadata.keywords,
  openGraph: {
    title: siteMetadata.pages.contact.title,
    description: siteMetadata.pages.contact.description,
    url: `${siteMetadata.url}/contact`,
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <main>
      <ContactInfo
        headline={contactPageData.headline}
        description={contactPageData.description}
        contactMethods={contactPageData.contactMethods}
        officeHours={contactPageData.officeHours}
        locationDetails={contactPageData.locationDetails}
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