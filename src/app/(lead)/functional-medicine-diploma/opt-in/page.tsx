import Link from "next/link"
import Image from "next/image"
import { CheckCircle2, ShieldCheck, Clock } from "lucide-react"

import { OptInForm } from "@/components/funnel/OptInForm"
import { Badge } from "@/components/ui/badge"

export const metadata = {
    title: "Free Functional Medicine Certification | AccrediPro",
    description: "Start your career with the Foundation Certified (FM-FC) Mini Diploma. 100% Free Scholarship.",
}

export default function OptInPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="w-full py-4 bg-white border-b border-gray-100">
                <div className="container px-4 mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-[#cd3f3e]" />
                        <span className="font-bold text-gray-900 tracking-tight">AccrediPro Standards Institute</span>
                    </div>
                    <div className="hidden md:flex items-center text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        <div className="w-2 h-2 mr-2 bg-green-500 rounded-full animate-pulse" />
                        Enrollment Open
                    </div>
                </div>
            </header>

            <main className="container px-4 mx-auto py-12 lg:py-20">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                    {/* Left Column: Copy */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <Badge variant="outline" className="border-[#cd3f3e] text-[#cd3f3e] bg-red-50">
                                Scholarship Access: Active
                            </Badge>
                            <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
                                Get Certified in <span className="text-[#cd3f3e]">Functional Medicine</span>.
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                Stop "Googling" health advice. Start your professional practitioner journey with the
                                <strong> Foundation Verified (FM-FC™)</strong> Mini Diploma.
                            </p>
                            <p className="text-lg font-medium text-gray-900">
                                <span className="line-through text-gray-400 mr-2">$297.00</span>
                                <span className="text-green-600">Now 100% Free.</span>
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="bg-green-100 p-2 rounded-full">
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Official FM-FC™ Credential</h4>
                                    <p className="text-gray-600 text-sm">Earn the verified Foundation Certificate to display on your profile.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-green-100 p-2 rounded-full">
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">3 Comprehensive Modules</h4>
                                    <p className="text-gray-600 text-sm">Master the core principles of Root Cause Resolution.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-green-100 p-2 rounded-full">
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">AI Mentor Access</h4>
                                    <p className="text-gray-600 text-sm">Study with Sarah, the world's first AI Functional Medicine tutor.</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-3 text-sm text-blue-800">
                            <Clock className="w-5 h-5 flex-shrink-0" />
                            <p>
                                <strong>Note:</strong> This scholarship grant covers your tuition fully.
                                You only need to commit your time/study hours.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="relative">
                        {/* Decorative blob */}
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#cd3f3e]/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />

                        <div className="relative flex flex-col items-center">
                            <OptInForm
                                specialtySlug="functional-medicine"
                                nextPath="/functional-medicine-diploma/vip-offer"
                            />

                            <div className="mt-8 flex items-center justify-center gap-6 opacity-60 grayscale">
                                {/* Placeholder logos for social proof */}
                                <span className="font-bold text-gray-400">ACCREDIPRO</span>
                                <span className="font-bold text-gray-400">STANDARDS</span>
                                <span className="font-bold text-gray-400">INSTITUTE</span>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <footer className="w-full py-8 text-center text-sm text-gray-500">
                <p>&copy; 2026 AccrediPro Standards Institute. All rights reserved.</p>
            </footer>
        </div>
    )
}
