import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Award,
    FileCheck,
    Briefcase,
    GraduationCap,
    CheckCircle,
    ArrowRight,
    Clock,
    Users,
} from "lucide-react";

export const metadata = {
    title: "Recognition of Prior Learning | AccrediPro International Standards Institute",
    description: "AccrediPro ISI's policy on Recognition of Prior Learning (RPL) for professionals with existing qualifications and experience.",
};

const BRAND = {
    burgundy: "#722f37",
    burgundyDark: "#4e1f24",
    gold: "#d4af37",
    cream: "#fdf8f0",
};

export default function PriorLearningPage() {
    const rplTypes = [
        {
            title: "Prior Qualifications",
            description: "Formal credentials from accredited institutions",
            examples: ["University degrees", "Professional certifications", "Vocational qualifications"],
            icon: GraduationCap,
        },
        {
            title: "Professional Experience",
            description: "Relevant work experience in the field",
            examples: ["Clinical practice hours", "Coaching experience", "Healthcare employment"],
            icon: Briefcase,
        },
        {
            title: "Continuing Education",
            description: "Ongoing professional development",
            examples: ["CPD courses", "Workshops and seminars", "Conference attendance"],
            icon: Award,
        },
    ];

    const process = [
        {
            step: "1",
            title: "Application",
            description: "Submit RPL application with supporting documentation including certificates, transcripts, and experience evidence.",
        },
        {
            step: "2",
            title: "Portfolio Review",
            description: "Our assessors review your evidence portfolio against ISI competency frameworks.",
        },
        {
            step: "3",
            title: "Gap Analysis",
            description: "Any gaps between your prior learning and ISI requirements are identified.",
        },
        {
            step: "4",
            title: "Outcome",
            description: "You receive notification of credit awarded and any additional requirements.",
        },
    ];

    const outcomes = [
        {
            title: "Full Exemption",
            description: "Complete waiver of specific modules or assessments where competency is demonstrated",
        },
        {
            title: "Partial Credit",
            description: "Reduction in requirements with supplementary assessment or learning needed",
        },
        {
            title: "Fast-Track Pathway",
            description: "Accelerated route to credential with customized learning plan",
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="relative py-16 text-white" style={{ backgroundColor: BRAND.burgundyDark }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}40` }}>
                        <Award className="w-4 h-4" style={{ color: BRAND.gold }} />
                        <span className="text-sm font-medium" style={{ color: BRAND.gold }}>Academic Policy</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Recognition of Prior Learning</h1>
                    <p className="text-xl max-w-3xl" style={{ color: "#f5e6e8" }}>
                        AccrediPro ISI recognizes that professionals arrive with diverse backgrounds and existing
                        competencies. Our RPL policy ensures fair recognition of prior achievements.
                    </p>
                </div>
            </section>

            {/* Overview */}
            <section className="py-12 border-b border-gray-100" style={{ backgroundColor: BRAND.cream }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="bg-white rounded-xl p-8 border border-gray-100">
                        <h2 className="text-xl font-bold mb-4" style={{ color: BRAND.burgundy }}>What is RPL?</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Recognition of Prior Learning (RPL) is the process of formally acknowledging skills,
                            knowledge, and competencies you have gained through previous education, training,
                            and professional experience. Through RPL, you may receive credit toward ISI credentials,
                            reducing duplication of learning and accelerating your path to certification.
                        </p>
                    </div>
                </div>
            </section>

            {/* Types */}
            <section className="py-12 border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-8" style={{ color: BRAND.burgundy }}>What Can Be Recognized</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {rplTypes.map((type, i) => (
                            <div key={i} className="bg-gray-50 rounded-xl p-6">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: BRAND.burgundy }}>
                                    <type.icon className="w-6 h-6" style={{ color: BRAND.gold }} />
                                </div>
                                <h3 className="font-bold mb-2" style={{ color: BRAND.burgundy }}>{type.title}</h3>
                                <p className="text-gray-600 text-sm mb-4">{type.description}</p>
                                <ul className="space-y-2">
                                    {type.examples.map((example, j) => (
                                        <li key={j} className="flex items-center gap-2 text-sm text-gray-500">
                                            <CheckCircle className="w-4 h-4" style={{ color: BRAND.gold }} />
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
            <section className="py-12" style={{ backgroundColor: BRAND.cream }}>
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-8" style={{ color: BRAND.burgundy }}>RPL Process</h2>
                    <div className="grid md:grid-cols-4 gap-4">
                        {process.map((step, i) => (
                            <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 text-center">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-white" style={{ backgroundColor: BRAND.burgundy }}>
                                    {step.step}
                                </div>
                                <h3 className="font-bold mb-2" style={{ color: BRAND.burgundy }}>{step.title}</h3>
                                <p className="text-gray-600 text-sm">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Outcomes */}
            <section className="py-12 border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-6" style={{ color: BRAND.burgundy }}>Possible Outcomes</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {outcomes.map((outcome, i) => (
                            <div key={i} className="bg-gray-50 rounded-xl p-6">
                                <h3 className="font-bold mb-2" style={{ color: BRAND.burgundy }}>{outcome.title}</h3>
                                <p className="text-gray-600 text-sm">{outcome.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-12 text-center">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
                        Apply for RPL Assessment
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Contact our Academic Services team to discuss your prior learning and begin
                        the RPL assessment process.
                    </p>
                    <Link href="/contact">
                        <Button size="lg" style={{ backgroundColor: BRAND.burgundy, color: "white" }}>
                            Contact Academic Services
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
