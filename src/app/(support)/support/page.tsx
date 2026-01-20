"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useTickets, Ticket, useUpdateTicket, useReplyTicket, useTicketDetails } from "@/hooks/use-tickets";
import { formatDistanceToNow, format, differenceInHours, differenceInMinutes } from "date-fns";
import {
    Search, RefreshCcw, CheckCircle2, XCircle, AlertTriangle,
    MessageSquare, User, Clock, Zap, Send, ChevronDown,
    Mail, LifeBuoy, Sparkles, Tag as TagIcon, Plus, X,
    Inbox, CheckCheck, Archive, Circle, Calendar, BookOpen,
    Loader2, Brain, LogOut, UserCircle, GraduationCap, TrendingUp,
    ChevronUp, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Link from "next/link";

// ASI Branding
const ASI = {
    name: "AccrediPro Standards Institute",
    division: "Student Success Division",
    logo: "https://coach.accredipro.academy/wp-content/uploads/2025/10/Senza-titolo-Logo-1.png",
};

// Status configuration
const STATUS_CONFIG = {
    NEW: { label: "New", color: "bg-blue-500", textColor: "text-blue-700", bgLight: "bg-blue-50", icon: Circle },
    OPEN: { label: "Open", color: "bg-emerald-500", textColor: "text-emerald-700", bgLight: "bg-emerald-50", icon: MessageSquare },
    PENDING: { label: "Pending", color: "bg-amber-500", textColor: "text-amber-700", bgLight: "bg-amber-50", icon: Clock },
    RESOLVED: { label: "Resolved", color: "bg-purple-500", textColor: "text-purple-700", bgLight: "bg-purple-50", icon: CheckCheck },
    CLOSED: { label: "Closed", color: "bg-slate-400", textColor: "text-slate-600", bgLight: "bg-slate-100", icon: Archive },
};

const PRIORITY_CONFIG = {
    LOW: { label: "Low", color: "text-slate-500", bg: "bg-slate-100", icon: CheckCircle2 },
    MEDIUM: { label: "Medium", color: "text-blue-600", bg: "bg-blue-100", icon: LifeBuoy },
    HIGH: { label: "High", color: "text-orange-600", bg: "bg-orange-100", icon: AlertTriangle },
    URGENT: { label: "Urgent", color: "text-red-600", bg: "bg-red-100", icon: XCircle },
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    "Refund": { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
    "Technical": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    "Billing": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    "Access": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
    "Certificate": { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
    "Course Content": { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
    "General": { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" },
};

const detectCategory = (subject: string): string => {
    const s = subject.toLowerCase();
    if (s.includes("refund") || s.includes("cancel") || s.includes("money back")) return "Refund";
    if (s.includes("access") || s.includes("login") || s.includes("password")) return "Access";
    if (s.includes("certificate") || s.includes("completion")) return "Certificate";
    if (s.includes("billing") || s.includes("payment") || s.includes("charge")) return "Billing";
    if (s.includes("module") || s.includes("lesson") || s.includes("course") || s.includes("video")) return "Course Content";
    if (s.includes("error") || s.includes("bug") || s.includes("broken")) return "Technical";
    return "General";
};

// SLA Badge
function SLABadge({ ticket }: { ticket: Ticket }) {
    const messages = ticket.messages || [];
    const lastMessage = messages[messages.length - 1];
    const lastCustomerMsg = [...messages].reverse().find(m => m.isFromCustomer);

    const now = new Date();
    const isAwaitingAgent = lastMessage?.isFromCustomer || !lastMessage;

    if (ticket.status === "RESOLVED" || ticket.status === "CLOSED") {
        return <Badge variant="outline" className="text-slate-500 border-slate-300">✓ Resolved</Badge>;
    }

    if (isAwaitingAgent && lastCustomerMsg) {
        const hours = differenceInHours(now, new Date(lastCustomerMsg.createdAt));
        const mins = differenceInMinutes(now, new Date(lastCustomerMsg.createdAt));

        if (hours >= 24) {
            return <Badge className="bg-red-500 text-white animate-pulse">⚠️ {hours}h waiting</Badge>;
        } else if (hours >= 4) {
            return <Badge className="bg-amber-500 text-white">{hours}h waiting</Badge>;
        } else {
            return <Badge className="bg-green-500 text-white">{mins < 60 ? `${mins}m` : `${hours}h`} waiting</Badge>;
        }
    }

    return <Badge variant="outline" className="text-blue-600 border-blue-300">Awaiting customer</Badge>;
}

// Message Bubble
function MessageBubble({ message, isExpanded, onToggle }: { message: any; isExpanded: boolean; onToggle: () => void }) {
    const isLong = message.content.length > 200;
    const displayContent = isExpanded || !isLong ? message.content : message.content.slice(0, 200) + "...";

    return (
        <div className={cn("group", message.isFromCustomer ? "mr-12" : "ml-12")}>
            {message.isInternal && (
                <div className="text-xs text-amber-600 mb-1 font-medium">🔒 Internal Note</div>
            )}

            <div className={cn(
                "p-4 rounded-2xl shadow-sm",
                message.isFromCustomer
                    ? "bg-slate-100 text-slate-800 rounded-tl-md"
                    : message.isInternal
                        ? "bg-amber-50 border-2 border-amber-200 text-amber-900 rounded-tr-md"
                        : "bg-gradient-to-br from-[#722F37] to-[#8B3D47] text-white rounded-tr-md"
            )}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{displayContent}</p>

                {isLong && (
                    <button
                        onClick={onToggle}
                        className={cn(
                            "mt-2 text-xs font-semibold underline underline-offset-2",
                            message.isFromCustomer ? "text-slate-600" : "text-white/90"
                        )}
                    >
                        {isExpanded ? "▲ Show less" : "▼ Read more"}
                    </button>
                )}
            </div>

            <div className={cn(
                "flex items-center gap-2 mt-1.5 text-[11px] text-slate-400",
                message.isFromCustomer ? "justify-start pl-1" : "justify-end pr-1"
            )}>
                <Calendar className="w-3 h-3" />
                <span>{format(new Date(message.createdAt), "MMM d, h:mm a")}</span>
                {message.sentBy && !message.isFromCustomer && (
                    <>
                        <span>•</span>
                        <span className="font-medium">{message.sentBy.firstName}</span>
                    </>
                )}
            </div>
        </div>
    );
}

// AI Triage Panel
function AITriagePanel({ ticketId, onClose }: { ticketId: string; onClose: () => void }) {
    const [triage, setTriage] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const runTriage = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/tickets/ai-triage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ticketId }),
            });
            const data = await res.json();
            if (data.triage) setTriage(data.triage);
        } catch {
            toast.error("AI analysis failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { runTriage(); }, [ticketId]);

    return (
        <div className="w-80 border-l bg-gradient-to-br from-purple-50 to-indigo-50 flex-shrink-0 p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    AI Analysis
                </h3>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
                    <X className="w-4 h-4" />
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                </div>
            ) : triage ? (
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{triage.sentimentEmoji}</span>
                        <div>
                            <div className="text-sm text-slate-500">Sentiment</div>
                            <div className="font-semibold capitalize">{triage.sentiment}</div>
                        </div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border">
                        <div className="text-xs text-slate-500 mb-1">Resolution Prediction</div>
                        <p className="text-sm font-medium">{triage.resolutionPrediction}</p>
                        <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500" style={{ width: `${triage.resolutionConfidence}%` }} />
                            </div>
                            <span className="text-xs font-mono text-slate-500">{triage.resolutionConfidence}%</span>
                        </div>
                    </div>

                    <div className="p-3 bg-purple-100 rounded-lg border border-purple-200">
                        <div className="text-xs text-purple-600 font-medium mb-1">💡 Suggested Action</div>
                        <p className="text-sm text-purple-900">{triage.suggestedAction}</p>
                    </div>
                </div>
            ) : (
                <button onClick={runTriage} className="w-full py-6 border-2 border-dashed border-purple-300 rounded-lg text-purple-600 hover:bg-purple-50">
                    Click to analyze with AI
                </button>
            )}
        </div>
    );
}

// MAIN SUPPORT PORTAL
export default function SupportPortalPage() {
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("NEW");
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");
    const [isInternalNote, setIsInternalNote] = useState(false);
    const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());
    const [showAIPanel, setShowAIPanel] = useState(false);
    const [showCustomerPanel, setShowCustomerPanel] = useState(true);
    const [customerContext, setCustomerContext] = useState<any>(null);
    const [loadingContext, setLoadingContext] = useState(false);
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const [showDigest, setShowDigest] = useState(true);
    const [digestData, setDigestData] = useState<any>(null);
    const [loadingDigest, setLoadingDigest] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { data, isLoading, refetch } = useTickets(statusFilter, "all", searchTerm);
    const updateTicket = useUpdateTicket();
    const replyTicket = useReplyTicket();
    const { data: ticketDetails, isLoading: isLoadingDetails } = useTicketDetails(selectedTicketId);

    const tickets = data?.tickets || [];
    const selectedTicket = useMemo(() => {
        if (ticketDetails && ticketDetails.id === selectedTicketId) return ticketDetails as Ticket;
        return tickets.find(t => t.id === selectedTicketId);
    }, [tickets, selectedTicketId, ticketDetails]);

    const stats = useMemo(() => ({
        new: tickets.filter(t => t.status === "NEW").length,
        open: tickets.filter(t => t.status === "OPEN" || t.status === "PENDING").length,
        urgent: tickets.filter(t => t.priority === "URGENT" || t.priority === "HIGH").length,
        total: tickets.length,
    }), [tickets]);

    useEffect(() => {
        if (!selectedTicketId && tickets.length > 0) setSelectedTicketId(tickets[0].id);
    }, [tickets, selectedTicketId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [selectedTicket?.messages]);

    const handleSendReply = async () => {
        if (!selectedTicketId || !replyText.trim()) return;
        try {
            await replyTicket.mutateAsync({
                ticketId: selectedTicketId,
                message: replyText,
                isInternal: isInternalNote
            });
            setReplyText("");
            setIsInternalNote(false);
            toast.success(isInternalNote ? "Note added" : "Reply sent");
        } catch {
            toast.error("Failed to send");
        }
    };

    const handleAIReply = async () => {
        if (!selectedTicketId) return;
        setIsGeneratingAI(true);
        try {
            const res = await fetch("/api/tickets/ai-reply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ticketId: selectedTicketId }),
            });
            const data = await res.json();
            if (data.reply) setReplyText(prev => prev ? prev + "\n\n" + data.reply : data.reply);
        } catch {
            toast.error("AI generation failed");
        } finally {
            setIsGeneratingAI(false);
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedMessages(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    // Fetch customer context (tags + courses)
    const fetchCustomerContext = async (userId: string) => {
        if (customerContext?.userId === userId) return;
        setLoadingContext(true);
        try {
            const res = await fetch(`/api/admin/users/${userId}`);
            const data = await res.json();
            setCustomerContext({
                userId,
                tags: data.user?.tags || [],
                enrollments: data.user?.enrollments || [],
                createdAt: data.user?.createdAt,
            });
        } catch {
            toast.error("Failed to load customer context");
        } finally {
            setLoadingContext(false);
        }
    };

    useEffect(() => {
        if (showCustomerPanel && selectedTicket?.user?.id) {
            fetchCustomerContext(selectedTicket.user.id);
        }
    }, [showCustomerPanel, selectedTicket?.user?.id]);

    // Fetch AI Digest on mount
    useEffect(() => {
        const fetchDigest = async () => {
            setLoadingDigest(true);
            try {
                const res = await fetch('/api/tickets/ai-digest');
                const data = await res.json();
                if (data.success) setDigestData(data);
            } catch {
                console.error('Failed to fetch AI digest');
            } finally {
                setLoadingDigest(false);
            }
        };
        fetchDigest();
    }, []);

    return (
        <div className="flex h-screen bg-slate-100 overflow-hidden">
            {/* LEFT: Ticket List */}
            <div className="w-[380px] min-w-[380px] bg-white border-r flex flex-col shadow-lg">
                {/* ASI Header */}
                <div className="p-4 bg-gradient-to-r from-[#722F37] to-[#8B3D47] text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Link href="/admin" className="hover:opacity-80 transition-opacity">
                                <img src={ASI.logo} alt="ASI" className="w-10 h-10 rounded-lg bg-white p-1" />
                            </Link>
                            <div>
                                <Link href="/admin" className="hover:underline">
                                    <h1 className="text-lg font-bold">{ASI.name}</h1>
                                </Link>
                                <p className="text-xs text-white/70">{ASI.division}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link href="/admin">
                                <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 text-xs gap-1">
                                    ← Admin
                                </Button>
                            </Link>
                            <Button variant="ghost" size="icon" onClick={() => refetch()} className="text-white/80 hover:text-white hover:bg-white/10">
                                <RefreshCcw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => signOut()} className="text-white/80 hover:text-white hover:bg-white/10">
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-2 text-center">
                        {[
                            { label: "New", value: stats.new, color: "bg-blue-400" },
                            { label: "Open", value: stats.open, color: "bg-emerald-400" },
                            { label: "Urgent", value: stats.urgent, color: "bg-red-400" },
                            { label: "Total", value: stats.total, color: "bg-slate-400" },
                        ].map(s => (
                            <div key={s.label}>
                                <div className="text-2xl font-bold">{s.value}</div>
                                <div className="text-[10px] uppercase text-white/70">{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* AI Daily Digest Widget */}
                    {showDigest && (
                        <div className="mt-3 bg-white/10 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 text-white/90">
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="text-xs font-semibold">AI Insights</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowDigest(false)}
                                    className="w-5 h-5 text-white/60 hover:text-white hover:bg-white/10"
                                >
                                    <ChevronUp className="w-3 h-3" />
                                </Button>
                            </div>
                            {loadingDigest ? (
                                <div className="flex items-center gap-2 text-xs text-white/60">
                                    <Loader2 className="w-3 h-3 animate-spin" /> Loading insights...
                                </div>
                            ) : digestData ? (
                                <div className="space-y-2 text-xs">
                                    {digestData.overdue24h?.length > 0 && (
                                        <div className="flex items-center gap-2 text-red-300">
                                            <AlertCircle className="w-3 h-3" />
                                            <span><strong>{digestData.overdue24h.length}</strong> waiting &gt;24h</span>
                                        </div>
                                    )}
                                    {digestData.overdue4h?.length > 0 && (
                                        <div className="flex items-center gap-2 text-amber-300">
                                            <Clock className="w-3 h-3" />
                                            <span><strong>{digestData.overdue4h.length}</strong> waiting &gt;4h</span>
                                        </div>
                                    )}
                                    {digestData.topCategories?.slice(0, 2).map(([cat, count]: [string, number]) => (
                                        <div key={cat} className="flex items-center gap-2 text-white/70">
                                            <TagIcon className="w-3 h-3" />
                                            <span>{cat} ({count})</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-xs text-white/60">No insights available</div>
                            )}
                        </div>
                    )}
                    {!showDigest && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowDigest(true)}
                            className="mt-2 w-full text-white/60 hover:text-white hover:bg-white/10 text-xs"
                        >
                            <TrendingUp className="w-3 h-3 mr-1" /> Show AI Insights
                        </Button>
                    )}
                </div>

                {/* Status Tabs */}
                <div className="border-b flex overflow-x-auto bg-slate-50">
                    {[
                        { id: "NEW", label: "New", icon: Circle },
                        { id: "OPEN", label: "Open", icon: MessageSquare },
                        { id: "PENDING", label: "Pending", icon: Clock },
                        { id: "RESOLVED", label: "Resolved", icon: CheckCheck },
                        { id: "all", label: "All", icon: Inbox },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setStatusFilter(tab.id)}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap",
                                statusFilter === tab.id
                                    ? "border-[#722F37] text-[#722F37] bg-white"
                                    : "border-transparent text-slate-500 hover:text-slate-700"
                            )}
                        >
                            <tab.icon className="w-3.5 h-3.5" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="p-3 border-b">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search tickets..."
                            className="pl-9 h-10"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Ticket List */}
                <ScrollArea className="flex-1">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 animate-spin text-[#722F37]" />
                        </div>
                    ) : tickets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                            <Inbox className="w-12 h-12 mb-3" />
                            <p>No tickets found</p>
                        </div>
                    ) : (
                        tickets.map(ticket => {
                            const category = detectCategory(ticket.subject);
                            const categoryStyle = CATEGORY_COLORS[category] || CATEGORY_COLORS.General;
                            const statusConfig = STATUS_CONFIG[ticket.status];
                            const isSelected = selectedTicketId === ticket.id;
                            const isUrgent = ticket.priority === "URGENT" || ticket.priority === "HIGH";

                            return (
                                <div
                                    key={ticket.id}
                                    onClick={() => setSelectedTicketId(ticket.id)}
                                    className={cn(
                                        "px-4 py-3 border-b cursor-pointer transition-all hover:bg-slate-50",
                                        isSelected && "bg-[#722F37]/5 border-l-4 border-l-[#722F37]",
                                        isUrgent && !isSelected && "bg-red-50/50"
                                    )}
                                >
                                    {/* Name + Status Row */}
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="font-semibold text-base text-slate-900 truncate max-w-[200px]">
                                            {ticket.customerName}
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                            <span className={cn(
                                                "text-[10px] px-2 py-0.5 rounded font-medium",
                                                categoryStyle.bg, categoryStyle.text
                                            )}>
                                                {category}
                                            </span>
                                            <span className={cn("w-2.5 h-2.5 rounded-full", statusConfig.color)} title={statusConfig.label} />
                                        </div>
                                    </div>
                                    {/* Subject */}
                                    <p className="text-sm text-slate-700 line-clamp-1 mb-1.5 font-medium">{ticket.subject}</p>
                                    {/* Ticket # + Time */}
                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        <span className="font-mono">#{ticket.ticketNumber}</span>
                                        <span>{formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: false })}</span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </ScrollArea>
            </div>

            {/* CENTER + RIGHT: Conversation */}
            <div className="flex-1 flex flex-col bg-white min-w-0">
                {selectedTicket ? (
                    <>
                        {/* Header */}
                        <div className="px-6 py-4 border-b bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar className="w-12 h-12 border-2 border-[#722F37]/20">
                                    <AvatarImage src={selectedTicket.user?.avatar || undefined} />
                                    <AvatarFallback className="bg-[#722F37] text-white text-lg font-bold">
                                        {selectedTicket.customerName.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    {/* Customer Name - PROMINENT */}
                                    <h2 className="text-lg font-bold text-slate-900">{selectedTicket.customerName}</h2>
                                    {/* Email - Clear and readable */}
                                    <p className="text-sm text-slate-600 font-medium">{selectedTicket.customerEmail}</p>
                                    {/* Subject + Ticket # */}
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="font-mono text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">#{selectedTicket.ticketNumber}</span>
                                        <span className="text-sm text-slate-700 font-medium truncate max-w-[300px]">{selectedTicket.subject}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <SLABadge ticket={selectedTicket} />

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <span className={cn("w-2 h-2 rounded-full", STATUS_CONFIG[selectedTicket.status].color)} />
                                            {STATUS_CONFIG[selectedTicket.status].label}
                                            <ChevronDown className="w-3 h-3" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                                            <DropdownMenuItem key={key} onClick={() => updateTicket.mutate({ ticketId: selectedTicket.id, updates: { status: key as any } })}>
                                                <span className={cn("w-2 h-2 rounded-full mr-2", cfg.color)} />
                                                {cfg.label}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="gap-2">
                                            {(() => { const P = PRIORITY_CONFIG[selectedTicket.priority]; return <P.icon className={cn("w-4 h-4", P.color)} />; })()}
                                            <ChevronDown className="w-3 h-3" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
                                            <DropdownMenuItem key={key} onClick={() => updateTicket.mutate({ ticketId: selectedTicket.id, updates: { priority: key as any } })}>
                                                <cfg.icon className={cn("w-4 h-4 mr-2", cfg.color)} />
                                                {cfg.label}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <Button
                                    variant={showAIPanel ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setShowAIPanel(!showAIPanel)}
                                    className={showAIPanel ? "bg-purple-600 hover:bg-purple-700" : ""}
                                >
                                    <Brain className="w-4 h-4 mr-1" />
                                    AI
                                </Button>

                                <Button
                                    variant={showCustomerPanel ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setShowCustomerPanel(!showCustomerPanel)}
                                    className={showCustomerPanel ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                                >
                                    <UserCircle className="w-4 h-4 mr-1" />
                                    Customer
                                </Button>
                            </div>
                        </div>

                        {/* Timestamps */}
                        <div className="px-6 py-2 border-b bg-slate-50 flex items-center justify-between text-xs text-slate-500">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    Created {format(new Date(selectedTicket.createdAt), "MMM d, yyyy 'at' h:mm a")}
                                </span>
                                <span className="flex items-center gap-1">
                                    <RefreshCcw className="w-3 h-3" />
                                    Updated {formatDistanceToNow(new Date(selectedTicket.updatedAt), { addSuffix: true })}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="w-3 h-3" />
                                {selectedTicket.messages?.length || 0} messages
                            </div>
                        </div>

                        {/* Messages + AI Panel */}
                        <div className="flex-1 flex overflow-hidden">
                            <ScrollArea className="flex-1">
                                <div className="p-6 space-y-4 max-w-4xl mx-auto">
                                    {isLoadingDetails ? (
                                        <div className="flex items-center justify-center py-12">
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        </div>
                                    ) : (
                                        selectedTicket.messages?.map(msg => (
                                            <MessageBubble
                                                key={msg.id}
                                                message={msg}
                                                isExpanded={expandedMessages.has(msg.id)}
                                                onToggle={() => toggleExpand(msg.id)}
                                            />
                                        ))
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            </ScrollArea>

                            {showAIPanel && (
                                <AITriagePanel ticketId={selectedTicket.id} onClose={() => setShowAIPanel(false)} />
                            )}

                            {showCustomerPanel && (
                                <div className="w-80 border-l bg-gradient-to-br from-emerald-50 to-teal-50 flex-shrink-0 overflow-y-auto">
                                    <div className="p-4">
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                                <UserCircle className="w-5 h-5 text-emerald-600" />
                                                Customer Info
                                            </h3>
                                            <Button variant="ghost" size="icon" onClick={() => setShowCustomerPanel(false)} className="h-7 w-7">
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        {/* Customer Basic Info */}
                                        <div className="bg-white rounded-lg p-3 border border-emerald-200 mb-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Avatar className="w-10 h-10">
                                                    <AvatarImage src={selectedTicket.user?.avatar || undefined} />
                                                    <AvatarFallback className="bg-emerald-100 text-emerald-700 text-sm font-bold">
                                                        {selectedTicket.customerName.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-semibold text-slate-800">{selectedTicket.customerName}</div>
                                                    <div className="text-xs text-slate-500">{selectedTicket.customerEmail}</div>
                                                </div>
                                            </div>
                                            {selectedTicket.user?.createdAt && (
                                                <div className="text-xs text-slate-400">
                                                    Member since {format(new Date(selectedTicket.user.createdAt), "MMM d, yyyy")}
                                                </div>
                                            )}
                                        </div>

                                        {/* Quick Stats */}
                                        <div className="grid grid-cols-2 gap-2 mb-4">
                                            <div className="bg-white rounded-lg p-2 border border-emerald-200 text-center">
                                                <div className="text-lg font-bold text-emerald-600">
                                                    {selectedTicket.user?.payments?.length || 0}
                                                </div>
                                                <div className="text-[10px] text-slate-500">Payments</div>
                                            </div>
                                            <div className="bg-white rounded-lg p-2 border border-emerald-200 text-center">
                                                <div className="text-lg font-bold text-blue-600">
                                                    {selectedTicket.user?.submittedTickets?.length || 0}
                                                </div>
                                                <div className="text-[10px] text-slate-500">Tickets</div>
                                            </div>
                                        </div>

                                        {/* Marketing Tags */}
                                        <div className="mb-4">
                                            <div className="text-xs font-semibold text-slate-600 mb-2 flex items-center justify-between">
                                                <span className="flex items-center gap-1">
                                                    <TagIcon className="w-3 h-3" />
                                                    Marketing Tags
                                                </span>
                                                <Button variant="ghost" size="sm" className="h-5 px-2 text-[10px] text-emerald-600 hover:text-emerald-700"
                                                    onClick={() => selectedTicket.user?.id && window.open(`/admin/users?user=${selectedTicket.user.id}`, '_blank')}>
                                                    <Plus className="w-3 h-3 mr-1" /> Add
                                                </Button>
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {selectedTicket.user?.tags && selectedTicket.user.tags.length > 0 ? (
                                                    selectedTicket.user.tags.map((t: { id: string; tag: string }, i: number) => (
                                                        <span key={t.id || i} className="text-[10px] px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                            {t.tag.replace(/_/g, ' ').replace(/-/g, ' ')}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-slate-400">No tags</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Recent Payments */}
                                        <div className="mb-4">
                                            <div className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1">
                                                <GraduationCap className="w-3 h-3" />
                                                Recent Payments
                                            </div>
                                            <div className="space-y-1">
                                                {selectedTicket.user?.payments && selectedTicket.user.payments.length > 0 ? (
                                                    selectedTicket.user.payments.slice(0, 3).map((p: any) => (
                                                        <div key={p.id} className="text-xs p-2 rounded bg-white border border-emerald-200">
                                                            <div className="flex justify-between">
                                                                <span className="font-medium text-slate-800">{p.productName || 'Unknown'}</span>
                                                                <span className="text-emerald-600 font-bold">${Number(p.amount).toFixed(0)}</span>
                                                            </div>
                                                            <div className="text-slate-400">{format(new Date(p.createdAt), "MMM d, yyyy")}</div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-slate-400">No payments</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Previous Tickets */}
                                        <div className="mb-4">
                                            <div className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1">
                                                <LifeBuoy className="w-3 h-3" />
                                                Previous Tickets
                                            </div>
                                            <div className="space-y-1">
                                                {selectedTicket.user?.submittedTickets && selectedTicket.user.submittedTickets.length > 1 ? (
                                                    selectedTicket.user.submittedTickets
                                                        .filter((t: any) => t.id !== selectedTicket.id)
                                                        .slice(0, 3)
                                                        .map((t: any) => (
                                                            <div key={t.id} className="text-xs p-2 rounded bg-white border border-emerald-200 cursor-pointer hover:bg-emerald-50"
                                                                onClick={() => setSelectedTicketId(t.id)}>
                                                                <div className="font-medium text-slate-800 truncate">#{t.ticketNumber}: {t.subject}</div>
                                                                <div className="flex justify-between text-slate-400">
                                                                    <span className={t.status === 'RESOLVED' ? 'text-emerald-500' : 'text-amber-500'}>{t.status}</span>
                                                                    <span>{format(new Date(t.createdAt), "MMM d")}</span>
                                                                </div>
                                                            </div>
                                                        ))
                                                ) : (
                                                    <span className="text-xs text-slate-400">First ticket</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="space-y-2">
                                            <div className="text-xs font-semibold text-slate-600 mb-1">Quick Actions</div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full text-xs justify-start"
                                                onClick={() => selectedTicket.user?.id && window.open(`/admin/users?user=${selectedTicket.user.id}`, '_blank')}
                                            >
                                                <User className="w-3 h-3 mr-2" /> View Full Profile
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full text-xs justify-start"
                                                onClick={() => selectedTicket.customerEmail && window.open(`mailto:${selectedTicket.customerEmail}`, '_blank')}
                                            >
                                                <Mail className="w-3 h-3 mr-2" /> Send Email
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Reply Composer */}
                        <div className="border-t p-4 bg-white">
                            <div className="max-w-4xl mx-auto">
                                <div className="flex items-center gap-2 mb-3">
                                    <Button
                                        variant={isInternalNote ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setIsInternalNote(!isInternalNote)}
                                        className={isInternalNote ? "bg-amber-500 hover:bg-amber-600" : ""}
                                    >
                                        {isInternalNote ? "🔒 Internal" : "📧 Public"}
                                    </Button>

                                    <Button variant="outline" size="sm" onClick={handleAIReply} disabled={isGeneratingAI}>
                                        {isGeneratingAI ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Sparkles className="w-4 h-4 mr-1" />}
                                        AI Draft
                                    </Button>
                                </div>

                                <div className="flex gap-3">
                                    <Textarea
                                        value={replyText}
                                        onChange={e => setReplyText(e.target.value)}
                                        placeholder={isInternalNote ? "Add internal note..." : "Type your reply..."}
                                        className="flex-1 min-h-[100px] resize-none"
                                        onKeyDown={e => { if (e.key === "Enter" && e.metaKey) handleSendReply(); }}
                                    />
                                    <Button
                                        onClick={handleSendReply}
                                        disabled={!replyText.trim() || replyTicket.isPending}
                                        className="bg-[#722F37] hover:bg-[#5A252C] self-end px-6"
                                    >
                                        {replyTicket.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    </Button>
                                </div>
                                <div className="text-xs text-slate-400 mt-2">⌘ + Enter to send</div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-400">
                        <div className="text-center">
                            <LifeBuoy className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg">Select a ticket to view</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
