"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  X,
  AlertTriangle,
  MessageSquare,
  Lightbulb,
  HelpCircle,
  Trophy,
  Rocket,
  GraduationCap,
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  Quote,
} from "lucide-react";

// Categories that users can post to
const POST_CATEGORIES = [
  { id: "tips", label: "Daily Coach Tips", icon: Lightbulb, color: "bg-green-100 text-green-700" },
  { id: "questions", label: "Questions & Help", icon: HelpCircle, color: "bg-blue-100 text-blue-700" },
  { id: "wins", label: "Share Your Wins", icon: Trophy, color: "bg-amber-100 text-amber-700" },
  { id: "momentum", label: "Practice Momentum", icon: Rocket, color: "bg-purple-100 text-purple-700", isNew: true },
  { id: "graduates", label: "Graduates", icon: GraduationCap, color: "bg-emerald-100 text-emerald-700" },
];

// Banned keywords for auto-moderation
const BANNED_KEYWORDS = [
  "refund",
  "scam",
  "fraud",
  "lawsuit",
  "sue",
  "money back",
  "rip off",
  "ripoff",
  "waste of money",
  "pyramid scheme",
  "mlm",
];

interface CreatePostDialogProps {
  communityId?: string;
  communityName?: string;
  defaultCategory?: string;
}

export function CreatePostDialog({ communityId, communityName, defaultCategory }: CreatePostDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(defaultCategory || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [moderationWarning, setModerationWarning] = useState("");

  // Check for banned keywords
  const checkModeration = (text: string): string | null => {
    const lowerText = text.toLowerCase();
    for (const keyword of BANNED_KEYWORDS) {
      if (lowerText.includes(keyword)) {
        return keyword;
      }
    }
    return null;
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    const bannedWord = checkModeration(newContent);
    if (bannedWord) {
      setModerationWarning(`Your post contains restricted content. Please review community guidelines.`);
    } else {
      setModerationWarning("");
    }
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    const bannedWord = checkModeration(newTitle);
    if (bannedWord) {
      setModerationWarning(`Your post contains restricted content. Please review community guidelines.`);
    } else if (!checkModeration(content)) {
      setModerationWarning("");
    }
  };

  const insertFormatting = (format: string) => {
    const textarea = document.getElementById("post-content") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    let newText = "";
    let cursorOffset = 0;

    switch (format) {
      case "bold":
        newText = `**${selectedText || "bold text"}**`;
        cursorOffset = selectedText ? 0 : -2;
        break;
      case "italic":
        newText = `*${selectedText || "italic text"}*`;
        cursorOffset = selectedText ? 0 : -1;
        break;
      case "list":
        newText = `\n- ${selectedText || "List item"}`;
        cursorOffset = 0;
        break;
      case "link":
        newText = `[${selectedText || "link text"}](url)`;
        cursorOffset = selectedText ? -1 : -5;
        break;
      case "quote":
        newText = `\n> ${selectedText || "Quote"}`;
        cursorOffset = 0;
        break;
    }

    const newContent = content.substring(0, start) + newText + content.substring(end);
    setContent(newContent);

    // Focus and set cursor position
    setTimeout(() => {
      textarea.focus();
      const newPos = start + newText.length + cursorOffset;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Final moderation check
    const titleBanned = checkModeration(title);
    const contentBanned = checkModeration(content);
    if (titleBanned || contentBanned) {
      setError("Your post was not submitted due to community guidelines violation. Please remove any inappropriate content and try again.");
      return;
    }

    if (!category) {
      setError("Please select a category for your post");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          communityId,
          category,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create post");
        return;
      }

      setTitle("");
      setContent("");
      setCategory("");
      setIsOpen(false);
      router.refresh();
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="bg-burgundy-600 hover:bg-burgundy-700">
        <Plus className="w-4 h-4 mr-2" />
        New Discussion
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-white p-6 rounded-t-2xl">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Start a Discussion</h2>
              {communityName && (
                <p className="text-sm text-burgundy-200">Posting to {communityName}</p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Moderation Warning */}
          {moderationWarning && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">Content Warning</p>
                <p className="text-sm text-amber-700">{moderationWarning}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Topic *
              </label>
              <div className="flex flex-wrap gap-2">
                {POST_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      category === cat.id
                        ? "bg-burgundy-600 text-white ring-2 ring-burgundy-300"
                        : `${cat.color} hover:ring-2 hover:ring-gray-200`
                    }`}
                  >
                    <cat.icon className="w-4 h-4" />
                    {cat.label}
                    {"isNew" in cat && cat.isNew && (
                      <Badge className="bg-purple-500 text-white border-0 text-[10px] ml-1">NEW</Badge>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <Input
                placeholder="What would you like to discuss?"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="text-lg py-3 rounded-xl border-2 border-gray-200 focus:border-burgundy-500"
                required
              />
            </div>

            {/* Content with formatting toolbar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>

              {/* Formatting Toolbar */}
              <div className="flex items-center gap-1 mb-2 p-2 bg-gray-50 rounded-t-xl border-2 border-b-0 border-gray-200">
                <button
                  type="button"
                  onClick={() => insertFormatting("bold")}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Bold"
                >
                  <Bold className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("italic")}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Italic"
                >
                  <Italic className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("list")}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="List"
                >
                  <List className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("quote")}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Quote"
                >
                  <Quote className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("link")}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Link"
                >
                  <LinkIcon className="w-4 h-4 text-gray-600" />
                </button>
                <span className="ml-auto text-xs text-gray-400">Markdown supported</span>
              </div>

              <textarea
                id="post-content"
                className="w-full min-h-[200px] rounded-b-xl border-2 border-gray-200 px-4 py-3 text-base placeholder:text-gray-400 focus:border-burgundy-500 focus:outline-none focus:ring-4 focus:ring-burgundy-500/10 resize-none"
                placeholder="Share your thoughts, questions, or insights..."
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                required
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !category || !!moderationWarning}
                className="bg-burgundy-600 hover:bg-burgundy-700 rounded-xl px-6"
              >
                {loading ? "Posting..." : "Post Discussion"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
