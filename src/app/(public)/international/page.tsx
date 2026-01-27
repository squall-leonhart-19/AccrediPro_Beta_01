import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Globe,
    MapPin,
    Building2,
    Users,
    Award,
    ArrowRight,
    CheckCircle,
    FileCheck,
    Shield,
    GraduationCap,
} from "lucide-react";

export const metadata = {
    title: "International Recognition | AccrediPro International Standards Institute",
    description: "Learn about AccrediPro ISI's global presence, international credential recognition, and regional offices.",
};

// Brand Colors
const BRAND = {
    burgundy: "#722f37",
    burgundyDark: "#4e1f24",
    gold: "#d4af37",
    goldLight: "#e8c547",
    cream: "#fdf8f0",
};

export default function InternationalPage() {
    const regions = [
        {
            name: "North America",
            office: "USA Headquarters",
            flag: "🇺🇸",
            countries: ["United States", "Canada", "Mexico"],
            practitioners: "12,000+",
        },
        {
            name: "Europe",
            office: "Swiss Academic Partners",
            flag: "🇨🇭",
            countries: ["Switzerland", "Germany", "UK", "France", "Italy", "Netherlands", "Spain"],
            practitioners: "4,500+",
        },
        {
            name: "Middle East",
            office: "Dubai Regional Office",
            flag: "🇦🇪",
            countries: ["UAE", "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman"],
            practitioners: "2,000+",
        },
        {
            name: "Asia-Pacific",
            office: "Regional Partners",
            flag: "🌏",
            countries: ["Australia", "Singapore", "Hong Kong", "India", "Philippines", "Malaysia"],
            practitioners: "1,500+",
        },
    ];

    const recognitionBodies = [
        "International credential evaluation services",
        "Ministry of Health departments worldwide",
        "Healthcare organizations in 45+ countries",
        "Academic institutions globally",
        "Professional licensing boards",
        "Corporate HR verification systems",
    ];

    const credentialFeatures = [
        {
            title: "Digital Credential Verification",
            description: "Real-time verification accessible from any country through our secure online portal.",
        },
        {
            title: "Multi-Language Documentation",
            description: "Official credential documentation available in major world languages.",
        },
        {
            title: "Recognition Letters",
            description: "Official letters of credential authentication for regulatory bodies.",
        },
        {
            title: "Apostille Ready",
            description: "Documentation prepared for international apostille certification when required.",
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="relative text-white py-20" style={{ backgroundColor: BRAND.burgundyDark }}>
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}40` }}>
                        <Globe className="w-4 h-4" style={{ color: BRAND.gold }} />
                        <span className="text-sm font-medium" style={{ color: BRAND.gold }}>Global Presence</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        International Recognition
                    </h1>
                    <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: "#f5e6e8" }}>
                        AccrediPro ISI credentials are recognized in 45+ countries, with regional offices
                        and partnerships spanning North America, Europe, Middle East, and Asia-Pacific.
                    </p>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="py-12 border-b border-gray-100" style={{ backgroundColor: BRAND.cream }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold mb-2" style={{ color: BRAND.burgundy }}>45+</div>
                            <div className="text-gray-600 text-sm">Countries</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2" style={{ color: BRAND.burgundy }}>20K+</div>
                            <div className="text-gray-600 text-sm">Global Practitioners</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2" style={{ color: BRAND.burgundy }}>3</div>
                            <div className="text-gray-600 text-sm">Regional Offices</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2" style={{ color: BRAND.burgundy }}>6</div>
                            <div className="text-gray-600 text-sm">Continents</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Regional Presence */}
            <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
                            Regional Presence
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Strategic offices and partnerships across major global regions
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {regions.map((region, i) => (
                            <div key={i} className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-3xl">{region.flag}</span>
                                    <div>
                                        <h3 className="text-xl font-bold" style={{ color: BRAND.burgundy }}>{region.name}</h3>
                                        <p className="text-sm text-gray-500">{region.office}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Users className="w-4 h-4" style={{ color: BRAND.gold }} />
                                    <span className="font-semibold" style={{ color: BRAND.burgundy }}>{region.practitioners}</span>
                                    <span className="text-gray-600 text-sm">certified professionals</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {region.countries.map((country, j) => (
                                        <span key={j} className="text-xs px-2 py-1 rounded bg-white border border-gray-200 text-gray-600">
                                            {country}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Credential Recognition */}
            <section className="py-16 md:py-24" style={{ backgroundColor: BRAND.cream }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
                            Credential Recognition
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            ISI credentials are designed for international portability and recognition
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                        {credentialFeatures.map((feature, i) => (
                            <div key={i} className="bg-white rounded-xl p-6 border border-gray-100">
                                <h3 className="font-bold mb-2" style={{ color: BRAND.burgundy }}>{feature.title}</h3>
                                <p className="text-gray-600 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-2xl p-8 border border-gray-100">
                        <h3 className="font-bold mb-4" style={{ color: BRAND.burgundy }}>Recognized By</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                            {recognitionBodies.map((body, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: BRAND.gold }} />
                                    <span className="text-gray-600 text-sm">{body}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 text-center" style={{ backgroundColor: BRAND.burgundyDark }}>
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-4 text-white">
                        Questions About International Recognition?
                    </h2>
                    <p className="mb-8" style={{ color: "#f5e6e8" }}>
                        Contact our international affairs team for credential evaluation assistance
                        or recognition documentation.
                    </p>
                    <Link href="/contact">
                        <Button size="lg" style={{ backgroundColor: BRAND.gold, color: BRAND.burgundyDark }}>
                            Contact International Affairs
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
