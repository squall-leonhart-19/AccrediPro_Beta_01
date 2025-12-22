"use client";

import { useState, useMemo, useEffect } from "react";
import { useTickets, Ticket, useUpdateTicket, useReplyTicket } from "@/hooks/use-tickets";
import { formatDistanceToNow } from "date-fns";
import {
  Search, Filter, RefreshCcw, CheckCircle2, XCircle,
  MessageSquare, User, Clock, Star, Paperclip, Send,
  MoreVertical, Mail, Layout, LifeBuoy, Zap, ChevronRight,
  Sparkles, Trash2, UserPlus, Reply
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

// --- Sub-components for cleaner file ---

// 1. Status Badge
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    NEW: "bg-blue-100 text-blue-700 border-blue-200",
    OPEN: "bg-green-100 text-green-700 border-green-200",
    PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
    RESOLVED: "bg-purple-100 text-purple-700 border-purple-200",
    CLOSED: "bg-gray-100 text-gray-700 border-gray-200",
  };
  return (
    <span className={cn("px-2 py-0.5 rounded text-[10px] uppercase font-bold border tracking-wider", styles[status] || styles.NEW)}>
      {status}
    </span>
  );
};

// 2. Priority Badge
const PriorityBadge = ({ priority }: { priority: string }) => {
  const icons: Record<string, any> = {
    LOW: CheckCircle2,
    MEDIUM: LifeBuoy,
    HIGH: Zap,
    URGENT: XCircle,
  };
  const colors: Record<string, string> = {
    LOW: "text-slate-500",
    MEDIUM: "text-blue-500",
    HIGH: "text-orange-500",
    URGENT: "text-red-500",
  };
  const Icon = icons[priority] || LifeBuoy;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Icon className={cn("w-4 h-4", colors[priority])} />
        </TooltipTrigger>
        <TooltipContent>
          <p>{priority} Priority</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// 3. Ticket List Item
const TicketListItem = ({
  ticket,
  isSelected,
  onClick
}: {
  ticket: Ticket;
  isSelected: boolean;
  onClick: () => void
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex flex-col gap-2 p-4 border-b cursor-pointer transition-colors hover:bg-slate-50",
        isSelected && "bg-blue-50/50 hover:bg-blue-50 border-l-4 border-l-blue-500 pl-[13px]"
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <PriorityBadge priority={ticket.priority} />
          <span className="font-semibold text-sm text-slate-900 line-clamp-1">#{ticket.ticketNumber} {ticket.subject}</span>
        </div>
        <span className="text-xs text-slate-400 whitespace-nowrap">
          {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
        </span>
      </div>

      <div className="flex justify-between items-end">
        <div className="flex items-center gap-2">
          <Avatar className="w-5 h-5">
            <AvatarFallback className="text-[9px] bg-slate-200">{ticket.customerName.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-slate-600 truncate max-w-[120px]">{ticket.customerName}</span>
        </div>
        <StatusBadge status={ticket.status} />
      </div>

      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
        {ticket.messages?.[ticket.messages.length - 1]?.content || "No preview available..."}
      </p>
    </div>
  );
};

const SAVED_REPLIES = [
  { label: "Greeting", text: "Hello,\n\nThank you for reaching out to AccrediPro Support. My name is Sarah and I'll be helping you today." },
  { label: "Investigating", text: "I'm looking into this issue for you right now. Please allow me a few moments to investigate." },
  { label: "Refund Policy", text: "Regarding our refund policy: We offer a 30-day money-back guarantee for all our certification programs if you are not satisfied." },
  { label: "Closing Ticket", text: "I'm glad we could resolve this for you. I'll go ahead and close this ticket now. Please feel free to reach out if you need anything else!" },
];

// --- Main Page Component ---

export default function SupportTicketsPage() {
  const { data: session } = useSession();

  // Filters
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("unresolved"); // 'unresolved' | 'all' | 'mine'

  // Selection
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Queries
  const { data, isLoading, error, refetch } = useTickets(filterStatus, filterPriority, searchTerm);
  const mutationUpdate = useUpdateTicket();
  const mutationReply = useReplyTicket();

  // Derived Logic
  const tickets = data?.tickets || [];

  const filteredTickets = useMemo(() => {
    let list = tickets;

    // Tab Filtering
    if (activeTab === "unresolved") {
      list = list.filter(t => !["RESOLVED", "CLOSED"].includes(t.status));
    } else if (activeTab === "mine") {
      if (session?.user?.id) {
        list = list.filter(t => t.assignedTo?.id === session.user.id);
      }
    }

    return list;
  }, [tickets, activeTab, session?.user?.id]);

  const selectedTicket = useMemo(() =>
    tickets.find(t => t.id === selectedTicketId),
    [tickets, selectedTicketId]);

  // Auto-select first ticket on load if none selected
  useEffect(() => {
    if (!selectedTicketId && filteredTickets.length > 0) {
      setSelectedTicketId(filteredTickets[0].id);
    }
  }, [filteredTickets, selectedTicketId]);

  const handleSendReply = () => {
    if (!selectedTicketId || !replyText.trim()) return;

    mutationReply.mutate({
      ticketId: selectedTicketId,
      message: replyText,
      isInternal: isInternalNote
    }, {
      onSuccess: () => {
        setReplyText("");
        setIsInternalNote(false);
      }
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
      if (data.reply) {
        setReplyText(prev => prev ? prev + "\n\n" + data.reply : data.reply);
      } else {
        toast.error("Failed to generate reply");
      }
    } catch (e) {
      toast.error("Error generating AI reply");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    if (!selectedTicketId) return;
    mutationUpdate.mutate({
      ticketId: selectedTicketId,
      updates: { status: newStatus as any }
    });
  };

  const handleAssignToMe = () => {
    if (!selectedTicketId || !session?.user?.id) return;
    mutationUpdate.mutate({
      ticketId: selectedTicketId,
      updates: { assignedToId: session.user.id }
    });
  };

  const handleDeleteTicket = async () => {
    if (!selectedTicketId) return;
    if (!confirm("Are you sure you want to delete this ticket?")) return;

    try {
      await fetch(`/api/admin/tickets/${selectedTicketId}`, { method: "DELETE" });
      toast.success("Ticket deleted");
      refetch();
      if (filteredTickets.length > 1) {
        const next = filteredTickets.find(t => t.id !== selectedTicketId);
        setSelectedTicketId(next?.id || null);
      } else {
        setSelectedTicketId(null);
      }
    } catch (e) {
      toast.error("Failed to delete ticket");
    }
  };

  const handleSavedReply = (text: string) => {
    setReplyText(prev => prev ? prev + "\n" + text : text);
  };

  // --- Render ---

  if (error) return <div className="p-8 text-red-500">Error loading tickets: {(error as any).message}</div>;

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white">

      {/* 1. Sidebar / Navigation (Left) - Fixed Width */}
      <div className="w-64 border-r bg-slate-50 flex flex-col hidden md:flex">
        <div className="p-4 border-b">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-blue-600" /> Support Desk
          </h2>
        </div>

        <div className="p-2 space-y-1">
          <Button
            variant={activeTab === "unresolved" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("unresolved")}
          >
            <Zap className="w-4 h-4 mr-2" /> Unresolved
            <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-700 hover:bg-blue-100">
              {tickets.filter(t => !["RESOLVED", "CLOSED"].includes(t.status)).length}
            </Badge>
          </Button>
          <Button
            variant={activeTab === "mine" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("mine")}
          >
            <User className="w-4 h-4 mr-2" /> My Tickets
          </Button>
          <Button
            variant={activeTab === "all" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("all")}
          >
            <Layout className="w-4 h-4 mr-2" /> All Tickets
          </Button>
        </div>

        <Separator />

        <div className="p-4 flex-1">
          <p className="text-xs font-semibold text-slate-400 uppercase mb-3">Filters</p>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-full mb-2 bg-white"><SelectValue placeholder="Priority" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="HIGH">High Priority</SelectItem>
              <SelectItem value="URGENT">Urgent</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full bg-white"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 2. Ticket List (Middle) - Resizeable/Fixed */}
      <div className="w-80 md:w-96 border-r flex flex-col bg-white">
        <div className="p-3 border-b flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search tickets..."
              className="pl-9 bg-slate-50 border-slate-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="ghost" size="icon" onClick={() => refetch()} className="text-slate-400">
            <RefreshCcw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="p-8 text-center text-slate-400 text-sm">Loading tickets...</div>
          ) : filteredTickets.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No tickets found.</div>
          ) : (
            filteredTickets.map(ticket => (
              <TicketListItem
                key={ticket.id}
                ticket={ticket}
                isSelected={selectedTicketId === ticket.id}
                onClick={() => setSelectedTicketId(ticket.id)}
              />
            ))
          )}
        </ScrollArea>
      </div>

      {/* 3. Conversation Thread (Right) - Fluid */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50">
        {selectedTicket ? (
          <>
            {/* Header */}
            <header className="h-16 border-b bg-white flex items-center justify-between px-6 shrink-0">
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex flex-col min-w-0">
                  <h1 className="text-lg font-bold text-slate-800 truncate">
                    #{selectedTicket.ticketNumber} - {selectedTicket.subject}
                  </h1>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {selectedTicket.customerName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {selectedTicket.customerEmail}</span>
                    {selectedTicket.assignedTo && (
                      <>
                        <span>•</span>
                        <Badge variant="outline" className="text-[10px] font-normal gap-1">
                          Assigned to {selectedTicket.assignedTo.name}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Quick Actions */}
                <Select value={selectedTicket.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-[130px] h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">New</SelectItem>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-9 w-9">
                      <MoreVertical className="w-4 h-4 text-slate-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleAssignToMe}>
                      <UserPlus className="w-4 h-4 mr-2" /> Assign to Me
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" onClick={handleDeleteTicket}>
                      <Trash2 className="w-4 h-4 mr-2" /> Delete Ticket
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>

            {/* Messages Area */}
            <ScrollArea className="flex-1 px-6 py-6">
              <div className="space-y-6 max-w-3xl mx-auto">
                <div className="flex justify-center">
                  <span className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                    Ticket Started {new Date(selectedTicket.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {selectedTicket.messages.map((msg, i) => (
                  <div key={msg.id} className={cn("flex gap-4", !msg.isFromCustomer && "flex-row-reverse")}>
                    <Avatar className="w-8 h-8 shrink-0">
                      <AvatarFallback className={cn("text-xs", msg.isFromCustomer ? "bg-slate-200" : "bg-blue-600 text-white")}>
                        {msg.isFromCustomer ? selectedTicket.customerName.charAt(0) : "S"}
                      </AvatarFallback>
                    </Avatar>

                    <div className={cn("flex flex-col max-w-[80%]", !msg.isFromCustomer && "items-end")}>
                      <div className={cn(
                        "px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap shadow-sm",
                        msg.isFromCustomer ? "bg-white border text-slate-800 rounded-tl-none" :
                          msg.isInternal ? "bg-yellow-50 border border-yellow-200 text-slate-800 rounded-tr-none" :
                            "bg-blue-600 text-white rounded-tr-none",
                      )}>
                        {msg.isInternal && <div className="text-[10px] uppercase font-bold text-yellow-600 mb-1 flex items-center gap-1"><Zap className="w-3 h-3" /> Internal Note</div>}
                        {msg.content}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1">
                        {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Reply Area */}
            <div className="p-4 border-t bg-white shrink-0">
              <div className="max-w-3xl mx-auto flex flex-col gap-2">
                {/* Quick Replies / Mode Toggle */}
                <div className="flex justify-between items-center px-1">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant={isInternalNote ? "default" : "ghost"}
                      className={cn("h-7 text-xs", isInternalNote ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" : "text-slate-500")}
                      onClick={() => setIsInternalNote(!isInternalNote)}
                    >
                      Internal Note
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-7 text-xs text-slate-500">
                          Saved Replies
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {SAVED_REPLIES.map((reply) => (
                          <DropdownMenuItem key={reply.label} onClick={() => handleSavedReply(reply.text)}>
                            {reply.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                    onClick={handleGenAI}
                    disabled={isGeneratingAI}
                  >
                    <Sparkles className={cn("w-3 h-3 mr-1", isGeneratingAI && "animate-spin")} />
                    {isGeneratingAI ? "Generating..." : "AI Suggest"}
                  </Button>
                </div>

                <div className={cn("relative rounded-lg border shadow-sm focus-within:ring-1 focus-within:ring-blue-500 overflow-hidden", isInternalNote && "ring-1 ring-yellow-400 bg-yellow-50/30")}>
                  <Textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder={isInternalNote ? "Add an internal note..." : "Reply to customer..."}
                    className="min-h-[100px] border-0 focus-visible:ring-0 resize-none p-3 text-sm bg-transparent"
                  />
                  <div className="flex justify-between items-center p-2 bg-slate-50 border-t">
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400"><Paperclip className="w-4 h-4" /></Button>
                    </div>
                    <Button
                      size="sm"
                      className={cn(isInternalNote ? "bg-yellow-600 hover:bg-yellow-700" : "bg-blue-600 hover:bg-blue-700")}
                      onClick={handleSendReply}
                      disabled={mutationReply.isPending || !replyText.trim()}
                    >
                      {mutationReply.isPending ? "Sending..." : (isInternalNote ? "Add Note" : "Send Reply")}
                      <Send className="w-3 h-3 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
            <p>Select a ticket to view conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}
