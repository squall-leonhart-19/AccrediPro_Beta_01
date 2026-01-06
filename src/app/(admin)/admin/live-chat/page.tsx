"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatAnalyticsCards } from "@/components/admin/chat-analytics-cards";
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Clock,
  RefreshCw,
  Sparkles,
  Search,
  Filter,
  StickyNote,
  Zap,
  Mail,
  Trash2,
} from "lucide-react";

interface ChatMessage {
  id: string;
  visitorId: string;
  page: string;
  message: string;
  isFromVisitor: boolean;
  isRead: boolean;
  createdAt: string;
  repliedBy?: string | null;
}

interface Conversation {
  visitorId: string;
  visitorName: string | null;
  visitorEmail: string | null;
  page: string;
  messages: ChatMessage[];
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  notes?: string;
}

// Quick reply templates
const QUICK_REPLIES = [
  { label: "Greeting", text: "Hey! Thanks for reaching out. How can I help you today?" },
  { label: "Price", text: "The FM Certification is just $97 right now (80% off the regular $497 price). It includes 9 international certifications, 30-day mentorship with me, and lifetime access!" },
  { label: "Timeline", text: "You can complete the certification in 30 days, but you have lifetime access so you can go at your own pace. Most students finish in 4-6 weeks." },
  { label: "No Medical Needed", text: "No medical background required! The DEPTH Method teaches everything from scratch. Many of our best practitioners came from completely different careers." },
  { label: "Guarantee", text: "We have a 30-Day Certification Guarantee. Complete the program, pass the exam (you get 3 attempts), and if you don't feel confident, we'll refund you 100%." },
  { label: "Income", text: "Our graduates typically charge $75-200/hour. With just 4-5 clients a week, that's $5,000-10,000/month working from home!" },
  { label: "Follow Up", text: "Just checking in! Did you have any other questions about the certification? I'm here to help." },
];

// Check if visitor is "online" (active in last 5 minutes)
const isOnline = (lastMessageAt: string) => {
  const lastActive = new Date(lastMessageAt).getTime();
  const now = Date.now();
  return now - lastActive < 5 * 60 * 1000;
};

export default function LiveChatAdminPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "unread" | "read">("all");
  const [visitorNotes, setVisitorNotes] = useState("");
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [triggeringAutoReply, setTriggeringAutoReply] = useState(false);
  const [cleaningLeads, setCleaningLeads] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/admin/live-chat");
      const data = await res.json();
      const newConversations = data.conversations || [];
      setConversations(newConversations);

      if (selectedConversation) {
        const updated = newConversations.find((c: Conversation) => c.visitorId === selectedConversation.visitorId);
        if (updated) {
          setSelectedConversation(updated);
          if (!visitorNotes && updated.notes) {
            setVisitorNotes(updated.notes);
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      setError("Failed to load conversations. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  const cleanupLeadsWithoutEmail = async () => {
    if (!confirm("This will delete all leads without email. Continue?")) return;
    setCleaningLeads(true);
    try {
      const res = await fetch("/api/admin/live-chat/leads", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        alert(`Removed ${data.deleted} leads without email`);
        window.location.reload();
      }
    } catch (err) {
      console.error("Cleanup failed:", err);
    } finally {
      setCleaningLeads(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation?.messages]);

  // Load notes when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      const savedNotes = localStorage.getItem(`chat_notes_${selectedConversation.visitorId}`);
      setVisitorNotes(savedNotes || "");
    }
  }, [selectedConversation?.visitorId]);

  const sendReply = async (useAI = false, quickReplyText?: string) => {
    if (!selectedConversation) return;
    const messageToSend = quickReplyText || replyMessage;
    if (!messageToSend.trim() && !useAI) return;

    setSending(true);
    try {
      const res = await fetch("/api/admin/live-chat/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId: selectedConversation.visitorId,
          message: useAI ? null : messageToSend,
          useAI,
        }),
      });

      if (res.ok) {
        setReplyMessage("");
        setShowQuickReplies(false);
        await fetchConversations();
      }
    } catch (error) {
      console.error("Failed to send reply:", error);
    } finally {
      setSending(false);
    }
  };

  const saveNotes = async () => {
    if (!selectedConversation) return;
    setSavingNotes(true);
    try {
      localStorage.setItem(`chat_notes_${selectedConversation.visitorId}`, visitorNotes);
      // Also save to server if API exists
      await fetch("/api/admin/live-chat/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId: selectedConversation.visitorId,
          notes: visitorNotes,
        }),
      }).catch(() => { }); // Silently fail if API doesn't exist
    } finally {
      setSavingNotes(false);
    }
  };

  const deleteConversation = async () => {
    if (!selectedConversation) return;
    if (!confirm(`Delete all messages from ${selectedConversation.visitorName || "this visitor"}? This cannot be undone.`)) return;

    setDeleting(true);
    try {
      const res = await fetch("/api/admin/live-chat/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId: selectedConversation.visitorId }),
      });
      if (res.ok) {
        localStorage.removeItem(`chat_notes_${selectedConversation.visitorId}`);
        setSelectedConversation(null);
        setVisitorNotes("");
        await fetchConversations();
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    } finally {
      setDeleting(false);
    }
  };

  const triggerAutoReply = async () => {
    setTriggeringAutoReply(true);
    try {
      const res = await fetch("/api/chat/sales/auto-reply/trigger", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Auto-reply triggered! Sent ${data.repliesSent || 0} replies.`);
        await fetchConversations();
      } else {
        alert("Failed to trigger auto-reply: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Failed to trigger auto-reply:", error);
      alert("Failed to trigger auto-reply");
    } finally {
      setTriggeringAutoReply(false);
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

  // Filter and search conversations
  const filteredConversations = conversations.filter((conv) => {
    // Filter by read/unread
    if (filterMode === "unread" && conv.unreadCount === 0) return false;
    if (filterMode === "read" && conv.unreadCount > 0) return false;

    // Search by name, email, or message
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const nameMatch = conv.visitorName?.toLowerCase().includes(search);
      const emailMatch = conv.visitorEmail?.toLowerCase().includes(search);
      const messageMatch = conv.lastMessage.toLowerCase().includes(search);
      return nameMatch || emailMatch || messageMatch;
    }
    return true;
  });

  const totalUnread = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Chat</h1>
          <p className="text-gray-500">Manage sales page conversations</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={triggerAutoReply}
            disabled={triggeringAutoReply}
            className="bg-purple-50 text-purple-700 hover:bg-purple-100"
          >
            <Bot className="w-4 h-4 mr-2" />
            {triggeringAutoReply ? "Checking..." : "Auto-Reply Now"}
          </Button>
          <Button variant="outline" onClick={fetchConversations}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <ChatAnalyticsCards
        onCleanup={cleanupLeadsWithoutEmail}
        cleaningLeads={cleaningLeads}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Conversations
              {totalUnread > 0 && (
                <Badge variant="destructive" className="ml-auto">
                  {totalUnread} new
                </Badge>
              )}
            </CardTitle>
            {/* Search and Filter */}
            <div className="mt-3 space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search name, email, message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 text-sm"
                />
              </div>
              <div className="flex gap-1">
                <Button
                  variant={filterMode === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterMode("all")}
                  className="flex-1 text-xs"
                >
                  All
                </Button>
                <Button
                  variant={filterMode === "unread" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterMode("unread")}
                  className="flex-1 text-xs"
                >
                  <Filter className="w-3 h-3 mr-1" />
                  Unread
                </Button>
                <Button
                  variant={filterMode === "read" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterMode("read")}
                  className="flex-1 text-xs"
                >
                  Read
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-420px)]">
              {loading ? (
                <div className="p-4 text-center text-gray-500">Loading...</div>
              ) : error ? (
                <div className="p-4 text-center text-red-500 bg-red-50 m-4 rounded">
                  {error}
                  <Button variant="outline" size="sm" onClick={fetchConversations} className="mt-2 w-full">
                    Retry
                  </Button>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  {searchTerm || filterMode !== "all" ? "No matching conversations" : "No conversations yet"}
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.visitorId}
                    onClick={() => setSelectedConversation(conv)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${selectedConversation?.visitorId === conv.visitorId ? "bg-blue-50" : ""
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gray-200">
                            <User className="w-5 h-5 text-gray-500" />
                          </AvatarFallback>
                        </Avatar>
                        {isOnline(conv.lastMessageAt) && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm truncate">
                            {conv.visitorName || `Visitor ${conv.visitorId.slice(0, 8)}`}
                          </span>
                          {conv.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {conv.unreadCount}
                            </Badge>
                          )}
                        </div>
                        {conv.visitorEmail && (
                          <p className="text-xs text-blue-600 truncate">{conv.visitorEmail}</p>
                        )}
                        <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-400">{formatTime(conv.lastMessageAt)}</span>
                          <Badge variant="outline" className="text-xs">{conv.page}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-lg flex items-center gap-2 flex-wrap">
              {selectedConversation ? (
                <>
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gray-200">
                        <User className="w-4 h-4 text-gray-500" />
                      </AvatarFallback>
                    </Avatar>
                    {isOnline(selectedConversation.lastMessageAt) && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <span>{selectedConversation.visitorName || `Visitor ${selectedConversation.visitorId.slice(0, 8)}`}</span>
                  {isOnline(selectedConversation.lastMessageAt) ? (
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Online</Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-400">Offline</Badge>
                  )}
                  {selectedConversation.visitorEmail && (
                    <a href={`mailto:${selectedConversation.visitorEmail}`} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {selectedConversation.visitorEmail}
                    </a>
                  )}
                  <Badge variant="outline" className="ml-auto">{selectedConversation.page}</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={deleteConversation}
                    disabled={deleting}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <span className="text-gray-500">Select a conversation</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex flex-col h-[calc(100vh-380px)]">
            {selectedConversation ? (
              <>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {selectedConversation.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isFromVisitor ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${msg.isFromVisitor
                            ? "bg-gray-100 text-gray-900"
                            : "bg-[#6B2C40] text-white"
                            }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {msg.isFromVisitor ? (
                              <User className="w-3 h-3" />
                            ) : (
                              <Bot className="w-3 h-3" />
                            )}
                            <span className="text-xs opacity-70">
                              {msg.isFromVisitor ? "Visitor" : (msg.repliedBy || "Sarah M.")}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                          <span className="text-xs opacity-50 mt-1 block">
                            {formatTime(msg.createdAt)}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Visitor Notes Section */}
                <div className="px-4 py-2 border-t bg-yellow-50">
                  <div className="flex items-center gap-2 mb-2">
                    <StickyNote className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Internal Notes</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={saveNotes}
                      disabled={savingNotes}
                      className="ml-auto text-xs h-6"
                    >
                      {savingNotes ? "Saving..." : "Save"}
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Add notes about this visitor (only visible to team)..."
                    value={visitorNotes}
                    onChange={(e) => setVisitorNotes(e.target.value)}
                    className="text-sm h-16 resize-none bg-white"
                  />
                </div>

                {/* Quick Replies */}
                {showQuickReplies && (
                  <div className="px-4 py-2 border-t bg-purple-50">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-800">Quick Replies</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowQuickReplies(false)}
                        className="ml-auto text-xs h-6"
                      >
                        Close
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_REPLIES.map((qr, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          onClick={() => sendReply(false, qr.text)}
                          disabled={sending}
                          className="text-xs bg-white hover:bg-purple-100"
                        >
                          {qr.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reply Input */}
                <div className="p-4 border-t bg-gray-50">
                  <div className="flex gap-2 mb-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendReply(true)}
                      disabled={sending}
                      className="text-purple-600 border-purple-200 hover:bg-purple-50"
                    >
                      <Sparkles className="w-4 h-4 mr-1" />
                      AI Reply
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowQuickReplies(!showQuickReplies)}
                      className="text-orange-600 border-orange-200 hover:bg-orange-50"
                    >
                      <Zap className="w-4 h-4 mr-1" />
                      Quick Replies
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your reply as Sarah..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendReply()}
                      disabled={sending}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => sendReply()}
                      disabled={sending || !replyMessage.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Select a conversation to view messages</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
