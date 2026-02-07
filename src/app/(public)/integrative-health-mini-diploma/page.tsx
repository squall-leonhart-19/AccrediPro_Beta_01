import NicheMiniDiplomaPage from "@/components/mini-diploma/niche-landing-page";
import { getNicheConfig } from "@/components/mini-diploma/landing-page-registry";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Integrative Health Mini Diploma — Free 1-Hour Certification | AccrediPro",
    description: "Get certified in Integrative Health in just 1 hour. Free ASI-verified mini diploma. Bridge conventional and holistic medicine. Start earning $4K-$8K/month.",
};

export default function IntegrativeHealthMiniDiplomaPage() {
    return <NicheMiniDiplomaPage config={getNicheConfig("integrative-health")} />;
}
