"use client";

import { useState } from "react";
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
  Clock,
  Award,
  Trophy,
  AlertCircle,
  RotateCcw,
  ArrowRight,
  MessageCircle,
  Save,
  Download,
  Share2,
  Eye,
} from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import { MiniDiploma } from "@/components/certificates/mini-diploma";

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

interface QuizClientProps {
  quiz: Quiz;
  module: { id: string; title: string };
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
  studentName: string;
  allLessonsCompleted: boolean;
  canTakeQuiz: boolean;
  hasPassed: boolean;
  attemptsUsed: number;
  previousAttempts: {
    id: string;
    score: number;
    passed: boolean;
    completedAt: Date | null;
  }[];
  savedProgress?: {
    responses: Record<string, string[]>;
    currentQuestion: number;
  };
  isFinalExam?: boolean;
}

type QuizState = "intro" | "in_progress" | "submitted" | "results";

export function QuizClient({
  quiz,
  module,
  course,
  studentName,
  allLessonsCompleted,
  canTakeQuiz,
  hasPassed,
  attemptsUsed,
  previousAttempts,
  savedProgress,
  isFinalExam = false,
}: QuizClientProps) {
  const router = useRouter();
  const [state, setState] = useState<QuizState>(
    savedProgress ? "in_progress" : hasPassed ? "results" : "intro"
  );
  const [currentQuestion, setCurrentQuestion] = useState(
    savedProgress?.currentQuestion ?? 0
  );
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string[]>
  >(savedProgress?.responses ?? {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [results, setResults] = useState<{
    score: number;
    passed: boolean;
    correctAnswers: Record<string, string[]>;
    explanations: Record<string, string>;
  } | null>(null);

  const totalQuestions = quiz.questions.length;
  const answeredQuestions = Object.keys(selectedAnswers).length;
  const progressPercent = (answeredQuestions / totalQuestions) * 100;

  // Save progress to server
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
      // Toggle multi-select
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
      // Single select
      newAnswers = {
        ...selectedAnswers,
        [questionId]: [answerId],
      };
    }

    setSelectedAnswers(newAnswers);
    // Auto-save progress after each answer
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
        setState("results");

        if (data.passed) {
          // Trigger confetti
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      } else {
        // Handle error response
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
    setState("intro");
  };

  const coachInitials = course.coach
    ? `${course.coach.firstName?.[0] || ""}${course.coach.lastName?.[0] || ""}`
    : "C";

  // Intro screen
  if (state === "intro") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link href={`/courses/${course.slug}`} className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Course
        </Link>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 px-8 py-10 text-center">
            <Award className="w-16 h-16 text-white mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">{quiz.title}</h1>
            <p className="text-burgundy-200">Module {module.title}</p>
          </div>

          <div className="p-8">
            {/* Quiz Info */}
            {quiz.description && (
              <p className="text-gray-600 mb-6">{quiz.description}</p>
            )}

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {totalQuestions}
                </p>
                <p className="text-sm text-gray-500">Questions</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {quiz.passingScore}%
                </p>
                <p className="text-sm text-gray-500">To Pass</p>
              </div>
              {quiz.timeLimit && (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {quiz.timeLimit}
                  </p>
                  <p className="text-sm text-gray-500">Minutes</p>
                </div>
              )}
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-600">
                  Unlimited
                </p>
                <p className="text-sm text-gray-500">Retries</p>
              </div>
            </div>

            {/* Previous Attempts */}
            {previousAttempts.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Previous Attempts
                </h3>
                <div className="space-y-2">
                  {previousAttempts.slice(0, 3).map((attempt, i) => (
                    <div
                      key={attempt.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg",
                        attempt.passed ? "bg-green-50" : "bg-red-50"
                      )}
                    >
                      <span className="text-sm text-gray-600">
                        Attempt {previousAttempts.length - i}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "font-semibold",
                            attempt.passed ? "text-green-600" : "text-red-600"
                          )}
                        >
                          {attempt.score}%
                        </span>
                        {attempt.passed ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Locked State */}
            {!allLessonsCompleted && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800">
                      Complete all lessons first
                    </p>
                    <p className="text-sm text-amber-600">
                      You need to complete all lessons in this module before
                      taking the quiz.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CTA */}
            <Button
              onClick={() => setState("in_progress")}
              disabled={!canTakeQuiz}
              className="w-full bg-burgundy-600 hover:bg-burgundy-700 text-white py-6 text-lg"
            >
              {hasPassed ? "Retake Quiz" : "Start Quiz"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // In Progress screen
  if (state === "in_progress") {
    const question = quiz.questions[currentQuestion];
    const isAnswered = selectedAnswers[question.id]?.length > 0;
    const allAnswered = answeredQuestions === totalQuestions;

    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{quiz.title}</h1>
            <p className="text-sm text-gray-500">{module.title}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {answeredQuestions}/{totalQuestions} answered
            </span>
            {quiz.timeLimit && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{quiz.timeLimit}:00</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress */}
        <Progress value={progressPercent} className="h-2 mb-8" />

        {/* Question Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-burgundy-100 text-burgundy-700 text-sm font-medium px-3 py-1 rounded-full">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
            {question.questionType === "MULTI_SELECT" && (
              <span className="text-xs text-gray-500">
                (Select all that apply)
              </span>
            )}
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {question.question}
          </h2>

          {/* Answers */}
          <div className="space-y-3">
            {question.answers.map((answer) => {
              const isSelected = selectedAnswers[question.id]?.includes(
                answer.id
              );
              return (
                <button
                  key={answer.id}
                  onClick={() => handleSelectAnswer(question.id, answer.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border-2 transition-all",
                    isSelected
                      ? "border-burgundy-500 bg-burgundy-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                        isSelected
                          ? "border-burgundy-500 bg-burgundy-500"
                          : "border-gray-300"
                      )}
                    >
                      {isSelected && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-gray-700",
                        isSelected && "text-burgundy-700 font-medium"
                      )}
                    >
                      {answer.answer}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ask Coach CTA */}
        {course.coach && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={course.coach.avatar} />
                <AvatarFallback className="bg-blue-600 text-white text-sm">
                  {coachInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">
                  Any doubts? Ask your coach!
                </p>
                <p className="text-xs text-blue-600">
                  {course.coach.firstName} is here to help
                </p>
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

        {/* Save Status */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-4">
          {isSaving ? (
            <>
              <Save className="w-3 h-3 animate-pulse" />
              <span>Saving progress...</span>
            </>
          ) : lastSaved ? (
            <>
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>Progress saved - you can continue later</span>
            </>
          ) : null}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion((c) => c - 1)}
            disabled={currentQuestion === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {/* Question dots */}
            {quiz.questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(i)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all",
                  i === currentQuestion
                    ? "bg-burgundy-600 scale-125"
                    : selectedAnswers[q.id]?.length
                      ? "bg-burgundy-300"
                      : "bg-gray-300"
                )}
              />
            ))}
          </div>

          {currentQuestion < totalQuestions - 1 ? (
            <Button onClick={() => setCurrentQuestion((c) => c + 1)}>
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!allAnswered || isSubmitting}
              className="bg-burgundy-600 hover:bg-burgundy-700"
            >
              {isSubmitting ? "Submitting..." : "Submit Quiz"}
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Results screen
  if (state === "results" && results) {
    const passed = results.passed;
    const completionDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div
            className={cn(
              "px-8 py-10 text-center",
              passed
                ? "bg-gradient-to-r from-green-500 to-emerald-600"
                : "bg-gradient-to-r from-red-500 to-rose-600"
            )}
          >
            {passed ? (
              <Trophy className="w-20 h-20 text-white mx-auto mb-4" />
            ) : (
              <XCircle className="w-20 h-20 text-white mx-auto mb-4" />
            )}
            <h1 className="text-3xl font-bold text-white mb-2">
              {passed
                ? isFinalExam
                  ? "Course Completed!"
                  : "Module Complete!"
                : "Keep Trying!"}
            </h1>
            <p className="text-white/80">
              {passed
                ? isFinalExam
                  ? "You've earned your course certificate!"
                  : "You've earned a mini-diploma for this module!"
                : "You didn't pass this time, but you can try again."}
            </p>
          </div>

          <div className="p-8">
            {/* Score */}
            <div className="text-center mb-8">
              <p className="text-5xl font-bold text-gray-900 mb-2">
                {results.score}%
              </p>
              <p className="text-gray-500">
                Passing score: {quiz.passingScore}%
              </p>
            </div>

            {/* Mini-Diploma Preview - Show when passed */}
            {passed && (
              <div className="mb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-gold-500" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {isFinalExam ? "Your Course Certificate" : "Your Mini-Diploma"}
                  </h3>
                </div>
                <div className="flex justify-center">
                  <MiniDiploma
                    studentName={studentName}
                    moduleTitle={isFinalExam ? course.title : module.title}
                    courseName={course.title}
                    score={results.score}
                    completionDate={completionDate}
                    certificateNumber="PREVIEW"
                  />
                </div>
                <p className="text-center text-sm text-gray-500 mt-4">
                  Your certificate has been added to your credentials page
                </p>
              </div>
            )}

            {/* Coach Message */}
            {course.coach && passed && (
              <div className="bg-burgundy-50 rounded-xl p-5 mb-8">
                <div className="flex gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={course.coach.avatar} />
                    <AvatarFallback className="bg-burgundy-600 text-white">
                      {coachInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-burgundy-600 font-medium mb-1">
                      {course.coach.firstName} {course.coach.lastName}
                    </p>
                    <p className="text-gray-700 text-sm italic">
                      {isFinalExam
                        ? `"Incredible achievement! You've completed the entire course and earned your certification. I'm so proud of your dedication and hard work!"`
                        : `"Excellent work! You've demonstrated a solid understanding of this module. I'm proud of your progress!"`
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              {passed ? (
                <>
                  <Link href="/certificates">
                    <Button className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white py-6 text-lg font-semibold">
                      <Eye className="w-5 h-5 mr-2" />
                      View All My Certificates
                    </Button>
                  </Link>
                  <Link href={`/courses/${course.slug}`}>
                    <Button variant="outline" className="w-full py-5">
                      {isFinalExam ? "Back to Course" : "Continue to Next Module"}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleRetry}
                    className="w-full bg-burgundy-600 hover:bg-burgundy-700 py-6 text-lg"
                    disabled={!canTakeQuiz}
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Try Again
                  </Button>
                  <Link href={`/courses/${course.slug}`}>
                    <Button variant="outline" className="w-full">
                      Review Module Content
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
