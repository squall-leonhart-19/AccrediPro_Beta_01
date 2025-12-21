"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Ticket,
  Plus,
  Clock,
  CheckCircle,
  MessageSquare,
  ChevronRight,
  Send,
  ArrowLeft,
} from "lucide-react";

interface TicketMessage {
  content: string;
  createdAt: string;
  isFromCustomer: boolean;
}

interface TicketData {
  id: string;
  ticketNumber: number;
  subject: string;
  status: string;
  priority: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
  _count?: { messages: number };
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  NEW: { label: "Submitted", color: "bg-blue-500" },
  OPEN: { label: "In Progress", color: "bg-yellow-500" },
  PENDING: { label: "Awaiting Your Reply", color: "bg-purple-500" },
  RESOLVED: { label: "Resolved", color: "bg-green-500" },
  CLOSED: { label: "Closed", color: "bg-gray-500" },
};

const CATEGORY_OPTIONS = [
  { value: "GENERAL", label: "General Question" },
  { value: "BILLING", label: "Billing & Payments" },
  { value: "ACCESS", label: "Course Access Issue" },
  { value: "TECHNICAL", label: "Technical Problem" },
  { value: "CERTIFICATES", label: "Certificates" },
  { value: "COURSE_CONTENT", label: "Course Content" },
  { value: "REFUND", label: "Refund Request" },
];

export default function SupportPage() {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // New ticket form
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("GENERAL");

  // Reply form
  const [replyContent, setReplyContent] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/tickets/submit");
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const submitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/tickets/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message, category }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(`Ticket #${data.ticketNumber} created! We'll respond within 24 hours.`);
        setSubject("");
        setMessage("");
        setCategory("GENERAL");
        setShowNewTicket(false);
        await fetchTickets();
      }
    } catch (error) {
      console.error("Failed to submit ticket:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const sendReply = async () => {
    if (!selectedTicket || !replyContent.trim()) return;

    setSendingReply(true);
    try {
      const res = await fetch(`/api/tickets/${selectedTicket.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyContent }),
      });

      if (res.ok) {
        setReplyContent("");
        await fetchTickets();
        // Refresh selected ticket
        const updated = tickets.find((t) => t.id === selectedTicket.id);
        if (updated) setSelectedTicket(updated);
      }
    } catch (error) {
      console.error("Failed to send reply:", error);
    } finally {
      setSendingReply(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // View: Ticket Detail
  if (selectedTicket) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Button variant="ghost" onClick={() => setSelectedTicket(null)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tickets
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-gray-400">#{selectedTicket.ticketNumber}</span>
                  <Badge className={`${STATUS_LABELS[selectedTicket.status]?.color || "bg-gray-500"} text-white`}>
                    {STATUS_LABELS[selectedTicket.status]?.label || selectedTicket.status}
                  </Badge>
                </div>
                <CardTitle>{selectedTicket.subject}</CardTitle>
                <CardDescription>
                  Created {formatDate(selectedTicket.createdAt)}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Messages */}
            <div className="space-y-4 mb-6">
              {selectedTicket.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg ${
                    msg.isFromCustomer ? "bg-gray-50" : "bg-[#6B2C40]/10 border-l-4 border-[#6B2C40]"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
                    <span className="font-medium">
                      {msg.isFromCustomer ? "You" : "Support Team"}
                    </span>
                    <span>•</span>
                    <span>{formatDate(msg.createdAt)}</span>
                  </div>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              ))}
            </div>

            {/* Reply Form */}
            {!["RESOLVED", "CLOSED"].includes(selectedTicket.status) && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Add a Reply</h4>
                <Textarea
                  placeholder="Type your message..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="mb-2"
                  rows={4}
                />
                <Button
                  onClick={sendReply}
                  disabled={sendingReply || !replyContent.trim()}
                  className="bg-[#6B2C40] hover:bg-[#5a2436]"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {sendingReply ? "Sending..." : "Send Reply"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // View: New Ticket Form
  if (showNewTicket) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Button variant="ghost" onClick={() => setShowNewTicket(false)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="w-5 h-5" />
              Submit a Support Request
            </CardTitle>
            <CardDescription>
              We typically respond within 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitTicket} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <Input
                  placeholder="Brief description of your issue"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <Textarea
                  placeholder="Please describe your issue in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={6}
                />
              </div>

              <Button
                type="submit"
                disabled={submitting || !subject.trim() || !message.trim()}
                className="w-full bg-[#6B2C40] hover:bg-[#5a2436]"
              >
                {submitting ? "Submitting..." : "Submit Ticket"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // View: Tickets List
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Ticket className="w-6 h-6" />
            Support
          </h1>
          <p className="text-gray-500">View and manage your support requests</p>
        </div>
        <Button onClick={() => setShowNewTicket(true)} className="bg-[#6B2C40] hover:bg-[#5a2436]">
          <Plus className="w-4 h-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
          <CheckCircle className="w-5 h-5" />
          {success}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : tickets.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Ticket className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No support tickets</h3>
            <p className="text-gray-500 mb-4">
              Need help? Submit a ticket and we&apos;ll get back to you.
            </p>
            <Button onClick={() => setShowNewTicket(true)} className="bg-[#6B2C40] hover:bg-[#5a2436]">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Ticket
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <Card
              key={ticket.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedTicket(ticket)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-400">#{ticket.ticketNumber}</span>
                      <Badge className={`${STATUS_LABELS[ticket.status]?.color || "bg-gray-500"} text-white`}>
                        {STATUS_LABELS[ticket.status]?.label || ticket.status}
                      </Badge>
                    </div>
                    <h3 className="font-medium">{ticket.subject}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(ticket.updatedAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {ticket._count?.messages || ticket.messages?.length || 0} messages
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
