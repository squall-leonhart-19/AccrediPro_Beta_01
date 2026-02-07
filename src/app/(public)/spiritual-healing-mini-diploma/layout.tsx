import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Free Spiritual Healing Mini Diploma | AccrediPro Institute",
    description:
        "Discover your healing gifts with our free 3-lesson Spiritual Healing Mini Diploma. Learn the D.E.P.T.H. Method™, energy healing fundamentals, and how to get your first clients. ASI-accredited certification from AccrediPro Institute.",
    openGraph: {
        title: "Free Spiritual Healing Mini Diploma | AccrediPro Institute",
        description:
            "Unlock your spiritual healing gifts with our free 3-lesson mini diploma. Learn the D.E.P.T.H. Method™ and start your journey as a certified practitioner.",
        type: "website",
        siteName: "AccrediPro Institute",
    },
    twitter: {
        card: "summary_large_image",
        title: "Free Spiritual Healing Mini Diploma",
        description:
            "Discover your healing gifts with our free 3-lesson certification. ASI-accredited.",
    },
};

export default function SpiritualHealingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
