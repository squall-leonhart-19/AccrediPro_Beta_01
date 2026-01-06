"use client";

import { useState, useMemo, useEffect } from "react";
import { useTickets, Ticket, useUpdateTicket, useReplyTicket } from "@/hooks/use-tickets";
import { formatDistanceToNow } from "date-fns";
import {
  Search, RefreshCcw, CheckCircle2, XCircle,
  MessageSquare, User, Clock, Zap, Send,
  MoreVertical, Mail, LifeBuoy, ChevronDown,
  Sparkles, Trash2, UserPlus, DollarSign, CreditCard, Copy, ExternalLink, Tag as TagIcon, Plus,
  Inbox, AlertTriangle, CheckCheck, Archive
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Status config
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  NEW: { label: "New", color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: Inbox },
  OPEN: { label: "Open", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: MessageSquare },
  PENDING: { label: "Pending", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: Clock },
  RESOLVED: { label: "Resolved", color: "text-purple-700", bg: "bg-purple-50 border-purple-200", icon: CheckCheck },
  CLOSED: { label: "Closed", color: "text-slate-500", bg: "bg-slate-100 border-slate-200", icon: Archive },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  LOW: { label: "Low", color: "text-slate-400", icon: CheckCircle2 },
  MEDIUM: { label: "Medium", color: "text-blue-500", icon: LifeBuoy },
  HIGH: { label: "High", color: "text-orange-500", icon: AlertTriangle },
  URGENT: { label: "Urgent", color: "text-red-600", icon: XCircle },
};

const SAVED_REPLIES = [
  { label: "Greeting", text: "Hello,\n\nThank you for reaching out to AccrediPro Support. My name is Sarah and I'll be helping you today." },
  { label: "Investigating", text: "I'm looking into this issue for you right now. Please allow me a few moments to investigate." },
  { label: "Refund Policy", text: "Regarding our refund policy: We offer a 30-day money-back guarantee for all our certification programs if you are not satisfied." },
  { label: "Closing", text: "I'm glad we could resolve this for you. I'll go ahead and close this ticket now. Please feel free to reach out if you need anything else!" },
];

// Status Badge Component
const StatusBadge = ({ status, size = "sm" }: { status: string; size?: "sm" | "md" }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.NEW;
  const Icon = config.icon;
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full border font-medium",
      config.bg, config.color,
      size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
    )}>
      <Icon className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
      {config.label}
    </span>
  );
};

// Priority Indicator
const PriorityIndicator = ({ priority }: { priority: string }) => {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.MEDIUM;
  const Icon = config.icon;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Icon className={cn("w-4 h-4", config.color)} />
        </TooltipTrigger>
        <TooltipContent><p>{config.label} Priority</p></TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Ticket Card Component
const TicketCard = ({ ticket, isSelected, onClick }: { ticket: Ticket; isSelected: boolean; onClick: () => void }) => {
  const lastMessage = ticket.messages?.[ticket.messages.length - 1];
  const isUrgent = ticket.priority === "URGENT" || ticket.priority === "HIGH";

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative p-4 cursor-pointer transition-all border-b hover:bg-slate-50",
        isSelected && "bg-gradient-to-r from-blue-50 to-transparent border-l-[3px] border-l-blue-500",
        isUrgent && !isSelected && "bg-red-50/30"
      )}
    >
      {/* Unread indicator */}
      {ticket.status === "NEW" && (
        <span className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full" />
      )}

      <div className="flex items-start gap-3">
        <Avatar className="w-9 h-9 shrink-0">
          <AvatarFallback className={cn(
            "text-xs font-medium",
            isUrgent ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"
          )}>
            {ticket.customerName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-semibold text-sm text-slate-900 truncate">
              {ticket.customerName}
            </span>
            <span className="text-[10px] text-slate-400 whitespace-nowrap">
              {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: false })}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-1.5">
            <PriorityIndicator priority={ticket.priority} />
            <span className="text-xs font-medium text-slate-700 truncate flex-1">
              #{ticket.ticketNumber} {ticket.subject}
            </span>
          </div>

          <p className="text-xs text-slate-500 line-clamp-1 mb-2">
            {lastMessage?.content || "No messages yet..."}
          </p>

          <div className="flex items-center justify-between">
            <StatusBadge status={ticket.status} />
            {ticket.assignedTo && (
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <User className="w-3 h-3" />
                {ticket.assignedTo.name?.split(' ')[0]}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Customer Sidebar
const CustomerSidebar = ({ ticket }: { ticket: Ticket }) => {
  const user = ticket.user;
  const [newTag, setNewTag] = useState("");
  const [isAddingTag, setIsAddingTag] = useState(false);
  const queryClient = useQueryClient();

  const handleAddTag = async () => {
    if (!newTag.trim() || !user?.id) return;
    try {
      const res = await fetch(`/api/admin/users/${user.id}/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag: newTag })
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Tag added");
      setNewTag("");
      setIsAddingTag(false);
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    } catch {
      toast.error("Failed to add tag");
    }
  };

  if (!user) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center bg-slate-50">
        <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="font-semibold text-slate-600 mb-1">Guest User</h3>
        <p className="text-xs text-slate-400 mb-4">No account found</p>
        <div className="w-full p-3 bg-white rounded-lg border text-left">
          <div className="text-[10px] font-medium text-slate-400 uppercase mb-1">Contact Info</div>
          <div className="text-sm font-medium text-slate-800">{ticket.customerName}</div>
          <div className="text-xs text-blue-600">{ticket.customerEmail}</div>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        {/* User Header */}
        <div className="flex items-center gap-3 mb-6">
          <Avatar className="w-14 h-14 border-2 border-white shadow">
            <AvatarImage src={user.avatar || ""} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-medium">
              {user.firstName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-800 truncate">{user.firstName} {user.lastName}</h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Mail className="w-3 h-3" />
              <span className="truncate">{user.email}</span>
              <button
                onClick={() => { navigator.clipboard.writeText(user.email || ""); toast.success("Copied!"); }}
                className="text-blue-500 hover:text-blue-700"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Purchases */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <DollarSign className="w-3.5 h-3.5 text-green-600" /> Purchases
          </h4>
          {!user.payments?.length ? (
            <p className="text-xs text-slate-400 italic">No purchases</p>
          ) : (
            <div className="space-y-2">
              {user.payments.slice(0, 3).map((p) => (
                <div key={p.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-green-600" />
                    <div>
                      <div className="text-xs font-medium text-slate-700 line-clamp-1">{p.productName}</div>
                      <div className="text-[10px] text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-800">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: p.currency }).format(p.amount)}
                  </span>
                </div>
              ))}
              <a href={`/admin/users?userId=${user.id}`} target="_blank" className="block text-center text-xs text-blue-600 hover:underline py-1">
                View all <ExternalLink className="w-3 h-3 inline" />
              </a>
            </div>
          )}
        </div>

        {/* Other Tickets */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <LifeBuoy className="w-3.5 h-3.5 text-blue-600" /> Other Tickets
          </h4>
          {!user.submittedTickets?.filter(t => t.id !== ticket.id).length ? (
            <p className="text-xs text-slate-400 italic">No other tickets</p>
          ) : (
            <div className="space-y-2">
              {user.submittedTickets.filter(t => t.id !== ticket.id).slice(0, 3).map((t) => (
                <div key={t.id} className="p-2 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-700">#{t.ticketNumber}</span>
                    <StatusBadge status={t.status} />
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{t.subject}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tags */}
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <TagIcon className="w-3.5 h-3.5 text-purple-600" /> Tags
          </h4>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {user.marketingTags?.length ? (
              user.marketingTags.map((mt: any) => (
                <Badge key={mt.id} variant="secondary" className="text-[10px] bg-purple-50 text-purple-700 border-purple-200">
                  {mt.tag?.name || mt.tag?.slug}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">No tags</span>
            )}
          </div>
          {isAddingTag ? (
            <div className="flex gap-1.5">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Tag..."
                className="h-7 text-xs"
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                autoFocus
              />
              <Button size="sm" className="h-7 px-2" onClick={handleAddTag}><Plus className="w-3 h-3" /></Button>
              <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => setIsAddingTag(false)}>×</Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" className="w-full h-7 text-xs border-dashed" onClick={() => setIsAddingTag(true)}>
              <Plus className="w-3 h-3 mr-1" /> Add Tag
            </Button>
          )}
        </div>
      </div>
    </ScrollArea>
  );
};

// Main Page
export default function TicketsPage() {
  const { data: session } = useSession();
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"unresolved" | "all" | "mine">("unresolved");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const { data, isLoading, refetch } = useTickets(filterStatus, filterPriority, searchTerm);
  const mutationUpdate = useUpdateTicket();
  const mutationReply = useReplyTicket();

  const tickets = data?.tickets || [];

  const filteredTickets = useMemo(() => {
    let list = tickets;
    if (activeTab === "unresolved") {
      list = list.filter(t => !["RESOLVED", "CLOSED"].includes(t.status));
    } else if (activeTab === "mine" && session?.user?.id) {
      list = list.filter(t => t.assignedTo?.id === session.user.id);
    }
    return list;
  }, [tickets, activeTab, session?.user?.id]);

  const selectedTicket = useMemo(() => tickets.find(t => t.id === selectedTicketId), [tickets, selectedTicketId]);

  // Stats
  const stats = useMemo(() => ({
    unresolved: tickets.filter(t => !["RESOLVED", "CLOSED"].includes(t.status)).length,
    urgent: tickets.filter(t => t.priority === "URGENT" || t.priority === "HIGH").length,
    mine: session?.user?.id ? tickets.filter(t => t.assignedTo?.id === session.user.id).length : 0,
  }), [tickets, session?.user?.id]);

  useEffect(() => {
    if (!selectedTicketId && filteredTickets.length > 0) {
      setSelectedTicketId(filteredTickets[0].id);
    }
  }, [filteredTickets, selectedTicketId]);

  const handleSendReply = () => {
    if (!selectedTicketId || !replyText.trim()) return;
    mutationReply.mutate({ ticketId: selectedTicketId, message: replyText, isInternal: isInternalNote }, {
      onSuccess: () => { setReplyText(""); setIsInternalNote(false); }
    });
  };

  const handleGenAI = async () => {
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
      else toast.error("Failed to generate reply");
    } catch { toast.error("Error generating AI reply"); }
    finally { setIsGeneratingAI(false); }
  };

  const handleStatusChange = (newStatus: string) => {
    if (!selectedTicketId) return;
    mutationUpdate.mutate({ ticketId: selectedTicketId, updates: { status: newStatus as any } });
  };

  const handleAssignToMe = () => {
    if (!selectedTicketId || !session?.user?.id) return;
    mutationUpdate.mutate({ ticketId: selectedTicketId, updates: { assignedToId: session.user.id } });
  };

  const handleDeleteTicket = async () => {
    if (!selectedTicketId || !confirm("Delete this ticket?")) return;
    try {
      await fetch(`/api/admin/tickets/${selectedTicketId}`, { method: "DELETE" });
      toast.success("Deleted");
      refetch();
      const next = filteredTickets.find(t => t.id !== selectedTicketId);
      setSelectedTicketId(next?.id || null);
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-100">
      {/* Left Panel - Ticket List */}
      <div className="w-[380px] bg-white border-r flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-slate-800">Support</h1>
            <Button variant="ghost" size="icon" onClick={() => refetch()} className="text-slate-400">
              <RefreshCcw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            </Button>
          </div>

          {/* Stats Row */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab("unresolved")}
              className={cn(
                "flex-1 p-2 rounded-lg text-center transition-all",
                activeTab === "unresolved" ? "bg-blue-50 border border-blue-200" : "bg-slate-50 hover:bg-slate-100"
              )}
            >
              <div className="text-lg font-bold text-blue-600">{stats.unresolved}</div>
              <div className="text-[10px] text-slate-500 uppercase">Open</div>
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={cn(
                "flex-1 p-2 rounded-lg text-center transition-all",
                activeTab === "all" ? "bg-slate-200" : "bg-slate-50 hover:bg-slate-100"
              )}
            >
              <div className="text-lg font-bold text-slate-700">{tickets.length}</div>
              <div className="text-[10px] text-slate-500 uppercase">Total</div>
            </button>
            <button
              onClick={() => setActiveTab("mine")}
              className={cn(
                "flex-1 p-2 rounded-lg text-center transition-all",
                activeTab === "mine" ? "bg-purple-50 border border-purple-200" : "bg-slate-50 hover:bg-slate-100"
              )}
            >
              <div className="text-lg font-bold text-purple-600">{stats.mine}</div>
              <div className="text-[10px] text-slate-500 uppercase">Mine</div>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search tickets..."
              className="pl-9 bg-slate-50 border-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Ticket List */}
        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="p-8 text-center text-slate-400">Loading...</div>
          ) : filteredTickets.length === 0 ? (
            <div className="p-8 text-center">
              <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No tickets found</p>
            </div>
          ) : (
            filteredTickets.map(ticket => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                isSelected={selectedTicketId === ticket.id}
                onClick={() => setSelectedTicketId(ticket.id)}
              />
            ))
          )}
        </ScrollArea>
      </div>

      {/* Center Panel - Conversation */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedTicket ? (
          <>
            {/* Ticket Header */}
            <header className="h-16 bg-white border-b px-6 flex items-center justify-between shrink-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <PriorityIndicator priority={selectedTicket.priority} />
                  <h2 className="font-semibold text-slate-800 truncate">
                    #{selectedTicket.ticketNumber} - {selectedTicket.subject}
                  </h2>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                  <span>{selectedTicket.customerEmail}</span>
                  {selectedTicket.assignedTo && (
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" /> {selectedTicket.assignedTo.name}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1">
                      <StatusBadge status={selectedTicket.status} size="md" />
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                      <DropdownMenuItem key={key} onClick={() => handleStatusChange(key)}>
                        <config.icon className={cn("w-4 h-4 mr-2", config.color)} />
                        {config.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleAssignToMe}>
                      <UserPlus className="w-4 h-4 mr-2" /> Assign to Me
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" onClick={handleDeleteTicket}>
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>

            {/* Messages */}
            <ScrollArea className="flex-1 p-6">
              <div className="max-w-2xl mx-auto space-y-4">
                {selectedTicket.messages.map((msg) => (
                  <div key={msg.id} className={cn("flex gap-3", !msg.isFromCustomer && "flex-row-reverse")}>
                    <Avatar className="w-8 h-8 shrink-0">
                      <AvatarFallback className={cn(
                        "text-xs",
                        msg.isFromCustomer ? "bg-slate-200 text-slate-600" : "bg-blue-600 text-white"
                      )}>
                        {msg.isFromCustomer ? selectedTicket.customerName.charAt(0) : "S"}
                      </AvatarFallback>
                    </Avatar>
                    <div className={cn("max-w-[75%]", !msg.isFromCustomer && "text-right")}>
                      <div className={cn(
                        "inline-block px-4 py-2.5 rounded-2xl text-sm",
                        msg.isFromCustomer
                          ? "bg-white border text-slate-800 rounded-tl-sm"
                          : msg.isInternal
                            ? "bg-amber-50 border border-amber-200 text-slate-800 rounded-tr-sm text-left"
                            : "bg-blue-600 text-white rounded-tr-sm text-left"
                      )}>
                        {msg.isInternal && (
                          <div className="text-[10px] font-bold text-amber-600 mb-1 flex items-center gap-1">
                            <Zap className="w-3 h-3" /> Internal Note
                          </div>
                        )}
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 px-1">
                        {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Reply Box */}
            <div className="p-4 bg-white border-t">
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-2 mb-2">
                  <Button
                    size="sm"
                    variant={isInternalNote ? "default" : "ghost"}
                    className={cn("h-7 text-xs", isInternalNote && "bg-amber-100 text-amber-700 hover:bg-amber-200")}
                    onClick={() => setIsInternalNote(!isInternalNote)}
                  >
                    Internal Note
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-7 text-xs text-slate-500">Templates</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {SAVED_REPLIES.map((r) => (
                        <DropdownMenuItem key={r.label} onClick={() => setReplyText(prev => prev + r.text)}>
                          {r.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-purple-600 ml-auto"
                    onClick={handleGenAI}
                    disabled={isGeneratingAI}
                  >
                    <Sparkles className={cn("w-3 h-3 mr-1", isGeneratingAI && "animate-spin")} />
                    {isGeneratingAI ? "..." : "AI"}
                  </Button>
                </div>

                <div className={cn(
                  "rounded-xl border overflow-hidden",
                  isInternalNote && "border-amber-300 bg-amber-50/50"
                )}>
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={isInternalNote ? "Add internal note..." : "Type your reply..."}
                    className="min-h-[80px] border-0 focus-visible:ring-0 resize-none bg-transparent"
                  />
                  <div className="flex justify-end p-2 bg-slate-50 border-t">
                    <Button
                      size="sm"
                      className={cn(isInternalNote ? "bg-amber-600 hover:bg-amber-700" : "bg-blue-600 hover:bg-blue-700")}
                      onClick={handleSendReply}
                      disabled={mutationReply.isPending || !replyText.trim()}
                    >
                      {mutationReply.isPending ? "..." : "Send"}
                      <Send className="w-3 h-3 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
            <p>Select a ticket</p>
          </div>
        )}
      </div>

      {/* Right Panel - Customer Info */}
      {selectedTicket && (
        <div className="w-[300px] bg-white border-l hidden xl:block">
          <CustomerSidebar ticket={selectedTicket} />
        </div>
      )}
    </div>
  );
}
