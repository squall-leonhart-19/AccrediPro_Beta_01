"use client";

import { useState, useEffect } from "react";
import {
    Users,
    MessageCircle,
    Calendar,
    Clock,
    ChevronRight,
    RefreshCw,
    Filter,
    Eye,
} from "lucide-react";

interface Pod {
    id: string;
    userId: string;
    status: string;
    masterclassDay: number;
    nicheCategory: string;
    createdAt: string;
    startedAt: string | null;
    user: {
        firstName: string | null;
        lastName: string | null;
        email: string;
        createdAt: string;
    };
    zombieProfile: {
        name: string;
        avatar: string | null;
    };
    messages: Array<{
        id: string;
        senderType: string;
        senderName: string;
        content: string;
        createdAt: string;
    }>;
    _count: {
        messages: number;
        dayProgress: number;
    };
}

interface Stats {
    active?: number;
    waiting?: number;
    completed?: number;
    paused?: number;
}

export default function CirclePodsAdminPage() {
    const [pods, setPods] = useState<Pod[]>([]);
    const [stats, setStats] = useState<Stats>({});
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [selectedPod, setSelectedPod] = useState<Pod | null>(null);

    const fetchPods = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/circle-pods?status=${filter}`);
            const data = await res.json();
            setPods(data.pods || []);
            setStats(data.stats || {});
        } catch (error) {
            console.error("Failed to fetch pods:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPods();
    }, [filter]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-emerald-100 text-emerald-700";
            case "waiting":
                return "bg-amber-100 text-amber-700";
            case "completed":
                return "bg-blue-100 text-blue-700";
            case "paused":
                return "bg-slate-100 text-slate-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Circle Pods</h1>
                    <p className="text-gray-500">Manage 45-day nurture circles</p>
                </div>
                <button
                    onClick={fetchPods}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <Users className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.active || 0}</p>
                            <p className="text-sm text-gray-500">Active</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.waiting || 0}</p>
                            <p className="text-sm text-gray-500">Waiting</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.completed || 0}</p>
                            <p className="text-sm text-gray-500">Completed</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                            <MessageCircle className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {pods.reduce((acc, p) => acc + p._count.messages, 0)}
                            </p>
                            <p className="text-sm text-gray-500">Messages</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                {["all", "active", "waiting", "completed", "paused"].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === status
                                ? "bg-burgundy-600 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>

            {/* Pods Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                    User
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                    Zombie
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                    Day
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                    Messages
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                    Niche
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                    Created
                                </th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            ) : pods.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                                        No pods found
                                    </td>
                                </tr>
                            ) : (
                                pods.map((pod) => (
                                    <tr key={pod.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {pod.user.firstName} {pod.user.lastName}
                                                </p>
                                                <p className="text-xs text-gray-500">{pod.user.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {pod.zombieProfile.avatar && (
                                                    <img
                                                        src={pod.zombieProfile.avatar}
                                                        alt={pod.zombieProfile.name}
                                                        className="w-6 h-6 rounded-full"
                                                    />
                                                )}
                                                <span className="text-gray-700">{pod.zombieProfile.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                    pod.status
                                                )}`}
                                            >
                                                {pod.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="font-mono text-gray-900">Day {pod.masterclassDay}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-gray-700">{pod._count.messages}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-gray-600 text-sm">{pod.nicheCategory}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-gray-500 text-sm">
                                                {new Date(pod.createdAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => setSelectedPod(pod)}
                                                className="p-2 text-gray-400 hover:text-burgundy-600 hover:bg-burgundy-50 rounded-lg transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pod Detail Modal */}
            {selectedPod && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    {selectedPod.user.firstName}&apos;s Circle
                                </h2>
                                <p className="text-sm text-gray-500">Day {selectedPod.masterclassDay} • {selectedPod._count.messages} messages</p>
                            </div>
                            <button
                                onClick={() => setSelectedPod(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
                            {selectedPod.messages.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No messages yet</p>
                            ) : (
                                selectedPod.messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`p-3 rounded-lg ${msg.senderType === "sarah"
                                                ? "bg-burgundy-50"
                                                : msg.senderType === "zombie"
                                                    ? "bg-amber-50"
                                                    : "bg-blue-50"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-gray-900">{msg.senderName}</span>
                                            <span className="text-xs text-gray-400">
                                                {new Date(msg.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 text-sm">{msg.content}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
