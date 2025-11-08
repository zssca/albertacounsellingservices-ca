import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteMetadata } from '@/data/site';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import PageBreadcrumb from '@/components/navigation/page-breadcrumb';
import { BusinessStructuredData, OrganizationStructuredData, WebsiteStructuredData } from '@/components/seo/structured-data';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { SkipLink } from '@/components/accessibility/skip-link';
import { AppProvider } from '@/contexts/app-context';
import { ServiceWorkerProvider } from '@/components/pwa/service-worker-provider';
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.url),
  title: siteMetadata.title,
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,
  authors: [{ name: siteMetadata.author }],
  alternates: {
    canonical: siteMetadata.url,
  },
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.url,
    siteName: 'Alberta Counselling Services',
    images: [{ url: `${siteMetadata.url}${siteMetadata.image}` }],
    type: 'website',
    locale: 'en_CA',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: [`${siteMetadata.url}${siteMetadata.image}`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'oklch(1 0 0)' },
    { media: '(prefers-color-scheme: dark)', color: 'oklch(0.15 0.01 85.87)' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-BB24BQGXT5" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BB24BQGXT5');
          `}
        </Script>
        <BusinessStructuredData />
        <OrganizationStructuredData />
        <WebsiteStructuredData />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProvider>
          <ServiceWorkerProvider />
          <ErrorBoundary>
            <SkipLink />
            <Header />
            <PageBreadcrumb />
            <main id="main-content" tabIndex={-1}>
              {children}
            </main>
            <Footer />
          </ErrorBoundary>
        </AppProvider>
      </body>
    </html>
  );
}
