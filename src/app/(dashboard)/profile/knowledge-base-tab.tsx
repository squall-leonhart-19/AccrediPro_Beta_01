"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Bot,
    Sparkles,
    Save,
    Loader2,
    Info,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface KnowledgeBaseTabProps {
    initialContent: string | null;
}

export function KnowledgeBaseTab({ initialContent }: KnowledgeBaseTabProps) {
    const [content, setContent] = useState(initialContent || "");
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

    const handleSave = async () => {
        setIsSaving(true);
        setSaveStatus("idle");

        try {
            const response = await fetch("/api/user/profile/knowledge", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ knowledgeBase: content }),
            });

            if (!response.ok) throw new Error("Failed to save");

            setSaveStatus("success");
            setTimeout(() => setSaveStatus("idle"), 3000);
        } catch (error) {
            setSaveStatus("error");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Card */}
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100">
                <CardContent className="p-6">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Bot className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                                Mentor AI Knowledge Base
                                <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-0">Beta</Badge>
                            </h2>
                            <p className="text-sm text-gray-600">
                                This content will be used to train your personal AI assistant. When you use "Reply with AI" in chat,
                                it will look here for specific protocols, pricing, or guidelines.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Editor Card */}
            <Card className="card-premium">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-gold-500" />
                            Your Custom Knowledge
                        </h3>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`min-w-[100px] transition-all ${saveStatus === "success" ? "bg-green-600 hover:bg-green-700" : "bg-burgundy-600 hover:bg-burgundy-700"
                                }`}
                        >
                            {isSaving ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                            ) : saveStatus === "success" ? (
                                <><CheckCircle2 className="w-4 h-4 mr-2" /> Saved</>
                            ) : (
                                <><Save className="w-4 h-4 mr-2" /> Save Changes</>
                            )}
                        </Button>
                    </div>

                    <Alert className="mb-6 bg-blue-50 text-blue-800 border-blue-100">
                        <Info className="h-4 w-4 text-blue-600" />
                        <AlertTitle>Tips for best results</AlertTitle>
                        <AlertDescription className="text-xs mt-1 space-y-1">
                            <p>• Use a Q&A format (e.g., "Q: What is your cancellation policy? A: ...")</p>
                            <p>• Paste your standard protocols or clinic guidelines directly.</p>
                            <p>• Include pricing tiers and specific offering details.</p>
                        </AlertDescription>
                    </Alert>

                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Paste your knowledge base here...
            
Example:
Q: What tests do you recommend for gut issues?
A: We typically start with the GI-MAP stool test...

Q: How much is the 3-month program?
A: The investment for the 12-week Transformation Protocol is $1,497..."
                        className="min-h-[400px] font-mono text-sm leading-relaxed p-4"
                    />

                    {saveStatus === "error" && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" /> Failed to save changes. Please try again.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
