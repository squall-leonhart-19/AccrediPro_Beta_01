"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { CheckCircle, BookOpen, Clock, ChevronUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LessonContentReaderProps {
  content: string;
  lessonId: string;
  isCompleted: boolean;
  estimatedReadTime?: number; // in minutes
  onMarkComplete?: () => void;
  hideCompletionMessage?: boolean; // For Final Exam module - hide the "Great job" message
}

export function LessonContentReader({
  content,
  lessonId,
  isCompleted,
  estimatedReadTime,
  onMarkComplete,
  hideCompletionMessage = false,
}: LessonContentReaderProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [sectionsRead, setSectionsRead] = useState<Set<string>>(new Set());

  // Calculate reading progress based on scroll position
  const calculateReadingProgress = useCallback(() => {
    if (!contentRef.current) return;

    const element = contentRef.current;
    const scrollTop = window.scrollY;
    const elementTop = element.offsetTop;
    const elementHeight = element.offsetHeight;
    const windowHeight = window.innerHeight;

    // Calculate how much of the content has been scrolled past
    const scrolledPast = scrollTop - elementTop + windowHeight;
    const totalScrollable = elementHeight;

    if (scrolledPast <= 0) {
      setReadingProgress(0);
    } else if (scrolledPast >= totalScrollable) {
      setReadingProgress(100);
    } else {
      setReadingProgress(Math.round((scrolledPast / totalScrollable) * 100));
    }

    // Show scroll to top button when scrolled down
    setShowScrollTop(scrollTop > 400);
  }, []);

  // Track which sections have been read
  const trackSections = useCallback(() => {
    if (!contentRef.current) return;

    const headings = contentRef.current.querySelectorAll("h2, h3");
    const windowHeight = window.innerHeight;
    const scrollTop = window.scrollY;

    headings.forEach((heading) => {
      const rect = heading.getBoundingClientRect();
      const elementTop = rect.top + scrollTop;

      // If the section has been scrolled past the middle of the viewport
      if (elementTop < scrollTop + windowHeight * 0.6) {
        const sectionId = heading.textContent || "";
        setSectionsRead((prev) => new Set([...prev, sectionId]));
      }

      // Track active section (currently in view)
      if (rect.top > 0 && rect.top < windowHeight / 2) {
        setActiveSection(heading.textContent || null);
      }
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      calculateReadingProgress();
      trackSections();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    // Inject toggleAnswer function for inline onclick handlers in lesson HTML
    // This handles both ID-based (onclick="toggleAnswer('answer-1')") and
    // button-based (onclick="toggleAnswer(this)") patterns used in lessons.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).toggleAnswer = (btnOrId: HTMLButtonElement | string) => {
      let answerElement: HTMLElement | null = null;
      let button: HTMLButtonElement | null = null;

      // Determine if we were passed a button element or an ID string
      if (typeof btnOrId === "string") {
        // ID-based: find element by ID
        answerElement = document.getElementById(btnOrId);
      } else if (btnOrId instanceof HTMLElement) {
        // Button-based: answer is the next sibling element
        button = btnOrId as HTMLButtonElement;
        answerElement = button.nextElementSibling as HTMLElement;
      }

      if (answerElement) {
        // Clear any auto-hide timeouts that may have been set by embedded scripts
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const existingTimeout = (answerElement as any)._hideTimeout;
        if (existingTimeout) {
          clearTimeout(existingTimeout);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          delete (answerElement as any)._hideTimeout;
        }

        // Check current visibility state
        const isCurrentlyHidden =
          answerElement.style.display === "none" ||
          answerElement.classList.contains("hidden") ||
          !answerElement.classList.contains("show");

        if (isCurrentlyHidden) {
          // Show the answer
          answerElement.style.display = "block";
          answerElement.classList.remove("hidden");
          answerElement.classList.add("show");
          if (button) button.textContent = "Hide Answer";
        } else {
          // Hide the answer
          answerElement.style.display = "none";
          answerElement.classList.add("hidden");
          answerElement.classList.remove("show");
          if (button) button.textContent = "Reveal Answer";
        }
      }
    };

    return () => {
      window.removeEventListener("scroll", handleScroll);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).toggleAnswer;
    };
  }, [calculateReadingProgress, trackSections]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Calculate estimated read time from content if not provided
  const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  const readMinutes = estimatedReadTime || Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="relative">
      {/* Reading Progress Bar - Fixed at top of content */}
      <div className="sticky top-[73px] z-40 bg-white border-b border-gray-100 -mx-6 lg:-mx-8 px-6 lg:px-8 py-3 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <BookOpen className="w-4 h-4 text-burgundy-600" />
              <span className="hidden sm:inline">Reading Progress</span>
            </div>
            <div className="w-32 sm:w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-burgundy-500 to-burgundy-600 transition-all duration-300 ease-out"
                style={{ width: `${readingProgress}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-burgundy-600">
              {readingProgress}%
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{readMinutes} min read</span>
            </div>
            {isCompleted && (
              <div className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                <CheckCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Completed</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lesson Content */}
      <div
        ref={contentRef}
        className="lesson-content max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Completion message - Shows when 90%+ read (button removed - use bottom nav) */}
      {readingProgress >= 90 && !isCompleted && !hideCompletionMessage && (
        <div className="mt-8 relative overflow-hidden rounded-2xl animate-fade-in">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-burgundy-600 via-burgundy-700 to-purple-700" />

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/20 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-400/20 rounded-full blur-2xl" />

          <div className="relative p-6 flex items-center gap-4">
            {/* Icon with glow */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gold-400 rounded-full blur-md opacity-50 animate-pulse" />
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-xl">
                <Sparkles className="w-8 h-8 text-burgundy-800" />
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1">
                Great job finishing this lesson!
              </h3>
              <p className="text-burgundy-100 text-sm">
                Click <span className="font-semibold text-gold-300">"Complete & Next"</span> below to save your progress and continue.
              </p>
            </div>

            {/* XP indicator */}
            <div className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 flex-shrink-0">
              <span className="text-gold-400 font-bold">+25 XP</span>
            </div>
          </div>
        </div>
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className={cn(
            "fixed bottom-24 right-6 z-50 w-12 h-12 rounded-full",
            "bg-white shadow-lg border border-gray-200",
            "flex items-center justify-center",
            "hover:bg-gray-50 hover:shadow-xl transition-all",
            "animate-fade-in"
          )}
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-5 h-5 text-gray-600" />
        </button>
      )}
    </div>
  );
}
