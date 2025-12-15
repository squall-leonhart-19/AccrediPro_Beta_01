"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Award,
  Trophy,
  RotateCcw,
  ArrowRight,
  MessageCircle,
  Save,
  Play,
  Sparkles,
  Target,
  Clock,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

interface QuizAnswer {
  id: string;
  answer: string;
  order: number;
}

interface QuizQuestion {
  id: string;
  question: string;
  explanation?: string;
  questionType: "MULTIPLE_CHOICE" | "MULTI_SELECT" | "TRUE_FALSE";
  order: number;
  points: number;
  answers: QuizAnswer[];
}

interface Quiz {
  id: string;
  title: string;
  description?: string;
  passingScore: number;
  maxAttempts?: number;
  timeLimit?: number;
  isRequired: boolean;
  showCorrectAnswers: boolean;
  questions: QuizQuestion[];
}

interface InlineQuizProps {
  quiz: Quiz;
  module: { id: string; title: string; order: number };
  course: {
    id: string;
    title: string;
    slug: string;
    coach?: {
      id: string;
      firstName: string;
      lastName: string;
      avatar?: string;
    };
  };
  nextModule?: {
    id: string;
    title: string;
    firstLessonId: string;
  };
  hasPassed: boolean;
  previousAttempts: {
    id: string;
    score: number;
    passed: boolean;
  }[];
}

type QuizState = "ready" | "in_progress" | "results";

export function InlineQuiz({
  quiz,
  module,
  course,
  nextModule,
  hasPassed: initialHasPassed,
  previousAttempts,
}: InlineQuizProps) {
  const router = useRouter();
  const quizRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<QuizState>(initialHasPassed ? "results" : "ready");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasPassed, setHasPassed] = useState(initialHasPassed);
  const [results, setResults] = useState<{
    score: number;
    passed: boolean;
    correctAnswers: Record<string, string[]>;
    explanations: Record<string, string>;
  } | null>(initialHasPassed ? { score: previousAttempts[0]?.score || 100, passed: true, correctAnswers: {}, explanations: {} } : null);

  const totalQuestions = quiz.questions.length;
  const answeredQuestions = Object.keys(selectedAnswers).length;
  const progressPercent = (answeredQuestions / totalQuestions) * 100;

  const coachInitials = course.coach
    ? `${course.coach.firstName?.[0] || ""}${course.coach.lastName?.[0] || ""}`
    : "C";

  // Scroll to quiz when starting
  useEffect(() => {
    if (state === "in_progress" && quizRef.current) {
      quizRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [state]);

  const saveProgress = async (answers: Record<string, string[]>, questionIndex: number) => {
    setIsSaving(true);
    try {
      await fetch("/api/quiz/save-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: quiz.id,
          responses: answers,
          currentQuestion: questionIndex,
        }),
      });
      setLastSaved(new Date());
    } catch (error) {
      console.error("Failed to save progress:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectAnswer = (questionId: string, answerId: string) => {
    const question = quiz.questions.find((q) => q.id === questionId);
    if (!question) return;

    let newAnswers: Record<string, string[]>;

    if (question.questionType === "MULTI_SELECT") {
      const current = selectedAnswers[questionId] || [];
      if (current.includes(answerId)) {
        newAnswers = {
          ...selectedAnswers,
          [questionId]: current.filter((id) => id !== answerId),
        };
      } else {
        newAnswers = {
          ...selectedAnswers,
          [questionId]: [...current, answerId],
        };
      }
    } else {
      newAnswers = {
        ...selectedAnswers,
        [questionId]: [answerId],
      };
    }

    setSelectedAnswers(newAnswers);
    saveProgress(newAnswers, currentQuestion);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: quiz.id,
          moduleId: module.id,
          courseId: course.id,
          responses: selectedAnswers,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success !== false) {
        setResults({
          score: data.score,
          passed: data.passed,
          correctAnswers: data.correctAnswers || {},
          explanations: data.explanations || {},
        });
        setHasPassed(data.passed);
        setState("results");

        if (data.passed) {
          // Big celebration for passing!
          const duration = 3 * 1000;
          const animationEnd = Date.now() + duration;
          const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

          const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

          const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
              return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            confetti({
              ...defaults,
              particleCount,
              origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            });
            confetti({
              ...defaults,
              particleCount,
              origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            });
          }, 250);
        }
      } else {
        console.error("Quiz submit error:", data.error);
        alert(data.error || "Failed to submit quiz. Please try again.");
      }
    } catch (error) {
      console.error("Failed to submit quiz:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setResults(null);
    setCurrentQuestion(0);
    setState("ready");
  };

  const handleStartQuiz = () => {
    setState("in_progress");
  };

  // DEV ONLY: Auto-pass for testing certificate generation
  const handleAutoPass = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/quiz/auto-pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: quiz.id,
          moduleId: module.id,
          courseId: course.id,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResults({
          score: data.score,
          passed: true,
          correctAnswers: {},
          explanations: {},
        });
        setHasPassed(true);
        setState("results");

        // Celebration confetti
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };
        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
          const timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) return clearInterval(interval);

          const particleCount = 50 * (timeLeft / duration);
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        router.refresh();
      } else {
        alert(data.error || "Auto-pass failed");
      }
    } catch (error) {
      console.error("Auto-pass error:", error);
      alert("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(c => c + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(c => c - 1);
    }
  };

  // Ready state - Show beautiful quiz intro card
  if (state === "ready") {
    return (
      <div ref={quizRef} className="mt-10 scroll-mt-24">
        {/* Decorative divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-burgundy-300 to-transparent" />
          <div className="flex items-center gap-2 px-4 py-2 bg-burgundy-50 rounded-full border border-burgundy-200">
            <Award className="w-4 h-4 text-burgundy-600" />
            <span className="text-sm font-medium text-burgundy-700">Module Quiz</span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-burgundy-300 to-transparent" />
        </div>

        <div className="relative overflow-hidden bg-burgundy-700 rounded-3xl p-8 shadow-xl border border-burgundy-600">
          {/* Brand Logo */}
          <div className="absolute top-4 right-4 opacity-20">
            <img src="/logo-white.png" alt="" className="h-8" />
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-burgundy-600 rounded-2xl flex items-center justify-center border border-burgundy-500">
                <Target className="w-8 h-8 text-gold-400" />
              </div>
              <div>
                <p className="text-burgundy-300 text-sm font-medium">Module {module.order} Complete!</p>
                <h3 className="text-2xl font-bold text-white">Time for Your Quiz</h3>
              </div>
            </div>

            <p className="text-burgundy-200 mb-8 text-lg">
              Test your knowledge and unlock the next module. You&apos;ve got this!
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-burgundy-600 border border-burgundy-500 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-white">{totalQuestions}</p>
                <p className="text-burgundy-300 text-sm">Questions</p>
              </div>
              <div className="bg-burgundy-600 border border-burgundy-500 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-white">{quiz.passingScore}%</p>
                <p className="text-burgundy-300 text-sm">To Pass</p>
              </div>
              <div className="bg-burgundy-600 border border-burgundy-500 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-1 text-white">
                  <Zap className="w-5 h-5 text-gold-400" />
                  <p className="text-xl font-bold">∞</p>
                </div>
                <p className="text-burgundy-300 text-sm">Retries</p>
              </div>
            </div>

            <Button
              onClick={handleStartQuiz}
              size="lg"
              className="w-full bg-gold-500 text-burgundy-900 hover:bg-gold-400 font-bold py-6 text-lg rounded-xl shadow-lg transition-all hover:scale-[1.02]"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Quiz
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>

            {/* DEV ONLY: Auto-pass button for testing */}
            {process.env.NODE_ENV === "development" && (
              <Button
                onClick={handleAutoPass}
                size="lg"
                variant="outline"
                className="w-full mt-3 border-gold-500 bg-burgundy-600 text-gold-400 hover:bg-burgundy-500 font-bold py-4 text-sm"
              >
                <Zap className="w-4 h-4 mr-2" />
                DEV: Auto-Pass (Test Certificate)
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // In Progress state
  if (state === "in_progress") {
    const question = quiz.questions[currentQuestion];
    const isAnswered = selectedAnswers[question.id]?.length > 0;
    const allAnswered = answeredQuestions === totalQuestions;

    return (
      <div ref={quizRef} className="mt-10 scroll-mt-24">
        {/* Decorative divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-burgundy-300 to-transparent" />
          <div className="flex items-center gap-2 px-4 py-2 bg-burgundy-50 rounded-full border border-burgundy-200">
            <Award className="w-4 h-4 text-burgundy-600" />
            <span className="text-sm font-medium text-burgundy-700">Module {module.order} Quiz</span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-burgundy-300 to-transparent" />
        </div>

        {/* Progress header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {isSaving ? (
              <>
                <Save className="w-4 h-4 animate-pulse text-burgundy-500" />
                <span>Saving...</span>
              </>
            ) : lastSaved ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Saved</span>
              </>
            ) : null}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <Progress value={progressPercent} className="h-2" />
          <div className="flex justify-between mt-2">
            {quiz.questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(i)}
                className={cn(
                  "w-8 h-8 rounded-full text-xs font-medium transition-all",
                  i === currentQuestion
                    ? "bg-burgundy-600 text-white scale-110 shadow-lg"
                    : selectedAnswers[q.id]?.length
                      ? "bg-burgundy-100 text-burgundy-700 border-2 border-burgundy-300"
                      : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          {/* Question header */}
          <div className="bg-gradient-to-r from-burgundy-50 to-purple-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              {question.questionType === "MULTI_SELECT" && (
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                  Select all that apply
                </span>
              )}
            </div>
          </div>

          {/* Question content */}
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 leading-relaxed">
              {question.question}
            </h3>

            {/* Answers */}
            <div className="space-y-3">
              {question.answers.map((answer, index) => {
                const isSelected = selectedAnswers[question.id]?.includes(answer.id);
                const letter = String.fromCharCode(65 + index); // A, B, C, D...

                return (
                  <button
                    key={answer.id}
                    onClick={() => handleSelectAnswer(question.id, answer.id)}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 group",
                      isSelected
                        ? "border-burgundy-500 bg-burgundy-50 shadow-md"
                        : "border-gray-200 hover:border-burgundy-300 hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all",
                          isSelected
                            ? "bg-burgundy-600 text-white"
                            : "bg-gray-100 text-gray-500 group-hover:bg-burgundy-100 group-hover:text-burgundy-600"
                        )}
                      >
                        {letter}
                      </div>
                      <span className={cn(
                        "flex-1 text-gray-700",
                        isSelected && "text-burgundy-800 font-medium"
                      )}>
                        {answer.answer}
                      </span>
                      {isSelected && (
                        <CheckCircle className="w-5 h-5 text-burgundy-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 0}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              {currentQuestion < totalQuestions - 1 ? (
                <Button
                  onClick={handleNextQuestion}
                  disabled={!isAnswered}
                  className="gap-2 bg-burgundy-600 hover:bg-burgundy-700"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!allAnswered || isSubmitting}
                  className="gap-2 bg-gradient-to-r from-burgundy-600 to-purple-600 hover:from-burgundy-700 hover:to-purple-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Quiz
                      <Award className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Ask Coach */}
        {course.coach && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-blue-200">
                <AvatarImage src={course.coach.avatar} />
                <AvatarFallback className="bg-blue-600 text-white text-sm">
                  {coachInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">Stuck on a question?</p>
                <p className="text-xs text-blue-600">{course.coach.firstName} can help!</p>
              </div>
              <Link href={`/messages?to=${course.coach.id}`}>
                <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Ask Coach
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Results state
  if (state === "results" && results) {
    return (
      <div ref={quizRef} className="mt-10 scroll-mt-24">
        {/* Decorative divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-burgundy-300 to-transparent" />
          <div className="flex items-center gap-2 px-4 py-2 bg-burgundy-50 rounded-full border border-burgundy-200">
            <Award className="w-4 h-4 text-burgundy-600" />
            <span className="text-sm font-medium text-burgundy-700">Quiz Results</span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-burgundy-300 to-transparent" />
        </div>

        <div
          className={cn(
            "relative overflow-hidden rounded-3xl p-8 text-center shadow-xl border",
            results.passed
              ? "bg-burgundy-700 border-burgundy-600"
              : "bg-burgundy-800 border-burgundy-700"
          )}
        >
          {/* Brand Logo */}
          <div className="absolute top-4 right-4 opacity-20">
            <img src="/logo-white.png" alt="" className="h-8" />
          </div>

          <div className="relative z-10">
            {results.passed ? (
              <div className="w-24 h-24 bg-burgundy-600 border border-burgundy-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-gold-400" />
              </div>
            ) : (
              <div className="w-24 h-24 bg-burgundy-600 border border-burgundy-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <RotateCcw className="w-12 h-12 text-burgundy-300" />
              </div>
            )}

            <h3 className="text-3xl font-bold mb-2 text-white">
              {results.passed ? "Congratulations!" : "Almost There!"}
            </h3>

            <p className="text-white/80 text-lg mb-6">
              {results.passed
                ? "You've mastered this module!"
                : "Don't worry, you can try again!"}
            </p>

            {/* Score display */}
            <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur rounded-2xl px-8 py-4 mb-8">
              <div className="text-center">
                <p className="text-5xl font-bold text-white">{results.score}%</p>
                <p className="text-white/70 text-sm">Your Score</p>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{quiz.passingScore}%</p>
                <p className="text-white/70 text-sm">Needed</p>
              </div>
            </div>

            {/* Actions */}
            {results.passed ? (
              <div className="space-y-3">
                {nextModule ? (
                  <Link href={`/learning/${course.slug}/${nextModule.firstLessonId}`}>
                    <Button
                      size="lg"
                      className="w-full bg-gold-500 text-burgundy-900 hover:bg-gold-400 font-bold py-6 text-lg rounded-xl shadow-lg transition-all hover:scale-[1.02]"
                    >
                      Continue to {nextModule.title}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/courses/${course.slug}`}>
                    <Button
                      size="lg"
                      className="w-full bg-gold-500 text-burgundy-900 hover:bg-gold-400 font-bold py-6 text-lg rounded-xl shadow-lg transition-all hover:scale-[1.02]"
                    >
                      <Trophy className="w-5 h-5 mr-2" />
                      Course Complete! View Certificate
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <Button
                onClick={handleRetry}
                size="lg"
                className="w-full bg-gold-500 text-burgundy-900 hover:bg-gold-400 font-bold py-6 text-lg rounded-xl shadow-lg transition-all hover:scale-[1.02]"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
