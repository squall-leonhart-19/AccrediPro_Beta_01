'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    MessageSquare,
    Inbox,
    CheckCircle,
    Clock,
    TrendingUp,
    User,
    Calendar,
    BarChart3,
    AlertCircle,
    Reply,
    Download,
    FileText,
    Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export interface AnalyticsProps {
    messageStats: {
        messagesToday: number;
        messagesThisWeek: number;
        totalConversations: number;
        awaitingResponse: number;
        trend: { date: string; count: number }[];
        topSenders: { name: string; email: string; count: number }[];
    };
    ticketStats: {
        openTickets: number;
        ticketsToday: number;
        repliesToday: number;
        resolvedToday: number;
        avgResponseTimeHours: number;
        urgentTickets: number;
        ticketTrend: { date: string; opened: number; resolved: number }[];
        byCategory: { category: string; count: number }[];
    };
}

export default function CustomerCareAnalytics({ messageStats, ticketStats }: AnalyticsProps) {
    const [exporting, setExporting] = useState(false);

    const handleExportTickets = async () => {
        setExporting(true);
        try {
            const res = await fetch("/api/admin/tickets/export");
            if (!res.ok) throw new Error("Export failed");

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `tickets-export-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            toast.success("Tickets exported successfully!");
        } catch (error) {
            console.error("Export failed:", error);
            toast.error("Failed to export tickets");
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Customer Care Intelligence</h2>
                    <p className="text-gray-500 mt-1">Real-time performance metrics</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExportTickets}
                        disabled={exporting}
                        className="gap-2"
                    >
                        {exporting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Download className="w-4 h-4" />
                        )}
                        Export Tickets
                    </Button>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                        Live System Status
                    </Badge>
                </div>
            </div>

            <Tabs defaultValue="messages" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
                    <TabsTrigger value="messages" className="text-base font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Messages Analysis
                    </TabsTrigger>
                    <TabsTrigger value="tickets" className="text-base font-medium data-[state=active]:bg-purple-600 data-[state=active]:text-white transition-all">
                        <Inbox className="w-4 h-4 mr-2" />
                        Tickets Analysis
                    </TabsTrigger>
                </TabsList>

                {/* MESSAGES TAB */}
                <TabsContent value="messages" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="border-t-4 border-t-blue-500 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">User Messages (24h)</CardTitle>
                                <MessageSquare className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-900">{messageStats.messagesToday}</div>
                                <p className="text-xs text-gray-500 mt-1">
                                    <span className="text-blue-600 font-medium">{messageStats.messagesThisWeek}</span> this week
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-t-4 border-t-indigo-500 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">Active Conversations</CardTitle>
                                <User className="h-4 w-4 text-indigo-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-900">{messageStats.totalConversations}</div>
                                <p className="text-xs text-gray-500 mt-1">Unique student threads</p>
                            </CardContent>
                        </Card>

                        <Card className={`border-t-4 ${messageStats.awaitingResponse > 0 ? 'border-t-red-500 bg-red-50/30' : 'border-t-green-500'} shadow-sm hover:shadow-md transition-shadow`}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">Awaiting Response</CardTitle>
                                <AlertCircle className={`h-4 w-4 ${messageStats.awaitingResponse > 0 ? 'text-red-500' : 'text-green-500'}`} />
                            </CardHeader>
                            <CardContent>
                                <div className={`text-2xl font-bold ${messageStats.awaitingResponse > 0 ? 'text-red-700' : 'text-gray-900'}`}>{messageStats.awaitingResponse}</div>
                                <p className="text-xs text-gray-500 mt-1">&gt;24h without reply</p>
                            </CardContent>
                        </Card>

                        <Card className="border-t-4 border-t-gray-500 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">Volume Trend</CardTitle>
                                <TrendingUp className="h-4 w-4 text-gray-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-end gap-1 h-8 mt-1">
                                    {messageStats.trend.map((d, i) => (
                                        <div
                                            key={i}
                                            className="bg-blue-200 flex-1 rounded-t-sm hover:bg-blue-300 transition-colors"
                                            style={{ height: `${Math.max(10, (d.count / (Math.max(...messageStats.trend.map(x => x.count)) || 1)) * 100)}%` }}
                                            title={`${d.date}: ${d.count}`}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="col-span-1 lg:col-span-2 shadow-sm">
                            <CardHeader>
                                <CardTitle>7-Day Message Volume</CardTitle>
                                <CardDescription>Inbound messages from students</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[250px] w-full flex items-end justify-between gap-2 px-4">
                                    {messageStats.trend.map((d, i) => (
                                        <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                                            <div
                                                className="w-full bg-blue-500 rounded-t-lg transition-all duration-500 ease-in-out group-hover:bg-blue-600 relative"
                                                style={{ height: `${Math.max(4, (d.count / (Math.max(...messageStats.trend.map(x => x.count)) || 1)) * 100)}%` }}
                                            >
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {d.count}
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-500 font-medium">{d.date}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle>Top Active Students</CardTitle>
                                <CardDescription>Most messages sent this week</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {messageStats.topSenders.map((sender, i) => (
                                        <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                                                    {sender.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-900">{sender.name}</span>
                                                    <span className="text-xs text-gray-500">{sender.email}</span>
                                                </div>
                                            </div>
                                            <div className="text-sm font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                                                {sender.count}
                                            </div>
                                        </div>
                                    ))}
                                    {messageStats.topSenders.length === 0 && (
                                        <p className="text-center text-gray-500 text-sm py-4">No active senders found.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* TICKETS TAB */}
                <TabsContent value="tickets" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="border-t-4 border-t-amber-500 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">Open Tickets</CardTitle>
                                <Inbox className="h-4 w-4 text-amber-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-900">{ticketStats.openTickets}</div>
                                <div className="flex items-center mt-1">
                                    {ticketStats.urgentTickets > 0 && (
                                        <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-5">
                                            {ticketStats.urgentTickets} Urgent
                                        </Badge>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-t-4 border-t-blue-500 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">Answered Today</CardTitle>
                                <Reply className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-900">{ticketStats.repliesToday}</div>
                                <p className="text-xs text-gray-500 mt-1">Staff replies sent today</p>
                            </CardContent>
                        </Card>

                        <Card className="border-t-4 border-t-green-500 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">Resolved Today</CardTitle>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-900">{ticketStats.resolvedToday}</div>
                                <p className="text-xs text-gray-500 mt-1">Tickets closed</p>
                            </CardContent>
                        </Card>

                        <Card className="border-t-4 border-t-purple-500 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">Avg Resolution</CardTitle>
                                <Clock className="h-4 w-4 text-purple-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-900">{ticketStats.avgResponseTimeHours}h</div>
                                <p className="text-xs text-gray-500 mt-1">Average time to close</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="col-span-1 lg:col-span-2 shadow-sm">
                            <CardHeader>
                                <CardTitle>Ticket Activity (New vs Resolved)</CardTitle>
                                <CardDescription>Performance tracking over last 7 days</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[250px] w-full flex items-end justify-between gap-4 px-4">
                                    {ticketStats.ticketTrend.map((d, i) => (
                                        <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                                            <div className="w-full h-full flex items-end gap-1">
                                                {/* Opened Bar */}
                                                <div
                                                    className="flex-1 bg-amber-400 rounded-t transition-all hover:bg-amber-500 relative group/opened"
                                                    style={{ height: `${Math.max(4, (d.opened / (Math.max(...ticketStats.ticketTrend.map(x => Math.max(x.opened, x.resolved))) || 1)) * 100)}%` }}
                                                >
                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-amber-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/opened:opacity-100 transition-opacity z-10 whitespace-nowrap">
                                                        {d.opened} opened
                                                    </div>
                                                </div>
                                                {/* Resolved Bar */}
                                                <div
                                                    className="flex-1 bg-green-500 rounded-t transition-all hover:bg-green-600 relative group/resolved"
                                                    style={{ height: `${Math.max(4, (d.resolved / (Math.max(...ticketStats.ticketTrend.map(x => Math.max(x.opened, x.resolved))) || 1)) * 100)}%` }}
                                                >
                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/resolved:opacity-100 transition-opacity z-10 whitespace-nowrap">
                                                        {d.resolved} resolved
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-500 font-medium">{d.date}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-center gap-6 mt-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-amber-400 rounded-sm"></div>
                                        <span className="text-xs text-gray-600">New Tickets</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                                        <span className="text-xs text-gray-600">Resolved</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle>Tickets by Category</CardTitle>
                                <CardDescription>Distribution of issues</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {ticketStats.byCategory.map((cat, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                                <span className="text-sm text-gray-600 capitalize">{cat.category.toLowerCase().replace('_', ' ')}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-purple-500"
                                                        style={{ width: `${(cat.count / (ticketStats.byCategory.length > 0 ? Math.max(...ticketStats.byCategory.map(c => c.count)) : 1)) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-medium w-6 text-right">{cat.count}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {ticketStats.byCategory.length === 0 && (
                                        <p className="text-center text-gray-500 text-sm">No category data available.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
