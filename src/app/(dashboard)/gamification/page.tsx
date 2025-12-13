"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Trophy,
    Star,
    Flame,
    Target,
    BookOpen,
    MessageSquare,
    Users,
    Award,
    Zap,
    TrendingUp,
    Calendar,
    Gift,
    Crown,
    Sparkles,
    ChevronRight,
    Clock,
    CheckCircle2,
    PlayCircle,
    Heart
} from "lucide-react";

// Level definitions
const LEVELS = [
    { level: 1, name: "Beginner", minXP: 0, maxXP: 500, icon: "🌱", color: "gray" },
    { level: 2, name: "Practitioner", minXP: 500, maxXP: 2000, icon: "🌿", color: "green" },
    { level: 3, name: "Specialist", minXP: 2000, maxXP: 5000, icon: "🌳", color: "blue" },
    { level: 4, name: "Master Coach", minXP: 5000, maxXP: 10000, icon: "🏆", color: "purple" },
];

// XP earning activities
const XP_ACTIVITIES = [
    { action: "Complete a lesson", xp: 25, icon: BookOpen, color: "blue" },
    { action: "Finish a course", xp: 200, icon: Award, color: "purple" },
    { action: "Read an e-book chapter", xp: 10, icon: BookOpen, color: "emerald" },
    { action: "Finish an e-book", xp: 50, icon: Trophy, color: "amber" },
    { action: "Post in community", xp: 5, icon: MessageSquare, color: "pink" },
    { action: "Watch a training", xp: 15, icon: PlayCircle, color: "red" },
    { action: "Complete a challenge", xp: 100, icon: Target, color: "orange" },
    { action: "7-day login streak", xp: 50, icon: Flame, color: "red" },
    { action: "Use coach workspace", xp: 10, icon: Users, color: "teal" },
];

// Mock recent activity
const RECENT_ACTIVITY = [
    { action: "Completed lesson: Gut Health Basics", xp: 25, time: "2 hours ago", icon: "📚" },
    { action: "Watched training: Client Onboarding", xp: 15, time: "5 hours ago", icon: "🎥" },
    { action: "Posted in community", xp: 5, time: "1 day ago", icon: "💬" },
    { action: "Finished e-book: Hormone Blueprint", xp: 50, time: "2 days ago", icon: "📖" },
    { action: "7-day streak bonus!", xp: 50, time: "3 days ago", icon: "🔥" },
];

// Mock leaderboard
const LEADERBOARD = [
    { rank: 1, name: "Sarah M.", xp: 4250, level: "Specialist", avatar: "👩‍⚕️" },
    { rank: 2, name: "Jennifer L.", xp: 3890, level: "Specialist", avatar: "👩‍🔬" },
    { rank: 3, name: "Michael T.", xp: 3450, level: "Specialist", avatar: "👨‍⚕️" },
    { rank: 4, name: "You", xp: 1650, level: "Practitioner", avatar: "⭐", isUser: true },
    { rank: 5, name: "Amanda R.", xp: 1580, level: "Practitioner", avatar: "👩‍💻" },
    { rank: 6, name: "Lisa K.", xp: 1420, level: "Practitioner", avatar: "👩‍🏫" },
];

// Mock badges
const BADGES = [
    { id: "first-course", name: "First Steps", description: "Complete your first course", icon: "🎓", earned: true },
    { id: "streak-7", name: "On Fire", description: "7-day login streak", icon: "🔥", earned: true },
    { id: "community-star", name: "Community Star", description: "Make 50 community posts", icon: "⭐", earned: false, progress: 12, total: 50 },
    { id: "bookworm", name: "Bookworm", description: "Read 5 e-books", icon: "📚", earned: false, progress: 2, total: 5 },
    { id: "certified", name: "Certified", description: "Earn your first certification", icon: "🏆", earned: true },
    { id: "mentor", name: "Mentor", description: "Help 10 community members", icon: "🤝", earned: false, progress: 3, total: 10 },
    { id: "marathon", name: "Marathon", description: "30-day login streak", icon: "🏃", earned: false, progress: 7, total: 30 },
    { id: "master", name: "Master Coach", description: "Reach Level 4", icon: "👑", earned: false },
];

export default function GamificationPage() {
    // Mock user stats (would come from database)
    const [userXP, setUserXP] = useState(1650);
    const [streak, setStreak] = useState(7);

    // Calculate current level
    const currentLevel = LEVELS.find(l => userXP >= l.minXP && userXP < l.maxXP) || LEVELS[3];
    const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1);
    const xpInCurrentLevel = userXP - currentLevel.minXP;
    const xpNeededForLevel = currentLevel.maxXP - currentLevel.minXP;
    const levelProgress = (xpInCurrentLevel / xpNeededForLevel) * 100;
    const xpToNextLevel = nextLevel ? nextLevel.minXP - userXP : 0;

    const earnedBadges = BADGES.filter(b => b.earned).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
            <div className="px-4 sm:px-6 lg:px-8 py-8">

                {/* Hero Header - AccrediPro Branded */}
                <div className="relative mb-8 bg-gradient-to-r from-burgundy-700 via-burgundy-600 to-burgundy-800 rounded-3xl p-8 md:p-12 text-white overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                    </div>

                    {/* Logo/Brand */}
                    <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-2 opacity-80">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <span className="text-lg font-bold text-gold-400">A</span>
                        </div>
                        <span className="text-sm font-semibold text-white/80 hidden md:block">AccrediPro Academy</span>
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        {/* Level Circle with Gold Ring */}
                        <div className="relative">
                            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-gold-400/30 to-gold-600/20 backdrop-blur-sm flex items-center justify-center border-4 border-gold-400/50 shadow-lg shadow-gold-500/20">
                                <div className="text-center">
                                    <span className="text-5xl">{currentLevel.icon}</span>
                                    <p className="text-xs font-medium mt-1 text-gold-200">Level {currentLevel.level}</p>
                                </div>
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                                <Badge className="bg-gradient-to-r from-gold-400 to-gold-500 text-burgundy-900 border-0 font-bold px-4 py-1 shadow-lg">
                                    {userXP.toLocaleString()} XP
                                </Badge>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex-1 text-center md:text-left">
                            <p className="text-gold-300 text-sm font-medium mb-1">Your Current Level</p>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                {currentLevel.name}
                            </h1>
                            <p className="text-lg text-white/80 mb-4">
                                Keep learning to reach <span className="font-semibold text-gold-300">{nextLevel?.name || "the top!"}</span>
                            </p>

                            {/* Level Progress */}
                            <div className="max-w-md">
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-gold-200">Level {currentLevel.level}</span>
                                    <span className="text-gold-200">{xpToNextLevel.toLocaleString()} XP to Level {currentLevel.level + 1}</span>
                                </div>
                                <div className="h-4 bg-burgundy-900/50 rounded-full overflow-hidden border border-gold-500/30">
                                    <div
                                        className="h-full bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 rounded-full transition-all shadow-inner"
                                        style={{ width: `${levelProgress}%` }}
                                    />
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
                                <div className="flex items-center gap-2 bg-burgundy-900/40 border border-gold-500/20 px-4 py-2 rounded-full">
                                    <Flame className="w-5 h-5 text-orange-400" />
                                    <span className="font-semibold text-gold-200">{streak} day streak</span>
                                </div>
                                <div className="flex items-center gap-2 bg-burgundy-900/40 border border-gold-500/20 px-4 py-2 rounded-full">
                                    <Trophy className="w-5 h-5 text-gold-400" />
                                    <span className="font-semibold text-gold-200">{earnedBadges} badges</span>
                                </div>
                                <div className="flex items-center gap-2 bg-burgundy-900/40 border border-gold-500/20 px-4 py-2 rounded-full">
                                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                                    <span className="font-semibold text-gold-200">Rank #4</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Streak Card */}
                        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                                        <Flame className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">🔥 {streak} Day Streak!</h2>
                                        <p className="text-sm text-gray-600">Keep it going to earn bonus XP</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-orange-600">+50 XP</p>
                                    <p className="text-xs text-gray-500">next milestone: 14 days</p>
                                </div>
                            </div>

                            {/* Week View */}
                            <div className="flex justify-between gap-2">
                                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                                    <div key={day} className="flex-1 text-center">
                                        <p className="text-xs text-gray-500 mb-1">{day}</p>
                                        <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${i < 7 ? "bg-gradient-to-br from-orange-400 to-red-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                                            {i < 7 ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-lg">○</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* How to Earn XP */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-yellow-500" />
                                How to Earn XP
                            </h2>
                            <div className="grid md:grid-cols-3 gap-3">
                                {XP_ACTIVITIES.map((activity) => (
                                    <div key={activity.action} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                        <div className={`w-10 h-10 bg-${activity.color}-100 rounded-lg flex items-center justify-center`}>
                                            <activity.icon className={`w-5 h-5 text-${activity.color}-600`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{activity.action}</p>
                                            <p className="text-xs text-emerald-600 font-semibold">+{activity.xp} XP</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-blue-500" />
                                Recent Activity
                            </h2>
                            <div className="space-y-3">
                                {RECENT_ACTIVITY.map((activity, i) => (
                                    <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                        <span className="text-2xl">{activity.icon}</span>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                            <p className="text-xs text-gray-500">{activity.time}</p>
                                        </div>
                                        <Badge className="bg-emerald-100 text-emerald-700 border-0">+{activity.xp} XP</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Badges */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-amber-500" />
                                    Badges ({earnedBadges}/{BADGES.length})
                                </h2>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {BADGES.map((badge) => (
                                    <div
                                        key={badge.id}
                                        className={`text-center p-4 rounded-xl border-2 transition-all ${badge.earned ? "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200" : "bg-gray-50 border-gray-100 opacity-60"}`}
                                    >
                                        <span className={`text-4xl ${!badge.earned && "grayscale opacity-50"}`}>{badge.icon}</span>
                                        <p className="text-sm font-semibold text-gray-900 mt-2">{badge.name}</p>
                                        <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
                                        {badge.earned ? (
                                            <Badge className="mt-2 bg-emerald-100 text-emerald-700 border-0 text-xs">Earned!</Badge>
                                        ) : badge.progress ? (
                                            <div className="mt-2">
                                                <Progress value={(badge.progress / badge.total!) * 100} className="h-1.5" />
                                                <p className="text-xs text-gray-400 mt-1">{badge.progress}/{badge.total}</p>
                                            </div>
                                        ) : (
                                            <Badge className="mt-2 bg-gray-100 text-gray-500 border-0 text-xs">Locked</Badge>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Leaderboard */}
                    <div className="space-y-6">
                        {/* Leaderboard */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Crown className="w-5 h-5 text-yellow-500" />
                                Leaderboard
                            </h2>
                            <div className="space-y-3">
                                {LEADERBOARD.map((user) => (
                                    <div
                                        key={user.rank}
                                        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${user.isUser ? "bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200" : "bg-gray-50"}`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${user.rank === 1 ? "bg-yellow-400 text-yellow-900" : user.rank === 2 ? "bg-gray-300 text-gray-700" : user.rank === 3 ? "bg-orange-300 text-orange-800" : "bg-gray-100 text-gray-600"}`}>
                                            {user.rank}
                                        </div>
                                        <span className="text-2xl">{user.avatar}</span>
                                        <div className="flex-1">
                                            <p className={`text-sm font-medium ${user.isUser ? "text-purple-700" : "text-gray-900"}`}>
                                                {user.name} {user.isUser && "(You)"}
                                            </p>
                                            <p className="text-xs text-gray-500">{user.level}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-900">{user.xp.toLocaleString()}</p>
                                            <p className="text-xs text-gray-400">XP</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Level Guide */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Star className="w-5 h-5 text-purple-500" />
                                Level Guide
                            </h2>
                            <div className="space-y-3">
                                {LEVELS.map((level) => {
                                    const isCurrentLevel = level.level === currentLevel.level;
                                    const isCompleted = userXP >= level.maxXP;
                                    return (
                                        <div
                                            key={level.level}
                                            className={`flex items-center gap-3 p-3 rounded-xl ${isCurrentLevel ? "bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-300" : isCompleted ? "bg-emerald-50" : "bg-gray-50"}`}
                                        >
                                            <span className="text-2xl">{level.icon}</span>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">
                                                    Level {level.level}: {level.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {level.minXP.toLocaleString()} - {level.maxXP.toLocaleString()} XP
                                                </p>
                                            </div>
                                            {isCompleted ? (
                                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                            ) : isCurrentLevel ? (
                                                <Badge className="bg-purple-100 text-purple-700 border-0 text-xs">Current</Badge>
                                            ) : null}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
                            <h3 className="font-bold mb-3">🚀 Quick XP Boost</h3>
                            <p className="text-sm text-white/80 mb-4">Complete these actions to level up faster!</p>
                            <div className="space-y-2">
                                <a href="/my-courses" className="flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                                    <span className="text-sm">Continue your course</span>
                                    <ChevronRight className="w-4 h-4" />
                                </a>
                                <a href="/my-library" className="flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                                    <span className="text-sm">Read an e-book</span>
                                    <ChevronRight className="w-4 h-4" />
                                </a>
                                <a href="/community" className="flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                                    <span className="text-sm">Post in community</span>
                                    <ChevronRight className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
