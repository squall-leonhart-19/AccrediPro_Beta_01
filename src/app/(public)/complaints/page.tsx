import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    MessageSquare,
    FileText,
    Clock,
    CheckCircle,
    ArrowRight,
    AlertCircle,
    Shield,
    Users,
} from "lucide-react";

export const metadata = {
    title: "Complaints Procedure | AccrediPro International Standards Institute",
    description: "Formal complaints process for AccrediPro ISI. We take all complaints seriously and are committed to resolving concerns fairly.",
};

const BRAND = {
    burgundy: "#722f37",
    burgundyDark: "#4e1f24",
    gold: "#d4af37",
    cream: "#fdf8f0",
};

export default function ComplaintsPage() {
    const complaintTypes = [
        {
            title: "Service Complaints",
            description: "Concerns about the quality of services provided",
            examples: ["Learning platform issues", "Support response times", "Resource accessibility"],
        },
        {
            title: "Staff Conduct",
            description: "Concerns about the behavior of ISI personnel",
            examples: ["Unprofessional conduct", "Communication issues", "Bias or unfair treatment"],
        },
        {
            title: "Process Complaints",
            description: "Issues with institutional procedures",
            examples: ["Assessment administration", "Application processes", "Credential issuance delays"],
        },
    ];

    const stages = [
        {
            stage: "Stage 1",
            title: "Informal Resolution",
            description: "Many concerns can be resolved quickly through direct communication with the relevant department.",
            timeline: "Response within 3 business days",
            action: "Contact the relevant team directly",
        },
        {
            stage: "Stage 2",
            title: "Formal Complaint",
            description: "If informal resolution is unsuccessful, submit a formal written complaint to the Complaints Officer.",
            timeline: "Acknowledgment within 5 business days",
            action: "Submit formal complaint form",
        },
        {
            stage: "Stage 3",
            title: "Investigation",
            description: "The Complaints Officer investigates your concerns, gathering evidence and interviewing relevant parties.",
            timeline: "Investigation complete within 20 business days",
            action: "Cooperate with investigation as needed",
        },
        {
            stage: "Stage 4",
            title: "Resolution",
            description: "Written response detailing findings, decisions, and any remedial actions to be taken.",
            timeline: "Resolution within 30 business days of complaint",
            action: "Review outcome and remedies",
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="relative py-16 text-white" style={{ backgroundColor: BRAND.burgundyDark }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}40` }}>
                        <MessageSquare className="w-4 h-4" style={{ color: BRAND.gold }} />
                        <span className="text-sm font-medium" style={{ color: BRAND.gold }}>Governance Policy</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Complaints Procedure</h1>
                    <p className="text-xl max-w-3xl" style={{ color: "#f5e6e8" }}>
                        AccrediPro ISI is committed to providing the highest quality services. We take all
                        complaints seriously and aim to resolve concerns fairly and promptly.
                    </p>
                </div>
            </section>

            {/* Commitment */}
            <section className="py-12 border-b border-gray-100" style={{ backgroundColor: BRAND.cream }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: BRAND.burgundy }}>
                                <Clock className="w-6 h-6" style={{ color: BRAND.gold }} />
                            </div>
                            <h3 className="font-bold mb-1" style={{ color: BRAND.burgundy }}>Timely Response</h3>
                            <p className="text-sm text-gray-600">All complaints acknowledged within 5 business days</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: BRAND.burgundy }}>
                                <Shield className="w-6 h-6" style={{ color: BRAND.gold }} />
                            </div>
                            <h3 className="font-bold mb-1" style={{ color: BRAND.burgundy }}>Fair Process</h3>
                            <p className="text-sm text-gray-600">Impartial investigation by trained personnel</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: BRAND.burgundy }}>
                                <CheckCircle className="w-6 h-6" style={{ color: BRAND.gold }} />
                            </div>
                            <h3 className="font-bold mb-1" style={{ color: BRAND.burgundy }}>Resolution Focus</h3>
                            <p className="text-sm text-gray-600">We seek positive outcomes for all parties</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Complaint Types */}
            <section className="py-12 border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-6" style={{ color: BRAND.burgundy }}>Types of Complaints</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {complaintTypes.map((type, i) => (
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
                    <h2 className="text-2xl font-bold mb-8" style={{ color: BRAND.burgundy }}>Complaints Process</h2>
                    <div className="space-y-6">
                        {stages.map((stage, i) => (
                            <div key={i} className="bg-gray-50 rounded-xl p-6">
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ backgroundColor: BRAND.burgundy, color: "white" }}>
                                            {stage.stage}
                                        </span>
                                        <h3 className="text-lg font-bold" style={{ color: BRAND.burgundy }}>{stage.title}</h3>
                                    </div>
                                    <span className="text-xs px-2 py-1 rounded-full bg-white border border-gray-200 text-gray-500">
                                        <Clock className="w-3 h-3 inline mr-1" />{stage.timeline}
                                    </span>
                                </div>
                                <p className="text-gray-600 mt-3">{stage.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Escalation */}
            <section className="py-12" style={{ backgroundColor: BRAND.cream }}>
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-6" style={{ color: BRAND.burgundy }}>Escalation & External Review</h2>
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <div className="flex items-start gap-4">
                            <AlertCircle className="w-6 h-6 flex-shrink-0" style={{ color: BRAND.gold }} />
                            <div>
                                <p className="text-gray-600 mb-4">
                                    If you remain dissatisfied after completing our internal complaints process, you may
                                    request an independent review or escalate to relevant external bodies.
                                </p>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>• Request review by the ISI Governance Board</li>
                                    <li>• Contact relevant regulatory bodies in your jurisdiction</li>
                                    <li>• Seek independent mediation services</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-12 text-center">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
                        Submit a Complaint
                    </h2>
                    <p className="text-gray-600 mb-6">
                        We encourage you to raise concerns so we can address them. All complaints are treated confidentially.
                    </p>
                    <Link href="/contact">
                        <Button size="lg" style={{ backgroundColor: BRAND.burgundy, color: "white" }}>
                            Contact Complaints Officer
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
