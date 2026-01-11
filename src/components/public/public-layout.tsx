"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    Menu,
    X,
    ChevronDown,
    Shield,
    Award,
    Users,
    BookOpen,
    FileText,
    Mail,
    Phone,
    MapPin,
    ExternalLink,
    TrendingUp,
    Briefcase,
} from "lucide-react";

const mainNavItems = [
    { href: "/certifications", label: "Certifications" },
    { href: "/career-paths", label: "Career Outcomes" },
    {
        label: "Institute",
        children: [
            { href: "/standards", label: "Certification Standards", icon: FileText },
            { href: "/code-of-ethics", label: "Code of Ethics", icon: Shield },
            { href: "/how-it-works", label: "How It Works", icon: BookOpen },
            { href: "/professionals", label: "Find a Professional", icon: Users },
        ],
    },
    { href: "/testimonials", label: "Success Stories" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

const footerLinks = {
    certifications: [
        { href: "/certifications", label: "All Programs" },
        { href: "/fm-course-certification", label: "Functional Medicine" },
        { href: "/hn-course-certification", label: "Holistic Nutrition" },
        { href: "/career-paths", label: "Career Outcomes" },
        { href: "/how-it-works", label: "Certification Pathway" },
    ],
    institute: [
        { href: "/standards", label: "Certification Standards" },
        { href: "/code-of-ethics", label: "Code of Ethics" },
        { href: "/about", label: "About ASI" },
        { href: "/professionals", label: "Verified Professionals" },
        { href: "/exam-info", label: "Exam Information" },
    ],
    resources: [
        { href: "/blog", label: "Blog" },
        { href: "/testimonials", label: "Success Stories" },
        { href: "/contact", label: "Contact Us" },
        { href: "/login", label: "Student Portal" },
    ],
    legal: [
        { href: "/privacy-policy", label: "Privacy Policy" },
        { href: "/terms-of-service", label: "Terms of Service" },
        { href: "/refund-policy", label: "Refund Policy" },
        { href: "/earnings-disclaimer", label: "Earnings Disclaimer" },
    ],
};

interface PublicLayoutProps {
    children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-burgundy-600 to-burgundy-800 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                                    <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-gold-400" />
                                </div>
                            </div>
                            <div className="hidden sm:block">
                                <span className="text-lg lg:text-xl font-bold text-burgundy-800">AccrediPro</span>
                                <p className="text-[10px] lg:text-xs text-burgundy-600 font-medium -mt-0.5">Standards Institute</p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {mainNavItems.map((item) => {
                                if ("children" in item) {
                                    return (
                                        <div
                                            key={item.label}
                                            className="relative"
                                            onMouseEnter={() => setOpenDropdown(item.label)}
                                            onMouseLeave={() => setOpenDropdown(null)}
                                        >
                                            <button
                                                className={cn(
                                                    "flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                                                    "text-gray-700 hover:text-burgundy-700 hover:bg-burgundy-50"
                                                )}
                                            >
                                                {item.label}
                                                <ChevronDown className={cn(
                                                    "w-4 h-4 transition-transform",
                                                    openDropdown === item.label && "rotate-180"
                                                )} />
                                            </button>
                                            {openDropdown === item.label && (
                                                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                                                    {item.children.map((child) => (
                                                        <Link
                                                            key={child.href}
                                                            href={child.href}
                                                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-burgundy-50 hover:text-burgundy-700 transition-colors"
                                                        >
                                                            <child.icon className="w-4 h-4 text-burgundy-500" />
                                                            {child.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                                            isActive
                                                ? "text-burgundy-700 bg-burgundy-50"
                                                : "text-gray-700 hover:text-burgundy-700 hover:bg-burgundy-50"
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* CTA Buttons */}
                        <div className="flex items-center gap-3">
                            <Link href="/login" className="hidden sm:block">
                                <Button variant="ghost" size="sm" className="text-gray-700">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/fm-course-certification">
                                <Button size="sm" className="bg-burgundy-600 hover:bg-burgundy-700 text-white shadow-lg">
                                    Get Certified
                                </Button>
                            </Link>
                            <button
                                className="lg:hidden p-2 text-gray-700"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
                        <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
                            {mainNavItems.map((item) => {
                                if ("children" in item) {
                                    return (
                                        <div key={item.label} className="space-y-1">
                                            <div className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                                {item.label}
                                            </div>
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-burgundy-50 rounded-lg"
                                                >
                                                    <child.icon className="w-4 h-4 text-burgundy-500" />
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    );
                                }
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={cn(
                                            "block px-4 py-3 text-sm font-medium rounded-lg",
                                            pathname === item.href
                                                ? "text-burgundy-700 bg-burgundy-50"
                                                : "text-gray-700 hover:bg-gray-50"
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                            <div className="pt-4 border-t border-gray-100">
                                <Link
                                    href="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                                >
                                    Sign In
                                </Link>
                            </div>
                        </nav>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1 pt-16 lg:pt-20">
                {children}
            </main>

            {/* Footer - Premium Burgundy Theme */}
            <footer className="bg-gradient-to-b from-burgundy-800 to-burgundy-950 text-white">
                {/* Main Footer */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
                        {/* Brand Column */}
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Shield className="w-6 h-6 text-burgundy-900" />
                                </div>
                                <div>
                                    <span className="text-lg font-bold text-white">AccrediPro</span>
                                    <p className="text-xs text-gold-400">Standards Institute</p>
                                </div>
                            </div>
                            <p className="text-sm text-burgundy-200 mb-4 leading-relaxed">
                                The career-focused certification body for health and wellness professionals.
                            </p>
                            <p className="text-xs text-gold-400 italic font-serif">
                                "Veritas Et Excellentia"
                            </p>
                        </div>

                        {/* Certifications */}
                        <div>
                            <h4 className="font-semibold text-gold-400 mb-4 text-sm uppercase tracking-wider">
                                Certifications
                            </h4>
                            <ul className="space-y-2.5">
                                {footerLinks.certifications.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-burgundy-200 hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Institute */}
                        <div>
                            <h4 className="font-semibold text-gold-400 mb-4 text-sm uppercase tracking-wider">
                                Institute
                            </h4>
                            <ul className="space-y-2.5">
                                {footerLinks.institute.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-burgundy-200 hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Resources */}
                        <div>
                            <h4 className="font-semibold text-gold-400 mb-4 text-sm uppercase tracking-wider">
                                Resources
                            </h4>
                            <ul className="space-y-2.5">
                                {footerLinks.resources.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-burgundy-200 hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h4 className="font-semibold text-gold-400 mb-4 text-sm uppercase tracking-wider">
                                Legal
                            </h4>
                            <ul className="space-y-2.5">
                                {footerLinks.legal.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-burgundy-200 hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Credential Framework Strip */}
                <div className="border-t border-burgundy-700/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <p className="text-center text-xs text-burgundy-400 uppercase tracking-wider mb-6">
                            ASI 4-Tier Credential Framework
                        </p>
                        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
                            {[
                                { tier: "FC™", name: "Foundation", desc: "Knowledge" },
                                { tier: "CP™", name: "Professional", desc: "Practice" },
                                { tier: "BC-™", name: "Board Certified", desc: "Mastery" },
                                { tier: "MC-™", name: "Master", desc: "Leadership" },
                            ].map((cred, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-burgundy-700/50 rounded-lg flex items-center justify-center border border-burgundy-600/50">
                                        <span className="text-xs font-bold text-gold-400">{cred.tier}</span>
                                    </div>
                                    <div className="hidden sm:block">
                                        <p className="text-xs font-medium text-white">{cred.name}</p>
                                        <p className="text-[10px] text-burgundy-400">{cred.desc}</p>
                                    </div>
                                    {i < 3 && <span className="text-burgundy-600 hidden md:block">→</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-burgundy-700/50 bg-burgundy-950">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-burgundy-400">
                            <p>
                                © {new Date().getFullYear()} AccrediPro Standards Institute. All rights reserved.
                            </p>
                            <p className="text-xs">
                                FM-CP™, BC-FMP™, MC-FMP™ and related marks are trademarks of ASI.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
