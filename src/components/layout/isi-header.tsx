"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
    Shield,
    ChevronDown,
    MapPin,
    Users,
    Award,
    Globe,
    FileText,
    Scale,
    BookOpen,
    Heart,
    Briefcase,
    CheckCircle,
    Building2,
    GraduationCap,
    Menu,
    X,
} from "lucide-react";

const BRAND = {
    burgundy: "#722f37",
    burgundyDark: "#4e1f24",
    gold: "#d4af37",
    cream: "#fdf8f0",
};

const navigation = {
    about: {
        label: "About",
        sections: [
            {
                title: "The Institute",
                links: [
                    { label: "About ISI", href: "/about", icon: Shield },
                    { label: "Leadership Team", href: "/leadership", icon: Users },
                    { label: "Governance", href: "/governance", icon: Scale },
                    { label: "Code of Ethics", href: "/code-of-ethics", icon: Heart },
                ],
            },
            {
                title: "Global Presence",
                links: [
                    { label: "International Recognition", href: "/international", icon: Globe },
                    { label: "Research & Evidence", href: "/research", icon: BookOpen },
                    { label: "Institutional Partners", href: "/institutional-partners", icon: Building2 },
                ],
            },
        ],
    },
    standards: {
        label: "Standards",
        sections: [
            {
                title: "Our Standards",
                links: [
                    { label: "Standards Overview", href: "/standards", icon: Award },
                    { label: "Competency Framework", href: "/standards/competency-framework", icon: FileText },
                    { label: "Quality Assurance", href: "/quality-assurance", icon: CheckCircle },
                    { label: "Academic Integrity", href: "/academic-integrity", icon: Shield },
                ],
            },
            {
                title: "Processes",
                links: [
                    { label: "Appeals Procedure", href: "/appeals", icon: Scale },
                    { label: "Complaints Procedure", href: "/complaints", icon: FileText },
                    { label: "Prior Learning (RPL)", href: "/prior-learning", icon: GraduationCap },
                    { label: "Learner Support", href: "/learner-support", icon: Heart },
                ],
            },
        ],
    },
    credentials: {
        label: "Credentials",
        sections: [
            {
                title: "Professional Credentials",
                links: [
                    { label: "All Credentials", href: "/certifications", icon: Award },
                    { label: "Functional Medicine", href: "/certifications/functional-medicine", icon: Heart },
                    { label: "Women's Health", href: "/certifications/womens-health", icon: Users },
                    { label: "Gut Health", href: "/certifications/gut-health", icon: Heart },
                ],
            },
            {
                title: "More Specializations",
                links: [
                    { label: "Holistic Nutrition", href: "/certifications/nutrition", icon: BookOpen },
                    { label: "Health Coaching", href: "/certifications/health-coaching", icon: Users },
                    { label: "Mind-Body Medicine", href: "/certifications/mind-body", icon: Heart },
                ],
            },
        ],
    },
    resources: {
        label: "Resources",
        sections: [
            {
                title: "For Professionals",
                links: [
                    { label: "Professional Directory", href: "/directory", icon: Users },
                    { label: "Verify Credential", href: "/verify", icon: CheckCircle },
                    { label: "Professional Pathways", href: "/careers", icon: Briefcase },
                    { label: "Compensation Guide", href: "/salary-guide", icon: Award },
                ],
            },
            {
                title: "Policies",
                links: [
                    { label: "Equality & Diversity", href: "/equality-diversity", icon: Heart },
                    { label: "Safeguarding", href: "/safeguarding", icon: Shield },
                    { label: "Accessibility", href: "/accessibility", icon: Users },
                    { label: "Privacy Policy", href: "/privacy-policy", icon: FileText },
                ],
            },
        ],
    },
};

export function ISIHeader() {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            {/* Top Bar */}
            <div style={{ backgroundColor: BRAND.burgundyDark }} className="text-white py-2 px-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
                    <div className="hidden md:flex items-center gap-6">
                        <span className="flex items-center gap-2">
                            <MapPin className="w-3 h-3" style={{ color: BRAND.gold }} />
                            🇺🇸 USA Headquarters
                        </span>
                        <span className="flex items-center gap-2">
                            <MapPin className="w-3 h-3" style={{ color: BRAND.gold }} />
                            🇦🇪 Dubai Office
                        </span>
                    </div>
                    <div className="flex items-center gap-4 ml-auto">
                        <Link href="/verify" className="hover:opacity-80 transition-opacity" style={{ color: BRAND.gold }}>
                            Verify Credential
                        </Link>
                        <Link href="/directory" className="hidden md:block hover:opacity-80 transition-opacity" style={{ color: BRAND.gold }}>
                            Find a Professional
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3">
                            <Image
                                src="/ASI_LOGO-removebg-preview.png"
                                alt="AccrediPro International Standards Institute"
                                width={160}
                                height={48}
                                className="h-12 w-auto"
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-1">
                            {Object.entries(navigation).map(([key, menu]) => (
                                <div
                                    key={key}
                                    className="relative"
                                    onMouseEnter={() => setActiveMenu(key)}
                                    onMouseLeave={() => setActiveMenu(null)}
                                >
                                    <button
                                        className="px-4 py-2 font-medium hover:opacity-70 transition-opacity flex items-center gap-1 cursor-pointer"
                                        style={{ color: BRAND.burgundy }}
                                    >
                                        {menu.label}
                                        <ChevronDown className="w-4 h-4" />
                                    </button>

                                    {/* Mega Menu Dropdown */}
                                    {activeMenu === key && (
                                        <div className="absolute top-full left-0 pt-2 z-50">
                                            <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-6" style={{ minWidth: '560px' }}>
                                                <div className="grid grid-cols-2 gap-12">
                                                    {menu.sections.map((section, i) => (
                                                        <div key={i}>
                                                            <h4 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: BRAND.gold }}>
                                                                {section.title}
                                                            </h4>
                                                            <ul className="space-y-2">
                                                                {section.links.map((link, j) => (
                                                                    <li key={j}>
                                                                        <Link
                                                                            href={link.href}
                                                                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
                                                                        >
                                                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform" style={{ backgroundColor: `${BRAND.burgundy}10` }}>
                                                                                <link.icon className="w-4 h-4" style={{ color: BRAND.burgundy }} />
                                                                            </div>
                                                                            <span className="text-sm font-medium" style={{ color: BRAND.burgundy }}>
                                                                                {link.label}
                                                                            </span>
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="hidden lg:flex items-center gap-3">
                            <Link href="/login">
                                <Button variant="ghost" style={{ color: BRAND.burgundy }}>Log In</Button>
                            </Link>
                            <Link href="/apply">
                                <Button style={{ backgroundColor: BRAND.burgundy, color: "white" }} className="hover:opacity-90">
                                    Apply Now
                                </Button>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden p-2"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6" style={{ color: BRAND.burgundy }} />
                            ) : (
                                <Menu className="w-6 h-6" style={{ color: BRAND.burgundy }} />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-t border-gray-100 bg-white">
                        <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
                            {Object.entries(navigation).map(([key, menu]) => (
                                <div key={key} className="border-b border-gray-100 pb-4">
                                    <button
                                        className="w-full flex justify-between items-center py-2 font-semibold"
                                        style={{ color: BRAND.burgundy }}
                                        onClick={() => setActiveMenu(activeMenu === key ? null : key)}
                                    >
                                        {menu.label}
                                        <ChevronDown className={`w-4 h-4 transition-transform ${activeMenu === key ? 'rotate-180' : ''}`} />
                                    </button>
                                    {activeMenu === key && (
                                        <div className="mt-2 space-y-4">
                                            {menu.sections.map((section, i) => (
                                                <div key={i}>
                                                    <h4 className="text-xs font-bold uppercase tracking-wider mb-2 pl-2" style={{ color: BRAND.gold }}>
                                                        {section.title}
                                                    </h4>
                                                    <ul className="space-y-1">
                                                        {section.links.map((link, j) => (
                                                            <li key={j}>
                                                                <Link
                                                                    href={link.href}
                                                                    className="block px-3 py-2 text-sm rounded-lg hover:bg-gray-50"
                                                                    style={{ color: BRAND.burgundy }}
                                                                    onClick={() => setMobileMenuOpen(false)}
                                                                >
                                                                    {link.label}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div className="flex flex-col gap-3 pt-4">
                                <Link href="/login">
                                    <Button variant="outline" className="w-full" style={{ borderColor: BRAND.burgundy, color: BRAND.burgundy }}>
                                        Log In
                                    </Button>
                                </Link>
                                <Link href="/apply">
                                    <Button className="w-full" style={{ backgroundColor: BRAND.burgundy, color: "white" }}>
                                        Apply Now
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}
