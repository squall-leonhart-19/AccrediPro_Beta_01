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
  GraduationCap,
  Send,
  User,
  Clock,
  RefreshCw,
  Search,
  Filter,
  StickyNote,
  Zap,
  Mail,
  DollarSign,
  Target,
  Briefcase,
  Sparkles,
  CheckCircle,
  XCircle,
  AlertCircle,
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

interface ScholarshipApplication {
  visitorId: string;
  visitorName: string | null;
  visitorEmail: string | null;
  page: string;
  messages: ChatMessage[];
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  notes?: string;
  // Parsed from application message
  applicationData?: {
    specialization?: string;
    incomeGoal?: string;
    currentIncome?: string;
    experience?: string;
    clinicalReady?: string;
    labInterest?: string;
    pastCerts?: string;
    missingSkill?: string;
    commitment?: string;
    vision?: string;
    startTimeline?: string;
  };
  // Scholarship status
  status?: "pending" | "approved" | "declined" | "negotiating";
  offeredAmount?: string;
}

// Scholarship quick reply templates
const SCHOLARSHIP_REPLIES = [
  {
    label: "Acknowledge",
    text: "Hey! I just received your scholarship application. Give me a moment to review everything... 💜",
  },
  {
    label: "Approved - Full",
    text: "Great news! I've reviewed your application and I'm happy to approve a full scholarship for you. The FM Certification is normally $1,997 but with your scholarship, you'll only pay [AMOUNT]. This covers everything - 9 certifications, mentorship, and lifetime access. Ready to get started? 🎉",
  },
  {
    label: "Approved - Partial",
    text: "I've reviewed your application and I want to make this work for you. Based on what you shared, I can offer you a partial scholarship. Instead of $1,997, your investment would be [AMOUNT]. This still includes everything - all 9 certifications, the 30-day mentorship, and lifetime access. How does that sound?",
  },
  {
    label: "Counter Offer",
    text: "I appreciate you sharing what's comfortable for you. Here's what I can do - I can meet you halfway at [AMOUNT]. This is the best scholarship rate I can offer right now. It still includes everything you need to build your practice. What do you think?",
  },
  {
    label: "Ask Budget",
    text: "Thanks for applying! To help me find the right scholarship level for you, can you tell me what investment feels comfortable for your situation right now? There's no wrong answer - I just want to see how we can make this work for you.",
  },
  {
    label: "Payment Plan",
    text: "I understand budget can be tight. What if we set up a payment plan? You could start with [AMOUNT] today and then [AMOUNT]/month for [X] months. This way you can get started right away without the full upfront cost. Would that work better?",
  },
  {
    label: "Follow Up",
    text: "Hey! Just checking in on your scholarship application. Did you have any questions about the offer? I'm here to help! 💜",
  },
  {
    label: "Decline - Gentle",
    text: "Thank you so much for your interest. Unfortunately, I'm not able to offer a scholarship at that level right now. However, I'd love to keep you on our waitlist for when more scholarship spots open up. In the meantime, is there a higher amount that might work for you?",
  },
];

// Parse application data from the initial message
function parseApplicationMessage(messages: ChatMessage[]): ScholarshipApplication["applicationData"] {
  const applicationMsg = messages.find(m => m.message.includes("SCHOLARSHIP APPLICATION"));
  if (!applicationMsg) return undefined;

  const lines = applicationMsg.message.split("\n");
  const data: ScholarshipApplication["applicationData"] = {};

  lines.forEach(line => {
    if (line.startsWith("Specialization:")) data.specialization = line.replace("Specialization:", "").trim();
    if (line.startsWith("Income Goal:")) data.incomeGoal = line.replace("Income Goal:", "").trim();
    if (line.startsWith("Current Income:")) data.currentIncome = line.replace("Current Income:", "").trim();
    if (line.startsWith("Experience:")) data.experience = line.replace("Experience:", "").trim();
    if (line.startsWith("Clinical Readiness:")) data.clinicalReady = line.replace("Clinical Readiness:", "").trim();
    if (line.startsWith("Lab Interest:")) data.labInterest = line.replace("Lab Interest:", "").trim();
    if (line.startsWith("Past Certs:")) data.pastCerts = line.replace("Past Certs:", "").trim();
    if (line.startsWith("Missing Skill:")) data.missingSkill = line.replace("Missing Skill:", "").trim();
    if (line.startsWith("Commitment:")) data.commitment = line.replace("Commitment:", "").trim();
    if (line.startsWith("Vision:")) data.vision = line.replace("Vision:", "").trim();
    if (line.startsWith("Start Timeline:")) data.startTimeline = line.replace("Start Timeline:", "").trim();
  });

  return data;
}

// Check if visitor is "online" (active in last 5 minutes)
const isOnline = (lastMessageAt: string) => {
  const lastActive = new Date(lastMessageAt).getTime();
  const now = Date.now();
  return now - lastActive < 5 * 60 * 1000;
};

export default function ScholarshipsClient() {
  const [applications, setApplications] = useState<ScholarshipApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<ScholarshipApplication | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "unread" | "read">("all");
  const [visitorNotes, setVisitorNotes] = useState("");
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/admin/scholarships");
      const data = await res.json();
      const newApps: ScholarshipApplication[] = (data.applications || []).map((app: ScholarshipApplication) => ({
        ...app,
        applicationData: parseApplicationMessage(app.messages),
      }));
      setApplications(newApps);

      if (selectedApp) {
        const updated = newApps.find(a => a.visitorId === selectedApp.visitorId);
        if (updated) {
          setSelectedApp(updated);
          if (!visitorNotes && updated.notes) {
            setVisitorNotes(updated.notes);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch scholarship applications:", err);
      setError("Failed to load applications. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    const interval = setInterval(() => {
      if (!document.hidden) {
        fetchApplications();
      }
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedApp?.messages]);

  useEffect(() => {
    if (selectedApp) {
      try {
        const savedNotes = localStorage.getItem(`scholarship_notes_${selectedApp.visitorId}`);
        setVisitorNotes(savedNotes || "");
      } catch {
        setVisitorNotes("");
      }
    }
  }, [selectedApp?.visitorId]);

  const sendReply = async (quickReplyText?: string) => {
    if (!selectedApp) return;
    const messageToSend = quickReplyText || replyMessage;
    if (!messageToSend.trim()) return;

    setSending(true);
    try {
      const res = await fetch("/api/admin/scholarships/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId: selectedApp.visitorId,
          message: messageToSend,
        }),
      });

      if (res.ok) {
        setReplyMessage("");
        setShowQuickReplies(false);
        await fetchApplications();
      }
    } catch (err) {
      console.error("Failed to send reply:", err);
    } finally {
      setSending(false);
    }
  };

  const saveNotes = async () => {
    if (!selectedApp) return;
    setSavingNotes(true);
    try {
      localStorage.setItem(`scholarship_notes_${selectedApp.visitorId}`, visitorNotes);
      await fetch("/api/admin/live-chat/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId: selectedApp.visitorId,
          notes: visitorNotes,
        }),
      }).catch(() => {});
    } finally {
      setSavingNotes(false);
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

  // Filter conversations that are scholarship-related
  const filteredApps = applications.filter((app) => {
    if (filterMode === "unread" && app.unreadCount === 0) return false;
    if (filterMode === "read" && app.unreadCount > 0) return false;

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const nameMatch = app.visitorName?.toLowerCase().includes(search);
      const emailMatch = app.visitorEmail?.toLowerCase().includes(search);
      const messageMatch = app.lastMessage.toLowerCase().includes(search);
      return nameMatch || emailMatch || messageMatch;
    }
    return true;
  });

  const totalUnread = applications.reduce((acc, a) => acc + a.unreadCount, 0);

  // Get user's stated amount from their messages (if any)
  const getUserOfferedAmount = (messages: ChatMessage[]) => {
    const userMessages = messages.filter(m => m.isFromVisitor && !m.message.includes("SCHOLARSHIP APPLICATION"));
    for (const msg of userMessages) {
      // Look for dollar amounts in user messages
      const match = msg.message.match(/\$?(\d{1,3}(?:,?\d{3})*(?:\.\d{2})?)/);
      if (match) {
        return match[0].startsWith("$") ? match[0] : `$${match[0]}`;
      }
    }
    return null;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-[#722f37]" />
            Scholarship Applications
          </h1>
          <p className="text-gray-500">Manage ASI Scholarship requests (Manual responses only)</p>
        </div>
        <Button variant="outline" onClick={fetchApplications}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{applications.length}</p>
                <p className="text-sm text-gray-500">Total Applications</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalUnread}</p>
                <p className="text-sm text-gray-500">Needs Response</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {applications.filter(a => a.messages.some(m => !m.isFromVisitor)).length}
                </p>
                <p className="text-sm text-gray-500">Responded</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">$1,997</p>
                <p className="text-sm text-gray-500">Full Price</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-300px)]">
        {/* Applications List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#d4af37]" />
              Applications
              {totalUnread > 0 && (
                <Badge variant="destructive" className="ml-auto">
                  {totalUnread} new
                </Badge>
              )}
            </CardTitle>
            <div className="mt-3 space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search name, email..."
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
                  Pending
                </Button>
                <Button
                  variant={filterMode === "read" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterMode("read")}
                  className="flex-1 text-xs"
                >
                  Responded
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-520px)]">
              {loading ? (
                <div className="p-4 text-center text-gray-500">Loading...</div>
              ) : error ? (
                <div className="p-4 text-center text-red-500 bg-red-50 m-4 rounded">
                  {error}
                  <Button variant="outline" size="sm" onClick={fetchApplications} className="mt-2 w-full">
                    Retry
                  </Button>
                </div>
              ) : filteredApps.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  {searchTerm || filterMode !== "all" ? "No matching applications" : "No scholarship applications yet"}
                </div>
              ) : (
                filteredApps.map((app) => {
                  const offeredAmount = getUserOfferedAmount(app.messages);
                  return (
                    <div
                      key={app.visitorId}
                      onClick={() => setSelectedApp(app)}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedApp?.visitorId === app.visitorId ? "bg-purple-50 border-l-4 border-l-[#722f37]" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-[#722f37]/10 text-[#722f37]">
                              {app.visitorName?.[0]?.toUpperCase() || <User className="w-5 h-5" />}
                            </AvatarFallback>
                          </Avatar>
                          {isOnline(app.lastMessageAt) && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm truncate">
                              {app.visitorName || `Applicant`}
                            </span>
                            {app.unreadCount > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {app.unreadCount}
                              </Badge>
                            )}
                          </div>
                          {app.visitorEmail && (
                            <p className="text-xs text-blue-600 truncate">{app.visitorEmail}</p>
                          )}
                          {offeredAmount && (
                            <p className="text-xs text-green-600 font-medium flex items-center gap-1 mt-0.5">
                              <DollarSign className="w-3 h-3" />
                              Offered: {offeredAmount}
                            </p>
                          )}
                          <p className="text-sm text-gray-500 truncate mt-0.5">
                            {app.lastMessage.includes("SCHOLARSHIP APPLICATION")
                              ? "New application submitted"
                              : app.lastMessage}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-400">{formatTime(app.lastMessageAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat + Application Details */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-lg flex items-center gap-2 flex-wrap">
              {selectedApp ? (
                <>
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-[#722f37]/10 text-[#722f37]">
                        {selectedApp.visitorName?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
                      </AvatarFallback>
                    </Avatar>
                    {isOnline(selectedApp.lastMessageAt) && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <span>{selectedApp.visitorName || "Applicant"}</span>
                  {isOnline(selectedApp.lastMessageAt) ? (
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Online</Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-400">Offline</Badge>
                  )}
                  {selectedApp.visitorEmail && (
                    <a href={`mailto:${selectedApp.visitorEmail}`} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {selectedApp.visitorEmail}
                    </a>
                  )}
                </>
              ) : (
                <span className="text-gray-500">Select an application</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex flex-col h-[calc(100vh-480px)]">
            {selectedApp ? (
              <>
                {/* Application Data Summary */}
                {selectedApp.applicationData && (
                  <div className="px-4 py-3 border-b bg-gradient-to-r from-[#722f37]/5 to-[#d4af37]/5">
                    <div className="flex items-center gap-2 mb-2">
                      <GraduationCap className="w-4 h-4 text-[#722f37]" />
                      <span className="text-sm font-semibold text-[#722f37]">Application Summary</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      {selectedApp.applicationData.specialization && (
                        <div className="flex items-center gap-1.5 bg-white p-2 rounded border">
                          <Briefcase className="w-3 h-3 text-gray-400" />
                          <span className="truncate">{selectedApp.applicationData.specialization}</span>
                        </div>
                      )}
                      {selectedApp.applicationData.incomeGoal && (
                        <div className="flex items-center gap-1.5 bg-white p-2 rounded border">
                          <Target className="w-3 h-3 text-green-500" />
                          <span>Goal: {selectedApp.applicationData.incomeGoal}</span>
                        </div>
                      )}
                      {selectedApp.applicationData.currentIncome && (
                        <div className="flex items-center gap-1.5 bg-white p-2 rounded border">
                          <DollarSign className="w-3 h-3 text-blue-500" />
                          <span>Now: {selectedApp.applicationData.currentIncome}</span>
                        </div>
                      )}
                      {selectedApp.applicationData.experience && (
                        <div className="flex items-center gap-1.5 bg-white p-2 rounded border">
                          <User className="w-3 h-3 text-purple-500" />
                          <span className="truncate">{selectedApp.applicationData.experience}</span>
                        </div>
                      )}
                    </div>
                    {(selectedApp.applicationData.pastCerts || selectedApp.applicationData.vision) && (
                      <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                        {selectedApp.applicationData.pastCerts && (
                          <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
                            <span className="font-medium text-yellow-700">Past Certs:</span>{" "}
                            <span className="text-yellow-600">{selectedApp.applicationData.pastCerts}</span>
                          </div>
                        )}
                        {selectedApp.applicationData.vision && (
                          <div className="bg-purple-50 p-2 rounded border border-purple-200">
                            <span className="font-medium text-purple-700">Vision:</span>{" "}
                            <span className="text-purple-600">{selectedApp.applicationData.vision}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {selectedApp.messages
                      .filter(msg => !msg.message.includes("SCHOLARSHIP APPLICATION"))
                      .map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.isFromVisitor ? "justify-start" : "justify-end"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              msg.isFromVisitor
                                ? "bg-gray-100 text-gray-900"
                                : "bg-[#722f37] text-white"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <User className="w-3 h-3" />
                              <span className="text-xs opacity-70">
                                {msg.isFromVisitor ? selectedApp.visitorName || "Applicant" : (msg.repliedBy || "Sarah M.")}
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

                {/* Notes Section */}
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
                    placeholder="Add notes (offered amount, status, follow-up date...)"
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
                      <span className="text-sm font-medium text-purple-800">Scholarship Templates</span>
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
                      {SCHOLARSHIP_REPLIES.map((qr, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setReplyMessage(qr.text);
                            setShowQuickReplies(false);
                          }}
                          disabled={sending}
                          className="text-xs bg-white hover:bg-purple-100"
                        >
                          {qr.label}
                        </Button>
                      ))}
                    </div>
                    <p className="text-xs text-purple-600 mt-2">
                      💡 Remember: Full price is <strong>$1,997</strong>. Replace [AMOUNT] with actual scholarship offer.
                    </p>
                  </div>
                )}

                {/* Reply Input */}
                <div className="p-4 border-t bg-gray-50">
                  <div className="flex gap-2 mb-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowQuickReplies(!showQuickReplies)}
                      className="text-[#722f37] border-[#722f37]/30 hover:bg-[#722f37]/5"
                    >
                      <Zap className="w-4 h-4 mr-1" />
                      Templates
                    </Button>
                    <div className="flex-1 flex items-center gap-2 text-xs text-gray-500">
                      <AlertCircle className="w-3 h-3" />
                      Responses are sent as Sarah M.
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your scholarship response... (Remember: Full price is $1,997)"
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      disabled={sending}
                      className="flex-1 min-h-[60px] resize-none"
                    />
                    <Button
                      onClick={() => sendReply()}
                      disabled={sending || !replyMessage.trim()}
                      className="bg-[#722f37] hover:bg-[#5a252c]"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Select an application to view details</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
