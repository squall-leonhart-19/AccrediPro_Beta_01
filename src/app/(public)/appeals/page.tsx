import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Scale,
    FileText,
    Clock,
    CheckCircle,
    ArrowRight,
    AlertCircle,
    Users,
    Shield,
} from "lucide-react";

export const metadata = {
    title: "Appeals Procedure | AccrediPro International Standards Institute",
    description: "Formal appeals process for assessment decisions, credential actions, and professional standards matters at AccrediPro ISI.",
};

const BRAND = {
    burgundy: "#722f37",
    burgundyDark: "#4e1f24",
    gold: "#d4af37",
    cream: "#fdf8f0",
};

export default function AppealsPage() {
    const appealTypes = [
        {
            title: "Assessment Appeals",
            description: "Challenge the outcome of an examination or competency assessment",
            examples: ["Re-evaluation of exam scoring", "Review of assessment conditions", "Consideration of extenuating circumstances"],
        },
        {
            title: "Credential Actions",
            description: "Contest decisions regarding credential status",
            examples: ["Credential suspension", "Revocation decisions", "Recertification denials"],
        },
        {
            title: "Procedural Appeals",
            description: "Challenge processes or procedures applied",
            examples: ["Application decisions", "Reasonable adjustment requests", "Eligibility determinations"],
        },
    ];

    const process = [
        {
            step: "1",
            title: "Submit Appeal",
            description: "Complete the formal appeal form within 30 days of the decision. Include all supporting documentation.",
            timeline: "Within 30 days",
        },
        {
            step: "2",
            title: "Initial Review",
            description: "The Appeals Committee reviews your submission for completeness and eligibility.",
            timeline: "5 business days",
        },
        {
            step: "3",
            title: "Investigation",
            description: "Thorough review of the original decision, documentation, and any new evidence submitted.",
            timeline: "15 business days",
        },
        {
            step: "4",
            title: "Panel Decision",
            description: "The Appeals Panel convenes to review findings and render a final decision.",
            timeline: "10 business days",
        },
        {
            step: "5",
            title: "Outcome Notification",
            description: "Written notification of the decision with detailed reasoning and any applicable remedies.",
            timeline: "5 business days",
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="relative py-16 text-white" style={{ backgroundColor: BRAND.burgundyDark }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}40` }}>
                        <Scale className="w-4 h-4" style={{ color: BRAND.gold }} />
                        <span className="text-sm font-medium" style={{ color: BRAND.gold }}>Governance Policy</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Appeals Procedure</h1>
                    <p className="text-xl max-w-3xl" style={{ color: "#f5e6e8" }}>
                        AccrediPro ISI is committed to fair and transparent decision-making. This procedure
                        outlines the formal process for appealing institutional decisions.
                    </p>
                </div>
            </section>

            {/* Scope */}
            <section className="py-12 border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-6" style={{ color: BRAND.burgundy }}>Scope of Appeals</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {appealTypes.map((type, i) => (
                            <div key={i} className="bg-gray-50 rounded-xl p-6">
                                <h3 className="font-bold mb-2" style={{ color: BRAND.burgundy }}>{type.title}</h3>
                                <p className="text-gray-600 text-sm mb-4">{type.description}</p>
                                <ul className="space-y-2">
                                    {type.examples.map((example, j) => (
                                        <li key={j} className="flex items-start gap-2 text-sm text-gray-500">
                                            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BRAND.gold }} />
                                            {example}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process */}
            <section className="py-12">
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-8" style={{ color: BRAND.burgundy }}>Appeals Process</h2>
                    <div className="space-y-6">
                        {process.map((step, i) => (
                            <div key={i} className="flex gap-6 items-start">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white" style={{ backgroundColor: BRAND.burgundy }}>
                                    {step.step}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-2">
                                        <h3 className="text-lg font-bold" style={{ color: BRAND.burgundy }}>{step.title}</h3>
                                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                            <Clock className="w-3 h-3 inline mr-1" />{step.timeline}
                                        </span>
                                    </div>
                                    <p className="text-gray-600">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Important Notes */}
            <section className="py-12" style={{ backgroundColor: BRAND.cream }}>
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-6" style={{ color: BRAND.burgundy }}>Important Information</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl p-6 border border-gray-100">
                            <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: BRAND.burgundy }}>
                                <AlertCircle className="w-5 h-5" style={{ color: BRAND.gold }} />
                                Grounds for Appeal
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>• Procedural irregularity in the original decision</li>
                                <li>• New evidence not available at the time of decision</li>
                                <li>• Extenuating circumstances not previously considered</li>
                                <li>• Bias or conflict of interest in original process</li>
                            </ul>
                        </div>
                        <div className="bg-white rounded-xl p-6 border border-gray-100">
                            <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: BRAND.burgundy }}>
                                <Shield className="w-5 h-5" style={{ color: BRAND.gold }} />
                                Your Rights
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>• Right to a fair and impartial review</li>
                                <li>• Right to submit supporting evidence</li>
                                <li>• Right to written reasons for all decisions</li>
                                <li>• Right to representation or support</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-12 text-center">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
                        Submit an Appeal
                    </h2>
                    <p className="text-gray-600 mb-6">
                        To initiate a formal appeal, contact our Appeals Committee with your documentation.
                    </p>
                    <Link href="/contact">
                        <Button size="lg" style={{ backgroundColor: BRAND.burgundy, color: "white" }}>
                            Contact Appeals Committee
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
