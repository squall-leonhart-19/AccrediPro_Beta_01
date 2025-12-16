"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronRight,
  CheckCircle,
  XCircle,
  Award,
  Trophy,
  RotateCcw,
  ArrowRight,
  MessageCircle,
  Sparkles,
  BookOpen,
  Lightbulb,
  Loader2,
  Volume2,
  GraduationCap,
} from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

interface QuizAnswer {
  id: string;
  answer: string;
  order: number;
  isCorrect?: boolean;
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
    certificateType?: string; // "MINI_DIPLOMA" | "CERTIFICATION" etc
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
  isFinalExam?: boolean; // True if this is the final exam module
}

export function InlineQuiz({
  quiz,
  module,
  course,
  nextModule,
  hasPassed: initialHasPassed,
  previousAttempts,
  isFinalExam = false,
}: InlineQuizProps) {
  const router = useRouter();
  const quizRef = useRef<HTMLDivElement>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const totalQuestions = quiz.questions.length;
  const [hasPassed, setHasPassed] = useState(initialHasPassed);
  // Don't set results on initial load - let the "already passed" UI handle it
  // results should only be set after a fresh submission
  const [results, setResults] = useState<{
    score: number;
    passed: boolean;
    correctAnswers: Record<string, string[]>;
    explanations: Record<string, string>;
  } | null>(null);
  const answeredQuestions = Object.keys(selectedAnswers).filter(k => selectedAnswers[k]?.length > 0).length;
  const allAnswered = answeredQuestions === totalQuestions;

  const coachInitials = course.coach
    ? `${course.coach.firstName?.[0] || ""}${course.coach.lastName?.[0] || ""}`
    : "C";

  // Play Sarah's final exam encouragement audio
  const playFinalExamAudio = () => {
    if (audioRef.current) {
      if (isPlayingAudio) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlayingAudio(false);
      } else {
        setIsPlayingAudio(true);
        audioRef.current.play().catch(() => {
          // Audio file not found or other error - reset state
          console.log("Audio file not available");
          setIsPlayingAudio(false);
        });
      }
    }
  };

  const handleSelectAnswer = (questionId: string, answerId: string) => {
    if (results) return; // Don't allow changes after submission

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
        // For Mini Diploma Final Exam: redirect immediately to complete page
        const isMiniDiplomaFinalExam = isFinalExam && course.certificateType === "MINI_DIPLOMA";

        if (isMiniDiplomaFinalExam) {
          // Quick celebration before redirect
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            zIndex: 9999,
          });

          // Short delay then redirect to completion page
          setTimeout(() => {
            router.push("/my-mini-diploma/complete");
          }, 500);
          return; // Don't show results page
        }

        setResults({
          score: data.score,
          passed: data.passed,
          correctAnswers: data.correctAnswers || {},
          explanations: data.explanations || {},
        });
        setHasPassed(data.passed);

        // Only celebrate if PASSED!
        if (data.passed) {
          const duration = 2 * 1000;
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
        }
      } else {
        console.error("Quiz submit error:", data.error);
      }
    } catch (error) {
      console.error("Failed to submit quiz:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setResults(null);
    setHasPassed(false);
  };

  const handleContinue = (href: string) => {
    setIsNavigating(true);
    router.push(href);
  };

  // Allow retake even if already passed
  const handleRetakeFromPassed = () => {
    setHasPassed(false);
    setSelectedAnswers({});
    setResults(null);
  };

  // If already passed, show success state with option to retake
  if (hasPassed && !results) {
    return (
      <div ref={quizRef} className="mt-8 scroll-mt-24">
        <div className="flex items-center gap-4 mb-6">
          <div className={cn(
            "flex-1 h-px bg-gradient-to-r from-transparent to-transparent",
            isFinalExam ? "via-gold-400" : "via-green-300"
          )} />
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full border",
            isFinalExam
              ? "bg-gold-50 border-gold-300"
              : "bg-green-50 border-green-200"
          )}>
            <CheckCircle className={cn(
              "w-4 h-4",
              isFinalExam ? "text-gold-600" : "text-green-600"
            )} />
            <span className={cn(
              "text-sm font-medium",
              isFinalExam ? "text-gold-700" : "text-green-700"
            )}>
              {isFinalExam ? "Final Exam Complete" : "Quiz Complete"}
            </span>
          </div>
          <div className={cn(
            "flex-1 h-px bg-gradient-to-r from-transparent to-transparent",
            isFinalExam ? "via-gold-400" : "via-green-300"
          )} />
        </div>

        <div className={cn(
          "rounded-2xl p-6 border",
          isFinalExam
            ? "bg-gradient-to-br from-gold-50 to-amber-50 border-gold-200"
            : "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
        )}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center",
                isFinalExam ? "bg-gold-100" : "bg-green-100"
              )}>
                <Trophy className={cn(
                  "w-7 h-7",
                  isFinalExam ? "text-gold-600" : "text-green-600"
                )} />
              </div>
              <div className="flex-1">
                <h3 className={cn(
                  "text-lg font-bold",
                  isFinalExam ? "text-gold-800" : "text-green-800"
                )}>
                  {isFinalExam ? "Congratulations!" : "Great job!"}
                </h3>
                <p className={cn(
                  "text-sm",
                  isFinalExam ? "text-gold-600" : "text-green-600"
                )}>
                  {isFinalExam
                    ? "You've passed the Final Exam!"
                    : "You've completed this module's quiz."
                  }
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={handleRetakeFromPassed}
                variant="outline"
                disabled={isNavigating}
                className={cn(
                  "disabled:opacity-50",
                  isFinalExam
                    ? "border-gold-300 text-gold-700 hover:bg-gold-100"
                    : "border-green-300 text-green-700 hover:bg-green-100"
                )}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {isFinalExam ? "Retake Exam" : "Retake Quiz"}
              </Button>
              {isFinalExam ? (
                <Button
                  onClick={() => handleContinue("/my-mini-diploma")}
                  disabled={isNavigating}
                  className="flex-1 bg-gold-600 hover:bg-gold-700 text-white disabled:opacity-70"
                >
                  {isNavigating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4 mr-2" />
                      View Your Certificate
                    </>
                  )}
                </Button>
              ) : nextModule ? (
                <Button
                  onClick={() => handleContinue(`/learning/${course.slug}/${nextModule.firstLessonId}`)}
                  disabled={isNavigating}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:opacity-70"
                >
                  {isNavigating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Continue to {nextModule.title} <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show results after submission
  if (results) {
    const correctCount = Object.keys(results.correctAnswers).length > 0
      ? quiz.questions.filter(q => {
        const userAnswers = selectedAnswers[q.id] || [];
        const correctAnswers = results.correctAnswers[q.id] || [];
        return userAnswers.length === correctAnswers.length &&
          userAnswers.every(a => correctAnswers.includes(a));
      }).length
      : Math.round((results.score / 100) * totalQuestions);

    return (
      <div ref={quizRef} className="mt-8 scroll-mt-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-burgundy-300 to-transparent" />
          <div className="flex items-center gap-2 px-4 py-2 bg-burgundy-50 rounded-full border border-burgundy-200">
            <BookOpen className="w-4 h-4 text-burgundy-600" />
            <span className="text-sm font-medium text-burgundy-700">Quiz Results</span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-burgundy-300 to-transparent" />
        </div>

        {/* Answer Review - Show First */}
        <div className="space-y-4 mb-8">
          {quiz.questions.map((question, qIndex) => {
            const userAnswers = selectedAnswers[question.id] || [];
            const correctAnswers = results.correctAnswers[question.id] || [];
            const isCorrect = correctAnswers.length > 0 &&
              userAnswers.length === correctAnswers.length &&
              userAnswers.every(a => correctAnswers.includes(a));

            return (
              <div
                key={question.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                {/* Question Header */}
                <div className={cn(
                  "px-5 py-4 border-b",
                  isCorrect ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"
                )}>
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0",
                      isCorrect ? "bg-green-500" : "bg-amber-500"
                    )}>
                      {isCorrect ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <XCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm leading-relaxed">
                        {qIndex + 1}. {question.question}
                      </p>
                    </div>
                    <span className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full",
                      isCorrect ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    )}>
                      {isCorrect ? "Correct" : "Review"}
                    </span>
                  </div>
                </div>

                {/* Answers */}
                <div className="p-4 space-y-2">
                  {question.answers.map((answer, aIndex) => {
                    const isUserAnswer = userAnswers.includes(answer.id);
                    const isCorrectAnswer = correctAnswers.includes(answer.id);
                    const letter = String.fromCharCode(65 + aIndex);

                    return (
                      <div
                        key={answer.id}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg text-sm",
                          isCorrectAnswer && "bg-green-50 border border-green-200",
                          isUserAnswer && !isCorrectAnswer && "bg-red-50 border border-red-200",
                          !isCorrectAnswer && !isUserAnswer && "bg-gray-50 border border-transparent"
                        )}
                      >
                        <div className={cn(
                          "w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold",
                          isCorrectAnswer && "bg-green-500 text-white",
                          isUserAnswer && !isCorrectAnswer && "bg-red-400 text-white",
                          !isCorrectAnswer && !isUserAnswer && "bg-gray-200 text-gray-500"
                        )}>
                          {letter}
                        </div>
                        <span className={cn(
                          "flex-1",
                          isCorrectAnswer && "text-green-800 font-medium",
                          isUserAnswer && !isCorrectAnswer && "text-red-700 line-through",
                          !isCorrectAnswer && !isUserAnswer && "text-gray-500"
                        )}>
                          {answer.answer}
                        </span>
                        {isCorrectAnswer && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        {isUserAnswer && !isCorrectAnswer && (
                          <span className="text-xs text-red-500">Your answer</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {results.explanations[question.id] && (
                  <div className="px-4 pb-4">
                    <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-blue-800">
                        {results.explanations[question.id]}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Score Summary Card - Different styling for pass/fail */}
        <div className={cn(
          "rounded-2xl p-6 text-white mb-6",
          results.passed ? "bg-burgundy-600" : "bg-red-600"
        )}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                {results.passed ? (
                  <Trophy className="w-6 h-6 text-gold-300" />
                ) : (
                  <XCircle className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold">
                  {results.passed ? "Quiz Passed!" : "Quiz Not Passed"}
                </h3>
                <p className={cn(
                  "text-sm",
                  results.passed ? "text-burgundy-200" : "text-red-200"
                )}>
                  {results.passed ? "Great effort on this module" : "You need to pass to continue"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{correctCount}/{totalQuestions}</div>
              <p className={cn(
                "text-xs",
                results.passed ? "text-burgundy-200" : "text-red-200"
              )}>Questions correct</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-4">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                results.passed ? "bg-gold-400" : "bg-red-300"
              )}
              style={{ width: `${(correctCount / totalQuestions) * 100}%` }}
            />
          </div>

          <p className={cn(
            "text-sm text-center",
            results.passed ? "text-burgundy-100" : "text-red-100"
          )}>
            {results.passed
              ? correctCount === totalQuestions
                ? "Perfect score! You really understand this material."
                : "Good work! You passed the quiz."
              : `You need at least ${quiz.passingScore}% to pass. Please review and try again.`}
          </p>
        </div>

        {/* Action Buttons - Only show Continue if PASSED */}
        <div className="space-y-3">
          <Button
            onClick={handleRetry}
            variant="outline"
            disabled={isNavigating}
            className={cn(
              "w-full h-12 border-2 font-medium disabled:opacity-50",
              results.passed
                ? "border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50"
                : "border-red-300 text-red-700 hover:bg-red-50"
            )}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {results.passed ? "Retake Quiz" : "Try Again"}
          </Button>

          {/* Only show Continue button if PASSED */}
          {results.passed && nextModule ? (
            <Button
              size="lg"
              onClick={() => handleContinue(`/learning/${course.slug}/${nextModule.firstLessonId}`)}
              disabled={isNavigating}
              className="w-full h-14 bg-burgundy-600 hover:bg-burgundy-700 text-white font-semibold text-base shadow-lg disabled:opacity-70"
            >
              {isNavigating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Continue to {nextModule.title}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          ) : results.passed && !nextModule ? (
            <Button
              size="lg"
              onClick={() => handleContinue(`/my-mini-diploma`)}
              disabled={isNavigating}
              className="w-full h-14 bg-burgundy-600 hover:bg-burgundy-700 text-white font-semibold text-base shadow-lg disabled:opacity-70"
            >
              {isNavigating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Award className="w-5 h-5 mr-2" />
                  View Your Progress
                </>
              )}
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  // Show quiz questions inline
  return (
    <div ref={quizRef} className="mt-8 scroll-mt-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className={cn(
          "flex-1 h-px bg-gradient-to-r from-transparent to-transparent",
          isFinalExam ? "via-gold-400" : "via-burgundy-300"
        )} />
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full border",
          isFinalExam
            ? "bg-gold-50 border-gold-300"
            : "bg-burgundy-50 border-burgundy-200"
        )}>
          <Award className={cn(
            "w-4 h-4",
            isFinalExam ? "text-gold-600" : "text-burgundy-600"
          )} />
          <span className={cn(
            "text-sm font-medium",
            isFinalExam ? "text-gold-700" : "text-burgundy-700"
          )}>
            {isFinalExam ? "Final Exam" : "Knowledge Check"}
          </span>
        </div>
        <div className={cn(
          "flex-1 h-px bg-gradient-to-r from-transparent to-transparent",
          isFinalExam ? "via-gold-400" : "via-burgundy-300"
        )} />
      </div>

      {/* Quiz intro - Enhanced for Final Exam */}
      {isFinalExam ? (
        <div className="mb-8 space-y-4">
          {/* Hidden audio element */}
          <audio
            ref={audioRef}
            src="/audio/sarah-final-exam-test.mp3"
            onEnded={() => setIsPlayingAudio(false)}
          />

          {/* Main Final Exam Card */}
          <div className="bg-gradient-to-br from-gold-50 via-amber-50 to-gold-100 rounded-2xl p-6 border-2 border-gold-300 shadow-lg">
            <div className="flex items-start gap-4">
              {/* Sarah's Avatar */}
              <Avatar className="w-14 h-14 ring-4 ring-gold-300 flex-shrink-0">
                <AvatarImage src={course.coach?.avatar || "/coaches/sarah-coach.webp"} />
                <AvatarFallback className="bg-gold-600 text-white font-bold">
                  {coachInitials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-5 h-5 text-gold-600" />
                  <h3 className="text-lg font-bold text-gold-800">Ready for Your Final Exam?</h3>
                </div>

                <p className="text-gold-700 text-sm leading-relaxed mb-3">
                  You&apos;ve made it through all the modules - I&apos;m SO proud of you! This is your moment to show what you&apos;ve learned. Don&apos;t worry, you&apos;ve got this!
                </p>

                <div className="flex items-center gap-3 flex-wrap">
                  {/* Audio button */}
                  <button
                    onClick={playFinalExamAudio}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                      isPlayingAudio
                        ? "bg-gold-600 text-white shadow-md"
                        : "bg-white text-gold-700 border border-gold-300 hover:bg-gold-50"
                    )}
                  >
                    <Volume2 className={cn("w-4 h-4", isPlayingAudio && "animate-pulse")} />
                    {isPlayingAudio ? "Playing..." : "Hear from Sarah"}
                  </button>

                  {/* Question count badge */}
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-xs font-medium text-gold-700 border border-gold-200">
                    <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                    {totalQuestions} Questions
                  </span>
                </div>
              </div>
            </div>

            {/* Certificate Preview */}
            <div className="mt-4 pt-4 border-t border-gold-200">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gold-600">
                  Pass this exam to earn your <span className="font-semibold">Mini Diploma Certificate</span>
                </p>
                <Award className="w-5 h-5 text-gold-500" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl p-4 mb-6 border bg-burgundy-50 border-burgundy-100">
          <p className="text-sm text-burgundy-700">
            <Sparkles className="w-4 h-4 inline mr-1.5 text-burgundy-500" />
            {totalQuestions} quick questions to reinforce what you&apos;ve learned. No pressure - take your time!
          </p>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-4">
        {quiz.questions.map((question, qIndex) => {
          const isAnswered = selectedAnswers[question.id]?.length > 0;

          return (
            <div
              key={question.id}
              className={cn(
                "bg-white rounded-xl border-2 overflow-hidden transition-all",
                isAnswered ? "border-burgundy-300 shadow-md" : "border-gray-200 hover:border-gray-300"
              )}
            >
              {/* Question Header */}
              <div className={cn(
                "px-5 py-4 border-b transition-colors",
                isAnswered ? "bg-burgundy-50 border-burgundy-200" : "bg-gray-50 border-gray-100"
              )}>
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors",
                    isAnswered ? "bg-burgundy-600 text-white" : "bg-gray-200 text-gray-500"
                  )}>
                    {qIndex + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 leading-relaxed">{question.question}</p>
                    {question.questionType === "MULTI_SELECT" && (
                      <span className="text-xs text-purple-600 mt-1 inline-block">Select all that apply</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Answers */}
              <div className="p-4 space-y-2">
                {question.answers.map((answer, aIndex) => {
                  const isSelected = selectedAnswers[question.id]?.includes(answer.id);
                  const letter = String.fromCharCode(65 + aIndex);

                  return (
                    <button
                      key={answer.id}
                      onClick={() => handleSelectAnswer(question.id, answer.id)}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-lg border-2 transition-all flex items-center gap-3 group",
                        isSelected
                          ? "border-burgundy-400 bg-burgundy-50"
                          : "border-gray-200 hover:border-burgundy-200 hover:bg-gray-50"
                      )}
                    >
                      <div className={cn(
                        "w-7 h-7 rounded-md flex items-center justify-center font-semibold text-xs transition-all",
                        isSelected
                          ? "bg-burgundy-600 text-white"
                          : "bg-gray-100 text-gray-500 group-hover:bg-burgundy-100 group-hover:text-burgundy-600"
                      )}>
                        {letter}
                      </div>
                      <span className={cn(
                        "flex-1 text-sm",
                        isSelected ? "text-burgundy-800 font-medium" : "text-gray-700"
                      )}>
                        {answer.answer}
                      </span>
                      {isSelected && (
                        <CheckCircle className="w-5 h-5 text-burgundy-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress & Submit */}
      <div className="mt-8 space-y-4">
        {/* Progress indicator */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-burgundy-600 rounded-full transition-all duration-300"
              style={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
            {answeredQuestions}/{totalQuestions}
          </span>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!allAnswered || isSubmitting}
          size="lg"
          className={cn(
            "w-full h-14 text-base font-semibold rounded-xl transition-all",
            allAnswered
              ? "bg-burgundy-600 hover:bg-burgundy-700 shadow-lg"
              : "bg-gray-300 cursor-not-allowed"
          )}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Checking answers...
            </>
          ) : allAnswered ? (
            <>
              Submit Answers <ChevronRight className="w-5 h-5 ml-2" />
            </>
          ) : (
            <>Answer all questions to continue</>
          )}
        </Button>
      </div>

      {/* Coach Help - Hidden for Final Exam */}
      {course.coach && !isFinalExam && (
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
              <p className="text-xs text-blue-600">{course.coach.firstName} can help explain!</p>
            </div>
            <Link href={`/messages?to=${course.coach.id}`}>
              <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                <MessageCircle className="w-4 h-4 mr-1" />
                Ask
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
