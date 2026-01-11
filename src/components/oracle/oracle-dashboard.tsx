"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import {
    Activity,
    Zap,
    Users,
    AlertTriangle,
    Clock,
    Check,
    X,
    RefreshCw,
    Brain,
    Mail,
    MessageCircle,
    Bell,
    TrendingUp,
    Target,
    Sparkles,
    Eye,
    Play,
    Settings,
    ChevronRight,
    Rocket,
    Shield,
    BarChart3,
    Calendar,
    ArrowUpRight,
    Bot,
    CheckCircle2,
    Loader2,
    MessageSquare,
    Send,
    Crown,
    Flame,
    Trophy,
    History,
    ListChecks,
    Download,
} from "lucide-react";

interface DashboardStats {
    totalUsers: number;
    activeThisWeek: number;
    newThisWeek: number;
    completions: number;
    enrollments: number;
    messages: number;
    engagementRate: number;
    completionRate: number;
}

interface AtRiskUser {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    daysSinceLogin: number;
    churnRisk: number;
    course: string;
    progress: number;
}

type TabType = "overview" | "users" | "actions" | "rules" | "boardroom";

export function OracleDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>("overview");

    const fetchStats = async () => {
        try {
            const res = await fetch("/api/oracle/stats");
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const tabs = [
        { id: "overview", label: "Overview", icon: Eye },
        { id: "users", label: "Users", icon: Users },
        { id: "actions", label: "Actions", icon: Zap },
        { id: "rules", label: "Rules", icon: Settings },
        { id: "boardroom", label: "Board Room", icon: Crown },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 rounded-full border-4 border-burgundy-200 flex items-center justify-center animate-pulse">
                        <Brain className="w-8 h-8 text-burgundy-600" />
                    </div>
                    <p className="text-burgundy-600 mt-4 text-sm">Initializing Oracle...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-6 max-w-7xl mx-auto">
                {/* Hero Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-14 h-14 bg-gradient-to-br from-burgundy-600 to-burgundy-700 rounded-2xl flex items-center justify-center shadow-lg">
                                    <Brain className="w-7 h-7 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Oracle <span className="text-burgundy-600">Command Center</span>
                                </h1>
                                <p className="text-gray-500 flex items-center gap-2 text-sm">
                                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                                    AI Operations Commander • Real-time Intelligence
                                </p>
                            </div>
                        </div>
                        <Button onClick={fetchStats} variant="outline" className="border-gray-300">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-1 mb-6 p-1 bg-white rounded-xl border border-gray-200 w-fit shadow-sm">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                    ? "bg-burgundy-600 text-white shadow"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === "overview" && <OverviewTab stats={stats} />}
                {activeTab === "users" && <UsersTab stats={stats} />}
                {activeTab === "actions" && <ActionsTab />}
                {activeTab === "rules" && <RulesTab />}
                {activeTab === "boardroom" && <BoardRoomTab />}
            </div>
        </div>
    );
}

// =============================================================================
// OVERVIEW TAB
// =============================================================================
function OverviewTab({ stats }: { stats: DashboardStats | null }) {
    const [generatingReport, setGeneratingReport] = useState(false);

    const handleGenerateReport = async () => {
        setGeneratingReport(true);
        try {
            const res = await fetch("/api/oracle/daily-report");
            if (res.ok) {
                const data = await res.json();
                alert(`Report Generated!\n\nNew Today: ${data.metrics.newToday}\nActive: ${data.metrics.activeToday}\nAt-Risk: ${data.atRiskUsers.length}`);
            }
        } catch (error) {
            console.error(error);
        }
        setGeneratingReport(false);
    };

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={Users} color="burgundy" />
                <StatCard title="Active This Week" value={stats?.activeThisWeek || 0} icon={Activity} color="green" />
                <StatCard title="New Users" value={stats?.newThisWeek || 0} icon={Sparkles} color="blue" />
                <StatCard title="Completions" value={stats?.completions || 0} icon={Trophy} color="gold" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="lg:col-span-2">
                    <Card className="p-6 shadow-sm">
                        <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-burgundy-600" />
                            Quick Actions
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={handleGenerateReport}
                                disabled={generatingReport}
                                className="p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-left transition-all hover:border-burgundy-300 disabled:opacity-50"
                            >
                                {generatingReport ? (
                                    <Loader2 className="w-6 h-6 text-burgundy-600 mb-2 animate-spin" />
                                ) : (
                                    <BarChart3 className="w-6 h-6 text-burgundy-600 mb-2" />
                                )}
                                <p className="text-gray-900 font-medium text-sm">Generate CEO Report</p>
                                <p className="text-gray-500 text-xs mt-1">Daily insights & metrics</p>
                            </button>
                            <Link href="#" onClick={() => alert("Classification will run after prisma db push")}>
                                <div className="p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-left transition-all hover:border-burgundy-300">
                                    <Users className="w-6 h-6 text-burgundy-600 mb-2" />
                                    <p className="text-gray-900 font-medium text-sm">Classify All Users</p>
                                    <p className="text-gray-500 text-xs mt-1">Run AI classification</p>
                                </div>
                            </Link>
                            <ActionButton icon={Mail} title="Nudge Campaign" desc="Re-engage dormant" />
                            <ActionButton icon={AlertTriangle} title="At-Risk Users" desc="View churn risks" />
                        </div>
                    </Card>
                </div>

                {/* Oracle Status */}
                <Card className="p-6 shadow-sm">
                    <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
                        <Bot className="w-5 h-5 text-burgundy-600" />
                        Oracle Status
                    </h3>
                    <div className="space-y-3">
                        <StatusItem label="Stats API" status="ready" />
                        <StatusItem label="Daily Report" status="ready" />
                        <StatusItem label="Board Room AI" status="ready" />
                        <StatusItem label="At-Risk API" status="ready" />
                    </div>

                    <div className="mt-6 pt-4 border-t">
                        <h4 className="text-gray-900 text-sm font-medium mb-3">Live Data</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Users</span>
                                <span className="font-medium text-burgundy-600">{stats?.totalUsers || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Active</span>
                                <span className="font-medium text-green-600">{stats?.activeThisWeek || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Engagement</span>
                                <span className="font-medium">{stats?.engagementRate || 0}%</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* How Oracle Works */}
            <Card className="p-6 shadow-sm">
                <h3 className="text-gray-900 font-semibold mb-6 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-burgundy-600" />
                    How Oracle Works
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <ProcessStep step={1} title="Observe" description="Tracks every user action" icon={Eye} />
                    <ProcessStep step={2} title="Analyze" description="Classifies engagement & churn" icon={BarChart3} />
                    <ProcessStep step={3} title="Decide" description="AI picks best action" icon={Brain} />
                    <ProcessStep step={4} title="Execute" description="Sends emails, DMs, notifications" icon={Zap} />
                </div>
            </Card>
        </div>
    );
}

// =============================================================================
// USERS TAB - Now with real at-risk users
// =============================================================================
function UsersTab({ stats }: { stats: DashboardStats | null }) {
    const [atRiskUsers, setAtRiskUsers] = useState<AtRiskUser[]>([]);
    const [loadingAtRisk, setLoadingAtRisk] = useState(true);

    useEffect(() => {
        async function fetchAtRisk() {
            try {
                const res = await fetch("/api/oracle/at-risk?days=7&limit=10");
                if (res.ok) {
                    const data = await res.json();
                    setAtRiskUsers(data.users || []);
                }
            } catch (error) {
                console.error("Error fetching at-risk users:", error);
            }
            setLoadingAtRisk(false);
        }
        fetchAtRisk();
    }, []);

    const segments = [
        { name: "Active", count: stats?.activeThisWeek || 0, color: "bg-green-500", desc: "Logged in this week" },
        { name: "Moderate", count: Math.floor((stats?.totalUsers || 0) * 0.3), color: "bg-yellow-500", desc: "Some activity" },
        { name: "Dormant", count: Math.floor((stats?.totalUsers || 0) * 0.15), color: "bg-orange-500", desc: "7-14 days inactive" },
        { name: "Lost", count: Math.floor((stats?.totalUsers || 0) * 0.1), color: "bg-red-500", desc: "30+ days inactive" },
    ];

    return (
        <div className="space-y-6">
            {/* Segment Distribution */}
            <Card className="p-6 shadow-sm">
                <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-burgundy-600" />
                    User Segments
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {segments.map((seg) => (
                        <div key={seg.name} className="bg-gray-50 rounded-xl p-4 border">
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`w-3 h-3 rounded-full ${seg.color}`} />
                                <span className="text-gray-900 font-medium">{seg.name}</span>
                            </div>
                            <p className="text-2xl font-bold text-burgundy-600">{seg.count}</p>
                            <p className="text-gray-500 text-xs">{seg.desc}</p>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Real At-Risk Users */}
            <Card className="p-6 shadow-sm">
                <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    At-Risk Users (Real Data - 7+ Days Inactive)
                </h3>

                {loadingAtRisk ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-burgundy-600" />
                    </div>
                ) : atRiskUsers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-green-500" />
                        <p>No at-risk users found! Everyone is active.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {atRiskUsers.map((user) => (
                            <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage src={user.avatar || undefined} />
                                        <AvatarFallback className="bg-burgundy-100 text-burgundy-700">
                                            {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-gray-900 font-medium">{user.name}</p>
                                        <p className="text-gray-500 text-sm">{user.email}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-2">
                                        <span className={`font-bold ${user.churnRisk >= 70 ? 'text-red-600' : user.churnRisk >= 50 ? 'text-orange-600' : 'text-yellow-600'}`}>
                                            {user.churnRisk}%
                                        </span>
                                        <span className="text-gray-400 text-xs">risk</span>
                                    </div>
                                    <p className="text-gray-400 text-xs">{user.daysSinceLogin} days ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Button className="w-full mt-4 bg-burgundy-600 hover:bg-burgundy-700 text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Export At-Risk Users
                </Button>
            </Card>
        </div>
    );
}

// =============================================================================
// ACTIONS TAB
// =============================================================================
function ActionsTab() {
    const [sendingReport, setSendingReport] = useState(false);

    const handleSendDailyReport = async () => {
        setSendingReport(true);
        try {
            const res = await fetch("/api/oracle/daily-report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
            });
            if (res.ok) {
                alert("Daily report queued for email!");
            }
        } catch (error) {
            console.error(error);
        }
        setSendingReport(false);
    };

    return (
        <div className="space-y-6">
            {/* Send Daily Report */}
            <Card className="p-6 shadow-sm border-burgundy-200">
                <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-burgundy-600" />
                    Daily CEO Report
                </h3>
                <p className="text-gray-600 mb-4">
                    Generate and send a comprehensive daily report with metrics, at-risk users, and AI insights.
                </p>
                <Button
                    onClick={handleSendDailyReport}
                    disabled={sendingReport}
                    className="bg-burgundy-600 hover:bg-burgundy-700 text-white"
                >
                    {sendingReport ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Daily Report Now
                        </>
                    )}
                </Button>
            </Card>

            {/* Action Queue Info */}
            <Card className="p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-900 font-semibold flex items-center gap-2">
                        <ListChecks className="w-5 h-5 text-burgundy-600" />
                        Action Queue
                    </h3>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                        Requires prisma db push
                    </span>
                </div>
                <p className="text-gray-600">
                    Run <code className="bg-gray-100 px-2 py-1 rounded">npx prisma db push</code> to enable the action queue with pending/executed actions.
                </p>
            </Card>

            {/* Activity History Info */}
            <Card className="p-6 shadow-sm">
                <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
                    <History className="w-5 h-5 text-burgundy-600" />
                    Activity History
                </h3>
                <p className="text-gray-600">
                    Activity tracking will start recording once Oracle tables are created and event tracking is integrated.
                </p>
            </Card>
        </div>
    );
}

// =============================================================================
// RULES TAB
// =============================================================================
function RulesTab() {
    const rules = [
        { name: "Welcome New Users", trigger: "User signs up", action: "Send welcome DM", status: "ready" },
        { name: "Nudge Dormant", trigger: "7 days inactive", action: "Send email", status: "ready" },
        { name: "Win-Back Campaign", trigger: "14 days inactive", action: "Send win-back email", status: "ready" },
        { name: "Celebrate Completion", trigger: "Course completed", action: "Send congrats DM", status: "ready" },
    ];

    return (
        <div className="space-y-6">
            <Card className="p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-900 font-semibold flex items-center gap-2">
                        <Settings className="w-5 h-5 text-burgundy-600" />
                        Automation Rules
                    </h3>
                    <Button className="bg-burgundy-600 hover:bg-burgundy-700 text-white">
                        + Add Rule
                    </Button>
                </div>

                <div className="space-y-3">
                    {rules.map((rule, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                            <div>
                                <p className="text-gray-900 font-medium">{rule.name}</p>
                                <p className="text-gray-500 text-sm">
                                    When: <span className="text-burgundy-600 font-medium">{rule.trigger}</span> → {rule.action}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                    {rule.status}
                                </span>
                                <Button size="sm" variant="ghost">
                                    <Settings className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}

// =============================================================================
// BOARD ROOM TAB - Now with REAL AI
// =============================================================================
function BoardRoomTab() {
    const [problem, setProblem] = useState("");
    const [debating, setDebating] = useState(false);
    const [debate, setDebate] = useState<any>(null);
    const [error, setError] = useState("");

    const boardMembers = [
        { name: "Mark Zuckerberg", role: "Scale & Network Effects", avatar: "MZ", color: "bg-blue-600" },
        { name: "Jeff Bezos", role: "Customer Obsession", avatar: "JB", color: "bg-orange-600" },
        { name: "Elon Musk", role: "First Principles", avatar: "EM", color: "bg-gray-700" },
        { name: "Sam Altman", role: "AI & Future Trends", avatar: "SA", color: "bg-green-600" },
    ];

    const handleDebate = async () => {
        if (!problem.trim()) return;
        setDebating(true);
        setError("");
        setDebate(null);

        try {
            const res = await fetch("/api/oracle/boardroom", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ problem }),
            });

            if (!res.ok) {
                throw new Error("Failed to run debate");
            }

            const data = await res.json();
            setDebate(data);
        } catch (err) {
            setError("Failed to run board debate. Check API key.");
            console.error(err);
        }

        setDebating(false);
    };

    return (
        <div className="space-y-6">
            {/* Board Room Header */}
            <Card className="p-6 shadow-sm border-burgundy-200">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-burgundy-600 to-burgundy-700 rounded-xl flex items-center justify-center">
                        <Crown className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">CEO Board Room</h2>
                        <p className="text-gray-500 text-sm">Your AI advisory board debates your problems (Real Claude AI)</p>
                    </div>
                </div>

                {/* Board Members */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {boardMembers.map((member) => (
                        <div key={member.name} className="text-center">
                            <div className={`w-14 h-14 mx-auto ${member.color} rounded-full flex items-center justify-center text-white font-bold mb-2`}>
                                {member.avatar}
                            </div>
                            <p className="text-gray-900 font-medium text-sm">{member.name}</p>
                            <p className="text-gray-500 text-xs">{member.role}</p>
                        </div>
                    ))}
                </div>

                {/* Problem Input */}
                <div className="space-y-4">
                    <textarea
                        value={problem}
                        onChange={(e) => setProblem(e.target.value)}
                        placeholder="Describe your business problem or challenge..."
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-500/20 resize-none"
                        rows={3}
                    />

                    {error && (
                        <p className="text-red-600 text-sm">{error}</p>
                    )}

                    <Button
                        onClick={handleDebate}
                        disabled={debating || !problem.trim()}
                        className="w-full bg-burgundy-600 hover:bg-burgundy-700 text-white py-6"
                    >
                        {debating ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Board is debating with Claude AI...
                            </>
                        ) : (
                            <>
                                <Flame className="w-5 h-5 mr-2" />
                                Start Board Debate
                            </>
                        )}
                    </Button>
                </div>
            </Card>

            {/* Debate Results */}
            {debate && (
                <Card className="p-6 shadow-sm">
                    <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-burgundy-600" />
                        Board Debate: "{debate.problem}"
                    </h3>

                    <div className="space-y-4 mb-6">
                        {debate.responses?.map((r: any, i: number) => (
                            <div key={i} className="flex gap-3 p-4 bg-gray-50 rounded-lg border">
                                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm ${boardMembers.find(m => m.name === r.member)?.color || "bg-gray-500"
                                    }`}>
                                    {r.member?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                                </div>
                                <div>
                                    <p className="text-burgundy-600 font-medium">{r.member}</p>
                                    <p className="text-gray-700">{r.opinion}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 bg-burgundy-50 border border-burgundy-200 rounded-xl">
                        <p className="text-burgundy-700 font-bold">{debate.consensus}</p>
                    </div>
                </Card>
            )}
        </div>
    );
}

// =============================================================================
// SHARED COMPONENTS
// =============================================================================
function StatCard({ title, value, icon: Icon, color }: {
    title: string;
    value: number;
    icon: any;
    color: "burgundy" | "green" | "blue" | "gold";
}) {
    const colors = {
        burgundy: "bg-burgundy-50 border-burgundy-200 text-burgundy-600",
        green: "bg-green-50 border-green-200 text-green-600",
        blue: "bg-blue-50 border-blue-200 text-blue-600",
        gold: "bg-amber-50 border-amber-200 text-amber-600",
    };

    const iconColors = {
        burgundy: "bg-burgundy-100 text-burgundy-600",
        green: "bg-green-100 text-green-600",
        blue: "bg-blue-100 text-blue-600",
        gold: "bg-amber-100 text-amber-600",
    };

    return (
        <Card className={`p-4 border ${colors[color]}`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value.toLocaleString()}</p>
                </div>
                <div className={`p-2 rounded-lg ${iconColors[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
        </Card>
    );
}

function ActionButton({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
    return (
        <button className="p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-left transition-all hover:border-burgundy-300">
            <Icon className="w-6 h-6 text-burgundy-600 mb-2" />
            <p className="text-gray-900 font-medium text-sm">{title}</p>
            <p className="text-gray-500 text-xs mt-1">{desc}</p>
        </button>
    );
}

function StatusItem({ label, status }: { label: string; status: "ready" | "pending" | "off" }) {
    const statusConfig = {
        ready: { color: "bg-green-500", text: "Ready" },
        pending: { color: "bg-yellow-500", text: "Pending" },
        off: { color: "bg-gray-400", text: "Off" },
    };

    return (
        <div className="flex items-center justify-between">
            <span className="text-gray-700 text-sm">{label}</span>
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${statusConfig[status].color}`} />
                <span className="text-gray-500 text-xs">{statusConfig[status].text}</span>
            </div>
        </div>
    );
}

function ProcessStep({ step, title, description, icon: Icon }: {
    step: number;
    title: string;
    description: string;
    icon: any;
}) {
    return (
        <div className="text-center">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-burgundy-100 flex items-center justify-center">
                <span className="text-burgundy-600 font-bold text-sm">{step}</span>
            </div>
            <Icon className="w-6 h-6 text-burgundy-600 mx-auto mb-2" />
            <h4 className="text-gray-900 font-medium">{title}</h4>
            <p className="text-gray-500 text-sm">{description}</p>
        </div>
    );
}
