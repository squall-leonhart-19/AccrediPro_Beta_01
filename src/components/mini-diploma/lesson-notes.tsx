"use client";

import { useState, useEffect } from "react";
import { BookmarkPlus, X, Trash2, StickyNote } from "lucide-react";

interface Note {
    id: string;
    lessonNumber: number;
    text: string;
    highlight?: string;
    timestamp: string;
}

interface LessonNotesProps {
    lessonNumber: number;
    niche: string;
}

/**
 * Lesson notes/bookmarks component
 * Allows users to save notes and highlights per lesson
 */
export function LessonNotes({ lessonNumber, niche }: LessonNotesProps) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [newNote, setNewNote] = useState("");
    const storageKey = `mini_diploma_notes_${niche}`;

    // Load notes from localStorage
    useEffect(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                try {
                    setNotes(JSON.parse(saved));
                } catch (e) {
                    console.error("Failed to parse notes:", e);
                }
            }
        }
    }, [storageKey]);

    // Save notes to localStorage
    const saveNotes = (updatedNotes: Note[]) => {
        setNotes(updatedNotes);
        if (typeof window !== "undefined") {
            localStorage.setItem(storageKey, JSON.stringify(updatedNotes));
        }
    };

    const addNote = () => {
        if (!newNote.trim()) return;

        const note: Note = {
            id: Date.now().toString(),
            lessonNumber,
            text: newNote.trim(),
            timestamp: new Date().toISOString(),
        };

        saveNotes([...notes, note]);
        setNewNote("");
    };

    const deleteNote = (id: string) => {
        saveNotes(notes.filter(n => n.id !== id));
    };

    const currentLessonNotes = notes.filter(n => n.lessonNumber === lessonNumber);
    const totalNotes = notes.length;

    return (
        <>
            {/* Toggle button */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                title="My Notes"
            >
                <StickyNote className="w-4 h-4" />
                <span className="hidden sm:inline">Notes</span>
                {totalNotes > 0 && (
                    <span className="bg-amber-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center">
                        {totalNotes}
                    </span>
                )}
            </button>

            {/* Notes panel */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/30"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Panel */}
                    <div className="relative w-full max-w-md bg-white shadow-xl flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">
                                My Notes
                            </h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Add note form */}
                        <div className="p-4 border-b bg-gray-50">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && addNote()}
                                    placeholder="Add a note for this lesson..."
                                    className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                                <button
                                    onClick={addNote}
                                    disabled={!newNote.trim()}
                                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <BookmarkPlus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Notes list */}
                        <div className="flex-1 overflow-auto p-4">
                            {currentLessonNotes.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="text-sm font-medium text-gray-500 mb-3">
                                        This Lesson ({currentLessonNotes.length})
                                    </h4>
                                    <div className="space-y-2">
                                        {currentLessonNotes.map(note => (
                                            <div
                                                key={note.id}
                                                className="bg-amber-50 border border-amber-200 rounded-lg p-3 group"
                                            >
                                                <div className="flex justify-between items-start gap-2">
                                                    <p className="text-sm text-gray-700">{note.text}</p>
                                                    <button
                                                        onClick={() => deleteNote(note.id)}
                                                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {new Date(note.timestamp).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Other lessons notes */}
                            {notes.filter(n => n.lessonNumber !== lessonNumber).length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-3">
                                        Other Lessons
                                    </h4>
                                    <div className="space-y-2">
                                        {notes
                                            .filter(n => n.lessonNumber !== lessonNumber)
                                            .sort((a, b) => a.lessonNumber - b.lessonNumber)
                                            .map(note => (
                                                <div
                                                    key={note.id}
                                                    className="bg-gray-50 border border-gray-200 rounded-lg p-3 group"
                                                >
                                                    <div className="flex justify-between items-start gap-2">
                                                        <div>
                                                            <span className="text-xs text-gray-500 block mb-1">
                                                                Lesson {note.lessonNumber}
                                                            </span>
                                                            <p className="text-sm text-gray-700">{note.text}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => deleteNote(note.id)}
                                                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {notes.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <StickyNote className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                    <p>No notes yet</p>
                                    <p className="text-sm">Add notes as you learn!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
