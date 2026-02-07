import NicheMiniDiplomaPage from "@/components/mini-diploma/niche-landing-page";
import { getNicheConfig } from "@/components/mini-diploma/landing-page-registry";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Nurse Coach Mini Diploma — Free 1-Hour Certification | AccrediPro",
    description: "Get certified as a Nurse Coach in just 1 hour. Free ASI-verified mini diploma. Use your nursing background to coach holistically. Start earning $4K-$8K/month.",
};

export default function NurseCoachMiniDiplomaPage() {
    return <NicheMiniDiplomaPage config={getNicheConfig("nurse-coach")} />;
}
