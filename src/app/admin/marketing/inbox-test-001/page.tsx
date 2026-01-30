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

// Group emails by phase - include CTA info
const groupByPhase = (phase: string) => BUYER_NURTURING_SEQUENCE.filter(e => e.phase === phase).map(e => ({
    id: e.id,
    name: `Day ${e.day}`,
    day: e.day,
    subject: e.subject,
    preheader: e.preheader,
    content: e.content,
    hasCta: e.hasCta,
    ctaText: e.ctaText,
    ctaLink: e.ctaLink,
}));

const ONBOARDING = groupByPhase('onboarding');
const VALUE = groupByPhase('value');
const PRO_ACCELERATOR = groupByPhase('pro_accelerator');
const DFY_STACK = groupByPhase('dfy_stack');
const CASE_STUDIES = groupByPhase('case_studies');
const NURTURE = groupByPhase('nurture');

// Generate branded HTML with AISI styling
function generateBrandedHTML(
    content: string,
    preheader: string,
    firstName: string,
    hasCta?: boolean,
    ctaText?: string,
    ctaLink?: string
): string {
    const personalizedContent = content.replace(/\{\{firstName\}\}/g, firstName);

    // Format paragraphs
    const formattedContent = personalizedContent
        .split('\n\n')
        .map((p: string) => `<p style="color: #333; font-size: 16px; line-height: 1.7; margin: 0 0 16px 0;">${p.replace(/\n/g, '<br>')}</p>`)
        .join('');

    // CTA Button HTML
    const ctaButtonHTML = hasCta && ctaLink ? `
        <div style="text-align: center; margin: 30px 0;">
            <a href="${ctaLink}" style="display: inline-block; background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); color: #D4AF37; font-weight: bold; font-size: 16px; text-decoration: none; padding: 16px 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(114,47,55,0.3);">
                ${ctaText || 'Learn More'}
            </a>
        </div>
    ` : '';

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5;">
    <div style="display:none;font-size:1px;color:#f5f5f5;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</div>
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); padding: 40px 30px; text-align: center;">
                <h1 style="color: #D4AF37; margin: 0; font-size: 26px; font-family: Georgia, serif;">AccrediPro International</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">Standards Institute</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
                ${formattedContent}
                ${ctaButtonHTML}
            </div>
            
            <!-- Sarah Signature -->
            <div style="padding: 0 30px 30px 30px; border-top: 1px solid #eee;">
                <div style="margin-top: 20px;">
                    <p style="margin: 0 0 5px 0; font-weight: bold; color: #722F37;">Sarah Mitchell</p>
                    <p style="margin: 0 0 3px 0; font-size: 13px; color: #666;">Lead Certification Coach</p>
                    <p style="margin: 0; font-size: 13px; color: #888; font-style: italic;">AccrediPro International Standards Institute</p>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #eee;">
                <p style="margin: 0 0 3px 0; color: #722F37; font-size: 12px; font-weight: bold;">AccrediPro International Standards Institute</p>
                <p style="margin: 0 0 3px 0; color: #999; font-size: 11px;">(At Rockefeller Center)</p>
                <p style="margin: 0 0 3px 0; color: #999; font-size: 11px;">1270 Avenue of the Americas, 7th Floor - Suite 1182</p>
                <p style="margin: 0 0 3px 0; color: #999; font-size: 11px;">New York, NY 10020</p>
                <p style="margin: 0 0 15px 0; color: #999; font-size: 11px;">United States</p>
                <p style="margin: 0; color: #bbb; font-size: 10px; font-style: italic;">Veritas Et Excellentia — Truth and Excellence in Education</p>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="margin: 0; color: #bbb; font-size: 10px;">
                        This email is from AccrediPro International Standards Institute.<br/>
                        You're receiving this because you enrolled in our certification program.
                    </p>
                    <p style="margin: 10px 0 0 0;">
                        <a href="https://learn.accredipro.academy/unsubscribe" style="color: #999; font-size: 10px; text-decoration: underline;">Unsubscribe</a>
                        <span style="color: #ccc; margin: 0 8px;">|</span>
                        <a href="https://learn.accredipro.academy/my-courses" style="color: #999; font-size: 10px; text-decoration: underline;">My Dashboard</a>
                    </p>
                </div>
            </div>
            
        </div>
    </div>
</body>
</html>`
}

export default function BrandedInboxTestPage() {
    const [testEmail, setTestEmail] = useState("at.seed019@gmail.com");
    const [firstName, setFirstName] = useState("Jennifer");
    const [sending, setSending] = useState<string | null>(null);
    const [results, setResults] = useState<Record<string, "inbox" | "promotion">>({});
    const [previewEmail, setPreviewEmail] = useState<any>(null);
    const [expanded, setExpanded] = useState<Set<string>>(new Set(["onboarding"]));

    const sendEmail = async (email: any) => {
        setSending(email.id);
        try {
            const content = email.content.replace(/\{\{firstName\}\}/g, firstName);
            const html = generateBrandedHTML(email.content, email.preheader, firstName, email.hasCta, email.ctaText, email.ctaLink);

            await fetch("/api/admin/marketing/send-nurturing-test", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: testEmail,
                    subject: email.subject,
                    content,
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
            <div className={cn(
                "flex items-center justify-between p-3 rounded-lg border mb-2",
                result === "inbox" && "bg-green-50 border-green-200",
                result === "promotion" && "bg-orange-50 border-orange-200",
                !result && "bg-white border-gray-200"
            )}>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-12">{email.name}</span>
                    <span className="font-mono text-sm">{email.subject}</span>
                </div>
                <div className="flex items-center gap-2">
                    {result === "inbox" && <span className="text-xs px-2 py-0.5 bg-green-500 text-white rounded-full">✅ INBOX</span>}
                    {result === "promotion" && <span className="text-xs px-2 py-0.5 bg-orange-500 text-white rounded-full">📦 PROMO</span>}
                    {!result && (
                        <>
                            <Button size="sm" variant="outline" onClick={() => mark(email.id, "inbox")} className="h-7 px-2 border-green-500 text-green-700 hover:bg-green-50"><Inbox className="w-3 h-3" /></Button>
                            <Button size="sm" variant="outline" onClick={() => mark(email.id, "promotion")} className="h-7 px-2 border-orange-500 text-orange-700 hover:bg-orange-50"><Tag className="w-3 h-3" /></Button>
                        </>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => setPreviewEmail(email)} className="h-7 w-7 p-0"><Eye className="w-3 h-3" /></Button>
                    <Button size="sm" onClick={() => sendEmail(email)} disabled={sending === email.id} className="h-7 w-7 p-0">
                        {sending === email.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mail className="w-3 h-3" />}
                    </Button>
                </div>
            </div>
        );
    };

    const Section = ({ title, emails, id }: { title: string; emails: any[]; id: string }) => {
        const isOpen = expanded.has(id);
        const sectionInbox = emails.filter(e => results[e.id] === "inbox").length;
        const sectionPromo = emails.filter(e => results[e.id] === "promotion").length;
        return (
            <div className="mb-4">
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg cursor-pointer" onClick={() => toggle(id)}>
                    <div className="flex items-center gap-2">
                        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        <span className="font-semibold">{title}</span>
                        <span className="text-xs text-gray-500">({emails.length} emails)</span>
                        {sectionInbox > 0 && <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">{sectionInbox}✅</span>}
                        {sectionPromo > 0 && <span className="text-xs bg-orange-500 text-white px-1.5 py-0.5 rounded-full">{sectionPromo}📦</span>}
                    </div>
                    <Button size="sm" onClick={(e) => { e.stopPropagation(); sendAll(emails); }} className="h-7">
                        <Send className="w-3 h-3 mr-1" /> Send All
                    </Button>
                </div>
                {isOpen && <div className="mt-2 pl-6">{emails.map(e => <Row key={e.id} email={e} />)}</div>}
            </div>
        );
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-2">🏛️ Branded AISI Email Test</h1>
            <p className="text-gray-500 mb-4">Full branding: Header, Signature, Rockefeller, Unsubscribe</p>

            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Test Email</label>
                        <Input type="email" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">First Name</label>
                        <Input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                </div>
                <Button onClick={sendAllEmails} disabled={sendingAll} className="w-full bg-purple-600 hover:bg-purple-700 mb-3">
                    {sendingAll ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending {progress}/{ALL_EMAILS.length}</> : <><Send className="w-4 h-4 mr-2" /> Send All {ALL_EMAILS.length} Emails</>}
                </Button>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-100 rounded p-3 text-center"><p className="text-xl font-bold text-green-700">{inboxCount}</p><p className="text-xs">Inbox ✅</p></div>
                    <div className="bg-orange-100 rounded p-3 text-center"><p className="text-xl font-bold text-orange-700">{promoCount}</p><p className="text-xs">Promo 📦</p></div>
                </div>
            </div>

            <Section title="Phase 1: Onboarding (Days 1-7)" emails={ONBOARDING} id="onboarding" />
            <Section title="Phase 2: Value (Days 10-11)" emails={VALUE} id="value" />
            <Section title="Phase 3: Pro Accelerator (Days 12-14)" emails={PRO_ACCELERATOR} id="pro_accelerator" />
            <Section title="Phase 4: DFY Business Kit (Days 16-21)" emails={DFY_STACK} id="dfy_stack" />
            <Section title="Phase 5: Case Studies (Days 23-28)" emails={CASE_STUDIES} id="case_studies" />
            <Section title="Phase 6: Nurture (Days 30-35)" emails={NURTURE} id="nurture" />

            <Dialog open={!!previewEmail} onOpenChange={() => setPreviewEmail(null)}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
                    <DialogHeader>
                        <DialogTitle>{previewEmail?.subject}</DialogTitle>
                    </DialogHeader>
                    {previewEmail && (
                        <div className="mt-4" dangerouslySetInnerHTML={{ __html: generateBrandedHTML(previewEmail.content, previewEmail.preheader, firstName, previewEmail.hasCta, previewEmail.ctaText, previewEmail.ctaLink) }} />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
