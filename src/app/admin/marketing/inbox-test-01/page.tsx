"use client";

import { useState } from "react";
import { Loader2, Mail, Send, Eye, Inbox, Tag, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import { BUYER_NURTURING_SEQUENCE } from "@/lib/buyer-nurturing-sequence";

// Group emails by phase
const groupByPhase = (phase: string) => BUYER_NURTURING_SEQUENCE.filter(e => e.phase === phase).map(e => ({
    id: e.id,
    name: `Day ${e.day}`,
    day: e.day,
    subject: e.subject,
    preheader: e.preheader,
    content: e.content,
}));

const ONBOARDING = groupByPhase('onboarding');
const VALUE = groupByPhase('value');
const PRO_ACCELERATOR = groupByPhase('pro_accelerator');
const DFY_STACK = groupByPhase('dfy_stack');
const CASE_STUDIES = groupByPhase('case_studies');
const NURTURE = groupByPhase('nurture');

export default function InboxTestPage() {
    const [testEmail, setTestEmail] = useState("at.seed019@gmail.com");
    const [sending, setSending] = useState<string | null>(null);
    const [results, setResults] = useState<Record<string, "inbox" | "promotion">>({});
    const [previewEmail, setPreviewEmail] = useState<any>(null);
    const [expanded, setExpanded] = useState<Set<string>>(new Set(["onboarding"]));

    const sendEmail = async (email: any) => {
        setSending(email.id);
        try {
            const html = `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
                <div style="display:none;">${email.preheader}</div>
                <p style="line-height:1.6;color:#333;">${email.content.replace(/\{\{firstName\}\}/g, "Friend")}</p>
            </body></html>`;

            await fetch("/api/admin/marketing/send-nurturing-test", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: testEmail,
                    subject: email.subject,
                    content: email.content.replace(/\{\{firstName\}\}/g, "Friend"),
                    html,
                    emailId: email.id,
                }),
            });
        } catch (err) {
            console.error(err);
        } finally {
            setSending(null);
        }
    };

    const sendAll = async (emails: any[]) => {
        for (const email of emails) {
            await sendEmail(email);
            await new Promise(r => setTimeout(r, 1000));
        }
    };

    const mark = (id: string, result: "inbox" | "promotion") => setResults(prev => ({ ...prev, [id]: result }));
    const toggle = (section: string) => setExpanded(prev => {
        const next = new Set(prev);
        next.has(section) ? next.delete(section) : next.add(section);
        return next;
    });

    const inboxCount = Object.values(results).filter(r => r === "inbox").length;
    const promoCount = Object.values(results).filter(r => r === "promotion").length;

    const ALL_EMAILS = [...ONBOARDING, ...VALUE, ...PRO_ACCELERATOR, ...DFY_STACK, ...CASE_STUDIES, ...NURTURE];
    const [sendingAll, setSendingAll] = useState(false);
    const [progress, setProgress] = useState(0);

    const sendAllEmails = async () => {
        setSendingAll(true);
        setProgress(0);
        for (let i = 0; i < ALL_EMAILS.length; i++) {
            await sendEmail(ALL_EMAILS[i]);
            setProgress(i + 1);
            await new Promise(r => setTimeout(r, 1000));
        }
        setSendingAll(false);
    };

    const Row = ({ email }: { email: any }) => {
        const result = results[email.id];
        return (
            <div className={cn("bg-white rounded-lg p-3 mb-2 border-l-4", result === "inbox" && "border-l-green-500 bg-green-50", result === "promotion" && "border-l-orange-500 bg-orange-50", !result && "border-l-gray-200")}>
                <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 font-mono">{email.name}</span>
                            <div className="font-medium text-sm truncate">{email.subject}</div>
                        </div>
                        <div className="text-xs text-gray-400 italic">{email.preheader}</div>
                    </div>
                    <div className="flex items-center gap-1">
                        {result === "inbox" && <span className="text-xs px-2 py-0.5 bg-green-500 text-white rounded-full">✅</span>}
                        {result === "promotion" && <span className="text-xs px-2 py-0.5 bg-orange-500 text-white rounded-full">📦</span>}
                        {!result && (
                            <>
                                <Button size="sm" variant="outline" onClick={() => mark(email.id, "inbox")} className="h-7 px-2 border-green-500 text-green-700"><Inbox className="w-3 h-3" /></Button>
                                <Button size="sm" variant="outline" onClick={() => mark(email.id, "promotion")} className="h-7 px-2 border-orange-500 text-orange-700"><Tag className="w-3 h-3" /></Button>
                            </>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => setPreviewEmail(email)} className="h-7 w-7 p-0"><Eye className="w-3 h-3" /></Button>
                        <Button size="sm" onClick={() => sendEmail(email)} disabled={sending === email.id} className="h-7 w-7 p-0">
                            {sending === email.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mail className="w-3 h-3" />}
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    const SectionHeader = ({ id, title, emails, color }: { id: string; title: string; emails: any[]; color: string }) => (
        <button onClick={() => toggle(id)} className={`w-full flex items-center justify-between ${color} rounded-lg p-3 mb-2`}>
            <div className="flex items-center gap-2">
                {expanded.has(id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <span className="font-bold">{title} ({emails.length})</span>
            </div>
            <Button size="sm" onClick={(e) => { e.stopPropagation(); sendAll(emails); }} className="bg-gray-800 text-xs">
                <Send className="w-3 h-3 mr-1" /> Send All
            </Button>
        </button>
    );

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">📧 Hormozi Value Stack Sequence Test</h1>

            <div className="bg-white rounded-lg shadow p-4 mb-4">
                <Input type="email" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} className="mb-3" />

                {/* SEND ALL BUTTON */}
                <Button
                    onClick={sendAllEmails}
                    disabled={sendingAll}
                    className="w-full mb-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3"
                >
                    {sendingAll ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending {progress}/{ALL_EMAILS.length}...</>
                    ) : (
                        <><Send className="w-4 h-4 mr-2" /> 🚀 SEND ALL 21 EMAILS</>
                    )}
                </Button>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-100 rounded p-3 text-center"><p className="text-xl font-bold text-green-700">{inboxCount}</p><p className="text-xs">Inbox ✅</p></div>
                    <div className="bg-orange-100 rounded p-3 text-center"><p className="text-xl font-bold text-orange-700">{promoCount}</p><p className="text-xs">Promo 📦</p></div>
                </div>
            </div>

            {/* ONBOARDING */}
            <div className="mb-2">
                <SectionHeader id="onboarding" title="📍 Phase 1: Onboarding (Days 1-7)" emails={ONBOARDING} color="bg-blue-100" />
                {expanded.has("onboarding") && ONBOARDING.map(e => <Row key={e.id} email={e} />)}
            </div>

            {/* VALUE */}
            <div className="mb-2">
                <SectionHeader id="value" title="📚 Phase 2: Value (Days 10-11)" emails={VALUE} color="bg-purple-100" />
                {expanded.has("value") && VALUE.map(e => <Row key={e.id} email={e} />)}
            </div>

            {/* PRO ACCELERATOR VALUE STACK */}
            <div className="mb-2">
                <SectionHeader id="pro" title="⚡ Pro Accelerator Stack (Days 12-14) - $297" emails={PRO_ACCELERATOR} color="bg-amber-100" />
                {expanded.has("pro") && PRO_ACCELERATOR.map(e => <Row key={e.id} email={e} />)}
            </div>

            {/* DFY VALUE STACK */}
            <div className="mb-2">
                <SectionHeader id="dfy" title="🛠️ DFY Business Kit Stack (Days 16-21) - $397" emails={DFY_STACK} color="bg-rose-100" />
                {expanded.has("dfy") && DFY_STACK.map(e => <Row key={e.id} email={e} />)}
            </div>

            {/* CASE STUDIES */}
            <div className="mb-2">
                <SectionHeader id="cases" title="🎯 Case Studies (Days 23-28)" emails={CASE_STUDIES} color="bg-indigo-100" />
                {expanded.has("cases") && CASE_STUDIES.map(e => <Row key={e.id} email={e} />)}
            </div>

            {/* NURTURE */}
            <div className="mb-2">
                <SectionHeader id="nurture" title="💬 Nurture & Referral (Days 30-35)" emails={NURTURE} color="bg-teal-100" />
                {expanded.has("nurture") && NURTURE.map(e => <Row key={e.id} email={e} />)}
            </div>

            <Dialog open={!!previewEmail} onOpenChange={() => setPreviewEmail(null)}>
                <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{previewEmail?.subject}</DialogTitle>
                    </DialogHeader>
                    <div className="text-xs text-gray-500 italic mb-2">Preheader: {previewEmail?.preheader}</div>
                    <div className="bg-gray-50 rounded p-4 text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: previewEmail?.content?.replace(/\{\{firstName\}\}/g, "Friend") || "" }} />
                </DialogContent>
            </Dialog>
        </div>
    );
}
