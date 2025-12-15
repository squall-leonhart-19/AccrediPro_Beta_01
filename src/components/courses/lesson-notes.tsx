"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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

const highlightColors = [
  { name: "yellow", class: "bg-yellow-200", hex: "#fef08a" },
  { name: "green", class: "bg-green-200", hex: "#bbf7d0" },
  { name: "blue", class: "bg-blue-200", hex: "#bfdbfe" },
  { name: "pink", class: "bg-pink-200", hex: "#fbcfe8" },
];

export function LessonNotes({ lessonId, lessonTitle }: LessonNotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Fetch notes when sheet opens
  useEffect(() => {
    if (isOpen) {
      fetchNotes();
    }
  }, [isOpen, lessonId]);

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/notes?lessonId=${lessonId}`);
      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes || []);
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          type: "NOTE",
          content: newNote,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setNotes([data.note, ...notes]);
        setNewNote("");
      }
    } catch (error) {
      console.error("Failed to add note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateNote = async (id: string) => {
    if (!editContent.trim()) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent }),
      });

      if (response.ok) {
        setNotes(
          notes.map((n) =>
            n.id === id ? { ...n, content: editContent, updatedAt: new Date() } : n
          )
        );
        setEditingId(null);
        setEditContent("");
      }
    } catch (error) {
      console.error("Failed to update note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNotes(notes.filter((n) => n.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
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

  const notesCount = notes.filter((n) => n.type === "NOTE").length;
  const highlightsCount = notes.filter((n) => n.type === "HIGHLIGHT").length;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50"
        >
          <StickyNote className="w-4 h-4 mr-2" />
          Notes
          {notes.length > 0 && (
            <span className="ml-2 bg-burgundy-100 text-burgundy-700 text-xs px-1.5 py-0.5 rounded-full">
              {notes.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <StickyNote className="w-5 h-5 text-burgundy-600" />
            Lesson Notes
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Lesson Context */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">Notes for:</p>
            <p className="font-medium text-gray-900 text-sm">{lessonTitle}</p>
          </div>

          {/* Stats */}
          <div className="flex gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <StickyNote className="w-4 h-4" />
              <span>{notesCount} notes</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Highlighter className="w-4 h-4" />
              <span>{highlightsCount} highlights</span>
            </div>
          </div>

          {/* Add New Note */}
          <div className="space-y-3">
            <Textarea
              placeholder="Add a note about this lesson..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <Button
              onClick={handleAddNote}
              disabled={!newNote.trim() || isSaving}
              className="w-full bg-burgundy-600 hover:bg-burgundy-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Note
            </Button>
          </div>

          {/* Notes List */}
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                Loading notes...
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center py-8">
                <StickyNote className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm">No notes yet</p>
                <p className="text-gray-400 text-xs">
                  Add notes to remember key points
                </p>
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className={`p-4 rounded-lg border ${
                    note.type === "HIGHLIGHT"
                      ? `${highlightColors.find((c) => c.name === note.color)?.class || "bg-yellow-100"} border-transparent`
                      : "bg-white border-gray-200"
                  }`}
                >
                  {editingId === note.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                        className="resize-none"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateNote(note.id)}
                          disabled={isSaving}
                          className="bg-burgundy-600 hover:bg-burgundy-700"
                        >
                          <Save className="w-3 h-3 mr-1" />
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
                    <>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          {note.type === "HIGHLIGHT" ? (
                            <Highlighter className="w-4 h-4 text-amber-600" />
                          ) : (
                            <StickyNote className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="text-xs text-gray-500">
                            {note.type === "HIGHLIGHT" ? "Highlight" : "Note"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => startEdit(note)}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="p-1 text-gray-400 hover:text-red-500 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-800 text-sm whitespace-pre-wrap">
                        {note.content}
                      </p>
                      {note.noteText && (
                        <p className="text-gray-600 text-xs mt-2 italic">
                          {note.noteText}
                        </p>
                      )}
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>
                          {formatDistanceToNow(new Date(note.createdAt))} ago
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
