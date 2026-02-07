import NicheMiniDiplomaPage from "@/components/mini-diploma/niche-landing-page";
import { getNicheConfig } from "@/components/mini-diploma/landing-page-registry";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pet Nutrition Mini Diploma — Free 1-Hour Certification | AccrediPro",
    description: "Get certified in Pet Nutrition & Wellness in just 1 hour. Free ASI-verified mini diploma. Help pet parents make better nutrition choices. Start earning $4K-$8K/month.",
};

export default function PetNutritionMiniDiplomaPage() {
    return <NicheMiniDiplomaPage config={getNicheConfig("pet-nutrition")} />;
}
