import NicheMiniDiplomaPage from "@/components/mini-diploma/niche-landing-page";
import { getNicheConfig } from "@/components/mini-diploma/landing-page-registry";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Women's Hormone Health Mini Diploma — Free 1-Hour Certification | AccrediPro",
    description: "Get certified in Women's Hormone Health in just 1 hour. Free ASI-verified mini diploma. Help women navigate menopause and hormonal transitions. Start earning $4K-$8K/month.",
};

export default function WomensHormoneHealthMiniDiplomaPage() {
    return <NicheMiniDiplomaPage config={getNicheConfig("womens-hormone-health")} />;
}
