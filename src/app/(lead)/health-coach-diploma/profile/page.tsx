import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
    User,
    Mail,
    Camera,
    Award,
    BookOpen,
    CheckCircle,
    Trophy,
    Target,
    Sparkles,
    Clock,
    TrendingUp,
    Star,
} from "lucide-react";

export const dynamic = "force-dynamic";

async function getProfileData(userId: string) {
    const [user, leadOnboarding, completionTags] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: {
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
                createdAt: true,
            },
        }),
        prisma.leadOnboarding.findUnique({
            where: { userId },
            select: {
                watchedVideo: true,
                completedQuestions: true,
                claimedCertificate: true,
            },
        }).catch(() => null),
        prisma.userTag.findMany({
            where: {
                userId,
                tag: { startsWith: "health-coach-lesson-complete:" },
            },
        }),
    ]);

    const completedLessons = completionTags.length;
    const progress = Math.round((completedLessons / 9) * 100);
    const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    }) : 'Recently';

    return {
        user,
        leadOnboarding,
        completedLessons,
        progress,
        memberSince,
    };
}

export default async function LeadProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/login");

    const { user, leadOnboarding, completedLessons, progress, memberSince } = await getProfileData(session.user.id);
    if (!user) redirect("/login");

    const milestones = [
        { label: "Welcome Video", completed: leadOnboarding?.watchedVideo || false, icon: "🎬" },
        { label: "Onboarding Questions", completed: leadOnboarding?.completedQuestions || false, icon: "✨" },
        { label: "First 3 Lessons", completed: completedLessons >= 3, icon: "📚" },
        { label: "Halfway There", completed: completedLessons >= 5, icon: "🎯" },
        { label: "All 9 Lessons", completed: completedLessons >= 9, icon: "🏆" },
        { label: "Certificate Claimed", completed: leadOnboarding?.claimedCertificate || false, icon: "🎓" },
    ];

    const completedMilestones = milestones.filter(m => m.completed).length;

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto">
            {/* Premium Header - FULLY RESPONSIVE */}
            <div className="bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800 rounded-2xl p-5 md:p-8 mb-6 md:mb-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-burgundy-400/20 rounded-full blur-2xl" />

                {/* Stack on mobile, row on desktop */}
                <div className="relative flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-left">
                    {/* Avatar - smaller on mobile */}
                    <div className="relative flex-shrink-0">
                        <div className="absolute inset-0 bg-gold-400/30 rounded-full blur-xl" />
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.firstName || "Profile"}
                                className="relative w-20 h-20 md:w-28 md:h-28 rounded-full object-cover border-4 border-white/30 shadow-2xl"
                            />
                        ) : (
                            <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full bg-burgundy-500/50 backdrop-blur-sm flex items-center justify-center border-4 border-white/30 shadow-2xl">
                                <span className="text-2xl md:text-4xl font-bold">{user.firstName?.[0] || "U"}</span>
                            </div>
                        )}
                        <button className="absolute bottom-0 right-0 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                            <Camera className="w-4 h-4 md:w-5 md:h-5 text-burgundy-600" />
                        </button>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl md:text-3xl font-bold mb-1 truncate">
                            {user.firstName} {user.lastName}
                        </h1>
                        <p className="text-burgundy-200 flex items-center justify-center md:justify-start gap-2 mb-3 md:mb-4 text-sm md:text-base truncate">
                            <Mail className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{user.email}</span>
                        </p>
                        <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                            <Badge className="bg-gold-500/20 text-gold-300 border-gold-400/30 px-2 md:px-3 py-1 text-xs">
                                <Sparkles className="w-3 h-3 mr-1" />
                                WH Student
                            </Badge>
                            <Badge className="bg-white/10 text-white border-white/20 px-2 md:px-3 py-1 text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                {memberSince}
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                {/* Journey Progress */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="pb-2 px-4 md:px-6">
                        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                            <BookOpen className="w-5 h-5 text-burgundy-600" />
                            Your Learning Journey
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 md:px-6">
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-600">Mini Diploma Progress</span>
                                <span className="text-sm font-bold text-burgundy-600">{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-3" />
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
                            <span className="text-gray-600">
                                <CheckCircle className="w-4 h-4 inline mr-1 text-emerald-500" />
                                {completedLessons} of 9 lessons complete
                            </span>
                            {completedLessons < 9 && (
                                <Link href="/health-coach-diploma">
                                    <Button size="sm" className="bg-burgundy-600 hover:bg-burgundy-700 w-full sm:w-auto">
                                        Continue Learning
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Milestones */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="pb-2 px-4 md:px-6">
                        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                            <Trophy className="w-5 h-5 text-gold-500" />
                            Milestones Achieved
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 md:px-6">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-3xl font-bold text-burgundy-600">{completedMilestones}</span>
                            <span className="text-gray-500">of {milestones.length}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {milestones.map((m, i) => (
                                <div
                                    key={i}
                                    className={`flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded-full text-xs font-medium ${m.completed
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-gray-100 text-gray-400"
                                        }`}
                                >
                                    <span>{m.icon}</span>
                                    <span className="hidden sm:inline">{m.label}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Career Potential Card - FULLY RESPONSIVE */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-burgundy-50 to-gold-50 mb-6 md:mb-8">
                <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gold-100 flex items-center justify-center flex-shrink-0">
                            <TrendingUp className="w-7 h-7 md:w-8 md:h-8 text-gold-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                                Your Path to $3-5K/month
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Complete your mini diploma and unlock your career roadmap to start earning as a Women&apos;s Health practitioner.
                            </p>
                        </div>
                        <Link href="/health-coach-diploma" className="w-full sm:w-auto">
                            <Button className="bg-burgundy-600 hover:bg-burgundy-700 w-full sm:w-auto">
                                <Target className="w-4 h-4 mr-2" />
                                View Roadmap
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Profile Settings */}
            <Card className="border-0 shadow-lg">
                <CardHeader className="px-4 md:px-6">
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5 text-burgundy-600" />
                        Profile Settings
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-4 md:px-6 space-y-4 md:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                            <input
                                type="text"
                                defaultValue={user.firstName || ""}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-all text-sm md:text-base"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                            <input
                                type="text"
                                defaultValue={user.lastName || ""}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-all text-sm md:text-base"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-all text-sm md:text-base"
                        />
                        <p className="text-xs text-gray-400 mt-1">Optional - We&apos;ll only use this for important updates</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            defaultValue={user.email || ""}
                            disabled
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed text-sm md:text-base truncate"
                        />
                        <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                    </div>
                    <Button className="bg-burgundy-600 hover:bg-burgundy-700 px-8 w-full sm:w-auto">
                        <Star className="w-4 h-4 mr-2" />
                        Save Changes
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
