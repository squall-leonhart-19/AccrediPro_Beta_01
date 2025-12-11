"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Bell,
    X,
    BookOpen,
    Trophy,
    Flame,
    Calendar,
    MessageSquare,
    Gift,
    Star,
    ChevronRight,
    Check,
    Trash2
} from "lucide-react";

export interface Notification {
    id: string;
    type: "training" | "ebook" | "badge" | "challenge" | "streak" | "course" | "general";
    title: string;
    message: string;
    time: string;
    read: boolean;
    link?: string;
}

// Mock notifications
const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: "1",
        type: "badge",
        title: "🏆 New Badge Earned!",
        message: "You earned the 'On Fire' badge for your 7-day streak!",
        time: "2 hours ago",
        read: false,
        link: "/gamification"
    },
    {
        id: "2",
        type: "training",
        title: "📹 New Training Added",
        message: "Client Onboarding Masterclass is now available",
        time: "5 hours ago",
        read: false,
        link: "/trainings"
    },
    {
        id: "3",
        type: "ebook",
        title: "📚 New E-Book Available",
        message: "The Hormone Balance Blueprint is now in the store",
        time: "1 day ago",
        read: false,
        link: "/ebooks"
    },
    {
        id: "4",
        type: "streak",
        title: "🔥 Keep Your Streak!",
        message: "Don't forget to login tomorrow to maintain your 7-day streak",
        time: "1 day ago",
        read: true,
    },
    {
        id: "5",
        type: "challenge",
        title: "⚡ New Challenge Available",
        message: "The 7-Day Gut Health Challenge starts today!",
        time: "2 days ago",
        read: true,
        link: "/challenges"
    },
    {
        id: "6",
        type: "course",
        title: "🎓 Course Progress",
        message: "You're 60% through Certified Health Coach! Keep going!",
        time: "3 days ago",
        read: true,
        link: "/my-courses"
    },
];

const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
        case "training": return BookOpen;
        case "ebook": return BookOpen;
        case "badge": return Trophy;
        case "challenge": return Flame;
        case "streak": return Flame;
        case "course": return Star;
        default: return Bell;
    }
};

const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
        case "training": return "bg-blue-100 text-blue-600";
        case "ebook": return "bg-emerald-100 text-emerald-600";
        case "badge": return "bg-amber-100 text-amber-600";
        case "challenge": return "bg-orange-100 text-orange-600";
        case "streak": return "bg-red-100 text-red-600";
        case "course": return "bg-purple-100 text-purple-600";
        default: return "bg-gray-100 text-gray-600";
    }
};

interface NotificationBellProps {
    variant?: "light" | "dark";
}

export function NotificationBell({ variant = "light" }: NotificationBellProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const handleNotificationClick = (notification: Notification) => {
        markAsRead(notification.id);
        if (notification.link) {
            window.location.href = notification.link;
        }
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                className={variant === "dark" ? "text-burgundy-200 hover:text-white hover:bg-burgundy-700 relative" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative"}
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-pulse">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </Button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                        {/* Header */}
                        <div className="px-4 py-3 bg-gradient-to-r from-burgundy-600 to-purple-600 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Bell className="w-5 h-5" />
                                    <span className="font-semibold">Notifications</span>
                                    {unreadCount > 0 && (
                                        <Badge className="bg-white/20 text-white border-0 text-xs">{unreadCount} new</Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-1">
                                    {unreadCount > 0 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-white/80 hover:text-white hover:bg-white/10 text-xs h-7"
                                            onClick={markAllAsRead}
                                        >
                                            <Check className="w-3 h-3 mr-1" /> Mark all read
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-white/80 hover:text-white hover:bg-white/10 h-7 w-7"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                                    <p className="text-gray-500">No notifications</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {notifications.map((notification) => {
                                        const Icon = getNotificationIcon(notification.type);
                                        const colorClass = getNotificationColor(notification.type);

                                        return (
                                            <div
                                                key={notification.id}
                                                className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? "bg-blue-50/50" : ""}`}
                                                onClick={() => handleNotificationClick(notification)}
                                            >
                                                <div className="flex gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                                                        <Icon className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <p className={`text-sm ${!notification.read ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                                                                {notification.title}
                                                            </p>
                                                            {!notification.read && (
                                                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notification.message}</p>
                                                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 text-gray-400 hover:text-gray-600 flex-shrink-0"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            clearNotification(notification.id);
                                                        }}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                            <a
                                href="/gamification"
                                className="flex items-center justify-center gap-2 text-sm text-burgundy-600 hover:text-burgundy-700 font-medium"
                            >
                                View XP & Progress <ChevronRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default NotificationBell;
