"use client";

import { useState } from "react";
import Link from "next/link";

interface Lesson {
    id: string;
    title: string;
}

interface Module {
    id: string;
    title: string;
    lessons: Lesson[];
}

interface CourseSidebarProps {
    courseSlug: string;
    modules: Module[];
    currentLessonId: string;
    progressMap: Record<string, boolean>; // lessonId -> isCompleted
}

export function CourseSidebar({
    courseSlug,
    modules,
    currentLessonId,
    progressMap,
}: CourseSidebarProps) {
    // Expand the module containing the current lesson by default
    const currentModuleId = modules.find(m =>
        m.lessons.some(l => l.id === currentLessonId)
    )?.id;

    const [expandedModules, setExpandedModules] = useState<Set<string>>(
        new Set(currentModuleId ? [currentModuleId] : [])
    );

    const toggleModule = (moduleId: string) => {
        setExpandedModules(prev => {
            const next = new Set(prev);
            if (next.has(moduleId)) {
                next.delete(moduleId);
            } else {
                next.add(moduleId);
            }
            return next;
        });
    };

    // Calculate progress
    const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
    const completedLessons = Object.values(progressMap).filter(Boolean).length;
    const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#fafafa" }}>
            {/* Header */}
            <div style={{ padding: "20px", borderBottom: "1px solid #eee" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontWeight: 600, color: "#333" }}>Course Content</span>
                    <span style={{ fontSize: "14px", color: "#666" }}>{completedLessons}/{totalLessons}</span>
                </div>
                {/* Progress bar */}
                <div style={{ height: "6px", background: "#e5e5e5", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{
                        height: "100%",
                        width: `${progressPercent}%`,
                        background: "#722f37",
                        transition: "width 0.3s"
                    }} />
                </div>
                <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>{progressPercent}% complete</div>
            </div>

            {/* Modules list */}
            <div style={{ flex: 1, overflowY: "auto" }}>
                {modules.map((module, moduleIndex) => {
                    const isExpanded = expandedModules.has(module.id);
                    const moduleCompleted = module.lessons.filter(l => progressMap[l.id]).length;
                    const isModuleComplete = moduleCompleted === module.lessons.length && module.lessons.length > 0;

                    return (
                        <div key={module.id} style={{ borderBottom: "1px solid #eee" }}>
                            {/* Module header */}
                            <button
                                onClick={() => toggleModule(module.id)}
                                style={{
                                    width: "100%",
                                    padding: "16px 20px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    background: isExpanded ? "#f0f0f0" : "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    textAlign: "left"
                                }}
                            >
                                <div style={{
                                    width: "28px",
                                    height: "28px",
                                    borderRadius: "6px",
                                    background: isModuleComplete ? "#dcfce7" : "#e5e5e5",
                                    color: isModuleComplete ? "#16a34a" : "#666",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    flexShrink: 0
                                }}>
                                    {isModuleComplete ? "✓" : moduleIndex}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontSize: "14px",
                                        fontWeight: 500,
                                        color: "#333",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis"
                                    }}>
                                        {module.title}
                                    </div>
                                    <div style={{ fontSize: "12px", color: "#888" }}>
                                        {moduleCompleted}/{module.lessons.length} lessons
                                    </div>
                                </div>
                                <span style={{ color: "#999", fontSize: "12px" }}>{isExpanded ? "▼" : "▶"}</span>
                            </button>

                            {/* Lessons */}
                            {isExpanded && (
                                <div style={{ paddingBottom: "8px" }}>
                                    {module.lessons.map((lesson) => {
                                        const isCompleted = progressMap[lesson.id];
                                        const isCurrent = lesson.id === currentLessonId;

                                        return (
                                            <Link
                                                key={lesson.id}
                                                href={`/learning/${courseSlug}/${lesson.id}`}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "10px",
                                                    padding: "10px 20px 10px 52px",
                                                    textDecoration: "none",
                                                    background: isCurrent ? "rgba(114, 47, 55, 0.1)" : "transparent",
                                                    borderLeft: isCurrent ? "3px solid #722f37" : "3px solid transparent"
                                                }}
                                            >
                                                <span style={{
                                                    fontSize: "14px",
                                                    color: isCompleted ? "#16a34a" : isCurrent ? "#722f37" : "#999"
                                                }}>
                                                    {isCompleted ? "✓" : "○"}
                                                </span>
                                                <span style={{
                                                    fontSize: "14px",
                                                    color: isCurrent ? "#722f37" : isCompleted ? "#666" : "#333",
                                                    fontWeight: isCurrent ? 500 : 400,
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis"
                                                }}>
                                                    {lesson.title}
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
