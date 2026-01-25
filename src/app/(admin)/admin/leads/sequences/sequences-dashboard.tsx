"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Mail,
    MousePointer,
    Eye,
    TrendingUp,
    TrendingDown,
    RefreshCw,
    ChevronRight,
    ArrowLeft,
    Send,
    CheckCircle,
    XCircle,
    Clock,
    Target,
    BarChart3,
    Users,
    Zap,
    MessageCircle,
} from "lucide-react";
import Link from "next/link";

// Types
interface EmailStat {
    id: string;
    order: number;
    subject: string;
    delayDays: number;
    delayHours: number;
    isActive: boolean;
    sent: number;
    opened: number;
    clicked: number;
    replied: number;
    openRate: number;
    clickRate: number;
    replyRate: number;
    ctor: number;
}

interface FunnelData {
    emailIndex: number;
    subject: string;
    received: number;
    dropoff: number;
}

interface SequenceData {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    triggerType: string;
    isActive: boolean;
    totalEnrolled: number;
    totalCompleted: number;
    totalExited: number;
    miniDiplomaLeads: number;
    conversions: number;
    conversionRate: number;
    emailCount: number;
    emails: EmailStat[];
    funnel: FunnelData[];
    totalSent: number;
    totalOpened: number;
    totalClicked: number;
    avgOpenRate: number;
    avgClickRate: number;
}

interface RecentSend {
    id: string;
    email: string;
    userName: string;
    userId: string;
    category: string | null;
    emailOrder: number;
    subject: string;
    status: string;
    sentAt: string | null;
    openedAt: string | null;
    clickedAt: string | null;
    opens: number;
    clicks: number;
}

interface SequenceDetail extends SequenceData {
    recentSends: RecentSend[];
}

interface OverallStats {
    totalSequences: number;
    activeSequences: number;
    totalEmailsSent: number;
    totalOpens: number;
    totalClicks: number;
    avgOpenRate: number;
    avgClickRate: number;
    totalConversions: number;
}

interface DashboardData {
    overallStats: OverallStats;
    sequences: SequenceData[];
    sequenceDetail: SequenceDetail | null;
}

const STATUS_COLORS: Record<string, string> = {
    SENT: "bg-blue-100 text-blue-700",
    DELIVERED: "bg-green-100 text-green-700",
    OPENED: "bg-purple-100 text-purple-700",
    CLICKED: "bg-amber-100 text-amber-700",
    BOUNCED: "bg-red-100 text-red-700",
    FAILED: "bg-red-100 text-red-700",
    QUEUED: "bg-gray-100 text-gray-700",
};

export default function SequencesDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSequence, setSelectedSequence] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, [selectedSequence]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedSequence) params.set("sequenceId", selectedSequence);

            const res = await fetch(`/api/admin/leads-sequences?${params.toString()}`);
            if (res.ok) {
                const result = await res.json();
                setData(result);
            }
        } catch (error) {
            console.error("Failed to fetch sequences data:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: string | null) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getRateColor = (rate: number, type: "open" | "click") => {
        if (type === "open") {
            if (rate >= 40) return "text-green-600";
            if (rate >= 25) return "text-amber-600";
            return "text-red-600";
        }
        // click rate
        if (rate >= 10) return "text-green-600";
        if (rate >= 5) return "text-amber-600";
        return "text-red-600";
    };

    if (loading && !data) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <RefreshCw className="w-10 h-10 animate-spin text-burgundy-500 mx-auto mb-4" />
                    <p className="text-gray-500">Loading sequence analytics...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Failed to load sequence data</p>
                <Button onClick={fetchData}>Retry</Button>
            </div>
        );
    }

    // If viewing a specific sequence
    if (selectedSequence && data.sequenceDetail) {
        const seq = data.sequenceDetail;
        return (
            <div className="space-y-6">
                {/* Back button and header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => setSelectedSequence(null)}
                        className="gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Sequences
                    </Button>
                </div>

                <div className="bg-gradient-to-r from-[#4e1f24] via-[#722f37] to-[#4e1f24] -mx-6 px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">{seq.name}</h1>
                            <p className="text-[#C9A227] text-sm">{seq.description || "Email nurturing sequence"}</p>
                        </div>
                        <Badge className={seq.isActive ? "bg-green-500" : "bg-gray-500"}>
                            {seq.isActive ? "Active" : "Inactive"}
                        </Badge>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-sm text-gray-500">Total Sent</p>
                            <p className="text-3xl font-bold">{seq.totalSent.toLocaleString()}</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-purple-50 border-purple-200">
                        <CardContent className="pt-6">
                            <p className="text-sm text-purple-600">Open Rate</p>
                            <p className={`text-3xl font-bold ${getRateColor(seq.avgOpenRate, "open")}`}>
                                {seq.avgOpenRate}%
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-amber-50 border-amber-200">
                        <CardContent className="pt-6">
                            <p className="text-sm text-amber-600">Click Rate</p>
                            <p className={`text-3xl font-bold ${getRateColor(seq.avgClickRate, "click")}`}>
                                {seq.avgClickRate}%
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-sm text-gray-500">Mini Diploma Leads</p>
                            <p className="text-3xl font-bold">{seq.miniDiplomaLeads}</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-green-50 border-green-200">
                        <CardContent className="pt-6">
                            <p className="text-sm text-green-600">Conversions</p>
                            <p className="text-3xl font-bold text-green-700">
                                {seq.conversions}
                                <span className="text-sm ml-2">({seq.conversionRate}%)</span>
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="emails" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="emails" className="gap-2">
                            <Mail className="w-4 h-4" />
                            Email Performance
                        </TabsTrigger>
                        <TabsTrigger value="funnel" className="gap-2">
                            <BarChart3 className="w-4 h-4" />
                            Funnel
                        </TabsTrigger>
                        <TabsTrigger value="recent" className="gap-2">
                            <Clock className="w-4 h-4" />
                            Recent Sends
                        </TabsTrigger>
                    </TabsList>

                    {/* Email-by-Email Performance */}
                    <TabsContent value="emails">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="w-5 h-5 text-burgundy-600" />
                                    Email-by-Email Performance
                                </CardTitle>
                                <CardDescription>
                                    Open rates, click rates, and engagement for each email in the sequence
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12">#</TableHead>
                                            <TableHead>Subject</TableHead>
                                            <TableHead className="text-center">Delay</TableHead>
                                            <TableHead className="text-center">Sent</TableHead>
                                            <TableHead className="text-center">Opens</TableHead>
                                            <TableHead className="text-center">Open %</TableHead>
                                            <TableHead className="text-center">Clicks</TableHead>
                                            <TableHead className="text-center">CTOR</TableHead>
                                            <TableHead className="text-center">Replies</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {seq.emails.map((email) => (
                                            <TableRow key={email.id}>
                                                <TableCell>
                                                    <Badge variant="outline">{email.order + 1}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        {!email.isActive && (
                                                            <XCircle className="w-4 h-4 text-red-400" />
                                                        )}
                                                        <span className={!email.isActive ? "text-gray-400" : ""}>
                                                            {email.subject}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center text-sm text-gray-500">
                                                    {email.delayDays > 0 && `${email.delayDays}d `}
                                                    {email.delayHours > 0 && `${email.delayHours}h`}
                                                    {email.delayDays === 0 && email.delayHours === 0 && "Immediate"}
                                                </TableCell>
                                                <TableCell className="text-center font-medium">
                                                    {email.sent.toLocaleString()}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {email.opened.toLocaleString()}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <span className={`font-medium ${getRateColor(email.openRate, "open")}`}>
                                                        {email.openRate}%
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {email.clicked.toLocaleString()}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <span className={`font-medium ${getRateColor(email.ctor, "click")}`}>
                                                        {email.ctor}%
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {email.replied > 0 ? (
                                                        <Badge className="bg-green-500">{email.replied}</Badge>
                                                    ) : (
                                                        <span className="text-gray-400">0</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Funnel View */}
                    <TabsContent value="funnel">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-burgundy-600" />
                                    Sequence Funnel
                                </CardTitle>
                                <CardDescription>
                                    How many leads received each email in the sequence
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {seq.funnel.map((step, idx) => {
                                        const maxReceived = seq.funnel[0]?.received || 1;
                                        const width = (step.received / maxReceived) * 100;
                                        const prevReceived = idx > 0 ? seq.funnel[idx - 1].received : step.received;
                                        const dropoffPct = prevReceived > 0
                                            ? Math.round(((prevReceived - step.received) / prevReceived) * 100)
                                            : 0;

                                        return (
                                            <div key={idx}>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
                                                        {step.emailIndex}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-sm font-medium truncate max-w-xs">
                                                                {step.subject}
                                                            </span>
                                                            <span className="text-sm">
                                                                <span className="font-bold">{step.received}</span>
                                                                <span className="text-gray-400 ml-2">
                                                                    ({Math.round(width)}%)
                                                                </span>
                                                            </span>
                                                        </div>
                                                        <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-burgundy-500 to-burgundy-400 transition-all duration-500"
                                                                style={{ width: `${width}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                {idx < seq.funnel.length - 1 && dropoffPct > 0 && (
                                                    <div className="flex items-center ml-4 mt-1 mb-2">
                                                        <div className="w-px h-4 bg-gray-200 ml-3" />
                                                        <div className="ml-8 flex items-center gap-1 text-xs text-red-500">
                                                            <TrendingDown className="w-3 h-3" />
                                                            {dropoffPct}% dropped off
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Recent Sends */}
                    <TabsContent value="recent">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-burgundy-600" />
                                    Recent Email Sends
                                </CardTitle>
                                <CardDescription>
                                    Latest 100 emails sent from this sequence
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Recipient</TableHead>
                                            <TableHead>Email #</TableHead>
                                            <TableHead>Subject</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Sent</TableHead>
                                            <TableHead>Opened</TableHead>
                                            <TableHead>Clicked</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {seq.recentSends.map((send) => (
                                            <TableRow key={send.id}>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{send.userName}</p>
                                                        <p className="text-xs text-gray-500">{send.email}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">#{send.emailOrder + 1}</Badge>
                                                </TableCell>
                                                <TableCell className="max-w-xs truncate">
                                                    {send.subject}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={STATUS_COLORS[send.status] || "bg-gray-100"}>
                                                        {send.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {formatDate(send.sentAt)}
                                                </TableCell>
                                                <TableCell>
                                                    {send.openedAt ? (
                                                        <div className="flex items-center gap-1 text-purple-600">
                                                            <Eye className="w-4 h-4" />
                                                            {send.opens}x
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {send.clickedAt ? (
                                                        <div className="flex items-center gap-1 text-amber-600">
                                                            <MousePointer className="w-4 h-4" />
                                                            {send.clicks}x
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        );
    }

    // Main sequences list view
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#4e1f24] via-[#722f37] to-[#4e1f24] -mx-6 -mt-6 px-6 py-6 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/leads">
                            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Email Sequences</h1>
                            <p className="text-[#C9A227] text-sm">Nurture sequence performance & conversions</p>
                        </div>
                    </div>
                    <Button
                        className="bg-[#C9A227] hover:bg-[#b8922a] text-[#4e1f24] font-semibold"
                        onClick={fetchData}
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Overall Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Active Sequences</p>
                                <p className="text-3xl font-bold">{data.overallStats.activeSequences}</p>
                                <p className="text-xs text-gray-400">of {data.overallStats.totalSequences} total</p>
                            </div>
                            <Mail className="w-8 h-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Emails Sent</p>
                                <p className="text-3xl font-bold">{data.overallStats.totalEmailsSent.toLocaleString()}</p>
                            </div>
                            <Send className="w-8 h-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-purple-600">Avg Open Rate</p>
                                <p className={`text-3xl font-bold ${getRateColor(data.overallStats.avgOpenRate, "open")}`}>
                                    {data.overallStats.avgOpenRate}%
                                </p>
                                <p className="text-xs text-purple-600">{data.overallStats.totalOpens.toLocaleString()} opens</p>
                            </div>
                            <Eye className="w-8 h-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-green-600">Conversions</p>
                                <p className="text-3xl font-bold text-green-700">{data.overallStats.totalConversions}</p>
                                <p className="text-xs text-green-600">from sequences</p>
                            </div>
                            <Target className="w-8 h-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sequences List */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-burgundy-600" />
                        All Sequences
                    </CardTitle>
                    <CardDescription>
                        Click on a sequence to view detailed email-by-email analytics
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {data.sequences.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Sequence</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead className="text-center">Emails</TableHead>
                                    <TableHead className="text-center">Enrolled</TableHead>
                                    <TableHead className="text-center">Sent</TableHead>
                                    <TableHead className="text-center">Open %</TableHead>
                                    <TableHead className="text-center">Click %</TableHead>
                                    <TableHead className="text-center">Conversions</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.sequences.map((seq) => (
                                    <TableRow
                                        key={seq.id}
                                        className="cursor-pointer hover:bg-gray-50"
                                        onClick={() => setSelectedSequence(seq.id)}
                                    >
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{seq.name}</p>
                                                <p className="text-xs text-gray-500">{seq.triggerType}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge className={seq.isActive ? "bg-green-500" : "bg-gray-400"}>
                                                {seq.isActive ? "Active" : "Paused"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {seq.emailCount}
                                        </TableCell>
                                        <TableCell className="text-center font-medium">
                                            {seq.totalEnrolled.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {seq.totalSent.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className={`font-medium ${getRateColor(seq.avgOpenRate, "open")}`}>
                                                {seq.avgOpenRate}%
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className={`font-medium ${getRateColor(seq.avgClickRate, "click")}`}>
                                                {seq.avgClickRate}%
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {seq.conversions > 0 ? (
                                                <Badge className="bg-green-500">
                                                    {seq.conversions} ({seq.conversionRate}%)
                                                </Badge>
                                            ) : (
                                                <span className="text-gray-400">0</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <ChevronRight className="w-4 h-4 text-gray-400" />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-12">
                            <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No active sequences found</p>
                            <p className="text-sm text-gray-400">Create an email sequence to start nurturing leads</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
