"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, differenceInDays } from "date-fns";
import {
    Package, Download, Loader2, ChevronDown, ChevronRight,
    Clock, CheckCircle2, Truck, AlertCircle, Search, User,
    Mail, Phone, Camera, BookOpen, DollarSign, Target, Palette,
    Send, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface DFYOrder {
    id: string;
    createdAt: string;
    fulfillmentStatus: "PENDING" | "INTAKE_RECEIVED" | "IN_PROGRESS" | "DELIVERED";
    purchasePrice: number;
    deliveredAt: string | null;
    notes: string | null;
    intakeData: Record<string, any> | null;
    user: {
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        avatar: string | null;
    };
    product: {
        id: string;
        title: string;
        slug: string;
    };
    assignedTo: {
        id: string;
        firstName: string | null;
        lastName: string | null;
    } | null;
}

const STATUS_CONFIG = {
    PENDING: { label: "Pending Intake", color: "bg-yellow-100 text-yellow-800", icon: Clock },
    INTAKE_RECEIVED: { label: "Intake Received", color: "bg-blue-100 text-blue-800", icon: AlertCircle },
    IN_PROGRESS: { label: "In Progress", color: "bg-purple-100 text-purple-800", icon: Truck },
    DELIVERED: { label: "Delivered", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
};

export default function DFYOrdersPage() {
    const queryClient = useQueryClient();
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [editingNotes, setEditingNotes] = useState<{ id: string; notes: string } | null>(null);

    // Fetch orders
    const { data, isLoading } = useQuery({
        queryKey: ["dfy-orders", statusFilter, searchTerm],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (statusFilter !== "all") params.append("status", statusFilter);
            if (searchTerm) params.append("search", searchTerm);
            const res = await fetch(`/api/admin/dfy-orders?${params}`);
            return res.json();
        },
    });

    // Update order mutation
    const updateOrder = useMutation({
        mutationFn: async ({ id, ...updates }: { id: string; fulfillmentStatus?: string; notes?: string }) => {
            const res = await fetch(`/api/admin/dfy-orders/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dfy-orders"] });
            toast.success("Order updated");
            setEditingNotes(null);
        },
    });

    // Send reminder mutation
    const sendReminder = useMutation({
        mutationFn: async (orderId: string) => {
            const res = await fetch(`/api/admin/dfy-orders/${orderId}/remind`, {
                method: "POST",
            });
            if (!res.ok) throw new Error("Failed to send reminder");
            return res.json();
        },
        onSuccess: () => {
            toast.success("Reminder email sent!");
        },
        onError: () => {
            toast.error("Failed to send reminder");
        },
    });

    // Calculate days since purchase
    const getDaysSincePurchase = (createdAt: string) => {
        return differenceInDays(new Date(), new Date(createdAt));
    };

    const orders: DFYOrder[] = data?.orders || [];
    const stats = data?.stats || { pending: 0, intakeReceived: 0, inProgress: 0, delivered: 0, total: 0 };

    // Handle CSV export
    const handleExport = () => {
        window.location.href = "/api/admin/dfy-orders/export";
    };

    // Render intake data
    const renderIntakeData = (intake: Record<string, any> | null) => {
        if (!intake) return <p className="text-gray-500 italic">No intake data yet</p>;

        const sections = [
            {
                title: "Contact Info",
                icon: User,
                fields: ["firstName", "lastName", "email", "phone"],
            },
            {
                title: "Coaching Details",
                icon: BookOpen,
                fields: ["coachingTitle", "certifications", "story"],
            },
            {
                title: "Target Client",
                icon: Target,
                fields: ["idealClient", "differentiation"],
            },
            {
                title: "Program Info",
                icon: Package,
                fields: ["programName", "programDetails", "price"],
            },
            {
                title: "Branding",
                icon: Palette,
                fields: ["websiteFeel", "colors", "websiteGoal"],
            },
            {
                title: "Other",
                icon: Mail,
                fields: ["socialMedia", "howToStart", "schedulingTool", "successStories", "anythingElse"],
            },
        ];

        return (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sections.map(section => {
                    const hasData = section.fields.some(f => intake[f]);
                    if (!hasData) return null;

                    return (
                        <div key={section.title} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <section.icon className="w-4 h-4 text-burgundy-600" />
                                <h4 className="font-semibold text-gray-800">{section.title}</h4>
                            </div>
                            <div className="space-y-2">
                                {section.fields.map(field => {
                                    const value = intake[field];
                                    if (!value) return null;
                                    const displayValue = Array.isArray(value) ? value.join(", ") : value;
                                    return (
                                        <div key={field}>
                                            <p className="text-xs text-gray-500 capitalize">{field.replace(/([A-Z])/g, " $1")}</p>
                                            <p className="text-sm text-gray-800 whitespace-pre-wrap">{displayValue}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
                {/* Photos */}
                {intake.photoUrls?.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Camera className="w-4 h-4 text-burgundy-600" />
                            <h4 className="font-semibold text-gray-800">Photos</h4>
                        </div>
                        <div className="flex gap-2">
                            {intake.photoUrls.map((url: string, i: number) => (
                                <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                                    <img src={url} alt={`Photo ${i + 1}`} className="w-20 h-20 object-cover rounded-lg border" />
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Package className="w-6 h-6 text-burgundy-600" />
                        DFY Orders
                    </h1>
                    <p className="text-gray-500">Manage Done-For-You fulfillment orders</p>
                </div>
                <Button onClick={handleExport} variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Export CSV
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {[
                    { key: "pending", label: "Pending Intake", value: stats.pending, color: "text-yellow-600" },
                    { key: "intakeReceived", label: "Intake Received", value: stats.intakeReceived, color: "text-blue-600" },
                    { key: "inProgress", label: "In Progress", value: stats.inProgress, color: "text-purple-600" },
                    { key: "delivered", label: "Delivered", value: stats.delivered, color: "text-green-600" },
                    { key: "total", label: "Total", value: stats.total, color: "text-gray-600" },
                ].map(stat => (
                    <Card
                        key={stat.key}
                        className={`cursor-pointer transition-all ${statusFilter === (stat.key === "total" ? "all" : stat.key.toUpperCase().replace("INTAKERECEIVED", "INTAKE_RECEIVED")) ? "ring-2 ring-burgundy-500" : ""}`}
                        onClick={() => setStatusFilter(stat.key === "total" ? "all" : stat.key.toUpperCase().replace("intakeReceived", "INTAKE_RECEIVED"))}
                    >
                        <CardContent className="pt-4">
                            <p className="text-xs text-gray-500">{stat.label}</p>
                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Search */}
            <div className="mb-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search by email or name..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Orders List */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
            ) : orders.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-gray-500">
                        <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No DFY orders found</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {orders.map(order => {
                        const isExpanded = expandedId === order.id;
                        const StatusIcon = STATUS_CONFIG[order.fulfillmentStatus].icon;
                        const daysSince = getDaysSincePurchase(order.createdAt);
                        const isPendingTooLong = order.fulfillmentStatus === "PENDING" && daysSince >= 2;

                        return (
                            <Card key={order.id} className={`overflow-hidden ${isPendingTooLong ? "border-orange-300 bg-orange-50/30" : ""}`}>
                                {/* Order Header Row */}
                                <div
                                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        {isExpanded ? (
                                            <ChevronDown className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <ChevronRight className="w-5 h-5 text-gray-400" />
                                        )}

                                        {/* Customer Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-gray-900 truncate">
                                                    {order.user.firstName} {order.user.lastName}
                                                </p>
                                                {isPendingTooLong && (
                                                    <span className="flex items-center gap-1 text-xs text-orange-600 font-medium">
                                                        <AlertTriangle className="w-3 h-3" />
                                                        {daysSince}d waiting
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 truncate">{order.user.email}</p>
                                        </div>

                                        {/* Product */}
                                        <div className="hidden md:block text-sm text-gray-600 max-w-[200px] truncate">
                                            {order.product.title}
                                        </div>

                                        {/* Status Badge */}
                                        <Badge className={`${STATUS_CONFIG[order.fulfillmentStatus].color} flex items-center gap-1`}>
                                            <StatusIcon className="w-3 h-3" />
                                            {STATUS_CONFIG[order.fulfillmentStatus].label}
                                        </Badge>

                                        {/* Days + Date */}
                                        <div className="hidden lg:flex flex-col items-end text-sm">
                                            <span className="text-gray-500">{format(new Date(order.createdAt), "MMM d, yyyy")}</span>
                                            <span className="text-xs text-gray-400">{daysSince === 0 ? "Today" : `${daysSince}d ago`}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                {isExpanded && (
                                    <div className="border-t bg-gray-50/50 p-4 space-y-4">
                                        {/* Send Reminder for Pending */}
                                        {order.fulfillmentStatus === "PENDING" && (
                                            <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                                <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-orange-800">Waiting for intake form</p>
                                                    <p className="text-xs text-orange-600">Purchased {daysSince} day{daysSince !== 1 ? "s" : ""} ago</p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-orange-300 text-orange-700 hover:bg-orange-100"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        sendReminder.mutate(order.id);
                                                    }}
                                                    disabled={sendReminder.isPending}
                                                >
                                                    <Send className="w-4 h-4 mr-1" />
                                                    Send Reminder
                                                </Button>
                                            </div>
                                        )}

                                        {/* Quick Actions */}
                                        <div className="flex flex-wrap gap-2">
                                            <span className="text-sm text-gray-500">Update Status:</span>
                                            {(["PENDING", "INTAKE_RECEIVED", "IN_PROGRESS", "DELIVERED"] as const).map(status => (
                                                <Button
                                                    key={status}
                                                    size="sm"
                                                    variant={order.fulfillmentStatus === status ? "default" : "outline"}
                                                    onClick={() => updateOrder.mutate({ id: order.id, fulfillmentStatus: status })}
                                                    disabled={updateOrder.isPending}
                                                    className="text-xs"
                                                >
                                                    {STATUS_CONFIG[status].label}
                                                </Button>
                                            ))}
                                        </div>

                                        {/* Intake Data */}
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                                <BookOpen className="w-4 h-4" />
                                                Intake Form Answers
                                            </h3>
                                            {renderIntakeData(order.intakeData)}
                                        </div>

                                        {/* Notes */}
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-2">Internal Notes</h3>
                                            {editingNotes?.id === order.id ? (
                                                <div className="space-y-2">
                                                    <Textarea
                                                        value={editingNotes.notes}
                                                        onChange={e => setEditingNotes({ ...editingNotes, notes: e.target.value })}
                                                        placeholder="Add notes about this order..."
                                                        rows={3}
                                                    />
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => updateOrder.mutate({ id: order.id, notes: editingNotes.notes })}
                                                            disabled={updateOrder.isPending}
                                                        >
                                                            Save
                                                        </Button>
                                                        <Button size="sm" variant="outline" onClick={() => setEditingNotes(null)}>
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    className="p-3 bg-white rounded border cursor-pointer hover:bg-gray-50"
                                                    onClick={() => setEditingNotes({ id: order.id, notes: order.notes || "" })}
                                                >
                                                    {order.notes ? (
                                                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{order.notes}</p>
                                                    ) : (
                                                        <p className="text-sm text-gray-400 italic">Click to add notes...</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Delivery Info */}
                                        {order.deliveredAt && (
                                            <div className="flex items-center gap-2 text-sm text-green-600">
                                                <CheckCircle2 className="w-4 h-4" />
                                                Delivered on {format(new Date(order.deliveredAt), "MMMM d, yyyy 'at' h:mm a")}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
