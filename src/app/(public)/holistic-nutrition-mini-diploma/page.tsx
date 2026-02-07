import NicheMiniDiplomaPage from "@/components/mini-diploma/niche-landing-page";
import { getNicheConfig } from "@/components/mini-diploma/landing-page-registry";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Holistic Nutrition Mini Diploma — Free 1-Hour Certification | AccrediPro",
    description: "Get certified in Holistic Nutrition in just 1 hour. Free ASI-verified mini diploma. Help clients use food as medicine. Start earning $4K-$8K/month.",
};

export default function HolisticNutritionMiniDiplomaPage() {
    return <NicheMiniDiplomaPage config={getNicheConfig("holistic-nutrition")} />;
}
