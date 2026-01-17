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
    FileText,
    Hash,
    GraduationCap,
    Shield,
    Calendar,
    Users,
} from "lucide-react";

export const dynamic = "force-dynamic";

// Generate student ID from user ID
function generateStudentId(userId: string): string {
    const hash = userId.slice(-6).toUpperCase();
    return `STU-${hash}`;
}

// Generate application ID based on enrollment date
function generateApplicationId(createdAt: Date): string {
    const dateStr = `${createdAt.getFullYear()}${String(createdAt.getMonth() + 1).padStart(2, '0')}${String(createdAt.getDate()).padStart(2, '0')}`;
    return `APP-FM-${dateStr}`;
}

async function getProfileData(userId: string) {
    const [user, leadOnboarding, completionTags, examData, enrollment] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
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
                tag: { startsWith: "functional-medicine-lesson-complete:" },
            },
        }),
        // Get exam data
        prisma.miniDiplomaExam.findFirst({
            where: {
                userId,
                category: "fm-healthcare",
            },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                score: true,
                passed: true,
                scholarshipQualified: true,
                scholarshipCouponCode: true,
                scholarshipExpiresAt: true,
                attemptNumber: true,
                createdAt: true,
            },
        }),
        // Get enrollment
        prisma.enrollment.findFirst({
            where: {
                userId,
                course: { slug: "functional-medicine-mini-diploma" },
            },
            select: {
                enrolledAt: true,
            },
        }),
    ]);

    const completedLessons = completionTags.length;
    const progress = Math.round((completedLessons / 9) * 100);
    const enrolledDate = enrollment?.enrolledAt || user?.createdAt || new Date();
    const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    }) : 'Recently';

    return {
        user,
        leadOnboarding,
        completedLessons,
        progress,
        memberSince,
        examData,
        enrolledDate,
    };
}

export default async function LeadProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/login");

    const { user, leadOnboarding, completedLessons, progress, memberSince, examData, enrolledDate } = await getProfileData(session.user.id);
    if (!user) redirect("/login");

    const studentId = generateStudentId(user.id);
    const applicationId = generateApplicationId(new Date(enrolledDate));

    // Generate exam ID if they have exam data
    const examId = examData ? `FM-${new Date(examData.createdAt).toISOString().slice(0, 10).replace(/-/g, '')}-${examData.id.slice(-6).toUpperCase()}` : null;

    const milestones = [
        { label: "Application Submitted", completed: true, icon: "📝", date: memberSince },
        { label: "First 3 Lessons", completed: completedLessons >= 3, icon: "📚" },
        { label: "Halfway There", completed: completedLessons >= 5, icon: "🎯" },
        { label: "All 9 Lessons", completed: completedLessons >= 9, icon: "🏆" },
        { label: "Final Assessment", completed: !!examData?.passed, icon: "✅" },
        { label: "Scholarship Qualified", completed: !!examData?.scholarshipQualified, icon: "🎓" },
    ];

    const completedMilestones = milestones.filter(m => m.completed).length;

    // Calculate cohort number (weeks since Jan 1, 2024)
    const cohortNumber = Math.floor((Date.now() - new Date("2024-01-01").getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto">
            {/* ASI Student Card - Professional Header */}
            <div className="bg-gradient-to-br from-burgundy-700 via-burgundy-800 to-burgundy-900 rounded-2xl overflow-hidden mb-6 md:mb-8 shadow-2xl">
                {/* Top Banner with ASI Branding */}
                <div className="bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-burgundy-900" />
                        <span className="text-xs font-bold text-burgundy-900 uppercase tracking-wider">
                            ASI Student Portal
                        </span>
                    </div>
                    <div className="text-xs text-burgundy-800 font-mono">
                        Cohort #{cohortNumber}
                    </div>
                </div>

                <div className="p-5 md:p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-burgundy-400/20 rounded-full blur-2xl" />

                    <div className="relative flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-left">
                        {/* Avatar with verification badge */}
                        <div className="relative flex-shrink-0">
                            <div className="absolute inset-0 bg-gold-400/30 rounded-full blur-xl" />
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.firstName || "Profile"}
                                    className="relative w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-gold-400/50 shadow-2xl"
                                />
                            ) : (
                                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-burgundy-500/50 backdrop-blur-sm flex items-center justify-center border-4 border-gold-400/50 shadow-2xl">
                                    <span className="text-3xl md:text-5xl font-bold">{user.firstName?.[0] || "U"}</span>
                                </div>
                            )}
                            <button className="absolute bottom-1 right-1 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                <Camera className="w-4 h-4 md:w-5 md:h-5 text-burgundy-600" />
                            </button>
                            {examData?.scholarshipQualified && (
                                <div className="absolute -top-1 -right-1 w-8 h-8 bg-gold-400 rounded-full flex items-center justify-center shadow-lg">
                                    <CheckCircle className="w-5 h-5 text-burgundy-900" />
                                </div>
                            )}
                        </div>

                        {/* Student Info */}
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl md:text-3xl font-bold mb-1 truncate">
                                {user.firstName} {user.lastName}
                            </h1>
                            <p className="text-burgundy-200 flex items-center justify-center md:justify-start gap-2 mb-3 text-sm truncate">
                                <Mail className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">{user.email}</span>
                            </p>

                            {/* ID Cards Grid */}
                            <div className="grid grid-cols-2 gap-2 mb-3">
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                                    <div className="flex items-center gap-1 text-burgundy-300 text-xs mb-0.5">
                                        <User className="w-3 h-3" />
                                        Student ID
                                    </div>
                                    <p className="font-mono font-bold text-white text-sm">{studentId}</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                                    <div className="flex items-center gap-1 text-burgundy-300 text-xs mb-0.5">
                                        <FileText className="w-3 h-3" />
                                        Application
                                    </div>
                                    <p className="font-mono font-bold text-white text-sm">{applicationId}</p>
                                </div>
                            </div>

                            {/* Status Badges */}
                            <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                                <Badge className="bg-gold-500/20 text-gold-300 border-gold-400/30 px-3 py-1 text-xs">
                                    <GraduationCap className="w-3 h-3 mr-1" />
                                    FM Student
                                </Badge>
                                {examData?.scholarshipQualified && (
                                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 px-3 py-1 text-xs">
                                        <Award className="w-3 h-3 mr-1" />
                                        Scholarship Qualified
                                    </Badge>
                                )}
                                <Badge className="bg-white/10 text-white border-white/20 px-3 py-1 text-xs">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    Since {memberSince}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Exam Status Card - If they have taken the exam */}
            {examData && (
                <Card className="border-0 shadow-lg mb-6 md:mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-gold-100 to-gold-50 px-4 py-3 border-b border-gold-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Award className="w-5 h-5 text-gold-600" />
                                <span className="font-bold text-gold-800">Final Assessment Results</span>
                            </div>
                            <Badge className={examData.scholarshipQualified
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                            }>
                                {examData.scholarshipQualified ? "Scholarship Qualified" : "Completed"}
                            </Badge>
                        </div>
                    </div>
                    <CardContent className="p-4 md:p-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-slate-50 rounded-xl">
                                <div className="text-3xl font-bold text-burgundy-600">{examData.score}%</div>
                                <div className="text-xs text-slate-500 mt-1">Final Score</div>
                            </div>
                            <div className="text-center p-3 bg-slate-50 rounded-xl">
                                <div className="text-lg font-mono font-bold text-slate-700">{examId}</div>
                                <div className="text-xs text-slate-500 mt-1">Exam ID</div>
                            </div>
                            <div className="text-center p-3 bg-slate-50 rounded-xl">
                                <div className="text-lg font-mono font-bold text-slate-700">{studentId}</div>
                                <div className="text-xs text-slate-500 mt-1">Student ID</div>
                            </div>
                            <div className="text-center p-3 bg-slate-50 rounded-xl">
                                <div className="text-lg font-bold text-slate-700">
                                    {new Date(examData.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </div>
                                <div className="text-xs text-slate-500 mt-1">Exam Date</div>
                            </div>
                        </div>

                        {examData.scholarshipQualified && examData.scholarshipCouponCode && (
                            <div className="mt-4 p-4 bg-gradient-to-r from-gold-100 via-gold-50 to-gold-100 rounded-xl border-2 border-gold-300">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                                    <div>
                                        <p className="font-bold text-gold-800">ASI Graduate Scholarship</p>
                                        <p className="text-sm text-gold-600">Your exclusive coupon code</p>
                                    </div>
                                    <div className="text-center">
                                        <code className="text-xl font-bold font-mono bg-white px-4 py-2 rounded-lg border-2 border-gold-400 text-burgundy-700">
                                            {examData.scholarshipCouponCode}
                                        </code>
                                        {examData.scholarshipExpiresAt && (
                                            <p className="text-xs text-gold-600 mt-1">
                                                Expires: {new Date(examData.scholarshipExpiresAt).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

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
                                <Link href="/functional-medicine-diploma">
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

            {/* Student ID Card Preview */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-burgundy-50 via-white to-gold-50 mb-6 md:mb-8 overflow-hidden">
                <CardHeader className="pb-2 px-4 md:px-6 border-b border-burgundy-100">
                    <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                        <Hash className="w-5 h-5 text-burgundy-600" />
                        Your ASI Student Credentials
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl p-4 border border-burgundy-100 shadow-sm">
                            <div className="flex items-center gap-2 text-burgundy-600 mb-2">
                                <User className="w-4 h-4" />
                                <span className="text-xs font-medium uppercase tracking-wider">Student ID</span>
                            </div>
                            <p className="font-mono text-2xl font-bold text-slate-800">{studentId}</p>
                            <p className="text-xs text-slate-500 mt-1">Unique student identifier</p>
                        </div>

                        <div className="bg-white rounded-xl p-4 border border-burgundy-100 shadow-sm">
                            <div className="flex items-center gap-2 text-burgundy-600 mb-2">
                                <FileText className="w-4 h-4" />
                                <span className="text-xs font-medium uppercase tracking-wider">Application ID</span>
                            </div>
                            <p className="font-mono text-2xl font-bold text-slate-800">{applicationId}</p>
                            <p className="text-xs text-slate-500 mt-1">FM Mini Diploma enrollment</p>
                        </div>

                        <div className="bg-white rounded-xl p-4 border border-burgundy-100 shadow-sm">
                            <div className="flex items-center gap-2 text-burgundy-600 mb-2">
                                <Users className="w-4 h-4" />
                                <span className="text-xs font-medium uppercase tracking-wider">Cohort</span>
                            </div>
                            <p className="font-mono text-2xl font-bold text-slate-800">#{cohortNumber}</p>
                            <p className="text-xs text-slate-500 mt-1">January 2024 batch</p>
                        </div>
                    </div>

                    {examId && (
                        <div className="mt-4 bg-gold-50 rounded-xl p-4 border border-gold-200">
                            <div className="flex items-center gap-2 text-gold-700 mb-2">
                                <Award className="w-4 h-4" />
                                <span className="text-xs font-medium uppercase tracking-wider">Exam ID</span>
                            </div>
                            <p className="font-mono text-xl font-bold text-slate-800">{examId}</p>
                            <p className="text-xs text-slate-500 mt-1">Final Assessment reference number</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Certificate Download Card - Show if exam passed */}
            {examData?.passed && (
                <Card className="border-0 shadow-lg mb-6 md:mb-8 overflow-hidden bg-gradient-to-br from-gold-50 via-white to-burgundy-50">
                    <CardHeader className="pb-2 px-4 md:px-6 border-b border-gold-100">
                        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                            <Award className="w-5 h-5 text-gold-600" />
                            Your ASI Foundation Certificate
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="w-20 h-20 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg">
                                <GraduationCap className="w-10 h-10 text-white" />
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                    Congratulations! You&apos;re Certified!
                                </h3>
                                <p className="text-gray-600 text-sm mb-3">
                                    You scored <span className="font-bold text-gold-600">{examData.score}/100</span> on your final assessment.
                                    Download your official ASI Foundation Certificate below.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Link href="/functional-medicine-diploma/certificate">
                                        <Button className="bg-gold-600 hover:bg-gold-700 text-white w-full sm:w-auto">
                                            <Award className="w-4 h-4 mr-2" />
                                            View & Download Certificate
                                        </Button>
                                    </Link>
                                    <Link href="/functional-medicine-diploma/complete">
                                        <Button variant="outline" className="border-burgundy-300 text-burgundy-700 hover:bg-burgundy-50 w-full sm:w-auto">
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            Claim Scholarship
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Career Potential Card */}
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
                                Complete your mini diploma and unlock your career roadmap to start earning as a Functional Medicine practitioner.
                            </p>
                        </div>
                        <Link href="/functional-medicine-diploma" className="w-full sm:w-auto">
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
                            defaultValue={user.phone || ""}
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
