"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Search,
    RefreshCw,
    Users,
    CheckCircle,
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
    Mic,
    Square,
    Download,
    Filter,
    AlertCircle,
    Sparkles,
    User,
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

interface QuizAnswers {
    // Q1-Q17 answers
    q1_background?: string;
    q2_income?: string;
    q3_goal?: string;
    q4_experience?: string;
    q5_clinical?: string;
    q6_labs?: string;
    q7_certs?: string;
    q8_missing?: string;
    q9_commitment?: string;
    q10_vision?: string;
    q11_niche?: string;
    q12_careerPath?: string;
    q13_clientAcquisition?: string;
    q14_financialSituation?: string;
    q15_investmentPriority?: string;
    q16_startTimeline?: string;
    q17_revealChoice?: string;
    motivation?: string;
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
    currentIncome: string;
    currentIncomeLabel: string;
    status: "pending" | "approved" | "converted" | "lost";
    offeredAmount: string | null;
    approvedAt: string | null;
    hasConverted: boolean;
    visitorId: string | null;
    page: string | null;
    qualificationScore: number;
    financialSituation?: string;
    investmentPriority?: string;
    startTimeline?: string;
    quizAnswers?: QuizAnswers;
    messages?: ChatMessage[];
    timeline?: TimelineEvent[];
    dropOffStage?: string;
}

interface Stats {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    pending: number;
    approved: number;
    converted: number;
    conversionRate: number;
}

// ─── Constants ─────────────────────────────────────────────────────────
const BRAND = {
    burgundy: "#722f37",
    burgundyDark: "#5a252c",
    gold: "#d4af37",
    goldMetallic: "linear-gradient(135deg, #d4af37 0%, #f5d998 50%, #d4af37 100%)",
};

const SARAH_AVATAR = "/coaches/sarah-coach.webp";

// Question labels for the quiz answers panel
const QUESTION_LABELS: Record<string, string> = {
    q1_background: "1. Background",
    q2_income: "2. Current Income",
    q3_goal: "3. Income Goal",
    q4_experience: "4. Client Experience",
    q5_clinical: "5. Clinical Readiness",
    q6_labs: "6. Lab Interest",
    q7_certs: "7. Past Certifications",
    q8_missing: "8. Missing Skill",
    q9_commitment: "9. Time Commitment",
    q10_vision: "10. Vision",
    q11_niche: "11. Specialty Niche",
    q12_careerPath: "12. Career Path Level",
    q13_clientAcquisition: "13. Client Acquisition",
    q14_financialSituation: "14. Financial Situation",
    q15_investmentPriority: "15. Investment Priority",
    q16_startTimeline: "16. Start Timeline",
    q17_revealChoice: "17. Final Choice",
    motivation: "Motivation (Text)",
};

// ─── Audio Player Component ─────────────────────────────────────────────
function AudioPlayer({ url }: { url: string }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
            <audio
                ref={audioRef}
                src={url}
                onTimeUpdate={(e) => {
                    const audio = e.currentTarget;
                    setProgress((audio.currentTime / audio.duration) * 100 || 0);
                }}
                onEnded={() => setIsPlaying(false)}
            />
            <button onClick={togglePlay} className="p-1.5 rounded-full bg-white shadow-sm">
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <div className="flex-1 h-1 bg-gray-300 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <Volume2 className="w-4 h-4 text-gray-400" />
        </div>
    );
}

// ─── Strength Badge ─────────────────────────────────────────────────────
function StrengthBadge({ value }: { value?: string }) {
    if (!value) return <span className="text-gray-400">—</span>;

    const isStrong = ["funds-ready", "savings-credit", "comfortable", "stable", "this-week", "2-weeks", "healthcare-pro"].some(s => value.includes(s));
    const isGood = ["payment-plan", "1-month", "planning", "health-coach", "corporate"].some(s => value.includes(s));

    if (isStrong) return <Badge className="bg-green-100 text-green-700 ml-2">⭐ Strong</Badge>;
    if (isGood) return <Badge className="bg-amber-100 text-amber-700 ml-2">Good</Badge>;
    return <Badge className="bg-gray-100 text-gray-600 ml-2">Developing</Badge>;
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
            }
        } catch (error) {
            console.error("Failed to fetch leads:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLeads();
        // Poll every 30 seconds
        const interval = setInterval(fetchLeads, 30000);
        return () => clearInterval(interval);
    }, [fetchLeads]);

    // Scroll to bottom of messages when selected lead changes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [selectedLead?.messages]);

    // ─── Filter Leads ─────────────────────────────────────────────────────
    const filteredLeads = leads.filter((lead) => {
        const matchesSearch = !searchQuery ||
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
            await fetch("/api/chat/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    visitorId: selectedLead.visitorId,
                    message: replyText,
                    page: selectedLead.page || "/scholarship",
                }),
            });
            setReplyText("");
            // Refresh to get new messages
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
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    // ─── Get Status Color ─────────────────────────────────────────────────
    const getStatusColor = (status: string) => {
        switch (status) {
            case "converted": return "bg-green-100 text-green-700 border-green-200";
            case "approved": return "bg-blue-100 text-blue-700 border-blue-200";
            case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
            case "lost": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    // ─── Loading State ─────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4" />
                    <p className="text-gray-500">Loading scholarship leads...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-[1600px] mx-auto px-6 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg" style={{ background: BRAND.goldMetallic }}>
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold" style={{ color: BRAND.burgundyDark }}>Scholarship Leads</h1>
                                <p className="text-sm text-gray-500">FM Certification Applications</p>
                            </div>
                        </div>
                        <Button onClick={fetchLeads} variant="outline" size="sm" className="gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </Button>
                    </div>

                    {/* Stats Cards */}
                    {stats && (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            <Card className="border-l-4 border-l-amber-500">
                                <CardContent className="p-3">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-amber-500" />
                                        <span className="text-xs text-gray-500">Today</span>
                                    </div>
                                    <p className="text-2xl font-bold mt-1">{stats.today}</p>
                                </CardContent>
                            </Card>
                            <Card className="border-l-4 border-l-blue-500">
                                <CardContent className="p-3">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-blue-500" />
                                        <span className="text-xs text-gray-500">This Week</span>
                                    </div>
                                    <p className="text-2xl font-bold mt-1">{stats.thisWeek}</p>
                                </CardContent>
                            </Card>
                            <Card className="border-l-4 border-l-purple-500">
                                <CardContent className="p-3">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-purple-500" />
                                        <span className="text-xs text-gray-500">Total</span>
                                    </div>
                                    <p className="text-2xl font-bold mt-1">{stats.total}</p>
                                </CardContent>
                            </Card>
                            <Card className="border-l-4 border-l-orange-500">
                                <CardContent className="p-3">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-orange-500" />
                                        <span className="text-xs text-gray-500">Pending</span>
                                    </div>
                                    <p className="text-2xl font-bold mt-1">{stats.pending}</p>
                                </CardContent>
                            </Card>
                            <Card className="border-l-4 border-l-green-500">
                                <CardContent className="p-3">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span className="text-xs text-gray-500">Converted</span>
                                    </div>
                                    <p className="text-2xl font-bold mt-1">{stats.converted}</p>
                                </CardContent>
                            </Card>
                            <Card className="border-l-4" style={{ borderLeftColor: BRAND.gold }}>
                                <CardContent className="p-3">
                                    <div className="flex items-center gap-2">
                                        <Target className="w-4 h-4" style={{ color: BRAND.gold }} />
                                        <span className="text-xs text-gray-500">Conv. Rate</span>
                                    </div>
                                    <p className="text-2xl font-bold mt-1">{stats.conversionRate}%</p>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1600px] mx-auto p-6">
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Panel: Lead List */}
                    <div className="col-span-12 lg:col-span-4">
                        <Card className="h-[calc(100vh-280px)]">
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            placeholder="Search leads..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="h-10 px-3 rounded-md border text-sm"
                                    >
                                        <option value="all">All</option>
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="converted">Converted</option>
                                    </select>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <ScrollArea className="h-[calc(100vh-380px)]">
                                    {filteredLeads.length === 0 ? (
                                        <div className="p-6 text-center text-gray-500">
                                            <Users className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                            <p>No leads found</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y">
                                            {filteredLeads.map((lead) => (
                                                <button
                                                    key={lead.id}
                                                    onClick={() => setSelectedLead(lead)}
                                                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${selectedLead?.id === lead.id ? "bg-amber-50 border-l-4 border-l-amber-500" : ""
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-medium truncate">
                                                                    {lead.firstName} {lead.lastName || ""}
                                                                </p>
                                                                <Badge className={getStatusColor(lead.status)}>
                                                                    {lead.status}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-sm text-gray-500 truncate">{lead.email}</p>
                                                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                                                                <span>{formatDate(lead.applicationDate)}</span>
                                                                {lead.qualificationScore > 0 && (
                                                                    <span className="text-amber-600 font-medium">
                                                                        Score: {lead.qualificationScore}%
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Panel: Lead Detail */}
                    <div className="col-span-12 lg:col-span-8">
                        {!selectedLead ? (
                            <Card className="h-[calc(100vh-280px)] flex items-center justify-center">
                                <div className="text-center text-gray-400">
                                    <User className="w-16 h-16 mx-auto mb-3 opacity-30" />
                                    <p>Select a lead to view details</p>
                                </div>
                            </Card>
                        ) : (
                            <Card className="h-[calc(100vh-280px)]">
                                {/* Lead Header */}
                                <CardHeader className="border-b pb-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-lg">
                                                {selectedLead.firstName[0]}
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold">
                                                    {selectedLead.firstName} {selectedLead.lastName || ""}
                                                </h2>
                                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Mail className="w-3 h-3" />
                                                        {selectedLead.email}
                                                    </span>
                                                    {selectedLead.phone && (
                                                        <span className="flex items-center gap-1">
                                                            <Phone className="w-3 h-3" />
                                                            {selectedLead.phone}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className={getStatusColor(selectedLead.status)}>
                                                {selectedLead.status}
                                            </Badge>
                                            {selectedLead.qualificationScore > 0 && (
                                                <Badge
                                                    className={
                                                        selectedLead.qualificationScore >= 70 ? "bg-green-100 text-green-700" :
                                                            selectedLead.qualificationScore >= 50 ? "bg-blue-100 text-blue-700" :
                                                                selectedLead.qualificationScore >= 30 ? "bg-amber-100 text-amber-700" :
                                                                    "bg-red-100 text-red-700"
                                                    }
                                                >
                                                    Score: {selectedLead.qualificationScore}%
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>

                                {/* Tabs */}
                                <Tabs defaultValue="profile" className="flex-1">
                                    <TabsList className="mx-4 mt-2">
                                        <TabsTrigger value="profile" className="gap-1">
                                            <FileText className="w-4 h-4" />
                                            Profile
                                        </TabsTrigger>
                                        <TabsTrigger value="chat" className="gap-1">
                                            <MessageCircle className="w-4 h-4" />
                                            Chat
                                        </TabsTrigger>
                                        <TabsTrigger value="timeline" className="gap-1">
                                            <Calendar className="w-4 h-4" />
                                            Timeline
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* Profile Tab */}
                                    <TabsContent value="profile" className="p-4 m-0">
                                        <ScrollArea className="h-[calc(100vh-480px)]">
                                            <div className="space-y-4">
                                                {/* Quick Stats */}
                                                <div className="grid grid-cols-3 gap-3">
                                                    <div className="p-3 rounded-lg bg-gray-50">
                                                        <p className="text-xs text-gray-500 mb-1">Specialization</p>
                                                        <p className="font-medium text-sm">{selectedLead.specializationLabel}</p>
                                                    </div>
                                                    <div className="p-3 rounded-lg bg-gray-50">
                                                        <p className="text-xs text-gray-500 mb-1">Income Goal</p>
                                                        <p className="font-medium text-sm">{selectedLead.incomeGoalLabel}</p>
                                                    </div>
                                                    <div className="p-3 rounded-lg bg-gray-50">
                                                        <p className="text-xs text-gray-500 mb-1">Offered Amount</p>
                                                        <p className="font-medium text-sm">{selectedLead.offeredAmount || "—"}</p>
                                                    </div>
                                                </div>

                                                {/* Quiz Answers */}
                                                <div>
                                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                                        <Sparkles className="w-4 h-4 text-amber-500" />
                                                        Quiz Answers ({Object.keys(selectedLead.quizAnswers || {}).length} / 17)
                                                    </h3>
                                                    <div className="border rounded-lg divide-y">
                                                        {selectedLead.quizAnswers ? (
                                                            Object.entries(selectedLead.quizAnswers).map(([key, value]) => (
                                                                <div key={key} className="flex items-center justify-between p-3 hover:bg-gray-50">
                                                                    <span className="text-sm text-gray-600">
                                                                        {QUESTION_LABELS[key] || key}
                                                                    </span>
                                                                    <div className="flex items-center">
                                                                        <span className="text-sm font-medium">{value}</span>
                                                                        <StrengthBadge value={value} />
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="p-6 text-center text-gray-400">
                                                                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                                                <p>No quiz answers recorded</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </ScrollArea>
                                    </TabsContent>

                                    {/* Chat Tab */}
                                    <TabsContent value="chat" className="p-0 m-0 flex flex-col h-[calc(100vh-480px)]">
                                        {/* Messages */}
                                        <ScrollArea className="flex-1 p-4">
                                            {selectedLead.messages && selectedLead.messages.length > 0 ? (
                                                <div className="space-y-3">
                                                    {selectedLead.messages.map((msg) => (
                                                        <div
                                                            key={msg.id}
                                                            className={`flex ${msg.isFromVisitor ? "justify-start" : "justify-end"}`}
                                                        >
                                                            <div className={`flex items-end gap-2 max-w-[80%] ${msg.isFromVisitor ? "" : "flex-row-reverse"}`}>
                                                                {!msg.isFromVisitor && (
                                                                    <Image
                                                                        src={SARAH_AVATAR}
                                                                        alt="Sarah"
                                                                        width={28}
                                                                        height={28}
                                                                        className="rounded-full flex-shrink-0"
                                                                    />
                                                                )}
                                                                <div
                                                                    className={`rounded-2xl px-4 py-2 ${msg.isFromVisitor
                                                                            ? "bg-gray-100 text-gray-800"
                                                                            : "text-white"
                                                                        }`}
                                                                    style={!msg.isFromVisitor ? { backgroundColor: BRAND.burgundy } : {}}
                                                                >
                                                                    {msg.message.startsWith("data:audio") || msg.message.includes(".mp3") || msg.message.includes(".webm") ? (
                                                                        <AudioPlayer url={msg.message} />
                                                                    ) : (
                                                                        <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                                                    )}
                                                                    <p className="text-[10px] opacity-60 mt-1">
                                                                        {formatDate(msg.createdAt)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div ref={messagesEndRef} />
                                                </div>
                                            ) : (
                                                <div className="h-full flex items-center justify-center text-gray-400">
                                                    <div className="text-center">
                                                        <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                                        <p>No chat messages yet</p>
                                                    </div>
                                                </div>
                                            )}
                                        </ScrollArea>

                                        {/* Reply Input */}
                                        <div className="p-4 border-t bg-white">
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    placeholder="Type a message..."
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendReply()}
                                                    disabled={!selectedLead.visitorId}
                                                />
                                                <Button
                                                    onClick={sendReply}
                                                    disabled={!replyText.trim() || sendingReply || !selectedLead.visitorId}
                                                    className="gap-2"
                                                    style={{ backgroundColor: BRAND.burgundy }}
                                                >
                                                    <Send className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            {!selectedLead.visitorId && (
                                                <p className="text-xs text-amber-600 mt-2">
                                                    ⚠️ No visitor ID - cannot send messages
                                                </p>
                                            )}
                                        </div>
                                    </TabsContent>

                                    {/* Timeline Tab */}
                                    <TabsContent value="timeline" className="p-4 m-0">
                                        <ScrollArea className="h-[calc(100vh-480px)]">
                                            {selectedLead.timeline && selectedLead.timeline.length > 0 ? (
                                                <div className="relative">
                                                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                                                    <div className="space-y-4">
                                                        {selectedLead.timeline.map((event, idx) => (
                                                            <div key={idx} className="flex items-start gap-4 relative">
                                                                <div className="w-8 h-8 rounded-full bg-white border-2 border-amber-500 flex items-center justify-center z-10">
                                                                    <span className="text-sm">{event.icon}</span>
                                                                </div>
                                                                <div className="flex-1 pb-4">
                                                                    <p className="font-medium text-sm">{event.label}</p>
                                                                    <p className="text-xs text-gray-500">{formatDate(event.timestamp)}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="h-full flex items-center justify-center text-gray-400">
                                                    <div className="text-center">
                                                        <Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                                        <p>No timeline events</p>
                                                        <p className="text-xs mt-1">Application: {formatDate(selectedLead.applicationDate)}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Drop-off indicator */}
                                            {selectedLead.dropOffStage && (
                                                <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
                                                    <div className="flex items-center gap-2 text-red-700">
                                                        <AlertCircle className="w-4 h-4" />
                                                        <span className="font-medium text-sm">
                                                            Dropped off at: {selectedLead.dropOffStage}
                                                        </span>
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
