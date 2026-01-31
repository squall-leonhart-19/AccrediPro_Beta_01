"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
    Plus, MessageSquare, ChevronLeft, ChevronRight, Send,
    Loader2, Search, Filter, HelpCircle, FileText, CreditCard,
    Cpu, GraduationCap, X, Paperclip, CheckCircle2, AlertCircle,
    AlertTriangle, Shield, Clock, UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Types
type Ticket = {
    id: string;
    ticketNumber: number;
    subject: string;
    status: string;
    category: string;
    updatedAt: string;
    createdAt: string;
    messages: {
        id: string;
        content: string;
        isFromCustomer: boolean;
        createdAt: string;
    }[];
};

const CATEGORIES = [
    { id: "TECHNICAL", label: "Technical Issue", icon: Cpu, desc: "Login, bugs, or error messages", color: "bg-blue-100 text-blue-700", department: "Technical Support Team", responseTime: "24-48 hours" },
    { id: "BILLING", label: "Billing & Payments", icon: CreditCard, desc: "Invoices or payment methods", color: "bg-green-100 text-green-700", department: "Accounts & Billing Team", responseTime: "24-48 hours" },
    { id: "COURSE_CONTENT", label: "Course Content", icon: FileText, desc: "Missing videos, lessons, or materials", color: "bg-purple-100 text-purple-700", department: "Academic Affairs Office", responseTime: "24-48 hours" },
    { id: "CERTIFICATES", label: "Certificates", icon: GraduationCap, desc: "Completion, downloads, or verification", color: "bg-amber-100 text-amber-700", department: "Credentialing Board", responseTime: "24-48 hours" },
    { id: "GENERAL", label: "General Inquiry", icon: HelpCircle, desc: "Everything else", color: "bg-slate-100 text-slate-700", department: "Student Success Team", responseTime: "24-48 hours" },
    { id: "REFUND", label: "Refund Request", icon: AlertTriangle, desc: "Request a course refund", color: "bg-red-100 text-red-700", department: "Legal Team & Consumer Affairs Division", responseTime: "5-7 business days", requiresAcknowledgment: true },
];

const REFUND_REASONS = [
    { value: "changed_mind", label: "Changed my mind" },
    { value: "financial", label: "Financial difficulties" },
    { value: "not_as_expected", label: "Course not as expected" },
    { value: "technical_issues", label: "Persistent technical issues" },
    { value: "health_issues", label: "Health issues (proof required)" },
    { value: "duplicate_purchase", label: "Duplicate/accidental purchase" },
    { value: "family_emergency", label: "Family emergency (proof required)" },
    { value: "personal_circumstances", label: "Personal circumstances" },
    { value: "other", label: "Other reason" },
];

export default function StudentSupportPortal() {
    const [view, setView] = useState<"LIST" | "CREATE" | "DETAIL">("LIST");
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    // Create flow state
    const [createStep, setCreateStep] = useState<"CATEGORY" | "DETAILS">("CATEGORY");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    // Refund friction state
    const [policyAcknowledged, setPolicyAcknowledged] = useState(false);
    const [refundReason, setRefundReason] = useState<string>("");
    // Ticket filter state
    const [ticketFilter, setTicketFilter] = useState<"ALL" | "OPEN" | "SOLVED">("ALL");

    // File upload state
    const [attachments, setAttachments] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();

    // --- Queries ---

    const { data: tickets = [], isLoading } = useQuery({
        queryKey: ["student-tickets"],
        queryFn: async () => {
            const res = await fetch("/api/tickets/submit");
            if (!res.ok) throw new Error("Failed to fetch tickets");
            const data = await res.json();
            return data.tickets as Ticket[];
        },
    });

    const { data: activeTicket, isLoading: isLoadingDetail } = useQuery({
        queryKey: ["student-ticket", selectedTicketId],
        queryFn: async () => {
            const res = await fetch(`/api/tickets/submit?id=${selectedTicketId}`);
            if (!res.ok) throw new Error("Failed to fetch ticket");
            const data = await res.json();
            return data.ticket as Ticket;
        },
        enabled: !!selectedTicketId,
    });

    // --- Mutations ---

    const createTicketMutation = useMutation({
        mutationFn: async (data: { subject: string; category: string; message: string }) => {
            const res = await fetch("/api/tickets/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to create ticket");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["student-tickets"] });
            toast.success("Ticket created successfully");
            resetCreateForm();
            setView("LIST");
        },
        onError: () => toast.error("Failed to create ticket"),
    });

    const replyMutation = useMutation({
        mutationFn: async (data: { ticketId: string; message: string }) => {
            const res = await fetch("/api/tickets/reply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to send reply");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["student-ticket", selectedTicketId] });
            toast.success("Reply sent");
            setAttachments([]); // Clear attachments after reply
        },
        onError: () => toast.error("Failed to send reply"),
    });

    // --- Helpers ---

    const resetCreateForm = () => {
        setCreateStep("CATEGORY");
        setSelectedCategory("");
        setAttachments([]);
        setIsUploading(false);
        setPolicyAcknowledged(false);
        setRefundReason("");
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            // Limit to 3 files total
            if (attachments.length + newFiles.length > 3) {
                toast.error("Maximum 3 files allowed");
                return;
            }
            // Limit size 5MB
            const oversized = newFiles.find(f => f.size > 5 * 1024 * 1024);
            if (oversized) {
                toast.error(`File ${oversized.name} exceeds 5MB limit`);
                return;
            }
            setAttachments(prev => [...prev, ...newFiles]);
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const uploadFiles = async (): Promise<string[]> => {
        if (attachments.length === 0) return [];
        setIsUploading(true);
        const uploadedUrls: string[] = [];

        try {
            for (const file of attachments) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("type", "image");

                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) throw new Error("Upload failed");
                const data = await res.json();
                if (data.success) {
                    uploadedUrls.push(data.data.url);
                }
            }
        } catch (error) {
            console.error("Upload error", error);
            toast.error("Failed to upload one or more files");
        } finally {
            setIsUploading(false);
        }
        return uploadedUrls;
    };

    // --- Event Handlers ---

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const subject = formData.get("subject") as string;
        let message = formData.get("message") as string;

        // If refund, prepend the reason to the message
        if (selectedCategory === "REFUND" && refundReason) {
            const reasonLabel = REFUND_REASONS.find(r => r.value === refundReason)?.label || refundReason;
            message = `**Refund Reason:** ${reasonLabel}\n\n${message}`;
        }

        if (attachments.length > 0) {
            const urls = await uploadFiles();
            if (urls.length > 0) {
                message += "\\n\\nAttachments:\\n" + urls.map(url => `[View Attachment](${url})`).join("\\n");
            }
        }

        createTicketMutation.mutate({
            subject: selectedCategory === "REFUND" ? `[REFUND] ${subject}` : subject,
            category: selectedCategory,
            message: message,
        });
    };

    const handleReplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTicketId) return;
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const messageInput = formData.get("message") as string;

        if (!messageInput.trim() && attachments.length === 0) return;

        let finalMessage = messageInput;

        if (attachments.length > 0) {
            const urls = await uploadFiles();
            if (urls.length > 0) {
                finalMessage += "\\n\\nAttachments:\\n" + urls.map(url => `[View Attachment](${url})`).join("\\n");
            }
        }

        replyMutation.mutate({ ticketId: selectedTicketId, message: finalMessage });
        form.reset();
        setAttachments([]);
    };

    // --- Render ---

    // 1. CREATE TICKET VIEW
    if (view === "CREATE") {
        return (
            <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6 animate-fade-in px-4 sm:px-0">
                <Button variant="ghost" onClick={() => { setView("LIST"); resetCreateForm(); }} className="pl-0 hover:bg-transparent hover:text-burgundy-600">
                    <ChevronLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Button>

                {createStep === "CATEGORY" ? (
                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <h1 className="text-2xl font-bold text-slate-900">How can we help you?</h1>
                            <p className="text-slate-500">Select a category to get started</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {CATEGORIES.map((cat) => (
                                <Card
                                    key={cat.id}
                                    className="card-premium cursor-pointer group relative overflow-hidden"
                                    onClick={() => { setSelectedCategory(cat.id); setCreateStep("DETAILS"); }}
                                >
                                    <div className={`absolute top-0 left-0 w-1 h-full ${cat.color.replace('text', 'bg').split(' ')[0]}`} />
                                    <CardContent className="p-6 flex items-start gap-4">
                                        <div className={`p-3 rounded-lg ${cat.color}`}>
                                            <cat.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-800 group-hover:text-burgundy-700">{cat.label}</h3>
                                            <p className="text-sm text-slate-500 mt-1">{cat.desc}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Department Info Card - Full width on top */}
                        {(() => {
                            const cat = CATEGORIES.find(c => c.id === selectedCategory);
                            const isRefund = selectedCategory === "REFUND";
                            return (
                                <Card className={isRefund ? "bg-red-50 border-2 border-red-300" : "bg-blue-50 border-blue-200"}>
                                    <CardContent className="p-4">
                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${isRefund ? "bg-red-200" : "bg-blue-200"}`}>
                                                    <Shield className={`w-5 h-5 ${isRefund ? "text-red-700" : "text-blue-700"}`} />
                                                </div>
                                                <div>
                                                    <p className={`text-xs font-medium ${isRefund ? "text-red-600" : "text-blue-600"}`}>Your request will be handled by:</p>
                                                    <p className={`font-bold ${isRefund ? "text-red-900" : "text-slate-900"}`}>
                                                        {cat?.department || "Student Support"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${isRefund ? "bg-red-200 text-red-800" : "bg-blue-200 text-blue-800"}`}>
                                                <Clock className="w-4 h-4" />
                                                <span className="text-sm font-medium">{cat?.responseTime || "24-48 hours"}</span>
                                            </div>
                                        </div>
                                        {isRefund && (
                                            <p className="text-xs text-red-700 mt-3 flex items-center gap-2 bg-red-100 p-2 rounded">
                                                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                                <span><strong>⚠️ Warning:</strong> All requests are reviewed by our Legal Team. Chargebacks will result in <strong>immediate legal action</strong> and permanent account termination.</span>
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })()}

                        {/* Main Form Card - Full Width */}
                        <Card className="card-premium">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 mr-1" onClick={() => setCreateStep("CATEGORY")}>
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    New {CATEGORIES.find(c => c.id === selectedCategory)?.label} Request
                                </CardTitle>
                                <CardDescription>
                                    Provide as much detail as possible so we can help you faster.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleCreateSubmit} className="space-y-4">
                                    {/* REFUND FRICTION WARNING */}
                                    {selectedCategory === "REFUND" && (
                                        <div className="space-y-4">
                                            {/* Warning Banner */}
                                            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                                                <div className="flex gap-3">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                                            <Shield className="w-5 h-5 text-red-600" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-red-900 mb-1">⚠️ Important: Refund Review Process</h4>
                                                        <p className="text-sm text-red-800 mb-2">
                                                            Refund requests are reviewed by our <strong>Consumer Affairs Division</strong> and require <strong>5-7 business days</strong> for processing.
                                                        </p>
                                                        <ul className="text-xs text-red-700 space-y-1">
                                                            <li>• All refund requests are logged and reviewed by our legal team</li>
                                                            <li>• Refund eligibility is determined by our published policy</li>
                                                            <li>• Chargebacks may result in permanent account suspension</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Alternative Suggestion */}
                                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                                <div className="flex items-start gap-3">
                                                    <UserCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-amber-900 font-medium">Before requesting a refund, have you tried:</p>
                                                        <ul className="text-xs text-amber-800 mt-1 space-y-1">
                                                            <li>• Messaging your coach about your concerns?</li>
                                                            <li>• Checking our FAQ for common issues?</li>
                                                            <li>• Contacting support for technical problems?</li>
                                                        </ul>
                                                        <Link href="/messages" className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-amber-700 hover:text-amber-900">
                                                            <MessageSquare className="w-3 h-3" />
                                                            Message your coach instead
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Reason Dropdown */}
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">Reason for Refund Request *</Label>
                                                <Select value={refundReason} onValueChange={setRefundReason}>
                                                    <SelectTrigger className="border-red-200 focus:ring-red-500">
                                                        <SelectValue placeholder="Select your reason..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {REFUND_REASONS.map((reason) => (
                                                            <SelectItem key={reason.value} value={reason.value}>
                                                                {reason.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label>Subject</Label>
                                        <Input name="subject" placeholder="Brief summary of the issue" required className="text-base" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea
                                            name="message"
                                            placeholder={selectedCategory === "REFUND"
                                                ? "Please explain in detail why you are requesting a refund. Include any relevant information about your attempts to resolve the issue..."
                                                : "Describe what happened, what you expected, and any error messages..."}
                                            className="min-h-[150px]"
                                            required
                                        />
                                    </div>

                                    {/* Policy Acknowledgment for Refunds */}
                                    {selectedCategory === "REFUND" && (
                                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                            <label className="flex items-start gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={policyAcknowledged}
                                                    onChange={(e) => setPolicyAcknowledged(e.target.checked)}
                                                    className="mt-1 h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
                                                />
                                                <div className="text-sm">
                                                    <span className="font-medium text-slate-900">I acknowledge that I have read and understand the </span>
                                                    <a
                                                        href="/refund-policy"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-burgundy-600 hover:text-burgundy-800 underline font-semibold"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        Refund Policy
                                                    </a>
                                                    <span className="font-medium text-slate-900">, and I understand that refund eligibility is subject to review by the Consumer Affairs Division.</span>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        This acknowledgment is required to submit a refund request.
                                                    </p>
                                                </div>
                                            </label>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label className="text-sm text-slate-500">Attachments (Optional)</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {attachments.map((file, idx) => (
                                                <Badge key={idx} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                                                    <span className="max-w-[100px] truncate">{file.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeAttachment(idx)}
                                                        className="hover:bg-slate-200 rounded-full p-0.5"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={attachments.length >= 3}
                                            >
                                                <Paperclip className="w-3 h-3 mr-2" />
                                                Attach File
                                            </Button>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                multiple
                                                accept="image/*,.pdf"
                                                onChange={handleFileSelect}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-400">Supported formats: JPG, PNG, PDF (Max 5MB)</p>
                                    </div>

                                    {/* Error/Status display area if needed */}

                                    <div className="flex justify-end pt-4">
                                        <Button
                                            type="submit"
                                            disabled={
                                                createTicketMutation.isPending ||
                                                isUploading ||
                                                (selectedCategory === "REFUND" && (!policyAcknowledged || !refundReason))
                                            }
                                            className={selectedCategory === "REFUND"
                                                ? "bg-red-600 hover:bg-red-700 text-white min-w-[180px]"
                                                : "bg-burgundy-600 hover:bg-burgundy-700 text-white min-w-[120px]"}
                                        >
                                            {(createTicketMutation.isPending || isUploading) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                            {isUploading ? "Uploading..." : selectedCategory === "REFUND" ? "Submit Refund Request" : "Submit Request"}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        );
    }

    // 2. TICKET DETAIL VIEW
    if (view === "DETAIL" && selectedTicketId) {
        if (isLoadingDetail) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 text-burgundy-600 animate-spin" /></div>;
        const ticket = activeTicket;

        return (
            <div className="h-[calc(100vh-140px)] flex flex-col animate-fade-in px-4 sm:px-0">
                <div className="mb-4">
                    <Button variant="ghost" onClick={() => { setView("LIST"); setSelectedTicketId(null); setAttachments([]); }} className="pl-0 hover:bg-transparent hover:text-burgundy-600">
                        <ChevronLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                    </Button>
                </div>

                {ticket ? (
                    <Card className="flex-1 flex flex-col overflow-hidden card-premium">
                        <div className="p-4 border-b bg-slate-50 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline" className="bg-white">{ticket.category}</Badge>
                                    <Badge className={
                                        ticket.status === "OPEN" ? "bg-green-100 text-green-700 hover:bg-green-100" :
                                            ticket.status === "RESOLVED" ? "bg-purple-100 text-purple-700 hover:bg-purple-100" :
                                                "bg-slate-100 text-slate-700 hover:bg-slate-100"
                                    }>
                                        {ticket.status}
                                    </Badge>
                                </div>
                                <h2 className="text-xl font-bold text-slate-800 line-clamp-1">#{ticket.ticketNumber} - {ticket.subject}</h2>
                                <p className="text-xs text-slate-500 mt-1">
                                    Started {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                                </p>
                            </div>
                        </div>

                        <ScrollArea className="flex-1 p-4 bg-white">
                            <div className="space-y-6 pb-4">
                                {ticket.messages.map((msg) => (
                                    <div key={msg.id} className={`flex gap-3 ${msg.isFromCustomer ? "flex-row-reverse" : ""}`}>
                                        <Avatar className="w-8 h-8 mt-1 border border-slate-100">
                                            <AvatarFallback className={`${msg.isFromCustomer ? "bg-slate-100 text-slate-600" : "bg-burgundy-600 text-white"}`}>
                                                {msg.isFromCustomer ? "ME" : "SP"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${msg.isFromCustomer
                                            ? "bg-burgundy-50 text-burgundy-900 rounded-tr-none border border-burgundy-100"
                                            : "bg-white text-slate-800 rounded-tl-none border border-slate-100"
                                            }`}>
                                            <div className="whitespace-pre-wrap prose prose-sm max-w-none prose-p:my-1 prose-a:text-blue-600 prose-a:underline">
                                                {/* Simple link parsing for attachments */}
                                                {msg.content.split('\\n').map((line, i) => {
                                                    if (line.includes('[View Attachment]')) {
                                                        const match = line.match(/\\[View Attachment\\]\\((.*?)\\)/);
                                                        if (match) return <div key={i} className="mt-2"><a href={match[1]} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline p-2 bg-white/50 rounded border border-black/5 w-fit"><Paperclip className="w-3 h-3" /> View Attachment</a></div>;
                                                    }
                                                    return <span key={i}>{line}<br /></span>;
                                                })}
                                            </div>
                                            <p className="text-[10px] opacity-50 mt-1 text-right">
                                                {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        <div className="p-4 border-t bg-slate-50">
                            {attachments.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {attachments.map((file, idx) => (
                                        <Badge key={idx} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1 bg-white border border-slate-200">
                                            <span className="max-w-[100px] truncate">{file.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeAttachment(idx)}
                                                className="hover:bg-slate-100 rounded-full p-0.5"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                            <form onSubmit={handleReplySubmit} className="flex gap-2 items-end">
                                <div className="flex-1 relative">
                                    <Textarea
                                        name="message"
                                        placeholder="Type your reply..."
                                        className="min-h-[50px] max-h-[150px] resize-none pr-10 bg-white"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                e.currentTarget.form?.requestSubmit();
                                            }
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-2 bottom-2 h-6 w-6 p-0 text-slate-400 hover:text-slate-600"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Paperclip className="w-4 h-4" />
                                    </Button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        multiple
                                        accept="image/*,.pdf"
                                        onChange={handleFileSelect}
                                    />
                                </div>
                                <Button type="submit" disabled={replyMutation.isPending || isUploading} size="icon" className="h-10 w-10 bg-burgundy-600 hover:bg-burgundy-700 shrink-0">
                                    {(replyMutation.isPending || isUploading) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                </Button>
                            </form>
                        </div>
                    </Card>
                ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-slate-500">
                        <AlertCircle className="w-12 h-12 mb-4 text-slate-300" />
                        <h3 className="text-lg font-medium">Ticket not found</h3>
                        <Button variant="link" onClick={() => setView("LIST")}>Return to list</Button>
                    </div>
                )
                }
            </div >
        );
    }

    // 3. LIST VIEW
    return (
        <div className="space-y-4 sm:space-y-6 animate-fade-in px-4 sm:px-0">
            <div className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-burgundy-900 to-burgundy-800 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-xl sm:text-3xl font-bold flex items-center gap-3">
                        Student Support
                    </h1>
                    <p className="text-burgundy-100 mt-2 max-w-md text-sm sm:text-base">
                        Need help with your course, billing, or technical issues? We're here to assist you.
                    </p>
                </div>
                <div className="mt-6 md:mt-0 relative z-10">
                    <Button onClick={() => setView("CREATE")} size="lg" className="bg-gold-500 text-burgundy-950 hover:bg-gold-400 font-bold shadow-lg border-none">
                        <Plus className="w-4 h-4 mr-2" /> Open New Ticket
                    </Button>
                </div>
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-10 -mb-10 blur-xl pointer-events-none" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Card className="card-premium bg-indigo-50/50 border-indigo-100">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold text-slate-700">Support Hours</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-slate-600">
                            <p className="flex items-center gap-2 mb-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Mon-Fri: 9am - 6pm EST</p>
                            <p className="flex items-center gap-2"><Loader2 className="w-4 h-4 text-slate-400" /> Weekends: Limited Support</p>
                        </CardContent>
                    </Card>

                    {/* Need Help? - Private Chat */}
                    <Card className="border border-burgundy-200 bg-gradient-to-br from-burgundy-50 to-white shadow-sm card-premium">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="relative flex-shrink-0">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-burgundy-200 shadow-md">
                                        <img
                                            src="/coaches/sarah-coach.webp"
                                            alt="Coach Sarah"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                // Fallback if image fails
                                                (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Sarah+Coach&background=722F37&color=fff";
                                            }}
                                        />
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900">Need Private Help?</p>
                                    <p className="text-xs text-gray-500">Message your coach directly</p>
                                </div>
                                <Link href="/messages">
                                    <Button size="sm" className="bg-burgundy-600 hover:bg-burgundy-700 text-white shadow-sm h-8 w-8 p-0">
                                        <MessageSquare className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Card className="card-premium min-h-[400px]">
                        <CardHeader className="pb-0 border-b">
                            <div className="flex justify-between items-center mb-3">
                                <CardTitle className="text-lg">Your Tickets</CardTitle>
                                <Badge variant="outline" className="bg-slate-50">{tickets.length} Total</Badge>
                            </div>
                            {/* Filter Tabs */}
                            <div className="flex gap-1 -mb-px">
                                {[
                                    { id: "ALL" as const, label: "All", count: tickets.length },
                                    { id: "OPEN" as const, label: "Open", count: tickets.filter(t => t.status !== "RESOLVED" && t.status !== "CLOSED").length },
                                    { id: "SOLVED" as const, label: "Solved", count: tickets.filter(t => t.status === "RESOLVED" || t.status === "CLOSED").length },
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setTicketFilter(tab.id)}
                                        className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${ticketFilter === tab.id
                                            ? "border-burgundy-600 text-burgundy-700 bg-burgundy-50/50"
                                            : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                                            }`}
                                    >
                                        {tab.label}
                                        <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${ticketFilter === tab.id ? "bg-burgundy-100 text-burgundy-700" : "bg-slate-100 text-slate-500"
                                            }`}>
                                            {tab.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {isLoading ? (
                                <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                                    <Loader2 className="w-8 h-8 mb-4 animate-spin text-slate-300" />
                                    <p>Loading your history...</p>
                                </div>
                            ) : tickets.length === 0 ? (
                                <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                        <MessageSquare className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <h3 className="text-lg font-medium text-slate-700">No tickets yet</h3>
                                    <p className="max-w-xs mx-auto mt-2 mb-6 text-sm">You haven't submitted any support requests. If you need help, we're here!</p>
                                    <Button onClick={() => setView("CREATE")} variant="outline" className="border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50">Create your first ticket</Button>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {tickets
                                        .filter(ticket => {
                                            if (ticketFilter === "ALL") return true;
                                            if (ticketFilter === "OPEN") return ticket.status !== "RESOLVED" && ticket.status !== "CLOSED";
                                            if (ticketFilter === "SOLVED") return ticket.status === "RESOLVED" || ticket.status === "CLOSED";
                                            return true;
                                        })
                                        .map((ticket) => (
                                            <div
                                                key={ticket.id}
                                                className="p-4 hover:bg-slate-50 cursor-pointer transition-colors flex justify-between items-center group"
                                                onClick={() => { setSelectedTicketId(ticket.id); setView("DETAIL"); }}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className={`p-2 rounded-full mt-1 ${ticket.status === 'RESOLVED' ? 'bg-purple-100 text-purple-600' :
                                                        ticket.status === 'NEW' ? 'bg-blue-100 text-blue-600' :
                                                            'bg-green-100 text-green-600'
                                                        }`}>
                                                        {ticket.status === 'RESOLVED' ? <CheckCircle2 className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono text-xs text-slate-400">#{ticket.ticketNumber}</span>
                                                            <h4 className="font-semibold text-slate-800 group-hover:text-burgundy-700 transition-colors">
                                                                {ticket.subject}
                                                            </h4>
                                                        </div>
                                                        <p className="text-sm text-slate-500 line-clamp-1 mt-0.5">
                                                            <span className="font-medium text-slate-600">{CATEGORIES.find(c => c.id === ticket.category)?.label || ticket.category}</span>
                                                            <span className="mx-1">•</span>
                                                            <span>Updated {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <Badge variant="secondary" className={
                                                        ticket.status === "OPEN" ? "bg-green-100 text-green-700 border-green-200" :
                                                            ticket.status === "RESOLVED" ? "bg-purple-100 text-purple-700 border-purple-200" :
                                                                "bg-slate-100 text-slate-600 border-slate-200"
                                                    }>
                                                        {ticket.status}
                                                    </Badge>
                                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
