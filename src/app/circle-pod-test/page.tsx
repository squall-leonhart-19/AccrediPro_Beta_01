"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, User, Bot, Sparkles, RefreshCw } from "lucide-react";

const GOLD_GRADIENT = "linear-gradient(135deg, #D4AF37 0%, #F7E7A0 25%, #D4AF37 50%, #B8860B 75%, #D4AF37 100%)";

interface Message {
    role: "sarah" | "zombie" | "user";
    name: string;
    content: string;
}

export default function CirclePodTestPage() {
    const [userMessage, setUserMessage] = useState("Nice to meet you, thanks for having me!");
    const [userName, setUserName] = useState("Jenna");
    const [zombieName, setZombieName] = useState("Amber L.");
    const [conversationHistory, setConversationHistory] = useState<Message[]>([
        { role: "sarah", name: "Sarah M.", content: "Welcome to Cohort #47! 🎉 We're so excited to have you here." },
        { role: "zombie", name: "Amber L.", content: "Yay! So happy you joined us! 🙌" },
    ]);

    const [sarahResponse, setSarahResponse] = useState("");
    const [zombieResponse, setZombieResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [sarahDelay, setSarahDelay] = useState<number | null>(null);
    const [zombieDelay, setZombieDelay] = useState<number | null>(null);

    const generateResponses = async () => {
        setLoading(true);
        setError(null);
        setSarahResponse("");
        setZombieResponse("");

        try {
            const res = await fetch("/api/admin/circle-pod-test", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userMessage,
                    userName,
                    zombieName,
                    conversationHistory: conversationHistory.map(m => `${m.name}: ${m.content}`).join("\n"),
                }),
            });

            if (!res.ok) throw new Error("Failed to generate responses");

            const data = await res.json();
            setSarahResponse(data.sarah.response);
            setZombieResponse(data.zombie.response);
            setSarahDelay(data.sarah.delayMinutes);
            setZombieDelay(data.zombie.delayMinutes);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    const addToConversation = () => {
        if (sarahResponse && zombieResponse) {
            setConversationHistory([
                ...conversationHistory,
                { role: "user", name: userName, content: userMessage },
                { role: "sarah", name: "Sarah M.", content: sarahResponse },
                { role: "zombie", name: zombieName, content: zombieResponse },
            ]);
            setUserMessage("");
            setSarahResponse("");
            setZombieResponse("");
        }
    };

    const resetConversation = () => {
        setConversationHistory([
            { role: "sarah", name: "Sarah M.", content: "Welcome to Cohort #47! 🎉 We're so excited to have you here." },
            { role: "zombie", name: "Amber L.", content: "Yay! So happy you joined us! 🙌" },
        ]);
        setSarahResponse("");
        setZombieResponse("");
        setUserMessage("Nice to meet you, thanks for having me!");
    };

    return (
        <div className="min-h-screen p-6" style={{ background: "linear-gradient(180deg, #1a0a0c 0%, #2d1518 100%)" }}>
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="rounded-xl p-3" style={{ background: GOLD_GRADIENT }}>
                        <Bot className="w-8 h-8" style={{ color: "#4e1f24" }} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Circle Pod AI Test</h1>
                        <p className="text-white/60">Test Sarah & Zombie AI responses with full context</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Left: Input Panel */}
                    <div className="space-y-6">
                        {/* User Setup */}
                        <Card style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(212,175,55,0.2)" }}>
                            <CardHeader>
                                <CardTitle className="text-white">User Setup</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-white/60">User Name</label>
                                        <Input
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                            className="bg-white/5 border-white/10 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-white/60">Zombie Name</label>
                                        <Input
                                            value={zombieName}
                                            onChange={(e) => setZombieName(e.target.value)}
                                            className="bg-white/5 border-white/10 text-white"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Conversation History */}
                        <Card style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(212,175,55,0.2)" }}>
                            <CardHeader>
                                <CardTitle className="text-white flex items-center justify-between">
                                    Conversation History
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={resetConversation}
                                        className="text-white/60 hover:text-white"
                                    >
                                        <RefreshCw className="w-4 h-4 mr-1" />
                                        Reset
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                    {conversationHistory.map((msg, i) => (
                                        <div key={i} className="flex gap-2">
                                            <Badge
                                                variant={msg.role === "sarah" ? "default" : msg.role === "zombie" ? "secondary" : "outline"}
                                                className={
                                                    msg.role === "sarah" ? "bg-gold-500 text-burgundy-900" :
                                                        msg.role === "zombie" ? "bg-purple-500/20 text-purple-400" :
                                                            "bg-emerald-500/20 text-emerald-400"
                                                }
                                            >
                                                {msg.name}
                                            </Badge>
                                            <p className="text-white/80 text-sm flex-1">{msg.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* User Message Input */}
                        <Card style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(212,175,55,0.2)" }}>
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <User className="w-5 h-5 text-emerald-400" />
                                    User Message
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Textarea
                                    value={userMessage}
                                    onChange={(e) => setUserMessage(e.target.value)}
                                    placeholder="Type a message as the user..."
                                    className="bg-white/5 border-white/10 text-white min-h-[100px]"
                                />
                                <Button
                                    onClick={generateResponses}
                                    disabled={loading || !userMessage.trim()}
                                    className="w-full font-bold"
                                    style={{ background: GOLD_GRADIENT, color: "#4e1f24" }}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            Generate AI Responses
                                        </>
                                    )}
                                </Button>
                                {error && <p className="text-red-400 text-sm">{error}</p>}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Output Panel */}
                    <div className="space-y-6">
                        {/* Sarah Response */}
                        <Card style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(212,175,55,0.2)" }}>
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: GOLD_GRADIENT, color: "#4e1f24" }}>
                                        SM
                                    </div>
                                    Sarah M.
                                    {sarahDelay && (
                                        <Badge variant="outline" className="ml-auto text-amber-400 border-amber-400/30">
                                            Delay: {sarahDelay}min
                                        </Badge>
                                    )}
                                </CardTitle>
                                <CardDescription className="text-white/50">Founder & Lead Instructor</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {sarahResponse ? (
                                    <div className="p-4 rounded-xl" style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)" }}>
                                        <p className="text-white/90">{sarahResponse}</p>
                                    </div>
                                ) : (
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-white/30 italic">
                                        Sarah's response will appear here...
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Zombie Response */}
                        <Card style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(212,175,55,0.2)" }}>
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-sm font-bold text-purple-400">
                                        {zombieName.charAt(0)}
                                    </div>
                                    {zombieName}
                                    {zombieDelay && (
                                        <Badge variant="outline" className="ml-auto text-purple-400 border-purple-400/30">
                                            Delay: {zombieDelay}min
                                        </Badge>
                                    )}
                                </CardTitle>
                                <CardDescription className="text-white/50">Fellow Student (Day 5)</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {zombieResponse ? (
                                    <div className="p-4 rounded-xl" style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}>
                                        <p className="text-white/90">{zombieResponse}</p>
                                    </div>
                                ) : (
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-white/30 italic">
                                        Zombie's response will appear here...
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Add to Conversation */}
                        {sarahResponse && zombieResponse && (
                            <Button
                                onClick={addToConversation}
                                variant="outline"
                                className="w-full border-gold-500/30 text-gold-400 hover:bg-gold-500/10"
                            >
                                <Send className="w-4 h-4 mr-2" />
                                Add to Conversation & Continue
                            </Button>
                        )}

                        {/* Model Info */}
                        <Card style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.05)" }}>
                            <CardContent className="pt-4">
                                <div className="flex items-center justify-between text-sm text-white/40">
                                    <span>Model: claude-haiku-4-5-20251001</span>
                                    <span>Sarah: 15-60min | Zombie: 60-180min</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
