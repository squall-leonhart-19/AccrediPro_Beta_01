"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  Send,
  Search,
  Users,
  ChevronLeft,
  ChevronRight,
  Circle,
  BookOpen,
  Award,
  GraduationCap,
  Loader2,
  Check,
  X,
  Star,
  Heart,
  Flame,
  TrendingUp,
  CheckCheck,
  Smile,
  Paperclip,
  Image as ImageIcon,
  Bot,
  Zap,
  Mic,
  Square,
  Play,
  Pause,
  FileText,
  Download,
  Reply,
  Trophy,
  Target,
  Clock,
  Gift,
  MessageCircle,
  Lightbulb,
  HandHeart,
  Info,
  Volume2,
  Sparkles,
  Pin,
  Shield,
  PlayCircle,
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
  totalLessons?: number;
  completedLessons?: number;
}

interface CurrentLesson {
  lessonTitle: string;
  moduleTitle: string;
  courseTitle: string;
  courseId: string;
}

interface UserBadge {
  id: string;
  badge: {
    name: string;
    icon: string;
  };
  earnedAt: Date;
}

interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
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
  badges?: UserBadge[];
  streak?: UserStreak | null;
  currentLesson?: CurrentLesson | null;
}

interface MessageReaction {
  id: string;
  emoji: string;
  userId: string;
}

interface ReplyTo {
  id: string;
  content: string;
  senderId: string;
  attachmentType?: string | null;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  isRead: boolean;
  createdAt: Date;
  attachmentUrl?: string | null;
  attachmentType?: string | null;
  attachmentName?: string | null;
  voiceDuration?: number | null;
  isAiVoice?: boolean;
  transcription?: string | null;
  replyToId?: string | null;
  replyTo?: ReplyTo | null;
  reactions?: MessageReaction[];
}

interface Conversation {
  user: User | null;
  lastMessage: Message | null;
  unreadCount: number;
}

interface MessagesClientProps {
  conversations: Conversation[];
  mentors: User[];
  students?: User[];
  currentUserId: string;
  currentUserRole?: string;
  initialSelectedUser?: User | null;
}

// Quick action templates for coaches
const QUICK_ACTIONS = [
  { icon: HandHeart, label: "Welcome", message: "Welcome to our community! I'm so excited to be your coach on this journey. How are you feeling about getting started?" },
  { icon: Lightbulb, label: "Check In", message: "Hey! Just checking in on your progress. How's everything going with your studies? Any questions I can help with?" },
  { icon: Gift, label: "Celebrate", message: "I noticed your amazing progress! You're doing incredible work. Keep up the momentum - you're on the path to success!" },
  { icon: Clock, label: "Reminder", message: "Friendly reminder: You have lessons waiting for you! Even 15 minutes of study today can make a big difference. Ready to dive in?" },
];

// Emoji picker data
const EMOJI_CATEGORIES = [
  { name: "Favorites", emojis: ["❤️", "👍", "😊", "🎉", "🔥", "👏", "💪", "🙏", "✨", "💕"] },
  { name: "Smileys", emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙", "🥲"] },
  { name: "Gestures", emojis: ["👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "☝️", "👍", "👎"] },
  { name: "Hearts", emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❤️‍🔥", "❤️‍🩹", "💖", "💗", "💓", "💞", "💕", "💟", "❣️", "💝"] },
];

// Quick reaction emojis
const QUICK_REACTIONS = ["❤️", "👍", "😊", "🎉", "🔥", "👏"];

// Message templates for coaches
const MESSAGE_TEMPLATES = [
  {
    category: "Welcome",
    templates: [
      "Welcome to AccrediPro! I'm thrilled to be your personal coach. What inspired you to start this certification journey?",
      "Hello and welcome! I'm here to support you every step of the way. Let's start by understanding your goals - what do you hope to achieve?",
    ]
  },
  {
    category: "Motivation",
    templates: [
      "I believe in you! Remember, every expert was once a beginner. You've got this!",
      "Your dedication is inspiring! Taking time for your education shows real commitment to your future.",
      "Progress over perfection - every lesson completed is a step toward your goals!",
    ]
  },
  {
    category: "Check-in",
    templates: [
      "How's your week going? I'd love to hear about your progress!",
      "Just checking in - is there anything I can help you with today?",
      "I noticed you've been working hard! Any questions or challenges I can help with?",
    ]
  },
  {
    category: "Support",
    templates: [
      "It's completely normal to feel overwhelmed sometimes. Let's break this down into smaller steps.",
      "Don't hesitate to reach out whenever you need support - that's what I'm here for!",
      "Remember, learning takes time. Be patient with yourself and celebrate small wins!",
    ]
  },
];

// Sarah's credentials for display
const SARAH_CREDENTIALS = {
  title: "Certified Functional Medicine Practitioner",
  accreditations: ["CPD", "IPHM", "CMA"],
};

// Quick reply buttons for students
const STUDENT_QUICK_REPLIES = [
  { emoji: "👋", text: "Thanks Sarah!" },
  { emoji: "❓", text: "I have a question" },
  { emoji: "🚀", text: "Ready to start!" },
  { emoji: "💬", text: "Tell me more" },
];

// Helper function for relative time formatting
const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes === 1) return "1 min ago";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours === 1) return "1 hour ago";
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export function MessagesClient({
  conversations: initialConversations,
  mentors,
  students = [],
  currentUserId,
  currentUserRole,
  initialSelectedUser,
}: MessagesClientProps) {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedUser, setSelectedUser] = useState<User | null>(initialSelectedUser || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMentors, setShowMentors] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [loadingAiSuggestion, setLoadingAiSuggestion] = useState(false);
  const [showStudentPanel, setShowStudentPanel] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [uploading, setUploading] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [generatingTts, setGeneratingTts] = useState(false);
  const [ttsPreviewAudio, setTtsPreviewAudio] = useState<string | null>(null);
  const [playingTtsPreview, setPlayingTtsPreview] = useState(false);
  const ttsPreviewRef = useRef<HTMLAudioElement | null>(null);

  // New features state
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [messageSearch, setMessageSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Message[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // New DM modal state (for coaches)
  const [showNewDmModal, setShowNewDmModal] = useState(false);
  const [studentSearchQuery, setStudentSearchQuery] = useState("");
  const [studentSearchResults, setStudentSearchResults] = useState<User[]>([]);
  const [searchingStudents, setSearchingStudents] = useState(false);

  // Reply All Waiting state (for coaches)
  const [replyingAllWaiting, setReplyingAllWaiting] = useState(false);
  const [waitingCount, setWaitingCount] = useState(0);

  // Pagination state
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const isMountedRef = useRef(true); // Track if component is still mounted

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const isCoach = currentUserRole === "ADMIN" || currentUserRole === "INSTRUCTOR" || currentUserRole === "MENTOR";

  // Calculate waiting count from conversations (matches REPLY badge logic exactly)
  useEffect(() => {
    if (isCoach) {
      const count = conversations.filter(
        (conv) => conv.lastMessage && conv.lastMessage.senderId !== currentUserId
      ).length;
      setWaitingCount(count);
    }
  }, [isCoach, conversations, currentUserId]);

  // Handle Reply All Waiting
  const handleReplyAllWaiting = async () => {
    if (!confirm(`Send AI-generated replies to ${waitingCount} waiting conversations?`)) return;

    setReplyingAllWaiting(true);
    try {
      const res = await fetch("/api/admin/messages/reply-all-waiting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ useAI: true }),
      });
      const data = await res.json();

      if (data.success) {
        alert(`Successfully replied to ${data.replied}/${data.total} conversations!`);
        // Refresh conversations
        window.location.reload();
      } else {
        alert(`Error: ${data.error || "Failed to send replies"}`);
      }
    } catch (err) {
      console.error("Reply all waiting error:", err);
      alert("Failed to send replies. Please try again.");
    } finally {
      setReplyingAllWaiting(false);
    }
  };

  const scrollToBottom = (force = false) => {
    const container = messagesContainerRef.current;
    if (!container) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // Only auto-scroll if user is near bottom (within 150px) or force is true
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
    if (force || isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fetchMessages = useCallback(async (userId: string, isRefresh = false) => {
    try {
      const response = await fetch(`/api/messages?userId=${userId}&limit=50`);
      const data = await response.json();
      if (data.success && isMountedRef.current) {
        setMessages(data.data);
        setHasMoreMessages(data.hasMore || false);
        setNextCursor(data.nextCursor || null);
        if (!isRefresh) {
          scrollToBottom(true); // Force scroll on initial load
        }
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  }, []);

  // Load more older messages
  const loadMoreMessages = useCallback(async () => {
    if (!selectedUser || !nextCursor || loadingMore) return;

    setLoadingMore(true);
    const container = messagesContainerRef.current;
    const scrollHeightBefore = container?.scrollHeight || 0;

    try {
      const response = await fetch(
        `/api/messages?userId=${selectedUser.id}&cursor=${nextCursor}&limit=30`
      );
      const data = await response.json();

      if (data.success && isMountedRef.current) {
        setMessages((prev) => [...data.data, ...prev]);
        setHasMoreMessages(data.hasMore || false);
        setNextCursor(data.nextCursor || null);

        // Maintain scroll position after prepending messages
        requestAnimationFrame(() => {
          if (container) {
            const scrollHeightAfter = container.scrollHeight;
            container.scrollTop = scrollHeightAfter - scrollHeightBefore;
          }
        });
      }
    } catch (error) {
      console.error("Failed to load more messages:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [selectedUser, nextCursor, loadingMore]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id);
      // Mark messages as read when opening conversation
      fetch("/api/messages/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: selectedUser.id }),
      }).catch(console.error);

      const interval = setInterval(() => {
        fetchMessages(selectedUser.id, true); // isRefresh=true to not scroll
      }, 5000);

      // Poll for typing indicator
      const typingInterval = setInterval(async () => {
        if (!isMountedRef.current) return;
        try {
          const res = await fetch(`/api/messages/typing?senderId=${selectedUser.id}`);
          const data = await res.json();
          if (isMountedRef.current) {
            setOtherUserTyping(data.isTyping || false);
          }
        } catch (e) {
          console.error("Typing poll error:", e);
        }
      }, 2000);

      return () => {
        clearInterval(interval);
        clearInterval(typingInterval);
      };
    }
  }, [selectedUser, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle typing indicator
  const handleTyping = async () => {
    if (!selectedUser || isTyping) return;
    setIsTyping(true);

    try {
      await fetch("/api/messages/typing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: selectedUser.id, isTyping: true }),
      });
    } catch (e) {
      console.error("Typing status error:", e);
    }

    // Reset typing after 3 seconds of inactivity
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(async () => {
      setIsTyping(false);
      try {
        await fetch("/api/messages/typing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ receiverId: selectedUser?.id, isTyping: false }),
        });
      } catch (e) {
        console.error("Typing status error:", e);
      }
    }, 3000);
  };

  // Message search
  const handleSearch = async (query: string) => {
    setMessageSearch(query);
    if (query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      const res = await fetch(`/api/messages/search?q=${encodeURIComponent(query)}${selectedUser ? `&userId=${selectedUser.id}` : ""}`);
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.data || []);
        setShowSearchResults(true);
      }
    } catch (e) {
      console.error("Search error:", e);
    }
  };

  // Schedule message
  const handleScheduleMessage = async () => {
    if (!selectedUser || !newMessage.trim() || !scheduleDate || !scheduleTime) return;

    const scheduledAt = new Date(`${scheduleDate}T${scheduleTime}`);
    if (scheduledAt <= new Date()) {
      setAiError("Please select a future date and time");
      return;
    }

    try {
      const res = await fetch("/api/messages/scheduled", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: selectedUser.id,
          content: newMessage,
          scheduledAt: scheduledAt.toISOString(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewMessage("");
        setShowScheduleModal(false);
        setScheduleDate("");
        setScheduleTime("");
      }
    } catch (e) {
      console.error("Schedule error:", e);
      setAiError("Failed to schedule message");
    }
  };

  // Send message
  const sendMessage = async (content: string, attachment?: { url: string; type: string; name: string; duration?: number; transcription?: string }) => {
    if (!selectedUser || (!content.trim() && !attachment)) return;

    setLoading(true);

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: selectedUser.id,
          content: content || "",
          attachmentUrl: attachment?.url,
          attachmentType: attachment?.type,
          attachmentName: attachment?.name,
          voiceDuration: attachment?.duration,
          transcription: attachment?.transcription,
          replyToId: replyingTo?.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [...prev, data.data]);
        setNewMessage("");
        setReplyingTo(null);
        setShowTemplates(false);
        setShowQuickActions(false);
        setAiSuggestion(null);

        setConversations((prev) => {
          const existingIndex = prev.findIndex((c) => c.user?.id === selectedUser.id);
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(newMessage);
  };

  // Handle file attachment - show alert if storage not configured
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: "file" | "image") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        await sendMessage("", { url: data.data.url, type, name: data.data.name });
      } else {
        setUploadError(data.error || "Upload failed. Please try again.");
        setTimeout(() => setUploadError(null), 5000);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadError("Upload failed. Storage may not be configured.");
      setTimeout(() => setUploadError(null), 5000);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  // Voice recording functions
  // Prefer audio/mp4 for Safari/iOS compatibility, fallback to webm
  const getAudioMimeType = (): string => {
    if (MediaRecorder.isTypeSupported('audio/mp4')) {
      return 'audio/mp4';
    } else if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
      return 'audio/webm;codecs=opus';
    } else if (MediaRecorder.isTypeSupported('audio/webm')) {
      return 'audio/webm';
    } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
      return 'audio/ogg;codecs=opus';
    }
    return 'audio/webm'; // default fallback
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getAudioMimeType();
      console.log(`[Voice] Recording with format: ${mimeType}`);

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const newAudioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(newAudioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Failed to start recording:", error);
      alert("Could not access microphone. Please allow microphone access.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setAudioBlob(null);
    setRecordingTime(0);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
  };

  const sendVoiceMessage = async () => {
    if (!audioBlob) return;

    setUploading(true);

    try {
      const formData = new FormData();
      // Get file extension from blob type (audio/mp4 -> mp4, audio/webm -> webm)
      const ext = audioBlob.type.split('/')[1]?.split(';')[0] || 'webm';
      const file = new File([audioBlob], `voice-${Date.now()}.${ext}`, { type: audioBlob.type });
      formData.append("file", file);
      formData.append("type", "voice");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Transcribe the voice message in the background
        let transcription: string | undefined;
        try {
          const transcribeForm = new FormData();
          transcribeForm.append("audio", file);
          const transcribeRes = await fetch("/api/ai/transcribe", {
            method: "POST",
            body: transcribeForm,
          });
          const transcribeData = await transcribeRes.json();
          if (transcribeData.success && transcribeData.text) {
            transcription = transcribeData.text;
            console.log("🎤 Voice transcribed:", transcription);
          }
        } catch (transcribeError) {
          console.warn("Voice transcription failed (non-blocking):", transcribeError);
        }

        await sendMessage("", {
          url: data.data.url,
          type: "voice",
          name: data.data.name,
          duration: recordingTime,
          transcription,
        });
      } else {
        setUploadError(data.error || "Voice upload failed.");
        setTimeout(() => setUploadError(null), 5000);
      }
    } catch (error) {
      console.error("Voice upload failed:", error);
      setUploadError("Voice upload failed. Storage may not be configured.");
      setTimeout(() => setUploadError(null), 5000);
    } finally {
      setUploading(false);
      setAudioBlob(null);
      setRecordingTime(0);
    }
  };

  // Play/pause audio
  const toggleAudio = (messageId: string, audioUrl: string) => {
    const audio = audioRefs.current[messageId];

    if (!audio) {
      const newAudio = new Audio(audioUrl);
      audioRefs.current[messageId] = newAudio;

      newAudio.onended = () => setPlayingAudio(null);
      newAudio.play();
      setPlayingAudio(messageId);
    } else {
      if (playingAudio === messageId) {
        audio.pause();
        setPlayingAudio(null);
      } else {
        Object.values(audioRefs.current).forEach((a) => a.pause());
        audio.currentTime = 0;
        audio.play();
        setPlayingAudio(messageId);
      }
    }
  };

  // Toggle reaction
  const toggleReaction = async (messageId: string, emoji: string) => {
    try {
      await fetch("/api/messages/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, emoji }),
      });
      if (selectedUser) {
        fetchMessages(selectedUser.id);
      }
    } catch (error) {
      console.error("Failed to toggle reaction:", error);
    }
    setShowReactionPicker(null);
  };

  // Emoji picker
  const addEmoji = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Search students for new DM (coaches only)
  const searchStudentsForDm = async (query: string) => {
    setStudentSearchQuery(query);
    if (query.length < 2) {
      setStudentSearchResults([]);
      return;
    }

    setSearchingStudents(true);
    try {
      const res = await fetch(`/api/messages/students?q=${encodeURIComponent(query)}&limit=10`);
      const data = await res.json();
      if (data.students) {
        setStudentSearchResults(data.students);
      }
    } catch (e) {
      console.error("Student search error:", e);
    } finally {
      setSearchingStudents(false);
    }
  };

  const startConversation = (user: User) => {
    setSelectedUser(user);
    setShowMentors(false);
    setShowNewDmModal(false);
    setStudentSearchQuery("");
    setStudentSearchResults([]);
    setAiSuggestion(null);
    setReplyingTo(null);
    setAiError(null);
  };

  const handleGetAiSuggestion = async () => {
    if (!selectedUser || loadingAiSuggestion) return;

    setLoadingAiSuggestion(true);
    setAiSuggestion(null);
    setAiError(null);

    try {
      const response = await fetch("/api/ai/suggest-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationUserId: selectedUser.id }),
      });

      const data = await response.json();

      if (data.success && data.suggestedReply) {
        setAiSuggestion(data.suggestedReply);
      } else {
        setAiError(data.error || "AI service unavailable. Try using templates instead.");
        setTimeout(() => setAiError(null), 5000);
      }
    } catch (error) {
      console.error("Failed to get AI suggestion:", error);
      setAiError("AI service unavailable. Try using templates instead.");
      setTimeout(() => setAiError(null), 5000);
    } finally {
      setLoadingAiSuggestion(false);
    }
  };

  const acceptAiSuggestion = async () => {
    if (aiSuggestion) {
      await sendMessage(aiSuggestion);
      setAiSuggestion(null);
    }
  };

  // AI Voice Reply: Generate AI text → Convert to TTS → Send as voice message
  const [loadingAiVoiceReply, setLoadingAiVoiceReply] = useState(false);

  const handleAiVoiceReply = async () => {
    if (!selectedUser || loadingAiVoiceReply) return;

    setLoadingAiVoiceReply(true);
    setAiError(null);

    try {
      // Step 1: Get AI suggestion
      const aiResponse = await fetch("/api/ai/suggest-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationUserId: selectedUser.id }),
      });

      const aiData = await aiResponse.json();

      if (!aiData.success || !aiData.suggestedReply) {
        throw new Error(aiData.error || "Failed to generate AI reply");
      }

      const aiText = aiData.suggestedReply;

      // Step 2: Convert to TTS
      const ttsResponse = await fetch("/api/ai/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: aiText, voice: "nova" }),
      });

      const ttsData = await ttsResponse.json();

      if (!ttsData.success || !ttsData.audio) {
        throw new Error(ttsData.error || "Failed to generate voice");
      }

      // Step 3: Upload audio
      const base64Data = ttsData.audio.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "audio/mp3" });

      const formData = new FormData();
      const file = new File([blob], `ai-voice-${Date.now()}.mp3`, { type: "audio/mp3" });
      formData.append("file", file);
      formData.append("type", "voice");

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadData.success) {
        throw new Error(uploadData.error || "Failed to upload voice");
      }

      // Step 4: Send as voice message
      const messageResponse = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: selectedUser.id,
          content: aiText,
          attachmentUrl: uploadData.data.url,
          attachmentType: "voice",
          attachmentName: uploadData.data.name,
          voiceDuration: Math.ceil(aiText.length / 15),
          isAiVoice: true,
        }),
      });

      const messageData = await messageResponse.json();

      if (messageData.success) {
        setMessages((prev) => [...prev, messageData.data]);
        setAiSuggestion(null);

        setConversations((prev) => {
          const existingIndex = prev.findIndex((c) => c.user?.id === selectedUser.id);
          const updatedConversation = {
            user: selectedUser,
            lastMessage: messageData.data,
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
      console.error("AI Voice Reply failed:", error);
      setAiError(error instanceof Error ? error.message : "AI Voice Reply failed");
      setTimeout(() => setAiError(null), 5000);
    } finally {
      setLoadingAiVoiceReply(false);
    }
  };

  const useTemplate = (template: string) => {
    setNewMessage(template);
    setShowTemplates(false);
  };

  const useQuickAction = (message: string) => {
    setNewMessage(message);
    setShowQuickActions(false);
  };

  // Generate AI Voice (TTS) from text
  const generateAiVoice = async () => {
    if (!newMessage.trim() || generatingTts) return;

    setGeneratingTts(true);
    setAiError(null);

    try {
      const response = await fetch("/api/ai/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newMessage, voice: "nova" }),
      });

      const data = await response.json();

      if (data.success && data.audio) {
        setTtsPreviewAudio(data.audio);
      } else {
        setAiError(data.error || "Failed to generate voice. OpenAI API may not be configured.");
        setTimeout(() => setAiError(null), 5000);
      }
    } catch (error) {
      console.error("TTS generation failed:", error);
      setAiError("Failed to generate AI voice. Please try again.");
      setTimeout(() => setAiError(null), 5000);
    } finally {
      setGeneratingTts(false);
    }
  };

  // Play/pause TTS preview
  const toggleTtsPreview = () => {
    if (!ttsPreviewAudio) return;

    if (!ttsPreviewRef.current) {
      ttsPreviewRef.current = new Audio(ttsPreviewAudio);
      ttsPreviewRef.current.onended = () => setPlayingTtsPreview(false);
    }

    if (playingTtsPreview) {
      ttsPreviewRef.current.pause();
      setPlayingTtsPreview(false);
    } else {
      ttsPreviewRef.current.play();
      setPlayingTtsPreview(true);
    }
  };

  // Send TTS as voice message
  const sendTtsMessage = async () => {
    if (!ttsPreviewAudio || !selectedUser) return;

    setLoading(true);

    try {
      // Convert base64 to blob
      const base64Data = ttsPreviewAudio.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "audio/mp3" });

      // Upload to server
      const formData = new FormData();
      const file = new File([blob], `ai-voice-${Date.now()}.mp3`, { type: "audio/mp3" });
      formData.append("file", file);
      formData.append("type", "voice");

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (uploadData.success) {
        // Send as message with transcription
        const response = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            receiverId: selectedUser.id,
            content: newMessage, // Keep the text as transcription
            attachmentUrl: uploadData.data.url,
            attachmentType: "voice",
            attachmentName: uploadData.data.name,
            voiceDuration: Math.ceil(newMessage.length / 15), // Estimate duration
            isAiVoice: true,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setMessages((prev) => [...prev, data.data]);
          setNewMessage("");
          setTtsPreviewAudio(null);
          ttsPreviewRef.current = null;

          setConversations((prev) => {
            const existingIndex = prev.findIndex((c) => c.user?.id === selectedUser.id);
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
      } else {
        setUploadError(uploadData.error || "Failed to upload voice message.");
        setTimeout(() => setUploadError(null), 5000);
      }
    } catch (error) {
      console.error("Failed to send TTS message:", error);
      setUploadError("Failed to send voice message. Please try again.");
      setTimeout(() => setUploadError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Cancel TTS preview
  const cancelTtsPreview = () => {
    if (ttsPreviewRef.current) {
      ttsPreviewRef.current.pause();
      ttsPreviewRef.current = null;
    }
    setTtsPreviewAudio(null);
    setPlayingTtsPreview(false);
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

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    const fullName = `${conv.user?.firstName} ${conv.user?.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || conv.user?.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const roleConfig: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
    ADMIN: { color: "text-red-600", bg: "bg-red-50 border-red-200", icon: <Star className="w-3 h-3" />, label: "Admin" },
    INSTRUCTOR: { color: "text-purple-600", bg: "bg-purple-50 border-purple-200", icon: <GraduationCap className="w-3 h-3" />, label: "Instructor" },
    MENTOR: { color: "text-blue-600", bg: "bg-blue-50 border-blue-200", icon: <Heart className="w-3 h-3" />, label: "Coach" },
    STUDENT: { color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", icon: <BookOpen className="w-3 h-3" />, label: "Student" },
  };

  const avgProgress = selectedUser?.enrollments?.length
    ? Math.round(selectedUser.enrollments.reduce((acc, e) => acc + e.progress, 0) / selectedUser.enrollments.length)
    : 0;

  // Group reactions by emoji
  const getGroupedReactions = (reactions: MessageReaction[] = []) => {
    return reactions.reduce((acc, r) => {
      if (!acc[r.emoji]) {
        acc[r.emoji] = { count: 0, hasReacted: false };
      }
      acc[r.emoji].count++;
      if (r.userId === currentUserId) {
        acc[r.emoji].hasReacted = true;
      }
      return acc;
    }, {} as Record<string, { count: number; hasReacted: boolean }>);
  };

  // Render message content with attachments
  const renderMessageContent = (message: Message, isOwn: boolean) => {
    // Voice message
    if (message.attachmentType === "voice" && message.attachmentUrl) {
      return (
        <div className="min-w-[220px]">
          {/* Voice Message Header */}
          <div className="flex items-center gap-2 mb-2">
            <Mic className={cn("w-3.5 h-3.5", isOwn ? "text-white/70" : "text-burgundy-500")} />
            <span className={cn("text-[10px] font-medium uppercase tracking-wide", isOwn ? "text-white/70" : "text-burgundy-500")}>
              Voice Message
            </span>
            {message.isAiVoice && (
              <span className={cn("text-[9px] px-1.5 py-0.5 rounded-full", isOwn ? "bg-white/20 text-white" : "bg-purple-100 text-purple-600")}>
                AI Voice
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleAudio(message.id, message.attachmentUrl!)}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md",
                isOwn
                  ? "bg-white/20 hover:bg-white/30 hover:scale-105"
                  : "bg-gradient-to-br from-burgundy-500 to-burgundy-600 hover:from-burgundy-600 hover:to-burgundy-700 hover:scale-105"
              )}
            >
              {playingAudio === message.id ? (
                <Pause className={cn("w-5 h-5", isOwn ? "text-white" : "text-white")} />
              ) : (
                <Play className={cn("w-5 h-5 ml-0.5", isOwn ? "text-white" : "text-white")} />
              )}
            </button>
            <div className="flex-1">
              {/* Duration Display - More Prominent */}
              <div className={cn("text-lg font-bold mb-1", isOwn ? "text-white" : "text-gray-900")}>
                {formatDuration(message.voiceDuration || 0)}
              </div>
              <div className={cn("h-1.5 rounded-full", isOwn ? "bg-white/30" : "bg-burgundy-200")}>
                <div className={cn("h-full rounded-full w-0 transition-all", isOwn ? "bg-white" : "bg-burgundy-500")} />
              </div>
            </div>
          </div>
          {message.content && (
            <p className={cn("text-sm mt-3 italic border-l-2 pl-2", isOwn ? "text-white/80 border-white/40" : "text-gray-600 border-burgundy-300")}>
              &quot;{message.content}&quot;
            </p>
          )}
        </div>
      );
    }

    if (message.attachmentType === "image" && message.attachmentUrl) {
      return (
        <div>
          <img
            src={message.attachmentUrl}
            alt="Shared image"
            className="max-w-[280px] rounded-xl mb-2 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => window.open(message.attachmentUrl!, "_blank")}
          />
          {message.content && <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>}
        </div>
      );
    }

    if (message.attachmentType === "file" && message.attachmentUrl) {
      return (
        <div>
          <a
            href={message.attachmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl mb-2 transition-all",
              isOwn ? "bg-white/10 hover:bg-white/20" : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", isOwn ? "bg-white/20" : "bg-burgundy-100")}>
              <FileText className={cn("w-5 h-5", isOwn ? "text-white" : "text-burgundy-600")} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm font-medium truncate", isOwn ? "text-white" : "text-gray-900")}>
                {message.attachmentName || "File"}
              </p>
              <p className={cn("text-xs", isOwn ? "text-white/60" : "text-gray-500")}>Click to download</p>
            </div>
            <Download className={cn("w-5 h-5", isOwn ? "text-white/70" : "text-gray-400")} />
          </a>
          {message.content && <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>}
        </div>
      );
    }

    return <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>;
  };

  return (
    <div className="h-full w-full flex bg-white rounded-xl overflow-hidden shadow-xl border border-gray-200/50">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileSelect(e, "file")}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
      />
      <input
        type="file"
        ref={imageInputRef}
        onChange={(e) => handleFileSelect(e, "image")}
        className="hidden"
        accept="image/*,.webp,.png,.jpg,.jpeg,.gif,.heic,.heif"
      />

      {/* Conversations Sidebar */}
      <div className={cn(
        "w-full sm:w-[320px] md:w-[340px] flex-shrink-0 flex flex-col bg-gradient-to-b from-gray-50 to-white border-r border-gray-100",
        selectedUser ? "hidden lg:flex" : "flex"
      )}>
        {/* Sidebar Header */}
        <div className="p-3 bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-white text-base truncate">Messages</h2>
              </div>
            </div>
            {/* Only show toggle button for coaches - students don't need to browse coaches */}
            {isCoach && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewDmModal(true)}
                  className="text-white hover:bg-white/20 gap-1 px-2 h-8 bg-gold-500/40"
                  title="Compose new DM to a student"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="text-xs">New DM</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReplyAllWaiting}
                  disabled={replyingAllWaiting || waitingCount === 0}
                  className={cn(
                    "text-white hover:bg-white/20 gap-1 px-2 h-8",
                    waitingCount > 0 ? "bg-amber-500/40" : "opacity-50"
                  )}
                  title={waitingCount > 0 ? `Reply to ${waitingCount} waiting conversations with AI` : "No conversations waiting for reply"}
                >
                  {replyingAllWaiting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Zap className="w-3.5 h-3.5" />
                  )}
                  <span className={cn(
                    "px-1.5 py-0.5 text-white text-[10px] font-bold rounded-full",
                    waitingCount > 0 ? "bg-amber-500" : "bg-white/30"
                  )}>
                    {waitingCount}
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMentors(!showMentors)}
                  className={cn("text-white hover:bg-white/20 gap-1 px-2 h-8", showMentors && "bg-white/20")}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span className="text-xs">{showMentors ? "Chats" : "Students"}</span>
                </Button>
              </div>
            )}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-burgundy-300" />
            <Input
              placeholder="Search conversations..."
              className="pl-9 bg-white/10 border-burgundy-500/30 text-white placeholder:text-burgundy-300 focus:bg-white/20 h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {/* Only coaches can see students list - students only see their conversations */}
          {showMentors && isCoach ? (
            <div className="p-3">
              <div className="flex items-center gap-2 px-3 py-2 mb-2">
                <GraduationCap className="w-4 h-4 text-gold-500" />
                <span className="text-sm font-semibold text-gray-700">
                  Your Students ({students.length})
                </span>
              </div>
              {students.length > 0 ? (
                <div className="space-y-1">
                  {students.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => startConversation(student)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-burgundy-50 transition-all text-left group"
                    >
                      <div className="relative">
                        <Avatar className="h-11 w-11 ring-2 ring-gray-200 ring-offset-1">
                          <AvatarImage src={student.avatar || undefined} />
                          <AvatarFallback className="bg-gradient-to-br from-burgundy-400 to-burgundy-600 text-white font-bold text-sm">
                            {getInitials(student)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 group-hover:text-burgundy-700 transition-colors text-sm">
                          {student.firstName || "Student"} {student.lastName || ""}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{student.email}</p>
                        {student.enrollments && student.enrollments.length > 0 && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <Badge className="text-[10px] bg-burgundy-100 text-burgundy-700 border-0 gap-0.5 py-0">
                              <BookOpen className="w-2.5 h-2.5" />
                              {student.enrollments.length} course{student.enrollments.length > 1 ? "s" : ""}
                            </Badge>
                          </div>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">No students found</p>
              )}
            </div>
          ) : filteredConversations.length > 0 ? (
            <div className="p-2 space-y-0.5">
              {filteredConversations.map((conv) => {
                if (!conv.user) return null;
                const isSelected = selectedUser?.id === conv.user.id;
                // Check if waiting for coach's reply (last message was from the other user)
                const isWaitingForReply = isCoach && conv.lastMessage && conv.lastMessage.senderId !== currentUserId;

                return (
                  <button
                    key={conv.user.id}
                    onClick={() => setSelectedUser(conv.user)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left",
                      isSelected
                        ? "bg-burgundy-50 border border-burgundy-200"
                        : isWaitingForReply
                          ? "bg-amber-50 border border-amber-200 hover:bg-amber-100"
                          : "hover:bg-gray-50"
                    )}
                  >
                    <div className="relative">
                      <Avatar className={cn("h-11 w-11", isSelected && "ring-2 ring-burgundy-400 ring-offset-1")}>
                        <AvatarImage src={conv.user.avatar || undefined} />
                        <AvatarFallback className={cn("font-semibold text-sm", isSelected ? "bg-burgundy-600 text-white" : "bg-gray-100 text-gray-700")}>
                          {getInitials(conv.user)}
                        </AvatarFallback>
                      </Avatar>
                      {conv.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-burgundy-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold px-1">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <p className={cn("font-semibold truncate text-sm", conv.unreadCount > 0 ? "text-gray-900" : "text-gray-700")}>
                            {conv.user.firstName} {conv.user.lastName}
                          </p>
                          {isWaitingForReply && (
                            <span className="flex-shrink-0 px-1.5 py-0.5 bg-amber-500 text-white text-[9px] font-bold rounded-full">
                              REPLY
                            </span>
                          )}
                        </div>
                        {conv.lastMessage && (
                          <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">
                            {formatDate(conv.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>
                      {conv.lastMessage && (
                        <div className="flex items-center gap-1">
                          {conv.lastMessage.senderId === currentUserId && (
                            <CheckCheck className={cn("w-3 h-3 flex-shrink-0", conv.lastMessage.isRead ? "text-blue-500" : "text-gray-400")} />
                          )}
                          <p className={cn("text-xs truncate", conv.unreadCount > 0 ? "text-gray-700 font-medium" : "text-gray-500")}>
                            {conv.lastMessage.attachmentType === "voice"
                              ? "Voice message"
                              : conv.lastMessage.content || "Attachment"}
                          </p>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full px-6 py-12">
              <div className="w-16 h-16 bg-burgundy-100 rounded-2xl flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-burgundy-600" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">No Conversations</h3>
              <p className="text-sm text-gray-500 text-center mb-4">Start connecting with {isCoach ? "students" : "your coach"}</p>
              <Button onClick={() => setShowMentors(true)} size="sm" className="gap-2 bg-burgundy-600 hover:bg-burgundy-700">
                <Users className="w-4 h-4" />
                {isCoach ? "View Students" : "Find a Coach"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={cn("flex-1 min-w-0 flex flex-col bg-gray-50", !selectedUser ? "hidden lg:flex" : "flex")}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="px-4 py-3 bg-white border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="lg:hidden -ml-2 h-9 w-9" onClick={() => setSelectedUser(null)}>
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Avatar className="h-10 w-10 ring-2 ring-gray-100">
                    <AvatarImage src={selectedUser.avatar || undefined} />
                    <AvatarFallback className="bg-burgundy-100 text-burgundy-700 font-bold text-sm">{getInitials(selectedUser)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 text-sm">{selectedUser.firstName} {selectedUser.lastName}</h3>
                      <Badge className={cn("text-[10px] border gap-0.5 py-0", roleConfig[selectedUser.role]?.bg, roleConfig[selectedUser.role]?.color)}>
                        {roleConfig[selectedUser.role]?.icon}
                        {roleConfig[selectedUser.role]?.label}
                      </Badge>
                    </div>
                    {/* Sarah's Credentials - show for ADMIN, COACH, or MENTOR */}
                    {(selectedUser.role === "ADMIN" || selectedUser.role === "COACH" || selectedUser.role === "MENTOR") ? (
                      <div className="flex flex-col">
                        <p className="text-[10px] text-burgundy-600 font-medium flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          {SARAH_CREDENTIALS.title}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          {SARAH_CREDENTIALS.accreditations.map((acc) => (
                            <span key={acc} className="text-[9px] px-1.5 py-0.5 bg-gold-100 text-gold-700 rounded font-medium">
                              {acc}
                            </span>
                          ))}
                          <span className="text-[9px] text-green-600 flex items-center gap-0.5 ml-1">
                            <Circle className="w-1.5 h-1.5 fill-current" />
                            Active now
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <Circle className="w-1.5 h-1.5 fill-current" />
                        Active now
                      </p>
                    )}
                  </div>
                </div>

                {/* Search Messages */}
                <div className="relative hidden md:block">
                  <div className="flex items-center gap-1 bg-gray-50 rounded-lg px-2 py-1.5 border border-gray-200 focus-within:border-burgundy-300 focus-within:ring-2 focus-within:ring-burgundy-100 transition-all">
                    <Search className="w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search messages..."
                      value={messageSearch}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="bg-transparent text-xs w-28 focus:w-40 transition-all focus:outline-none placeholder-gray-400"
                    />
                  </div>
                  {/* Search Results Dropdown */}
                  {showSearchResults && searchResults.length > 0 && (
                    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-64 overflow-y-auto">
                      <div className="p-2">
                        <p className="text-xs font-medium text-gray-500 px-2 pb-2">{searchResults.length} results</p>
                        {searchResults.slice(0, 5).map((msg) => (
                          <div
                            key={msg.id}
                            className="px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                            onClick={() => {
                              setShowSearchResults(false);
                              setMessageSearch("");
                              // Scroll to message - could be enhanced
                            }}
                          >
                            <p className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-900 truncate">{msg.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {isCoach && (
                    <>
                      {/* Quick Actions */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setShowQuickActions(!showQuickActions); setShowTemplates(false); }}
                        className={cn("gap-1.5 h-8 px-2", showQuickActions ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:text-gray-900")}
                      >
                        <Zap className="w-4 h-4" />
                        <span className="text-xs font-medium hidden sm:inline">Quick</span>
                      </Button>
                      {/* Templates */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setShowTemplates(!showTemplates); setShowQuickActions(false); }}
                        className={cn("gap-1.5 h-8 px-2", showTemplates ? "bg-emerald-50 text-emerald-600" : "text-gray-600 hover:text-gray-900")}
                      >
                        <FileText className="w-4 h-4" />
                        <span className="text-xs font-medium hidden sm:inline">Templates</span>
                      </Button>
                    </>
                  )}
                  {/* AI Reply Button - for coaches */}
                  {isCoach && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleGetAiSuggestion}
                        disabled={loadingAiSuggestion || loadingAiVoiceReply}
                        className="gap-1.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0 hover:from-violet-600 hover:to-purple-700 h-8 px-3"
                      >
                        {loadingAiSuggestion ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                        <span className="text-xs font-medium">AI Reply</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAiVoiceReply}
                        disabled={loadingAiVoiceReply || loadingAiSuggestion}
                        className="gap-1.5 bg-gradient-to-r from-pink-500 to-rose-600 text-white border-0 hover:from-pink-600 hover:to-rose-700 h-8 px-3"
                        title="Generate AI reply as voice message"
                      >
                        {loadingAiVoiceReply ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                        <span className="text-xs font-medium">AI Voice</span>
                      </Button>
                    </>
                  )}
                  {isCoach && selectedUser?.role === "STUDENT" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowStudentPanel(!showStudentPanel)}
                      className={cn("h-8 w-8", showStudentPanel && "bg-burgundy-50 text-burgundy-600")}
                      title="Student Info"
                    >
                      <TrendingUp className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
              {/* Messages Container */}
              <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 py-4">
                {/* Pinned Founder Message - show for ADMIN only (AccrediPro Founder) */}
                {!isCoach && selectedUser?.role === "ADMIN" && messages.length > 0 && (
                  <div className="mb-4 p-3 bg-gradient-to-r from-gold-50 to-amber-50 rounded-xl border border-gold-200 relative">
                    <div className="absolute -top-2 left-3">
                      <span className="flex items-center gap-1 text-[10px] font-bold text-gold-700 bg-gold-100 px-2 py-0.5 rounded-full border border-gold-200">
                        <Pin className="w-3 h-3" />
                        PINNED
                      </span>
                    </div>
                    <div className="mt-2 flex items-start gap-2">
                      <div className="text-gold-500 text-lg">🎯</div>
                      <div>
                        <p className="text-xs text-gold-800 font-medium">From AccrediPro Founder</p>
                        <p className="text-xs text-gold-700 mt-1">
                          &quot;Your success is our mission. Every message, every lesson brings you closer to your certification goals!&quot;
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Welcome Banner for Students - show for COACH (Sarah) */}
                {!isCoach && (selectedUser?.role === "COACH" || selectedUser?.role === "MENTOR") && messages.length <= 3 && (
                  <div className="mb-4 p-4 bg-gradient-to-r from-burgundy-50 via-gold-50 to-burgundy-50 rounded-2xl border border-burgundy-100">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-burgundy-500 to-burgundy-700 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-burgundy-900 text-sm mb-1">Welcome to Your Personal Coaching Space!</h4>
                        <p className="text-xs text-burgundy-700 leading-relaxed">
                          I&apos;m Sarah, your dedicated mentor. Feel free to ask questions, share your progress, or just say hi! I&apos;m here to support you every step of the way.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Progress Reminder for Students - show for COACH (Sarah) */}
                {!isCoach && (selectedUser?.role === "COACH" || selectedUser?.role === "MENTOR") && messages.length > 0 && (
                  <div className="mb-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-emerald-800">Keep up the great work!</p>
                      <p className="text-[10px] text-emerald-600">Continue your learning journey in the courses section</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-emerald-700 hover:bg-emerald-100 h-7 text-xs"
                      onClick={() => window.location.href = "/courses"}
                    >
                      View Courses
                    </Button>
                  </div>
                )}

                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-20 h-20 bg-burgundy-100 rounded-3xl flex items-center justify-center mb-4">
                      <MessageCircle className="w-10 h-10 text-burgundy-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Start Your Journey</h3>
                    <p className="text-gray-500 text-center max-w-sm text-sm mb-4">
                      Send your first message to {selectedUser.firstName}!
                    </p>
                    {isCoach && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowQuickActions(true)}
                        className="gap-2"
                      >
                        <Lightbulb className="w-4 h-4" />
                        Use Welcome Template
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Load More Button */}
                    {hasMoreMessages && (
                      <div className="flex justify-center py-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={loadMoreMessages}
                          disabled={loadingMore}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          {loadingMore ? (
                            <>
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                              Loading...
                            </>
                          ) : (
                            "Load earlier messages"
                          )}
                        </Button>
                      </div>
                    )}
                    {messages.map((message, index) => {
                      const isOwn = message.senderId === currentUserId;
                      const showDate =
                        index === 0 ||
                        new Date(message.createdAt).toDateString() !== new Date(messages[index - 1].createdAt).toDateString();
                      const groupedReactions = getGroupedReactions(message.reactions);

                      return (
                        <div key={message.id} className={isOwn ? "animate-message-own" : "animate-message-other"}>
                          {showDate && (
                            <div className="flex justify-center my-4">
                              <span className="text-xs font-medium text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                                {formatDate(message.createdAt)}
                              </span>
                            </div>
                          )}
                          <div className={cn("flex gap-2 group", isOwn ? "justify-end" : "justify-start")}>
                            {!isOwn && (
                              <Avatar className="h-7 w-7 flex-shrink-0 mt-1">
                                <AvatarImage src={selectedUser.avatar || undefined} />
                                <AvatarFallback className="bg-burgundy-100 text-burgundy-700 text-[10px] font-semibold">
                                  {getInitials(selectedUser)}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div className={cn("max-w-[75%]", isOwn && "flex flex-col items-end")}>
                              {/* Reply preview */}
                              {message.replyTo && (
                                <div
                                  className={cn(
                                    "text-xs px-2 py-1 rounded-t-lg border-l-2 mb-0.5 max-w-full",
                                    isOwn
                                      ? "bg-burgundy-500/20 border-white/50 text-white/80"
                                      : "bg-gray-100 border-burgundy-400 text-gray-600"
                                  )}
                                >
                                  <span className="font-medium text-[10px]">
                                    {message.replyTo.senderId === currentUserId ? "You" : selectedUser.firstName}
                                  </span>
                                  <p className="truncate text-[10px]">
                                    {message.replyTo.attachmentType
                                      ? `Attachment`
                                      : message.replyTo.content}
                                  </p>
                                </div>
                              )}
                              <div
                                className={cn(
                                  "rounded-2xl px-3.5 py-2.5 relative text-sm transition-all duration-200 max-w-[75%] break-words",
                                  isOwn
                                    ? "message-bubble-premium text-white rounded-br-md chat-bubble-own"
                                    : "bg-white text-gray-900 rounded-bl-md border border-gray-100 chat-bubble-other"
                                )}
                              >
                                {renderMessageContent(message, isOwn)}

                                {/* Hover actions */}
                                <div
                                  className={cn(
                                    "absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5",
                                    isOwn ? "-left-16" : "-right-16"
                                  )}
                                >
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 bg-white shadow-sm border"
                                    onClick={() => setShowReactionPicker(message.id)}
                                  >
                                    <Smile className="w-3 h-3 text-gray-500" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 bg-white shadow-sm border"
                                    onClick={() => setReplyingTo(message)}
                                  >
                                    <Reply className="w-3 h-3 text-gray-500" />
                                  </Button>
                                </div>

                                {/* Reaction picker popup */}
                                {showReactionPicker === message.id && (
                                  <div
                                    className={cn(
                                      "absolute bottom-full mb-1 bg-white rounded-full shadow-xl border p-1 flex items-center gap-0.5 z-50",
                                      isOwn ? "right-0" : "left-0"
                                    )}
                                  >
                                    {QUICK_REACTIONS.map((emoji) => (
                                      <button
                                        key={emoji}
                                        onClick={() => toggleReaction(message.id, emoji)}
                                        className="w-7 h-7 flex items-center justify-center text-base hover:bg-gray-100 rounded-full transition-colors"
                                      >
                                        {emoji}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Reactions display */}
                              {Object.keys(groupedReactions).length > 0 && (
                                <div className={cn("flex items-center gap-0.5 mt-0.5", isOwn ? "justify-end" : "justify-start")}>
                                  {Object.entries(groupedReactions).map(([emoji, data]) => (
                                    <button
                                      key={emoji}
                                      onClick={() => toggleReaction(message.id, emoji)}
                                      className={cn(
                                        "flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] border transition-colors",
                                        data.hasReacted
                                          ? "bg-burgundy-50 border-burgundy-200 text-burgundy-700"
                                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                                      )}
                                    >
                                      <span>{emoji}</span>
                                      <span>{data.count}</span>
                                    </button>
                                  ))}
                                </div>
                              )}

                              <div className={cn("flex items-center gap-1 mt-0.5 px-1", isOwn ? "flex-row-reverse" : "flex-row")}>
                                <span className="text-[10px] text-gray-400" title={formatTime(message.createdAt)}>
                                  {formatRelativeTime(message.createdAt)}
                                </span>
                                {isOwn && <CheckCheck className={cn("w-3 h-3", message.isRead ? "text-blue-500" : "text-gray-400")} />}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Student Info Panel (for coaches) */}
              {isCoach && selectedUser?.role === "STUDENT" && showStudentPanel && (
                <div className="w-64 border-l border-gray-100 bg-white overflow-y-auto hidden xl:block">
                  <div className="p-4">
                    {/* Student Overview */}
                    <div className="text-center mb-4">
                      <Avatar className="h-16 w-16 mx-auto ring-4 ring-burgundy-100">
                        <AvatarImage src={selectedUser.avatar || undefined} />
                        <AvatarFallback className="bg-burgundy-600 text-white text-xl font-bold">
                          {getInitials(selectedUser)}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-bold text-gray-900 mt-2 text-sm">
                        {selectedUser.firstName} {selectedUser.lastName}
                      </h3>
                      <p className="text-xs text-gray-500">{selectedUser.email}</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-orange-50 rounded-xl p-2 text-center">
                        <Flame className="w-4 h-4 text-orange-500 mx-auto mb-0.5" />
                        <p className="text-sm font-bold text-orange-700">{selectedUser.streak?.currentStreak || 0}</p>
                        <p className="text-[10px] text-orange-600">Streak</p>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-2 text-center">
                        <Trophy className="w-4 h-4 text-purple-500 mx-auto mb-0.5" />
                        <p className="text-sm font-bold text-purple-700">{selectedUser.streak?.totalPoints || 0}</p>
                        <p className="text-[10px] text-purple-600">Points</p>
                      </div>
                      <div className="bg-emerald-50 rounded-xl p-2 text-center">
                        <Target className="w-4 h-4 text-emerald-500 mx-auto mb-0.5" />
                        <p className="text-sm font-bold text-emerald-700">{avgProgress}%</p>
                        <p className="text-[10px] text-emerald-600">Progress</p>
                      </div>
                    </div>

                    {/* Currently Working On */}
                    {selectedUser.currentLesson && (
                      <div className="mb-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <PlayCircle className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-[10px] font-semibold text-blue-700 uppercase tracking-wide">Currently Learning</span>
                        </div>
                        <p className="text-xs font-semibold text-gray-900 leading-tight">
                          {selectedUser.currentLesson.lessonTitle}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {selectedUser.currentLesson.moduleTitle} • {selectedUser.currentLesson.courseTitle}
                        </p>
                      </div>
                    )}

                    {/* Enrolled Courses */}
                    {selectedUser.enrollments && selectedUser.enrollments.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-burgundy-600" />
                          Courses ({selectedUser.enrollments.length})
                        </h4>
                        <div className="space-y-2">
                          {selectedUser.enrollments.slice(0, 4).map((enrollment) => (
                            <div key={enrollment.id} className="bg-gray-50 rounded-lg p-2.5">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-xs font-medium text-gray-900 truncate pr-2">
                                  {enrollment.course.title}
                                </p>
                                {enrollment.status === "COMPLETED" ? (
                                  <Badge className="bg-green-100 text-green-700 border-0 text-[9px] px-1.5 py-0">
                                    Complete
                                  </Badge>
                                ) : (
                                  <Badge className="bg-blue-100 text-blue-700 border-0 text-[9px] px-1.5 py-0">
                                    In Progress
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mb-1">
                                <Progress value={enrollment.progress} className="flex-1 h-1.5" />
                                <span className="text-[10px] font-bold text-gray-700">{Math.round(enrollment.progress)}%</span>
                              </div>
                              {enrollment.totalLessons !== undefined && enrollment.totalLessons > 0 && (
                                <p className="text-[10px] text-gray-500">
                                  {enrollment.completedLessons || 0} of {enrollment.totalLessons} lessons completed
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recent Badges */}
                    {selectedUser.badges && selectedUser.badges.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                          <Award className="w-3 h-3 text-gold-500" />
                          Badges
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedUser.badges.slice(0, 4).map((ub) => (
                            <div
                              key={ub.id}
                              className="flex items-center gap-1 bg-gold-50 text-gold-700 px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                            >
                              <span>{ub.badge.icon}</span>
                              <span>{ub.badge.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Error Messages */}
            {(aiError || uploadError) && (
              <div className="px-4 py-2 bg-amber-50 border-t border-amber-100">
                <div className="flex items-center gap-2 text-amber-700 text-sm">
                  <Info className="w-4 h-4 flex-shrink-0" />
                  <p>{aiError || uploadError}</p>
                  <button
                    onClick={() => { setAiError(null); setUploadError(null); }}
                    className="ml-auto p-1 hover:bg-amber-100 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* AI Suggestion Panel */}
            {aiSuggestion && (
              <div className="px-4 py-3 bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50 border-t border-purple-100">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-purple-700">AI Suggestion</span>
                    </div>
                    <p className="text-sm text-gray-700 bg-white p-2 rounded-lg border border-purple-100">
                      {aiSuggestion}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button size="sm" onClick={acceptAiSuggestion} className="gap-1 bg-green-600 hover:bg-green-700 text-white h-7 text-xs">
                        <Check className="w-3 h-3" />
                        Use
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setAiSuggestion(null)} className="gap-1 h-7 text-xs">
                        <X className="w-3 h-3" />
                        Discard
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Voice Recording UI */}
            {(isRecording || audioBlob) && (
              <div className="px-4 py-3 bg-red-50 border-t border-red-100">
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", isRecording ? "bg-red-500 animate-pulse" : "bg-green-500")}>
                    <Mic className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">
                      {isRecording ? "Recording..." : "Voice message ready"}
                    </p>
                    <p className="text-xs text-gray-600">{formatDuration(recordingTime)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isRecording ? (
                      <>
                        <Button size="sm" variant="outline" onClick={cancelRecording} className="gap-1 h-8">
                          <X className="w-3 h-3" />
                          Cancel
                        </Button>
                        <Button size="sm" onClick={stopRecording} className="gap-1 bg-red-600 hover:bg-red-700 text-white h-8">
                          <Square className="w-3 h-3" />
                          Stop
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="outline" onClick={cancelRecording} className="gap-1 h-8">
                          <X className="w-3 h-3" />
                          Discard
                        </Button>
                        <Button size="sm" onClick={sendVoiceMessage} disabled={uploading} className="gap-1 bg-green-600 hover:bg-green-700 text-white h-8">
                          {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                          Send
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TTS AI Voice Preview Panel */}
            {ttsPreviewAudio && (
              <div className="px-4 py-3 bg-gradient-to-r from-violet-50 to-purple-50 border-t border-purple-100">
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleTtsPreview}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                      playingTtsPreview
                        ? "bg-purple-600 shadow-lg shadow-purple-300"
                        : "bg-gradient-to-br from-violet-500 to-purple-600"
                    )}
                  >
                    {playingTtsPreview ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-purple-600" />
                      <p className="font-medium text-purple-900 text-sm">AI Voice Preview</p>
                    </div>
                    <p className="text-xs text-purple-600 truncate max-w-[300px]">
                      &quot;{newMessage.slice(0, 50)}{newMessage.length > 50 ? "..." : ""}&quot;
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={cancelTtsPreview}
                      className="gap-1 h-8 border-purple-200 text-purple-600 hover:bg-purple-100"
                    >
                      <X className="w-3 h-3" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={sendTtsMessage}
                      disabled={loading}
                      className="gap-1 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white h-8"
                    >
                      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                      Send Voice
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions Panel (for coaches) */}
            {isCoach && showQuickActions && (
              <div className="px-4 py-3 bg-blue-50 border-t border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-blue-700">Quick Actions</span>
                  <button onClick={() => setShowQuickActions(false)} className="p-1 hover:bg-blue-100 rounded">
                    <X className="w-4 h-4 text-blue-600" />
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {QUICK_ACTIONS.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => useQuickAction(action.message)}
                      className="flex flex-col items-center gap-1 p-2 bg-white rounded-lg hover:bg-blue-100 transition-colors border border-blue-100"
                    >
                      <action.icon className="w-5 h-5 text-blue-600" />
                      <span className="text-[10px] font-medium text-gray-700">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Templates Panel (for coaches) */}
            {isCoach && showTemplates && (
              <div className="px-4 py-3 bg-emerald-50 border-t border-emerald-100 max-h-48 overflow-y-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-emerald-700">Message Templates</span>
                  <button onClick={() => setShowTemplates(false)} className="p-1 hover:bg-emerald-100 rounded">
                    <X className="w-4 h-4 text-emerald-600" />
                  </button>
                </div>
                <div className="space-y-2">
                  {MESSAGE_TEMPLATES.map((category) => (
                    <div key={category.category}>
                      <p className="text-[10px] font-semibold text-emerald-600 mb-1">{category.category}</p>
                      <div className="space-y-1">
                        {category.templates.map((template, i) => (
                          <button
                            key={i}
                            onClick={() => useTemplate(template)}
                            className="w-full text-left p-2 bg-white rounded-lg hover:bg-emerald-100 transition-colors text-xs text-gray-700 border border-emerald-100"
                          >
                            {template.slice(0, 80)}...
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reply Preview */}
            {replyingTo && (
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
                <div className="w-1 h-8 bg-burgundy-500 rounded-full" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-burgundy-600">
                    Replying to {replyingTo.senderId === currentUserId ? "yourself" : selectedUser.firstName}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {replyingTo.attachmentType ? `Attachment` : replyingTo.content}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setReplyingTo(null)} className="h-6 w-6">
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}

            {/* Quick Reply Buttons for Students - show for COACH/MENTOR (Sarah) */}
            {!isCoach && (selectedUser?.role === "COACH" || selectedUser?.role === "MENTOR") && messages.length <= 5 && !newMessage.trim() && (
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                <p className="text-[10px] font-medium text-gray-500 mb-2">Quick Replies</p>
                <div className="flex flex-wrap gap-2">
                  {STUDENT_QUICK_REPLIES.map((reply) => (
                    <button
                      key={reply.text}
                      onClick={() => setNewMessage(reply.text)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-gray-200 text-xs font-medium text-gray-700 hover:bg-burgundy-50 hover:border-burgundy-200 hover:text-burgundy-700 transition-all"
                    >
                      <span>{reply.emoji}</span>
                      <span>{reply.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="px-4 py-3 bg-white border-t border-gray-100 relative">
              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute bottom-full left-4 mb-2 bg-white rounded-xl shadow-xl border border-gray-200 p-3 w-72 z-50 max-h-64 overflow-y-auto">
                  {EMOJI_CATEGORIES.map((category) => (
                    <div key={category.name} className="mb-3">
                      <p className="text-[10px] font-semibold text-gray-500 mb-1">{category.name}</p>
                      <div className="flex flex-wrap gap-0.5">
                        {category.emojis.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => addEmoji(emoji)}
                            className="w-7 h-7 flex items-center justify-center text-lg hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Typing Indicator - Premium Design */}
              {otherUserTyping && (
                <div className="flex items-start gap-2 px-4 py-3 animate-fade-in">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={selectedUser?.avatar || undefined} />
                    <AvatarFallback className="bg-burgundy-100 text-burgundy-700 text-xs font-semibold">
                      {selectedUser?.firstName?.[0]}{selectedUser?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="typing-bubble rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-burgundy-400 rounded-full animate-typing-dot-1" />
                        <span className="w-2.5 h-2.5 bg-burgundy-400 rounded-full animate-typing-dot-2" />
                        <span className="w-2.5 h-2.5 bg-burgundy-400 rounded-full animate-typing-dot-3" />
                      </div>
                      <span className="text-sm text-gray-600 font-medium">
                        {selectedUser?.firstName} is typing...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Schedule Modal */}
              {showScheduleModal && (
                <div className="absolute bottom-full left-4 mb-2 bg-white rounded-xl shadow-xl border border-gray-200 p-4 w-80 z-50">
                  <h4 className="font-semibold text-gray-900 mb-3">Schedule Message</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Date</label>
                      <input
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Time</label>
                      <input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowScheduleModal(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleScheduleMessage}
                        disabled={!scheduleDate || !scheduleTime || !newMessage.trim()}
                        className="flex-1 bg-burgundy-600 hover:bg-burgundy-700"
                      >
                        Schedule
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-burgundy-300 focus-within:ring-2 focus-within:ring-burgundy-100 transition-all">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => { setNewMessage(e.target.value); handleTyping(); }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    className="border-0 bg-transparent focus-visible:ring-0 resize-none min-h-[40px] max-h-[120px] py-2 px-3 text-sm"
                    disabled={isRecording || !!audioBlob}
                    rows={1}
                  />
                  <div className="flex items-center gap-1 px-2 pb-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-gray-400 hover:text-gray-600"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading || isRecording}
                    >
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-gray-400 hover:text-gray-600"
                      onClick={() => imageInputRef.current?.click()}
                      disabled={uploading || isRecording}
                    >
                      <ImageIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={cn("h-7 w-7", showEmojiPicker ? "text-burgundy-600 bg-burgundy-50" : "text-gray-400 hover:text-gray-600")}
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      disabled={isRecording}
                    >
                      <Smile className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={cn("h-7 w-7", isRecording ? "text-red-600 bg-red-50" : "text-gray-400 hover:text-gray-600")}
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={uploading || !!audioBlob || !!ttsPreviewAudio}
                    >
                      <Mic className="w-4 h-4" />
                    </Button>
                    {/* AI Voice (TTS) Button - converts typed text to AI voice */}
                    {isCoach && !ttsPreviewAudio && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-7 w-7 transition-all",
                          generatingTts
                            ? "text-purple-600 bg-purple-50"
                            : newMessage.trim()
                              ? "text-purple-500 hover:text-purple-600 hover:bg-purple-50"
                              : "text-gray-300 cursor-not-allowed"
                        )}
                        onClick={generateAiVoice}
                        disabled={generatingTts || isRecording || !!audioBlob || !newMessage.trim()}
                        title={newMessage.trim() ? "Convert to AI Voice" : "Type a message first"}
                      >
                        {generatingTts ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
                {/* Schedule Button */}
                {isCoach && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowScheduleModal(!showScheduleModal)}
                    disabled={!newMessage.trim()}
                    className={cn(
                      "rounded-xl h-10 w-10 border-gray-200",
                      showScheduleModal ? "bg-gold-50 border-gold-300 text-gold-600" : "hover:bg-gray-50"
                    )}
                    title="Schedule message"
                  >
                    <Clock className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={loading || uploading || (!newMessage.trim() && !audioBlob) || isRecording}
                  size="icon"
                  className="bg-burgundy-600 hover:bg-burgundy-700 rounded-xl h-10 w-10"
                >
                  {loading || uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </form>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-burgundy-50/30">
            <div className="text-center px-8 max-w-md">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-burgundy-100 rounded-3xl flex items-center justify-center">
                  <MessageSquare className="w-12 h-12 text-burgundy-600" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gold-400 rounded-xl flex items-center justify-center shadow rotate-12">
                  <Heart className="w-5 h-5 text-white" />
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {isCoach ? "Coach Dashboard" : "Your Personal Coach"}
              </h2>
              <p className="text-gray-500 mb-6 text-sm">
                {isCoach
                  ? "Connect with your students and guide them on their wellness journey."
                  : "Get personalized support and guidance from your dedicated coach."}
              </p>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="p-3 bg-white rounded-xl border border-gray-100">
                  <MessageCircle className="w-6 h-6 text-burgundy-500 mx-auto mb-2" />
                  <p className="text-xs font-medium text-gray-900">1:1 Chat</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-gray-100">
                  <HandHeart className="w-6 h-6 text-gold-500 mx-auto mb-2" />
                  <p className="text-xs font-medium text-gray-900">Support</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-gray-100">
                  <TrendingUp className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                  <p className="text-xs font-medium text-gray-900">Progress</p>
                </div>
              </div>

              <Button onClick={() => setShowMentors(true)} className="gap-2 bg-burgundy-600 hover:bg-burgundy-700">
                <MessageSquare className="w-4 h-4" />
                {isCoach ? "View Students" : "Start Chatting"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close pickers */}
      {(showEmojiPicker || showReactionPicker) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowEmojiPicker(false);
            setShowReactionPicker(null);
          }}
        />
      )}

      {/* New DM Modal for Coaches */}
      {showNewDmModal && isCoach && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Send className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">New Message</h3>
                    <p className="text-burgundy-200 text-sm">Search for a student to message</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowNewDmModal(false);
                    setStudentSearchQuery("");
                    setStudentSearchResults([]);
                  }}
                  className="text-white hover:bg-white/20 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Type student name or email..."
                  className="pl-9 h-11"
                  value={studentSearchQuery}
                  onChange={(e) => searchStudentsForDm(e.target.value)}
                  autoFocus
                />
                {searchingStudents && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-burgundy-500" />
                )}
              </div>
            </div>

            {/* Search Results */}
            <div className="max-h-80 overflow-y-auto p-2">
              {studentSearchQuery.length < 2 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">Type at least 2 characters to search</p>
                </div>
              ) : studentSearchResults.length === 0 && !searchingStudents ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No students found for "{studentSearchQuery}"</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {studentSearchResults.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => startConversation(student)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-burgundy-50 transition-all text-left group"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={student.avatar || undefined} />
                        <AvatarFallback className="bg-burgundy-100 text-burgundy-700 font-semibold text-sm">
                          {getInitials(student)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm">
                          {student.firstName || "Student"} {student.lastName || ""}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{student.email}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-burgundy-500 transition-colors" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
