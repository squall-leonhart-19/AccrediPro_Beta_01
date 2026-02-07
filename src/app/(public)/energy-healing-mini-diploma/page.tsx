import NicheMiniDiplomaPage from "@/components/mini-diploma/niche-landing-page";
import { getNicheConfig } from "@/components/mini-diploma/landing-page-registry";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Energy Healing Mini Diploma — Free 1-Hour Certification | AccrediPro",
    description: "Get certified in Energy Healing in just 1 hour. Free ASI-verified mini diploma. Learn to work with the body's energy systems. Start earning $4K-$8K/month.",
};

export default function EnergyHealingMiniDiplomaPage() {
    return <NicheMiniDiplomaPage config={getNicheConfig("energy-healing")} />;
}
