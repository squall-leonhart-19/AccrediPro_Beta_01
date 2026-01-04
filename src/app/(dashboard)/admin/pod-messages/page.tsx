"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    MessageSquare,
    Users,
    Search,
    RefreshCw,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Bot,
    User,
    AlertTriangle,
} from "lucide-react";
import Link from "next/link";

type Message = {
    id: string;
    content: string;
    daysSinceEnrollment: number;
    aiResponderName: string | null;
    aiResponse: string | null;
    createdAt: string;
    user: {
        id: string;
        name: string;
        email: string;
        enrolledAt: string;
    };
};

type MessagesData = {
    messages: Message[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    summary: {
        totalMessages: number;
        uniqueUsers: number;
        period: string;
    };
    dayDistribution: Array<{ day: number; count: number }>;
};

export default function PodMessagesPage() {
    const [data, setData] = useState<MessagesData | null>(null);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(14);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [page, setPage] = useState(1);

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                days: days.toString(),
                page: page.toString(),
                limit: "30",
            });
            if (search) params.set("search", search);

            const res = await fetch(`/api/admin/pod/messages?${params}`);
            const json = await res.json();
            if (json.messages) {
                setData(json);
            }
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [days, page, search]);

    const handleSearch = () => {
        setSearch(searchInput);
        setPage(1);
    };

    const summary = data?.summary || { totalMessages: 0, uniqueUsers: 0, period: `Last ${days} days` };
    const pagination = data?.pagination || { page: 1, limit: 30, total: 0, totalPages: 1 };

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/admin/pod-analytics" className="text-burgundy-600 hover:text-burgundy-800">
                            ← Back to Analytics
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Pod User Messages</h1>
                    <p className="text-slate-600 mt-1">View what users are saying in My Circle</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={days === 7 ? "default" : "outline"}
                        size="sm"
                        onClick={() => { setDays(7); setPage(1); }}
                    >
                        7 Days
                    </Button>
                    <Button
                        variant={days === 14 ? "default" : "outline"}
                        size="sm"
                        onClick={() => { setDays(14); setPage(1); }}
                    >
                        14 Days
                    </Button>
                    <Button
                        variant={days === 30 ? "default" : "outline"}
                        size="sm"
                        onClick={() => { setDays(30); setPage(1); }}
                    >
                        30 Days
                    </Button>
                    <Button variant="ghost" size="sm" onClick={fetchData} disabled={loading}>
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-purple-600 mb-2">
                            <MessageSquare className="w-5 h-5" />
                            <span className="text-sm font-medium">Total Messages</span>
                        </div>
                        <p className="text-3xl font-bold text-purple-900">{summary.totalMessages}</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-green-600 mb-2">
                            <Users className="w-5 h-5" />
                            <span className="text-sm font-medium">Active Users</span>
                        </div>
                        <p className="text-3xl font-bold text-green-900">{summary.uniqueUsers}</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-blue-600 mb-2">
                            <Calendar className="w-5 h-5" />
                            <span className="text-sm font-medium">Period</span>
                        </div>
                        <p className="text-xl font-bold text-blue-900">{summary.period}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Search messages..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            className="max-w-md"
                        />
                        <Button onClick={handleSearch} variant="outline">
                            <Search className="w-4 h-4 mr-2" />
                            Search
                        </Button>
                        {search && (
                            <Button variant="ghost" onClick={() => { setSearch(""); setSearchInput(""); }}>
                                Clear
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Messages */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-burgundy-600" />
                        User Conversations
                    </CardTitle>
                    <CardDescription>
                        {pagination.total} messages • Page {pagination.page} of {pagination.totalPages}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading && !data ? (
                        <div className="flex justify-center py-12">
                            <RefreshCw className="w-8 h-8 animate-spin text-burgundy-600" />
                        </div>
                    ) : data?.messages && data.messages.length > 0 ? (
                        <div className="space-y-4">
                            {data.messages.map((message) => (
                                <div key={message.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                                    {/* User info header */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback className="bg-burgundy-100 text-burgundy-700">
                                                {message.user.name.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="font-medium text-slate-900">{message.user.name}</p>
                                            <p className="text-xs text-slate-500">{message.user.email}</p>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="outline" className="mb-1">
                                                Day {message.daysSinceEnrollment}
                                            </Badge>
                                            <p className="text-xs text-slate-400">
                                                {new Date(message.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* User message */}
                                    <div className="flex gap-2 mb-2">
                                        <User className="w-4 h-4 text-blue-500 mt-1 shrink-0" />
                                        <div className="bg-blue-50 rounded-lg p-3 flex-1">
                                            <p className="text-slate-800">{message.content}</p>
                                        </div>
                                    </div>

                                    {/* AI Response */}
                                    {message.aiResponse && (
                                        <div className="flex gap-2 ml-8">
                                            <Bot className="w-4 h-4 text-purple-500 mt-1 shrink-0" />
                                            <div className="bg-purple-50 rounded-lg p-3 flex-1">
                                                <p className="text-xs text-purple-600 font-medium mb-1">
                                                    {message.aiResponderName || "Coach Sarah M."}
                                                </p>
                                                <p className="text-slate-700 text-sm">{message.aiResponse}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 pt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(page - 1)}
                                        disabled={page <= 1}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Previous
                                    </Button>
                                    <span className="text-sm text-slate-600">
                                        Page {page} of {pagination.totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(page + 1)}
                                        disabled={page >= pagination.totalPages}
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500">No messages yet.</p>
                            <p className="text-sm text-slate-400 mt-1">
                                Messages will appear here when users chat in My Circle.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
