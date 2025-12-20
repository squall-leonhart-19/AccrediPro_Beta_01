"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  CheckCircle,
  Clock,
  MessageCircle,
  Play,
  List,
  X,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  StickyNote,
  Send,
} from "lucide-react";

// Static lesson data for R.O.O.T.S. Mini Course
const COURSE_NAME = "R.O.O.T.S. Method\u2122 \u2014 Clinical Foundations Mini Course";
const BRAND_COLOR = "#722F37";

const ALL_LESSONS = [
  { num: 1, title: "From Burnout to Purpose", readTime: "6 min" },
  { num: 2, title: "Your Clinical Advantage Assessment", readTime: "5 min" },
  { num: 3, title: "The R.O.O.T.S. Framework Overview", readTime: "6 min" },
  { num: 4, title: "R \u2014 Recognize the Pattern", readTime: "6 min" },
  { num: 5, title: "O \u2014 Find the Origin", readTime: "6 min" },
  { num: 6, title: "O \u2014 Optimize the Foundations", readTime: "6 min" },
  { num: 7, title: "T \u2014 Transform with Coaching", readTime: "6 min" },
  { num: 8, title: "S \u2014 Scale Your Practice", readTime: "8 min" },
  { num: 9, title: "Case Study + Final Exam", readTime: "10 min" },
];

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
}

interface RootsLearningClientProps {
  lessonNumber: number;
  lessonTitle: string;
  children: React.ReactNode;
  onComplete?: () => void;
  isLastSection?: boolean;
  canContinue?: boolean;
}

export function RootsLearningClient({
  lessonNumber,
  lessonTitle,
  children,
  onComplete,
  isLastSection = false,
  canContinue = true,
}: RootsLearningClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [coachId, setCoachId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const pollInterval = useRef<NodeJS.Timeout | null>(null);

  // Get completed lessons from localStorage
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("roots-completed-lessons");
    if (saved) {
      setCompletedLessons(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const isDesktop = window.innerWidth >= 1024;
    if (isDesktop) {
      setSidebarOpen(true);
    }
  }, []);

  // Load notes
  useEffect(() => {
    const savedNotes = localStorage.getItem(`roots-lesson-${lessonNumber}-notes`);
    if (savedNotes) setNotes(savedNotes);
  }, [lessonNumber]);

  const handleNotesChange = (value: string) => {
    setNotes(value);
    localStorage.setItem(`roots-lesson-${lessonNumber}-notes`, value);
  };

  // Chat functionality
  useEffect(() => {
    const init = async () => {
      try {
        const s = await fetch("/api/auth/session");
        const sd = await s.json();
        if (sd?.user?.id) setCurrentUserId(sd.user.id);
        const c = await fetch("/api/coach/assigned");
        const cd = await c.json();
        if (cd?.coach?.id) setCoachId(cd.coach.id);
      } catch (e) {
        console.error(e);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (showChat && coachId) {
      fetchMessages();
      pollInterval.current = setInterval(fetchMessages, 5000);
    }
    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, [showChat, coachId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    if (!coachId) return;
    try {
      const r = await fetch(`/api/messages?userId=${coachId}`);
      const d = await r.json();
      if (d.success) setMessages(d.data);
    } catch (e) {
      console.error(e);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !coachId || isSending) return;
    setIsSending(true);
    try {
      const r = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: coachId, content: newMessage }),
      });
      const d = await r.json();
      if (d.success) {
        setMessages([...messages, d.data]);
        setNewMessage("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (d: string) =>
    new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const courseProgress = Math.round((completedLessons.length / 9) * 100);
  const currentLesson = ALL_LESSONS[lessonNumber - 1];
  const nextLessonNum = lessonNumber < 9 ? lessonNumber + 1 : null;

  const handleCompleteLesson = () => {
    if (!completedLessons.includes(lessonNumber)) {
      const updated = [...completedLessons, lessonNumber];
      setCompletedLessons(updated);
      localStorage.setItem("roots-completed-lessons", JSON.stringify(updated));
    }
    onComplete?.();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 h-14 sm:h-16">
          {/* Left: Back + Course Info */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <Link href="/roots-method">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 sm:gap-2 text-gray-600 hover:text-burgundy-700 hover:bg-burgundy-50 px-2 sm:px-3"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>

            {/* Course Info */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src="/newlogo.webp"
                  alt="AccrediPro"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                  {lessonTitle}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 truncate">
                  Lesson {lessonNumber} of 9
                </p>
              </div>
            </div>
          </div>

          {/* Right: Progress + Toggle */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {/* Progress Ring */}
            <div className="flex items-center">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="35%"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="35%"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={100}
                    strokeDashoffset={100 - courseProgress}
                    className="text-burgundy-600 transition-all duration-1000"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs font-bold text-burgundy-600">
                  {courseProgress}%
                </span>
              </div>
            </div>

            {/* Sidebar Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 hover:text-burgundy-700 hover:bg-burgundy-50"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <List className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex">
        {/* Main Content Area */}
        <main
          className={cn(
            "flex-1 transition-all duration-500 min-h-[calc(100vh-64px)]",
            sidebarOpen ? "lg:mr-96" : "mr-0"
          )}
        >
          {/* Content Section */}
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            {/* Lesson Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                {completedLessons.includes(lessonNumber) && (
                  <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Completed
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                  <Clock className="w-4 h-4" />
                  {currentLesson?.readTime}
                </span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {lessonTitle}
              </h1>
              <p className="text-gray-500">
                Lesson {lessonNumber} of 9
              </p>
            </div>

            {/* Lesson Content */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg border border-gray-100 mb-8">
              {children}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4 py-8 border-t border-gray-200">
              {/* Previous Button */}
              {lessonNumber > 1 ? (
                <Link href={`/roots-method/lesson-${lessonNumber - 1}`}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 group hover:bg-burgundy-50 hover:border-burgundy-300"
                  >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">Back</span>
                  </Button>
                </Link>
              ) : (
                <div />
              )}

              {/* Next/Complete Button */}
              {isLastSection ? (
                nextLessonNum ? (
                  <Link href={`/roots-method/lesson-${nextLessonNum}`}>
                    <Button
                      size="lg"
                      className="gap-2 bg-burgundy-600 hover:bg-burgundy-700 text-white"
                      onClick={handleCompleteLesson}
                      disabled={!canContinue}
                    >
                      Continue to Lesson {nextLessonNum}
                      <ChevronLeft className="w-5 h-5 rotate-180" />
                    </Button>
                  </Link>
                ) : (
                  <Button
                    size="lg"
                    className="gap-2 bg-burgundy-600 hover:bg-burgundy-700 text-white"
                    onClick={handleCompleteLesson}
                    disabled={!canContinue}
                  >
                    Complete Course
                    <CheckCircle className="w-5 h-5" />
                  </Button>
                )
              ) : (
                <Button
                  size="lg"
                  className="gap-2 bg-burgundy-600 hover:bg-burgundy-700 text-white"
                  onClick={onComplete}
                  disabled={!canContinue}
                >
                  Continue
                  <ChevronLeft className="w-5 h-5 rotate-180" />
                </Button>
              )}
            </div>

            <div className="h-20" />
          </div>
        </main>

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed top-16 right-0 h-[calc(100vh-64px)] w-96 bg-white border-l border-gray-200 shadow-xl z-40 transition-all duration-500 overflow-hidden",
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* Sidebar Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 p-5 z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Course Content</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-gray-600 lg:hidden"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Overall Progress */}
            <div className="bg-burgundy-50 rounded-xl p-4 border border-burgundy-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                <span className="text-sm font-bold text-burgundy-600">{courseProgress}%</span>
              </div>
              <Progress value={courseProgress} className="h-2" />
              <p className="text-xs text-gray-500 mt-2">
                {completedLessons.length} of 9 lessons completed
              </p>
            </div>
          </div>

          {/* Lesson List */}
          <div className="overflow-y-auto p-4" style={{ height: "calc(100vh - 64px - 140px)" }}>
            {ALL_LESSONS.map((lesson) => {
              const isCompleted = completedLessons.includes(lesson.num);
              const isCurrent = lesson.num === lessonNumber;
              const isLocked = lesson.num > 1 && !completedLessons.includes(lesson.num - 1) && !isCurrent;

              return (
                <Link
                  key={lesson.num}
                  href={isLocked ? "#" : `/roots-method/lesson-${lesson.num}`}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-2",
                    isCurrent
                      ? "bg-burgundy-100 border border-burgundy-200"
                      : isLocked
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-50"
                  )}
                  onClick={(e) => isLocked && e.preventDefault()}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold",
                      isCompleted
                        ? "bg-green-100 text-green-600"
                        : isCurrent
                          ? "bg-burgundy-600 text-white"
                          : "bg-gray-100 text-gray-500"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : isCurrent ? (
                      <Play className="w-4 h-4" />
                    ) : (
                      lesson.num
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm truncate",
                        isCurrent
                          ? "font-semibold text-burgundy-700"
                          : isCompleted
                            ? "text-green-700"
                            : "text-gray-700"
                      )}
                    >
                      {lesson.title}
                    </p>
                    <p className="text-xs text-gray-400">{lesson.readTime}</p>
                  </div>
                  {isCurrent && (
                    <div className="w-2 h-2 rounded-full bg-burgundy-500 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>

        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>

      {/* Floating Chat Button - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Notes Button */}
        <button
          onClick={() => setShowNotes(!showNotes)}
          className={cn(
            "w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105",
            showNotes
              ? "bg-burgundy-700 text-white"
              : "bg-white text-burgundy-700 border-2 border-burgundy-200 hover:border-burgundy-400"
          )}
        >
          <StickyNote className="w-6 h-6" />
        </button>

        {/* Chat Button */}
        <button
          onClick={() => setShowChat(!showChat)}
          className={cn(
            "w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105",
            showChat
              ? "bg-burgundy-700 text-white"
              : "bg-burgundy-700 text-white hover:bg-burgundy-800"
          )}
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>

      {/* Notes Modal */}
      {showNotes && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-gray-900">Your Notes - Lesson {lessonNumber}</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowNotes(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-4">
              <textarea
                value={notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="Take notes as you learn..."
                className="w-full h-64 border border-gray-200 rounded-xl p-4 text-sm resize-none focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-2">Notes save automatically</p>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-40 flex flex-col">
          <div className="flex items-center justify-between p-4 bg-burgundy-700 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 ring-2 ring-burgundy-500">
                <AvatarImage src="/coaches/sarah-coach.webp" />
                <AvatarFallback className="bg-burgundy-600 text-white">SC</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-white">Coach Sarah</p>
                <p className="text-xs text-burgundy-200">Your R.O.O.T.S. Coach</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowChat(false)}
              className="text-white hover:bg-burgundy-600"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-medium">Hi! I'm Coach Sarah</p>
                <p className="text-sm mt-1">Ask me anything about R.O.O.T.S.</p>
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "mb-4 flex flex-col",
                    m.senderId === currentUserId ? "items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] px-4 py-2 rounded-2xl",
                      m.senderId === currentUserId
                        ? "bg-burgundy-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    )}
                  >
                    <p className="text-sm">{m.content}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{formatTime(m.createdAt)}</p>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
              />
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim() || isSending}
                size="icon"
                className="rounded-full bg-burgundy-600 hover:bg-burgundy-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
