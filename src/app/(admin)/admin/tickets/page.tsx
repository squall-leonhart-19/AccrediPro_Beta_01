"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Ticket,
  Send,
  Search,
  Filter,
  User,
  Clock,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Mail,
  StickyNote,
  Trash2,
  ChevronRight,
} from "lucide-react";

interface TicketMessage {
  id: string;
  content: string;
  isFromCustomer: boolean;
  isInternal: boolean;
  createdAt: string;
  sentBy?: { firstName: string; lastName: string } | null;
}

interface TicketData {
  id: string;
  ticketNumber: number;
  subject: string;
  status: string;
  priority: string;
  category: string;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  updatedAt: string;
  firstResponseAt: string | null;
  resolvedAt: string | null;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string | null;
    enrollments: { course: { title: string } }[];
  } | null;
  assignedTo?: { id: string; firstName: string; lastName: string } | null;
  messages: TicketMessage[];
  _count?: { messages: number };
}

interface Stats {
  total: number;
  NEW: number;
  OPEN: number;
  PENDING: number;
  RESOLVED: number;
  CLOSED: number;
}

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-blue-500",
  OPEN: "bg-yellow-500",
  PENDING: "bg-purple-500",
  RESOLVED: "bg-green-500",
  CLOSED: "bg-gray-500",
};

const PRIORITY_COLORS: Record<string, string> = {
  LOW: "bg-gray-400",
  MEDIUM: "bg-blue-400",
  HIGH: "bg-orange-500",
  URGENT: "bg-red-600",
};

const CATEGORY_LABELS: Record<string, string> = {
  BILLING: "Billing",
  TECHNICAL: "Technical",
  ACCESS: "Course Access",
  CERTIFICATES: "Certificates",
  COURSE_CONTENT: "Course Content",
  REFUND: "Refund",
  GENERAL: "General",
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchTickets = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (priorityFilter !== "ALL") params.set("priority", priorityFilter);
      if (categoryFilter !== "ALL") params.set("category", categoryFilter);
      if (searchTerm) params.set("search", searchTerm);

      const res = await fetch(`/api/admin/tickets?${params}`);
      const data = await res.json();
      setTickets(data.tickets || []);
      setStats(data.stats || null);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketDetails = async (ticketId: string) => {
    try {
      const res = await fetch(`/api/admin/tickets/${ticketId}`);
      const data = await res.json();
      setSelectedTicket(data.ticket);
    } catch (error) {
      console.error("Failed to fetch ticket details:", error);
    }
  };

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [statusFilter, priorityFilter, categoryFilter]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedTicket?.messages]);

  const sendReply = async () => {
    if (!selectedTicket || !replyContent.trim()) return;

    setSending(true);
    try {
      const res = await fetch(`/api/admin/tickets/${selectedTicket.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: replyContent,
          isInternal: isInternalNote,
        }),
      });

      if (res.ok) {
        setReplyContent("");
        setIsInternalNote(false);
        await fetchTicketDetails(selectedTicket.id);
        await fetchTickets();
      }
    } catch (error) {
      console.error("Failed to send reply:", error);
    } finally {
      setSending(false);
    }
  };

  const updateTicketStatus = async (status: string) => {
    if (!selectedTicket) return;

    try {
      const res = await fetch(`/api/admin/tickets/${selectedTicket.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        await fetchTicketDetails(selectedTicket.id);
        await fetchTickets();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const deleteTicket = async () => {
    if (!selectedTicket) return;
    if (!confirm(`Delete ticket #${selectedTicket.ticketNumber}? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/admin/tickets/${selectedTicket.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSelectedTicket(null);
        await fetchTickets();
      }
    } catch (error) {
      console.error("Failed to delete ticket:", error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="p-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Ticket className="w-6 h-6" />
            Support Tickets
          </h1>
          <p className="text-gray-500">Manage customer support requests</p>
        </div>
        <Button variant="outline" onClick={fetchTickets}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Bar */}
      {stats && (
        <div className="grid grid-cols-6 gap-4 mb-6">
          <Card className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-500">Total</div>
          </Card>
          <Card className="p-4 border-l-4 border-blue-500">
            <div className="text-2xl font-bold text-blue-600">{stats.NEW}</div>
            <div className="text-sm text-gray-500">New</div>
          </Card>
          <Card className="p-4 border-l-4 border-yellow-500">
            <div className="text-2xl font-bold text-yellow-600">{stats.OPEN}</div>
            <div className="text-sm text-gray-500">Open</div>
          </Card>
          <Card className="p-4 border-l-4 border-purple-500">
            <div className="text-2xl font-bold text-purple-600">{stats.PENDING}</div>
            <div className="text-sm text-gray-500">Pending</div>
          </Card>
          <Card className="p-4 border-l-4 border-green-500">
            <div className="text-2xl font-bold text-green-600">{stats.RESOLVED}</div>
            <div className="text-sm text-gray-500">Resolved</div>
          </Card>
          <Card className="p-4 border-l-4 border-gray-400">
            <div className="text-2xl font-bold text-gray-600">{stats.CLOSED}</div>
            <div className="text-sm text-gray-500">Closed</div>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-320px)]">
        {/* Tickets List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Ticket className="w-5 h-5" />
              Tickets
            </CardTitle>
            {/* Search and Filters */}
            <div className="mt-3 space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchTickets()}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="NEW">New</SelectItem>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Priority</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-520px)]">
              {loading ? (
                <div className="p-4 text-center text-gray-500">Loading...</div>
              ) : tickets.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No tickets found</div>
              ) : (
                tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => fetchTicketDetails(ticket.id)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedTicket?.id === ticket.id ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${STATUS_COLORS[ticket.status]}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">#{ticket.ticketNumber}</span>
                          <Badge className={`text-xs ${PRIORITY_COLORS[ticket.priority]} text-white`}>
                            {ticket.priority}
                          </Badge>
                        </div>
                        <p className="font-medium text-sm truncate mt-1">{ticket.subject}</p>
                        <p className="text-xs text-gray-500">{ticket.customerName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-400">{formatTime(ticket.updatedAt)}</span>
                          <Badge variant="outline" className="text-xs">
                            {CATEGORY_LABELS[ticket.category] || ticket.category}
                          </Badge>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Ticket Detail */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 border-b">
            {selectedTicket ? (
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-gray-400">#{selectedTicket.ticketNumber}</span>
                    <Badge className={`${STATUS_COLORS[selectedTicket.status]} text-white`}>
                      {selectedTicket.status}
                    </Badge>
                    <Badge className={`${PRIORITY_COLORS[selectedTicket.priority]} text-white`}>
                      {selectedTicket.priority}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{selectedTicket.subject}</CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{selectedTicket.customerName}</span>
                    </div>
                    <a href={`mailto:${selectedTicket.customerEmail}`} className="flex items-center gap-1 text-blue-600 hover:underline">
                      <Mail className="w-4 h-4" />
                      {selectedTicket.customerEmail}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={selectedTicket.status} onValueChange={updateTicketStatus}>
                    <SelectTrigger className="w-32">
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
                  <Button variant="outline" size="icon" onClick={deleteTicket} className="text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <CardTitle className="text-lg text-gray-500">Select a ticket</CardTitle>
            )}
          </CardHeader>
          <CardContent className="p-0 flex flex-col h-[calc(100vh-480px)]">
            {selectedTicket ? (
              <>
                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {selectedTicket.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isFromCustomer ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.isInternal
                              ? "bg-yellow-50 border border-yellow-200"
                              : msg.isFromCustomer
                              ? "bg-gray-100"
                              : "bg-[#6B2C40] text-white"
                          }`}
                        >
                          {msg.isInternal && (
                            <div className="flex items-center gap-1 text-xs text-yellow-600 mb-1">
                              <StickyNote className="w-3 h-3" />
                              Internal Note
                            </div>
                          )}
                          <div className="flex items-center gap-2 mb-1 text-xs opacity-70">
                            {msg.isFromCustomer ? (
                              <>
                                <User className="w-3 h-3" />
                                Customer
                              </>
                            ) : (
                              <>
                                <User className="w-3 h-3" />
                                {msg.sentBy
                                  ? `${msg.sentBy.firstName} ${msg.sentBy.lastName}`
                                  : "Staff"}
                              </>
                            )}
                            <span>• {formatTime(msg.createdAt)}</span>
                          </div>
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Reply Box */}
                <div className="p-4 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <Button
                      variant={isInternalNote ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsInternalNote(!isInternalNote)}
                      className={isInternalNote ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                    >
                      <StickyNote className="w-4 h-4 mr-1" />
                      {isInternalNote ? "Internal Note" : "Send Email"}
                    </Button>
                    {!isInternalNote && (
                      <span className="text-xs text-gray-500">
                        <Mail className="w-3 h-3 inline mr-1" />
                        Email will be sent to customer
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Textarea
                      placeholder={isInternalNote ? "Add internal note..." : "Type your reply..."}
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="flex-1 min-h-[80px]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                          sendReply();
                        }
                      }}
                    />
                    <Button
                      onClick={sendReply}
                      disabled={sending || !replyContent.trim()}
                      className={isInternalNote ? "bg-yellow-500 hover:bg-yellow-600" : "bg-[#6B2C40] hover:bg-[#5a2436]"}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Ticket className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Select a ticket to view details</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
