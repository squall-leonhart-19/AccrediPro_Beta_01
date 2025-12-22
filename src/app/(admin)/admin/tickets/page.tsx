"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  BarChart,
  Star,
  Zap,
  MoreVertical,
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
  rating?: number;
  ratingComment?: string;
  ratedAt?: string;
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

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface Stats {
  total: number;
  NEW: number;
  OPEN: number;
  PENDING: number;
  RESOLVED: number;
  CLOSED: number;
  avgRating?: number;
  ratingCount?: number;
  newTickets30d?: number;
  resolvedTickets30d?: number;
  recentFeedback?: Array<{
    rating: number;
    ratingComment: string | null;
    customerName: string;
    ratedAt: string;
  }>;
  avgResponseTime?: number;
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

const CANNED_RESPONSES = [
  {
    label: "Greeting",
    text: "Hi there,\n\nThanks for reaching out! I'd be happy to help you with that.\n\nBest,\nAccrediPro Support",
  },
  {
    label: "Need Info",
    text: "Could you please provide a bit more detail so I can investigate this further? Screenshots would also be very helpful if possible.",
  },
  {
    label: "Certificate Help",
    text: "Hi there,\n\nCongratulations on completing your course! Your certificate should be available in your dashboard under the 'Certificates' tab. If you don't see it, try refreshing the page.\n\nLet me know if you still have trouble!",
  },
  {
    label: "Access Issue",
    text: "I've checked your account and reset your access permissions. Please try logging out and logging back in. That should resolve the issue!",
  },
  {
    label: "Resolved",
    text: "I'm glad we could get that sorted out for you! I'll go ahead and mark this ticket as resolved, but feel free to reply if you need anything else.",
  },
];

export default function TicketsPage() {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [assignedToFilter, setAssignedToFilter] = useState("ALL"); // userId or UNASSIGNED
  const [dateRangeFilter, setDateRangeFilter] = useState("ALL"); // TODAY, WEEK, MONTH

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchTickets = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (priorityFilter !== "ALL") params.set("priority", priorityFilter);
      if (categoryFilter !== "ALL") params.set("category", categoryFilter);
      if (assignedToFilter !== "ALL") params.set("assignedTo", assignedToFilter);
      if (dateRangeFilter !== "ALL") params.set("dateRange", dateRangeFilter);
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

  const fetchStaff = async () => {
    try {
      const res = await fetch("/api/admin/staff");
      const data = await res.json();
      setStaffList(data.staff || []);
    } catch (error) {
      console.error("Failed to fetch staff:", error);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [statusFilter, priorityFilter, categoryFilter, assignedToFilter, dateRangeFilter]);

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
    await updateTicketField(selectedTicket.id, { status });
  };

  const assignTicket = async (ticketId: string, assignedToId: string | null) => {
    await updateTicketField(ticketId, { assignedToId });
    // Update local state if needed for assignedTo name, but fetchTicketDetails usually handles reload
  };

  const updateTicketField = async (ticketId: string, data: any) => {
    try {
      const res = await fetch(`/api/admin/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        await fetchTicketDetails(ticketId);
        await fetchTickets();
      }
    } catch (error) {
      console.error("Failed to update ticket:", error);
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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Ticket className="w-6 h-6" />
            Support Tickets
            {stats && (
              <Badge variant="secondary" className="ml-2">
                {stats.OPEN} Open
              </Badge>
            )}
          </h1>
          <p className="text-gray-500">Manage customer support requests</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={showAnalytics ? "default" : "outline"}
            onClick={() => setShowAnalytics(!showAnalytics)}
          >
            <BarChart className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button variant="outline" onClick={fetchTickets}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Analytics Panel */}
      {showAnalytics && stats && (
        <div className="mb-8 animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-medium text-gray-500">Avg Response Time</CardTitle>
                <div className="text-2xl font-bold">2.4h</div> {/* Placeholder - would need backend calc */}
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-medium text-gray-500">Customer Satisfaction</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">{stats.avgRating?.toFixed(1) || "N/A"}</div>
                  {stats.avgRating && (
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-4 h-4" fill={s <= Math.round(stats.avgRating || 0) ? "currentColor" : "none"} />
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-400">{stats.ratingCount || 0} ratings</div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-medium text-gray-500">Resolution Rate (30d)</CardTitle>
                <div className="text-2xl font-bold">
                  {stats.newTickets30d ?
                    Math.round(((stats.resolvedTickets30d || 0) / stats.newTickets30d) * 100)
                    : 100}%
                </div>
                <div className="text-xs text-gray-400">
                  {stats.resolvedTickets30d} resolved / {stats.newTickets30d} new
                </div>
              </CardHeader>
            </Card>
            <Card className="md:col-span-1">
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-medium text-gray-500">Ticket Categories</CardTitle>
                <div className="flex gap-2 flex-wrap mt-2">
                  {Object.keys(CATEGORY_LABELS).slice(0, 4).map(cat => (
                    <Badge key={cat} variant="secondary" className="text-xs">
                      {CATEGORY_LABELS[cat]}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Recent Feedback */}
          {stats.recentFeedback && stats.recentFeedback.length > 0 && (
            <Card className="mb-4">
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-medium">Recent Customer Feedback</CardTitle>
              </CardHeader>
              <CardContent className="py-0 pb-4">
                <div className="space-y-4">
                  {stats.recentFeedback.map((fb, idx) => (
                    <div key={idx} className="flex flex-col gap-1 border-b last:border-0 pb-2">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-sm">{fb.customerName}</span>
                        <div className="flex text-yellow-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className="w-3 h-3" fill={s <= fb.rating ? "currentColor" : "none"} />
                          ))}
                        </div>
                      </div>
                      {fb.ratingComment && (
                        <p className="text-sm text-gray-600 italic">"{fb.ratingComment}"</p>
                      )}
                      <span className="text-xs text-gray-400">{formatTime(fb.ratedAt)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
        {/* Tickets List */}
        <Card className="lg:col-span-1 flex flex-col">
          <CardHeader className="pb-3 px-4 pt-4">
            {/* Search and Filters */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search tickets, names, emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchTickets()}
                  className="pl-10 h-9"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-8 text-xs">
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
                  <SelectTrigger className="h-8 text-xs">
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
                <Select value={assignedToFilter} onValueChange={setAssignedToFilter}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Staff</SelectItem>
                    <SelectItem value="UNASSIGNED">Unassigned</SelectItem>
                    {staffList.map(staff => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.firstName} {staff.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Time</SelectItem>
                    <SelectItem value="TODAY">Today</SelectItem>
                    <SelectItem value="WEEK">This Week</SelectItem>
                    <SelectItem value="MONTH">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              {loading ? (
                <div className="p-4 text-center text-gray-500 text-sm">Loading tickets...</div>
              ) : tickets.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <Ticket className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="font-medium">No tickets found</p>
                  <p className="text-xs mt-1">Try adjusting your filters</p>
                </div>
              ) : (
                <div className="divide-y">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => fetchTicketDetails(ticket.id)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedTicket?.id === ticket.id ? "bg-blue-50 border-l-2 border-blue-500" : "border-l-2 border-transparent"
                        }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {ticket.status === "NEW" && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                          <span className="text-xs text-gray-400 font-mono">#{ticket.ticketNumber}</span>
                          <Badge className={`text-[10px] h-5 px-1.5 ${PRIORITY_COLORS[ticket.priority]} text-white`}>
                            {ticket.priority}
                          </Badge>
                        </div>
                        <span className="text-[10px] text-gray-400">{formatTime(ticket.updatedAt)}</span>
                      </div>

                      <p className="font-semibold text-sm truncate text-gray-900 mb-1">{ticket.subject}</p>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <Avatar className="w-4 h-4">
                            <AvatarFallback className="text-[8px] bg-gray-200">
                              {ticket.customerName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-xs text-gray-600 truncate max-w-[120px]">{ticket.customerName}</p>
                        </div>
                        {ticket.assignedTo ? (
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-gray-500">
                              {ticket.assignedTo.firstName}
                            </span>
                            <User className="w-3 h-3 text-gray-400" />
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-400 italic">Unassigned</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Ticket Detail */}
        <Card className="lg:col-span-2 flex flex-col h-full overflow-hidden">
          {selectedTicket ? (
            <>
              {/* Detail Header */}
              <div className="p-4 border-b bg-white flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-gray-900">#{selectedTicket.ticketNumber}</span>
                      <h2 className="text-lg font-medium text-gray-900 truncate max-w-lg">
                        {selectedTicket.subject}
                      </h2>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {selectedTicket.customerName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {selectedTicket.customerEmail}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {CATEGORY_LABELS[selectedTicket.category] || selectedTicket.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center gap-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8">
                          Status: <span className={`ml-2 w-2 h-2 rounded-full inline-block ${STATUS_COLORS[selectedTicket.status]}`} />
                          <span className="ml-1">{selectedTicket.status}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {["NEW", "OPEN", "PENDING", "RESOLVED", "CLOSED"].map(s => (
                          <DropdownMenuItem key={s} onClick={() => updateTicketStatus(s)}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${STATUS_COLORS[s]}`} />
                            {s}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8">
                          Assigned: <span className="ml-1 font-medium">{selectedTicket.assignedTo?.firstName || "Nobody"}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => assignTicket(selectedTicket.id, null)}>
                          Unassigned
                        </DropdownMenuItem>
                        {staffList.map(staff => (
                          <DropdownMenuItem key={staff.id} onClick={() => assignTicket(selectedTicket.id, staff.id)}>
                            {staff.firstName} {staff.lastName}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={deleteTicket}
                      className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-8 w-8"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Rating Banner if rated */}
                {selectedTicket.rating && (
                  <div className="bg-yellow-50 border border-yellow-100 rounded-md p-3 flex items-start gap-3">
                    <Star className="w-5 h-5 text-yellow-400 mt-0.5" fill="currentColor" />
                    <div>
                      <p className="text-sm font-semibold text-yellow-800">
                        Rated {selectedTicket.rating}/5 stars by customer
                      </p>
                      {selectedTicket.ratingComment && (
                        <p className="text-sm text-yellow-700 mt-1">"{selectedTicket.ratingComment}"</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 bg-gray-50/50 p-4">
                <div className="space-y-6 max-w-3xl mx-auto">
                  {/* Customer Info Card if available */}
                  {selectedTicket.user && (
                    <div className="bg-white rounded-lg border p-4 mb-4 shadow-sm text-sm">
                      <h4 className="font-semibold text-gray-700 mb-2">Customer Context</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-500">Enrolled In:</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {selectedTicket.user.enrollments.map((e, i) => (
                              <Badge key={i} variant="secondary" className="text-[10px]">{e.course.title}</Badge>
                            ))}
                            {selectedTicket.user.enrollments.length === 0 && <span className="italic text-gray-400">No courses</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedTicket.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${msg.isFromCustomer ? "justify-start" : "justify-end"}`}
                    >
                      {msg.isFromCustomer && (
                        <Avatar className="w-8 h-8 mt-1">
                          <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                            {selectedTicket.customerName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div className="max-w-[85%]">
                        <div className={`rounded-xl p-4 shadow-sm ${msg.isInternal
                          ? "bg-yellow-50 border border-yellow-200 text-gray-800"
                          : msg.isFromCustomer
                            ? "bg-white border border-gray-100 text-gray-800"
                            : "bg-[#722F37] text-white"
                          }`}>
                          {msg.isInternal && (
                            <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-700 uppercase tracking-wider mb-2 border-b border-yellow-200 pb-1">
                              <StickyNote className="w-3 h-3" /> Internal Note - {msg.sentBy?.firstName}
                            </div>
                          )}

                          <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                        </div>

                        <div className={`mt-1.5 flex items-center gap-2 text-[10px] text-gray-400 ${msg.isFromCustomer ? "" : "justify-end"
                          }`}>
                          {!msg.isFromCustomer && !msg.isInternal && (
                            <span>{msg.sentBy ? `${msg.sentBy.firstName}` : "Staff"} •</span>
                          )}
                          {formatTime(msg.createdAt)}
                        </div>
                      </div>

                      {!msg.isFromCustomer && (
                        <Avatar className="w-8 h-8 mt-1">
                          <AvatarFallback className="bg-[#722F37] text-white text-xs">
                            {msg.sentBy?.firstName?.charAt(0) || "S"}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Reply Box */}
              <div className="p-4 bg-white border-t space-y-3">
                {/* Canned Responses */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  <Badge variant="outline" className="text-gray-400 whitespace-nowrap">Quick Replies:</Badge>
                  {CANNED_RESPONSES.map((cr, idx) => (
                    <Button
                      key={idx}
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 whitespace-nowrap"
                      onClick={() => setReplyContent(prev => (prev ? prev + "\n\n" : "") + cr.text)}
                    >
                      {cr.label}
                    </Button>
                  ))}
                </div>

                <div className="relative">
                  <Textarea
                    placeholder={isInternalNote ? "Add an internal note (only visible to staff)..." : "Write a public reply..."}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className={`min-h-[100px] pr-24 resize-none ${isInternalNote ? "bg-yellow-50 border-yellow-200 focus-visible:ring-yellow-400" : ""}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) sendReply();
                    }}
                  />

                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <Button
                      variant={isInternalNote ? "default" : "secondary"}
                      size="sm"
                      onClick={() => setIsInternalNote(!isInternalNote)}
                      className={`h-8 w-8 p-0 rounded-full ${isInternalNote ? "bg-yellow-500 hover:bg-yellow-600 text-white" : "text-gray-500"}`}
                      title="Toggle Internal Note"
                    >
                      <StickyNote className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={sendReply}
                      disabled={sending || !replyContent.trim()}
                      className={`h-8 ${isInternalNote ? "bg-yellow-500 hover:bg-yellow-600" : "bg-[#722F37] hover:bg-[#5a2436]"}`}
                    >
                      {sending ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <div className="flex items-center gap-1">
                          <span>{isInternalNote ? "Save Note" : "Send Reply"}</span>
                          <Send className="w-3 h-3 ml-1" />
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/30">
              <Ticket className="w-16 h-16 mb-4 opacity-20" />
              <h3 className="text-lg font-medium text-gray-900">No Ticket Selected</h3>
              <p>Select a ticket from the list to view details and reply.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

