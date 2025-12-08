"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  Send,
  Search,
  Users,
  ChevronLeft,
  Circle,
  BookOpen,
  Award,
  GraduationCap,
  Sparkles,
} from "lucide-react";

interface Enrollment {
  id: string;
  progress: number;
  status: string;
  course: {
    id: string;
    title: string;
    slug: string;
  };
}

interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  avatar: string | null;
  role: string;
  bio?: string | null;
  enrollments?: Enrollment[];
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  isRead: boolean;
  createdAt: Date;
}

interface Conversation {
  user: User | null;
  lastMessage: Message | null;
  unreadCount: number;
}

interface MessagesClientProps {
  conversations: Conversation[];
  mentors: User[];
  currentUserId: string;
  currentUserRole?: string;
}

export function MessagesClient({
  conversations: initialConversations,
  mentors,
  currentUserId,
  currentUserRole,
}: MessagesClientProps) {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMentors, setShowMentors] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isAdmin = currentUserRole === "ADMIN" || currentUserRole === "INSTRUCTOR";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = useCallback(async (userId: string) => {
    try {
      const response = await fetch(`/api/messages?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setMessages(data.data);
        scrollToBottom();
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id);
      const interval = setInterval(() => fetchMessages(selectedUser.id), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedUser, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    setLoading(true);

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: selectedUser.id,
          content: newMessage,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [...prev, data.data]);
        setNewMessage("");

        setConversations((prev) => {
          const existingIndex = prev.findIndex(
            (c) => c.user?.id === selectedUser.id
          );
          const updatedConversation = {
            user: selectedUser,
            lastMessage: data.data,
            unreadCount: 0,
          };

          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = updatedConversation;
            return updated.sort(
              (a, b) =>
                new Date(b.lastMessage?.createdAt || 0).getTime() -
                new Date(a.lastMessage?.createdAt || 0).getTime()
            );
          }

          return [updatedConversation, ...prev];
        });
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setLoading(false);
    }
  };

  const startConversation = (user: User) => {
    setSelectedUser(user);
    setShowMentors(false);
  };

  const getInitials = (user: User) => {
    return `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase() || "U";
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return "Today";
    }
    if (d.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    const fullName = `${conv.user?.firstName} ${conv.user?.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || conv.user?.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const roleColors: Record<string, string> = {
    ADMIN: "bg-red-100 text-red-700 border-red-200",
    INSTRUCTOR: "bg-purple-100 text-purple-700 border-purple-200",
    MENTOR: "bg-blue-100 text-blue-700 border-blue-200",
    STUDENT: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4 animate-fade-in">
      {/* Conversations List */}
      <Card className={cn(
        "w-96 flex-shrink-0 flex flex-col bg-white border-gray-200",
        selectedUser ? "hidden lg:flex" : "flex"
      )}>
        <CardHeader className="pb-3 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <div className="w-8 h-8 rounded-lg bg-burgundy-100 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-burgundy-600" />
              </div>
              Messages
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMentors(!showMentors)}
              className={cn(showMentors && "bg-burgundy-50 text-burgundy-600")}
            >
              <Users className="w-4 h-4 mr-1" />
              {showMentors ? "Chats" : "Coaches"}
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              className="pl-9 bg-gray-50 border-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-2">
          {showMentors ? (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 px-2 py-1 flex items-center gap-1">
                <GraduationCap className="w-3 h-3" />
                Available Coaches & Mentors
              </p>
              {mentors.map((mentor) => (
                <button
                  key={mentor.id}
                  onClick={() => startConversation(mentor)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-burgundy-50 transition-all text-left group"
                >
                  <Avatar className="h-11 w-11 ring-2 ring-gold-400/20">
                    <AvatarImage src={mentor.avatar || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-gold-400 to-gold-600 text-burgundy-900 font-semibold">
                      {getInitials(mentor)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate group-hover:text-burgundy-700">
                      {mentor.firstName} {mentor.lastName}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge className={cn("text-xs border", roleColors[mentor.role])}>
                        {mentor.role}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <Circle className="w-2 h-2 fill-current" />
                        Available
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : filteredConversations.length > 0 ? (
            <div className="space-y-1">
              {filteredConversations.map((conv) => {
                if (!conv.user) return null;
                const isSelected = selectedUser?.id === conv.user.id;

                return (
                  <button
                    key={conv.user.id}
                    onClick={() => setSelectedUser(conv.user)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left",
                      isSelected
                        ? "bg-burgundy-50 border border-burgundy-200 shadow-sm"
                        : "hover:bg-gray-50"
                    )}
                  >
                    <div className="relative">
                      <Avatar className="h-11 w-11">
                        <AvatarImage src={conv.user.avatar || undefined} />
                        <AvatarFallback className="bg-burgundy-100 text-burgundy-700">
                          {getInitials(conv.user)}
                        </AvatarFallback>
                      </Avatar>
                      {conv.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-burgundy-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={cn(
                          "font-medium truncate",
                          conv.unreadCount > 0 ? "text-gray-900" : "text-gray-700"
                        )}>
                          {conv.user.firstName} {conv.user.lastName}
                        </p>
                        {conv.lastMessage && (
                          <span className="text-xs text-gray-400">
                            {formatDate(conv.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>
                      {conv.lastMessage && (
                        <p className={cn(
                          "text-sm truncate",
                          conv.unreadCount > 0 ? "text-gray-700 font-medium" : "text-gray-500"
                        )}>
                          {conv.lastMessage.senderId === currentUserId && "You: "}
                          {conv.lastMessage.content}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 px-4">
              <div className="w-16 h-16 bg-gradient-to-br from-burgundy-100 to-burgundy-50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <MessageSquare className="w-8 h-8 text-burgundy-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Start a Conversation</h3>
              <p className="text-gray-500 text-sm mb-4">Connect with your coaches and mentors for guidance and support</p>
              <Button
                onClick={() => setShowMentors(true)}
                className="gap-2 bg-burgundy-600 hover:bg-burgundy-700"
              >
                <GraduationCap className="w-4 h-4" />
                Message a Coach
              </Button>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-3">Tips for great conversations:</p>
                <ul className="text-xs text-gray-500 space-y-1.5 text-left">
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-3 h-3 text-gold-500 mt-0.5 flex-shrink-0" />
                    <span>Share your wins and challenges</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-3 h-3 text-gold-500 mt-0.5 flex-shrink-0" />
                    <span>Ask questions about your courses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-3 h-3 text-gold-500 mt-0.5 flex-shrink-0" />
                    <span>Request feedback on your progress</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className={cn(
        "flex-1 flex flex-col bg-white border-gray-200",
        !selectedUser ? "hidden lg:flex" : "flex"
      )}>
        {selectedUser ? (
          <>
            {/* Chat Header with User Info */}
            <CardHeader className="pb-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setSelectedUser(null)}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Avatar className="h-11 w-11">
                    <AvatarImage src={selectedUser.avatar || undefined} />
                    <AvatarFallback className="bg-burgundy-100 text-burgundy-700">
                      {getInitials(selectedUser)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <Circle className="w-2 h-2 fill-current" />
                        Online
                      </span>
                      <Badge className={cn("text-xs border", roleColors[selectedUser.role])}>
                        {selectedUser.role}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Show enrolled courses for admin/coach view */}
                {isAdmin && selectedUser.enrollments && selectedUser.enrollments.length > 0 && (
                  <div className="hidden md:block">
                    <p className="text-xs text-gray-500 mb-1">Enrolled Courses</p>
                    <div className="flex flex-wrap gap-2 max-w-md">
                      {selectedUser.enrollments.map((enrollment) => (
                        <div
                          key={enrollment.id}
                          className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 text-sm"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-burgundy-600" />
                          <span className="font-medium text-gray-700 truncate max-w-[150px]">
                            {enrollment.course.title}
                          </span>
                          <div className="flex items-center gap-1">
                            <Progress value={enrollment.progress} className="w-12 h-1.5" />
                            <span className="text-xs text-gray-500">
                              {Math.round(enrollment.progress)}%
                            </span>
                          </div>
                          {enrollment.status === "COMPLETED" && (
                            <Award className="w-3.5 h-3.5 text-gold-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile course info */}
              {isAdmin && selectedUser.enrollments && selectedUser.enrollments.length > 0 && (
                <div className="md:hidden mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    Student&apos;s Courses
                  </p>
                  <div className="space-y-2">
                    {selectedUser.enrollments.map((enrollment) => (
                      <div
                        key={enrollment.id}
                        className="flex items-center justify-between bg-gray-50 rounded-lg p-2"
                      >
                        <span className="text-sm font-medium text-gray-700 truncate flex-1">
                          {enrollment.course.title}
                        </span>
                        <div className="flex items-center gap-2 ml-2">
                          <Progress value={enrollment.progress} className="w-16 h-1.5" />
                          <span className="text-xs text-gray-500 w-8">
                            {Math.round(enrollment.progress)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center h-full">
                  <div className="text-center">
                    <Sparkles className="w-12 h-12 text-gold-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">Start the conversation</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Send a message to begin chatting
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((message, index) => {
                  const isOwn = message.senderId === currentUserId;
                  const showDate =
                    index === 0 ||
                    new Date(message.createdAt).toDateString() !==
                      new Date(messages[index - 1].createdAt).toDateString();

                  return (
                    <div key={message.id}>
                      {showDate && (
                        <div className="flex justify-center my-4">
                          <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full shadow-sm">
                            {formatDate(message.createdAt)}
                          </span>
                        </div>
                      )}
                      <div
                        className={cn(
                          "flex",
                          isOwn ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm",
                            isOwn
                              ? "bg-gradient-to-br from-burgundy-600 to-burgundy-700 text-white rounded-br-md"
                              : "bg-white text-gray-900 rounded-bl-md border border-gray-100"
                          )}
                        >
                          <p className="leading-relaxed">{message.content}</p>
                          <p
                            className={cn(
                              "text-xs mt-1",
                              isOwn ? "text-burgundy-200" : "text-gray-400"
                            )}
                          >
                            {formatTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-100 bg-white">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-gray-50 border-gray-200 focus:bg-white"
                />
                <Button
                  type="submit"
                  disabled={loading || !newMessage.trim()}
                  className="bg-burgundy-600 hover:bg-burgundy-700 px-6"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
            <div className="text-center px-8 max-w-md">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-burgundy-100 to-burgundy-50 rounded-3xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-12 h-12 text-burgundy-600" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gold-400 rounded-xl flex items-center justify-center shadow-md">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Your Messages
              </h3>
              <p className="text-gray-500 mb-6">
                Select a conversation from the list or connect with your coach for personalized guidance on your learning journey
              </p>
              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <GraduationCap className="w-6 h-6 text-burgundy-600 mb-2" />
                  <p className="text-sm font-medium text-gray-900">1:1 Coaching</p>
                  <p className="text-xs text-gray-500 mt-1">Get personal guidance</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <Award className="w-6 h-6 text-gold-500 mb-2" />
                  <p className="text-sm font-medium text-gray-900">Track Progress</p>
                  <p className="text-xs text-gray-500 mt-1">Share your achievements</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
