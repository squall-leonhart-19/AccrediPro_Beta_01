"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  StickyNote,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Highlighter,
  Clock,
  Loader2,
  Sparkles,
  BookOpen,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface Note {
  id: string;
  type: "NOTE" | "HIGHLIGHT";
  content: string;
  noteText?: string;
  color?: string;
  position?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface LessonNotesProps {
  lessonId: string;
  lessonTitle: string;
}

export function LessonNotes({ lessonId, lessonTitle }: LessonNotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [notesCount, setNotesCount] = useState(0);

  // Fetch notes count on mount (for badge)
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch(`/api/notes?lessonId=${lessonId}`);
        if (response.ok) {
          const data = await response.json();
          setNotesCount(data.notes?.length || 0);
        }
      } catch (error) {
        console.error("Failed to fetch notes count:", error);
      }
    };
    fetchCount();
  }, [lessonId]);

  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/notes?lessonId=${lessonId}`);
      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes || []);
        setNotesCount(data.notes?.length || 0);
      } else {
        setErrorMessage("Failed to load notes");
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error);
      setErrorMessage("Failed to load notes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [lessonId]);

  // Fetch notes when sheet opens
  useEffect(() => {
    if (isOpen) {
      fetchNotes();
    }
  }, [isOpen, fetchNotes]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    setIsSaving(true);
    setSaveStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          type: "NOTE",
          content: newNote.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setNotes([data.note, ...notes]);
        setNotesCount(notes.length + 1);
        setNewNote("");
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 2500);
      } else {
        setSaveStatus("error");
        setErrorMessage(data.error || "Failed to save note. Please try again.");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    } catch (error) {
      console.error("Failed to add note:", error);
      setSaveStatus("error");
      setErrorMessage("Network error. Please check your connection.");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateNote = async (id: string) => {
    if (!editContent.trim()) return;

    setIsSaving(true);
    setSaveStatus("idle");

    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setNotes(
          notes.map((n) =>
            n.id === id ? { ...n, content: editContent.trim(), updatedAt: new Date() } : n
          )
        );
        setEditingId(null);
        setEditContent("");
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 2500);
      } else {
        setSaveStatus("error");
        setErrorMessage(data.error || "Failed to update note");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    } catch (error) {
      console.error("Failed to update note:", error);
      setSaveStatus("error");
      setErrorMessage("Network error. Please try again.");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    // Optimistic delete
    const noteToDelete = notes.find(n => n.id === id);
    setNotes(notes.filter((n) => n.id !== id));
    setNotesCount(Math.max(0, notesCount - 1));

    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        // Restore on failure
        if (noteToDelete) {
          setNotes(prev => [noteToDelete, ...prev]);
          setNotesCount(prev => prev + 1);
        }
        setErrorMessage("Failed to delete note");
        setTimeout(() => setErrorMessage(""), 3000);
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
      // Restore on failure
      if (noteToDelete) {
        setNotes(prev => [noteToDelete, ...prev]);
        setNotesCount(prev => prev + 1);
      }
      setErrorMessage("Failed to delete note");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleAddNote();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "gap-2 transition-all duration-200",
            notesCount > 0
              ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:border-amber-400"
              : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
          )}
        >
          <StickyNote className="w-4 h-4" />
          <span className="hidden sm:inline">Notes</span>
          {notesCount > 0 && (
            <span className="bg-amber-200 text-amber-800 text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
              {notesCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-hidden flex flex-col">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
              <StickyNote className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="block">Lesson Notes</span>
              <span className="text-xs font-normal text-gray-500">Keep track of key insights</span>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto mt-6 space-y-5 pr-1">
          {/* Lesson Context */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 text-gray-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">Taking notes for</p>
                <p className="font-medium text-gray-900 text-sm truncate">{lessonTitle}</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
              <button
                onClick={() => setErrorMessage("")}
                className="ml-auto p-1 hover:bg-red-100 rounded"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Add New Note - Prominent */}
          <div className="space-y-3">
            <div className="relative">
              <Textarea
                placeholder="Write your note here... What stood out to you?"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={4}
                className={cn(
                  "resize-none border-2 transition-all duration-200 pr-3",
                  "focus:border-amber-400 focus:ring-amber-100",
                  saveStatus === "error" && "border-red-300",
                  newNote.trim() ? "border-amber-200 bg-amber-50/30" : "border-gray-200"
                )}
              />
              {newNote.trim() && saveStatus === "idle" && (
                <div className="absolute bottom-2 right-2">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {newNote.trim() ? "⌘+Enter to save" : ""}
              </span>
              <Button
                onClick={handleAddNote}
                disabled={!newNote.trim() || isSaving}
                className={cn(
                  "transition-all duration-200",
                  saveStatus === "success"
                    ? "bg-green-500 hover:bg-green-600"
                    : saveStatus === "error"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                )}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : saveStatus === "success" ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Saved!
                  </>
                ) : saveStatus === "error" ? (
                  <>
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Failed
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Note
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Divider */}
          {notes.length > 0 && (
            <div className="flex items-center gap-3 py-2">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
              <span className="text-xs text-gray-400 font-medium">
                {notes.length} {notes.length === 1 ? "note" : "notes"}
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            </div>
          )}

          {/* Notes List */}
          <div className="space-y-3">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin mb-3" />
                <p className="text-sm">Loading your notes...</p>
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                  <StickyNote className="w-8 h-8 text-amber-500" />
                </div>
                <p className="text-gray-700 font-medium mb-1">No notes yet</p>
                <p className="text-gray-400 text-sm max-w-[200px] mx-auto">
                  Capture key insights as you learn to reinforce your understanding
                </p>
              </div>
            ) : (
              notes.map((note, index) => (
                <div
                  key={note.id}
                  className={cn(
                    "group relative rounded-xl border-2 transition-all duration-200",
                    "hover:shadow-md hover:border-amber-200",
                    note.type === "HIGHLIGHT"
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-white border-gray-100"
                  )}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {editingId === note.id ? (
                    <div className="p-4 space-y-3">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={4}
                        className="resize-none border-amber-200 focus:border-amber-400"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateNote(note.id)}
                          disabled={isSaving || !editContent.trim()}
                          className="bg-amber-500 hover:bg-amber-600"
                        >
                          {isSaving ? (
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          ) : (
                            <Save className="w-3 h-3 mr-1" />
                          )}
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelEdit}
                        >
                          <X className="w-3 h-3 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4">
                      {/* Note Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {note.type === "HIGHLIGHT" ? (
                            <div className="w-6 h-6 rounded-lg bg-yellow-200 flex items-center justify-center">
                              <Highlighter className="w-3 h-3 text-yellow-700" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center">
                              <StickyNote className="w-3 h-3 text-amber-600" />
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>{formatDistanceToNow(new Date(note.createdAt))} ago</span>
                          </div>
                        </div>

                        {/* Actions - visible on hover */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEdit(note)}
                            className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit note"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete note"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Note Content */}
                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {note.content}
                      </p>

                      {note.noteText && (
                        <p className="text-gray-500 text-xs mt-3 italic border-l-2 border-amber-200 pl-3">
                          {note.noteText}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer tip */}
        {notes.length > 0 && (
          <div className="flex-shrink-0 pt-4 border-t border-gray-100 mt-4">
            <p className="text-xs text-gray-400 text-center">
              Your notes are saved automatically
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
