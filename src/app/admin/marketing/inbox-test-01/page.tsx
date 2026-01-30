"use client";

import { useState } from "react";
import { Loader2, Mail, Send, Eye, Inbox, Tag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

// Email with 3 variants for A/B testing
interface EmailVariant {
    id: string;
    subject: string;
    notes: string; // Why this might work
}

interface NurturingEmail {
    id: string;
    name: string;
    day: number;
    sequence: string;
    content: string;
    variants: EmailVariant[];
}

// Story Day 1 with 3 subject line variants
const STORY_DAY1_VARIANTS: NurturingEmail = {
    id: "story_day1",
    name: "Story Day 1: Kitchen Floor",
    day: 1,
    sequence: "Story",
    content: `{{firstName}},

Can I tell you a little bit of my story?

A few years ago, I was a single mom trying to keep everything together.

By day, I was working long hours, giving clients the same generic "eat better, drink water, exercise" advice I'd seen online. By night, I was collapsing on the couch, wondering how I could ever provide the kind of life my child deserved.

Inside, I felt like a fraud.

I loved helping people, but when clients came to me with real struggles — chronic fatigue, brain fog, autoimmune symptoms — I didn't know what to do. I could see the disappointment in their eyes when I said, "You should ask your doctor about that."

Meanwhile, my own health was unraveling. Stress, exhaustion, and the heavy weight of "doing it all" as a single mom. I remember standing in the kitchen one night, staring at the bills, fighting back tears, and thinking: "There has to be more than this. There has to be a better way." 💔

That's when I found integrative and functional medicine.

It was like someone handed me the missing puzzle pieces: finally understanding how to look at root causes, how to make sense of labs, how to design real protocols that worked.

But more than that — it gave me back my hope.

And now? I get to live what once felt impossible: helping people transform their health at the root level, while being present for my child and proud of the work I do. 🌱

That's why I'm so passionate about this path — because if I could step from survival into purpose, I know you can too.

With love,

Sarah 💕`,
    variants: [
        {
            id: "v1",
            subject: "Re: can I share something personal?",
            notes: "Re: prefix + personal/intimate phrasing - mimics reply thread"
        },
        {
            id: "v2",
            subject: "something I haven't told anyone",
            notes: "Mystery/curiosity - lowercase, no Re: - tests if Re: is the key"
        },
        {
            id: "v3",
            subject: "Re: quick question about your journey",
            notes: "Re: + question format - conversational, implies existing relationship"
        }
    ]
};

export default function InboxTestBuyerNurturingPage() {
    const [testEmail, setTestEmail] = useState("at.seed019@gmail.com");
    const [sending, setSending] = useState<string | null>(null);
    const [sendingAll, setSendingAll] = useState(false);
    const [results, setResults] = useState<Record<string, { sent: boolean; placement?: "inbox" | "promotion" }>>({});
    const [previewVariant, setPreviewVariant] = useState<{ variant: EmailVariant; content: string } | null>(null);

    const email = STORY_DAY1_VARIANTS;

    const sendVariant = async (variant: EmailVariant) => {
        const key = `${email.id}_${variant.id}`;
        setSending(key);

        try {
            const res = await fetch("/api/admin/marketing/send-nurturing-test", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: testEmail,
                    subject: variant.subject,
                    content: email.content.replace(/\{\{firstName\}\}/g, "Friend"),
                    emailId: key,
                }),
            });

            if (res.ok) {
                setResults(prev => ({ ...prev, [key]: { sent: true } }));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSending(null);
        }
    };

    const sendAllVariants = async () => {
        setSendingAll(true);

        for (const variant of email.variants) {
            await sendVariant(variant);
            await new Promise(r => setTimeout(r, 3000)); // 3s delay between variants
        }

        setSendingAll(false);
    };

    const markPlacement = (variantId: string, placement: "inbox" | "promotion") => {
        const key = `${email.id}_${variantId}`;
        setResults(prev => ({
            ...prev,
            [key]: { ...prev[key], sent: true, placement }
        }));
    };

    const getVariantResult = (variantId: string) => {
        return results[`${email.id}_${variantId}`];
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">📧 Buyer Nurturing A/B Testing</h1>
                <p className="text-gray-600 mt-2">Test which subject lines land in Primary Inbox vs Promotions</p>
            </div>

            {/* Test Email Input */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Gmail Test Address
                </label>
                <div className="flex gap-4">
                    <Input
                        type="email"
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                        placeholder="your@gmail.com"
                        className="flex-1"
                    />
                    <Button
                        onClick={sendAllVariants}
                        disabled={sendingAll || !testEmail}
                        className="bg-purple-600 hover:bg-purple-700"
                    >
                        {sendingAll ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4 mr-2" />
                                Send All 3 Variants
                            </>
                        )}
                    </Button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                    Sends with 3-second delays. Check your Gmail to see which lands in Inbox vs Promotions.
                </p>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/20">
                            {email.sequence}
                        </span>
                        <span className="text-sm opacity-80">Day {email.day}</span>
                    </div>
                    <h2 className="text-2xl font-bold">{email.name}</h2>
                </div>

                {/* Variants */}
                <div className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        🧪 3 Subject Line Variants
                    </h3>

                    {email.variants.map((variant, index) => {
                        const result = getVariantResult(variant.id);
                        const key = `${email.id}_${variant.id}`;

                        return (
                            <div
                                key={variant.id}
                                className={`border-2 rounded-lg p-5 transition-all ${result?.placement === "inbox"
                                        ? "border-green-500 bg-green-50"
                                        : result?.placement === "promotion"
                                            ? "border-orange-500 bg-orange-50"
                                            : result?.sent
                                                ? "border-blue-300 bg-blue-50"
                                                : "border-gray-200"
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-sm font-bold text-purple-600">
                                                Variant {index + 1}
                                            </span>
                                            {result?.placement === "inbox" && (
                                                <span className="text-xs px-2 py-0.5 bg-green-500 text-white rounded-full flex items-center gap-1">
                                                    <Check className="w-3 h-3" /> PRIMARY INBOX
                                                </span>
                                            )}
                                            {result?.placement === "promotion" && (
                                                <span className="text-xs px-2 py-0.5 bg-orange-500 text-white rounded-full flex items-center gap-1">
                                                    <Tag className="w-3 h-3" /> PROMOTIONS
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {variant.subject}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            💡 {variant.notes}
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        {/* Send Button */}
                                        <Button
                                            size="sm"
                                            onClick={() => sendVariant(variant)}
                                            disabled={sending === key || sendingAll}
                                            className="w-24"
                                        >
                                            {sending === key ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : result?.sent ? (
                                                <>
                                                    <Check className="w-4 h-4 mr-1" /> Sent
                                                </>
                                            ) : (
                                                <>
                                                    <Mail className="w-4 h-4 mr-1" /> Send
                                                </>
                                            )}
                                        </Button>

                                        {/* Preview Button */}
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setPreviewVariant({ variant, content: email.content })}
                                            className="w-24"
                                        >
                                            <Eye className="w-4 h-4 mr-1" /> View
                                        </Button>
                                    </div>
                                </div>

                                {/* Placement Buttons - show after sent */}
                                {result?.sent && !result?.placement && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <p className="text-sm font-medium text-gray-700 mb-2">
                                            Where did this land in Gmail?
                                        </p>
                                        <div className="flex gap-3">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => markPlacement(variant.id, "inbox")}
                                                className="flex-1 border-green-500 text-green-700 hover:bg-green-50"
                                            >
                                                <Inbox className="w-4 h-4 mr-2" />
                                                Primary Inbox ✅
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => markPlacement(variant.id, "promotion")}
                                                className="flex-1 border-orange-500 text-orange-700 hover:bg-orange-50"
                                            >
                                                <Tag className="w-4 h-4 mr-2" />
                                                Promotions 📦
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Results Summary */}
                {Object.values(results).some(r => r.placement) && (
                    <div className="bg-gray-50 p-6 border-t">
                        <h3 className="font-semibold text-gray-900 mb-3">📊 Results Summary</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-green-100 rounded-lg p-4 text-center">
                                <p className="text-3xl font-bold text-green-700">
                                    {Object.values(results).filter(r => r.placement === "inbox").length}
                                </p>
                                <p className="text-sm text-green-600">Primary Inbox</p>
                            </div>
                            <div className="bg-orange-100 rounded-lg p-4 text-center">
                                <p className="text-3xl font-bold text-orange-700">
                                    {Object.values(results).filter(r => r.placement === "promotion").length}
                                </p>
                                <p className="text-sm text-orange-600">Promotions</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Preview Modal */}
            <Dialog open={!!previewVariant} onOpenChange={() => setPreviewVariant(null)}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Email Preview</DialogTitle>
                    </DialogHeader>
                    {previewVariant && (
                        <div className="space-y-4">
                            <div className="bg-purple-50 rounded-lg p-4">
                                <p className="text-sm font-medium text-gray-500">Subject Line</p>
                                <p className="text-xl font-bold text-purple-700">{previewVariant.variant.subject}</p>
                                <p className="text-sm text-gray-500 mt-1">💡 {previewVariant.variant.notes}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-2">Email Body</p>
                                <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-sm font-sans">
                                    {previewVariant.content.replace(/\{\{firstName\}\}/g, "Friend")}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
