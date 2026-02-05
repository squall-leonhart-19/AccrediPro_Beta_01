"use client";

import { useState, useEffect } from "react";
import {
    MessageCircle, Send, Clock, User, ChevronDown, ChevronUp,
    Filter, RefreshCw, Calendar, CheckCircle, AlertCircle, Loader2
} from "lucide-react";

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

export default function PodsDashboard() {
    const [pods, setPods] = useState<Pod[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedPod, setExpandedPod] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState<Record<string, string>>({});
    const [sending, setSending] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("all");

    useEffect(() => {
        loadPods();
    }, [statusFilter]);

    const loadPods = async () => {
        setLoading(true);
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
    };

    const sendReply = async (podId: string) => {
        const content = replyContent[podId]?.trim();
        if (!content) return;

        setSending(podId);
        try {
            const res = await fetch(`/api/admin/pods/${podId}/reply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content }),
            });

            if (res.ok) {
                setReplyContent(prev => ({ ...prev, [podId]: "" }));
                loadPods(); // Refresh to show new message
            }
        } catch (err) {
            console.error("Failed to send reply:", err);
        }
        setSending(null);
    };

    const markAsRead = async (podId: string) => {
        try {
            await fetch(`/api/admin/pods/${podId}/reply`, { method: "PUT" });
            loadPods();
        } catch (err) {
            console.error("Failed to mark as read:", err);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pre_completion": return "bg-blue-100 text-blue-800";
            case "post_completion": return "bg-green-100 text-green-800";
            case "active": return "bg-green-100 text-green-800";
            case "waiting": return "bg-yellow-100 text-yellow-800";
            case "completed": return "bg-blue-100 text-blue-800";
            case "converted": return "bg-purple-100 text-purple-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Masterclass Pods</h1>
                    <p className="text-gray-600">View and reply to mini diploma nurture pods</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#722f37] focus:border-transparent"
                    >
                        <option value="all">All Status</option>
                        <option value="pre_completion">Pre-Completion (Learning)</option>
                        <option value="post_completion">Post-Completion (Nurture)</option>
                        <option value="converted">Converted</option>
                    </select>
                    <button
                        onClick={loadPods}
                        className="flex items-center gap-2 px-4 py-2 bg-[#722f37] text-white rounded-lg hover:bg-[#5a252c] transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-[#722f37]">{pods.length}</div>
                    <div className="text-sm text-gray-600">Total Pods</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-blue-600">
                        {pods.filter(p => p.status === "pre_completion").length}
                    </div>
                    <div className="text-sm text-gray-600">Learning</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-orange-600">
                        {pods.reduce((acc, p) => acc + p.unreadCount, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Unread Messages</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-purple-600">
                        {pods.filter(p => p.status === "converted").length}
                    </div>
                    <div className="text-sm text-gray-600">Converted</div>
                </div>
            </div>

            {/* Pods List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[#722f37]" />
                </div>
            ) : pods.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No pods found</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {pods.map((pod) => (
                        <div key={pod.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            {/* Pod Header Row */}
                            <div
                                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => {
                                    setExpandedPod(expandedPod === pod.id ? null : pod.id);
                                    if (pod.unreadCount > 0 && expandedPod !== pod.id) {
                                        markAsRead(pod.id);
                                    }
                                }}
                            >
                                <div className="flex items-center gap-4">
                                    {/* Avatar */}
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#722f37] to-[#d4af37] flex items-center justify-center text-white font-bold">
                                            {pod.user.name.charAt(0)}
                                        </div>
                                        {pod.unreadCount > 0 && (
                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                                {pod.unreadCount}
                                            </div>
                                        )}
                                    </div>

                                    {/* User Info */}
                                    <div>
                                        <div className="font-semibold text-gray-900">{pod.user.name}</div>
                                        <div className="text-sm text-gray-500">{pod.user.email}</div>
                                    </div>
                                </div>

                                {/* Pod Details */}
                                <div className="flex items-center gap-6">
                                    {/* Day */}
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-[#722f37]">Day {pod.masterclassDay}</div>
                                        <div className="text-xs text-gray-500">of 30</div>
                                    </div>

                                    {/* Zombie */}
                                    {pod.zombie && (
                                        <div className="text-center">
                                            <div className="text-sm font-medium text-gray-700">{pod.zombie.name}</div>
                                            <div className="text-xs text-gray-500">Companion</div>
                                        </div>
                                    )}

                                    {/* Status */}
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(pod.status)}`}>
                                        {pod.status}
                                    </span>

                                    {/* Last Activity */}
                                    <div className="text-sm text-gray-500 flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {formatDate(pod.lastActivity)}
                                    </div>

                                    {/* Expand Icon */}
                                    {expandedPod === pod.id ? (
                                        <ChevronUp className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                            </div>

                            {/* Expanded Conversation */}
                            {expandedPod === pod.id && (
                                <div className="border-t border-gray-200">
                                    {/* Messages */}
                                    <div className="max-h-96 overflow-y-auto p-4 space-y-3 bg-gray-50">
                                        {pod.messages.length === 0 ? (
                                            <p className="text-center text-gray-500 py-4">No messages yet</p>
                                        ) : (
                                            pod.messages.map((msg) => (
                                                <div
                                                    key={msg.id}
                                                    className={`flex ${msg.senderType === "user" ? "justify-end" : "justify-start"}`}
                                                >
                                                    <div
                                                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${msg.senderType === "user"
                                                            ? "bg-[#722f37] text-white"
                                                            : msg.senderType === "sarah"
                                                                ? "bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-white"
                                                                : "bg-white border border-gray-200 text-gray-800"
                                                            }`}
                                                    >
                                                        <div className="text-xs opacity-75 mb-1">
                                                            {msg.senderName || msg.senderType} · Day {msg.dayNumber}
                                                        </div>
                                                        <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Reply Box */}
                                    <div className="p-4 border-t border-gray-200 bg-white">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="text"
                                                value={replyContent[pod.id] || ""}
                                                onChange={(e) => setReplyContent(prev => ({ ...prev, [pod.id]: e.target.value }))}
                                                onKeyDown={(e) => e.key === "Enter" && sendReply(pod.id)}
                                                placeholder="Reply as Sarah..."
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#722f37] focus:border-transparent"
                                            />
                                            <button
                                                onClick={() => sendReply(pod.id)}
                                                disabled={sending === pod.id || !replyContent[pod.id]?.trim()}
                                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-white rounded-full hover:opacity-90 disabled:opacity-50 transition-opacity"
                                            >
                                                {sending === pod.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Send className="w-4 h-4" />
                                                )}
                                                Send as Sarah
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
