import NicheMiniDiplomaPage from "@/components/mini-diploma/niche-landing-page";
import { getNicheConfig } from "@/components/mini-diploma/landing-page-registry";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Health Coach Mini Diploma — Free 1-Hour Certification | AccrediPro",
    description: "Get certified as a Health Coach in just 1 hour. Free ASI-verified mini diploma. Help clients build healthier habits. Start earning $4K-$8K/month.",
};

export default function HealthCoachMiniDiplomaPage() {
    return <NicheMiniDiplomaPage config={getNicheConfig("health-coach")} />;
}
