"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    User,
    BookOpen,
    Users,
    MessageSquare,
    Award,
    Target,
    ChevronRight,
    TrendingUp,
    LogOut,
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

    const navItems = [
        {
            href: "/womens-health-diploma/profile",
            icon: User,
            label: "My Profile",
            show: true,
        },
        {
            href: "/womens-health-diploma",
            icon: BookOpen,
            label: "My Mini Diploma",
            show: true,
        },
        {
            href: "/womens-health-diploma/community",
            icon: Users,
            label: "Community",
            show: true,
        },
        // Chat with Sarah removed - it uses dashboard layout
        // Will add back when we have lead-specific chat page
        {
            href: "/womens-health-diploma/certificate",
            icon: Award,
            label: "My Certificate",
            show: diplomaCompleted,
        },
        {
            href: "/womens-health-diploma/career-roadmap",
            icon: Target,
            label: "Your Career Roadmap",
            show: diplomaCompleted,
        },
    ];

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
                {navItems
                    .filter((item) => item.show)
                    .map((item) => {
                        const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                                    ? "bg-burgundy-700 text-white"
                                    : "text-burgundy-200 hover:bg-burgundy-700/50 hover:text-white"
                                    }`}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                <span className="font-medium">{item.label}</span>
                                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                            </Link>
                        );
                    })}
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
