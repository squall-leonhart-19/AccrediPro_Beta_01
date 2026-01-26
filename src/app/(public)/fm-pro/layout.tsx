import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Functional Medicine Certification | $297 Limited Offer | ASI",
  description: "Board Certified Functional Medicine Practitioner credential. 14 modules, 50+ CEUs, lifetime access. Start your health coaching career today with ASI accreditation.",
  keywords: ["functional medicine certification", "health coach certification", "functional medicine course", "ASI certification", "CEU credits"],
  openGraph: {
    title: "Functional Medicine Certification | $297 Limited Offer",
    description: "Board Certified Functional Medicine Practitioner credential. 14 modules, 50+ CEUs, lifetime access.",
    url: "https://learn.accredipro.academy/fm-pro",
    siteName: "AccrediPro Standards Institute",
    type: "website",
    images: [
      {
        url: "https://assets.accredipro.academy/migrated/Senza-titolo-Logo-1.png",
        width: 1200,
        height: 630,
        alt: "Functional Medicine Certification by ASI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Functional Medicine Certification | $297 Limited Offer",
    description: "Board Certified Functional Medicine Practitioner credential. Start your health coaching career today.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function FMProLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
