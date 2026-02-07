import NicheMiniDiplomaPage from "@/components/mini-diploma/niche-landing-page";
import { getNicheConfig } from "@/components/mini-diploma/landing-page-registry";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Life Coaching Mini Diploma — Free 1-Hour Certification | AccrediPro",
    description: "Get certified as a Life Coach in just 1 hour. Free ASI-verified mini diploma. Help people break through and design their ideal life. Start earning $4K-$8K/month.",
};

export default function LifeCoachingMiniDiplomaPage() {
    return <NicheMiniDiplomaPage config={getNicheConfig("life-coaching")} />;
}
