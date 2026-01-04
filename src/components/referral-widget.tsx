"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Gift,
    Copy,
    Share2,
    Users,
    CheckCircle,
    MessageCircle,
    Mail
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ReferralWidgetProps {
    referralCode: string;
    referralUrl: string;
    referralCount: number;
    totalEarned: number;
    pendingRewards?: number;
    className?: string;
}

export function ReferralWidget({
    referralCode,
    referralUrl,
    referralCount,
    totalEarned,
    pendingRewards = 0,
    className,
}: ReferralWidgetProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(referralUrl);
            setCopied(true);
            toast.success("Link copied!");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Failed to copy");
        }
    };

    const handleWhatsApp = () => {
        const text = encodeURIComponent(
            `Hey! I'm getting certified as a Functional Medicine Practitioner with AccrediPro. You might love it too! Use my link and we both get rewarded: ${referralUrl}`
        );
        window.open(`https://wa.me/?text=${text}`, "_blank");
    };

    const handleEmail = () => {
        const subject = encodeURIComponent("Check out AccrediPro Academy!");
        const body = encodeURIComponent(
            `Hey!\n\nI wanted to share something that's been amazing for me - I'm getting certified as a Functional Medicine Practitioner with AccrediPro Academy.\n\nIf you've ever thought about helping people with their health (and earning $3K-$10K/month doing it), check it out:\n\n${referralUrl}\n\nWhen you use my link, we both get a bonus! 🎁`
        );
        window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
    };

    return (
        <Card className={cn("bg-gradient-to-br from-purple-50 to-white border-purple-100", className)}>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
                        <Gift className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <span className="text-purple-800">Share & Earn</span>
                    </div>
                    {pendingRewards > 0 && (
                        <Badge className="ml-auto bg-purple-100 text-purple-700">
                            ${pendingRewards} pending
                        </Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-3 border border-purple-100 text-center">
                        <Users className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                        <p className="text-xl font-bold text-purple-700">{referralCount}</p>
                        <p className="text-xs text-gray-500">Friends Joined</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-purple-100 text-center">
                        <Gift className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                        <p className="text-xl font-bold text-emerald-700">${totalEarned}</p>
                        <p className="text-xs text-gray-500">Earned</p>
                    </div>
                </div>

                {/* Rewards info */}
                <div className="bg-purple-100/50 rounded-lg p-3">
                    <p className="text-sm text-purple-800 font-medium mb-1">🎁 Your Rewards</p>
                    <ul className="text-xs text-purple-700 space-y-1">
                        <li>• You get: <span className="font-semibold">$50 credit + Bonus Module</span></li>
                        <li>• Friend gets: <span className="font-semibold">10% off + Quick Start Guide</span></li>
                    </ul>
                </div>

                {/* Referral link */}
                <div>
                    <label className="text-xs text-gray-500 block mb-1">Your Referral Link</label>
                    <div className="flex gap-2">
                        <Input
                            value={referralUrl}
                            readOnly
                            className="text-sm bg-white"
                        />
                        <Button
                            onClick={handleCopy}
                            variant="outline"
                            size="sm"
                            className={cn(
                                "shrink-0",
                                copied && "bg-emerald-50 border-emerald-200 text-emerald-700"
                            )}
                        >
                            {copied ? (
                                <CheckCircle className="w-4 h-4" />
                            ) : (
                                <Copy className="w-4 h-4" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Share buttons */}
                <div className="flex gap-2">
                    <Button
                        onClick={handleWhatsApp}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                    >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp
                    </Button>
                    <Button
                        onClick={handleEmail}
                        variant="outline"
                        className="flex-1"
                        size="sm"
                    >
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

// Compact version
export function ReferralWidgetCompact({
    referralCode,
    referralUrl,
    referralCount,
    totalEarned,
    className,
}: ReferralWidgetProps) {
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(referralUrl);
            toast.success("Link copied!");
        } catch {
            toast.error("Failed to copy");
        }
    };

    return (
        <Card className={cn("bg-gradient-to-br from-purple-500 to-purple-600 border-0 text-white", className)}>
            <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                    <Gift className="w-5 h-5" />
                    <span className="font-semibold">Share & Earn</span>
                </div>

                <div className="flex items-center justify-between mb-3">
                    <div>
                        <p className="text-2xl font-bold">{referralCount}</p>
                        <p className="text-xs text-white/70">friends joined</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold">${totalEarned}</p>
                        <p className="text-xs text-white/70">earned</p>
                    </div>
                </div>

                <Button
                    onClick={handleCopy}
                    className="w-full bg-white/20 hover:bg-white/30 text-white"
                    size="sm"
                >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Referral Link
                </Button>
            </CardContent>
        </Card>
    );
}
