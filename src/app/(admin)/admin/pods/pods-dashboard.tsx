"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
    MessageCircle, Send, Clock, Search,
    RefreshCw, Loader2, Users, Award,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────
interface Pod {
    id: string;
    user: { id: string; name: string; email: string; avatar: string | null };
    zombie: { id: string; name: string; avatar: string | null } | null;
    nicheCategory: string;
    status: string;
    masterclassDay: number;
    startedAt: string | null;
    scholarshipUsed: boolean;
    convertedAt: string | null;
    createdAt: string;
    lastActivity: string;
    messageCount: number;
    unreadCount: number;
    messages: Message[];
}

interface Message {
    id: string;
    dayNumber: number;
    senderType: string;
    senderName: string | null;
    senderAvatar: string | null;
    content: string;
    audioUrl: string | null;
    isSystem: boolean;
    readAt: string | null;
    sentAt: string | null;
    createdAt: string;
}

// ─── Constants ─────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
    pre_completion: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
    post_completion: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
    active: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
    waiting: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
    completed: { bg: "bg-gray-50", text: "text-gray-600", dot: "bg-gray-400" },
    converted: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
};

const STATUS_OPTIONS = [
    { label: "All", value: "all" },
    { label: "Learning", value: "pre_completion" },
    { label: "Nurture", value: "post_completion" },
    { label: "Converted", value: "converted" },
];

// ─── Helpers ───────────────────────────────────────────────────────
function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (mins < 1) return "now";
    if (mins < 60) return `${mins}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 30) return `${days}d`;
    return `${Math.floor(days / 30)}mo`;
}

function formatMsgTime(dateStr: string) {
    const d = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diffDays === 0) return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    if (diffDays === 1) return "Yesterday " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    if (diffDays < 7) return d.toLocaleDateString("en-US", { weekday: "short" }) + " " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── Main Component ────────────────────────────────────────────────
export default function PodsDashboard() {
    const [pods, setPods] = useState<Pod[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPodId, setSelectedPodId] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState("");
    const [sending, setSending] = useState(false);
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // ─── Load Pods ─────────────────────────────────────────────
    const loadPods = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        try {
            const url = statusFilter === "all"
                ? "/api/admin/pods"
                : `/api/admin/pods?status=${statusFilter}`;
            const res = await fetch(url);
            const data = await res.json();
            setPods(data.pods || []);
        } catch (err) {
            console.error("Failed to load pods:", err);
        }
        setLoading(false);
        setRefreshing(false);
    }, [statusFilter]);

    useEffect(() => { loadPods(); }, [statusFilter]);
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [selectedPodId, pods]);

    // Auto-refresh every 30s
    useEffect(() => {
        const interval = setInterval(() => loadPods(true), 30000);
        return () => clearInterval(interval);
    }, [loadPods]);

    // ─── Selected Pod ──────────────────────────────────────────
    const selectedPod = pods.find(p => p.id === selectedPodId) || null;

    // ─── Filter & Sort ─────────────────────────────────────────
    const filtered = pods
        .filter(p => {
            if (!searchQuery) return true;
            const q = searchQuery.toLowerCase();
            return p.user.name.toLowerCase().includes(q) || p.user.email.toLowerCase().includes(q);
        })
        .sort((a, b) => {
            if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
            if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
            return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
        });

    // ─── Mark as Read (local state only, no re-fetch) ──────────
    const markAsRead = async (podId: string) => {
        setPods(prev => prev.map(p =>
            p.id === podId
                ? { ...p, unreadCount: 0, messages: p.messages.map(m => ({ ...m, readAt: m.readAt || new Date().toISOString() })) }
                : p
        ));
        try {
            await fetch(`/api/admin/pods/${podId}/reply`, { method: "PUT" });
        } catch { /* silent */ }
    };

    // ─── Select Pod ────────────────────────────────────────────
    const selectPod = (podId: string) => {
        setSelectedPodId(podId);
        setReplyContent("");
        const pod = pods.find(p => p.id === podId);
        if (pod && pod.unreadCount > 0) {
            markAsRead(podId);
        }
    };

    // ─── Send Reply ────────────────────────────────────────────
    const sendReply = async () => {
        if (!selectedPodId || !replyContent.trim()) return;
        setSending(true);
        try {
            const res = await fetch(`/api/admin/pods/${selectedPodId}/reply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: replyContent.trim() }),
            });
            if (res.ok) {
                const newMsg: Message = {
                    id: `temp-${Date.now()}`,
                    dayNumber: selectedPod?.masterclassDay || 0,
                    senderType: "sarah",
                    senderName: "Sarah",
                    senderAvatar: null,
                    content: replyContent.trim(),
                    audioUrl: null,
                    isSystem: false,
                    readAt: null,
                    sentAt: new Date().toISOString(),
                    createdAt: new Date().toISOString(),
                };
                setPods(prev => prev.map(p =>
                    p.id === selectedPodId
                        ? { ...p, messages: [...p.messages, newMsg], messageCount: p.messageCount + 1, lastActivity: new Date().toISOString() }
                        : p
                ));
                setReplyContent("");
            }
        } catch (err) {
            console.error("Failed to send reply:", err);
        }
        setSending(false);
    };

    // ─── Stats ─────────────────────────────────────────────────
    const totalUnread = pods.reduce((a, p) => a + p.unreadCount, 0);

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* ─── Header ───────────────────────────────────── */}
            <div className="shrink-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
                <div className="max-w-[1600px] mx-auto">
                    <div className="flex items-center justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                            <h1 className="text-lg font-bold text-gray-900">Masterclass Pods</h1>
                            <span className="text-xs text-gray-400">{pods.length} pods</span>
                            {totalUnread > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                                    {totalUnread} unread
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => loadPods(true)}
                            disabled={refreshing}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
                            Refresh
                        </button>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5">
                            {STATUS_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => setStatusFilter(opt.value)}
                                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                                        statusFilter === opt.value
                                            ? "bg-white text-gray-900 shadow-sm"
                                            : "text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 ml-auto text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5" />
                                {pods.filter(p => p.status === "pre_completion").length} learning
                            </span>
                            <span className="flex items-center gap-1">
                                <Award className="w-3.5 h-3.5" />
                                {pods.filter(p => p.status === "converted").length} converted
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Main Split View ──────────────────────────── */}
            <div className="flex-1 flex overflow-hidden max-w-[1600px] mx-auto w-full">
                {/* ─── Left: Pod List ───────────────────────── */}
                <div className="w-[360px] shrink-0 border-r border-gray-200 bg-white flex flex-col">
                    <div className="p-3 border-b border-gray-100">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-12 px-4">
                                <MessageCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                <p className="text-sm text-gray-400">No pods found</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {filtered.map((pod) => {
                                    const isActive = selectedPodId === pod.id;
                                    const sc = STATUS_COLORS[pod.status] || STATUS_COLORS.waiting;
                                    const lastMsg = pod.messages[pod.messages.length - 1];
                                    return (
                                        <button
                                            key={pod.id}
                                            onClick={() => selectPod(pod.id)}
                                            className={`w-full p-3 text-left transition-all ${
                                                isActive
                                                    ? "bg-blue-50 border-l-3 border-l-blue-500"
                                                    : "hover:bg-gray-50 border-l-3 border-l-transparent"
                                            }`}
                                            style={{ borderLeftWidth: "3px" }}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="relative shrink-0">
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-500 flex items-center justify-center text-white text-sm font-semibold">
                                                        {pod.user.name.charAt(0)}
                                                    </div>
                                                    {pod.unreadCount > 0 && (
                                                        <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                                                            {pod.unreadCount}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-0.5">
                                                        <span className={`text-sm font-medium truncate ${pod.unreadCount > 0 ? "text-gray-900" : "text-gray-700"}`}>
                                                            {pod.user.name}
                                                        </span>
                                                        <span className="text-[10px] text-gray-400 shrink-0 ml-1">
                                                            {timeAgo(pod.lastActivity)}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-1.5 mb-1">
                                                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${sc.bg} ${sc.text}`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                                                            {pod.status.replace(/_/g, " ")}
                                                        </span>
                                                        <span className="text-[10px] text-gray-400">Day {pod.masterclassDay}/30</span>
                                                    </div>

                                                    {lastMsg && (
                                                        <p className={`text-xs truncate ${pod.unreadCount > 0 ? "text-gray-700 font-medium" : "text-gray-400"}`}>
                                                            {lastMsg.senderType === "user" ? "" : "Sarah: "}
                                                            {lastMsg.content.slice(0, 60)}{lastMsg.content.length > 60 ? "..." : ""}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* ─── Right: Chat View ─────────────────────── */}
                <div className="flex-1 flex flex-col min-w-0">
                    {!selectedPod ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <MessageCircle className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                <p className="text-sm text-gray-400">Select a pod to view conversation</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Chat Header */}
                            <div className="shrink-0 px-5 py-3 bg-white border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-500 flex items-center justify-center text-white font-bold">
                                            {selectedPod.user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-bold text-gray-900">{selectedPod.user.name}</h2>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <span>{selectedPod.user.email}</span>
                                                <span className="text-gray-300">&middot;</span>
                                                <span>Day {selectedPod.masterclassDay}/30</span>
                                                {selectedPod.zombie && (
                                                    <>
                                                        <span className="text-gray-300">&middot;</span>
                                                        <span>Companion: {selectedPod.zombie.name}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {(() => {
                                            const sc = STATUS_COLORS[selectedPod.status] || STATUS_COLORS.waiting;
                                            return (
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.text}`}>
                                                    <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
                                                    {selectedPod.status.replace(/_/g, " ")}
                                                </span>
                                            );
                                        })()}
                                        <span className="text-xs text-gray-400">
                                            {selectedPod.messageCount} msgs
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-gray-50">
                                {selectedPod.messages.length === 0 ? (
                                    <p className="text-center text-gray-400 py-8 text-sm">No messages yet</p>
                                ) : (
                                    selectedPod.messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.senderType === "user" ? "justify-start" : "justify-end"}`}
                                        >
                                            <div
                                                className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                                                    msg.senderType === "user"
                                                        ? "bg-white border border-gray-200 text-gray-800"
                                                        : msg.isSystem
                                                            ? "bg-gray-200 text-gray-600 text-xs italic"
                                                            : "bg-gray-800 text-white"
                                                }`}
                                            >
                                                {msg.audioUrl && (
                                                    <audio controls className="w-full mb-2 h-8" src={msg.audioUrl} />
                                                )}
                                                <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
                                                <div className={`text-[10px] mt-1.5 ${
                                                    msg.senderType === "user" ? "text-gray-400" : "text-gray-400"
                                                }`}>
                                                    {msg.senderName || msg.senderType} &middot; Day {msg.dayNumber} &middot; {formatMsgTime(msg.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Reply Box */}
                            <div className="shrink-0 px-5 py-3 bg-white border-t border-gray-200">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                sendReply();
                                            }
                                        }}
                                        placeholder="Reply as Sarah..."
                                        className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                                    />
                                    <button
                                        onClick={sendReply}
                                        disabled={sending || !replyContent.trim()}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-800 disabled:opacity-40 transition-all"
                                    >
                                        {sending ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Send className="w-4 h-4" />
                                        )}
                                        Send
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
