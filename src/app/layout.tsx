import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import MetaPixel from "@/components/tracking/meta-pixel";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PWAInstallPrompt } from "@/components/pwa/install-prompt";
import { PushNotificationPrompt } from "@/components/pwa/push-notification-prompt";
import { ServiceWorkerRegistration } from "@/components/pwa/service-worker-registration";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://learn.accredipro.academy"),
  title: {
    default: "AccrediPro Academy - Functional Medicine Certifications & Mini-Diplomas",
    template: "%s | AccrediPro Academy",
  },
  description: "Transform your career with AccrediPro Academy. 14-module Functional Medicine certification program with individual certificates for each module. CPD & CEU approved. 100% online.",
  keywords: ["functional medicine", "health coach certification", "nutrition certification", "online certification", "CPD approved", "CEU credits", "wellness certification", "integrative health"],
  authors: [{ name: "AccrediPro Academy" }],
  creator: "AccrediPro Academy",
  publisher: "AccrediPro Academy",
  icons: {
    icon: "https://coach.accredipro.academy/wp-content/uploads/2025/10/Senza-titolo-Logo-1.png",
    apple: "https://coach.accredipro.academy/wp-content/uploads/2025/10/Senza-titolo-Logo-1.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://learn.accredipro.academy",
    siteName: "AccrediPro Academy",
    title: "AccrediPro Academy - Functional Medicine Certifications",
    description: "14-module Functional Medicine certification. Earn a certificate for each module completed. 100% online, self-paced, CPD approved.",
    images: [
      {
        url: "https://coach.accredipro.academy/wp-content/uploads/2025/10/Senza-titolo-Logo-1.png",
        width: 1200,
        height: 630,
        alt: "AccrediPro Academy - Functional Medicine Certification",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AccrediPro Academy - Functional Medicine Certifications",
    description: "14 modules. 14 certificates. The most comprehensive functional medicine certification online.",
    images: ["https://coach.accredipro.academy/wp-content/uploads/2025/10/Senza-titolo-Logo-1.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Add Google Search Console verification code here once obtained
  // verification: {
  //   google: "YOUR_ACTUAL_VERIFICATION_CODE",
  // },
};

// JSON-LD structured data for organization
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "AccrediPro Academy",
  url: "https://learn.accredipro.academy",
  logo: "https://coach.accredipro.academy/wp-content/uploads/2025/10/Senza-titolo-Logo-1.png",
  description: "Professional certifications and mini-diplomas in Functional Medicine designed for career advancement.",
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    email: "info@accredipro.academy",
    contactType: "customer service",
  },
};

// JSON-LD for course offering
const courseJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Functional Medicine Practitioner Certification",
  description: "Comprehensive 14-module functional medicine certification program covering nutrition, hormones, gut health, and more.",
  provider: {
    "@type": "Organization",
    name: "AccrediPro Academy",
    url: "https://learn.accredipro.academy",
  },
  educationalCredentialAwarded: "Functional Medicine Practitioner Certificate",
  numberOfCredits: "50+ CEU Hours",
  courseMode: "Online",
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "Online",
    courseWorkload: "PT100H",
  },
  offers: {
    "@type": "Offer",
    price: "997",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#722f37" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AccrediPro" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
        />
        {/* TrustBox script */}
        <script
          type="text/javascript"
          src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
          async
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <QueryProvider>
          <Suspense fallback={null}>
            <MetaPixel />
          </Suspense>
          {children}
          <Toaster richColors position="top-right" />
          <PWAInstallPrompt />
          <PushNotificationPrompt />
          <ServiceWorkerRegistration />
          <Analytics />
          <SpeedInsights />
        </QueryProvider>
      </body>
    </html>
  );
}
