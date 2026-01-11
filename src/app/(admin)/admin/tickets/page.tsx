"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useTickets, Ticket, useUpdateTicket, useReplyTicket } from "@/hooks/use-tickets";
import { formatDistanceToNow, format } from "date-fns";
import {
  Search, RefreshCcw, CheckCircle2, XCircle, AlertTriangle,
  MessageSquare, User, Clock, Zap, Send, ChevronDown, ChevronRight,
  MoreHorizontal, Mail, LifeBuoy, Sparkles, Trash2, UserPlus,
  DollarSign, CreditCard, Copy, ExternalLink, Tag as TagIcon, Plus, X,
  Inbox, CheckCheck, Archive, Filter, SlidersHorizontal, Star,
  AlertCircle, Circle, Phone, Globe, Calendar, Hash, BookOpen, GraduationCap,
  Pencil, Save, Loader2, Wrench, Paperclip, Image as ImageIcon
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

// Brand colors
const BRAND = {
  burgundy: "#722F37",
  burgundyLight: "#8B3D47",
  burgundyDark: "#5A252C",
  gold: "#D4AF37",
  goldLight: "#E8C656",
};

// Category colors for visual identification
const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Refund": { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  "Technical": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  "Billing": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  "Access": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  "Certificate": { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  "Course Content": { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  "General": { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" },
};

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

// Department configuration with professional names and branding
const DEPARTMENT_CONFIG: Record<string, {
  label: string;
  teamName: string;
  responder: string;
  initials: string;
  avatar: string;
  color: string;
  bgLight: string;
  border: string;
  icon: any;
}> = {
  SUPPORT: {
    label: "Support",
    teamName: "Student Success Department",
    responder: "Sarah Mitchell, Success Manager",
    initials: "SM",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    color: "text-emerald-700",
    bgLight: "bg-emerald-50",
    border: "border-emerald-200",
    icon: LifeBuoy
  },
  BILLING: {
    label: "Billing",
    teamName: "Accounts & Billing Department",
    responder: "Emma Richardson, Billing Specialist",
    initials: "ER",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
    color: "text-blue-700",
    bgLight: "bg-blue-50",
    border: "border-blue-200",
    icon: CreditCard
  },
  LEGAL: {
    label: "Legal",
    teamName: "Legal & Consumer Affairs Division",
    responder: "Jennifer Klein, Esq., Compliance Officer",
    initials: "JK",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
    color: "text-red-700",
    bgLight: "bg-red-50",
    border: "border-red-200",
    icon: AlertCircle
  },
  ACADEMIC: {
    label: "Academic",
    teamName: "Office of Academic Affairs",
    responder: "Dr. Michelle Torres, Academic Director",
    initials: "MT",
    avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&h=100&fit=crop&crop=face",
    color: "text-purple-700",
    bgLight: "bg-purple-50",
    border: "border-purple-200",
    icon: GraduationCap
  },
  CREDENTIALING: {
    label: "Credentialing",
    teamName: "Credentialing & Accreditation Board",
    responder: "David Lawrence, Chief Registrar",
    initials: "DL",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    color: "text-amber-700",
    bgLight: "bg-amber-50",
    border: "border-amber-200",
    icon: Star
  },
  TECHNICAL: {
    label: "Technical",
    teamName: "Technical Support Division",
    responder: "Alex Chen, Senior Tech Specialist",
    initials: "AC",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    color: "text-cyan-700",
    bgLight: "bg-cyan-50",
    border: "border-cyan-200",
    icon: Wrench
  },
};

// Auto-routing rules: category -> default department
const CATEGORY_TO_DEPARTMENT: Record<string, string> = {
  REFUND: "LEGAL",
  BILLING: "BILLING",
  TECHNICAL: "TECHNICAL",
  ACCESS: "SUPPORT",
  CERTIFICATES: "CREDENTIALING",
  COURSE_CONTENT: "ACADEMIC",
  GENERAL: "SUPPORT",
};

const QUICK_REPLIES = [
  { label: "Greeting", text: "Hello!\n\nThank you for reaching out to AccrediPro Support. I'm Sarah, and I'll be happy to help you today." },
  { label: "Investigating", text: "I'm looking into this for you right now. Please give me a moment to investigate." },
  { label: "Refund Info", text: "Regarding refunds: We offer a 30-day money-back guarantee. I'll process this for you right away." },
  { label: "Access Help", text: "I can see your account. Let me help you get access sorted out - I'll send you a direct login link." },
  { label: "Closing", text: "I'm glad I could help! I'll close this ticket now. Feel free to open a new one if you need anything else." },
];

// Get category from subject/content
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

// Tag Autocomplete Component
function TagAutocomplete({
  userId,
  existingTags,
  onTagAdded
}: {
  userId: string;
  existingTags: Array<{ id: string; tag: { name: string; slug: string; color: string } }>;
  onTagAdded: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [allTags, setAllTags] = useState<Array<{ id: string; name: string; slug: string; color: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [tagsLoading, setTagsLoading] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      setTagsLoading(true);
      try {
        const res = await fetch("/api/admin/marketing/tags");
        const data = await res.json();
        if (data.tags) setAllTags(data.tags);
      } catch (e) {
        console.error("Failed to fetch tags:", e);
      } finally {
        setTagsLoading(false);
      }
    };
    if (open && allTags.length === 0) fetchTags();
  }, [open, allTags.length]);

  const existingTagIds = new Set(existingTags.map(t => t.tag?.slug || ""));
  const filteredTags = allTags.filter(
    t => !existingTagIds.has(t.slug) &&
      (t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.slug.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAddTag = async (tagSlug: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag: tagSlug })
      });
      if (res.ok) {
        const data = await res.json();
        // Show enrollment message if courses were enrolled
        if (data.coursesEnrolled && data.coursesEnrolled.length > 0) {
          toast.success(`✅ Tag added + Enrolled in: ${data.coursesEnrolled.join(", ")}`);
        } else {
          toast.success(data.message || "Tag added");
        }
        onTagAdded();
        setOpen(false);
        setSearch("");
      } else {
        toast.error("Failed to add tag");
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
        <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
          <Plus className="w-3 h-3" /> Add Tag
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-2" align="end" sideOffset={5}>
        <div className="space-y-2">
          <Input
            placeholder="Search tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8"
            autoFocus
          />
          <div className="max-h-[200px] overflow-y-auto">
            {tagsLoading ? (
              <div className="py-4 text-center text-sm text-slate-400">Loading tags...</div>
            ) : filteredTags.length === 0 ? (
              <div className="py-4 text-center text-sm text-slate-400">
                {search ? "No tags found" : "No tags available"}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredTags.slice(0, 10).map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleAddTag(tag.slug)}
                    disabled={loading}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-100 text-left text-sm disabled:opacity-50"
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: tag.color || "#6B7280" }}
                    />
                    <span className="flex-1 truncate">{tag.name}</span>
                    <span className="text-[10px] text-slate-400 flex-shrink-0">{tag.slug}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Main Page
export default function TicketsPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Email editing state
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [editEmailValue, setEditEmailValue] = useState("");
  const [isSavingEmail, setIsSavingEmail] = useState(false);

  // Attachment state
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, refetch } = useTickets(statusFilter, priorityFilter, searchTerm);
  const updateTicket = useUpdateTicket();
  const replyTicket = useReplyTicket();

  const tickets = data?.tickets || [];
  const selectedTicket = useMemo(() => tickets.find(t => t.id === selectedTicketId), [tickets, selectedTicketId]);

  // Stats
  const stats = useMemo(() => ({
    new: tickets.filter(t => t.status === "NEW").length,
    open: tickets.filter(t => t.status === "OPEN" || t.status === "PENDING").length,
    urgent: tickets.filter(t => t.priority === "URGENT" || t.priority === "HIGH").length,
    total: tickets.length,
  }), [tickets]);

  // Auto-select first ticket
  useEffect(() => {
    if (!selectedTicketId && tickets.length > 0) {
      setSelectedTicketId(tickets[0].id);
    }
  }, [tickets, selectedTicketId]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedTicket?.messages]);

  const handleSendReply = async () => {
    if (!selectedTicketId || (!replyText.trim() && attachments.length === 0)) return;

    try {
      // Upload attachments first if any
      let attachmentUrls: string[] = [];
      if (attachments.length > 0) {
        const formData = new FormData();
        attachments.forEach(file => formData.append("files", file));

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          attachmentUrls = uploadData.urls || [];
        } else {
          toast.error("Failed to upload attachments");
          return;
        }
      }

      // Build message with attachments
      let messageContent = replyText.trim();
      if (attachmentUrls.length > 0) {
        const attachmentTags = attachmentUrls.map(url => `[Attachment: ${url}]`).join("\n");
        messageContent = messageContent ? `${messageContent}\n\n${attachmentTags}` : attachmentTags;
      }

      await replyTicket.mutateAsync({
        ticketId: selectedTicketId,
        message: messageContent,
        isInternal: isInternalNote
      });

      setReplyText("");
      setIsInternalNote(false);
      setAttachments([]);
    } catch {
      toast.error("Failed to send reply");
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
      if (data.reply) {
        setReplyText(prev => prev ? prev + "\n\n" + data.reply : data.reply);
      }
    } catch {
      toast.error("Failed to generate AI reply");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleDeleteTicket = async () => {
    if (!selectedTicketId || !confirm("Delete this ticket permanently?")) return;
    try {
      await fetch(`/api/admin/tickets/${selectedTicketId}`, { method: "DELETE" });
      toast.success("Ticket deleted");
      refetch();
      const remaining = tickets.filter(t => t.id !== selectedTicketId);
      setSelectedTicketId(remaining[0]?.id || null);
    } catch {
      toast.error("Failed to delete");
    }
  };

  // Handle saving email change
  const handleSaveEmail = async () => {
    if (!selectedTicket?.user?.id || !editEmailValue.trim()) return;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editEmailValue)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSavingEmail(true);
    try {
      const res = await fetch("/api/admin/users/email", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedTicket.user.id,
          newEmail: editEmailValue.trim().toLowerCase(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Email updated: ${data.oldEmail} → ${data.newEmail}`);
        setIsEditingEmail(false);
        // Refresh tickets to get updated data
        queryClient.invalidateQueries({ queryKey: ["tickets"] });
      } else {
        toast.error(data.error || "Failed to update email");
      }
    } catch {
      toast.error("Failed to update email");
    } finally {
      setIsSavingEmail(false);
    }
  };

  // Mobile sidebar state
  const [showSidebar, setShowSidebar] = useState(true);
  const [showCustomerPanel, setShowCustomerPanel] = useState(false); // Start closed for more space

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Left Panel - Ticket List (Compact) */}
      <div className={cn(
        "w-[340px] min-w-[340px] bg-white border-r flex flex-col",
        "lg:flex",
        !showSidebar && "hidden"
      )}>
        {/* Header */}
        <div className="p-4 border-b bg-gradient-to-r from-[#722F37] to-[#8B3D47]">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <LifeBuoy className="w-5 h-5" />
              Support Tickets
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => refetch()}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <RefreshCcw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "New", value: stats.new, color: "bg-blue-500" },
              { label: "Open", value: stats.open, color: "bg-emerald-500" },
              { label: "Urgent", value: stats.urgent, color: "bg-red-500" },
              { label: "Total", value: stats.total, color: "bg-slate-500" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className={cn("text-xl font-bold text-white")}>{stat.value}</div>
                <div className="text-[10px] text-white/70 uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Tabs - Gmail/Zendesk Style */}
        <div className="border-b bg-white">
          <div className="flex overflow-x-auto scrollbar-hide">
            {[
              { id: "all", label: "All", count: stats.total, icon: Inbox },
              { id: "NEW", label: "New", count: stats.new, icon: Circle, color: "text-blue-600" },
              { id: "OPEN", label: "Open", count: tickets.filter(t => t.status === "OPEN").length, icon: MessageSquare, color: "text-emerald-600" },
              { id: "PENDING", label: "Pending", count: tickets.filter(t => t.status === "PENDING").length, icon: Clock, color: "text-amber-600" },
              { id: "RESOLVED", label: "Resolved", count: tickets.filter(t => t.status === "RESOLVED").length, icon: CheckCheck, color: "text-purple-600" },
              { id: "CLOSED", label: "Closed", count: tickets.filter(t => t.status === "CLOSED").length, icon: Archive, color: "text-slate-500" },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap",
                    isActive
                      ? "border-[#722F37] text-[#722F37] bg-[#722F37]/5"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <Icon className={cn("w-3.5 h-3.5", isActive ? "text-[#722F37]" : tab.color)} />
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={cn(
                      "ml-1 px-1.5 py-0.5 text-[10px] rounded-full font-bold",
                      isActive ? "bg-[#722F37] text-white" : "bg-slate-100 text-slate-600"
                    )}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search */}
        <div className="p-2 border-b bg-slate-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search tickets..."
              className="pl-9 h-8 bg-white text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Ticket List */}
        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="p-8 text-center text-slate-400">
              <RefreshCcw className="w-6 h-6 animate-spin mx-auto mb-2" />
              Loading tickets...
            </div>
          ) : tickets.length === 0 ? (
            <div className="p-8 text-center">
              <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No tickets found</p>
            </div>
          ) : (
            tickets.map((ticket) => {
              const category = detectCategory(ticket.subject);
              const categoryStyle = CATEGORY_COLORS[category] || CATEGORY_COLORS.General;
              const statusConfig = STATUS_CONFIG[ticket.status];
              const priorityConfig = PRIORITY_CONFIG[ticket.priority];
              const isSelected = selectedTicketId === ticket.id;
              const isUrgent = ticket.priority === "URGENT" || ticket.priority === "HIGH";

              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={cn(
                    "p-4 border-b cursor-pointer transition-all hover:bg-slate-50",
                    isSelected && "bg-gradient-to-r from-[#722F37]/5 to-transparent border-l-4 border-l-[#722F37]",
                    isUrgent && !isSelected && "bg-red-50/50"
                  )}
                >
                  {/* Top Row */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarImage src={ticket.user?.avatar || undefined} />
                        <AvatarFallback className={cn(
                          "text-xs font-semibold",
                          isUrgent ? "bg-red-100 text-red-700" : "bg-[#722F37]/10 text-[#722F37]"
                        )}>
                          {ticket.customerName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-slate-900 truncate">
                          {ticket.customerName}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {ticket.customerEmail}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-[10px] text-slate-400">
                        {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: false })}
                      </div>
                      <div className={cn(
                        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold mt-1",
                        statusConfig.bgLight, statusConfig.textColor
                      )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", statusConfig.color)} />
                        {statusConfig.label}
                      </div>
                    </div>
                  </div>

                  {/* Subject & Preview */}
                  <div className="mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-slate-400">#{ticket.ticketNumber}</span>
                      <span className={cn(
                        "text-[9px] px-1.5 py-0.5 rounded-full font-medium border",
                        categoryStyle.bg, categoryStyle.text, categoryStyle.border
                      )}>
                        {category}
                      </span>
                      {isUrgent && (
                        <priorityConfig.icon className={cn("w-3.5 h-3.5", priorityConfig.color)} />
                      )}
                    </div>
                    <p className="text-sm font-medium text-slate-800 line-clamp-1">
                      {ticket.subject}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {ticket.messages[ticket.messages.length - 1]?.content || "No messages"}
                    </p>
                  </div>

                  {/* Tags */}
                  {ticket.user?.marketingTags && ticket.user.marketingTags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {ticket.user.marketingTags.slice(0, 3).map((mt: any, i: number) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200"
                        >
                          <TagIcon className="w-2.5 h-2.5" />
                          {mt.tag?.name || mt.tag?.slug || "Tag"}
                        </span>
                      ))}
                      {ticket.user.marketingTags.length > 3 && (
                        <span className="text-[9px] text-slate-400">
                          +{ticket.user.marketingTags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </ScrollArea>
      </div>

      {/* Center Panel - Conversation */}
      <div className="flex-1 flex flex-col min-w-0 bg-white shadow-sm">
        {selectedTicket ? (
          <>
            {/* Ticket Detail Header - Compact Two Row Layout */}
            <div className="border-b bg-white flex-shrink-0">
              {/* Row 1: Ticket Info - Compact */}
              <div className="px-3 py-2 flex items-center gap-2">
                {/* Toggle sidebar button - Mobile */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden h-7 w-7 flex-shrink-0"
                  onClick={() => setShowSidebar(!showSidebar)}
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>

                <Avatar className="w-8 h-8 border border-[#722F37]/20 flex-shrink-0">
                  <AvatarImage src={selectedTicket.user?.avatar || undefined} />
                  <AvatarFallback className="bg-[#722F37] text-white text-xs font-semibold">
                    {selectedTicket.customerName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  {/* First line: Subject */}
                  <h2 className="font-semibold text-slate-900 text-sm leading-tight truncate">
                    {selectedTicket.subject}
                  </h2>
                  {/* Second line: Ticket # + Name + Category */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="font-mono text-slate-400">#{selectedTicket.ticketNumber}</span>
                    <span>by <span className="font-medium text-slate-700">{selectedTicket.customerName}</span></span>
                    {(() => {
                      const category = detectCategory(selectedTicket.subject);
                      const categoryStyle = CATEGORY_COLORS[category] || CATEGORY_COLORS.General;
                      return (
                        <span className={cn(
                          "px-1.5 py-0.5 rounded text-[10px] font-medium",
                          categoryStyle.bg, categoryStyle.text
                        )}>
                          {category}
                        </span>
                      );
                    })()}
                  </div>
                </div>

                {/* Customer Panel Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 flex-shrink-0"
                  onClick={() => setShowCustomerPanel(!showCustomerPanel)}
                  title="Toggle customer details"
                >
                  <User className="w-4 h-4" />
                </Button>
              </div>

              {/* Row 2: Action Buttons - Compact inline */}
              <div className="px-3 pb-2 flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
                {/* Status Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-2">
                      <span className={cn(
                        "w-2 h-2 rounded-full",
                        STATUS_CONFIG[selectedTicket.status].color
                      )} />
                      {STATUS_CONFIG[selectedTicket.status].label}
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                      <DropdownMenuItem
                        key={key}
                        onClick={() => updateTicket.mutate({
                          ticketId: selectedTicket.id,
                          updates: { status: key as any }
                        })}
                      >
                        <span className={cn("w-2 h-2 rounded-full mr-2", config.color)} />
                        {config.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Priority Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-2">
                      {(() => {
                        const P = PRIORITY_CONFIG[selectedTicket.priority];
                        return <P.icon className={cn("w-4 h-4", P.color)} />;
                      })()}
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                      <DropdownMenuItem
                        key={key}
                        onClick={() => updateTicket.mutate({
                          ticketId: selectedTicket.id,
                          updates: { priority: key as any }
                        })}
                      >
                        <config.icon className={cn("w-4 h-4 mr-2", config.color)} />
                        {config.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Department Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className={cn(
                      "h-8 gap-2 border",
                      DEPARTMENT_CONFIG[selectedTicket.department || "SUPPORT"]?.border
                    )}>
                      {(() => {
                        const deptConfig = DEPARTMENT_CONFIG[selectedTicket.department || "SUPPORT"] || DEPARTMENT_CONFIG.SUPPORT;
                        const DeptIcon = deptConfig.icon;
                        return (
                          <>
                            <DeptIcon className={cn("w-4 h-4", deptConfig.color)} />
                            <span className={cn("text-xs font-medium", deptConfig.color)}>
                              {deptConfig.label}
                            </span>
                          </>
                        );
                      })()}
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel className="text-xs text-slate-500">Route to Department</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {Object.entries(DEPARTMENT_CONFIG).map(([key, config]) => {
                      const Icon = config.icon;
                      return (
                        <DropdownMenuItem
                          key={key}
                          onClick={() => updateTicket.mutate({
                            ticketId: selectedTicket.id,
                            updates: { department: key as any }
                          })}
                          className={cn(
                            selectedTicket.department === key && config.bgLight
                          )}
                        >
                          <Icon className={cn("w-4 h-4 mr-2", config.color)} />
                          <div className="flex-1">
                            <div className="font-medium">{config.teamName}</div>
                            <div className="text-[10px] text-slate-400">{config.responder}</div>
                          </div>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* More Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => {
                      if (session?.user?.id) {
                        updateTicket.mutate({
                          ticketId: selectedTicket.id,
                          updates: { assignedToId: session.user.id }
                        });
                      }
                    }}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Assign to Me
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" onClick={handleDeleteTicket}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Ticket
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 bg-slate-50/50">
              <div className="px-4 py-3">
                <div className="space-y-4">
                  {selectedTicket.messages.map((msg, idx) => {
                    const isCustomer = msg.isFromCustomer;
                    const showDateSeparator = idx === 0 ||
                      format(new Date(msg.createdAt), "yyyy-MM-dd") !==
                      format(new Date(selectedTicket.messages[idx - 1].createdAt), "yyyy-MM-dd");

                    return (
                      <div key={msg.id}>
                        {showDateSeparator && (
                          <div className="flex items-center justify-center my-6">
                            <div className="h-px flex-1 bg-slate-200" />
                            <div className="text-[11px] font-medium text-slate-400 px-4 py-1 rounded-full border bg-white mx-4">
                              {format(new Date(msg.createdAt), "EEEE, MMMM d, yyyy")}
                            </div>
                            <div className="h-px flex-1 bg-slate-200" />
                          </div>
                        )}
                        {/* All messages left aligned */}
                        <div className="flex gap-4 max-w-3xl">
                          <Avatar className={cn(
                            "w-10 h-10 flex-shrink-0 mt-1",
                            isCustomer ? "border border-slate-200" : "border-2 border-[#722F37]/20"
                          )}>
                            {!isCustomer && (
                              <AvatarImage
                                src={DEPARTMENT_CONFIG[selectedTicket.department || "SUPPORT"]?.avatar}
                                alt={DEPARTMENT_CONFIG[selectedTicket.department || "SUPPORT"]?.responder}
                              />
                            )}
                            <AvatarFallback className={cn(
                              "text-sm font-bold",
                              isCustomer
                                ? "bg-slate-100 text-slate-600"
                                : "bg-[#722F37] text-white"
                            )}>
                              {isCustomer
                                ? selectedTicket.customerName.charAt(0).toUpperCase()
                                : (DEPARTMENT_CONFIG[selectedTicket.department || "SUPPORT"]?.initials || "SM")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              {!isCustomer && (() => {
                                const dept = DEPARTMENT_CONFIG[selectedTicket.department || "SUPPORT"] || DEPARTMENT_CONFIG.SUPPORT;
                                return (
                                  <span className={cn("text-xs font-bold", dept.color)}>
                                    {dept.responder} <span className="text-slate-400 font-normal">from {dept.teamName}</span>
                                  </span>
                                );
                              })()}
                              {isCustomer && (
                                <span className="text-xs font-bold text-slate-900">
                                  {selectedTicket.customerName}
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400">
                                {format(new Date(msg.createdAt), "h:mm a")}
                              </span>
                              {msg.isInternal && (
                                <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">
                                  INTERNAL NOTE
                                </span>
                              )}
                            </div>

                            <div className={cn(
                              "text-sm leading-relaxed p-4 rounded-2xl shadow-sm relative group",
                              msg.isInternal
                                ? "bg-amber-50 border border-amber-200 text-slate-800 rounded-tl-none"
                                : isCustomer
                                  ? "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
                                  : "bg-blue-50 border border-blue-100 text-slate-800 rounded-tl-none"
                            )}>
                              <p className="whitespace-pre-wrap">{msg.content}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </ScrollArea>

            {/* Reply Box */}
            <div className="p-4 pb-6 border-t bg-white flex-shrink-0">
              <div className="max-w-3xl mx-auto">
                {/* Quick Actions */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant={isInternalNote ? "default" : "outline"}
                      className={cn(
                        "h-7 text-xs",
                        isInternalNote && "bg-amber-500 hover:bg-amber-600"
                      )}
                      onClick={() => setIsInternalNote(!isInternalNote)}
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      Internal
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline" className="h-7 text-xs">
                          Quick Reply
                          <ChevronDown className="w-3 h-3 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-48">
                        {QUICK_REPLIES.map((qr) => (
                          <DropdownMenuItem
                            key={qr.label}
                            onClick={() => setReplyText(prev => prev ? prev + "\n\n" + qr.text : qr.text)}
                          >
                            {qr.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs text-purple-600 border-purple-200 hover:bg-purple-50"
                    onClick={handleAIReply}
                    disabled={isGeneratingAI}
                  >
                    <Sparkles className={cn("w-3 h-3 mr-1", isGeneratingAI && "animate-spin")} />
                    {isGeneratingAI ? "Generating..." : "AI Suggest"}
                  </Button>
                </div>

                {/* Textarea */}
                <div className={cn(
                  "rounded-xl border-2 overflow-hidden transition-colors",
                  isInternalNote ? "border-amber-300 bg-amber-50/50" : "border-slate-200"
                )}>
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={isInternalNote ? "Add internal note (not visible to customer)..." : "Type your reply..."}
                    className="min-h-[100px] border-0 focus-visible:ring-0 resize-none bg-transparent"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.metaKey) {
                        handleSendReply();
                      }
                    }}
                  />

                  {/* Attachment Preview */}
                  {attachments.length > 0 && (
                    <div className="px-3 py-2 border-t bg-slate-50/50 flex flex-wrap gap-2">
                      {attachments.map((file, idx) => (
                        <div key={idx} className="relative group">
                          {file.type.startsWith("image/") ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="h-16 w-16 object-cover rounded border"
                            />
                          ) : (
                            <div className="h-16 w-16 bg-slate-100 rounded border flex items-center justify-center">
                              <Paperclip className="w-5 h-5 text-slate-400" />
                            </div>
                          )}
                          <button
                            onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <span className="text-[9px] text-slate-500 truncate block w-16">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-t">
                    <div className="flex items-center gap-2">
                      {/* Hidden file input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,.pdf,.doc,.docx"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files) {
                            setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-slate-500 hover:text-slate-700"
                        onClick={() => fileInputRef.current?.click()}
                        title="Attach file"
                      >
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <span className="text-[10px] text-slate-400">
                        <kbd className="px-1 py-0.5 bg-white border rounded text-[9px]">⌘</kbd> + <kbd className="px-1 py-0.5 bg-white border rounded text-[9px]">Enter</kbd> to send
                      </span>
                    </div>
                    <Button
                      size="sm"
                      onClick={handleSendReply}
                      disabled={replyTicket.isPending || !replyText.trim()}
                      className={cn(
                        "h-8",
                        isInternalNote
                          ? "bg-amber-500 hover:bg-amber-600"
                          : "bg-[#722F37] hover:bg-[#5A252C]"
                      )}
                    >
                      {replyTicket.isPending ? "Sending..." : "Send"}
                      <Send className="w-3 h-3 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">Select a ticket</p>
              <p className="text-sm">Choose a ticket from the list to view the conversation</p>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Customer Details (Slide-over Overlay) */}
      {selectedTicket && (
        <>
          {/* Backdrop - Click to close */}
          {showCustomerPanel && (
            <div
              className="fixed inset-0 bg-black/30 z-40 transition-opacity"
              onClick={() => setShowCustomerPanel(false)}
            />
          )}

          {/* Slide-over Panel */}
          <div className={cn(
            "fixed top-0 right-0 h-full w-[380px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden transition-transform duration-300 ease-in-out",
            showCustomerPanel ? "translate-x-0" : "translate-x-full"
          )}>
            {/* Panel Header */}
            <div className="h-16 border-b px-4 flex items-center justify-between bg-gradient-to-r from-[#722F37] to-[#8B3D47] flex-shrink-0">
              <h3 className="font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4" />
                Customer Details
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10"
                onClick={() => setShowCustomerPanel(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4">
                {/* Customer Header */}
                <div className="text-center pb-4 border-b mb-4">
                  <Avatar className="w-16 h-16 mx-auto mb-3 border-2 border-[#722F37]/20">
                    <AvatarImage src={selectedTicket.user?.avatar || undefined} />
                    <AvatarFallback className="bg-[#722F37] text-white text-xl font-semibold">
                      {selectedTicket.customerName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-slate-900">{selectedTicket.customerName}</h3>

                  {/* Editable Email Section */}
                  {isEditingEmail ? (
                    <div className="mt-2 space-y-2">
                      <Input
                        type="email"
                        value={editEmailValue}
                        onChange={(e) => setEditEmailValue(e.target.value)}
                        placeholder="Enter new email"
                        className="h-8 text-xs text-center"
                        autoFocus
                      />
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          onClick={handleSaveEmail}
                          disabled={isSavingEmail}
                          className="h-7 text-xs bg-[#722F37] hover:bg-[#5A252C]"
                        >
                          {isSavingEmail ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <>
                              <Save className="w-3 h-3 mr-1" />
                              Save
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setIsEditingEmail(false);
                            setEditEmailValue("");
                          }}
                          className="h-7 text-xs"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-1 text-xs text-slate-500 mt-1">
                      <Mail className="w-3 h-3" />
                      {selectedTicket.customerEmail}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedTicket.customerEmail);
                          toast.success("Email copied!");
                        }}
                        className="text-[#722F37] hover:text-[#5A252C] ml-1"
                        title="Copy email"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      {selectedTicket.user && (
                        <button
                          onClick={() => {
                            setEditEmailValue(selectedTicket.customerEmail);
                            setIsEditingEmail(true);
                          }}
                          className="text-[#722F37] hover:text-[#5A252C] ml-1"
                          title="Edit email"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}

                  {selectedTicket.user && (
                    <div className="text-[10px] text-slate-400 mt-1">
                      Customer since {format(new Date(selectedTicket.user.createdAt), "MMM yyyy")}
                    </div>
                  )}
                </div>

                {/* Tags Section */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <TagIcon className="w-3.5 h-3.5" /> Tags
                    </h4>
                    {selectedTicket.user && (
                      <TagAutocomplete
                        userId={selectedTicket.user.id}
                        existingTags={selectedTicket.user.marketingTags || []}
                        onTagAdded={() => queryClient.invalidateQueries({ queryKey: ["tickets"] })}
                      />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTicket.user?.marketingTags && selectedTicket.user.marketingTags.length > 0 ? (
                      selectedTicket.user.marketingTags.map((mt: any, i: number) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="text-[10px] gap-1 pr-1 group"
                          style={{
                            backgroundColor: `${mt.tag?.color || "#6B7280"}20`,
                            color: mt.tag?.color || "#6B7280",
                            borderColor: `${mt.tag?.color || "#6B7280"}40`,
                          }}
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: mt.tag?.color || "#6B7280" }}
                          />
                          {mt.tag?.name || mt.tag?.slug || "Tag"}
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                const res = await fetch(`/api/admin/users/${selectedTicket.user?.id}/tags`, {
                                  method: "DELETE",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ tag: mt.tag?.slug || mt.tag?.name })
                                });
                                if (res.ok) {
                                  toast.success("Tag removed");
                                  queryClient.invalidateQueries({ queryKey: ["tickets"] });
                                } else {
                                  toast.error("Failed to remove tag");
                                }
                              } catch {
                                toast.error("Failed to remove tag");
                              }
                            }}
                            className="ml-1 p-0.5 rounded hover:bg-black/10 opacity-50 group-hover:opacity-100 transition-opacity"
                            title="Remove tag"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No tags assigned</span>
                    )}
                  </div>
                </div>

                {/* Purchases */}
                <div className="mb-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-2">
                    <DollarSign className="w-3.5 h-3.5 text-green-600" /> Purchases
                  </h4>
                  {!selectedTicket.user?.payments?.length ? (
                    <p className="text-xs text-slate-400 italic">No purchases found</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedTicket.user.payments.slice(0, 4).map((p) => (
                        <div key={p.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <CreditCard className="w-3.5 h-3.5 text-green-600" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-medium text-slate-700 truncate">
                                {p.productName || "Product"}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {format(new Date(p.createdAt), "MMM d, yyyy")}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm font-bold text-slate-900">
                            {new Intl.NumberFormat("en-US", { style: "currency", currency: p.currency }).format(p.amount)}
                          </div>
                        </div>
                      ))}
                      {selectedTicket.user.payments.length > 4 && (
                        <a
                          href={`/admin/users?userId=${selectedTicket.user.id}`}
                          target="_blank"
                          className="block text-center text-xs text-[#722F37] hover:underline py-1"
                        >
                          View all {selectedTicket.user.payments.length} purchases
                          <ExternalLink className="w-3 h-3 inline ml-1" />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Enrollments & Progress */}
                <div className="mb-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-2">
                    <GraduationCap className="w-3.5 h-3.5 text-purple-600" /> Enrollments
                  </h4>
                  {!selectedTicket.user?.enrollments?.length ? (
                    <p className="text-xs text-slate-400 italic">No enrollments found</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedTicket.user.enrollments.slice(0, 4).map((enrollment: any) => {
                        const progressPercent = Math.round(enrollment.progress || 0);

                        return (
                          <div key={enrollment.id} className="p-2 bg-slate-50 rounded-lg">
                            <div className="flex items-start gap-2">
                              <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-slate-700 truncate">
                                  {enrollment.course?.title || "Course"}
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                  <span className={cn(
                                    "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                                    enrollment.status === "COMPLETED"
                                      ? "bg-green-100 text-green-700"
                                      : enrollment.status === "ACTIVE"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-slate-100 text-slate-600"
                                  )}>
                                    {enrollment.status}
                                  </span>
                                  <span className="text-[10px] text-slate-500 font-medium">
                                    {progressPercent}%
                                  </span>
                                </div>
                                {/* Progress bar */}
                                <div className="mt-1.5 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                  <div
                                    className={cn(
                                      "h-full rounded-full transition-all",
                                      progressPercent === 100 ? "bg-green-500" : "bg-purple-500"
                                    )}
                                    style={{ width: `${progressPercent}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {selectedTicket.user.enrollments.length > 4 && (
                        <a
                          href={`/admin/users?userId=${selectedTicket.user.id}`}
                          target="_blank"
                          className="block text-center text-xs text-[#722F37] hover:underline py-1"
                        >
                          View all {selectedTicket.user.enrollments.length} enrollments
                          <ExternalLink className="w-3 h-3 inline ml-1" />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Other Tickets */}
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-2">
                    <LifeBuoy className="w-3.5 h-3.5 text-blue-600" /> Other Tickets
                  </h4>
                  {!selectedTicket.user?.submittedTickets?.filter((t: any) => t.id !== selectedTicket.id).length ? (
                    <p className="text-xs text-slate-400 italic">No other tickets</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedTicket.user.submittedTickets
                        .filter((t: any) => t.id !== selectedTicket.id)
                        .slice(0, 4)
                        .map((t: any) => (
                          <div
                            key={t.id}
                            onClick={() => setSelectedTicketId(t.id)}
                            className="p-2 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-mono text-slate-400">#{t.ticketNumber}</span>
                              <span className={cn(
                                "text-[9px] px-1.5 py-0.5 rounded-full font-medium",
                                STATUS_CONFIG[t.status as keyof typeof STATUS_CONFIG]?.bgLight,
                                STATUS_CONFIG[t.status as keyof typeof STATUS_CONFIG]?.textColor
                              )}>
                                {STATUS_CONFIG[t.status as keyof typeof STATUS_CONFIG]?.label || t.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 line-clamp-1">{t.subject}</p>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </div>
        </>
      )}
    </div>
  );
}
