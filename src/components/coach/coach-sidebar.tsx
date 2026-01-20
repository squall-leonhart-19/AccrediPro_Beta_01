"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    UserCircle,
    Calendar,
    ClipboardList,
    Award,
    ChevronLeft,
} from "lucide-react";

const navItems = [
    { href: "/coach/workspace", label: "Dashboard", icon: LayoutDashboard },
    { href: "/coach/clients", label: "My Clients", icon: Users },
    { href: "/coach/profile", label: "My Profile", icon: UserCircle },
    { href: "/coach/availability", label: "Availability", icon: Calendar },
    { href: "/coach/programs", label: "Programs", icon: ClipboardList },
];

export function CoachSidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-500 rounded-xl flex items-center justify-center">
                        <Award className="w-5 h-5 text-burgundy-900" />
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900">Coach Portal</h2>
                        <p className="text-xs text-gray-500">AccrediPro Certified</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                isActive
                                    ? "bg-burgundy-50 text-burgundy-700 border border-burgundy-100"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-burgundy-600" : "text-gray-400")} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Back to Dashboard */}
            <div className="p-4 border-t border-gray-100">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Main Dashboard
                </Link>
            </div>
        </div>
    );
}
