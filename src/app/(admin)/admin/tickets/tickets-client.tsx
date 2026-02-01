"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTickets, Ticket, useUpdateTicket, useReplyTicket, useTicketDetails } from "@/hooks/use-tickets";
import { formatDistanceToNow, format, differenceInHours, differenceInMinutes } from "date-fns";
import {
  Search, RefreshCcw, CheckCircle2, XCircle, AlertTriangle,
  MessageSquare, User, Clock, Zap, Send, ChevronDown, ChevronRight,
  MoreHorizontal, Mail, LifeBuoy, Sparkles, Trash2, UserPlus,
  DollarSign, CreditCard, Copy, ExternalLink, Tag as TagIcon, Plus, X,
  Inbox, CheckCheck, Archive, Filter, SlidersHorizontal, Star,
  AlertCircle, Circle, Phone, Globe, Calendar, Hash, BookOpen, GraduationCap,
  Pencil, Save, Loader2, Wrench, Paperclip, Brain, PanelRightClose, PanelRightOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// ASI Branding
const ASI = {
  name: "AccrediPro Standards Institute",
  division: "Student Success Division",
};

// Department Signatures
const DEPARTMENT_SIGNATURES: Record<string, { name: string; tagline: string }> = {
  SUPPORT: { name: "Student Success Team", tagline: "Here to help you succeed" },
  BILLING: { name: "Billing & Accounts Team", tagline: "Managing your account with care" },
  LEGAL: { name: "Compliance & Legal Team", tagline: "Ensuring your protection" },
  ACADEMIC: { name: "Academic Excellence Team", tagline: "Supporting your learning journey" },
  CREDENTIALING: { name: "Credentialing & Certification Team", tagline: "Your credentials, our priority" },
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

// Detect category from subject
const detectCategory = (subject: string): string => {
  const s = subject.toLowerCase();
  if (s.includes("refund") || s.includes("cancel") || s.includes("money back")) return "Refund";
  if (s.includes("access") || s.includes("login") || s.includes("password")) return "Access";
  if (s.includes("certificate") || s.includes("completion")) return "Certificate";
  if (s.includes("billing") || s.includes("payment") || s.includes("charge")) return "Billing";
  if (s.includes("module") || s.includes("lesson") || s.includes("course") || s.includes("video")) return "Course Content";
  if (s.includes("error") || s.includes("bug") || s.includes("broken") || s.includes("issue")) return "Technical";
  return "General";
};

// SLA Indicator - Zendesk style
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
      return <Badge className="bg-green-500 text-white">{mins}m waiting</Badge>;
    }
  }

  return <Badge variant="outline" className="text-blue-600 border-blue-300">Awaiting customer</Badge>;
}

// Message Bubble with expand/collapse
function MessageBubble({
  message,
  isExpanded,
  onToggle
}: {
  message: any;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const isLong = message.content.length > 200;
  const displayContent = isExpanded || !isLong
    ? message.content
    : message.content.slice(0, 200) + "...";

  return (
    <div className={cn("group", message.isFromCustomer ? "mr-8" : "ml-8")}>
      {message.isInternal && (
        <div className="text-xs text-amber-600 mb-1 font-medium flex items-center gap-1">
          🔒 Internal Note
        </div>
      )}

      <div className={cn(
        "p-4 rounded-2xl shadow-sm transition-all",
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
              "mt-2 text-xs font-semibold underline underline-offset-2 hover:no-underline",
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
    <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border-l">
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
            <div className="text-xs text-slate-500 mb-1">Likely Resolution</div>
            <p className="text-sm font-medium">{triage.resolutionPrediction}</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 transition-all"
                  style={{ width: `${triage.resolutionConfidence}%` }}
                />
              </div>
              <span className="text-xs font-mono text-slate-500">{triage.resolutionConfidence}%</span>
            </div>
          </div>

          <div className="p-3 bg-purple-100 rounded-lg border border-purple-200">
            <div className="text-xs text-purple-600 font-medium mb-1">💡 Suggested Action</div>
            <p className="text-sm text-purple-900">{triage.suggestedAction}</p>
          </div>

          {triage.keyIssues?.length > 0 && (
            <div>
              <div className="text-xs text-slate-500 mb-2">Key Issues</div>
              <div className="flex flex-wrap gap-1">
                {triage.keyIssues.map((issue: string, i: number) => (
                  <Badge key={i} variant="outline" className="text-xs">{issue}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={runTriage}
          className="w-full py-6 border-2 border-dashed border-purple-300 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors"
        >
          Click to analyze with AI
        </button>
      )}
    </div>
  );
}

// Tag Autocomplete
function TagAutocomplete({ userId, existingTags, onTagAdded }: any) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [allTags, setAllTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && allTags.length === 0) {
      fetch("/api/admin/marketing/tags")
        .then(r => r.json())
        .then(d => d.tags && setAllTags(d.tags));
    }
  }, [open, allTags.length]);

  const existingTagIds = new Set(existingTags?.map((t: any) => t.tag?.slug) || []);
  const filteredTags = allTags.filter(
    t => !existingTagIds.has(t.slug) && t.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddTag = async (slug: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag: slug })
      });
      if (res.ok) {
        toast.success("Tag added");
        onTagAdded();
        setOpen(false);
      }
    } catch {
      toast.error("Failed to add tag");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-6 text-xs gap-1">
          <Plus className="w-3 h-3" /> Tag
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="end">
        <Input
          placeholder="Search tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 mb-2"
          autoFocus
        />
        <div className="max-h-[150px] overflow-y-auto space-y-1">
          {filteredTags.slice(0, 8).map((tag) => (
            <button
              key={tag.id}
              onClick={() => handleAddTag(tag.slug)}
              disabled={loading}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-100 text-left text-sm"
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color || "#888" }} />
              <span className="flex-1 truncate">{tag.name}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// MAIN PAGE
export default function TicketsClient() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("OPEN"); // Default to OPEN tab
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, refetch } = useTickets(statusFilter, "all", searchTerm);
  const updateTicket = useUpdateTicket();
  const replyTicket = useReplyTicket();
  const { data: ticketDetails, isLoading: isLoadingDetails } = useTicketDetails(selectedTicketId);

  // Filter and sort tickets - OPEN = NEW+OPEN+PENDING, CLOSED = RESOLVED+CLOSED
  // Sort by most recent activity (newest at top)
  const allTickets = data?.tickets || [];
  const tickets = useMemo(() => {
    let filtered = allTickets;

    if (statusFilter === "OPEN") {
      filtered = allTickets.filter(t => ["NEW", "OPEN", "PENDING"].includes(t.status));
    } else if (statusFilter === "CLOSED") {
      filtered = allTickets.filter(t => ["RESOLVED", "CLOSED"].includes(t.status));
    }

    // Sort by most recent message/activity (newest first)
    return filtered.sort((a, b) => {
      const aDate = new Date(a.lastMessageAt || a.updatedAt).getTime();
      const bDate = new Date(b.lastMessageAt || b.updatedAt).getTime();
      return bDate - aDate; // Newest first
    });
  }, [allTickets, statusFilter]);

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
      // Auto-append department signature for public replies
      let finalMessage = replyText.trim();
      if (!isInternalNote && selectedTicket) {
        const sig = DEPARTMENT_SIGNATURES[selectedTicket.department] || DEPARTMENT_SIGNATURES.SUPPORT;
        finalMessage += `\n\n—\n${sig.name}\n${ASI.name}\n${sig.tagline}`;
      }

      await replyTicket.mutateAsync({
        ticketId: selectedTicketId,
        message: finalMessage,
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

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* LEFT: Ticket List */}
      <div className="w-[360px] min-w-[360px] bg-white border-r flex flex-col">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#722F37] to-[#8B3D47] text-white">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-bold flex items-center gap-2">
              <LifeBuoy className="w-5 h-5" />
              {ASI.division}
            </h1>
            <Button variant="ghost" size="icon" onClick={() => refetch()} className="text-white/80 hover:text-white hover:bg-white/10">
              <RefreshCcw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            </Button>
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
        </div>

        {/* Status Tabs - Simplified */}
        <div className="border-b flex bg-slate-50">
          {[
            { id: "OPEN", label: "Open", icon: Inbox, description: "Active tickets" },
            { id: "CLOSED", label: "Closed", icon: Archive, description: "Resolved" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                statusFilter === tab.id
                  ? "border-[#722F37] text-[#722F37] bg-white"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.id === "OPEN" && stats.new + stats.open > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-[#722F37] text-white rounded-full">
                  {stats.new + stats.open}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search tickets..."
              className="pl-9 h-9"
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

              const isNew = ticket.status === "NEW";

              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={cn(
                    "p-4 border-b cursor-pointer transition-all hover:bg-slate-50",
                    isSelected && "bg-[#722F37]/5 border-l-4 border-l-[#722F37]",
                    isNew && !isSelected && "bg-yellow-50 border-l-4 border-l-yellow-400", // NEW = highlighted
                    isUrgent && !isSelected && !isNew && "bg-red-50/50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10 flex-shrink-0">
                      <AvatarImage src={ticket.user?.avatar || undefined} />
                      <AvatarFallback className={cn(
                        "text-sm font-bold",
                        isUrgent ? "bg-red-100 text-red-700" : "bg-[#722F37]/10 text-[#722F37]"
                      )}>
                        {ticket.customerName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm text-slate-900 truncate">
                          {ticket.customerName}
                        </span>
                        <SLABadge ticket={ticket} />
                      </div>

                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono text-slate-400">#{ticket.ticketNumber}</span>
                        <span className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded border",
                          categoryStyle.bg, categoryStyle.text, categoryStyle.border
                        )}>
                          {category}
                        </span>
                        <span className={cn(
                          "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium",
                          statusConfig.bgLight, statusConfig.textColor
                        )}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", statusConfig.color)} />
                          {statusConfig.label}
                        </span>
                      </div>

                      <p className="text-sm font-medium text-slate-800 line-clamp-1">{ticket.subject}</p>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {ticket.messages?.[ticket.messages.length - 1]?.content || "No messages"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </ScrollArea>
      </div>

      {/* CENTER: Conversation (Full Width) */}
      <div className="flex-1 flex flex-col bg-white min-w-0">
        {selectedTicket ? (
          <>
            {/* Ticket Header */}
            <div className="px-6 py-4 border-b bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12 border-2 border-[#722F37]/20">
                  <AvatarImage src={selectedTicket.user?.avatar || undefined} />
                  <AvatarFallback className="bg-[#722F37] text-white text-lg font-bold">
                    {selectedTicket.customerName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedTicket.subject}</h2>
                  <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                    <span className="font-mono text-xs">#{selectedTicket.ticketNumber}</span>
                    <span>•</span>
                    <span>{selectedTicket.customerName}</span>
                    <span>•</span>
                    <span className="text-xs">{selectedTicket.customerEmail}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* SLA */}
                <SLABadge ticket={selectedTicket} />

                {/* Status */}
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
                      <DropdownMenuItem
                        key={key}
                        onClick={() => updateTicket.mutate({ ticketId: selectedTicket.id, updates: { status: key as any } })}
                      >
                        <span className={cn("w-2 h-2 rounded-full mr-2", cfg.color)} />
                        {cfg.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Priority */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      {(() => { const P = PRIORITY_CONFIG[selectedTicket.priority]; return <P.icon className={cn("w-4 h-4", P.color)} />; })()}
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
                      <DropdownMenuItem
                        key={key}
                        onClick={() => updateTicket.mutate({ ticketId: selectedTicket.id, updates: { priority: key as any } })}
                      >
                        <cfg.icon className={cn("w-4 h-4 mr-2", cfg.color)} />
                        {cfg.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* AI Panel Toggle */}
                <Button
                  variant={showAIPanel ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowAIPanel(!showAIPanel)}
                  className={showAIPanel ? "bg-purple-600 hover:bg-purple-700" : ""}
                >
                  <Brain className="w-4 h-4 mr-1" />
                  AI
                </Button>
              </div>
            </div>

            {/* Timestamps Bar */}
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
              {/* Messages */}
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

              {/* AI Panel Drawer */}
              {showAIPanel && (
                <div className="w-80 border-l bg-gradient-to-br from-purple-50 to-indigo-50 flex-shrink-0">
                  <AITriagePanel ticketId={selectedTicket.id} onClose={() => setShowAIPanel(false)} />
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

                  <div className="flex-1" />

                  {selectedTicket.user?.marketingTags && selectedTicket.user.marketingTags.length > 0 && (
                    <div className="flex items-center gap-1 mr-2">
                      {selectedTicket.user.marketingTags.slice(0, 3).map((mt: any, i: number) => (
                        <Badge key={i} variant="outline" className="text-[10px]" style={{ borderColor: mt.tag?.color }}>
                          {mt.tag?.name}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <TagAutocomplete
                    userId={selectedTicket.user?.id}
                    existingTags={selectedTicket.user?.marketingTags}
                    onTagAdded={() => refetch()}
                  />
                </div>

                <div className="flex gap-3">
                  <Textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder={isInternalNote ? "Add internal note..." : "Type your reply..."}
                    className="flex-1 min-h-[100px] resize-none"
                    onKeyDown={e => {
                      if (e.key === "Enter" && e.metaKey) handleSendReply();
                    }}
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
