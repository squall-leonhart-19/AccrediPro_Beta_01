import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Shield,
    Users,
    FileCheck,
    Scale,
    Building2,
    GraduationCap,
    Globe,
    Award,
    ArrowRight,
    CheckCircle,
} from "lucide-react";

export const metadata = {
    title: "Governance | AccrediPro International Standards Institute",
    description: "Learn about AccrediPro ISI's governance structure, standards committee, advisory board, and commitment to professional integrity.",
};

// Brand Colors
const BRAND = {
    burgundy: "#722f37",
    burgundyDark: "#4e1f24",
    gold: "#d4af37",
    goldLight: "#e8c547",
    cream: "#fdf8f0",
};

export default function GovernancePage() {
    const governanceStructure = [
        {
            title: "Standards Committee",
            icon: FileCheck,
            description: "Defines and maintains competency frameworks, assessment criteria, and professional benchmarks across all certification areas.",
            members: ["Industry Experts", "Academic Advisors", "Practicing Professionals"],
        },
        {
            title: "Ethics Board",
            icon: Scale,
            description: "Oversees professional conduct standards, reviews complaints, and ensures adherence to the ISI Code of Ethics.",
            members: ["Legal Counsel", "Senior Practitioners", "Public Representatives"],
        },
        {
            title: "Academic Council",
            icon: GraduationCap,
            description: "Manages university partnerships, degree pathway alignment, and academic credit recognition.",
            members: ["University Partners", "Curriculum Experts", "Accreditation Specialists"],
        },
        {
            title: "International Recognition Committee",
            icon: Globe,
            description: "Coordinates global credential recognition, international partnerships, and cross-border professional mobility.",
            members: ["Regional Directors", "Embassy Liaisons", "Credential Evaluators"],
        },
    ];

    const principles = [
        {
            title: "Independence",
            description: "Standards are set independently of commercial interests to ensure objectivity and public trust.",
        },
        {
            title: "Transparency",
            description: "All competency frameworks, assessment criteria, and governance decisions are publicly documented.",
        },
        {
            title: "Accountability",
            description: "Regular third-party audits ensure compliance with international quality standards.",
        },
        {
            title: "Stakeholder Representation",
            description: "Practitioners, employers, educators, and public interests are represented in all governance bodies.",
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="relative text-white py-20" style={{ backgroundColor: BRAND.burgundyDark }}>
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}40` }}>
                        <Shield className="w-4 h-4" style={{ color: BRAND.gold }} />
                        <span className="text-sm font-medium" style={{ color: BRAND.gold }}>Institutional Governance</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Governance & Oversight
                    </h1>
                    <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: "#f5e6e8" }}>
                        AccrediPro International Standards Institute operates under a robust governance framework
                        designed to ensure credibility, transparency, and professional integrity.
                    </p>
                </div>
            </section>

            {/* Governance Structure */}
            <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
                            Governance Structure
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Our multi-committee structure ensures comprehensive oversight across all institutional functions
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {governanceStructure.map((committee, i) => (
                            <div key={i} className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: BRAND.burgundy }}>
                                        <committee.icon className="w-7 h-7" style={{ color: BRAND.gold }} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2" style={{ color: BRAND.burgundy }}>{committee.title}</h3>
                                        <p className="text-gray-600 mb-4">{committee.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {committee.members.map((member, j) => (
                                                <span key={j} className="text-xs px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-600">
                                                    {member}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Principles */}
            <section className="py-16 md:py-24" style={{ backgroundColor: BRAND.cream }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
                            Governance Principles
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Our operations are guided by core principles that ensure public trust
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {principles.map((principle, i) => (
                            <div key={i} className="bg-white rounded-xl p-6 border border-gray-100">
                                <div className="flex items-start gap-4">
                                    <CheckCircle className="w-6 h-6 flex-shrink-0" style={{ color: BRAND.gold }} />
                                    <div>
                                        <h3 className="font-bold mb-2" style={{ color: BRAND.burgundy }}>{principle.title}</h3>
                                        <p className="text-gray-600 text-sm">{principle.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 text-center">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
                        Questions About Our Governance?
                    </h2>
                    <p className="text-gray-600 mb-8">
                        For inquiries about our governance structure, standards committees, or institutional partnerships,
                        please contact our governance office.
                    </p>
                    <Link href="/contact">
                        <Button size="lg" style={{ backgroundColor: BRAND.burgundy, color: "white" }}>
                            Contact Governance Office
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
