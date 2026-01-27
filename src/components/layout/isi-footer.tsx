import Link from "next/link";
import { Shield, MapPin, Mail, Phone, Globe } from "lucide-react";

const BRAND = {
    burgundy: "#722f37",
    burgundyDark: "#4e1f24",
    gold: "#d4af37",
    cream: "#fdf8f0",
};

const footerLinks = {
    institute: {
        title: "The Institute",
        links: [
            { label: "About ISI", href: "/about" },
            { label: "Leadership", href: "/leadership" },
            { label: "Governance", href: "/governance" },
            { label: "Research", href: "/research" },
            { label: "International", href: "/international" },
            { label: "Partners", href: "/institutional-partners" },
        ],
    },
    credentials: {
        title: "Credentials",
        links: [
            { label: "All Credentials", href: "/certifications" },
            { label: "Functional Medicine", href: "/certifications/functional-medicine" },
            { label: "Women's Health", href: "/certifications/womens-health" },
            { label: "Gut Health", href: "/certifications/gut-health" },
            { label: "Holistic Nutrition", href: "/certifications/nutrition" },
        ],
    },
    resources: {
        title: "Resources",
        links: [
            { label: "Professional Directory", href: "/directory" },
            { label: "Verify Credential", href: "/verify" },
            { label: "Professional Pathways", href: "/careers" },
            { label: "Compensation Guide", href: "/salary-guide" },
            { label: "Professional Journeys", href: "/success-stories" },
        ],
    },
    standards: {
        title: "Standards & Policies",
        links: [
            { label: "Quality Assurance", href: "/quality-assurance" },
            { label: "Academic Integrity", href: "/academic-integrity" },
            { label: "Appeals Procedure", href: "/appeals" },
            { label: "Complaints Procedure", href: "/complaints" },
            { label: "Learner Support", href: "/learner-support" },
            { label: "Prior Learning (RPL)", href: "/prior-learning" },
        ],
    },
};

const legalLinks = [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Cookie Policy", href: "/cookie-policy" },
    { label: "Accessibility", href: "/accessibility" },
    { label: "Equality & Diversity", href: "/equality-diversity" },
    { label: "Safeguarding", href: "/safeguarding" },
    { label: "Code of Ethics", href: "/code-of-ethics" },
];

export function ISIFooter() {
    return (
        <footer className="text-white" style={{ backgroundColor: BRAND.burgundyDark }}>
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
                    {/* Brand & Contact */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: BRAND.gold }}>
                                <Shield className="w-7 h-7" style={{ color: BRAND.burgundyDark }} />
                            </div>
                            <div>
                                <div className="font-bold text-lg tracking-tight text-white">ACCREDIPRO</div>
                                <div className="text-xs tracking-widest" style={{ color: BRAND.gold }}>INTERNATIONAL STANDARDS INSTITUTE</div>
                            </div>
                        </div>
                        <p className="mb-6 max-w-sm text-sm" style={{ color: "#f5e6e8" }}>
                            The global authority in professional health and wellness credentialing,
                            serving 20,000+ professionals across 45+ countries.
                        </p>
                        <div className="space-y-3 text-sm" style={{ color: "#f5e6e8" }}>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" style={{ color: BRAND.gold }} />
                                🇺🇸 San Francisco, CA (HQ)
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" style={{ color: BRAND.gold }} />
                                🇦🇪 Dubai, UAE (Regional)
                            </div>
                        </div>
                    </div>

                    {/* Link Columns */}
                    {Object.values(footerLinks).map((section, i) => (
                        <div key={i}>
                            <h4 className="font-bold mb-4 text-sm" style={{ color: BRAND.gold }}>{section.title}</h4>
                            <ul className="space-y-2 text-sm" style={{ color: "#f5e6e8" }}>
                                {section.links.map((link, j) => (
                                    <li key={j}>
                                        <Link href={link.href} className="hover:text-white transition-colors">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Accreditation Badges */}
                <div className="border-t border-white/10 pt-8 mb-8">
                    <div className="flex flex-wrap items-center justify-center gap-8">
                        <div className="text-center">
                            <div className="text-xs uppercase tracking-wider mb-2" style={{ color: BRAND.gold }}>University Partner</div>
                            <div className="text-sm text-white font-semibold">2026 Degree Pathways</div>
                        </div>
                        <div className="w-px h-8 bg-white/20 hidden md:block" />
                        <div className="text-center">
                            <div className="text-xs uppercase tracking-wider mb-2" style={{ color: BRAND.gold }}>Global Recognition</div>
                            <div className="text-sm text-white font-semibold">45+ Countries</div>
                        </div>
                        <div className="w-px h-8 bg-white/20 hidden md:block" />
                        <div className="text-center">
                            <div className="text-xs uppercase tracking-wider mb-2" style={{ color: BRAND.gold }}>Professionals</div>
                            <div className="text-sm text-white font-semibold">20,000+ Credentialed</div>
                        </div>
                    </div>
                </div>

                {/* Legal Links */}
                <div className="border-t border-white/10 pt-8">
                    <div className="flex flex-wrap justify-center gap-4 mb-6 text-xs" style={{ color: "#f5e6e8" }}>
                        {legalLinks.map((link, i) => (
                            <Link key={i} href={link.href} className="hover:text-white transition-colors">
                                {link.label}
                            </Link>
                        ))}
                    </div>
                    <p className="text-center text-xs" style={{ color: "#f5e6e8" }}>
                        © {new Date().getFullYear()} AccrediPro International Standards Institute. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
