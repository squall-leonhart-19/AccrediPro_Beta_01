"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    FileText,
    Search,
    BookOpen,
    Clock,
    Tag,
    ChevronRight,
    Sparkles,
    Star
} from "lucide-react";
import Link from "next/link";

// TODO: Fetch from API - user's saved notes from lessons
const notesData = [
    {
        id: 1,
        content: "Key insight: Always check TSH, Free T3, Free T4, and Reverse T3 together - never just TSH alone!",
        lessonTitle: "Thyroid Panel Deep Dive",
        moduleName: "Lab Analysis & Interpretation",
        courseSlug: "functional-medicine-complete-certification",
        timestamp: "5 min ago",
        type: "highlight",
        tags: ["thyroid", "labs"]
    },
    {
        id: 2,
        content: "Optimal ferritin range is 70-100 for women, not just 'above 12' like standard reference ranges suggest.",
        lessonTitle: "Iron Studies & Anemia Markers",
        moduleName: "Lab Analysis & Interpretation",
        courseSlug: "functional-medicine-complete-certification",
        timestamp: "2 hours ago",
        type: "note",
        tags: ["iron", "labs", "women's health"]
    },
    {
        id: 3,
        content: "The 5R Protocol: Remove, Replace, Reinoculate, Repair, Rebalance - use this framework for all gut healing protocols.",
        lessonTitle: "Gut Healing Foundations",
        moduleName: "Gut Health Deep Dive",
        courseSlug: "functional-medicine-complete-certification",
        timestamp: "Yesterday",
        type: "highlight",
        tags: ["gut health", "protocol"]
    },
    {
        id: 4,
        content: "Question to research: What's the connection between SIBO and histamine intolerance? Many patients have both.",
        lessonTitle: "Small Intestinal Bacterial Overgrowth",
        moduleName: "Gut Health Deep Dive",
        courseSlug: "functional-medicine-complete-certification",
        timestamp: "3 days ago",
        type: "question",
        tags: ["SIBO", "histamine"]
    },
    {
        id: 5,
        content: "Important: Cortisol should be tested at multiple times throughout the day (4-point saliva test), not just morning serum.",
        lessonTitle: "Adrenal Function Assessment",
        moduleName: "Hormones & Endocrine System",
        courseSlug: "functional-medicine-complete-certification",
        timestamp: "1 week ago",
        type: "highlight",
        tags: ["cortisol", "adrenals", "testing"]
    },
];

export default function NotesPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredNotes = notesData.filter(note =>
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.lessonTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'highlight': return <Sparkles className="w-4 h-4 text-gold-500" />;
            case 'question': return <span className="text-lg">❓</span>;
            default: return <FileText className="w-4 h-4 text-burgundy-500" />;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'highlight': return { text: 'Highlight', color: 'bg-gold-100 text-gold-700' };
            case 'question': return { text: 'Question', color: 'bg-purple-100 text-purple-700' };
            default: return { text: 'Note', color: 'bg-burgundy-100 text-burgundy-700' };
        }
    };

    return (
        <div className="min-h-screen p-6 lg:p-8" style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, #ffffff 50%, rgba(78, 31, 36, 0.05) 100%)' }}>
            {/* Header */}
            <div className="max-w-3xl mx-auto mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div
                        className="p-2 rounded-xl text-white"
                        style={{ background: 'linear-gradient(135deg, #4e1f24 0%, #722f37 100%)' }}
                    >
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight" style={{ color: '#4e1f24' }}>My Notes</h1>
                        <p className="text-gray-500 text-sm">{notesData.length} notes saved</p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="max-w-3xl mx-auto mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        placeholder="Search notes, lessons, or tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white"
                    />
                </div>
            </div>

            {/* Notes List */}
            <div className="max-w-3xl mx-auto space-y-4">
                {filteredNotes.length === 0 ? (
                    <Card className="p-8 text-center">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="font-semibold text-gray-700 mb-2">No notes found</h3>
                        <p className="text-gray-500 text-sm">
                            {searchQuery ? "Try a different search term" : "Start taking notes during your lessons!"}
                        </p>
                    </Card>
                ) : (
                    filteredNotes.map((note) => {
                        const typeInfo = getTypeLabel(note.type);
                        return (
                            <Card key={note.id} className="p-4 hover:shadow-lg transition-all group">
                                <div className="flex items-start gap-3">
                                    {/* Type indicator */}
                                    <div className="mt-1">
                                        {getTypeIcon(note.type)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <p className="text-gray-800 mb-3 leading-relaxed">"{note.content}"</p>

                                        {/* Lesson reference */}
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                            <BookOpen className="w-3.5 h-3.5" />
                                            <Link
                                                href={`/courses/${note.courseSlug}/learn`}
                                                className="hover:text-burgundy-600 hover:underline"
                                            >
                                                {note.lessonTitle}
                                            </Link>
                                            <span className="text-gray-300">•</span>
                                            <span>{note.moduleName}</span>
                                        </div>

                                        {/* Tags */}
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Badge className={`text-[10px] ${typeInfo.color}`}>
                                                {typeInfo.text}
                                            </Badge>
                                            {note.tags.map((tag) => (
                                                <Badge
                                                    key={tag}
                                                    variant="outline"
                                                    className="text-[10px] text-gray-500 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    <Tag className="w-2.5 h-2.5 mr-1" />
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Time & Actions */}
                                    <div className="text-right">
                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {note.timestamp}
                                        </span>
                                        <Link href={`/courses/${note.courseSlug}/learn`}>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                Go to lesson <ChevronRight className="w-3 h-3 ml-1" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        );
                    })
                )}
            </div>

            {/* Empty state CTA */}
            {notesData.length > 0 && (
                <div className="max-w-3xl mx-auto mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        💡 Tip: Highlight important text during lessons to save it here automatically!
                    </p>
                </div>
            )}
        </div>
    );
}
