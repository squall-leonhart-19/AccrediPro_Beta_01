import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Heart,
    Users,
    Globe,
    CheckCircle,
    ArrowRight,
    Scale,
    Shield,
    Sparkles,
} from "lucide-react";

export const metadata = {
    title: "Equality & Diversity | AccrediPro International Standards Institute",
    description: "AccrediPro ISI's commitment to equality, diversity, and inclusion across all activities and services.",
};

const BRAND = {
    burgundy: "#722f37",
    burgundyDark: "#4e1f24",
    gold: "#d4af37",
    cream: "#fdf8f0",
};

export default function EqualityDiversityPage() {
    const commitments = [
        {
            title: "Equal Access",
            description: "We ensure equal access to all our programs, assessments, and credentials regardless of background.",
            icon: Scale,
        },
        {
            title: "Inclusive Design",
            description: "Our learning materials and assessments are designed to be accessible and culturally sensitive.",
            icon: Users,
        },
        {
            title: "Global Representation",
            description: "We actively seek diverse perspectives in our standards development and governance.",
            icon: Globe,
        },
        {
            title: "Barrier Removal",
            description: "We identify and remove barriers that may prevent full participation in our programs.",
            icon: Shield,
        },
    ];

    const protectedCharacteristics = [
        "Age",
        "Disability",
        "Gender identity",
        "Marriage and civil partnership",
        "Pregnancy and maternity",
        "Race and ethnicity",
        "Religion or belief",
        "Sex",
        "Sexual orientation",
        "Socioeconomic background",
        "Nationality",
        "Veteran status",
    ];

    const responsibilities = [
        {
            group: "The Institute",
            duties: [
                "Promote equality of opportunity in all activities",
                "Eliminate unlawful discrimination and harassment",
                "Foster good relations between diverse groups",
                "Regularly review policies for equality impact",
            ],
        },
        {
            group: "Staff & Assessors",
            duties: [
                "Treat all candidates with dignity and respect",
                "Apply standards consistently and fairly",
                "Report concerns about discrimination",
                "Participate in equality training",
            ],
        },
        {
            group: "Candidates & Professionals",
            duties: [
                "Treat peers and staff with respect",
                "Uphold professional standards in practice",
                "Report concerns about discrimination",
                "Embrace diversity in professional contexts",
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="relative py-16 text-white" style={{ backgroundColor: BRAND.burgundyDark }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}40` }}>
                        <Heart className="w-4 h-4" style={{ color: BRAND.gold }} />
                        <span className="text-sm font-medium" style={{ color: BRAND.gold }}>Governance Policy</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Equality & Diversity</h1>
                    <p className="text-xl max-w-3xl" style={{ color: "#f5e6e8" }}>
                        AccrediPro ISI is committed to promoting equality, valuing diversity, and creating
                        an inclusive environment where everyone can achieve their full potential.
                    </p>
                </div>
            </section>

            {/* Statement */}
            <section className="py-12 border-b border-gray-100" style={{ backgroundColor: BRAND.cream }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="bg-white rounded-xl p-8 border border-gray-100">
                        <h2 className="text-xl font-bold mb-4" style={{ color: BRAND.burgundy }}>Our Commitment</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            AccrediPro International Standards Institute believes that diversity strengthens our
                            organization, enriches the professional community, and leads to better outcomes for
                            the clients served by our credentialed professionals. We are committed to creating
                            an environment where differences are respected and valued.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            We will not tolerate discrimination, harassment, victimization, or bullying based on
                            any protected characteristic. All individuals have the right to be treated with
                            dignity and respect.
                        </p>
                    </div>
                </div>
            </section>

            {/* Commitments */}
            <section className="py-12 border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-8" style={{ color: BRAND.burgundy }}>Our Commitments</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {commitments.map((item, i) => (
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

            {/* Protected Characteristics */}
            <section className="py-12" style={{ backgroundColor: BRAND.cream }}>
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-6" style={{ color: BRAND.burgundy }}>Protected Characteristics</h2>
                    <p className="text-gray-600 mb-6">
                        We are committed to eliminating discrimination and promoting equality across all protected characteristics:
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {protectedCharacteristics.map((char, i) => (
                            <span key={i} className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700 text-sm">
                                {char}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Responsibilities */}
            <section className="py-12 border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-8" style={{ color: BRAND.burgundy }}>Responsibilities</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {responsibilities.map((group, i) => (
                            <div key={i} className="bg-gray-50 rounded-xl p-6">
                                <h3 className="font-bold mb-4" style={{ color: BRAND.burgundy }}>{group.group}</h3>
                                <ul className="space-y-3">
                                    {group.duties.map((duty, j) => (
                                        <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                                            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BRAND.gold }} />
                                            {duty}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reporting */}
            <section className="py-12 text-center">
                <div className="max-w-3xl mx-auto px-4">
                    <Sparkles className="w-12 h-12 mx-auto mb-4" style={{ color: BRAND.gold }} />
                    <h2 className="text-2xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
                        Report a Concern
                    </h2>
                    <p className="text-gray-600 mb-6">
                        If you experience or witness discrimination, harassment, or behavior contrary to
                        this policy, please report it. All concerns are treated confidentially and seriously.
                    </p>
                    <Link href="/contact">
                        <Button size="lg" style={{ backgroundColor: BRAND.burgundy, color: "white" }}>
                            Report a Concern
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
