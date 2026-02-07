import NicheMiniDiplomaPage from "@/components/mini-diploma/niche-landing-page";
import { getNicheConfig } from "@/components/mini-diploma/landing-page-registry";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Gut Health Mini Diploma — Free 1-Hour Certification | AccrediPro",
    description: "Get certified in Gut Health in just 1 hour. Free ASI-verified mini diploma. Help clients heal bloating, IBS, and chronic digestive issues. Start earning $4K-$8K/month.",
};

export default function GutHealthMiniDiplomaPage() {
    return <NicheMiniDiplomaPage config={getNicheConfig("gut-health")} />;
}
