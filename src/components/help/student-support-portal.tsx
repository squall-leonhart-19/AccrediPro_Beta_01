"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
    Plus, MessageSquare, ChevronLeft, ChevronRight, Send,
    Loader2, Search, Filter, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

export default function StudentSupportPortal() {
    const [view, setView] = useState<"LIST" | "CREATE" | "DETAIL">("LIST");
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
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
            // Re- using the admin endpoint but simplified validation
            // Or better: fetch from /api/tickets/submit?id=... but the current GET returns all.
            // For now, let's filter from the list if possible, OR implement a GET /api/tickets/submit/[id]
            // Actually, standard pattern is to have a detail endpoint. 
            // Let's assume we can fetch all and filter client side for MVP, 
            // OR better, create the detail endpoint. 
            // Wait, the Admin API is structured differently.
            // Let's use filter from 'tickets' for now since list is small for students.
            // NOTE: This assumes 'tickets' contains messages. The GET /api/tickets/submit returns only 1 message (preview).
            // We need a way to get full details.
            // I'll assume we need to update GET /api/tickets/submit?id=XYZ or similar. 
            // Let's implement a quick fetcher that reuses the logic or add a query param.
            // For now, let's try to hit the admin endpoint? No, insecure.
            // I will implement a fetcher that uses a new endpoint or query param.
            // Let's use a new client-side fetch helper that calls a new route or modified route.
            // Checking existing routes... access to /api/tickets/submit is safe.
            // I will modify /api/tickets/submit/route.ts to handle ?id= param to return full details.

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
            setView("LIST");
        },
        onError: () => toast.error("Failed to create ticket"),
    });

    const replyMutation = useMutation({
        mutationFn: async (data: { ticketId: string; message: string }) => {
            // Students reply via... we need an endpoint.
            // Admin uses /api/admin/tickets/[id] (POST)
            // We should expose a student reply endpoint. /api/tickets/[ticketNumber]/reply?
            // Or reuse /api/tickets/submit with a `ticketId` param?
            // Let's assume we create/use /api/tickets/reply route.
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
        },
        onError: () => toast.error("Failed to send reply"),
    });

    // --- Event Handlers ---

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        createTicketMutation.mutate({
            subject: formData.get("subject") as string,
            category: formData.get("category") as string,
            message: formData.get("message") as string,
        });
    };

    const handleReplySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTicketId) return;
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const message = formData.get("message") as string;
        if (!message.trim()) return;

        replyMutation.mutate({ ticketId: selectedTicketId, message });
        form.reset();
    };

    // --- Render ---

    if (view === "CREATE") {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <Button variant="ghost" onClick={() => setView("LIST")} className="pl-0">
                    <ChevronLeft className="w-4 h-4 mr-2" /> Back to Tickets
                </Button>
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Support Ticket</CardTitle>
                        <CardDescription>
                            We usually respond within 24 hours.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select name="category" defaultValue="GENERAL">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="GENERAL">General Inquiry</SelectItem>
                                        <SelectItem value="TECHNICAL">Technical Issue</SelectItem>
                                        <SelectItem value="BILLING">Billing & Payments</SelectItem>
                                        <SelectItem value="COURSE_CONTENT">Course Content</SelectItem>
                                        <SelectItem value="CERTIFICATES">Certificates</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Subject</Label>
                                <Input name="subject" placeholder="Brief summary of your issue" required />
                            </div>

                            <div className="space-y-2">
                                <Label>Message</Label>
                                <Textarea
                                    name="message"
                                    placeholder="Describe your issue in detail..."
                                    className="min-h-[150px]"
                                    required
                                />
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={createTicketMutation.isPending} className="bg-burgundy-600 hover:bg-burgundy-700 text-white">
                                    {createTicketMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Submit Ticket
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (view === "DETAIL" && selectedTicketId) {
        if (isLoadingDetail) return <div className="p-8 text-center text-slate-500">Loading details...</div>;
        const ticket = activeTicket;

        return (
            <div className="h-[calc(100vh-140px)] flex flex-col">
                <div className="mb-4">
                    <Button variant="ghost" onClick={() => { setView("LIST"); setSelectedTicketId(null); }} className="pl-0 hover:bg-transparent hover:text-burgundy-600">
                        <ChevronLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                    </Button>
                </div>

                {ticket ? (
                    <Card className="flex-1 flex flex-col overflow-hidden border-slate-200 shadow-sm">
                        <div className="p-4 border-b bg-slate-50 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="outline">{ticket.category}</Badge>
                                    <Badge className={
                                        ticket.status === "OPEN" ? "bg-green-100 text-green-700" :
                                            ticket.status === "RESOLVED" ? "bg-purple-100 text-purple-700" :
                                                "bg-slate-100 text-slate-700"
                                    }>
                                        {ticket.status}
                                    </Badge>
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">#{ticket.ticketNumber} - {ticket.subject}</h2>
                                <p className="text-xs text-slate-500 mt-1">
                                    Started {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                                </p>
                            </div>
                        </div>

                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-6">
                                {ticket.messages.map((msg) => (
                                    <div key={msg.id} className={`flex gap-3 ${msg.isFromCustomer ? "flex-row-reverse" : ""}`}>
                                        <Avatar className="w-8 h-8 mt-1">
                                            <AvatarFallback className={msg.isFromCustomer ? "bg-slate-200" : "bg-burgundy-600 text-white"}>
                                                {msg.isFromCustomer ? "ME" : "SP"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${msg.isFromCustomer
                                            ? "bg-burgundy-50 text-burgundy-900 rounded-tr-none"
                                            : "bg-slate-100 text-slate-800 rounded-tl-none"
                                            }`}>
                                            <p className="whitespace-pre-wrap">{msg.content}</p>
                                            <p className="text-[10px] opacity-50 mt-1 text-right">
                                                {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        <div className="p-4 border-t bg-white">
                            <form onSubmit={handleReplySubmit} className="flex gap-2">
                                <Textarea
                                    name="message"
                                    placeholder="Type your reply..."
                                    className="min-h-[50px] resize-none"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            e.currentTarget.form?.requestSubmit();
                                        }
                                    }}
                                />
                                <Button type="submit" disabled={replyMutation.isPending} size="icon" className="h-auto w-12 bg-burgundy-600 hover:bg-burgundy-700">
                                    {replyMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                </Button>
                            </form>
                        </div>
                    </Card>
                ) : (
                    <div>Ticket not found</div>
                )}
            </div>
        );
    }

    // LIST VIEW
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-burgundy-900 p-6 rounded-xl text-white shadow-lg">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <HelpCircle className="w-6 h-6 text-gold-400" />
                        My Support Tickets
                    </h1>
                    <p className="text-burgundy-200 text-sm mt-1">Manage all your support requests in one place</p>
                </div>
                <Button onClick={() => setView("CREATE")} className="bg-gold-400 text-burgundy-900 hover:bg-gold-300 font-semibold shadow-md">
                    <Plus className="w-4 h-4 mr-2" /> New Ticket
                </Button>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3 border-b">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">Ticket History</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-8 text-center text-slate-500">Loading tickets...</div>
                    ) : tickets.length === 0 ? (
                        <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                            <MessageSquare className="w-12 h-12 mb-4 text-slate-300" />
                            <h3 className="text-lg font-medium text-slate-700">No tickets yet</h3>
                            <p className="max-w-xs mx-auto mt-2 mb-6">You haven't submitted any support tickets yet.</p>
                            <Button onClick={() => setView("CREATE")} variant="outline">Create your first ticket</Button>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {tickets.map((ticket) => (
                                <div
                                    key={ticket.id}
                                    className="p-4 hover:bg-slate-50 cursor-pointer transition-colors flex justify-between items-center group"
                                    onClick={() => { setSelectedTicketId(ticket.id); setView("DETAIL"); }}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-2 h-2 mt-2 rounded-full ${ticket.status === 'RESOLVED' ? 'bg-purple-400' : 'bg-green-400'}`} />
                                        <div>
                                            <h4 className="font-semibold text-slate-800 group-hover:text-burgundy-700 transition-colors">
                                                #{ticket.ticketNumber} {ticket.subject}
                                            </h4>
                                            <p className="text-sm text-slate-500 line-clamp-1 mt-0.5">
                                                {ticket.category} • Updated {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge variant="secondary" className={
                                            ticket.status === "OPEN" ? "bg-green-100 text-green-700" :
                                                ticket.status === "RESOLVED" ? "bg-purple-100 text-purple-700" :
                                                    "bg-slate-100 text-slate-700"
                                        }>
                                            {ticket.status}
                                        </Badge>
                                        <ChevronRight className="w-4 h-4 text-slate-300" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
