"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserCog, X, Eye } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export function ImpersonationBanner() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [stopping, setStopping] = useState(false);

    if (!session?.user?.isImpersonating) {
        return null;
    }

    const handleStopImpersonation = async () => {
        setStopping(true);
        try {
            const res = await fetch("/api/admin/impersonate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "stop" }),
            });

            if (res.ok) {
                // Update session to stop impersonation
                await update({ stopImpersonation: true });
                toast.success("Impersonation ended - returning to admin view");
                router.push("/admin/users");
                router.refresh();
            } else {
                toast.error("Failed to stop impersonation");
            }
        } catch {
            toast.error("Failed to stop impersonation");
        } finally {
            setStopping(false);
        }
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-amber-950 py-2 px-4 shadow-lg">
            <div className="max-w-screen-xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-amber-600/30 rounded-lg">
                        <Eye className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">Viewing as:</span>
                        <span className="font-bold">
                            {session.user.firstName} {session.user.lastName}
                        </span>
                        <span className="text-amber-800 text-sm">
                            ({session.user.role})
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-amber-800">
                        Admin: {session.user.originalAdminName}
                    </span>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleStopImpersonation}
                        disabled={stopping}
                        className="bg-white hover:bg-amber-100 text-amber-900 border-amber-300"
                    >
                        {stopping ? (
                            <>Stopping...</>
                        ) : (
                            <>
                                <X className="w-4 h-4 mr-1" />
                                Exit Impersonation
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}

/**
 * Hook to start impersonating a user
 * Call this from the admin users page when clicking "Impersonate"
 */
export function useImpersonation() {
    const { update } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const startImpersonation = async (userId: string) => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/impersonate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "start", userId }),
            });

            const data = await res.json();

            if (res.ok && data.user) {
                // Update session with impersonated user data
                await update({
                    impersonate: {
                        id: data.user.id,
                        email: data.user.email,
                        firstName: data.user.firstName,
                        lastName: data.user.lastName,
                        role: data.user.role,
                    },
                });

                toast.success(`Now viewing as ${data.user.firstName || data.user.email}`);
                router.push("/dashboard");
                router.refresh();
            } else {
                toast.error(data.error || "Failed to start impersonation");
            }
        } catch {
            toast.error("Failed to start impersonation");
        } finally {
            setLoading(false);
        }
    };

    return { startImpersonation, loading };
}
