import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Award,
    ClipboardCheck,
    RefreshCw,
    Users,
    FileSearch,
    TrendingUp,
    CheckCircle,
    ArrowRight,
    Shield,
} from "lucide-react";

export const metadata = {
    title: "Quality Assurance | AccrediPro International Standards Institute",
    description: "AccrediPro ISI's quality assurance framework ensuring the highest standards in professional credentialing and assessment.",
};

const BRAND = {
    burgundy: "#722f37",
    burgundyDark: "#4e1f24",
    gold: "#d4af37",
    cream: "#fdf8f0",
};

export default function QualityAssurancePage() {
    const framework = [
        {
            title: "Standards Development",
            description: "Competency frameworks developed through rigorous research, industry consultation, and expert review.",
            icon: FileSearch,
        },
        {
            title: "Assessment Validity",
            description: "Regular validation of assessments to ensure they accurately measure required competencies.",
            icon: ClipboardCheck,
        },
        {
            title: "External Review",
            description: "Independent external audits and benchmarking against international standards.",
            icon: Users,
        },
        {
            title: "Continuous Improvement",
            description: "Systematic collection and analysis of feedback to drive ongoing enhancement.",
            icon: RefreshCw,
        },
    ];

    const processes = [
        {
            title: "Standards Committee Review",
            frequency: "Quarterly",
            description: "Review of competency frameworks and assessment criteria by the Standards Committee",
        },
        {
            title: "Assessment Moderation",
            frequency: "Ongoing",
            description: "Regular sampling and moderation of assessments to ensure consistency and fairness",
        },
        {
            title: "Candidate Feedback Analysis",
            frequency: "Monthly",
            description: "Systematic review of candidate feedback and satisfaction metrics",
        },
        {
            title: "External Audit",
            frequency: "Annual",
            description: "Independent third-party audit of QA systems and processes",
        },
        {
            title: "Credential Verification Accuracy",
            frequency: "Quarterly",
            description: "Audit of verification systems to ensure credential integrity",
        },
        {
            title: "Curriculum Currency Review",
            frequency: "Bi-annual",
            description: "Review of educational content against current research and best practices",
        },
    ];

    const kpis = [
        { metric: "Assessment Reliability", target: ">0.85", description: "Inter-rater reliability coefficient" },
        { metric: "Candidate Satisfaction", target: ">90%", description: "Would recommend to colleagues" },
        { metric: "Credential Accuracy", target: "100%", description: "Verification accuracy rate" },
        { metric: "Complaint Resolution", target: "<30 days", description: "Average resolution time" },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="relative py-16 text-white" style={{ backgroundColor: BRAND.burgundyDark }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}40` }}>
                        <Award className="w-4 h-4" style={{ color: BRAND.gold }} />
                        <span className="text-sm font-medium" style={{ color: BRAND.gold }}>Standards Policy</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Quality Assurance</h1>
                    <p className="text-xl max-w-3xl" style={{ color: "#f5e6e8" }}>
                        Our commitment to quality underpins every credential we issue. This policy outlines
                        our systematic approach to maintaining the highest standards.
                    </p>
                </div>
            </section>

            {/* Framework */}
            <section className="py-12 border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-8" style={{ color: BRAND.burgundy }}>QA Framework</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {framework.map((item, i) => (
                            <div key={i} className="flex gap-4 p-6 bg-gray-50 rounded-xl">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: BRAND.burgundy }}>
                                    <item.icon className="w-6 h-6" style={{ color: BRAND.gold }} />
                                </div>
                                <div>
                                    <h3 className="font-bold mb-2" style={{ color: BRAND.burgundy }}>{item.title}</h3>
                                    <p className="text-gray-600 text-sm">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Processes */}
            <section className="py-12" style={{ backgroundColor: BRAND.cream }}>
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-8" style={{ color: BRAND.burgundy }}>QA Processes</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {processes.map((process, i) => (
                            <div key={i} className="bg-white rounded-xl p-5 border border-gray-100">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold" style={{ color: BRAND.burgundy }}>{process.title}</h3>
                                    <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${BRAND.gold}20`, color: BRAND.burgundy }}>
                                        {process.frequency}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm">{process.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* KPIs */}
            <section className="py-12 border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-6" style={{ color: BRAND.burgundy }}>Quality Metrics</h2>
                    <div className="grid md:grid-cols-4 gap-4">
                        {kpis.map((kpi, i) => (
                            <div key={i} className="text-center p-6 bg-gray-50 rounded-xl">
                                <div className="text-3xl font-bold mb-1" style={{ color: BRAND.burgundy }}>{kpi.target}</div>
                                <div className="font-semibold text-sm mb-2" style={{ color: BRAND.gold }}>{kpi.metric}</div>
                                <div className="text-xs text-gray-500">{kpi.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Governance */}
            <section className="py-12">
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-6" style={{ color: BRAND.burgundy }}>QA Governance</h2>
                    <div className="bg-gray-50 rounded-xl p-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: BRAND.burgundy }}>
                                    <Shield className="w-5 h-5" style={{ color: BRAND.gold }} />
                                    Standards Committee
                                </h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    The Standards Committee has overall responsibility for quality assurance,
                                    including approval of assessment criteria, review of QA reports, and
                                    recommendation of improvements.
                                </p>
                                <Link href="/governance" className="text-sm font-semibold flex items-center gap-1" style={{ color: BRAND.burgundy }}>
                                    Learn about governance <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <div>
                                <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: BRAND.burgundy }}>
                                    <TrendingUp className="w-5 h-5" style={{ color: BRAND.gold }} />
                                    Continuous Improvement
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Quality assurance is not a one-time activity. We systematically collect
                                    feedback, analyze trends, and implement improvements to ensure our
                                    standards remain current and our processes effective.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-12 text-center" style={{ backgroundColor: BRAND.cream }}>
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
                        Questions About Quality Standards?
                    </h2>
                    <p className="text-gray-600 mb-6">
                        For inquiries about our quality assurance processes or to provide feedback,
                        contact our Quality Assurance team.
                    </p>
                    <Link href="/contact">
                        <Button size="lg" style={{ backgroundColor: BRAND.burgundy, color: "white" }}>
                            Contact QA Team
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
