"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Search,
    RefreshCw,
    Users,
    CheckCircle2,
    Clock,
    TrendingUp,
    MessageCircle,
    FileText,
    Calendar,
    Phone,
    Mail,
    DollarSign,
    Target,
    ChevronRight,
    Play,
    Pause,
    Volume2,
    Send,
    Sparkles,
    User,
    ArrowUpRight,
    Zap,
    Trophy,
    AlertCircle,
    Flame,
    Star,
} from "lucide-react";
import Image from "next/image";

// ─── Types ─────────────────────────────────────────────────────────
interface ChatMessage {
    id: string;
    visitorId: string;
    page: string;
    message: string;
    isFromVisitor: boolean;
    isRead: boolean;
    createdAt: string;
    repliedBy?: string | null;
}

interface TimelineEvent {
    event: string;
    label: string;
    timestamp: string;
    icon: string;
}

interface ScholarshipLead {
    id: string;
    email: string;
    firstName: string;
    lastName: string | null;
    phone: string | null;
    createdAt: string;
    applicationDate: string;
    lastLoginAt: string | null;
    specialization: string;
    specializationLabel: string;
    incomeGoal: string;
    incomeGoalLabel: string;
    role: string;
    roleLabel: string;
    status: "pending" | "approved" | "converted" | "lost";
    offeredAmount: string | null;
    approvedAt: string | null;
    hasConverted: boolean;
    visitorId: string | null;
    page: string | null;
    qualificationScore: number;
    answeredCount: number;
    quizAnswers: Record<string, string>;
    messages: ChatMessage[];
    timeline: TimelineEvent[];
    dropOffStage: string | null;
    unreadCount: number;
}

interface Stats {
    total: number;
    today: number;
    thisWeek: number;
    pending: number;
    approved: number;
    converted: number;
    conversionRate: number;
    avgQualScore: number;
    totalUnread: number;
}

// ─── Constants ─────────────────────────────────────────────────────────
const BRAND = {
    burgundy: "#722f37",
    burgundyDark: "#5a252c",
    gold: "#d4af37",
    goldLight: "#f5d998",
};

const SARAH_AVATAR = "/coaches/sarah-coach.webp";

// ─── Audio Player Component ─────────────────────────────────────────────
function AudioPlayer({ url }: { url: string }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) audioRef.current.pause();
        else audioRef.current.play();
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl px-3 py-2 border border-amber-200">
            <audio
                ref={audioRef}
                src={url}
                onTimeUpdate={(e) => setProgress((e.currentTarget.currentTime / e.currentTarget.duration) * 100 || 0)}
                onEnded={() => setIsPlaying(false)}
            />
            <button onClick={togglePlay} className="p-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:shadow-xl transition-all">
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>
            <div className="flex-1 h-1.5 bg-amber-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <Volume2 className="w-4 h-4 text-amber-500" />
        </div>
    );
}

// ─── Stat Card Component ─────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, trend }: { icon: any; label: string; value: number | string; color: string; trend?: string }) {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-4 shadow-sm hover:shadow-lg transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -mr-8 -mt-8" style={{ background: color }} />
            <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-xl" style={{ background: `${color}15` }}>
                        <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</span>
                </div>
                <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-gray-900">{value}</span>
                    {trend && (
                        <span className="text-xs font-medium text-emerald-600 flex items-center gap-0.5 mb-1">
                            <ArrowUpRight className="w-3 h-3" />
                            {trend}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Score Ring Component ─────────────────────────────────────────────
function ScoreRing({ score, size = 48 }: { score: number; size?: number }) {
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (score / 100) * circumference;
    const color = score >= 60 ? "#10b981" : score >= 40 ? "#f59e0b" : "#ef4444";

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg className="transform -rotate-90" width={size} height={size}>
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth="4" />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - progress}
                    className="transition-all duration-500"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold" style={{ color }}>{score}</span>
            </div>
        </div>
    );
}

// ─── Lead Card Component ─────────────────────────────────────────────
function LeadCard({
    lead,
    isSelected,
    onClick,
}: {
    lead: ScholarshipLead;
    isSelected: boolean;
    onClick: () => void;
}) {
    const formatTime = (dateString: string) => {
        const diff = Date.now() - new Date(dateString).getTime();
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(mins / 60);
        const days = Math.floor(hours / 24);
        if (mins < 60) return `${mins}m`;
        if (hours < 24) return `${hours}h`;
        return `${days}d`;
    };

    return (
        <button
            onClick={onClick}
            className={`w-full p-4 text-left transition-all duration-200 border-l-4 ${isSelected
                    ? "bg-gradient-to-r from-amber-50 to-orange-50 border-l-amber-500"
                    : "bg-white hover:bg-gray-50 border-l-transparent hover:border-l-gray-200"
                }`}
        >
            <div className="flex items-start gap-3">
                {/* Avatar with Score Ring */}
                <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {lead.firstName[0]}
                    </div>
                    {lead.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                            {lead.unreadCount}
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-gray-900 truncate">
                            {lead.firstName} {lead.lastName || ""}
                        </span>
                        <Badge
                            className={`text-[10px] px-1.5 py-0 ${lead.status === "converted"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : lead.status === "approved"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-amber-100 text-amber-700"
                                }`}
                        >
                            {lead.status}
                        </Badge>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{lead.email}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs text-gray-400">{formatTime(lead.applicationDate)} ago</span>
                        <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-500" />
                            <span className="text-xs font-medium text-gray-600">{lead.qualificationScore}%</span>
                        </div>
                        {lead.messages.length > 0 && (
                            <div className="flex items-center gap-1">
                                <MessageCircle className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-400">{lead.messages.length}</span>
                            </div>
                        )}
                    </div>
                </div>

                <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" />
            </div>
        </button>
    );
}

// ─── Main Component ─────────────────────────────────────────────────────
export default function ScholarshipLeadsClient() {
    const [leads, setLeads] = useState<ScholarshipLead[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState<ScholarshipLead | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [replyText, setReplyText] = useState("");
    const [sendingReply, setSendingReply] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // ─── Fetch Data ─────────────────────────────────────────────────────
    const fetchLeads = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/scholarship-leads");
            if (res.ok) {
                const data = await res.json();
                setLeads(data.leads || []);
                setStats(data.stats || null);
                // Update selected lead if it exists
                if (selectedLead) {
                    const updated = data.leads?.find((l: ScholarshipLead) => l.id === selectedLead.id);
                    if (updated) setSelectedLead(updated);
                }
            }
        } catch (error) {
            console.error("Failed to fetch leads:", error);
        } finally {
            setLoading(false);
        }
    }, [selectedLead]);

    useEffect(() => {
        fetchLeads();
        const interval = setInterval(fetchLeads, 15000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [selectedLead?.messages]);

    // ─── Filter Leads ─────────────────────────────────────────────────────
    const filteredLeads = leads.filter((lead) => {
        const matchesSearch =
            !searchQuery ||
            lead.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.phone?.includes(searchQuery);
        const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // ─── Send Reply ─────────────────────────────────────────────────────
    const sendReply = async () => {
        if (!selectedLead?.visitorId || !replyText.trim()) return;

        setSendingReply(true);
        try {
            await fetch("/api/admin/live-chat/reply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    visitorId: selectedLead.visitorId,
                    message: replyText,
                    page: selectedLead.page || "/scholarship",
                }),
            });
            setReplyText("");
            await fetchLeads();
        } catch (error) {
            console.error("Failed to send reply:", error);
        } finally {
            setSendingReply(false);
        }
    };

    // ─── Format Date ─────────────────────────────────────────────────────
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
    };

    // ─── Loading State ─────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50">
                <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-4">
                        <div className="absolute inset-0 rounded-full border-4 border-amber-200" />
                        <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
                    </div>
                    <p className="text-gray-500 font-medium">Loading scholarship leads...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30">
            {/* ─── Header ─────────────────────────────────────────────────────── */}
            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="max-w-[1800px] mx-auto px-6 py-4">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-200">
                                    <Trophy className="w-6 h-6 text-white" />
                                </div>
                                {stats && stats.totalUnread > 0 && (
                                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                                        {stats.totalUnread}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                    Scholarship Leads
                                </h1>
                                <p className="text-sm text-gray-500">FM Certification Qualification Pipeline</p>
                            </div>
                        </div>
                        <Button
                            onClick={fetchLeads}
                            variant="outline"
                            className="gap-2 rounded-xl border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-all"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </Button>
                    </div>

                    {/* ─── Stats Grid ─────────────────────────────────────────────────────── */}
                    {stats && (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            <StatCard icon={Flame} label="Today" value={stats.today} color="#f97316" />
                            <StatCard icon={TrendingUp} label="This Week" value={stats.thisWeek} color="#3b82f6" />
                            <StatCard icon={Users} label="Total Leads" value={stats.total} color="#8b5cf6" />
                            <StatCard icon={Clock} label="Pending" value={stats.pending} color="#f59e0b" />
                            <StatCard icon={CheckCircle2} label="Converted" value={stats.converted} color="#10b981" />
                            <StatCard icon={Target} label="Conv. Rate" value={`${stats.conversionRate}%`} color="#ec4899" />
                        </div>
                    )}
                </div>
            </div>

            {/* ─── Main Content ─────────────────────────────────────────────────────── */}
            <div className="max-w-[1800px] mx-auto p-6">
                <div className="grid grid-cols-12 gap-6">
                    {/* ─── Left Panel: Lead List ─────────────────────────────────────────────────────── */}
                    <div className="col-span-12 lg:col-span-4 xl:col-span-3">
                        <Card className="overflow-hidden border-0 shadow-xl shadow-gray-200/50 rounded-2xl">
                            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            placeholder="Search leads..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 rounded-xl border-gray-200 bg-white focus:border-amber-300 focus:ring-amber-100"
                                        />
                                    </div>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="h-10 px-3 rounded-xl border border-gray-200 text-sm bg-white focus:border-amber-300"
                                    >
                                        <option value="all">All</option>
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="converted">Converted</option>
                                    </select>
                                </div>
                            </div>

                            <ScrollArea className="h-[calc(100vh-340px)]">
                                {filteredLeads.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                                            <Users className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <p className="text-gray-500 font-medium">No leads found</p>
                                        <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100">
                                        {filteredLeads.map((lead) => (
                                            <LeadCard
                                                key={lead.id}
                                                lead={lead}
                                                isSelected={selectedLead?.id === lead.id}
                                                onClick={() => setSelectedLead(lead)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </Card>
                    </div>

                    {/* ─── Right Panel: Lead Detail ─────────────────────────────────────────────────────── */}
                    <div className="col-span-12 lg:col-span-8 xl:col-span-9">
                        {!selectedLead ? (
                            <Card className="h-[calc(100vh-280px)] flex items-center justify-center border-0 shadow-xl shadow-gray-200/50 rounded-2xl bg-gradient-to-br from-white to-gray-50">
                                <div className="text-center">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mx-auto mb-4">
                                        <User className="w-10 h-10 text-amber-400" />
                                    </div>
                                    <p className="text-gray-500 font-medium">Select a lead to view details</p>
                                    <p className="text-sm text-gray-400 mt-1">Click on any lead from the list</p>
                                </div>
                            </Card>
                        ) : (
                            <Card className="border-0 shadow-xl shadow-gray-200/50 rounded-2xl overflow-hidden">
                                {/* Lead Header */}
                                <div className="p-6 bg-gradient-to-r from-white via-amber-50/30 to-orange-50/30 border-b border-gray-100">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-orange-200">
                                                    {selectedLead.firstName[0]}
                                                </div>
                                                <div className="absolute -bottom-1 -right-1">
                                                    <ScoreRing score={selectedLead.qualificationScore} size={32} />
                                                </div>
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-900">
                                                    {selectedLead.firstName} {selectedLead.lastName || ""}
                                                </h2>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1.5">
                                                        <Mail className="w-4 h-4" />
                                                        {selectedLead.email}
                                                    </span>
                                                    {selectedLead.phone && (
                                                        <span className="flex items-center gap-1.5">
                                                            <Phone className="w-4 h-4" />
                                                            {selectedLead.phone}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Badge
                                                className={`px-3 py-1.5 text-sm font-medium ${selectedLead.status === "converted"
                                                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                                        : selectedLead.status === "approved"
                                                            ? "bg-blue-100 text-blue-700 border border-blue-200"
                                                            : "bg-amber-100 text-amber-700 border border-amber-200"
                                                    }`}
                                            >
                                                {selectedLead.status === "converted" && <CheckCircle2 className="w-4 h-4 mr-1.5" />}
                                                {selectedLead.status.charAt(0).toUpperCase() + selectedLead.status.slice(1)}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Tabs */}
                                <Tabs defaultValue="profile" className="flex-1">
                                    <div className="px-6 pt-2 border-b border-gray-100">
                                        <TabsList className="bg-transparent p-0 h-auto gap-6">
                                            <TabsTrigger value="profile" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 data-[state=active]:text-amber-600 rounded-none px-0 pb-3 font-medium">
                                                <FileText className="w-4 h-4 mr-2" />
                                                Profile
                                            </TabsTrigger>
                                            <TabsTrigger value="chat" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 data-[state=active]:text-amber-600 rounded-none px-0 pb-3 font-medium">
                                                <MessageCircle className="w-4 h-4 mr-2" />
                                                Chat
                                                {selectedLead.messages.length > 0 && (
                                                    <span className="ml-2 px-1.5 py-0.5 rounded-full bg-gray-100 text-xs">{selectedLead.messages.length}</span>
                                                )}
                                            </TabsTrigger>
                                            <TabsTrigger value="timeline" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-amber-500 data-[state=active]:text-amber-600 rounded-none px-0 pb-3 font-medium">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                Timeline
                                            </TabsTrigger>
                                        </TabsList>
                                    </div>

                                    {/* Profile Tab */}
                                    <TabsContent value="profile" className="p-6 m-0">
                                        <ScrollArea className="h-[calc(100vh-500px)]">
                                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                                {/* Quick Info Cards */}
                                                <div className="space-y-4">
                                                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Quick Info</h3>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100">
                                                            <p className="text-xs text-purple-600 font-medium mb-1">Specialization</p>
                                                            <p className="font-semibold text-gray-900">{selectedLead.specializationLabel}</p>
                                                        </div>
                                                        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
                                                            <p className="text-xs text-emerald-600 font-medium mb-1">Income Goal</p>
                                                            <p className="font-semibold text-gray-900">{selectedLead.incomeGoalLabel}</p>
                                                        </div>
                                                        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
                                                            <p className="text-xs text-blue-600 font-medium mb-1">Background</p>
                                                            <p className="font-semibold text-gray-900">{selectedLead.roleLabel}</p>
                                                        </div>
                                                        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
                                                            <p className="text-xs text-amber-600 font-medium mb-1">Offered Amount</p>
                                                            <p className="font-semibold text-gray-900">{selectedLead.offeredAmount || "Not selected"}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Quiz Answers */}
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                                            <Sparkles className="w-4 h-4 text-amber-500" />
                                                            Quiz Answers ({selectedLead.answeredCount})
                                                        </h3>
                                                    </div>
                                                    {Object.keys(selectedLead.quizAnswers).length > 0 ? (
                                                        <div className="space-y-2">
                                                            {Object.entries(selectedLead.quizAnswers).map(([key, value]) => (
                                                                <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-100 hover:border-amber-200 hover:bg-amber-50/50 transition-all">
                                                                    <span className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                                                                    <span className="text-sm font-medium text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg">{value}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="p-8 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 text-center">
                                                            <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                                            <p className="text-gray-500">Quiz data not available</p>
                                                            <p className="text-xs text-gray-400 mt-1">Lead may have applied via direct link</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Drop-off Indicator */}
                                            {selectedLead.dropOffStage && selectedLead.dropOffStage !== "converted" && (
                                                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-200">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-lg bg-red-100">
                                                            <AlertCircle className="w-5 h-5 text-red-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-red-800">Drop-off Stage</p>
                                                            <p className="text-sm text-red-600">{selectedLead.dropOffStage}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </ScrollArea>
                                    </TabsContent>

                                    {/* Chat Tab */}
                                    <TabsContent value="chat" className="p-0 m-0 flex flex-col h-[calc(100vh-500px)]">
                                        <ScrollArea className="flex-1 p-6">
                                            {selectedLead.messages.length > 0 ? (
                                                <div className="space-y-4">
                                                    {selectedLead.messages.map((msg) => (
                                                        <div key={msg.id} className={`flex ${msg.isFromVisitor ? "justify-start" : "justify-end"}`}>
                                                            <div className={`flex items-end gap-2 max-w-[75%] ${msg.isFromVisitor ? "" : "flex-row-reverse"}`}>
                                                                {!msg.isFromVisitor && (
                                                                    <Image src={SARAH_AVATAR} alt="Sarah" width={32} height={32} className="rounded-full flex-shrink-0 shadow-md" />
                                                                )}
                                                                <div
                                                                    className={`rounded-2xl px-4 py-3 ${msg.isFromVisitor
                                                                            ? "bg-gray-100 text-gray-800 rounded-bl-md"
                                                                            : "bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-br-md shadow-lg shadow-orange-200"
                                                                        }`}
                                                                >
                                                                    {msg.message.startsWith("data:audio") || msg.message.includes(".mp3") || msg.message.includes(".webm") ? (
                                                                        <AudioPlayer url={msg.message} />
                                                                    ) : (
                                                                        <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                                                    )}
                                                                    <p className={`text-[10px] mt-1.5 ${msg.isFromVisitor ? "text-gray-400" : "text-white/70"}`}>
                                                                        {formatDate(msg.createdAt)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div ref={messagesEndRef} />
                                                </div>
                                            ) : (
                                                <div className="h-full flex items-center justify-center">
                                                    <div className="text-center">
                                                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                                                            <MessageCircle className="w-8 h-8 text-gray-300" />
                                                        </div>
                                                        <p className="text-gray-500 font-medium">No chat messages yet</p>
                                                        <p className="text-sm text-gray-400 mt-1">Start a conversation below</p>
                                                    </div>
                                                </div>
                                            )}
                                        </ScrollArea>

                                        {/* Reply Input */}
                                        <div className="p-4 border-t border-gray-100 bg-white">
                                            <div className="flex items-center gap-3">
                                                <Input
                                                    placeholder="Type your message..."
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendReply()}
                                                    disabled={!selectedLead.visitorId}
                                                    className="flex-1 rounded-xl border-gray-200 focus:border-amber-300 focus:ring-amber-100"
                                                />
                                                <Button
                                                    onClick={sendReply}
                                                    disabled={!replyText.trim() || sendingReply || !selectedLead.visitorId}
                                                    className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-orange-200 transition-all"
                                                >
                                                    <Send className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            {!selectedLead.visitorId && (
                                                <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" />
                                                    No visitor session - use email to contact
                                                </p>
                                            )}
                                        </div>
                                    </TabsContent>

                                    {/* Timeline Tab */}
                                    <TabsContent value="timeline" className="p-6 m-0">
                                        <ScrollArea className="h-[calc(100vh-500px)]">
                                            <div className="relative">
                                                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-300 via-orange-300 to-red-300" />
                                                <div className="space-y-6">
                                                    {selectedLead.timeline.map((event, idx) => (
                                                        <div key={idx} className="flex items-start gap-4 relative">
                                                            <div className="w-10 h-10 rounded-full bg-white border-4 border-amber-300 flex items-center justify-center z-10 shadow-md">
                                                                <span className="text-lg">{event.icon}</span>
                                                            </div>
                                                            <div className="flex-1 pt-1">
                                                                <p className="font-semibold text-gray-900">{event.label}</p>
                                                                <p className="text-sm text-gray-500">{formatDate(event.timestamp)}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {selectedLead.timeline.length === 0 && (
                                                <div className="flex items-center justify-center h-full">
                                                    <div className="text-center">
                                                        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                        <p className="text-gray-500">No timeline events</p>
                                                    </div>
                                                </div>
                                            )}
                                        </ScrollArea>
                                    </TabsContent>
                                </Tabs>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
