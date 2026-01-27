import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    FileText,
    BookOpen,
    Users,
    Globe,
    Award,
    ArrowRight,
    CheckCircle,
    ExternalLink,
    Microscope,
    LineChart,
    GraduationCap,
} from "lucide-react";

export const metadata = {
    title: "Research & Evidence | AccrediPro International Standards Institute",
    description: "Explore the evidence base behind AccrediPro ISI competency standards and professional frameworks.",
};

// Brand Colors
const BRAND = {
    burgundy: "#722f37",
    burgundyDark: "#4e1f24",
    gold: "#d4af37",
    goldLight: "#e8c547",
    cream: "#fdf8f0",
};

export default function ResearchPage() {
    const researchAreas = [
        {
            title: "Competency Framework Validation",
            description: "Peer-reviewed research supporting our competency-based assessment methodology.",
            papers: 12,
            status: "Ongoing",
        },
        {
            title: "Practitioner Outcomes Research",
            description: "Longitudinal studies tracking certified practitioner impact and client outcomes.",
            papers: 8,
            status: "Active",
        },
        {
            title: "Standards Benchmarking",
            description: "Comparative analysis with international certification standards.",
            papers: 5,
            status: "Published",
        },
        {
            title: "Workforce Development Studies",
            description: "Research on integrative health workforce needs and credentialing gaps.",
            papers: 4,
            status: "Active",
        },
    ];

    const partnerships = [
        "Academic research institutions",
        "Healthcare systems",
        "Public health agencies",
        "International standards bodies",
        "Professional associations",
    ];

    const publications = [
        {
            title: "Competency-Based Assessment in Integrative Health: A Framework Analysis",
            journal: "Journal of Alternative and Complementary Medicine",
            year: "2024",
            type: "Peer-Reviewed",
        },
        {
            title: "Global Standards for Non-Clinical Health Practitioners: A Comparative Study",
            journal: "International Journal of Health Professions",
            year: "2024",
            type: "Peer-Reviewed",
        },
        {
            title: "Credential Recognition Across Borders: Challenges and Solutions",
            journal: "Global Health Workforce Alliance",
            year: "2023",
            type: "White Paper",
        },
        {
            title: "The Future of Functional Medicine Credentialing",
            journal: "AccrediPro ISI Research Brief",
            year: "2023",
            type: "Research Brief",
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="relative text-white py-20" style={{ backgroundColor: BRAND.burgundyDark }}>
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}40` }}>
                        <Microscope className="w-4 h-4" style={{ color: BRAND.gold }} />
                        <span className="text-sm font-medium" style={{ color: BRAND.gold }}>Evidence-Based Standards</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Research & Evidence
                    </h1>
                    <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: "#f5e6e8" }}>
                        Our competency standards and professional frameworks are built on a foundation of
                        rigorous research and evidence-based methodology.
                    </p>
                </div>
            </section>

            {/* Research Areas */}
            <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
                            Research Focus Areas
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Ongoing research initiatives supporting professional standards development
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {researchAreas.map((area, i) => (
                            <div key={i} className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold" style={{ color: BRAND.burgundy }}>{area.title}</h3>
                                    <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: `${BRAND.gold}20`, color: BRAND.burgundy }}>
                                        {area.status}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-4">{area.description}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <FileText className="w-4 h-4" style={{ color: BRAND.gold }} />
                                    <span>{area.papers} related publications</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Publications */}
            <section className="py-16 md:py-24" style={{ backgroundColor: BRAND.cream }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
                            Selected Publications
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Recent research publications and institutional white papers
                        </p>
                    </div>

                    <div className="space-y-4">
                        {publications.map((pub, i) => (
                            <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold mb-1" style={{ color: BRAND.burgundy }}>{pub.title}</h3>
                                    <p className="text-sm text-gray-500">{pub.journal} • {pub.year}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">{pub.type}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Research Partnerships */}
            <section className="py-16">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
                        Research Partnerships
                    </h2>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        We collaborate with leading institutions to advance evidence-based professional standards
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {partnerships.map((partner, i) => (
                            <span key={i} className="px-4 py-2 rounded-full bg-gray-50 border border-gray-100 text-gray-600 text-sm">
                                {partner}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 text-center" style={{ backgroundColor: BRAND.burgundyDark }}>
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-4 text-white">
                        Research Collaboration
                    </h2>
                    <p className="mb-8" style={{ color: "#f5e6e8" }}>
                        Interested in collaborating on research or accessing our institutional data?
                        Contact our research committee.
                    </p>
                    <Link href="/contact">
                        <Button size="lg" style={{ backgroundColor: BRAND.gold, color: BRAND.burgundyDark }}>
                            Contact Research Committee
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
