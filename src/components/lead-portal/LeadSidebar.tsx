"use client";

import { useState } from "react";
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

// Zombie success events for social proof
const SUCCESS_EVENTS = [
    { type: "income", name: "Lisa K.", amount: "$1,200", time: "this week" },
    { type: "cert", name: "Maria T.", action: "Just certified!", time: "2h ago" },
    { type: "consult", name: "Jennifer M.", action: "$150 consult booked", time: "4h ago" },
    { type: "milestone", name: "Susan R.", action: "Hit $3K/month!", time: "1d ago" },
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

    const isActive = (href: string) =>
        pathname === href || pathname?.startsWith(href + "/");

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-burgundy-800 text-white flex flex-col">
            {/* Logo */}
            <div className="p-4 border-b border-burgundy-700">
                <Link href="/womens-health-diploma" className="flex items-center gap-2">
                    <Image
                        src="/newlogo.webp"
                        alt="AccrediPro"
                        width={40}
                        height={40}
                        className="rounded-lg"
                    />
                    <div>
                        <span className="font-bold text-lg">AccrediPro</span>
                        <span className="text-burgundy-300 text-xs block">Academy</span>
                    </div>
                </Link>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-burgundy-700">
                <div className="flex items-center gap-3">
                    {avatar ? (
                        <Image
                            src={avatar}
                            alt={firstName}
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-burgundy-600 flex items-center justify-center text-lg font-bold">
                            {firstName?.[0] || "U"}
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{firstName} {lastName}</p>
                        <p className="text-xs text-burgundy-300 truncate">{email}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {/* My Profile */}
                <Link
                    href="/womens-health-diploma/profile"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive("/womens-health-diploma/profile")
                        ? "bg-burgundy-700 text-white"
                        : "text-burgundy-200 hover:bg-burgundy-700/50 hover:text-white"
                        }`}
                >
                    <User className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">My Profile</span>
                </Link>

                {/* My Mini Diploma (Start Here) */}
                <Link
                    href="/womens-health-diploma"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${pathname === "/womens-health-diploma"
                        ? "bg-burgundy-700 text-white"
                        : "text-burgundy-200 hover:bg-burgundy-700/50 hover:text-white"
                        }`}
                >
                    <BookOpen className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">My Mini Diploma</span>
                    {pathname === "/womens-health-diploma" && (
                        <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                </Link>

                {/* Community - Expandable Section */}
                <div>
                    <button
                        onClick={() => setCommunityOpen(!communityOpen)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full ${pathname?.startsWith("/community")
                            ? "bg-burgundy-700 text-white"
                            : "text-burgundy-200 hover:bg-burgundy-700/50 hover:text-white"
                            }`}
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
                        <div className="ml-4 mt-1 space-y-1">
                            {/* Community Hub */}
                            <Link
                                href="/community"
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${pathname === "/community"
                                    ? "bg-burgundy-700/70 text-white"
                                    : "text-burgundy-300 hover:bg-burgundy-700/30 hover:text-white"
                                    }`}
                            >
                                <Home className="w-4 h-4 flex-shrink-0" />
                                <span>Community Hub</span>
                            </Link>

                            {/* Introduce Yourself */}
                            <Link
                                href="/community/cmj94foua0000736vfwdlheir"
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${pathname === "/community/cmj94foua0000736vfwdlheir"
                                    ? "bg-burgundy-700/70 text-white"
                                    : "text-burgundy-300 hover:bg-burgundy-700/30 hover:text-white"
                                    }`}
                            >
                                <Hand className="w-4 h-4 flex-shrink-0" />
                                <span>👋 Introduce Yourself</span>
                            </Link>

                            {/* Announcements */}
                            <Link
                                href="/community?category=announcements"
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${pathname?.includes("announcements")
                                    ? "bg-burgundy-700/70 text-white"
                                    : "text-burgundy-300 hover:bg-burgundy-700/30 hover:text-white"
                                    }`}
                            >
                                <Megaphone className="w-4 h-4 flex-shrink-0" />
                                <span>Announcements</span>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Chat with Sarah */}
                <Link
                    href="/messages"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive("/messages")
                            ? "bg-burgundy-700 text-white"
                            : "text-burgundy-200 hover:bg-burgundy-700/50 hover:text-white"
                        }`}
                >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="font-medium">Chat with Sarah</span>
                    <span className="ml-auto w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                </Link>

                {/* Certificate - Only show after completion */}
                {diplomaCompleted && (
                    <Link
                        href="/womens-health-diploma/certificate"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive("/womens-health-diploma/certificate")
                            ? "bg-burgundy-700 text-white"
                            : "text-burgundy-200 hover:bg-burgundy-700/50 hover:text-white"
                            }`}
                    >
                        <Award className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">My Certificate</span>
                    </Link>
                )}

                {/* Career Roadmap - Only show after completion */}
                {diplomaCompleted && (
                    <Link
                        href="/womens-health-diploma/career-roadmap"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive("/womens-health-diploma/career-roadmap")
                            ? "bg-burgundy-700 text-white"
                            : "text-burgundy-200 hover:bg-burgundy-700/50 hover:text-white"
                            }`}
                    >
                        <Target className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">Your Career Roadmap</span>
                    </Link>
                )}
            </nav>

            {/* Success Feed */}
            <div className="p-3 border-t border-burgundy-700">
                <div className="bg-burgundy-700/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-semibold text-emerald-400">SUCCESS FEED</span>
                    </div>
                    <div className="space-y-2 text-xs">
                        {SUCCESS_EVENTS.slice(0, 3).map((event, i) => (
                            <div key={i} className="text-burgundy-200">
                                {event.type === "income" ? (
                                    <span>💰 <strong>{event.name}</strong> earned {event.amount} {event.time}</span>
                                ) : event.type === "cert" ? (
                                    <span>🎓 <strong>{event.name}</strong> {event.action}</span>
                                ) : event.type === "consult" ? (
                                    <span>📅 <strong>{event.name}</strong> {event.action}</span>
                                ) : (
                                    <span>🎉 <strong>{event.name}</strong> {event.action}</span>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-burgundy-600 text-xs text-burgundy-300">
                        📍 {onlineCount} women learning now
                    </div>
                </div>
            </div>

            {/* Sign Out */}
            <div className="p-3 border-t border-burgundy-700">
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex items-center gap-2 text-burgundy-300 hover:text-white text-sm w-full px-3 py-2 rounded-lg hover:bg-burgundy-700/50 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
