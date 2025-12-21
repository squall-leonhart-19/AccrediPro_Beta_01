"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";

interface ChatMessage {
  id: string;
  visitorId: string;
  page: string;
  message: string;
  isFromVisitor: boolean;
  isRead: boolean;
  createdAt: string;
}

interface Conversation {
  visitorId: string;
  page: string;
  messages: ChatMessage[];
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export default function LiveChatAdminPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/admin/live-chat");
      const data = await res.json();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    // Poll for new messages every 10 seconds
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation?.messages]);

  const sendReply = async (useAI = false) => {
    if (!selectedConversation || (!replyMessage.trim() && !useAI)) return;

    setSending(true);
    try {
      const res = await fetch("/api/admin/live-chat/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId: selectedConversation.visitorId,
          message: useAI ? null : replyMessage,
          useAI,
        }),
      });

      if (res.ok) {
        setReplyMessage("");
        await fetchConversations();
        // Update selected conversation
        const updated = conversations.find(c => c.visitorId === selectedConversation.visitorId);
        if (updated) setSelectedConversation(updated);
      }
    } catch (error) {
      console.error("Failed to send reply:", error);
    } finally {
      setSending(false);
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Chat</h1>
          <p className="text-gray-500">Manage sales page conversations</p>
        </div>
        <Button variant="outline" onClick={fetchConversations}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Conversations
              {conversations.reduce((acc, c) => acc + c.unreadCount, 0) > 0 && (
                <Badge variant="destructive" className="ml-auto">
                  {conversations.reduce((acc, c) => acc + c.unreadCount, 0)} new
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-320px)]">
              {loading ? (
                <div className="p-4 text-center text-gray-500">Loading...</div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No conversations yet
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.visitorId}
                    onClick={() => setSelectedConversation(conv)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation?.visitorId === conv.visitorId ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gray-200">
                          <User className="w-5 h-5 text-gray-500" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm truncate">
                            Visitor {conv.visitorId.slice(0, 8)}
                          </span>
                          {conv.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {conv.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {conv.lastMessage}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-400">
                            {formatTime(conv.lastMessageAt)}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {conv.page}
                          </Badge>
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
            <CardTitle className="text-lg flex items-center gap-2">
              {selectedConversation ? (
                <>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gray-200">
                      <User className="w-4 h-4 text-gray-500" />
                    </AvatarFallback>
                  </Avatar>
                  <span>Visitor {selectedConversation.visitorId.slice(0, 8)}</span>
                  <Badge variant="outline" className="ml-2">
                    {selectedConversation.page}
                  </Badge>
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
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.isFromVisitor
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
                              {msg.isFromVisitor ? "Visitor" : "Sarah (AI)"}
                            </span>
                          </div>
                          <p className="text-sm">{msg.message}</p>
                          <span className="text-xs opacity-50 mt-1 block">
                            {formatTime(msg.createdAt)}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

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
