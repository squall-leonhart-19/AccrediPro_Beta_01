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
}

export function LessonContentReader({
  content,
  lessonId,
  isCompleted,
  estimatedReadTime,
  onMarkComplete,
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

    return () => window.removeEventListener("scroll", handleScroll);
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
      {readingProgress >= 90 && !isCompleted && (
        <div className="mt-8 p-6 bg-gradient-to-r from-burgundy-50 to-gold-50 rounded-2xl border border-burgundy-200 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-burgundy-500 to-burgundy-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Great job finishing this lesson!
              </h3>
              <p className="text-gray-600 text-sm">
                Click "Complete & Next" below to save your progress and continue.
              </p>
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
