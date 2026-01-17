"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    User,
    BookOpen,
    Users,
    Award,
    Target,
    ChevronRight,
    ChevronDown,
    TrendingUp,
    LogOut,
    Home,
    Hand,
    Megaphone,
    Menu,
    X,
    Shield,
    DollarSign,
    Sparkles,
    GraduationCap,
} from "lucide-react";
import { signOut } from "next-auth/react";

interface LeadSidebarProps {
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string | null;
    diplomaCompleted: boolean;
    certificateClaimed: boolean;
}

// Brand colors
const BRAND = {
    burgundy: "#722f37",
    burgundyDark: "#4e1f24",
    burgundyLight: "#9a4a54",
    gold: "#d4af37",
    goldLight: "#f7e7a0",
    goldDark: "#b8860b",
    cream: "#fdf8f0",
    goldMetallic: "linear-gradient(135deg, #d4af37 0%, #f7e7a0 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%)",
    burgundyMetallic: "linear-gradient(135deg, #722f37 0%, #9a4a54 25%, #722f37 50%, #4e1f24 75%, #722f37 100%)",
};

// Zombie success events for social proof
const SUCCESS_EVENTS = [
    { type: "income", name: "Lisa K.", amount: "$1,200", time: "this week" },
    { type: "cert", name: "Maria T.", action: "Just certified!", time: "2h ago" },
    { type: "consult", name: "Jennifer M.", action: "$150 consult booked", time: "4h ago" },
];

export function LeadSidebar({
    firstName,
    lastName,
    email,
    avatar,
    diplomaCompleted,
    certificateClaimed,
}: LeadSidebarProps) {
    const pathname = usePathname();
    const [onlineCount] = useState(Math.floor(Math.random() * 30) + 35);
    const [communityOpen, setCommunityOpen] = useState(
        pathname?.startsWith("/community") || false
    );
    const [mobileOpen, setMobileOpen] = useState(false);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    // Prevent body scroll when mobile sidebar is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    // Dynamic base path for diploma
    const getDiplomaBasePath = () => {
        if (!pathname) return "/womens-health-diploma";
        const parts = pathname.split("/");
        if (parts[1] && parts[1].includes("-diploma")) {
            return `/${parts[1]}`;
        }
        return "/womens-health-diploma";
    };

    const basePath = getDiplomaBasePath();

    const isActive = (href: string) =>
        pathname === href || pathname?.startsWith(href + "/");

    return (
        <>
            {/* Mobile Header Bar with Hamburger - PREMIUM GOLD */}
            <div
                className="lg:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between shadow-lg"
                style={{ background: BRAND.burgundyDark }}
            >
                <Link href={basePath} className="flex items-center gap-2">
                    <Image
                        src="/newlogo.webp"
                        alt="AccrediPro"
                        width={32}
                        height={32}
                        className="rounded-lg"
                    />
                    <div>
                        <span className="font-bold text-white">AccrediPro</span>
                        <span className="text-[10px] block" style={{ color: BRAND.gold }}>ACADEMY</span>
                    </div>
                </Link>
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="p-2 rounded-lg transition-colors text-white"
                    style={{ backgroundColor: `${BRAND.burgundy}80` }}
                    aria-label={mobileOpen ? "Close menu" : "Open menu"}
                >
                    {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar - PREMIUM REDESIGN */}
            <aside className={`
                fixed left-0 top-0 z-40 h-screen w-72 flex flex-col
                transition-transform duration-300 ease-in-out
                lg:translate-x-0
                ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
            `} style={{ backgroundColor: BRAND.burgundyDark }}>

                {/* Logo Section - Premium with Gold Accent */}
                <div className="p-5 border-b hidden lg:block" style={{ borderColor: `${BRAND.burgundy}80` }}>
                    <Link href={basePath} className="flex items-center gap-3">
                        <div className="relative">
                            <Image
                                src="/newlogo.webp"
                                alt="AccrediPro"
                                width={48}
                                height={48}
                                className="rounded-xl"
                            />
                            <div
                                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                                style={{ background: BRAND.goldMetallic }}
                            >
                                <Shield className="w-3 h-3" style={{ color: BRAND.burgundyDark }} />
                            </div>
                        </div>
                        <div>
                            <span className="font-bold text-lg text-white tracking-tight">AccrediPro</span>
                            <div className="flex items-center gap-1.5">
                                <span
                                    className="text-[10px] font-bold tracking-widest"
                                    style={{ color: BRAND.gold }}
                                >
                                    ACADEMY
                                </span>
                                <span
                                    className="text-[8px] px-1.5 py-0.5 rounded font-medium"
                                    style={{ background: `${BRAND.gold}20`, color: BRAND.gold }}
                                >
                                    ASI
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Spacer for mobile header */}
                <div className="h-14 lg:hidden" />

                {/* User Card - Premium Style */}
                <div className="p-4" style={{ borderBottom: `1px solid ${BRAND.burgundy}60` }}>
                    <div
                        className="rounded-xl p-3"
                        style={{ background: `linear-gradient(135deg, ${BRAND.burgundy}40 0%, ${BRAND.burgundy}20 100%)` }}
                    >
                        <div className="flex items-center gap-3">
                            {avatar ? (
                                <Image
                                    src={avatar}
                                    alt={firstName}
                                    width={44}
                                    height={44}
                                    className="rounded-full border-2"
                                    style={{ borderColor: BRAND.gold }}
                                />
                            ) : (
                                <div
                                    className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold border-2"
                                    style={{
                                        background: BRAND.goldMetallic,
                                        color: BRAND.burgundyDark,
                                        borderColor: BRAND.gold
                                    }}
                                >
                                    {firstName?.[0] || "U"}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-white truncate">{firstName} {lastName}</p>
                                <p className="text-xs truncate" style={{ color: `${BRAND.goldLight}90` }}>{email}</p>
                            </div>
                        </div>
                        {/* Mini Progress Indicator */}
                        <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${BRAND.burgundy}60` }}>
                            <div className="flex items-center justify-between text-xs mb-1.5">
                                <span style={{ color: `${BRAND.goldLight}80` }}>Certification Progress</span>
                                <span className="font-bold" style={{ color: BRAND.gold }}>
                                    {diplomaCompleted ? "100%" : "0%"}
                                </span>
                            </div>
                            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: `${BRAND.burgundy}60` }}>
                                <div
                                    className="h-full rounded-full transition-all"
                                    style={{
                                        width: diplomaCompleted ? "100%" : "0%",
                                        background: BRAND.goldMetallic
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation - Premium Styling */}
                <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                    {/* Section Label */}
                    <p className="text-[10px] font-bold tracking-widest px-3 mb-2" style={{ color: `${BRAND.gold}80` }}>
                        LEARNING
                    </p>

                    {/* My Profile */}
                    <Link
                        href={`${basePath}/profile`}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive(`${basePath}/profile`)
                            ? "text-white shadow-lg"
                            : "text-white/70 hover:text-white hover:bg-white/5"
                            }`}
                        style={isActive(`${basePath}/profile`) ? { background: BRAND.goldMetallic, color: BRAND.burgundyDark } : {}}
                    >
                        <User className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">My Profile</span>
                    </Link>

                    {/* My Mini Diploma */}
                    <Link
                        href={basePath}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${pathname === basePath
                            ? "text-white shadow-lg"
                            : "text-white/70 hover:text-white hover:bg-white/5"
                            }`}
                        style={pathname === basePath ? { background: BRAND.goldMetallic, color: BRAND.burgundyDark } : {}}
                    >
                        <GraduationCap className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">My Certification</span>
                        {pathname === basePath && (
                            <ChevronRight className="w-4 h-4 ml-auto" />
                        )}
                    </Link>

                    {/* Community - Expandable */}
                    <div>
                        <button
                            onClick={() => setCommunityOpen(!communityOpen)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all w-full ${pathname?.startsWith("/community")
                                ? "text-white shadow-lg"
                                : "text-white/70 hover:text-white hover:bg-white/5"
                                }`}
                            style={pathname?.startsWith("/community") ? { background: BRAND.goldMetallic, color: BRAND.burgundyDark } : {}}
                        >
                            <Users className="w-5 h-5 flex-shrink-0" />
                            <span className="font-medium">Community</span>
                            {communityOpen ? (
                                <ChevronDown className="w-4 h-4 ml-auto" />
                            ) : (
                                <ChevronRight className="w-4 h-4 ml-auto" />
                            )}
                        </button>

                        {communityOpen && (
                            <div className="ml-4 mt-1 space-y-1 pl-4" style={{ borderLeft: `2px solid ${BRAND.gold}30` }}>
                                <Link
                                    href="/community"
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${pathname === "/community"
                                        ? "text-white"
                                        : "text-white/60 hover:text-white"
                                        }`}
                                    style={pathname === "/community" ? { backgroundColor: `${BRAND.gold}15` } : {}}
                                >
                                    <Home className="w-4 h-4 flex-shrink-0" />
                                    <span>Community Hub</span>
                                </Link>

                                <Link
                                    href="/community/cmj94foua0000736vfwdlheir"
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${pathname === "/community/cmj94foua0000736vfwdlheir"
                                        ? "text-white"
                                        : "text-white/60 hover:text-white"
                                        }`}
                                    style={pathname === "/community/cmj94foua0000736vfwdlheir" ? { backgroundColor: `${BRAND.gold}15` } : {}}
                                >
                                    <Hand className="w-4 h-4 flex-shrink-0" />
                                    <span>👋 Introduce Yourself</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Ask Coach Sarah - Premium CTA Style */}
                    <Link
                        href="/messages"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-white/70 hover:text-white relative overflow-hidden group"
                        style={{
                            border: `1px solid ${BRAND.gold}40`,
                            background: isActive("/messages") ? BRAND.goldMetallic : 'transparent'
                        }}
                    >
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ background: `${BRAND.gold}10` }}
                        />
                        <svg className="w-5 h-5 flex-shrink-0 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={isActive("/messages") ? { color: BRAND.burgundyDark } : {}}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="font-medium relative z-10" style={isActive("/messages") ? { color: BRAND.burgundyDark } : {}}>Ask Coach Sarah</span>
                        <span className="ml-auto w-2.5 h-2.5 rounded-full animate-pulse relative z-10" style={{ backgroundColor: '#22c55e' }} title="Online now" />
                    </Link>

                    {/* Certificate - Only show after completion */}
                    {diplomaCompleted && (
                        <>
                            <p className="text-[10px] font-bold tracking-widest px-3 mt-4 mb-2" style={{ color: `${BRAND.gold}80` }}>
                                YOUR CREDENTIALS
                            </p>
                            <Link
                                href={`${basePath}/certificate`}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive(`${basePath}/certificate`)
                                    ? "shadow-lg"
                                    : "text-white/70 hover:text-white hover:bg-white/5"
                                    }`}
                                style={isActive(`${basePath}/certificate`) ? { background: BRAND.goldMetallic, color: BRAND.burgundyDark } : {}}
                            >
                                <Award className="w-5 h-5 flex-shrink-0" />
                                <span className="font-medium">My Certificate</span>
                            </Link>

                            <Link
                                href={`${basePath}/career-roadmap`}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive(`${basePath}/career-roadmap`)
                                    ? "shadow-lg"
                                    : "text-white/70 hover:text-white hover:bg-white/5"
                                    }`}
                                style={isActive(`${basePath}/career-roadmap`) ? { background: BRAND.goldMetallic, color: BRAND.burgundyDark } : {}}
                            >
                                <Target className="w-5 h-5 flex-shrink-0" />
                                <span className="font-medium">Career Roadmap</span>
                            </Link>
                        </>
                    )}
                </nav>

                {/* Earnings Trigger Card */}
                <div className="p-4" style={{ borderTop: `1px solid ${BRAND.burgundy}60` }}>
                    <div
                        className="rounded-xl p-3 relative overflow-hidden"
                        style={{ background: `linear-gradient(135deg, ${BRAND.gold}15 0%, ${BRAND.gold}05 100%)`, border: `1px solid ${BRAND.gold}30` }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-4 h-4" style={{ color: BRAND.gold }} />
                            <span className="text-[10px] font-bold tracking-widest" style={{ color: BRAND.gold }}>INCOME POTENTIAL</span>
                        </div>
                        <p className="text-2xl font-black text-white">$4K-$8K<span className="text-sm font-medium text-white/60">/mo</span></p>
                        <p className="text-xs text-white/50 mt-1">Average certified practitioner income</p>
                    </div>
                </div>

                {/* Success Feed - Compact */}
                <div className="px-4 pb-3">
                    <div
                        className="rounded-xl p-3"
                        style={{ background: `${BRAND.burgundy}40` }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-3.5 h-3.5" style={{ color: '#22c55e' }} />
                            <span className="text-[10px] font-bold tracking-widest" style={{ color: '#22c55e' }}>LIVE SUCCESS</span>
                        </div>
                        <div className="space-y-1.5 text-xs">
                            {SUCCESS_EVENTS.map((event, i) => (
                                <div key={i} className="text-white/70">
                                    {event.type === "income" ? (
                                        <span>💰 <strong className="text-white">{event.name}</strong> earned {event.amount}</span>
                                    ) : event.type === "cert" ? (
                                        <span>🎓 <strong className="text-white">{event.name}</strong> {event.action}</span>
                                    ) : (
                                        <span>📅 <strong className="text-white">{event.name}</strong> {event.action}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-2 pt-2 text-[10px] flex items-center gap-1.5" style={{ borderTop: `1px solid ${BRAND.burgundy}60`, color: `${BRAND.goldLight}60` }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            {onlineCount} women learning now
                        </div>
                    </div>
                </div>

                {/* Sign Out - Minimal */}
                <div className="p-4" style={{ borderTop: `1px solid ${BRAND.burgundy}60` }}>
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="flex items-center gap-2 text-white/40 hover:text-white/70 text-sm w-full px-3 py-2 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}
