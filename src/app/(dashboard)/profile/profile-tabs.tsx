"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ProfileEditor } from "./profile-editor";
import { KnowledgeBaseTab } from "./knowledge-base-tab";
import {
    User,
    Calendar,
    Award,
    BookOpen,
    Clock,
    Settings,
    Shield,
    Flame,
    Star,
    Lock,
    Trophy,
    Target,
    MessageSquare,
    Zap,
    Crown,
    Sparkles,
    ChevronRight,
    CheckCircle2,
    PlayCircle,
    Users,
    Eye,
    EyeOff,
    Loader2,
    Bot,
    Phone,
    Pencil,
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

interface ProfileTabsProps {
    user: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        email: string;
        phone: string | null;
        knowledgeBase?: string | null; // Added field
        avatar: string | null;
        bio: string | null;
        role: string;
        emailVerified: Date | null;
        createdAt: Date;
        enrollments: Array<{
            id: string;
            status: string;
            progress: number;
            course: {
                id: string;
                title: string;
                thumbnail: string | null;
                certificateType: string;
            };
        }>;
        certificates: Array<{
            id: string;
            issuedAt: Date;
            course: {
                title: string;
                certificateType: string;
            };
        }>;
        badges: Array<{
            badgeId: string;
            earnedAt: Date;
            badge: {
                id: string;
                name: string;
                icon: string;
                description: string;
                points: number;
            };
        }>;
        streak: {
            currentStreak: number;
            totalPoints: number;
        } | null;
        _count: {
            communityPosts: number;
            postComments: number;
        };
    };
    allBadges: Array<{
        id: string;
        name: string;
        icon: string;
        description: string;
        points: number;
    }>;
}

type TabType = "overview" | "progress" | "settings" | "knowledge";

export function ProfileTabs({ user, allBadges }: ProfileTabsProps) {
    const [activeTab, setActiveTab] = useState<TabType>("overview");
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Phone editing state
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [phoneValue, setPhoneValue] = useState(user.phone || "");
    const [isSavingPhone, setIsSavingPhone] = useState(false);

    const handleSavePhone = async () => {
        setIsSavingPhone(true);
        try {
            const response = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: phoneValue }),
            });
            if (response.ok) {
                setIsEditingPhone(false);
                window.location.reload();
            }
        } catch (error) {
            console.error("Failed to save phone:", error);
        } finally {
            setIsSavingPhone(false);
        }
    };

    const handleChangePassword = async () => {
        setPasswordError("");
        setPasswordSuccess(false);

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError("All fields are required");
            return;
        }

        if (newPassword.length < 8) {
            setPasswordError("New password must be at least 8 characters");
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError("New passwords do not match");
            return;
        }

        setIsChangingPassword(true);

        try {
            const response = await fetch("/api/user/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setPasswordError(data.error || "Failed to change password");
                return;
            }

            setPasswordSuccess(true);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            // Close dialog after 2 seconds
            setTimeout(() => {
                setPasswordDialogOpen(false);
                setPasswordSuccess(false);
            }, 2000);
        } catch (error) {
            setPasswordError("An error occurred. Please try again.");
        } finally {
            setIsChangingPassword(false);
        }
    };

    const initials = `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase() || "U";
    const totalCourses = user.enrollments.length;
    const completedCourses = user.enrollments.filter(e => e.status === "COMPLETED").length;
    const inProgressCourses = user.enrollments.filter(e => e.status === "ACTIVE").length;

    const earnedBadgeIds = new Set(user.badges.map(ub => ub.badgeId));
    const totalPoints = user.streak?.totalPoints || 0;
    const currentStreak = user.streak?.currentStreak || 0;

    // Calculate current level
    const currentLevel = LEVELS.find(l => totalPoints >= l.minXP && totalPoints < l.maxXP) || LEVELS[0];
    const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1);
    const xpInCurrentLevel = totalPoints - currentLevel.minXP;
    const xpNeededForLevel = currentLevel.maxXP - currentLevel.minXP;
    const levelProgress = (xpInCurrentLevel / xpNeededForLevel) * 100;
    const xpToNextLevel = nextLevel ? nextLevel.minXP - totalPoints : 0;

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Compact Header - Matching Catalog Style */}
            <Card className="bg-gradient-to-r from-burgundy-700 via-burgundy-600 to-burgundy-700 border-0 overflow-hidden">
                <CardContent className="px-5 py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Left: Avatar + Name + Level */}
                        <div className="flex items-center gap-4">
                            <ProfileEditor
                                userId={user.id}
                                avatar={user.avatar}
                                bio={user.bio}
                                initials={initials}
                            />
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge className="bg-gold-400/20 text-gold-300 border-gold-400/30 text-[10px]">
                                        {user.role}
                                    </Badge>
                                    <Badge className="bg-white/10 text-white/80 border-0 text-[10px]">
                                        {currentLevel.icon} Level {currentLevel.level}
                                    </Badge>
                                </div>
                                <h1 className="text-xl font-bold text-white">
                                    {user.firstName} <span className="text-gold-400">{user.lastName}</span>
                                </h1>
                                <p className="text-xs text-burgundy-200 mt-0.5 hidden sm:block">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        {/* Right: Stats + Settings */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="hidden md:flex items-center gap-2">
                                <Badge className="bg-white/10 text-white border-0 px-3 py-1.5">
                                    <Star className="w-3 h-3 mr-1.5 text-gold-400" />
                                    {totalPoints.toLocaleString()} XP
                                </Badge>
                                <Badge className="bg-white/10 text-white border-0 px-3 py-1.5">
                                    <Flame className="w-3 h-3 mr-1.5 text-orange-400" />
                                    {currentStreak} day streak
                                </Badge>
                                <Badge className="bg-white/10 text-white border-0 px-3 py-1.5">
                                    <Trophy className="w-3 h-3 mr-1.5 text-purple-400" />
                                    {user.badges.length} badges
                                </Badge>
                            </div>
                            <Button
                                size="sm"
                                className="bg-gold-400 text-burgundy-900 hover:bg-gold-300 font-semibold h-9"
                                onClick={() => setActiveTab("settings")}
                            >
                                <Settings className="w-4 h-4 mr-1.5" />
                                Settings
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 pb-2">
                <button
                    onClick={() => setActiveTab("overview")}
                    className={`px-6 py-3 rounded-t-xl font-medium text-sm transition-all ${activeTab === "overview"
                        ? "bg-burgundy-600 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                        }`}
                >
                    <User className="w-4 h-4 inline mr-2" />
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab("progress")}
                    className={`px-6 py-3 rounded-t-xl font-medium text-sm transition-all ${activeTab === "progress"
                        ? "bg-burgundy-600 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                        }`}
                >
                    <Trophy className="w-4 h-4 inline mr-2" />
                    Progress & XP
                </button>
                <button
                    onClick={() => setActiveTab("settings")}
                    className={`px-6 py-3 rounded-t-xl font-medium text-sm transition-all ${activeTab === "settings"
                        ? "bg-burgundy-600 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                        }`}
                >
                    <Settings className="w-4 h-4 inline mr-2" />
                    Settings
                </button>
                {/* AI Knowledge tab - only for MENTOR/ADMIN users */}
                {(user.role === "MENTOR" || user.role === "ADMIN") && (
                    <button
                        onClick={() => setActiveTab("knowledge")}
                        className={`px-6 py-3 rounded-t-xl font-medium text-sm transition-all ${activeTab === "knowledge"
                            ? "bg-burgundy-600 text-white"
                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                            }`}
                    >
                        <Bot className="w-4 h-4 inline mr-2" />
                        AI Knowledge
                    </button>
                )}
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Activity Summary */}
                    <Card className="card-premium">
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-burgundy-600" />
                                Activity Summary
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Community Posts</span>
                                    <span className="font-medium text-gray-900">{user._count.communityPosts}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Comments</span>
                                    <span className="font-medium text-gray-900">{user._count.postComments}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">In Progress</span>
                                    <span className="font-medium text-gray-900">{inProgressCourses} courses</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Certificates Earned</span>
                                    <span className="font-medium text-gold-600">{user.certificates.length}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* My Courses */}
                    <div className="lg:col-span-2">
                        <Card className="card-premium">
                            <CardContent className="p-6">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-burgundy-600" />
                                    My Courses
                                </h3>
                                {user.enrollments.length > 0 ? (
                                    <div className="space-y-4">
                                        {user.enrollments.slice(0, 5).map((enrollment) => (
                                            <div key={enrollment.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                                <div className="w-16 h-16 rounded-lg bg-burgundy-100 flex items-center justify-center flex-shrink-0">
                                                    <BookOpen className="w-6 h-6 text-burgundy-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-gray-900 truncate">
                                                        {enrollment.course.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Progress value={enrollment.progress} className="h-2 flex-1" />
                                                        <span className="text-sm text-gray-500 whitespace-nowrap">
                                                            {Math.round(enrollment.progress)}%
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <Badge variant={enrollment.status === "COMPLETED" ? "default" : "secondary"} className={`text-xs ${enrollment.status === "COMPLETED" ? "bg-green-100 text-green-700" : ""}`}>
                                                            {enrollment.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">No courses enrolled yet</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Certificates */}
                    {user.certificates.length > 0 && (
                        <div className="lg:col-span-3">
                            <Card className="card-premium">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Award className="w-5 h-5 text-gold-500" />
                                        My Certificates
                                    </h3>
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {user.certificates.map((cert) => (
                                            <div key={cert.id} className="p-4 rounded-xl border-2 border-gold-200 bg-gradient-to-br from-gold-50 to-white">
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 rounded-lg bg-gold-100">
                                                        <Award className="w-5 h-5 text-gold-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">{cert.course.title}</h4>
                                                        <p className="text-sm text-gray-500">{cert.course.certificateType.replace("_", " ")}</p>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            Issued {formatDate(cert.issuedAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            )}

            {activeTab === "progress" && (
                <div className="space-y-6">
                    {/* Level Progress Card */}
                    <Card className="bg-gradient-to-r from-burgundy-700 via-burgundy-600 to-burgundy-800 border-0 text-white overflow-hidden relative">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        </div>
                        <CardContent className="p-8 relative">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gold-400/30 to-gold-600/20 backdrop-blur-sm flex items-center justify-center border-4 border-gold-400/50">
                                        <div className="text-center">
                                            <span className="text-5xl">{currentLevel.icon}</span>
                                            <p className="text-xs font-medium mt-1 text-gold-200">Level {currentLevel.level}</p>
                                        </div>
                                    </div>
                                    <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold-400 to-gold-500 text-burgundy-900 border-0 font-bold px-4 py-1">
                                        {totalPoints.toLocaleString()} XP
                                    </Badge>
                                </div>

                                <div className="flex-1 text-center md:text-left">
                                    <p className="text-gold-300 text-sm font-medium mb-1">Your Current Level</p>
                                    <h2 className="text-3xl md:text-4xl font-bold mb-2">{currentLevel.name}</h2>
                                    <p className="text-lg text-white/80 mb-4">
                                        Keep learning to reach <span className="font-semibold text-gold-300">{nextLevel?.name || "the top!"}</span>
                                    </p>

                                    <div className="max-w-md">
                                        <div className="flex items-center justify-between text-sm mb-2">
                                            <span className="text-gold-200">Level {currentLevel.level}</span>
                                            <span className="text-gold-200">{xpToNextLevel.toLocaleString()} XP to Level {currentLevel.level + 1}</span>
                                        </div>
                                        <div className="h-4 bg-burgundy-900/50 rounded-full overflow-hidden border border-gold-500/30">
                                            <div
                                                className="h-full bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 rounded-full transition-all"
                                                style={{ width: `${levelProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            {/* Streak Card */}
                            <Card className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                                                <Flame className="w-7 h-7 text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-900">🔥 {currentStreak} Day Streak!</h2>
                                                <p className="text-sm text-gray-600">Keep it going to earn bonus XP</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-orange-600">+50 XP</p>
                                            <p className="text-xs text-gray-500">next milestone: 14 days</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between gap-2">
                                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                                            <div key={day} className="flex-1 text-center">
                                                <p className="text-xs text-gray-500 mb-1">{day}</p>
                                                <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${i < currentStreak % 7 || currentStreak >= 7 ? "bg-gradient-to-br from-orange-400 to-red-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                                                    {i < currentStreak % 7 || currentStreak >= 7 ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-lg">○</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* How to Earn XP */}
                            <Card className="card-premium">
                                <CardContent className="p-6">
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
                                </CardContent>
                            </Card>

                            {/* Badges */}
                            <Card className="card-premium">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Trophy className="w-5 h-5 text-purple-600" />
                                        Achievements & Badges
                                        <span className="text-sm font-normal text-gray-500">
                                            ({user.badges.length}/{allBadges.length} unlocked)
                                        </span>
                                    </h3>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                                        {allBadges.map((badge) => {
                                            const isEarned = earnedBadgeIds.has(badge.id);
                                            const earnedBadge = user.badges.find(ub => ub.badgeId === badge.id);

                                            return (
                                                <div
                                                    key={badge.id}
                                                    className={`relative group flex flex-col items-center p-4 rounded-xl border-2 transition-all ${isEarned
                                                        ? "bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-sm"
                                                        : "bg-gray-100 border-gray-200 opacity-50"
                                                        }`}
                                                    title={badge.description}
                                                >
                                                    <div className={`text-3xl mb-2 ${isEarned ? "" : "grayscale"}`}>
                                                        {badge.icon}
                                                    </div>
                                                    <p className={`text-xs font-medium text-center ${isEarned ? "text-gray-900" : "text-gray-500"}`}>
                                                        {badge.name}
                                                    </p>
                                                    <p className={`text-xs text-center ${isEarned ? "text-amber-600" : "text-gray-400"}`}>
                                                        +{badge.points} pts
                                                    </p>
                                                    {!isEarned && (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <Lock className="w-4 h-4 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Leaderboard */}
                            <Card className="card-premium">
                                <CardContent className="p-6">
                                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Crown className="w-5 h-5 text-yellow-500" />
                                        Leaderboard
                                    </h2>
                                    <div className="space-y-3">
                                        {LEADERBOARD.map((leaderUser) => (
                                            <div
                                                key={leaderUser.rank}
                                                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${leaderUser.isUser ? "bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200" : "bg-gray-50"}`}
                                            >
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${leaderUser.rank === 1 ? "bg-yellow-400 text-yellow-900" : leaderUser.rank === 2 ? "bg-gray-300 text-gray-700" : leaderUser.rank === 3 ? "bg-orange-300 text-orange-800" : "bg-gray-100 text-gray-600"}`}>
                                                    {leaderUser.rank}
                                                </div>
                                                <span className="text-2xl">{leaderUser.avatar}</span>
                                                <div className="flex-1">
                                                    <p className={`text-sm font-medium ${leaderUser.isUser ? "text-purple-700" : "text-gray-900"}`}>
                                                        {leaderUser.name} {leaderUser.isUser && "(You)"}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{leaderUser.level}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-gray-900">{leaderUser.xp.toLocaleString()}</p>
                                                    <p className="text-xs text-gray-400">XP</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Level Guide */}
                            <Card className="card-premium">
                                <CardContent className="p-6">
                                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Star className="w-5 h-5 text-purple-500" />
                                        Level Guide
                                    </h2>
                                    <div className="space-y-3">
                                        {LEVELS.map((level) => {
                                            const isCurrentLevel = level.level === currentLevel.level;
                                            const isCompleted = totalPoints >= level.maxXP;
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
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card className="bg-gradient-to-br from-emerald-600 to-teal-600 border-0 text-white">
                                <CardContent className="p-6">
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
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Knowledge content - only for MENTOR/ADMIN users */}
            {activeTab === "knowledge" && (user.role === "MENTOR" || user.role === "ADMIN") && (
                <KnowledgeBaseTab initialContent={user.knowledgeBase || null} />
            )}

            {activeTab === "settings" && (
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Account Information - First */}
                    <Card className="card-premium lg:col-span-2">
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-burgundy-600" />
                                Account Information
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-sm text-gray-500 mb-1">Full Name</p>
                                    <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-sm text-gray-500 mb-1">Email Address</p>
                                    <p className="font-medium text-gray-900">{user.email}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-sm text-gray-500 mb-1">Member Since</p>
                                    <p className="font-medium text-gray-900">{formatDate(user.createdAt)}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-sm text-gray-500 mb-1">Account Status</p>
                                    <p className="font-medium text-gray-900 flex items-center gap-2">
                                        {user.emailVerified ? (
                                            <>
                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                Verified
                                            </>
                                        ) : (
                                            <>
                                                <Shield className="w-4 h-4 text-amber-500" />
                                                Not Verified
                                            </>
                                        )}
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                                <Phone className="w-3 h-3" />
                                                Phone Number
                                            </p>
                                            {isEditingPhone ? (
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Input
                                                        value={phoneValue}
                                                        onChange={(e) => setPhoneValue(e.target.value)}
                                                        placeholder="(555) 123-4567"
                                                        type="tel"
                                                        className="h-8 w-40"
                                                    />
                                                    <Button
                                                        size="sm"
                                                        onClick={handleSavePhone}
                                                        disabled={isSavingPhone}
                                                        className="h-8 bg-burgundy-600 hover:bg-burgundy-700"
                                                    >
                                                        {isSavingPhone ? <Loader2 className="w-3 h-3 animate-spin" /> : "Save"}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => {
                                                            setIsEditingPhone(false);
                                                            setPhoneValue(user.phone || "");
                                                        }}
                                                        className="h-8"
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            ) : (
                                                <p className="font-medium text-gray-900">
                                                    {user.phone || <span className="text-gray-400 italic">Not set</span>}
                                                </p>
                                            )}
                                        </div>
                                        {!isEditingPhone && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setIsEditingPhone(true)}
                                                className="text-burgundy-600 hover:text-burgundy-700"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Privacy & Security - Second (only Change Password) */}
                    <Card className="card-premium lg:col-span-2">
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-burgundy-600" />
                                Privacy & Security
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        <p className="font-medium text-gray-900">Change Password</p>
                                        <p className="text-sm text-gray-500">Update your account password</p>
                                    </div>
                                    <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm">Change</Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                            <DialogHeader>
                                                <DialogTitle className="flex items-center gap-2">
                                                    <Lock className="w-5 h-5 text-burgundy-600" />
                                                    Change Password
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Enter your current password and choose a new one.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                {passwordSuccess ? (
                                                    <div className="flex flex-col items-center py-6">
                                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                                                        </div>
                                                        <p className="text-lg font-semibold text-gray-900">Password Changed!</p>
                                                        <p className="text-sm text-gray-500">Your password has been updated successfully.</p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="current-password">Current Password</Label>
                                                            <div className="relative">
                                                                <Input
                                                                    id="current-password"
                                                                    type={showCurrentPassword ? "text" : "password"}
                                                                    value={currentPassword}
                                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                                    placeholder="Enter current password"
                                                                    className="pr-10"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                                >
                                                                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="new-password">New Password</Label>
                                                            <div className="relative">
                                                                <Input
                                                                    id="new-password"
                                                                    type={showNewPassword ? "text" : "password"}
                                                                    value={newPassword}
                                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                                    placeholder="Enter new password (min. 8 characters)"
                                                                    className="pr-10"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                                >
                                                                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                                                            <div className="relative">
                                                                <Input
                                                                    id="confirm-password"
                                                                    type={showConfirmPassword ? "text" : "password"}
                                                                    value={confirmPassword}
                                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                                    placeholder="Confirm new password"
                                                                    className="pr-10"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                                >
                                                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                                </button>
                                                            </div>
                                                        </div>
                                                        {passwordError && (
                                                            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{passwordError}</p>
                                                        )}
                                                        <Button
                                                            onClick={handleChangePassword}
                                                            disabled={isChangingPassword}
                                                            className="w-full bg-burgundy-600 hover:bg-burgundy-700"
                                                        >
                                                            {isChangingPassword ? (
                                                                <>
                                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                                    Changing Password...
                                                                </>
                                                            ) : (
                                                                "Change Password"
                                                            )}
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
