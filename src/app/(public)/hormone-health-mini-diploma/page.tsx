import NicheMiniDiplomaPage from "@/components/mini-diploma/niche-landing-page";
import { getNicheConfig } from "@/components/mini-diploma/landing-page-registry";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Hormone Health Mini Diploma — Free 1-Hour Certification | AccrediPro",
    description: "Get certified in Hormone Health in just 1 hour. Free ASI-verified mini diploma. Help women balance hormones naturally. Start earning $4K-$8K/month.",
};

export default function HormoneHealthMiniDiplomaPage() {
    return <NicheMiniDiplomaPage config={getNicheConfig("hormone-health")} />;
}
