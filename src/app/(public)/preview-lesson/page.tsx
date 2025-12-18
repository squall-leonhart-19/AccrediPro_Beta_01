"use client";

import { useState } from "react";
import { LessonWhatIsFM } from "@/components/mini-diploma/lessons/lesson-what-is-fm";
import { LessonWhatIsFMV1 } from "@/components/mini-diploma/lessons/lesson-what-is-fm-v1";
import { LessonWhatIsFMV2 } from "@/components/mini-diploma/lessons/lesson-what-is-fm-v2";
import { LessonWhatIsFMV3 } from "@/components/mini-diploma/lessons/lesson-what-is-fm-v3";
import { LessonWhatIsFMV4 } from "@/components/mini-diploma/lessons/lesson-what-is-fm-v4";
import { LessonWhatIsFMV5 } from "@/components/mini-diploma/lessons/lesson-what-is-fm-v5";
import { ChevronDown, Eye, Heart, Sparkles, Layout, MessageCircle, BookOpen, X } from "lucide-react";

const variants = [
    {
        id: "original",
        name: "Original",
        description: "Current design",
        icon: Eye,
        color: "from-slate-500 to-slate-700",
        bgColor: "bg-slate-100",
        textColor: "text-slate-700",
    },
    {
        id: "v1",
        name: "Story-Driven",
        description: "Emotional journey with Sarah's story",
        icon: Heart,
        color: "from-rose-500 to-pink-600",
        bgColor: "bg-rose-100",
        textColor: "text-rose-700",
        badge: "Best for Empathy",
    },
    {
        id: "v2",
        name: "Interactive",
        description: "Coursera-style gamified learning",
        icon: Sparkles,
        color: "from-indigo-500 to-purple-600",
        bgColor: "bg-indigo-100",
        textColor: "text-indigo-700",
        badge: "Best for Engagement",
    },
    {
        id: "v3",
        name: "Visual Timeline",
        description: "Infographic & data-driven",
        icon: Layout,
        color: "from-emerald-500 to-teal-600",
        bgColor: "bg-emerald-100",
        textColor: "text-emerald-700",
        badge: "Best for Visual Learners",
    },
    {
        id: "v4",
        name: "Conversational",
        description: "Chat-style with coach",
        icon: MessageCircle,
        color: "from-amber-500 to-orange-600",
        bgColor: "bg-amber-100",
        textColor: "text-amber-700",
        badge: "Best for Connection",
    },
    {
        id: "v5",
        name: "Editorial",
        description: "Premium magazine style",
        icon: BookOpen,
        color: "from-stone-600 to-stone-800",
        bgColor: "bg-stone-100",
        textColor: "text-stone-700",
        badge: "Best for Sophistication",
    },
];

export default function PreviewLessonPage() {
    const [selectedVariant, setSelectedVariant] = useState("v1");
    const [showSelector, setShowSelector] = useState(true);

    const currentVariant = variants.find((v) => v.id === selectedVariant);

    const renderLesson = () => {
        const props = {
            firstName: "Sarah",
            lessonNumber: 1,
            totalLessons: 9,
        };

        switch (selectedVariant) {
            case "original":
                return <LessonWhatIsFM {...props} />;
            case "v1":
                return <LessonWhatIsFMV1 {...props} />;
            case "v2":
                return <LessonWhatIsFMV2 {...props} />;
            case "v3":
                return <LessonWhatIsFMV3 {...props} />;
            case "v4":
                return <LessonWhatIsFMV4 {...props} />;
            case "v5":
                return <LessonWhatIsFMV5 {...props} />;
            default:
                return <LessonWhatIsFMV1 {...props} />;
        }
    };

    return (
        <div className="relative">
            {/* Floating Variant Selector */}
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[100]">
                {showSelector ? (
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 min-w-[340px] max-w-[95vw] animate-fade-in">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                            <div>
                                <h3 className="font-bold text-slate-900">Lesson Variants</h3>
                                <p className="text-xs text-slate-500">Compare 5 different designs</p>
                            </div>
                            <button
                                onClick={() => setShowSelector(false)}
                                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X className="h-4 w-4 text-slate-400" />
                            </button>
                        </div>

                        {/* Variant Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {variants.map((variant) => {
                                const Icon = variant.icon;
                                const isSelected = selectedVariant === variant.id;
                                return (
                                    <button
                                        key={variant.id}
                                        onClick={() => setSelectedVariant(variant.id)}
                                        className={`relative p-3 rounded-xl text-left transition-all ${
                                            isSelected
                                                ? `bg-gradient-to-br ${variant.color} text-white shadow-lg scale-[1.02]`
                                                : `${variant.bgColor} hover:scale-[1.02]`
                                        }`}
                                    >
                                        {variant.badge && isSelected && (
                                            <span className="absolute -top-2 -right-2 bg-amber-400 text-amber-900 text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                                                TOP
                                            </span>
                                        )}
                                        <Icon className={`h-5 w-5 mb-1.5 ${isSelected ? 'text-white' : variant.textColor}`} />
                                        <p className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                                            {variant.name}
                                        </p>
                                        <p className={`text-[10px] leading-tight ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                                            {variant.description}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Current Selection Info */}
                        {currentVariant?.badge && (
                            <div className="mt-4 pt-3 border-t border-slate-100">
                                <p className="text-xs text-center text-slate-500">
                                    <span className="font-semibold text-slate-700">{currentVariant.name}</span>
                                    {" — "}{currentVariant.badge}
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={() => setShowSelector(true)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-lg bg-gradient-to-r ${currentVariant?.color} text-white font-medium hover:scale-105 transition-transform`}
                    >
                        {currentVariant && <currentVariant.icon className="h-4 w-4" />}
                        <span>{currentVariant?.name}</span>
                        <ChevronDown className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Lesson Content */}
            {renderLesson()}
        </div>
    );
}
