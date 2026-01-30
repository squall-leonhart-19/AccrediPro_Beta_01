
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Ticket Types
export interface Ticket {
    id: string;
    ticketNumber: number;
    subject: string;
    status: "NEW" | "OPEN" | "PENDING" | "RESOLVED" | "CLOSED";
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    category: string;
    department: "SUPPORT" | "BILLING" | "LEGAL" | "ACADEMIC" | "CREDENTIALING";
    customerName: string;
    customerEmail: string;
    createdAt: string;
    updatedAt: string;
    lastMessageAt?: string;
    rating?: number;
    ratingComment?: string;
    assignedTo?: {
        id: string;
        name: string;
        email: string;
        image: string;
    } | null;
    user?: {
        id: string;
        firstName?: string | null;
        lastName?: string | null;
        avatar?: string | null;
        email?: string | null;
        createdAt: string;
        payments: Array<{
            id: string;
            amount: number; // Decimal comes as number/string from JSON
            currency: string;
            status: string;
            productName?: string | null;
            createdAt: string;
        }>;
        submittedTickets: Array<{
            id: string;
            ticketNumber: number;
            subject: string;
            status: string;
            createdAt: string;
        }>;
        marketingTags: Array<{ tag: string }>;
    } | null;
    messages: TicketMessage[];
}

export interface TicketMessage {
    id: string;
    content: string;
    isFromCustomer: boolean;
    isInternal: boolean;
    createdAt: string;
    sentBy?: { name: string };
}

interface TicketsResponse {
    tickets: Ticket[];
    stats: any;
}

// Fetch Tickets Hook
export function useTickets(
    filterStatus: string = "all",
    filterPriority: string = "all",
    searchTerm: string = "",
    dateRange: string = "all",
    assignedTo: string = "all"
) {
    return useQuery<TicketsResponse>({
        queryKey: ["tickets", filterStatus, filterPriority, searchTerm, dateRange, assignedTo],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filterStatus !== "all") params.append("status", filterStatus);
            if (filterPriority !== "all") params.append("priority", filterPriority);
            if (searchTerm) params.append("search", searchTerm);
            if (dateRange !== "all") params.append("dateRange", dateRange);
            if (assignedTo !== "all") params.append("assignedTo", assignedTo);

            const res = await fetch(`/api/admin/tickets?${params.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch tickets");
            return res.json();
        },
        // Refresh every 30 seconds for performance (reduced from 5s)
        refetchInterval: 30000,
        // Data is fresh for 15 seconds - prevents instant refetch on filter changes
        staleTime: 15000,
        // Keep previous data while fetching for instant UI
        placeholderData: (previousData) => previousData,
    });
}

// Update Ticket Hook
export function useUpdateTicket() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            ticketId,
            updates,
        }: {
            ticketId: string;
            updates: Partial<Ticket> & { assignedToId?: string };
        }) => {
            const res = await fetch(`/api/admin/tickets/${ticketId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
            if (!res.ok) throw new Error("Failed to update ticket");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tickets"] });
            toast.success("Ticket updated");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
}

// Fetch single ticket with full details (for detail panel)
export function useTicketDetails(ticketId: string | null) {
    return useQuery({
        queryKey: ["ticket-details", ticketId],
        queryFn: async () => {
            if (!ticketId) return null;
            const res = await fetch(`/api/admin/tickets/${ticketId}`);
            if (!res.ok) throw new Error("Failed to fetch ticket details");
            const data = await res.json();
            return data.ticket;
        },
        enabled: !!ticketId,
        staleTime: 30000, // Cache for 30 seconds
    });
}

// Send Reply Hook
export function useReplyTicket() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            ticketId,
            message,
            isInternal,
        }: {
            ticketId: string;
            message: string;
            isInternal: boolean;
        }) => {
            const res = await fetch(`/api/admin/tickets/${ticketId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: message, isInternal }),
            });
            if (!res.ok) throw new Error("Failed to send reply");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tickets"] });
            toast.success("Reply sent");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
}
