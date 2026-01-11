import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertTriangle,
    ArrowRight,
    Play,
    BookOpen,
    Award,
    Filter,
} from "lucide-react";
import { LeadsTableClient } from "./LeadsTableClient";

export const dynamic = "force-dynamic";

async function getLeadsData() {
    // Get all users enrolled in mini-diplomas (leads)
    const leads = await prisma.enrollment.findMany({
        where: {
            course: {
                slug: { in: ["womens-health-mini-diploma", "fm-mini-diploma"] }
            }
        },
        select: {
            id: true,
            status: true,
            enrolledAt: true,
            lastAccessedAt: true,
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    avatar: true,
                    createdAt: true,
                    lastLoginAt: true,
                },
            },
            course: {
                select: {
                    slug: true,
                    title: true,
                },
            },
        },
        orderBy: { enrolledAt: "desc" },
    });

    // Get lead onboarding data for each user
    const userIds = leads.map(l => l.user.id);

    const [onboardingData, lessonCompletions] = await Promise.all([
        prisma.leadOnboarding.findMany({
            where: { userId: { in: userIds } },
            select: {
                userId: true,
                watchedVideo: true,
                completedQuestions: true,
                claimedCertificate: true,
                // Onboarding answers
                bringReason: true,
                currentSituation: true,
                incomeGoal: true,
                lifeChangeGoal: true,
                doingItFor: true,
            },
        }),
        prisma.userTag.findMany({
            where: {
                userId: { in: userIds },
                tag: { startsWith: "wh-lesson-complete:" },
            },
            select: {
                userId: true,
                tag: true,
            },
        }),
    ]);

    // Create lookup maps
    const onboardingMap = new Map(onboardingData.map(o => [o.userId, o]));
    const lessonsMap = new Map<string, number>();
    lessonCompletions.forEach(l => {
        lessonsMap.set(l.userId, (lessonsMap.get(l.userId) || 0) + 1);
    });

    // Calculate funnel stats
    const funnelStats = {
        total: leads.length,
        watchedVideo: onboardingData.filter(o => o.watchedVideo).length,
        completedQuestions: onboardingData.filter(o => o.completedQuestions).length,
        startedLessons: [...lessonsMap.values()].filter(v => v >= 1).length,
        completedHalf: [...lessonsMap.values()].filter(v => v >= 5).length,
        completedAll: [...lessonsMap.values()].filter(v => v >= 9).length,
        claimedCertificate: onboardingData.filter(o => o.claimedCertificate).length,
    };

    // Enrich leads with progress data
    const enrichedLeads = leads.map(lead => {
        const onboarding = onboardingMap.get(lead.user.id);
        const lessonsCompleted = lessonsMap.get(lead.user.id) || 0;

        // Calculate progress: video (10%) + questions (10%) + 9 lessons (80%)
        let progress = 0;
        if (onboarding?.watchedVideo) progress += 10;
        if (onboarding?.completedQuestions) progress += 10;
        progress += Math.min(80, (lessonsCompleted / 9) * 80);

        // Calculate days since last active (use lastLoginAt if lastAccessedAt is null)
        const lastActive = lead.lastAccessedAt || lead.user.lastLoginAt || lead.enrolledAt;
        const daysSinceActive = Math.floor((Date.now() - new Date(lastActive).getTime()) / (1000 * 60 * 60 * 24));

        // Calculate days until expiry (7-day access from enrollment)
        const expiryDate = new Date(lead.enrolledAt);
        expiryDate.setDate(expiryDate.getDate() + 7);
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

        // Determine diploma type
        const diplomaType = lead.course.slug.includes("womens-health") ? "WH" : "FM";

        // Calculate status
        let status: "hot" | "warm" | "cold" | "completed" = "warm";
        if (lessonsCompleted >= 9) status = "completed";
        else if (daysSinceActive <= 1) status = "hot";
        else if (daysSinceActive <= 3) status = "warm";
        else status = "cold";

        return {
            id: lead.id,
            progress: Math.round(progress),
            lessonsCompleted,
            watchedVideo: onboarding?.watchedVideo || false,
            completedQuestions: onboarding?.completedQuestions || false,
            claimedCertificate: onboarding?.claimedCertificate || false,
            status,
            daysSinceActive,
            daysUntilExpiry,
            enrolledAt: lead.enrolledAt,
            diplomaType: diplomaType as "WH" | "FM",
            user: lead.user,
            // Onboarding answers for admin view
            onboardingAnswers: onboarding ? {
                bringReason: onboarding.bringReason,
                currentSituation: onboarding.currentSituation,
                incomeGoal: onboarding.incomeGoal,
                lifeChangeGoal: onboarding.lifeChangeGoal,
                doingItFor: onboarding.doingItFor,
            } : null,
        };
    });

    return { leads: enrichedLeads, funnelStats };
}

export default async function AdminLeadsPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/login");

    // Check admin access
    if (session.user.role !== "ADMIN" && session.user.role !== "MENTOR") {
        redirect("/dashboard");
    }

    const { leads, funnelStats } = await getLeadsData();

    const funnelSteps = [
        { label: "Enrolled", value: funnelStats.total, icon: Users, color: "bg-gray-100 text-gray-600" },
        { label: "Video Watched", value: funnelStats.watchedVideo, icon: Play, color: "bg-blue-100 text-blue-600" },
        { label: "Questions Done", value: funnelStats.completedQuestions, icon: CheckCircle, color: "bg-purple-100 text-purple-600" },
        { label: "Started Lessons", value: funnelStats.startedLessons, icon: BookOpen, color: "bg-emerald-100 text-emerald-600" },
        { label: "50% Complete", value: funnelStats.completedHalf, icon: TrendingUp, color: "bg-amber-100 text-amber-600" },
        { label: "Diploma Done", value: funnelStats.completedAll, icon: Award, color: "bg-gold-100 text-gold-600" },
        { label: "Certificate", value: funnelStats.claimedCertificate, icon: Award, color: "bg-burgundy-100 text-burgundy-600" },
    ];

    // Count by status
    const hotCount = leads.filter(l => l.status === "hot").length;
    const warmCount = leads.filter(l => l.status === "warm").length;
    const coldCount = leads.filter(l => l.status === "cold").length;
    const completedCount = leads.filter(l => l.status === "completed").length;
    const expiringSoon = leads.filter(l => l.daysUntilExpiry <= 2 && l.daysUntilExpiry > 0).length;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
                    <p className="text-gray-500 mt-1">Track and convert mini-diploma leads</p>
                </div>
            </div>

            {/* Expiring Soon Alert */}
            {expiringSoon > 0 && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="text-red-700 font-medium">
                        ⚠️ {expiringSoon} lead{expiringSoon > 1 ? "s" : ""} expiring in the next 48 hours!
                    </span>
                </div>
            )}

            {/* Funnel Visualization */}
            <Card className="mb-8 border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-burgundy-600" />
                        Lead Funnel
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-end justify-between gap-4">
                        {funnelSteps.map((step, i) => {
                            const Icon = step.icon;
                            const percentage = funnelStats.total > 0
                                ? Math.round((step.value / funnelStats.total) * 100)
                                : 0;
                            const heightPct = Math.max(20, percentage);

                            return (
                                <div key={step.label} className="flex-1 text-center">
                                    <div
                                        className={`mx-auto mb-2 rounded-t-lg ${step.color} transition-all duration-500`}
                                        style={{
                                            height: `${heightPct * 1.5}px`,
                                            minHeight: '30px'
                                        }}
                                    />
                                    <p className="text-2xl font-bold text-gray-900">{step.value}</p>
                                    <p className="text-xs text-gray-500 mt-1">{step.label}</p>
                                    <p className="text-xs text-gray-400">{percentage}%</p>
                                    {i < funnelSteps.length - 1 && (
                                        <ArrowRight className="w-4 h-4 text-gray-300 mx-auto mt-2 hidden lg:block" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-5 gap-4 mb-8">
                <Card className="border-0 shadow-md">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{hotCount}</p>
                                <p className="text-xs text-gray-500">🔥 Hot</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-md">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{warmCount}</p>
                                <p className="text-xs text-gray-500">⏳ Warm</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-md">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{coldCount}</p>
                                <p className="text-xs text-gray-500">❄️ Cold</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-md">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-burgundy-100 flex items-center justify-center">
                                <Award className="w-5 h-5 text-burgundy-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
                                <p className="text-xs text-gray-500">✅ Done</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className={`border-0 shadow-md ${expiringSoon > 0 ? "ring-2 ring-red-400" : ""}`}>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{expiringSoon}</p>
                                <p className="text-xs text-gray-500">⚠️ Expiring</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Leads Table */}
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-burgundy-600" />
                        All Leads ({leads.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <LeadsTableClient leads={leads} />
                </CardContent>
            </Card>
        </div>
    );
}
