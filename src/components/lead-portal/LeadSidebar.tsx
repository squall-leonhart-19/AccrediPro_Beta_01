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
    TrendingUp,
    LogOut,
    Menu,
    X,
    Shield,
    DollarSign,
    GraduationCap,
    Calculator,
    Map,
    Lock,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useSidebar } from "@/contexts/sidebar-context";

interface ResourceItem {
    id: string;
    name: string;
    icon: string;
    description: string;
    isUnlocked: boolean;
    minutesUntilUnlock: number;
}

interface LeadSidebarProps {
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string | null;
    diplomaCompleted: boolean;
    certificateClaimed: boolean;
    resources?: ResourceItem[];
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
    resources = [],
}: LeadSidebarProps) {
    const pathname = usePathname();
    const { isCollapsed: sidebarCollapsed, setIsCollapsed: setSidebarCollapsed, setIsLessonPage } = useSidebar();
    const [onlineCount, setOnlineCount] = useState(45); // Default static value for SSR
    const [mobileOpen, setMobileOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(0);

    // Detect if we're in a lesson page (lesson player mode)
    const isLessonPage = pathname?.includes('/lesson/');

    // Sync lesson page state with context
    useEffect(() => {
        setIsLessonPage(isLessonPage || false);
    }, [isLessonPage, setIsLessonPage]);

    // Generate dynamic success events with random data
    const [successEvents, setSuccessEvents] = useState(SUCCESS_EVENTS);

    // Set random count only on client to avoid hydration mismatch
    useEffect(() => {
        setOnlineCount(Math.floor(Math.random() * 30) + 35);

        // Randomize success events
        const names = ["Lisa K.", "Maria T.", "Jennifer M.", "Sarah W.", "Amanda P.", "Rachel H.", "Emily B.", "Danielle R.", "Christina M.", "Nicole F."];
        const amounts = ["$1,200", "$950", "$1,400", "$800", "$1,100", "$1,650", "$980"];
        const consultAmounts = ["$150", "$180", "$120", "$200", "$175"];

        const randomName = () => names[Math.floor(Math.random() * names.length)];
        const randomAmount = () => amounts[Math.floor(Math.random() * amounts.length)];
        const randomConsult = () => consultAmounts[Math.floor(Math.random() * consultAmounts.length)];

        setSuccessEvents([
            { type: "income", name: randomName(), amount: randomAmount(), time: "this week" },
            { type: "cert", name: randomName(), action: "Just certified!", time: "2h ago" },
            { type: "consult", name: randomName(), action: `${randomConsult()} consult booked`, time: "4h ago" },
        ]);
    }, []);

    // Rotate through success events every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentEvent(prev => (prev + 1) % successEvents.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [successEvents.length]);

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
    // Dynamic base path for diploma - supports both old and new patterns
    const getDiplomaBasePath = () => {
        if (!pathname) return "/portal/womens-health";
        const parts = pathname.split("/").filter(Boolean);

        // New pattern: /portal/functional-medicine/lesson/1
        if (parts[0] === "portal" && parts[1]) {
            return `/portal/${parts[1]}`;
        }

        // Old pattern: /functional-medicine-diploma/lesson/1
        if (parts[0]?.includes("-diploma")) {
            // Convert old format to new for consistency
            const slug = parts[0].replace("-diploma", "");
            return `/portal/${slug}`;
        }

        return "/portal/womens-health";
    };

    const basePath = getDiplomaBasePath();

    const isActive = (href: string) =>
        pathname === href || pathname?.startsWith(href + "/");

    return (
        <>
            {/* Floating Expand Button - Only visible when sidebar collapsed on lesson pages */}
            {isLessonPage && sidebarCollapsed && (
                <button
                    onClick={() => setSidebarCollapsed(false)}
                    className="fixed left-0 top-1/2 -translate-y-1/2 z-50 p-3 rounded-r-xl shadow-xl transition-all hidden lg:flex items-center gap-2 hover:pl-4"
                    style={{
                        background: BRAND.goldMetallic,
                        color: BRAND.burgundyDark
                    }}
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            )}

            {/* Mobile Header Bar with Hamburger - PREMIUM GOLD */}
            <div
                className="lg:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between shadow-lg"
                style={{ background: BRAND.burgundyDark }}
            >
                <Link href={basePath} className="flex items-center gap-2">
                    <Image
                        src="/newlogo.webp"
                        alt="ASI"
                        width={32}
                        height={32}
                        className="rounded-lg"
                    />
                    <div>
                        <span className="font-bold text-white">AccrediPro</span>
                        <span className="text-[10px] block" style={{ color: BRAND.gold }}>STANDARDS INSTITUTE</span>
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

            {/* Sidebar - PREMIUM REDESIGN (collapsible on lesson pages) */}
            <aside className={`
                fixed left-0 top-0 z-40 h-screen w-72 flex flex-col
                transition-transform duration-300 ease-in-out
                ${isLessonPage && sidebarCollapsed ? "-translate-x-full lg:-translate-x-full" : "lg:translate-x-0"}
                ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
            `} style={{ backgroundColor: BRAND.burgundyDark }}>

                {/* Collapse Toggle - Only on lesson pages (inside sidebar) */}
                {isLessonPage && (
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="absolute top-4 right-4 z-50 p-2 rounded-lg transition-all hidden lg:flex items-center gap-2"
                        style={{
                            background: sidebarCollapsed ? BRAND.goldMetallic : `${BRAND.burgundy}80`,
                            color: sidebarCollapsed ? BRAND.burgundyDark : 'white'
                        }}
                    >
                        {sidebarCollapsed ? (
                            <Menu className="w-4 h-4" />
                        ) : (
                            <X className="w-4 h-4" />
                        )}
                    </button>
                )}

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
                                    className="text-[9px] font-bold tracking-wider"
                                    style={{ color: BRAND.gold }}
                                >
                                    STANDARDS INSTITUTE
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
                        YOUR JOURNEY
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
                        <span className="font-medium">My Progress</span>
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
                        <span className="font-medium">Start Lessons</span>
                        {pathname === basePath && (
                            <ChevronRight className="w-4 h-4 ml-auto" />
                        )}
                    </Link>

                    {/* Graduates Channel - Read-only feed of success stories */}
                    <Link
                        href={`${basePath}/graduates`}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive(`${basePath}/graduates`)
                            ? "text-white shadow-lg"
                            : "text-white/70 hover:text-white hover:bg-white/5"
                            }`}
                        style={isActive(`${basePath}/graduates`) ? { background: BRAND.goldMetallic, color: BRAND.burgundyDark } : {}}
                    >
                        <Users className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">Graduate Stories</span>
                    </Link>

                    {/* Circle Pod - Premium Gold Metal Style */}
                    <Link
                        href={`${basePath}/circle`}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative overflow-hidden ${isActive(`${basePath}/circle`)
                            ? "shadow-lg"
                            : "hover:shadow-md"
                            }`}
                        style={isActive(`${basePath}/circle`) ? {
                            background: BRAND.goldMetallic,
                            color: BRAND.burgundyDark
                        } : {
                            background: `linear-gradient(135deg, ${BRAND.gold}15 0%, ${BRAND.gold}05 100%)`,
                            border: `1px solid ${BRAND.gold}30`
                        }}
                    >
                        {/* Animated background glow */}
                        {!isActive(`${basePath}/circle`) && (
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{ background: `linear-gradient(135deg, ${BRAND.gold}20 0%, transparent 70%)` }}
                            />
                        )}
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 relative z-10"
                            style={{
                                background: isActive(`${basePath}/circle`) ? `${BRAND.burgundy}30` : BRAND.goldMetallic
                            }}
                        >
                            <Target className="w-4 h-4" style={{ color: isActive(`${basePath}/circle`) ? BRAND.burgundyDark : BRAND.burgundyDark }} />
                        </div>
                        <div className="flex-1 relative z-10">
                            <span className="font-semibold" style={{ color: isActive(`${basePath}/circle`) ? BRAND.burgundyDark : BRAND.gold }}>
                                ✨ Circle Pod
                            </span>
                            <p className="text-[10px]" style={{ color: isActive(`${basePath}/circle`) ? BRAND.burgundy : `${BRAND.goldLight}70` }}>
                                Your study group
                            </p>
                        </div>
                        <span
                            className="px-1.5 py-0.5 rounded-full text-[9px] font-bold relative z-10 animate-pulse"
                            style={{
                                background: isActive(`${basePath}/circle`) ? BRAND.burgundy : BRAND.goldMetallic,
                                color: isActive(`${basePath}/circle`) ? 'white' : BRAND.burgundyDark
                            }}
                        >
                            LIVE
                        </span>
                    </Link>

                    {/* FREE RESOURCES Section */}
                    {resources.length > 0 && (
                        <>
                            <p className="text-[10px] font-bold tracking-widest px-3 mt-4 mb-2" style={{ color: `${BRAND.gold}80` }}>
                                📦 FREE RESOURCES
                            </p>
                            {resources.map((resource) => {
                                const IconMap: Record<string, typeof DollarSign> = {
                                    DollarSign, Target, Calculator, Map,
                                };
                                const Icon = IconMap[resource.icon] || Target;
                                const formatTime = (mins: number) => {
                                    if (mins <= 0) return "";
                                    if (mins < 60) return `${mins}m`;
                                    const h = Math.floor(mins / 60);
                                    const m = mins % 60;
                                    return m > 0 ? `${h}h ${m}m` : `${h}h`;
                                };

                                if (resource.isUnlocked) {
                                    return (
                                        <Link
                                            key={resource.id}
                                            href={`${basePath}/tools/${resource.id}`}
                                            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${isActive(`${basePath}/tools/${resource.id}`)
                                                ? "shadow-lg"
                                                : "hover:bg-white/5"
                                                }`}
                                            style={isActive(`${basePath}/tools/${resource.id}`) ? { background: BRAND.goldMetallic, color: BRAND.burgundyDark } : {}}
                                        >
                                            <div
                                                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                                                style={{ background: isActive(`${basePath}/tools/${resource.id}`) ? `${BRAND.burgundy}30` : `${BRAND.gold}20` }}
                                            >
                                                <Icon className="w-3.5 h-3.5" style={{ color: isActive(`${basePath}/tools/${resource.id}`) ? BRAND.burgundyDark : BRAND.gold }} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="text-sm font-medium" style={{ color: isActive(`${basePath}/tools/${resource.id}`) ? BRAND.burgundyDark : 'white' }}>
                                                    {resource.name}
                                                </span>
                                            </div>
                                            <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: `${BRAND.gold}30`, color: BRAND.gold }}>✓</span>
                                        </Link>
                                    );
                                }

                                return (
                                    <div
                                        key={resource.id}
                                        className="flex items-center gap-3 px-3 py-2 rounded-xl opacity-50 cursor-not-allowed"
                                    >
                                        <div
                                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                                            style={{ background: `${BRAND.burgundy}40` }}
                                        >
                                            <Lock className="w-3 h-3 text-white/50" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-sm text-white/50">{resource.name}</span>
                                            <p className="text-[9px] text-white/30">Unlocks in {formatTime(resource.minutesUntilUnlock)}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    )}

                    {/* Private DMs removed - all messaging now in Circle Pod */}

                    {/* Certificate Section - Always visible with locked/unlocked states */}
                    <p className="text-[10px] font-bold tracking-widest px-3 mt-4 mb-2" style={{ color: `${BRAND.gold}80` }}>
                        YOUR CREDENTIALS
                    </p>

                    {/* Certificate - Locked/Unlocked based on diplomaCompleted */}
                    {diplomaCompleted ? (
                        // UNLOCKED - Gold metallic, clickable
                        <Link
                            href={`${basePath}/certificate`}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${isActive(`${basePath}/certificate`)
                                ? "shadow-lg"
                                : "hover:shadow-md"
                                }`}
                            style={{
                                background: isActive(`${basePath}/certificate`) ? BRAND.goldMetallic : `linear-gradient(135deg, ${BRAND.gold}20 0%, ${BRAND.gold}10 100%)`,
                                color: isActive(`${basePath}/certificate`) ? BRAND.burgundyDark : 'white',
                                border: `1px solid ${BRAND.gold}50`
                            }}
                        >
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ background: BRAND.goldMetallic }}
                            >
                                <Award className="w-4 h-4" style={{ color: BRAND.burgundyDark }} />
                            </div>
                            <div className="flex-1">
                                <span className="font-semibold" style={{ color: isActive(`${basePath}/certificate`) ? BRAND.burgundyDark : BRAND.gold }}>
                                    🏆 My Certificate
                                </span>
                                <p className="text-[10px]" style={{ color: isActive(`${basePath}/certificate`) ? BRAND.burgundy : `${BRAND.goldLight}80` }}>
                                    Ready to download!
                                </p>
                            </div>
                            <ChevronRight className="w-4 h-4" style={{ color: isActive(`${basePath}/certificate`) ? BRAND.burgundy : BRAND.gold }} />
                        </Link>
                    ) : (
                        // LOCKED - Greyed out, not clickable
                        <div
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-not-allowed opacity-60"
                            style={{
                                background: `${BRAND.burgundy}30`,
                                border: `1px solid ${BRAND.burgundy}40`
                            }}
                        >
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ background: `${BRAND.burgundy}50` }}
                            >
                                <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <span className="font-medium text-white/50">🔒 Certificate</span>
                                <p className="text-[10px] text-white/30">Pass exam to unlock</p>
                            </div>
                        </div>
                    )}
                </nav>

                {/* Compact Social Proof Ticker - Single Line */}
                <div className="px-4 pb-3">
                    <div
                        className="rounded-xl p-2.5 flex items-center gap-2"
                        style={{ background: `linear-gradient(135deg, ${BRAND.gold}12 0%, ${BRAND.gold}05 100%)`, border: `1px solid ${BRAND.gold}25` }}
                    >
                        {/* Income badge */}
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: `${BRAND.gold}20` }}>
                            <DollarSign className="w-3 h-3" style={{ color: BRAND.gold }} />
                            <span className="text-xs font-bold text-white">$4K-$8K</span>
                            <span className="text-[10px] text-white/50">/mo</span>
                        </div>

                        {/* Divider */}
                        <div className="w-px h-4" style={{ background: `${BRAND.burgundy}60` }} />

                        {/* Rotating success event */}
                        <div className="flex-1 min-w-0 text-xs text-white/80 truncate transition-all duration-300">
                            {successEvents[currentEvent]?.type === "income" ? (
                                <span>💰 <strong className="text-white">{successEvents[currentEvent]?.name}</strong> earned {successEvents[currentEvent]?.amount}</span>
                            ) : successEvents[currentEvent]?.type === "cert" ? (
                                <span>🎓 <strong className="text-white">{successEvents[currentEvent]?.name}</strong> {successEvents[currentEvent]?.action}</span>
                            ) : (
                                <span>📅 <strong className="text-white">{successEvents[currentEvent]?.name}</strong> {successEvents[currentEvent]?.action}</span>
                            )}
                        </div>

                        {/* Online count */}
                        <div className="flex items-center gap-1 text-[10px] whitespace-nowrap" style={{ color: `${BRAND.goldLight}70` }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            {onlineCount}
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
