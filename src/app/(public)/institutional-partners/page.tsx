import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Building2,
    Users,
    FileCheck,
    Globe,
    Briefcase,
    Shield,
    Award,
    ArrowRight,
    CheckCircle,
    GraduationCap,
    HeartHandshake,
} from "lucide-react";

export const metadata = {
    title: "Institutional Partners | AccrediPro International Standards Institute",
    description: "Partner with AccrediPro ISI for employee credentialing, workforce development, and professional standards integration.",
};

// Brand Colors
const BRAND = {
    burgundy: "#722f37",
    burgundyDark: "#4e1f24",
    gold: "#d4af37",
    goldLight: "#e8c547",
    cream: "#fdf8f0",
};

export default function InstitutionalPartnersPage() {
    const partnerTypes = [
        {
            title: "Healthcare Organizations",
            icon: HeartHandshake,
            description: "Hospitals, clinics, and wellness centers seeking to credential staff in integrative health practices.",
            benefits: ["Verified practitioner credentials", "Bulk enrollment programs", "Custom competency frameworks"],
        },
        {
            title: "Educational Institutions",
            icon: GraduationCap,
            description: "Universities and colleges integrating professional certification into academic programs.",
            benefits: ["Curriculum alignment", "Credit transfer pathways", "Co-branded credentials"],
        },
        {
            title: "Corporate Wellness",
            icon: Briefcase,
            description: "Companies investing in employee health coaching and wellness program development.",
            benefits: ["Workforce credentialing", "Training partnerships", "ROI documentation"],
        },
        {
            title: "Government & NGOs",
            icon: Globe,
            description: "Public health organizations and nonprofits establishing professional standards.",
            benefits: ["Standards consultation", "Policy alignment", "International recognition"],
        },
    ];

    const integrations = [
        {
            title: "Credential Verification API",
            description: "Real-time verification of practitioner credentials for your HR and compliance systems.",
        },
        {
            title: "Learning Management Integration",
            description: "Seamless integration with your existing LMS for employee training and tracking.",
        },
        {
            title: "Custom Competency Frameworks",
            description: "Develop organization-specific competency standards aligned with ISI benchmarks.",
        },
        {
            title: "Batch Credential Processing",
            description: "Efficient processing for large-scale workforce credentialing initiatives.",
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="relative text-white py-20" style={{ backgroundColor: BRAND.burgundyDark }}>
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}40` }}>
                        <Building2 className="w-4 h-4" style={{ color: BRAND.gold }} />
                        <span className="text-sm font-medium" style={{ color: BRAND.gold }}>B2B Partnerships</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Institutional Partnerships
                    </h1>
                    <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: "#f5e6e8" }}>
                        Partner with AccrediPro International Standards Institute for workforce credentialing,
                        professional development, and standards integration.
                    </p>
                </div>
            </section>

            {/* Partner Types */}
            <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
                            Partnership Programs
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Tailored partnership solutions for organizations of all types
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {partnerTypes.map((partner, i) => (
                            <div key={i} className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: BRAND.burgundy }}>
                                        <partner.icon className="w-7 h-7" style={{ color: BRAND.gold }} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2" style={{ color: BRAND.burgundy }}>{partner.title}</h3>
                                        <p className="text-gray-600 mb-4">{partner.description}</p>
                                        <ul className="space-y-2">
                                            {partner.benefits.map((benefit, j) => (
                                                <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                                                    <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: BRAND.gold }} />
                                                    {benefit}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Integrations */}
            <section className="py-16 md:py-24" style={{ backgroundColor: BRAND.cream }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
                            Enterprise Integrations
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Technical solutions for seamless credential management
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {integrations.map((integration, i) => (
                            <div key={i} className="bg-white rounded-xl p-6 border border-gray-100">
                                <h3 className="font-bold mb-2" style={{ color: BRAND.burgundy }}>{integration.title}</h3>
                                <p className="text-gray-600 text-sm">{integration.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold mb-2" style={{ color: BRAND.burgundy }}>500+</div>
                            <div className="text-gray-600 text-sm">Partner Organizations</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2" style={{ color: BRAND.burgundy }}>45+</div>
                            <div className="text-gray-600 text-sm">Countries</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2" style={{ color: BRAND.burgundy }}>20K+</div>
                            <div className="text-gray-600 text-sm">Credentialed Professionals</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2" style={{ color: BRAND.burgundy }}>99%</div>
                            <div className="text-gray-600 text-sm">Partner Satisfaction</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 text-center" style={{ backgroundColor: BRAND.burgundyDark }}>
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-4 text-white">
                        Become an Institutional Partner
                    </h2>
                    <p className="mb-8" style={{ color: "#f5e6e8" }}>
                        Contact our partnerships team to discuss how ISI credentials can benefit your organization.
                    </p>
                    <Link href="/contact">
                        <Button size="lg" style={{ backgroundColor: BRAND.gold, color: BRAND.burgundyDark }}>
                            Contact Partnerships Team
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
