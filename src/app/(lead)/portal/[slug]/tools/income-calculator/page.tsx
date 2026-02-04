"use client";

import { IncomeCalculator } from "@/components/mini-diploma/tools/income-calculator";
import { useParams } from "next/navigation";

export default function IncomeCalculatorPage() {
    const params = useParams();
    const slug = params.slug as string;

    return (
        <div className="min-h-screen py-8 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Premium Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        💰 Income Calculator
                    </h1>
                    <p className="text-gray-600">
                        See your earning potential as a certified health coach
                    </p>
                </div>

                {/* Calculator Component */}
                <IncomeCalculator portalSlug={slug} />
            </div>
        </div>
    );
}
