import NicheMiniDiplomaPage from "@/components/mini-diploma/niche-landing-page";
import { getNicheConfig } from "@/components/mini-diploma/landing-page-registry";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Reiki Healing Mini Diploma — Free 1-Hour Certification | AccrediPro",
    description: "Get certified in Reiki Healing in just 1 hour. Free ASI-verified mini diploma. Channel universal energy to help clients heal. Start earning $4K-$8K/month.",
};

export default function ReikiHealingMiniDiplomaPage() {
    return <NicheMiniDiplomaPage config={getNicheConfig("reiki-healing")} />;
}
