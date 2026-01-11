"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Copy, Check, Gift, Share2 } from "lucide-react";
import { toast } from "sonner";

interface ReferralCardProps {
    userId: string;
    firstName?: string;
}

export function ReferralCard({ userId, firstName }: ReferralCardProps) {
    const [referralCode, setReferralCode] = useState<string | null>(null);
    const [referralCount, setReferralCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchReferralData();
    }, []);

    const fetchReferralData = async () => {
        try {
            const res = await fetch("/api/referral/my-link");
            if (res.ok) {
                const data = await res.json();
                setReferralCode(data.referralCode);
                setReferralCount(data.referralCount || 0);
            }
        } catch (error) {
            console.error("Failed to fetch referral data:", error);
        } finally {
            setLoading(false);
        }
    };

    const referralLink = referralCode
        ? `${typeof window !== 'undefined' ? window.location.origin : ''}/join?ref=${referralCode}`
        : "";

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(referralLink);
            setCopied(true);
            toast.success("Link copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast.error("Failed to copy link");
        }
    };

    const shareLink = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Join AccrediPro Academy!",
                    text: `${firstName || "I"} invited you to AccrediPro Academy - Get certified in health & wellness!`,
                    url: referralLink,
                });
            } catch (error) {
                // User cancelled or share failed
            }
        } else {
            copyToClipboard();
        }
    };

    if (loading) {
        return (
            <Card className="p-4 animate-pulse bg-gray-50">
                <div className="h-20 bg-gray-200 rounded" />
            </Card>
        );
    }

    return (
        <Card className="p-5 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 overflow-hidden relative">
            {/* Decorative elements */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-200/30 rounded-full blur-xl" />

            <div className="relative">
                {/* Header */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                        <Gift className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-purple-900">Refer a Friend</h3>
                        <p className="text-xs text-purple-600">Share the gift of learning!</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-purple-200">
                        <Users className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-semibold text-purple-900">{referralCount}</span>
                        <span className="text-xs text-purple-600">friends referred</span>
                    </div>
                </div>

                {/* Referral Link */}
                <div className="flex gap-2">
                    <Input
                        value={referralLink}
                        readOnly
                        className="text-xs bg-white border-purple-200 text-purple-800"
                    />
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={copyToClipboard}
                        className="shrink-0 border-purple-300 hover:bg-purple-100"
                    >
                        {copied ? (
                            <Check className="w-4 h-4 text-green-600" />
                        ) : (
                            <Copy className="w-4 h-4 text-purple-600" />
                        )}
                    </Button>
                    <Button
                        size="sm"
                        onClick={shareLink}
                        className="shrink-0 bg-purple-600 hover:bg-purple-700"
                    >
                        <Share2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}
