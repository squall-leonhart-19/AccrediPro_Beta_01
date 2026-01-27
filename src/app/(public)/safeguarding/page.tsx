import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Shield,
    AlertTriangle,
    Users,
    CheckCircle,
    ArrowRight,
    Phone,
    Heart,
    Eye,
} from "lucide-react";

export const metadata = {
    title: "Safeguarding Policy | AccrediPro International Standards Institute",
    description: "AccrediPro ISI's commitment to safeguarding and protecting vulnerable individuals across all activities.",
};

const BRAND = {
    burgundy: "#722f37",
    burgundyDark: "#4e1f24",
    gold: "#d4af37",
    cream: "#fdf8f0",
};

export default function SafeguardingPage() {
    const principles = [
        {
            title: "Prevention",
            description: "We take proactive measures to prevent harm and create safe learning environments.",
            icon: Shield,
        },
        {
            title: "Recognition",
            description: "Staff and assessors are trained to recognize signs of abuse, neglect, or exploitation.",
            icon: Eye,
        },
        {
            title: "Response",
            description: "Clear procedures ensure swift and appropriate response to safeguarding concerns.",
            icon: AlertTriangle,
        },
        {
            title: "Support",
            description: "We provide support and signposting for individuals who may be at risk.",
            icon: Heart,
        },
    ];

    const responsibilities = [
        "Ensure all staff and contractors complete safeguarding training",
        "Maintain clear reporting procedures for safeguarding concerns",
        "Conduct appropriate background checks where required",
        "Create a culture where safeguarding is everyone's responsibility",
        "Review and update safeguarding policies annually",
        "Comply with relevant legislation and statutory guidance",
    ];

    const whatToReport = [
        "Concerns about abuse or neglect",
        "Disclosure of harm by a candidate or colleague",
        "Concerning behavior by staff, contractors, or others",
        "Signs of radicalization or extremism",
        "Self-harm or suicidal ideation",
        "Online safety concerns",
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="relative py-16 text-white" style={{ backgroundColor: BRAND.burgundyDark }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}40` }}>
                        <Shield className="w-4 h-4" style={{ color: BRAND.gold }} />
                        <span className="text-sm font-medium" style={{ color: BRAND.gold }}>Governance Policy</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Safeguarding Policy</h1>
                    <p className="text-xl max-w-3xl" style={{ color: "#f5e6e8" }}>
                        AccrediPro ISI is committed to safeguarding and promoting the welfare of all
                        individuals engaged with our organization, particularly those who may be vulnerable.
                    </p>
                </div>
            </section>

            {/* Statement */}
            <section className="py-12 border-b border-gray-100" style={{ backgroundColor: BRAND.cream }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="bg-white rounded-xl p-8 border border-gray-100">
                        <h2 className="text-xl font-bold mb-4" style={{ color: BRAND.burgundy }}>Our Commitment</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Everyone has the right to live free from abuse, neglect, and exploitation. AccrediPro
                            International Standards Institute takes seriously its responsibility to safeguard
                            all individuals who interact with our organization, services, and credentialed professionals.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            This policy applies to all staff, contractors, assessors, and credentialed professionals
                            acting on behalf of ISI. We expect all professionals holding ISI credentials to uphold
                            safeguarding principles in their practice.
                        </p>
                    </div>
                </div>
            </section>

            {/* Principles */}
            <section className="py-12 border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-8" style={{ color: BRAND.burgundy }}>Safeguarding Principles</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {principles.map((item, i) => (
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

            {/* Responsibilities */}
            <section className="py-12" style={{ backgroundColor: BRAND.cream }}>
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-6" style={{ color: BRAND.burgundy }}>Institutional Responsibilities</h2>
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <ul className="grid md:grid-cols-2 gap-4">
                            {responsibilities.map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: BRAND.gold }} />
                                    <span className="text-gray-600">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* What to Report */}
            <section className="py-12 border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-6" style={{ color: BRAND.burgundy }}>What to Report</h2>
                    <p className="text-gray-600 mb-6">
                        If you observe or become aware of any of the following, you should report it immediately:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                        {whatToReport.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                <AlertTriangle className="w-5 h-5" style={{ color: BRAND.gold }} />
                                <span className="text-gray-600">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reporting */}
            <section className="py-12 text-center">
                <div className="max-w-3xl mx-auto px-4">
                    <Phone className="w-12 h-12 mx-auto mb-4" style={{ color: BRAND.gold }} />
                    <h2 className="text-2xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
                        Report a Safeguarding Concern
                    </h2>
                    <p className="text-gray-600 mb-6">
                        If you have a safeguarding concern, please report it immediately to our
                        Designated Safeguarding Lead. In an emergency, always contact local emergency services first.
                    </p>
                    <Link href="/contact">
                        <Button size="lg" style={{ backgroundColor: BRAND.burgundy, color: "white" }}>
                            Contact Safeguarding Lead
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
