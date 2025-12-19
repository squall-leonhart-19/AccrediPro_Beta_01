import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import MetaPixel from "@/components/tracking/meta-pixel";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://accredipro.academy"),
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
    url: "https://accredipro.academy",
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
  verification: {
    google: "your-google-verification-code",
  },
};

// JSON-LD structured data for organization
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "AccrediPro Academy",
  url: "https://accredipro.academy",
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
    url: "https://accredipro.academy",
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
        <Suspense fallback={null}>
          <MetaPixel />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
