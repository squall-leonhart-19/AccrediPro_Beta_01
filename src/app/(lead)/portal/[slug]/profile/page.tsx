"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getConfigByPortalSlug } from "@/lib/mini-diploma-registry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    TrendingUp,
    Star,
    FileText,
    GraduationCap,
    Shield,
    Calendar,
    Loader2,
} from "lucide-react";

// Premium gold gradient
const goldGradient = "linear-gradient(135deg, #D4AF37 0%, #F7E7A0 25%, #D4AF37 50%, #B8860B 75%, #D4AF37 100%)";

// Generate student ID from user ID
function generateStudentId(id: string): string {
    const hash = id.slice(-6).toUpperCase();
    return `STU-${hash}`;
}

// Generate application ID
function generateApplicationId(portalSlug: string): string {
    const prefix = portalSlug.substring(0, 2).toUpperCase();
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    return `APP-${prefix}-${dateStr}`;
}

interface UserData {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string | null;
}

export default function LeadProfilePage() {
    const params = useParams();
    const slug = params.slug as string;
    const config = getConfigByPortalSlug(slug);

    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [completedLessons, setCompletedLessons] = useState(0);
    const [examPassed, setExamPassed] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({ firstName: "", lastName: "", phone: "" });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const totalLessons = config?.lessons?.length || 9;
    const progress = Math.round((completedLessons / totalLessons) * 100);

    // Fetch user and profile data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user info from session API
                const userRes = await fetch("/api/auth/session");
                if (userRes.ok) {
                    const sessionData = await userRes.json();
                    if (sessionData?.user) {
                        const nameParts = (sessionData.user.name || "").split(" ");
                        setUser({
                            id: sessionData.user.id || "unknown",
                            firstName: nameParts[0] || "",
                            lastName: nameParts.slice(1).join(" ") || "",
                            email: sessionData.user.email || "",
                            avatar: sessionData.user.image || null,
                        });
                        setFormData({
                            firstName: nameParts[0] || "",
                            lastName: nameParts.slice(1).join(" ") || "",
                            phone: "",
                        });
                    }
                }

                // Fetch lesson status
                const lessonRes = await fetch(`/api/lead-onboarding/lesson-status?lesson=1&niche=${slug}`);
                if (lessonRes.ok) {
                    const data = await lessonRes.json();
                    if (data.firstName) {
                        setFormData(prev => ({ ...prev, firstName: data.firstName }));
                    }
                    setExamPassed(data.examPassed || false);
                }

                // Get completed lessons count
                const progressRes = await fetch(`/api/mini-diploma/progress?niche=${slug}`);
                if (progressRes.ok) {
                    const progressData = await progressRes.json();
                    setCompletedLessons(progressData.completedLessons || 0);
                }
            } catch (e) {
                console.error("Failed to fetch data:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    // Handle image upload
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select an image file");
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", "avatar");

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                setUser(prev => prev ? { ...prev, avatar: data.url } : null);
            } else {
                alert("Upload failed. Please try again.");
            }
        } catch (e) {
            console.error("Upload error:", e);
            alert("Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    // Handle save
    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                alert("Profile saved!");
            }
        } catch (e) {
            console.error("Save error:", e);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 to-amber-50">
                <Loader2 className="w-8 h-8 animate-spin text-burgundy-600" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 to-amber-50">
                <p>Please log in to view your profile.</p>
            </div>
        );
    }

    const displayName = formData.firstName || user.firstName || "Student";
    const studentId = generateStudentId(user.id);
    const applicationId = generateApplicationId(slug);
    const cohortNumber = Math.floor((Date.now() - new Date("2024-01-01").getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
    const memberSince = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const milestones = [
        { label: "Application Submitted", completed: true, icon: "📝" },
        { label: "First 3 Lessons", completed: completedLessons >= 3, icon: "📚" },
        { label: "Halfway There", completed: completedLessons >= Math.ceil(totalLessons / 2), icon: "🎯" },
        { label: `All ${totalLessons} Lessons`, completed: completedLessons >= totalLessons, icon: "🏆" },
        { label: "Final Assessment", completed: examPassed, icon: "✅" },
        { label: "Scholarship Qualified", completed: examPassed, icon: "🎓" },
    ];

    const completedMilestones = milestones.filter(m => m.completed).length;

    return (
        <div className="min-h-screen bg-gradient-to-b from-rose-50 to-amber-50">
            {/* Full-width Premium Header */}
            <div
                className="w-full py-3 px-4"
                style={{ background: goldGradient }}
            >
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-burgundy-900" />
                        <span className="font-bold text-burgundy-900 uppercase tracking-wider text-sm">
                            ASI Student Portal
                        </span>
                    </div>
                    <div className="text-burgundy-800 font-mono text-sm">
                        Cohort #{cohortNumber}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full px-4 md:px-8 lg:px-12 py-6 md:py-8">
                <div className="max-w-7xl mx-auto">

                    {/* Student Card Header */}
                    <div className="bg-gradient-to-br from-burgundy-700 via-burgundy-800 to-burgundy-900 rounded-2xl overflow-hidden mb-8 shadow-2xl">
                        <div className="p-6 md:p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-burgundy-400/20 rounded-full blur-2xl" />

                            <div className="relative flex flex-col lg:flex-row items-center gap-6 text-center lg:text-left">
                                {/* Avatar with upload */}
                                <div className="relative flex-shrink-0">
                                    <div className="absolute inset-0 bg-gold-400/30 rounded-full blur-xl" />
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={displayName}
                                            className="relative w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-gold-400/50 shadow-2xl"
                                        />
                                    ) : (
                                        <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-burgundy-500/50 backdrop-blur-sm flex items-center justify-center border-4 border-gold-400/50 shadow-2xl">
                                            <span className="text-4xl md:text-5xl font-bold">{displayName[0] || "U"}</span>
                                        </div>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="absolute bottom-1 right-1 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform disabled:opacity-50"
                                    >
                                        {uploading ? (
                                            <Loader2 className="w-5 h-5 text-burgundy-600 animate-spin" />
                                        ) : (
                                            <Camera className="w-5 h-5 md:w-6 md:h-6 text-burgundy-600" />
                                        )}
                                    </button>
                                </div>

                                {/* Student Info */}
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                        {displayName} {formData.lastName || user.lastName}
                                    </h1>
                                    <p className="text-burgundy-200 flex items-center justify-center lg:justify-start gap-2 mb-4 text-sm">
                                        <Mail className="w-4 h-4 flex-shrink-0" />
                                        <span className="truncate">{user.email}</span>
                                    </p>

                                    {/* ID Cards Grid */}
                                    <div className="grid grid-cols-2 gap-3 mb-4 max-w-md mx-auto lg:mx-0">
                                        <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
                                            <div className="flex items-center gap-1 text-burgundy-300 text-xs mb-1">
                                                <User className="w-3 h-3" />
                                                Student ID
                                            </div>
                                            <p className="font-mono font-bold text-white">{studentId}</p>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
                                            <div className="flex items-center gap-1 text-burgundy-300 text-xs mb-1">
                                                <FileText className="w-3 h-3" />
                                                Application
                                            </div>
                                            <p className="font-mono font-bold text-white">{applicationId}</p>
                                        </div>
                                    </div>

                                    {/* Status Badges */}
                                    <div className="flex items-center justify-center lg:justify-start gap-2 flex-wrap">
                                        <Badge className="bg-gold-500/20 text-gold-300 border-gold-400/30 px-3 py-1">
                                            <GraduationCap className="w-3 h-3 mr-1" />
                                            {config?.name} Student
                                        </Badge>
                                        {examPassed && (
                                            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 px-3 py-1">
                                                <Award className="w-3 h-3 mr-1" />
                                                Scholarship Qualified
                                            </Badge>
                                        )}
                                        <Badge className="bg-white/10 text-white border-white/20 px-3 py-1">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            Since {memberSince}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Journey Progress */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <BookOpen className="w-5 h-5 text-burgundy-600" />
                                    Your Learning Journey
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-600">Mini Diploma Progress</span>
                                        <span
                                            className="text-sm font-bold px-3 py-1 rounded-full"
                                            style={{ background: goldGradient, color: '#4E1F24' }}
                                        >
                                            {progress}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-amber-100 rounded-full h-4 overflow-hidden">
                                        <div
                                            className="h-4 rounded-full transition-all duration-500"
                                            style={{ width: `${progress}%`, background: goldGradient }}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <span className="text-gray-600 text-sm">
                                        <CheckCircle className="w-4 h-4 inline mr-1 text-emerald-500" />
                                        {completedLessons} of {totalLessons} lessons complete
                                    </span>
                                    {completedLessons < totalLessons && (
                                        <Link href={`/portal/${slug}`}>
                                            <button
                                                className="px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all"
                                                style={{ background: goldGradient, color: '#4E1F24' }}
                                            >
                                                Continue Learning
                                            </button>
                                        </Link>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Milestones */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Trophy className="w-5 h-5 text-gold-500" />
                                    Milestones Achieved
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-4xl font-bold text-burgundy-600">{completedMilestones}</span>
                                    <span className="text-gray-500">of {milestones.length}</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {milestones.map((m, i) => (
                                        <div
                                            key={i}
                                            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium ${m.completed
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

                    {/* Career Potential Card */}
                    <Card className="border-0 shadow-lg overflow-hidden mb-8">
                        <div
                            className="p-6"
                            style={{ background: 'linear-gradient(to right, #FDF6E3, #FFFBEB)' }}
                        >
                            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
                                    style={{ background: goldGradient }}
                                >
                                    <TrendingUp className="w-8 h-8 text-burgundy-900" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                                        Your Path to $5-15K/month
                                    </h3>
                                    <p className="text-gray-600">
                                        Complete your mini diploma and unlock your career roadmap to start earning as a {config?.name} practitioner.
                                    </p>
                                </div>
                                <Link href={`/portal/${slug}/career-roadmap`}>
                                    <button
                                        className="px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                                        style={{ background: goldGradient, color: '#4E1F24' }}
                                    >
                                        <Target className="w-4 h-4" />
                                        View Roadmap
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </Card>

                    {/* Profile Settings */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5 text-burgundy-600" />
                                Profile Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+1 (555) 000-0000"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-all"
                                />
                                <p className="text-xs text-gray-400 mt-1">Optional - We'll only use this for important updates</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-8 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
                                style={{ background: goldGradient, color: '#4E1F24' }}
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Star className="w-4 h-4" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
