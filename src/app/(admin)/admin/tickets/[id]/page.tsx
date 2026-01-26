"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { format, formatDistanceToNow, differenceInHours, differenceInMinutes } from "date-fns";
import {
    ArrowLeft, Send, Sparkles, Clock, CheckCircle2, AlertTriangle,
    LifeBuoy, User, Mail, Calendar, Hash, BookOpen, Tag as TagIcon,
    MessageSquare, CheckCheck, Archive, Circle, XCircle, Loader2,
    Brain, Zap, ChevronDown, MoreHorizontal, Trash2, RefreshCcw,
    GraduationCap, CreditCard, Wrench, AlertCircle, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ASI Branding
const ASI = {
    name: "AccrediPro Standards Institute",
    division: "Student Success Division",
    logo: "https://pub-bc3849663dc849e59aee2d3c517f51e1.r2.dev/fm-certification/Senza-titolo-Logo-1.png",
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

const DEPARTMENT_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
    SUPPORT: { label: "Student Success", icon: LifeBuoy, color: "text-emerald-700" },
    BILLING: { label: "Accounts & Billing", icon: CreditCard, color: "text-blue-700" },
    LEGAL: { label: "Legal & Consumer Affairs", icon: AlertCircle, color: "text-red-700" },
    ACADEMIC: { label: "Academic Affairs", icon: GraduationCap, color: "text-purple-700" },
    CREDENTIALING: { label: "Credentialing Board", icon: Star, color: "text-amber-700" },
    TECHNICAL: { label: "Technical Support", icon: Wrench, color: "text-cyan-700" },
};

interface Message {
    id: string;
    content: string;
    isFromCustomer: boolean;
    isInternal: boolean;
    createdAt: string;
    sentBy?: { firstName: string; avatar?: string };
}

interface Ticket {
    id: string;
    ticketNumber: number;
    subject: string;
    status: keyof typeof STATUS_CONFIG;
    priority: keyof typeof PRIORITY_CONFIG;
    department: keyof typeof DEPARTMENT_CONFIG;
    customerName: string;
    customerEmail: string;
    createdAt: string;
    updatedAt: string;
    messages: Message[];
    user?: {
        id: string;
        avatar?: string;
        enrollments?: { course?: { title: string } }[];
        marketingTags?: { tag: { name: string; slug: string; color: string } }[];
    };
}

interface TriageResult {
    sentiment: string;
    sentimentEmoji: string;
    category: string;
    suggestedPriority: string;
    resolutionPrediction: string;
    resolutionConfidence: number;
    suggestedDepartment: string;
    suggestedAction: string;
    keyIssues: string[];
}

// SLA Indicator component
function SLAIndicator({ ticket }: { ticket: Ticket }) {
    const lastMessage = ticket.messages[ticket.messages.length - 1];
    const lastCustomerMessage = [...ticket.messages].reverse().find(m => m.isFromCustomer);
    const lastAgentMessage = [...ticket.messages].reverse().find(m => !m.isFromCustomer && !m.isInternal);

    const now = new Date();

    // Determine who needs to respond
    const isAwaitingAgent = lastMessage?.isFromCustomer || !lastMessage;

    if (ticket.status === "RESOLVED" || ticket.status === "CLOSED") {
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
                <CheckCheck className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-600">Resolved</span>
            </div>
        );
    }

    if (isAwaitingAgent && lastCustomerMessage) {
        const waitTime = differenceInHours(now, new Date(lastCustomerMessage.createdAt));
        const waitMinutes = differenceInMinutes(now, new Date(lastCustomerMessage.createdAt));

        let urgency = "bg-green-100 text-green-700";
        let label = `Awaiting reply ${waitMinutes}m`;

        if (waitTime >= 24) {
            urgency = "bg-red-100 text-red-700";
            label = `⚠️ Awaiting reply ${waitTime}h`;
        } else if (waitTime >= 4) {
            urgency = "bg-amber-100 text-amber-700";
            label = `Awaiting reply ${waitTime}h`;
        } else if (waitMinutes >= 60) {
            label = `Awaiting reply ${waitTime}h`;
        }

        return (
            <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full font-medium text-sm", urgency)}>
                <Clock className="w-4 h-4" />
                <span>{label}</span>
            </div>
        );
    }

    if (lastAgentMessage) {
        const waitTime = differenceInMinutes(now, new Date(lastAgentMessage.createdAt));
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm">
                <MessageSquare className="w-4 h-4" />
                <span>Waiting for customer ({waitTime < 60 ? `${waitTime}m` : `${Math.floor(waitTime / 60)}h`})</span>
            </div>
        );
    }

    return null;
}

// Message component with expandable content
function MessageBubble({ message, isExpanded, onToggle }: {
    message: Message;
    isExpanded: boolean;
    onToggle: () => void;
}) {
    const isLong = message.content.length > 300;
    const displayContent = isExpanded || !isLong
        ? message.content
        : message.content.slice(0, 300) + "...";

    return (
        <div className={cn(
            "group relative",
            message.isFromCustomer ? "mr-16" : "ml-16"
        )}>
            {message.isInternal && (
                <div className="text-xs text-amber-600 mb-1 font-medium">🔒 Internal Note</div>
            )}

            <div className={cn(
                "p-4 rounded-2xl",
                message.isFromCustomer
                    ? "bg-slate-100 text-slate-800 rounded-tl-sm"
                    : message.isInternal
                        ? "bg-amber-50 border border-amber-200 text-amber-900 rounded-tr-sm"
                        : "bg-gradient-to-br from-[#722F37] to-[#8B3D47] text-white rounded-tr-sm"
            )}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{displayContent}</p>

                {isLong && (
                    <button
                        onClick={onToggle}
                        className={cn(
                            "mt-2 text-xs font-medium underline underline-offset-2",
                            message.isFromCustomer ? "text-slate-500" : "text-white/80"
                        )}
                    >
                        {isExpanded ? "Show less" : "Show more"}
                    </button>
                )}
            </div>

            {/* Timestamp */}
            <div className={cn(
                "flex items-center gap-2 mt-1 text-xs text-slate-400",
                message.isFromCustomer ? "justify-start" : "justify-end"
            )}>
                <span>{format(new Date(message.createdAt), "MMM d, h:mm a")}</span>
                {message.sentBy && !message.isFromCustomer && (
                    <span>• {message.sentBy.firstName}</span>
                )}
            </div>
        </div>
    );
}

export default function TicketDetailPage() {
    const params = useParams();
    const router = useRouter();
    const ticketId = params.id as string;

    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState("");
    const [isInternal, setIsInternal] = useState(false);
    const [sending, setSending] = useState(false);
    const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());

    // AI Triage
    const [triage, setTriage] = useState<TriageResult | null>(null);
    const [triageLoading, setTriageLoading] = useState(false);
    const [aiReplyLoading, setAiReplyLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch ticket
    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const res = await fetch(`/api/admin/tickets/${ticketId}`);
                if (res.ok) {
                    const data = await res.json();
                    setTicket(data.ticket);
                } else {
                    toast.error("Ticket not found");
                    router.push("/admin/tickets");
                }
            } catch {
                toast.error("Failed to load ticket");
            } finally {
                setLoading(false);
            }
        };

        if (ticketId) fetchTicket();
    }, [ticketId, router]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [ticket?.messages]);

    // AI Triage
    const runTriage = async () => {
        setTriageLoading(true);
        try {
            const res = await fetch("/api/tickets/ai-triage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ticketId }),
            });
            const data = await res.json();
            if (data.triage) {
                setTriage(data.triage);
                toast.success("AI analysis complete");
            }
        } catch {
            toast.error("Failed to analyze ticket");
        } finally {
            setTriageLoading(false);
        }
    };

    // AI Draft Reply
    const generateAIReply = async () => {
        setAiReplyLoading(true);
        try {
            const res = await fetch("/api/tickets/ai-reply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ticketId }),
            });
            const data = await res.json();
            if (data.reply) {
                setReplyText(prev => prev ? prev + "\n\n" + data.reply : data.reply);
                toast.success("AI draft added");
            }
        } catch {
            toast.error("Failed to generate reply");
        } finally {
            setAiReplyLoading(false);
        }
    };

    // Send reply
    const handleSendReply = async () => {
        if (!replyText.trim()) return;

        setSending(true);
        try {
            const res = await fetch(`/api/admin/tickets/${ticketId}/reply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: replyText, isInternal }),
            });

            if (res.ok) {
                const data = await res.json();
                setTicket(data.ticket);
                setReplyText("");
                setIsInternal(false);
                toast.success("Reply sent");
            } else {
                toast.error("Failed to send reply");
            }
        } catch {
            toast.error("Failed to send reply");
        } finally {
            setSending(false);
        }
    };

    // Update status
    const updateStatus = async (status: string) => {
        try {
            const res = await fetch(`/api/admin/tickets/${ticketId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                const data = await res.json();
                setTicket(data.ticket);
                toast.success(`Status updated to ${STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.label}`);
            }
        } catch {
            toast.error("Failed to update status");
        }
    };

    // Update priority
    const updatePriority = async (priority: string) => {
        try {
            const res = await fetch(`/api/admin/tickets/${ticketId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ priority }),
            });
            if (res.ok) {
                const data = await res.json();
                setTicket(data.ticket);
                toast.success(`Priority updated`);
            }
        } catch {
            toast.error("Failed to update priority");
        }
    };

    const toggleExpanded = (messageId: string) => {
        setExpandedMessages(prev => {
            const next = new Set(prev);
            if (next.has(messageId)) {
                next.delete(messageId);
            } else {
                next.add(messageId);
            }
            return next;
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-[#722F37]" />
            </div>
        );
    }

    if (!ticket) {
        return null;
    }

    const statusConfig = STATUS_CONFIG[ticket.status];
    const priorityConfig = PRIORITY_CONFIG[ticket.priority];
    const deptConfig = DEPARTMENT_CONFIG[ticket.department] || DEPARTMENT_CONFIG.SUPPORT;

    return (
        <div className="flex flex-col h-screen bg-slate-50">
            {/* ASI Header */}
            <div className="bg-gradient-to-r from-[#722F37] to-[#8B3D47] text-white px-6 py-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push("/admin/tickets")}
                            className="text-white/80 hover:text-white hover:bg-white/10"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>

                        <div className="flex items-center gap-3">
                            <img src={ASI.logo} alt="ASI" className="w-10 h-10 rounded-lg bg-white p-1" />
                            <div>
                                <h1 className="text-lg font-bold">{ASI.name}</h1>
                                <p className="text-xs text-white/70">{deptConfig.label}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* SLA Indicator */}
                        <SLAIndicator ticket={ticket} />

                        {/* Status Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="gap-2 text-white hover:bg-white/10">
                                    <span className={cn("w-2 h-2 rounded-full", statusConfig.color)} />
                                    {statusConfig.label}
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                    <DropdownMenuItem key={key} onClick={() => updateStatus(key)}>
                                        <span className={cn("w-2 h-2 rounded-full mr-2", config.color)} />
                                        {config.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Priority Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="gap-2 text-white hover:bg-white/10">
                                    <priorityConfig.icon className="w-4 h-4" />
                                    {priorityConfig.label}
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                                    <DropdownMenuItem key={key} onClick={() => updatePriority(key)}>
                                        <config.icon className={cn("w-4 h-4 mr-2", config.color)} />
                                        {config.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Conversation Panel */}
                <div className="flex-1 flex flex-col bg-white">
                    {/* Ticket Info Bar */}
                    <div className="px-6 py-3 border-b bg-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar className="w-10 h-10 border-2 border-[#722F37]/20">
                                <AvatarImage src={ticket.user?.avatar} />
                                <AvatarFallback className="bg-[#722F37] text-white font-bold">
                                    {ticket.customerName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-slate-900">{ticket.customerName}</span>
                                    <span className="text-xs text-slate-400 font-mono">#{ticket.ticketNumber}</span>
                                </div>
                                <div className="text-xs text-slate-500">{ticket.customerEmail}</div>
                            </div>
                        </div>

                        {/* Timestamps */}
                        <div className="text-right text-xs text-slate-500">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-3 h-3" />
                                Created {format(new Date(ticket.createdAt), "MMM d, yyyy 'at' h:mm a")}
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                                <RefreshCcw className="w-3 h-3" />
                                Updated {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
                            </div>
                        </div>
                    </div>

                    {/* Subject */}
                    <div className="px-6 py-3 border-b">
                        <h2 className="text-lg font-semibold text-slate-900">{ticket.subject}</h2>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-6">
                        <div className="max-w-3xl mx-auto space-y-6">
                            {ticket.messages.map((message) => (
                                <MessageBubble
                                    key={message.id}
                                    message={message}
                                    isExpanded={expandedMessages.has(message.id)}
                                    onToggle={() => toggleExpanded(message.id)}
                                />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </ScrollArea>

                    {/* Reply Composer */}
                    <div className="border-t p-4 bg-white">
                        <div className="max-w-3xl mx-auto">
                            <div className="flex items-center gap-2 mb-3">
                                <Button
                                    variant={isInternal ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setIsInternal(!isInternal)}
                                    className={isInternal ? "bg-amber-500 hover:bg-amber-600" : ""}
                                >
                                    {isInternal ? "🔒 Internal Note" : "📧 Public Reply"}
                                </Button>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={generateAIReply}
                                    disabled={aiReplyLoading}
                                >
                                    {aiReplyLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    ) : (
                                        <Sparkles className="w-4 h-4 mr-2" />
                                    )}
                                    AI Draft
                                </Button>
                            </div>

                            <Textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder={isInternal ? "Add internal note..." : "Type your reply..."}
                                className="min-h-[120px] resize-none"
                            />

                            <div className="flex justify-end mt-3">
                                <Button
                                    onClick={handleSendReply}
                                    disabled={!replyText.trim() || sending}
                                    className="bg-[#722F37] hover:bg-[#5A252C]"
                                >
                                    {sending ? (
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    ) : (
                                        <Send className="w-4 h-4 mr-2" />
                                    )}
                                    {isInternal ? "Add Note" : "Send Reply"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - AI Triage & Customer Info */}
                <div className="w-80 border-l bg-slate-50 flex flex-col overflow-hidden">
                    {/* AI Triage Section */}
                    <div className="p-4 border-b bg-white">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                <Brain className="w-4 h-4 text-purple-600" />
                                AI Analysis
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={runTriage}
                                disabled={triageLoading}
                            >
                                {triageLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Zap className="w-4 h-4" />
                                )}
                            </Button>
                        </div>

                        {triage ? (
                            <div className="space-y-3">
                                {/* Sentiment */}
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-500">Sentiment</span>
                                    <span className="text-lg">{triage.sentimentEmoji} {triage.sentiment}</span>
                                </div>

                                {/* Resolution */}
                                <div>
                                    <span className="text-xs text-slate-500">Likely Resolution</span>
                                    <p className="text-sm font-medium text-slate-800">{triage.resolutionPrediction}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-green-500"
                                                style={{ width: `${triage.resolutionConfidence}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-slate-500">{triage.resolutionConfidence}%</span>
                                    </div>
                                </div>

                                {/* Suggested Action */}
                                <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                                    <span className="text-xs text-purple-600 font-medium">Suggested Action</span>
                                    <p className="text-sm text-purple-900 mt-1">{triage.suggestedAction}</p>
                                </div>

                                {/* Key Issues */}
                                {triage.keyIssues.length > 0 && (
                                    <div>
                                        <span className="text-xs text-slate-500">Key Issues</span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {triage.keyIssues.map((issue, i) => (
                                                <Badge key={i} variant="outline" className="text-xs">
                                                    {issue}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={runTriage}
                                disabled={triageLoading}
                                className="w-full py-4 border-2 border-dashed border-slate-200 rounded-lg text-sm text-slate-500 hover:border-purple-300 hover:text-purple-600 transition-colors"
                            >
                                {triageLoading ? "Analyzing..." : "Click to analyze with AI"}
                            </button>
                        )}
                    </div>

                    {/* Customer Info */}
                    <ScrollArea className="flex-1">
                        <div className="p-4 space-y-4">
                            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Customer Details
                            </h3>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    {ticket.customerEmail}
                                </div>

                                {ticket.user?.enrollments && ticket.user.enrollments.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 text-slate-600 mb-1">
                                            <BookOpen className="w-4 h-4 text-slate-400" />
                                            Enrolled Courses
                                        </div>
                                        <div className="ml-6 space-y-1">
                                            {ticket.user.enrollments.slice(0, 5).map((e, i) => (
                                                <div key={i} className="text-xs text-slate-500">
                                                    • {e.course?.title || "Unknown Course"}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {ticket.user?.marketingTags && ticket.user.marketingTags.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 text-slate-600 mb-1">
                                            <TagIcon className="w-4 h-4 text-slate-400" />
                                            Tags
                                        </div>
                                        <div className="flex flex-wrap gap-1 ml-6">
                                            {ticket.user.marketingTags.slice(0, 10).map((mt, i) => (
                                                <Badge
                                                    key={i}
                                                    variant="outline"
                                                    className="text-[10px]"
                                                    style={{ borderColor: mt.tag?.color }}
                                                >
                                                    {mt.tag?.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}
