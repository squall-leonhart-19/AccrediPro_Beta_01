import NicheMiniDiplomaPage from "@/components/mini-diploma/niche-landing-page";
import { getNicheConfig } from "@/components/mini-diploma/landing-page-registry";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Christian Coaching Mini Diploma — Free 1-Hour Certification | AccrediPro",
    description: "Get certified in Christian Coaching in just 1 hour. Free ASI-verified mini diploma. Combine faith with coaching skills. Start earning $4K-$8K/month.",
};

export default function ChristianCoachingMiniDiplomaPage() {
    return <NicheMiniDiplomaPage config={getNicheConfig("christian-coaching")} />;
}
