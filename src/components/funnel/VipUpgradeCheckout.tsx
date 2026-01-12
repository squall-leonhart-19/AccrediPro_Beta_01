"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Lock, FileText, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface VipUpgradeCheckoutProps {
    specialtySlug: string
    nextPath: string
}

export function VipUpgradeCheckout({ specialtySlug, nextPath }: VipUpgradeCheckoutProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [timeLeft, setTimeLeft] = useState(900) // 15 minutes

    // Countdown timer logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const formatTime = (seconds: number) => {
        const min = Math.floor(seconds / 60)
        const sec = seconds % 60
        return `${min}:${sec < 10 ? "0" + sec : sec}`
    }

    const handleUpgrade = async () => {
        setLoading(true)
        // Simulate Stripe processing
        await new Promise((resolve) => setTimeout(resolve, 2000))
        // Simulate tagging user as VIP
        // await fetch('/api/funnel/tag-vip', { method: 'POST' })
        router.push(nextPath)
    }

    const handleSkip = () => {
        if (confirm("Are you sure? You will lose access to the Cheat Sheets and Lifetime updates.")) {
            router.push(nextPath)
        }
    }

    return (
        <div className="w-full max-w-lg mx-auto">
            {/* Urgency Bar */}
            <div className="bg-yellow-50 text-yellow-800 px-4 py-2 rounded-t-xl flex items-center justify-between text-sm font-bold border border-yellow-200 border-b-0">
                <span className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Special Offer Expires In:
                </span>
                <span className="font-mono text-base">{formatTime(timeLeft)}</span>
            </div>

            <Card className="border-t-0 rounded-t-none shadow-2xl border-gray-200">
                <CardHeader className="bg-gray-50 border-b border-gray-100 pb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <Badge variant="default" className="bg-[#cd3f3e] mb-2">ONE-TIME OFFER</Badge>
                            <CardTitle className="text-2xl font-black text-gray-900">VIP Access Pass</CardTitle>
                            <CardDescription>Unlock Lifetime Access & Cheat Sheets</CardDescription>
                        </div>
                        <div className="text-right">
                            <span className="text-gray-400 line-through text-sm font-medium">$297</span>
                            <div className="text-4xl font-black text-green-600">$47</div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-6 space-y-6">

                    {/* What You Get List */}
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                            <div>
                                <span className="font-bold text-gray-900 block">Lifetime Access (No Expiry)</span>
                                <span className="text-sm text-gray-500">Don't lose your progress after 14 days.</span>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                            <div>
                                <span className="font-bold text-gray-900 block">Complete PDF Study Guides</span>
                                <span className="text-sm text-gray-500">50+ pages of notes, protocols, and cheat sheets.</span>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                            <div>
                                <span className="font-bold text-gray-900 block">High-Res Printable Diploma</span>
                                <span className="text-sm text-gray-500">Digital verification + Wall-ready PDF certificate.</span>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                            <div>
                                <span className="font-bold text-gray-900 block">Bonus: "7-Day Client Getting" Masterclass</span>
                                <span className="text-sm text-gray-500">How to get your first paid client next week.</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form Mock */}
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-600">
                            <Lock className="w-4 h-4" /> Secure SSL Payment
                        </div>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <Label>Card Number</Label>
                                <Input placeholder="0000 0000 0000 0000" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label>Expiry</Label>
                                    <Input placeholder="MM/YY" />
                                </div>
                                <div className="space-y-1">
                                    <Label>CVC</Label>
                                    <Input placeholder="123" />
                                </div>
                            </div>
                        </div>
                    </div>

                </CardContent>

                <CardFooter className="flex flex-col gap-4 pb-6">
                    <Button
                        onClick={handleUpgrade}
                        disabled={loading}
                        className="w-full h-14 text-lg font-bold bg-green-600 hover:bg-green-700 shadow-xl hover:shadow-2xl transition-all"
                    >
                        {loading ? "Processing..." : "YES! UPGRADE MY ORDER NOW"}
                    </Button>

                    <Button
                        variant="ghost"
                        onClick={handleSkip}
                        className="text-xs text-gray-400 hover:text-gray-600"
                    >
                        No thanks, I prefer generic access that expires in 14 days.
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                        <ShieldCheck className="w-3 h-3" />
                        <span>30-Day Money Back Guarantee</span>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
