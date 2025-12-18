"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import {
    Lock, Shield, CheckCircle2, CreditCard, ArrowRight,
    Gift, Award, Users, MessageCircle, BookOpen, Star,
    Zap, Heart, Clock, ChevronDown, ChevronUp,
} from "lucide-react";

// Real student profile images
const STUDENT_AVATARS = [
    "https://accredipro.academy/wp-content/uploads/2025/12/AI_Headshot_Generator-13.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/LeezaRhttilthead.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/Head-shot-dark-background-1.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/Profile-Pic.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/MICHELLEM047.jpg",
];

export default function MiniDiplomaCheckoutPage() {
    const [email, setEmail] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvc, setCvc] = useState("");
    const [name, setName] = useState("");
    const [orderBumpSelected, setOrderBumpSelected] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showGuaranteeDetails, setShowGuaranteeDetails] = useState(false);

    const basePrice = 7;
    const orderBumpPrice = 27;
    const totalPrice = basePrice + (orderBumpSelected ? orderBumpPrice : 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        // In production, this would connect to Stripe
        setTimeout(() => {
            alert("Payment processing would happen here!");
            setIsProcessing(false);
        }, 2000);
    };

    // Format card number with spaces
    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || "";
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        return parts.length ? parts.join(" ") : value;
    };

    // Format expiry as MM/YY
    const formatExpiry = (value: string) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        if (v.length >= 2) {
            return v.substring(0, 2) + "/" + v.substring(2, 4);
        }
        return v;
    };

    return (
        <>
            {/* TrustBox Script */}
            <Script
                src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
                strategy="afterInteractive"
            />

            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                    <div className="max-w-6xl mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            {/* Logo */}
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-burgundy-600 to-burgundy-700 rounded-xl flex items-center justify-center">
                                    <Award className="h-6 w-6 text-white" />
                                </div>
                                <span className="font-bold text-xl text-slate-800">AccrediPro</span>
                            </Link>

                            {/* Secure Checkout Badge */}
                            <div className="flex items-center gap-2 text-slate-600">
                                <Lock className="h-4 w-4 text-emerald-600" />
                                <span className="text-sm font-medium">Secure Checkout</span>
                            </div>
                        </div>
                    </div>

                    {/* Trustpilot Widget */}
                    <div className="bg-slate-50 border-t border-slate-100 py-2">
                        <div className="max-w-6xl mx-auto px-4">
                            <div
                                className="trustpilot-widget"
                                data-locale="en-US"
                                data-template-id="5419b6ffb0d04a076446a9af"
                                data-businessunit-id="68c1ac85e89f387ad19f7817"
                                data-style-height="20px"
                                data-style-width="100%"
                                data-token="e33169fc-3158-4c67-94f8-c774e5035e30"
                            >
                                <a href="https://www.trustpilot.com/review/accredipro.academy" target="_blank" rel="noopener noreferrer">
                                    Trustpilot
                                </a>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-6xl mx-auto px-4 py-8">
                    <div className="grid lg:grid-cols-5 gap-8">
                        {/* Left Side - Order Summary (60%) */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Order Summary Box */}
                            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                                <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 px-6 py-4">
                                    <h2 className="text-white font-bold text-lg">YOUR ORDER</h2>
                                </div>

                                <div className="p-6">
                                    <div className="flex gap-6">
                                        {/* Product Image */}
                                        <div className="shrink-0">
                                            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-burgundy-100 to-rose-100 rounded-xl flex items-center justify-center border-2 border-burgundy-200">
                                                <Award className="h-12 w-12 sm:h-16 sm:w-16 text-burgundy-600" />
                                            </div>
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg sm:text-xl text-slate-800 mb-3">
                                                Functional Medicine Mini Diploma
                                            </h3>

                                            <ul className="space-y-2">
                                                {[
                                                    "Complete FM Foundations Training (90 min)",
                                                    "Interactive 1:1 Experience with Sarah",
                                                    "Official Mini Diploma Certificate",
                                                    "Personal Coach Support",
                                                    "Private Community Access",
                                                    "6 Graduate Bonus Resources",
                                                ].map((item, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            {/* Price */}
                                            <div className="mt-4 flex items-center gap-3">
                                                <span className="text-slate-400 line-through text-lg">$97</span>
                                                <span className="text-3xl font-black text-burgundy-600">$7</span>
                                                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">
                                                    SAVE 93%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Bump */}
                            <div
                                onClick={() => setOrderBumpSelected(!orderBumpSelected)}
                                className={`relative bg-gradient-to-r cursor-pointer transition-all ${
                                    orderBumpSelected
                                        ? "from-amber-50 to-yellow-50 border-amber-400 shadow-lg"
                                        : "from-amber-50/50 to-yellow-50/50 border-amber-200 hover:border-amber-300"
                                } rounded-2xl border-2 border-dashed overflow-hidden`}
                            >
                                {/* Bump Header */}
                                <div className="bg-gradient-to-r from-amber-400 to-yellow-400 px-4 py-2 flex items-center gap-2">
                                    <Zap className="h-4 w-4 text-amber-900" />
                                    <span className="text-amber-900 font-bold text-sm">ONE-TIME OFFER - Add This Now!</span>
                                </div>

                                <div className="p-5">
                                    <div className="flex items-start gap-4">
                                        {/* Checkbox */}
                                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 mt-1 transition-all ${
                                            orderBumpSelected
                                                ? "bg-amber-500 border-amber-500"
                                                : "border-amber-400 bg-white"
                                        }`}>
                                            {orderBumpSelected && (
                                                <CheckCircle2 className="h-4 w-4 text-white" />
                                            )}
                                        </div>

                                        {/* Bump Content */}
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-800 text-lg mb-1">
                                                YES! Add the FM Starter Kit
                                            </h4>
                                            <p className="text-slate-600 text-sm mb-3">
                                                Get our exclusive Root Cause Cheat Sheets, Client Intake Templates,
                                                and 5 Done-For-You Session Scripts that our certified coaches use daily.
                                                <span className="font-semibold text-amber-700"> Worth $197 - yours for just $27.</span>
                                            </p>

                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-400 line-through">$197</span>
                                                <span className="text-2xl font-black text-amber-600">$27</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Guarantee */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                <button
                                    onClick={() => setShowGuaranteeDetails(!showGuaranteeDetails)}
                                    className="w-full flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                            <Shield className="h-6 w-6 text-emerald-600" />
                                        </div>
                                        <div className="text-left">
                                            <h4 className="font-bold text-slate-800">30-Day Money-Back Guarantee</h4>
                                            <p className="text-sm text-slate-500">100% risk-free purchase</p>
                                        </div>
                                    </div>
                                    {showGuaranteeDetails ? (
                                        <ChevronUp className="h-5 w-5 text-slate-400" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-slate-400" />
                                    )}
                                </button>

                                {showGuaranteeDetails && (
                                    <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-600">
                                        <p>
                                            If you complete the Mini Diploma and don't feel like you've gained
                                            valuable insights into Functional Medicine, simply email us within
                                            30 days and we'll refund every penny. No questions asked.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Social Proof - Desktop Only */}
                            <div className="hidden lg:block bg-slate-50 rounded-2xl p-6">
                                <div className="flex items-center justify-center gap-4">
                                    <div className="flex -space-x-2">
                                        {STUDENT_AVATARS.map((src, i) => (
                                            <Image
                                                key={i}
                                                src={src}
                                                alt="Student"
                                                width={40}
                                                height={40}
                                                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                            />
                                        ))}
                                    </div>
                                    <div className="text-sm text-slate-600">
                                        <strong className="text-slate-800">843+</strong> nurses & healthcare workers enrolled
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Payment Form (40%) */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sticky top-32">
                                <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-burgundy-600" />
                                    Payment Details
                                </h3>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            required
                                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    {/* Card Holder Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            Name on Card
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="John Smith"
                                            required
                                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    {/* Card Number */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            Card Number
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={cardNumber}
                                                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                                placeholder="4242 4242 4242 4242"
                                                maxLength={19}
                                                required
                                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-transparent transition-all pr-20"
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                                                <div className="w-8 h-5 bg-slate-100 rounded flex items-center justify-center">
                                                    <span className="text-[10px] font-bold text-slate-400">VISA</span>
                                                </div>
                                                <div className="w-8 h-5 bg-slate-100 rounded flex items-center justify-center">
                                                    <span className="text-[10px] font-bold text-slate-400">MC</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expiry & CVC */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                                Expiry Date
                                            </label>
                                            <input
                                                type="text"
                                                value={expiry}
                                                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                                placeholder="MM/YY"
                                                maxLength={5}
                                                required
                                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                                CVC
                                            </label>
                                            <input
                                                type="text"
                                                value={cvc}
                                                onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").substring(0, 4))}
                                                placeholder="123"
                                                maxLength={4}
                                                required
                                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Order Total */}
                                    <div className="bg-slate-50 rounded-xl p-4 mt-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-slate-600">Mini Diploma</span>
                                            <span className="font-medium">${basePrice}</span>
                                        </div>
                                        {orderBumpSelected && (
                                            <div className="flex justify-between items-center mb-2 text-amber-700">
                                                <span>FM Starter Kit</span>
                                                <span className="font-medium">${orderBumpPrice}</span>
                                            </div>
                                        )}
                                        <div className="border-t border-slate-200 pt-2 mt-2">
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-slate-800">Total</span>
                                                <span className="text-2xl font-black text-burgundy-600">${totalPrice}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        disabled={isProcessing}
                                        className="w-full bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white py-6 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                                    >
                                        {isProcessing ? (
                                            <span className="flex items-center gap-2">
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Processing...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <Lock className="h-5 w-5" />
                                                Complete Order — ${totalPrice}
                                                <ArrowRight className="h-5 w-5" />
                                            </span>
                                        )}
                                    </Button>

                                    {/* Trust Badges */}
                                    <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <Lock className="h-3.5 w-3.5" />
                                            SSL Encrypted
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Shield className="h-3.5 w-3.5" />
                                            Secure Payment
                                        </span>
                                    </div>

                                    {/* Payment Icons */}
                                    <div className="flex items-center justify-center gap-3 mt-4 opacity-60">
                                        <div className="bg-slate-100 px-3 py-1.5 rounded text-xs font-bold text-slate-500">VISA</div>
                                        <div className="bg-slate-100 px-3 py-1.5 rounded text-xs font-bold text-slate-500">MASTERCARD</div>
                                        <div className="bg-slate-100 px-3 py-1.5 rounded text-xs font-bold text-slate-500">AMEX</div>
                                        <div className="bg-slate-100 px-3 py-1.5 rounded text-xs font-bold text-slate-500">STRIPE</div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Social Proof & Guarantee */}
                    <div className="lg:hidden mt-8 space-y-4">
                        {/* Social Proof */}
                        <div className="bg-slate-50 rounded-2xl p-4">
                            <div className="flex flex-col items-center gap-3">
                                <div className="flex -space-x-2">
                                    {STUDENT_AVATARS.map((src, i) => (
                                        <Image
                                            key={i}
                                            src={src}
                                            alt="Student"
                                            width={36}
                                            height={36}
                                            className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
                                        />
                                    ))}
                                </div>
                                <p className="text-sm text-slate-600 text-center">
                                    <strong className="text-slate-800">843+</strong> nurses & healthcare workers enrolled
                                </p>
                            </div>
                        </div>

                        {/* Trust Badges Row */}
                        <div className="flex items-center justify-center gap-6 py-4">
                            <div className="flex flex-col items-center gap-1">
                                <Shield className="h-6 w-6 text-emerald-600" />
                                <span className="text-xs text-slate-500">30-Day Guarantee</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <Lock className="h-6 w-6 text-blue-600" />
                                <span className="text-xs text-slate-500">Secure Checkout</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <Award className="h-6 w-6 text-amber-600" />
                                <span className="text-xs text-slate-500">Certified Program</span>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-slate-100 border-t border-slate-200 py-6 mt-12">
                    <div className="max-w-6xl mx-auto px-4 text-center text-sm text-slate-500">
                        <p className="mb-2">
                            © 2025 AccrediPro Academy. All rights reserved.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Link href="/terms" className="hover:text-burgundy-600 transition-colors">Terms</Link>
                            <span>•</span>
                            <Link href="/privacy" className="hover:text-burgundy-600 transition-colors">Privacy</Link>
                            <span>•</span>
                            <Link href="/refund" className="hover:text-burgundy-600 transition-colors">Refund Policy</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
