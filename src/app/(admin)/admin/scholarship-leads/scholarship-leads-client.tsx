"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import Image from "next/image";
import {
    Search,
    RefreshCw,
    Users,
    CheckCircle2,
    Clock,
    MessageCircle,
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
    AlertCircle,
    BarChart3,
    XCircle,
    Download,
    ArrowUpDown,
    Loader2,
} from "lucide-react";

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
    lost: number;
    conversionRate: number;
    avgQualScore: number;
    totalUnread: number;
    revenue: number;
}

// ─── Constants ─────────────────────────────────────────────────────────
const B = {
    burgundy: "#722f37",
    burgundyDark: "#5a252c",
    gold: "#d4af37",
    goldLight: "#f5d998",
};

const SARAH_AVATAR = "/coaches/sarah-coach.webp";

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string; left: string }> = {
    pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", left: "border-l-amber-400" },
    approved: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", left: "border-l-blue-400" },
    converted: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", left: "border-l-emerald-400" },
    lost: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", left: "border-l-red-400" },
};

const DATE_OPTIONS = [
    { label: "7d", value: "7" },
    { label: "30d", value: "30" },
    { label: "90d", value: "90" },
    { label: "All", value: "all" },
];

const SORT_OPTIONS = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
    { label: "Score", value: "score" },
    { label: "Unread", value: "unread" },
];

// ─── Helpers ─────────────────────────────────────────────────────────
function timeAgo(dateString: string) {
    const diff = Date.now() - new Date(dateString).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (mins < 1) return "now";
    if (mins < 60) return `${mins}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 30) return `${days}d`;
    return `${Math.floor(days / 30)}mo`;
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

// ─── Audio Player ─────────────────────────────────────────────────────
function AudioPlayer({ url }: { url: string }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    return (
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border">
            <audio
                ref={audioRef}
                src={url}
                onTimeUpdate={(e) => setProgress((e.currentTarget.currentTime / e.currentTarget.duration) * 100 || 0)}
                onEnded={() => setIsPlaying(false)}
            />
            <button
                onClick={() => { if (!audioRef.current) return; isPlaying ? audioRef.current.pause() : audioRef.current.play(); setIsPlaying(!isPlaying); }}
                className="p-1.5 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            >
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>
            <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gray-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <Volume2 className="w-3 h-3 text-gray-400" />
        </div>
    );
}

// ─── Main Component ─────────────────────────────────────────────────────
export default function ScholarshipLeadsClient() {
    const [leads, setLeads] = useState<ScholarshipLead[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState<ScholarshipLead | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [daysFilter, setDaysFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [replyText, setReplyText] = useState("");
    const [sendingReply, setSendingReply] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // ─── Fetch ─────────────────────────────────────────────────────
    const fetchLeads = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (daysFilter !== "all") params.set("days", daysFilter);
            const res = await fetch(`/api/admin/scholarship-leads?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setLeads(data.leads || []);
                setStats(data.stats || null);
                if (selectedLead) {
                    const updated = data.leads?.find((l: ScholarshipLead) => l.id === selectedLead.id);
                    if (updated) setSelectedLead(updated);
                }
            }
        } catch { /* silently fail */ } finally {
            setLoading(false);
        }
    }, [daysFilter, selectedLead]);

    useEffect(() => { fetchLeads(); const i = setInterval(fetchLeads, 15000); return () => clearInterval(i); }, []);
    useEffect(() => { fetchLeads(); }, [daysFilter]);
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [selectedLead?.messages]);

    // ─── Filter + Sort ─────────────────────────────────────────────
    const filtered = leads
        .filter((l) => {
            const q = searchQuery.toLowerCase();
            const matchSearch = !q || l.firstName.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.phone?.includes(searchQuery);
            const matchStatus = statusFilter === "all" || l.status === statusFilter;
            return matchSearch && matchStatus;
        })
        .sort((a, b) => {
            if (sortBy === "oldest") return new Date(a.applicationDate).getTime() - new Date(b.applicationDate).getTime();
            if (sortBy === "score") return b.qualificationScore - a.qualificationScore;
            if (sortBy === "unread") return b.unreadCount - a.unreadCount;
            return new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime();
        });

    // ─── Actions ─────────────────────────────────────────────
    const sendReply = async () => {
        if (!selectedLead?.visitorId || !replyText.trim()) return;
        setSendingReply(true);
        try {
            await fetch("/api/admin/live-chat/reply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ visitorId: selectedLead.visitorId, message: replyText, page: selectedLead.page || "/scholarship" }),
            });
            setReplyText("");
            await fetchLeads();
        } catch { /* fail */ } finally { setSendingReply(false); }
    };

    const updateStatus = async (status: string) => {
        if (!selectedLead) return;
        setUpdatingStatus(true);
        try {
            await fetch("/api/admin/scholarship-leads/status", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: selectedLead.id, status }),
            });
            await fetchLeads();
        } catch { /* fail */ } finally { setUpdatingStatus(false); }
    };

    const exportCSV = () => {
        const rows = [["Name", "Email", "Phone", "Status", "Specialization", "Income Goal", "Background", "Offered Amount", "Score", "Applied", "Messages"].join(",")];
        filtered.forEach(l => {
            rows.push([
                `"${l.firstName} ${l.lastName || ""}"`, l.email, l.phone || "", l.status,
                l.specializationLabel, l.incomeGoalLabel, l.roleLabel, l.offeredAmount || "",
                `${l.qualificationScore}%`, new Date(l.applicationDate).toLocaleDateString(), `${l.messages.length}`,
            ].join(","));
        });
        const blob = new Blob([rows.join("\n")], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `scholarship-leads-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
        URL.revokeObjectURL(url);
    };

    const exportConversations = () => {
        const esc = (s: string) => `"${(s || "").replace(/"/g, '""').replace(/\n/g, " | ")}"`;
        const rows = [["Lead Name", "Email", "Status", "Score", "Sender", "Message", "Timestamp", "Drop-off Stage"].join(",")];
        filtered.forEach(l => {
            const name = `${l.firstName} ${l.lastName || ""}`.trim();
            if (l.messages.length === 0) {
                // Still include leads with no messages to spot silent drop-offs
                rows.push([esc(name), l.email, l.status, `${l.qualificationScore}%`, "", esc("(no messages)"), "", l.dropOffStage || ""].join(","));
            } else {
                l.messages.forEach(msg => {
                    rows.push([
                        esc(name), l.email, l.status, `${l.qualificationScore}%`,
                        msg.isFromVisitor ? "Lead" : "Sarah AI",
                        esc(msg.message),
                        new Date(msg.createdAt).toLocaleString(),
                        l.dropOffStage || "",
                    ].join(","));
                });
            }
        });
        const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `scholarship-conversations-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
        URL.revokeObjectURL(url);
    };

    // ─── Loading ─────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    const lead = selectedLead;
    const sc = lead ? STATUS_COLORS[lead.status] || STATUS_COLORS.pending : null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ─── Header ─────────────────────────────────────────── */}
            <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3">
                    <div className="flex items-center justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                            <h1 className="text-lg font-bold text-gray-900">Scholarship Leads</h1>
                            {stats && (
                                <Badge variant="outline" className="text-xs">
                                    {stats.total} total
                                    {stats.totalUnread > 0 && <span className="ml-1 text-red-500">({stats.totalUnread} unread)</span>}
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Link href="/admin/scholarship-leads/analytics">
                                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                                    <BarChart3 className="w-3.5 h-3.5" /> Analytics
                                </Button>
                            </Link>
                            <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1.5 text-xs">
                                <Download className="w-3.5 h-3.5" /> Export Leads
                            </Button>
                            <Button variant="outline" size="sm" onClick={exportConversations} className="gap-1.5 text-xs">
                                <MessageCircle className="w-3.5 h-3.5" /> Export Chats
                            </Button>
                            <Button variant="outline" size="sm" onClick={fetchLeads} className="gap-1.5 text-xs">
                                <RefreshCw className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    </div>

                    {/* Stats */}
                    {stats && (
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-3">
                            <div className="bg-gray-50 rounded-lg px-3 py-2 border">
                                <p className="text-xs text-gray-500">Total</p>
                                <p className="text-xl font-bold text-gray-900">{stats.total}
                                    {stats.today > 0 && <span className="text-xs font-normal text-emerald-600 ml-1.5">+{stats.today} today</span>}
                                </p>
                            </div>
                            <div className="bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">
                                <p className="text-xs text-amber-600">Pending</p>
                                <p className="text-xl font-bold text-amber-700">{stats.pending}</p>
                            </div>
                            <div className="bg-emerald-50 rounded-lg px-3 py-2 border border-emerald-100">
                                <p className="text-xs text-emerald-600">Converted</p>
                                <p className="text-xl font-bold text-emerald-700">{stats.converted}
                                    <span className="text-xs font-normal ml-1">({stats.conversionRate}%)</span>
                                </p>
                            </div>
                            <div className="bg-blue-50 rounded-lg px-3 py-2 border border-blue-100">
                                <p className="text-xs text-blue-600">Approved</p>
                                <p className="text-xl font-bold text-blue-700">{stats.approved}</p>
                            </div>
                            <div className="bg-purple-50 rounded-lg px-3 py-2 border border-purple-100">
                                <p className="text-xs text-purple-600">Revenue</p>
                                <p className="text-xl font-bold text-purple-700">${stats.revenue.toLocaleString()}</p>
                            </div>
                        </div>
                    )}

                    {/* Filters */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="relative flex-1 max-w-xs">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                            <Input
                                placeholder="Search name, email, phone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8 h-8 text-sm rounded-lg"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="h-8 px-2.5 rounded-lg border text-xs bg-white"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="converted">Converted</option>
                            <option value="lost">Lost</option>
                        </select>
                        <div className="flex items-center gap-0.5 bg-white rounded-lg border p-0.5">
                            {DATE_OPTIONS.map(o => (
                                <button key={o.value} onClick={() => setDaysFilter(o.value)}
                                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${daysFilter === o.value ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-700"}`}
                                >{o.label}</button>
                            ))}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                            <ArrowUpDown className="w-3 h-3" />
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent text-xs border-0 p-0 focus:ring-0">
                                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </div>
                        <span className="text-xs text-gray-400 ml-auto">{filtered.length} shown</span>
                    </div>
                </div>
            </div>

            {/* ─── Main Content ─────────────────────────────────────────── */}
            <div className="max-w-[1600px] mx-auto p-4 sm:p-6">
                <div className="flex gap-4">
                    {/* ─── Left: Lead List ─────────────────────────────────── */}
                    <div className="w-[340px] shrink-0">
                        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                            <ScrollArea className="h-[calc(100vh-280px)]">
                                {filtered.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <Users className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                                        <p className="text-sm text-gray-400">No leads found</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100">
                                        {filtered.map((l) => {
                                            const colors = STATUS_COLORS[l.status] || STATUS_COLORS.pending;
                                            return (
                                                <button
                                                    key={l.id}
                                                    onClick={() => setSelectedLead(l)}
                                                    className={`w-full p-3 text-left transition-all border-l-3 ${
                                                        selectedLead?.id === l.id
                                                            ? `bg-gray-50 ${colors.left}`
                                                            : `hover:bg-gray-50/50 border-l-transparent`
                                                    }`}
                                                    style={{ borderLeftWidth: "3px" }}
                                                >
                                                    <div className="flex items-start gap-2.5">
                                                        <div className="relative shrink-0">
                                                            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600">
                                                                {l.firstName[0]}
                                                            </div>
                                                            {l.unreadCount > 0 && (
                                                                <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                                                                    {l.unreadCount}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-1.5 mb-0.5">
                                                                <span className="font-medium text-sm text-gray-900 truncate">{l.firstName} {l.lastName || ""}</span>
                                                                <Badge className={`text-[9px] px-1 py-0 ${colors.bg} ${colors.text} border-0`}>{l.status}</Badge>
                                                            </div>
                                                            <p className="text-xs text-gray-400 truncate">{l.email}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-[10px] text-gray-400">{timeAgo(l.applicationDate)}</span>
                                                                {l.offeredAmount && <span className="text-[10px] font-medium text-emerald-600">{l.offeredAmount}</span>}
                                                                {l.incomeGoalLabel && <span className="text-[10px] text-gray-400">{l.incomeGoalLabel}</span>}
                                                                {l.messages.length > 0 && (
                                                                    <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                                                                        <MessageCircle className="w-2.5 h-2.5" />{l.messages.length}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <ChevronRight className="w-3.5 h-3.5 text-gray-300 mt-1 shrink-0" />
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </ScrollArea>
                        </div>
                    </div>

                    {/* ─── Right: Lead Detail ─────────────────────────────── */}
                    <div className="flex-1 min-w-0">
                        {!lead ? (
                            <div className="bg-white rounded-xl border shadow-sm h-[calc(100vh-280px)] flex items-center justify-center">
                                <div className="text-center">
                                    <User className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                    <p className="text-sm text-gray-400">Select a lead</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                                <ScrollArea className="h-[calc(100vh-280px)]">
                                    {/* Lead Header */}
                                    <div className="p-5 border-b border-gray-100">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-600">
                                                    {lead.firstName[0]}
                                                </div>
                                                <div>
                                                    <h2 className="text-base font-bold text-gray-900">{lead.firstName} {lead.lastName || ""}</h2>
                                                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                                                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{lead.email}</span>
                                                        {lead.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{lead.phone}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {lead.status !== "approved" && lead.status !== "converted" && (
                                                    <Button size="sm" variant="outline" disabled={updatingStatus} onClick={() => updateStatus("approved")}
                                                        className="text-xs gap-1 text-blue-600 border-blue-200 hover:bg-blue-50">
                                                        <CheckCircle2 className="w-3 h-3" /> Approve
                                                    </Button>
                                                )}
                                                {lead.status !== "converted" && (
                                                    <Button size="sm" variant="outline" disabled={updatingStatus} onClick={() => updateStatus("converted")}
                                                        className="text-xs gap-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                                                        <DollarSign className="w-3 h-3" /> Converted
                                                    </Button>
                                                )}
                                                {lead.status !== "lost" && (
                                                    <Button size="sm" variant="outline" disabled={updatingStatus} onClick={() => updateStatus("lost")}
                                                        className="text-xs gap-1 text-red-500 border-red-200 hover:bg-red-50">
                                                        <XCircle className="w-3 h-3" /> Lost
                                                    </Button>
                                                )}
                                                <Badge className={`${sc!.bg} ${sc!.text} border ${sc!.border} text-xs`}>
                                                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Info */}
                                    <div className="p-5 border-b border-gray-100">
                                        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                                            <div className="p-3 rounded-lg bg-purple-50 border border-purple-100">
                                                <p className="text-[10px] text-purple-500 font-medium uppercase">Specialization</p>
                                                <p className="text-sm font-semibold text-gray-900 mt-0.5">{lead.specializationLabel}</p>
                                            </div>
                                            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                                                <p className="text-[10px] text-emerald-500 font-medium uppercase">Income Goal</p>
                                                <p className="text-sm font-semibold text-gray-900 mt-0.5">{lead.incomeGoalLabel}</p>
                                            </div>
                                            <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                                                <p className="text-[10px] text-blue-500 font-medium uppercase">Background</p>
                                                <p className="text-sm font-semibold text-gray-900 mt-0.5">{lead.roleLabel}</p>
                                            </div>
                                            <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                                                <p className="text-[10px] text-amber-500 font-medium uppercase">Offered</p>
                                                <p className="text-sm font-semibold text-gray-900 mt-0.5">{lead.offeredAmount || "—"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Drop-off */}
                                    {lead.dropOffStage && !lead.hasConverted && (
                                        <div className="mx-5 mt-4 p-3 rounded-lg bg-red-50 border border-red-100 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                                            <p className="text-xs text-red-600"><span className="font-medium">Drop-off:</span> {lead.dropOffStage}</p>
                                        </div>
                                    )}

                                    {/* Quiz Answers */}
                                    <div className="p-5 border-b border-gray-100">
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                            <Sparkles className="w-3.5 h-3.5" /> Quiz Answers ({lead.answeredCount})
                                        </h3>
                                        {Object.keys(lead.quizAnswers).length > 0 ? (
                                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-1.5">
                                                {Object.entries(lead.quizAnswers).map(([key, value]) => (
                                                    <div key={key} className="flex items-center justify-between py-1.5 px-2.5 rounded-md hover:bg-gray-50">
                                                        <span className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                                                        <span className="text-xs font-medium text-gray-800 bg-gray-100 px-2 py-0.5 rounded">{value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-400">No quiz data available</p>
                                        )}
                                    </div>

                                    {/* Chat Messages */}
                                    <div className="p-5 border-b border-gray-100">
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                            <MessageCircle className="w-3.5 h-3.5" /> Chat ({lead.messages.length})
                                        </h3>
                                        {lead.messages.length > 0 ? (
                                            <div className="space-y-2.5 max-h-[400px] overflow-y-auto mb-3">
                                                {lead.messages.map((msg) => (
                                                    <div key={msg.id} className={`flex ${msg.isFromVisitor ? "justify-start" : "justify-end"}`}>
                                                        <div className={`flex items-end gap-1.5 max-w-[80%] ${msg.isFromVisitor ? "" : "flex-row-reverse"}`}>
                                                            {!msg.isFromVisitor && (
                                                                <Image src={SARAH_AVATAR} alt="S" width={24} height={24} className="rounded-full shrink-0" />
                                                            )}
                                                            <div className={`rounded-xl px-3 py-2 ${msg.isFromVisitor ? "bg-gray-100 text-gray-800" : "bg-gray-800 text-white"}`}>
                                                                {msg.message.startsWith("data:audio") || msg.message.includes(".mp3") || msg.message.includes(".webm") ? (
                                                                    <AudioPlayer url={msg.message} />
                                                                ) : (
                                                                    <p className="text-xs whitespace-pre-wrap">{msg.message}</p>
                                                                )}
                                                                <p className={`text-[9px] mt-1 ${msg.isFromVisitor ? "text-gray-400" : "text-gray-400"}`}>{timeAgo(msg.createdAt)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div ref={messagesEndRef} />
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-400 mb-3">No messages yet</p>
                                        )}

                                        {/* Reply */}
                                        <div className="flex items-center gap-2">
                                            <Input
                                                placeholder={lead.visitorId ? "Type a reply..." : "No visitor session"}
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendReply()}
                                                disabled={!lead.visitorId}
                                                className="flex-1 h-8 text-xs rounded-lg"
                                            />
                                            <Button size="sm" onClick={sendReply} disabled={!replyText.trim() || sendingReply || !lead.visitorId}
                                                className="h-8 px-3 rounded-lg bg-gray-900 hover:bg-gray-800">
                                                <Send className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Timeline */}
                                    <div className="p-5">
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Timeline</h3>
                                        {lead.timeline.length > 0 ? (
                                            <div className="relative pl-6">
                                                <div className="absolute left-2 top-1 bottom-1 w-px bg-gray-200" />
                                                <div className="space-y-3">
                                                    {lead.timeline.map((e, i) => (
                                                        <div key={i} className="flex items-start gap-3 relative">
                                                            <div className="absolute left-[-18px] w-5 h-5 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-xs z-10">
                                                                {e.icon}
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-medium text-gray-800">{e.label}</p>
                                                                <p className="text-[10px] text-gray-400">{formatDate(e.timestamp)}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-400">No events</p>
                                        )}
                                    </div>
                                </ScrollArea>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
