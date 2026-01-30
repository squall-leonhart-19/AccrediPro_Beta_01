"use client";

import { useState } from "react";
import { Package, User, Calendar, CheckCircle, Clock, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DFYPurchase {
    id: string;
    userId: string;
    productId: string;
    purchasePrice: number;
    status: string;
    fulfillmentStatus: string;
    intakeData: any;
    deliveredAt: string | null;
    notes: string | null;
    createdAt: string;
    user: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        image: string | null;
    };
    product: {
        id: string;
        name: string;
        price: number;
    };
    assignedTo: {
        id: string;
        firstName: string | null;
        lastName: string | null;
    } | null;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    PENDING: { bg: "bg-yellow-100", text: "text-yellow-800" },
    INTAKE_RECEIVED: { bg: "bg-blue-100", text: "text-blue-800" },
    IN_PROGRESS: { bg: "bg-purple-100", text: "text-purple-800" },
    DELIVERED: { bg: "bg-green-100", text: "text-green-800" },
};

export default function DFYOrdersClient({
    purchases,
    jonathanId,
}: {
    purchases: DFYPurchase[];
    jonathanId: string | null;
}) {
    const [loading, setLoading] = useState<string | null>(null);
    const [localPurchases, setLocalPurchases] = useState(purchases);

    const updateStatus = async (purchaseId: string, newStatus: string) => {
        setLoading(purchaseId);
        try {
            const res = await fetch("/api/dfy/update-status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ purchaseId, status: newStatus }),
            });

            if (res.ok) {
                setLocalPurchases(prev =>
                    prev.map(p =>
                        p.id === purchaseId
                            ? { ...p, fulfillmentStatus: newStatus, deliveredAt: newStatus === "DELIVERED" ? new Date().toISOString() : p.deliveredAt }
                            : p
                    )
                );
            }
        } catch (error) {
            console.error("Failed to update status:", error);
        }
        setLoading(null);
    };

    const pendingCount = localPurchases.filter(p => p.fulfillmentStatus === "PENDING").length;
    const intakeCount = localPurchases.filter(p => p.fulfillmentStatus === "INTAKE_RECEIVED").length;
    const inProgressCount = localPurchases.filter(p => p.fulfillmentStatus === "IN_PROGRESS").length;
    const deliveredCount = localPurchases.filter(p => p.fulfillmentStatus === "DELIVERED").length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Package className="w-6 h-6 text-purple-600" />
                        DFY Orders
                    </h1>
                    <p className="text-sm text-gray-500">Manage Done-For-You fulfillment</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                    <div className="text-sm text-yellow-700 mb-1">Pending</div>
                    <div className="text-2xl font-bold text-yellow-800">{pendingCount}</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <div className="text-sm text-blue-700 mb-1">Intake Received</div>
                    <div className="text-2xl font-bold text-blue-800">{intakeCount}</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                    <div className="text-sm text-purple-700 mb-1">In Progress</div>
                    <div className="text-2xl font-bold text-purple-800">{inProgressCount}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                    <div className="text-sm text-green-700 mb-1">Delivered</div>
                    <div className="text-2xl font-bold text-green-800">{deliveredCount}</div>
                </div>
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr className="text-left text-sm text-gray-500">
                            <th className="p-4 font-medium">Customer</th>
                            <th className="p-4 font-medium">Package</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium">Ordered</th>
                            <th className="p-4 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {localPurchases.map((purchase) => {
                            const status = STATUS_COLORS[purchase.fulfillmentStatus] || STATUS_COLORS.PENDING;
                            return (
                                <tr key={purchase.id} className="hover:bg-gray-50">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                <User className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {purchase.user.firstName} {purchase.user.lastName}
                                                </div>
                                                <div className="text-xs text-gray-500">{purchase.user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-gray-900">{purchase.product.name}</div>
                                        <div className="text-xs text-gray-500">${Number(purchase.purchasePrice).toFixed(0)}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                                            {purchase.fulfillmentStatus.replace("_", " ")}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">
                                        {new Date(purchase.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        {loading === purchase.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                        ) : (
                                            <div className="flex gap-2">
                                                {purchase.fulfillmentStatus === "PENDING" && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-xs"
                                                        disabled
                                                    >
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        Awaiting Intake
                                                    </Button>
                                                )}
                                                {purchase.fulfillmentStatus === "INTAKE_RECEIVED" && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => updateStatus(purchase.id, "IN_PROGRESS")}
                                                        className="text-xs bg-purple-600 hover:bg-purple-700 text-white"
                                                    >
                                                        Start Work
                                                        <ArrowRight className="w-3 h-3 ml-1" />
                                                    </Button>
                                                )}
                                                {purchase.fulfillmentStatus === "IN_PROGRESS" && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => updateStatus(purchase.id, "DELIVERED")}
                                                        className="text-xs bg-green-600 hover:bg-green-700 text-white"
                                                    >
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Mark Delivered
                                                    </Button>
                                                )}
                                                {purchase.fulfillmentStatus === "DELIVERED" && (
                                                    <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Complete
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        {localPurchases.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-gray-400">
                                    <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    No DFY orders yet
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
