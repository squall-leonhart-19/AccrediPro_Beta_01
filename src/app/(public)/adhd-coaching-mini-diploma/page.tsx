import NicheMiniDiplomaPage from "@/components/mini-diploma/niche-landing-page";
import { getNicheConfig } from "@/components/mini-diploma/landing-page-registry";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "ADHD Coaching Mini Diploma — Free 1-Hour Certification | AccrediPro",
    description: "Get certified in ADHD Coaching in just 1 hour. Free ASI-verified mini diploma. Help clients with ADHD thrive. Start earning $4K-$8K/month.",
};

export default function ADHDCoachingMiniDiplomaPage() {
    return <NicheMiniDiplomaPage config={getNicheConfig("adhd-coaching")} />;
}
