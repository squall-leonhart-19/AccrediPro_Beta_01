"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Send, HelpCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface AskCoachButtonProps {
  coachId: string;
  coachName: string;
  coachAvatar?: string;
  lessonTitle: string;
  moduleName: string;
  courseName: string;
  variant?: "button" | "floating" | "inline";
}

const quickQuestions = [
  "I need clarification on this topic",
  "Can you provide more examples?",
  "How does this apply in practice?",
  "I'm stuck and need help",
];

export function AskCoachButton({
  coachId,
  coachName,
  coachAvatar,
  lessonTitle,
  moduleName,
  courseName,
  variant = "button",
}: AskCoachButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const coachInitials = coachName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleQuickQuestion = (question: string) => {
    setMessage(
      `Hi ${coachName.split(" ")[0]}, I have a question about "${lessonTitle}" in ${moduleName}:\n\n${question}`
    );
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    setIsSending(true);
    try {
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: coachId,
          content: message,
          metadata: {
            lessonTitle,
            moduleName,
            courseName,
          },
        }),
      });

      if (response.ok) {
        setIsOpen(false);
        setMessage("");
        // Navigate to messages
        router.push(`/messages?to=${coachId}`);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  if (variant === "floating") {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button className="fixed bottom-24 right-6 z-40 bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105">
            <HelpCircle className="w-6 h-6" />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={coachAvatar} />
                <AvatarFallback className="bg-burgundy-600 text-white">
                  {coachInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg">Ask {coachName}</p>
                <p className="text-sm text-gray-500 font-normal">
                  Your course coach
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Context */}
            <div className="bg-gray-50 rounded-lg p-3 text-sm">
              <p className="text-gray-500">Question about:</p>
              <p className="font-medium text-gray-900">{lessonTitle}</p>
              <p className="text-xs text-gray-400">{moduleName}</p>
            </div>

            {/* Quick Questions */}
            <div>
              <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickQuestion(q)}
                    className="text-xs px-3 py-1.5 rounded-full bg-burgundy-50 text-burgundy-700 hover:bg-burgundy-100 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <Textarea
              placeholder={`Write your question to ${coachName.split(" ")[0]}...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="resize-none"
            />

            {/* Send Button */}
            <Button
              onClick={handleSend}
              disabled={!message.trim() || isSending}
              className="w-full bg-burgundy-600 hover:bg-burgundy-700"
            >
              {isSending ? (
                "Sending..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>

            {/* Alternative */}
            <p className="text-xs text-center text-gray-400">
              or{" "}
              <Link
                href={`/messages?to=${coachId}`}
                className="text-burgundy-600 hover:underline"
              >
                go to full messages
              </Link>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (variant === "inline") {
    return (
      <Link
        href={`/messages?to=${coachId}`}
        className="flex items-center gap-2 text-sm text-burgundy-600 hover:text-burgundy-700"
      >
        <HelpCircle className="w-4 h-4" />
        <span>Ask {coachName.split(" ")[0]}</span>
      </Link>
    );
  }

  // Default button variant
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50"
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          Ask Your Coach
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={coachAvatar} />
              <AvatarFallback className="bg-burgundy-600 text-white">
                {coachInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg">Ask {coachName}</p>
              <p className="text-sm text-gray-500 font-normal">
                Your course coach
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Context */}
          <div className="bg-gray-50 rounded-lg p-3 text-sm">
            <p className="text-gray-500">Question about:</p>
            <p className="font-medium text-gray-900">{lessonTitle}</p>
            <p className="text-xs text-gray-400">{moduleName}</p>
          </div>

          {/* Quick Questions */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickQuestion(q)}
                  className="text-xs px-3 py-1.5 rounded-full bg-burgundy-50 text-burgundy-700 hover:bg-burgundy-100 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <Textarea
            placeholder={`Write your question to ${coachName.split(" ")[0]}...`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="resize-none"
          />

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={!message.trim() || isSending}
            className="w-full bg-burgundy-600 hover:bg-burgundy-700"
          >
            {isSending ? (
              "Sending..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
