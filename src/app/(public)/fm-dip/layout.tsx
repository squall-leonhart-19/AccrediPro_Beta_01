import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Functional Medicine Mini-Diploma | $7 Trial | ASI",
  description: "Start your Functional Medicine journey for just $7. Experience the ASI curriculum with our Mini-Diploma and decide if full certification is right for you.",
  keywords: ["functional medicine mini diploma", "health coach trial", "functional medicine course", "ASI mini diploma", "low cost certification"],
  openGraph: {
    title: "Functional Medicine Mini-Diploma | $7 Trial",
    description: "Start your Functional Medicine journey for just $7. Experience the ASI curriculum with our Mini-Diploma.",
    url: "https://learn.accredipro.academy/fm-dip",
    siteName: "AccrediPro Standards Institute",
    type: "website",
    images: [
      {
        url: "https://coach.accredipro.academy/wp-content/uploads/2025/10/Senza-titolo-Logo-1.png",
        width: 1200,
        height: 630,
        alt: "Functional Medicine Mini-Diploma by ASI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Functional Medicine Mini-Diploma | $7 Trial",
    description: "Start your Functional Medicine journey for just $7. Experience our curriculum risk-free.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function FMDipLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
