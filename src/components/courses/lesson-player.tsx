"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { CourseSidebar } from "./course-sidebar";
import { LiveChatPanel } from "./live-chat-panel";

// =============================================================================
// TYPES
// =============================================================================
interface Lesson {
    id: string;
    title: string;
}

interface Module {
    id: string;
    title: string;
    lessons: Lesson[];
}

interface Coach {
    id: string;
    firstName: string | null;
    lastName: string | null;
    avatar: string | null;
}

interface Message {
    id: string;
    content: string;
    senderId: string;
    createdAt: string;
    isRead: boolean;
}

interface LessonPlayerProps {
    lesson: {
        id: string;
        title: string;
        content: string | null;
    };
    module: {
        id: string;
        title: string;
    };
    course: {
        id: string;
        title: string;
        slug: string;
        modules: Module[];
        coach: Coach | null;
    };
    progress: {
        isCompleted: boolean;
    };
    navigation: {
        prevLesson: { id: string; title: string } | null;
        nextLesson: { id: string; title: string } | null;
    };
    progressMap: Record<string, boolean>;
}

// =============================================================================
// LESSON PLAYER - Fixed Mobile + Synced Chat
// =============================================================================
export function LessonPlayer({
    lesson,
    module,
    course,
    progress,
    navigation,
    progressMap,
}: LessonPlayerProps) {
    const router = useRouter();
    const { data: session } = useSession();
    const [isCompleting, setIsCompleting] = useState(false);
    const [isCompleted, setIsCompleted] = useState(progress.isCompleted);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);

    // Notes state
    const [note, setNote] = useState("");
    const [noteSaved, setNoteSaved] = useState(false);
    const [noteExpanded, setNoteExpanded] = useState(false);

    // Chat state - synced with /api/messages
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatInput, setChatInput] = useState("");
    const [chatLoading, setChatLoading] = useState(false);
    const [sendingMessage, setSendingMessage] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const coachId = course.coach?.id;
    const coachName = course.coach
        ? `${course.coach.firstName || ""} ${course.coach.lastName || ""}`.trim() || "Coach Sarah"
        : "Coach Sarah";

    useEffect(() => {
        setIsCompleted(progress.isCompleted);
    }, [progress.isCompleted]);

    // Prefetch next lesson for instant navigation
    useEffect(() => {
        if (navigation.nextLesson) {
            router.prefetch(`/learning/${course.slug}/${navigation.nextLesson.id}`);
        }
        if (navigation.prevLesson) {
            router.prefetch(`/learning/${course.slug}/${navigation.prevLesson.id}`);
        }
    }, [navigation, course.slug, router]);

    // Load saved note
    useEffect(() => {
        const savedNote = localStorage.getItem(`lesson-note-${lesson.id}`);
        if (savedNote) {
            setNote(savedNote);
            setNoteExpanded(true);
        }
    }, [lesson.id]);

    // Fetch messages from /api/messages
    useEffect(() => {
        if (!coachId || !session?.user?.id) return;

        const fetchMessages = async () => {
            setChatLoading(true);
            try {
                const res = await fetch(`/api/messages?userId=${coachId}`);
                const data = await res.json();
                if (data.success && data.data) {
                    setMessages(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            } finally {
                setChatLoading(false);
            }
        };

        fetchMessages();
        // Poll for new messages every 30s
        const interval = setInterval(fetchMessages, 30000);
        return () => clearInterval(interval);
    }, [coachId, session?.user?.id]);

    // Smart scroll - only scroll to bottom when near bottom or initial load
    const isNearBottomRef = useRef(true);
    const prevMessageCountRef = useRef(0);

    useEffect(() => {
        if (!messagesEndRef.current) return;
        const container = messagesEndRef.current.parentElement;
        if (!container) return;

        // Check if we should auto-scroll:
        // 1. User is already near bottom (within 150px)
        // 2. OR it's initial load (going from 0 to some messages)
        // 3. OR user just sent a message (last message is from current user)
        const lastMsg = messages[messages.length - 1];
        const isUserMessage = lastMsg?.senderId === session?.user?.id;
        const isInitialLoad = prevMessageCountRef.current === 0 && messages.length > 0;

        if (isNearBottomRef.current || isInitialLoad || isUserMessage) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }

        prevMessageCountRef.current = messages.length;
    }, [messages, session?.user?.id]);

    const handleCompleteAndNext = async () => {
        if (isCompleting) return;
        setIsCompleting(true);

        try {
            const response = await fetch("/api/progress/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lessonId: lesson.id }),
            });

            if (response.ok) {
                setIsCompleted(true);
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                toast.success("Lesson completed! 🎉");

                setTimeout(() => {
                    if (navigation.nextLesson) {
                        router.push(`/learning/${course.slug}/${navigation.nextLesson.id}`);
                    } else {
                        toast.success("🏆 Course completed!");
                        router.push(`/courses/${course.slug}`);
                    }
                }, 600);
            } else {
                toast.error("Failed to save progress");
            }
        } catch {
            toast.error("Error saving progress");
        } finally {
            setIsCompleting(false);
        }
    };

    const saveNote = () => {
        if (note.trim()) {
            localStorage.setItem(`lesson-note-${lesson.id}`, note);
            setNoteSaved(true);
            toast.success("Note saved!");
            setTimeout(() => setNoteSaved(false), 2000);
        }
    };

    const sendMessage = async () => {
        if (!chatInput.trim() || !coachId || sendingMessage) return;

        const content = chatInput.trim();
        setChatInput("");
        setSendingMessage(true);

        // Optimistic update
        const tempId = `temp-${Date.now()}`;
        const optimisticMsg: Message = {
            id: tempId,
            content,
            senderId: session?.user?.id || "",
            createdAt: new Date().toISOString(),
            isRead: false,
        };
        setMessages(prev => [...prev, optimisticMsg]);

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ receiverId: coachId, content }),
            });

            const data = await res.json();
            if (data.success) {
                // Replace temp message with real one
                setMessages(prev => prev.map(m =>
                    m.id === tempId ? { ...data.data, createdAt: data.data.createdAt } : m
                ));

                // Generate AI response from Sarah
                const aiPlaceholderId = `ai-${Date.now()}`;
                const aiPlaceholder: Message = {
                    id: aiPlaceholderId,
                    content: "",
                    senderId: coachId,
                    createdAt: new Date().toISOString(),
                    isRead: true,
                };
                setMessages(prev => [...prev, aiPlaceholder]);

                // Prepare chat history for AI (last 10 messages)
                const chatHistory = messages.slice(-10).map(m => ({
                    role: m.senderId === session?.user?.id ? "user" as const : "assistant" as const,
                    content: m.content
                }));
                chatHistory.push({ role: "user" as const, content: content });

                // Call AI chat API for Sarah's response
                const aiRes = await fetch("/api/ai/mentor-chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        messages: chatHistory,
                        context: { currentLesson: `${module.title} - ${lesson.title}` },
                    }),
                });

                if (aiRes.ok) {
                    const reader = aiRes.body?.getReader();
                    if (reader) {
                        const decoder = new TextDecoder();
                        let accumulatedContent = "";

                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) break;

                            const chunk = decoder.decode(value);
                            const lines = chunk.split("\n");

                            for (const line of lines) {
                                if (line.startsWith("data: ")) {
                                    const lineData = line.slice(6);
                                    if (lineData === "[DONE]") continue;

                                    try {
                                        const parsed = JSON.parse(lineData);
                                        if (parsed.text) {
                                            accumulatedContent += parsed.text;
                                            setMessages(prev =>
                                                prev.map(m =>
                                                    m.id === aiPlaceholderId
                                                        ? { ...m, content: accumulatedContent }
                                                        : m
                                                )
                                            );
                                        }
                                    } catch {
                                        // Ignore JSON parse errors for incomplete chunks
                                    }
                                }
                            }
                        }

                        // Save AI response as a real message from Sarah
                        if (accumulatedContent) {
                            await fetch("/api/messages/ai-response", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    receiverId: session?.user?.id,
                                    senderId: coachId,
                                    content: accumulatedContent,
                                }),
                            });
                        }
                    }
                }
            } else {
                toast.error("Failed to send message");
                setMessages(prev => prev.filter(m => m.id !== tempId));
            }
        } catch {
            toast.error("Failed to send message");
            setMessages(prev => prev.filter(m => m.id !== tempId));
        } finally {
            setSendingMessage(false);
        }
    };

    // Chat UI Component (reused for desktop and mobile)
    const ChatPanel = ({ isMobile = false }: { isMobile?: boolean }) => (
        <div style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            background: "#fff"
        }}>
            {/* Chat Header */}
            <div style={{
                padding: "16px 20px",
                borderBottom: "1px solid #eee",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexShrink: 0
            }}>
                <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: course.coach?.avatar ? `url(${course.coach.avatar}) center/cover` : "#722f37",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "16px",
                    fontWeight: 600
                }}>
                    {!course.coach?.avatar && (coachName[0] || "S")}
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: "#333" }}>{coachName}</div>
                    <div style={{ fontSize: "12px", color: "#16a34a", display: "flex", alignItems: "center", gap: "4px" }}>
                        <span style={{ width: "8px", height: "8px", background: "#16a34a", borderRadius: "50%" }}></span>
                        Online now
                    </div>
                </div>
                {isMobile && (
                    <button
                        onClick={() => setChatOpen(false)}
                        style={{
                            width: "32px",
                            height: "32px",
                            background: "#f5f5f5",
                            border: "none",
                            borderRadius: "50%",
                            fontSize: "18px",
                            cursor: "pointer"
                        }}
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Chat Messages */}
            <div
                style={{ flex: 1, overflowY: "auto", padding: "16px" }}
                onScroll={(e) => {
                    const el = e.target as HTMLDivElement;
                    // User is "near bottom" if within 150px of the bottom
                    isNearBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 150;
                }}
            >
                {chatLoading ? (
                    <div style={{ textAlign: "center", color: "#999", padding: "40px 0" }}>
                        Loading messages...
                    </div>
                ) : messages.length === 0 ? (
                    <div style={{ textAlign: "center", color: "#999", padding: "40px 0" }}>
                        <div style={{ fontSize: "48px", marginBottom: "16px" }}>💬</div>
                        <div style={{ fontSize: "14px" }}>Start a conversation!</div>
                        <div style={{ fontSize: "13px", color: "#bbb" }}>Ask questions about this lesson</div>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {messages.map((msg) => {
                            const isMe = msg.senderId === session?.user?.id;
                            return (
                                <div
                                    key={msg.id}
                                    style={{
                                        display: "flex",
                                        justifyContent: isMe ? "flex-end" : "flex-start"
                                    }}
                                >
                                    <div style={{
                                        maxWidth: "80%",
                                        padding: "12px 16px",
                                        borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                                        background: isMe ? "#722f37" : "#f5f5f5",
                                        color: isMe ? "#fff" : "#333",
                                        fontSize: "14px",
                                        lineHeight: 1.5
                                    }}>
                                        {msg.content}
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Chat Input */}
            <div style={{ borderTop: "1px solid #eee", padding: "16px", flexShrink: 0 }}>
                <div style={{ display: "flex", gap: "8px" }}>
                    <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Type a message..."
                        style={{
                            flex: 1,
                            padding: "12px 16px",
                            border: "1px solid #ddd",
                            borderRadius: "24px",
                            fontSize: "14px",
                            outline: "none"
                        }}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={sendingMessage || !chatInput.trim()}
                        style={{
                            padding: "12px 20px",
                            background: sendingMessage ? "#999" : "#722f37",
                            color: "#fff",
                            border: "none",
                            borderRadius: "24px",
                            cursor: sendingMessage ? "wait" : "pointer",
                            fontSize: "14px"
                        }}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ display: "flex", height: "100vh", background: "#fff", overflow: "hidden" }}>

            {/* LEFT SIDEBAR - Desktop only - Fixed */}
            <aside className="desktop-sidebar" style={{
                width: "300px",
                flexShrink: 0,
                borderRight: "1px solid #eee",
                height: "100vh",
                overflowY: "auto"
            }}>
                <CourseSidebar
                    courseSlug={course.slug}
                    modules={course.modules}
                    currentLessonId={lesson.id}
                    progressMap={progressMap}
                />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 100,
                        background: "rgba(0,0,0,0.5)"
                    }}
                    onClick={() => setSidebarOpen(false)}
                >
                    <div
                        style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: "300px",
                            background: "#fff",
                            boxShadow: "2px 0 10px rgba(0,0,0,0.1)"
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSidebarOpen(false)}
                            style={{
                                position: "absolute",
                                top: "12px",
                                right: "12px",
                                width: "32px",
                                height: "32px",
                                background: "#f5f5f5",
                                border: "none",
                                borderRadius: "50%",
                                fontSize: "18px",
                                cursor: "pointer",
                                zIndex: 10
                            }}
                        >
                            ✕
                        </button>
                        <CourseSidebar
                            courseSlug={course.slug}
                            modules={course.modules}
                            currentLessonId={lesson.id}
                            progressMap={progressMap}
                        />
                    </div>
                </div>
            )}

            {/* MAIN CONTENT - Scrollable */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, height: "100vh", overflowY: "auto" }}>
                {/* Header */}
                <header style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid #eee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    position: "sticky",
                    top: 0,
                    background: "#fff",
                    zIndex: 10,
                    gap: "12px"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="mobile-only"
                            style={{
                                padding: "8px 10px",
                                background: "none",
                                border: "1px solid #ddd",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "16px"
                            }}
                        >
                            ☰
                        </button>

                        <Link
                            href={`/courses/${course.slug}`}
                            style={{ color: "#666", textDecoration: "none", fontSize: "14px" }}
                        >
                            ← Back
                        </Link>
                    </div>

                    <span style={{
                        color: "#888",
                        fontSize: "13px",
                        flex: 1,
                        textAlign: "center",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                    }}>
                        {module.title}
                    </span>

                    {/* Chat toggle for mobile/tablet */}
                    <button
                        onClick={() => setChatOpen(!chatOpen)}
                        className="chat-toggle"
                        style={{
                            padding: "8px 14px",
                            background: chatOpen ? "#722f37" : "#f5f5f5",
                            color: chatOpen ? "#fff" : "#333",
                            border: "none",
                            borderRadius: "20px",
                            fontSize: "13px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            flexShrink: 0
                        }}
                    >
                        💬 Chat
                    </button>
                </header>

                {/* HTML Content */}
                <main
                    style={{ flex: 1 }}
                    ref={(el) => {
                        if (el) {
                            el.innerHTML = lesson.content || "";
                            // Execute inline scripts EXCEPT toggleAnswer (we override it)
                            const scripts = el.querySelectorAll("script");
                            scripts.forEach((script) => {
                                // Skip scripts that define toggleAnswer - we use our own
                                if (script.textContent?.includes("function toggleAnswer") ||
                                    script.textContent?.includes("toggleAnswer =")) {
                                    return;
                                }
                                const newScript = document.createElement("script");
                                newScript.textContent = script.textContent;
                                script.parentNode?.replaceChild(newScript, script);
                            });

                            // Inject our robust toggleAnswer that stays visible until manually hidden
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (window as any).toggleAnswer = (btnOrId: HTMLButtonElement | string) => {
                                let answerElement: HTMLElement | null = null;
                                let button: HTMLButtonElement | null = null;

                                if (typeof btnOrId === "string") {
                                    answerElement = document.getElementById(btnOrId);
                                } else if (btnOrId instanceof HTMLElement) {
                                    button = btnOrId as HTMLButtonElement;
                                    answerElement = button.nextElementSibling as HTMLElement;
                                }

                                if (answerElement) {
                                    // Clear any auto-hide timeouts
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    const existingTimeout = (answerElement as any)._hideTimeout;
                                    if (existingTimeout) {
                                        clearTimeout(existingTimeout);
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        delete (answerElement as any)._hideTimeout;
                                    }

                                    const isCurrentlyHidden =
                                        answerElement.style.display === "none" ||
                                        answerElement.classList.contains("hidden") ||
                                        !answerElement.classList.contains("show");

                                    if (isCurrentlyHidden) {
                                        answerElement.style.display = "block";
                                        answerElement.classList.remove("hidden");
                                        answerElement.classList.add("show");
                                        if (button) button.textContent = "Hide Answer";
                                    } else {
                                        answerElement.style.display = "none";
                                        answerElement.classList.add("hidden");
                                        answerElement.classList.remove("show");
                                        if (button) button.textContent = "Reveal Answer";
                                    }
                                }
                            };
                        }
                    }}
                />

                {/* Notes Section */}
                <div style={{
                    maxWidth: "800px",
                    margin: "0 auto",
                    padding: "0 20px",
                    width: "100%"
                }}>
                    <div style={{
                        background: "#fefce8",
                        border: "1px solid #fde047",
                        borderRadius: "12px",
                        padding: "16px 20px",
                        marginBottom: "24px"
                    }}>
                        <button
                            onClick={() => setNoteExpanded(!noteExpanded)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                width: "100%",
                                textAlign: "left"
                            }}
                        >
                            <span style={{ fontSize: "20px" }}>📝</span>
                            <span style={{ fontWeight: 600, color: "#854d0e", fontSize: "15px" }}>My Notes for This Lesson</span>
                            <span style={{ marginLeft: "auto", color: "#a16207" }}>{noteExpanded ? "▼" : "▶"}</span>
                        </button>

                        {noteExpanded && (
                            <div style={{ marginTop: "16px" }}>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Write your thoughts, key takeaways, or questions here..."
                                    style={{
                                        width: "100%",
                                        minHeight: "100px",
                                        padding: "12px",
                                        border: "1px solid #fde047",
                                        borderRadius: "8px",
                                        fontSize: "15px",
                                        lineHeight: 1.6,
                                        resize: "vertical",
                                        background: "#fff"
                                    }}
                                />
                                <button
                                    onClick={saveNote}
                                    style={{
                                        marginTop: "12px",
                                        padding: "10px 20px",
                                        background: noteSaved ? "#16a34a" : "#854d0e",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "6px",
                                        fontSize: "14px",
                                        fontWeight: 500,
                                        cursor: "pointer"
                                    }}
                                >
                                    {noteSaved ? "✓ Saved" : "Save Note"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ASI Copyright Footer */}
                <div style={{
                    maxWidth: "800px",
                    margin: "0 auto",
                    padding: "32px 20px",
                    textAlign: "center",
                    borderTop: "1px solid #eee"
                }}>
                    <img
                        src="/images/asi-logo.png"
                        alt="AccrediPro Standards Institute"
                        style={{
                            height: "48px",
                            marginBottom: "12px",
                            opacity: 0.9
                        }}
                    />
                    <p style={{
                        fontSize: "13px",
                        color: "#9ca3af",
                        margin: 0,
                        lineHeight: 1.6
                    }}>
                        © 2026 AccrediPro Standards Institute. All Rights Reserved.
                    </p>
                </div>

                {/* Footer with Buttons */}
                <footer style={{
                    padding: "24px 16px",
                    borderTop: "1px solid #eee",
                    background: "#fafafa"
                }}>
                    <div style={{
                        maxWidth: "800px",
                        margin: "0 auto",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "12px",
                        flexWrap: "wrap"
                    }}>
                        {navigation.prevLesson && (
                            <Link
                                href={`/learning/${course.slug}/${navigation.prevLesson.id}`}
                                style={{
                                    padding: "12px 20px",
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    background: "#fff",
                                    color: "#333",
                                    textDecoration: "none",
                                    fontSize: "14px",
                                    fontWeight: 500
                                }}
                            >
                                ← Back
                            </Link>
                        )}

                        <button
                            onClick={handleCompleteAndNext}
                            disabled={isCompleting}
                            style={{
                                padding: "14px 32px",
                                background: isCompleted ? "#16a34a" : "#722f37",
                                color: "#fff",
                                border: "none",
                                borderRadius: "50px",
                                fontSize: "15px",
                                fontWeight: 600,
                                cursor: isCompleting ? "wait" : "pointer",
                                boxShadow: "0 4px 14px rgba(0,0,0,0.15)"
                            }}
                        >
                            {isCompleting ? "Saving..." : isCompleted ? "✓ Completed" : "Complete & Continue →"}
                        </button>

                        {navigation.nextLesson && (
                            <Link
                                href={`/learning/${course.slug}/${navigation.nextLesson.id}`}
                                style={{
                                    padding: "12px 20px",
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    background: "#fff",
                                    color: "#333",
                                    textDecoration: "none",
                                    fontSize: "14px",
                                    fontWeight: 500
                                }}
                            >
                                Next →
                            </Link>
                        )}
                    </div>
                </footer>
            </div>

            {/* RIGHT CHAT PANEL - Desktop XL only - Fixed */}
            <aside className="desktop-chat" style={{
                width: "340px",
                flexShrink: 0,
                borderLeft: "1px solid #eee",
                height: "100vh",
                display: "flex",
                flexDirection: "column"
            }}>
                {/* Live Chat - Full Panel */}
                <LiveChatPanel courseId={course.id} />
            </aside>

            {/* Mobile Chat Overlay */}
            {chatOpen && (
                <div
                    className="mobile-chat-overlay"
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 100,
                        background: "rgba(0,0,0,0.5)"
                    }}
                    onClick={() => setChatOpen(false)}
                >
                    <div
                        style={{
                            position: "absolute",
                            right: 0,
                            top: 0,
                            bottom: 0,
                            width: "100%",
                            maxWidth: "400px",
                            background: "#fff",
                            display: "flex",
                            flexDirection: "column"
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Mobile Header */}
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "12px 16px",
                            background: "#16a34a",
                            color: "#fff",
                            fontWeight: 600
                        }}>
                            <span>🔴 Live Chat</span>
                            <button
                                onClick={() => setChatOpen(false)}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    color: "#fff",
                                    fontSize: "20px",
                                    cursor: "pointer"
                                }}
                            >✕</button>
                        </div>
                        {/* Mobile Chat Content */}
                        <div style={{ flex: 1, overflow: "hidden" }}>
                            <LiveChatPanel courseId={course.id} onClose={() => setChatOpen(false)} />
                        </div>
                    </div>
                </div>
            )}

            {/* Responsive CSS */}
            <style>{`
        /* Mobile first - hide desktop elements */
        .desktop-sidebar { display: none !important; }
        .desktop-chat { display: none !important; }
        .mobile-only { display: block !important; }
        .chat-toggle { display: flex !important; }
        
        /* Tablet (1024px+) - show sidebar */
        @media (min-width: 1024px) {
          .desktop-sidebar { display: block !important; }
          .mobile-only { display: none !important; }
        }
        
        /* Desktop XL (1280px+) - show chat panel, hide toggle */
        @media (min-width: 1280px) {
          .desktop-chat { display: block !important; }
          .chat-toggle { display: none !important; }
        }
      `}</style>
        </div>
    );
}
