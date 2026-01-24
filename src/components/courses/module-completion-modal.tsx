"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Award,
  Trophy,
  Star,
  Sparkles,
  ArrowRight,
  MessageCircle,
  CheckCircle,
  PartyPopper,
  Users,
  Heart,
} from "lucide-react";
import confetti from "canvas-confetti";
import Link from "next/link";

interface ModuleCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleName: string;
  moduleNumber: number;
  totalModules: number;
  coachName: string;
  coachAvatar?: string;
  coachId: string;
  courseSlug: string;
  nextModuleLesson?: { id: string; title: string } | null;
  hasQuiz?: boolean;
  quizUrl?: string;
  userFirstName?: string;
  onShareToCommunnity?: (moduleName: string) => Promise<void>;
}

const coachMessages = [
  "I'm so proud of you! You've shown incredible dedication completing this module. Take a moment to celebrate this achievement - you've earned it!",
  "What an amazing milestone! Your commitment to learning is truly inspiring. I can't wait to see you continue this journey in the next module!",
  "Congratulations! You're making wonderful progress. Remember, every step forward is a victory. Keep up this fantastic momentum!",
  "You did it! This is exactly the kind of progress that transforms lives. I'm honored to be part of your learning journey!",
];

export function ModuleCompletionModal({
  isOpen,
  onClose,
  moduleName,
  moduleNumber,
  totalModules,
  coachName,
  coachAvatar,
  coachId,
  courseSlug,
  nextModuleLesson,
  hasQuiz,
  quizUrl,
}: ModuleCompletionModalProps) {
  const [showContent, setShowContent] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [hasShared, setHasShared] = useState(false);
  const coachInitials = coachName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  // Get a consistent message based on module number
  const coachMessage = coachMessages[moduleNumber % coachMessages.length];

  useEffect(() => {
    if (isOpen) {
      // Trigger confetti
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = ["#722F37", "#C9A14E", "#FFD700", "#FF6B6B", "#4ECDC4"];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();

      // Show content with delay for animation
      setTimeout(() => setShowContent(true), 300);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-gradient-to-b from-white to-burgundy-50 border-burgundy-200">
        {/* Celebration Header */}
        <div className="relative bg-gradient-to-r from-burgundy-600 to-burgundy-700 px-6 py-8 text-center overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-2 left-4 text-burgundy-400 opacity-50">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="absolute top-4 right-6 text-gold-400 opacity-50">
            <Star className="w-8 h-8 fill-current" />
          </div>
          <div className="absolute bottom-2 left-1/4 text-burgundy-400 opacity-40">
            <PartyPopper className="w-5 h-5" />
          </div>

          <div
            className={`transition-all duration-500 ${showContent ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-gold-400 to-gold-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-gold-400/30">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Module Complete!
            </h2>
            <p className="text-burgundy-200 text-sm">
              {moduleName}
            </p>
          </div>
        </div>

        {/* Progress Badge */}
        <div className="flex justify-center -mt-5">
          <div
            className={`bg-white rounded-full px-6 py-2 shadow-lg border border-burgundy-100 transition-all duration-500 delay-200 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-semibold text-gray-700">
                Module {moduleNumber} of {totalModules}
              </span>
            </div>
          </div>
        </div>

        {/* Coach Message */}
        <div
          className={`px-6 py-4 transition-all duration-500 delay-300 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex gap-4">
              <Avatar className="h-14 w-14 ring-4 ring-burgundy-100 flex-shrink-0">
                <AvatarImage src={coachAvatar} />
                <AvatarFallback className="bg-gradient-to-br from-burgundy-500 to-burgundy-600 text-white font-semibold">
                  {coachInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-burgundy-600 font-medium mb-1">
                  Message from {coachName}
                </p>
                <p className="text-gray-700 text-sm leading-relaxed italic">
                  &ldquo;{coachMessage}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Community Win Sharing - Sarah's Offer */}
        {!hasShared && (
          <div
            className={`px-6 py-3 transition-all duration-500 delay-350 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <div className="bg-gradient-to-r from-gold-50 to-burgundy-50 rounded-xl p-4 border border-gold-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-burgundy-500 to-burgundy-600 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 mb-3">
                    <span className="font-semibold text-burgundy-700">Sarah says:</span> "Want me to share this win with the community? Your classmates love celebrating each other!"
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      disabled={isSharing}
                      onClick={async () => {
                        setIsSharing(true);
                        try {
                          // Post to community
                          await fetch('/api/community/share-win', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ moduleName }),
                          });
                          setHasShared(true);
                        } catch (err) {
                          console.error('Failed to share:', err);
                        } finally {
                          setIsSharing(false);
                        }
                      }}
                      className="bg-gradient-to-r from-burgundy-500 to-burgundy-600 hover:from-burgundy-600 hover:to-burgundy-700 text-white"
                    >
                      <Users className="w-4 h-4 mr-1" />
                      {isSharing ? 'Sharing...' : 'Yes, celebrate me!'}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setHasShared(true)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Maybe later
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {hasShared && (
          <div className="px-6 py-2">
            <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-500 inline mr-2" />
              <span className="text-sm text-green-700 font-medium">Shared with the community!</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div
          className={`px-6 pb-6 space-y-3 transition-all duration-500 delay-400 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          {hasQuiz && quizUrl ? (
            <Link href={quizUrl} className="block">
              <Button className="w-full bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white py-6 text-lg font-semibold shadow-lg">
                <Award className="w-5 h-5 mr-2" />
                Take Module Quiz
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          ) : nextModuleLesson ? (
            <Link
              href={`/learning/${courseSlug}/${nextModuleLesson.id}`}
              className="block"
            >
              <Button className="w-full bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white py-6 text-lg font-semibold shadow-lg">
                Start Next Module
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          ) : (
            <Link href={`/courses/${courseSlug}`} className="block">
              <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-6 text-lg font-semibold shadow-lg">
                <Trophy className="w-5 h-5 mr-2" />
                View Certificate
              </Button>
            </Link>
          )}

          <div className="flex gap-3">
            <Link href={`/messages?to=${coachId}`} className="flex-1">
              <Button
                variant="outline"
                className="w-full border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Message Coach
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-200"
            >
              Continue Learning
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
