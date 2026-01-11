import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ReferralWidget } from "@/components/referral-widget";

export const metadata = {
    title: "Referral Program | AccrediPro Academy",
    description: "Share your unique referral link and earn rewards",
};

export default async function ReferralsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    // Generate a simple code based on user info
    const code = `${session.user.firstName?.toLowerCase().slice(0, 4) || "user"}${session.user.id.slice(-6)}`;
    const referralUrl = `https://learn.accredipro.academy/fm-course-certification?ref=${code}`;

    // Try to get stats from database (may not exist yet)
    let referralCount = 0;
    let totalClicks = 0;

    try {
        const stats = await prisma.referral.aggregate({
            where: { referrerId: session.user.id },
            _count: { _all: true },
            _sum: { clickCount: true },
        });
        totalClicks = stats._sum?.clickCount || 0;

        referralCount = await prisma.referral.count({
            where: { referrerId: session.user.id, status: "converted" },
        });
    } catch (e) {
        // Table doesn't exist yet - graceful fallback
        console.log("[Referrals] Table not ready yet");
    }

    return (
        <div className="container max-w-4xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Referral Program</h1>
                <p className="text-gray-600 mt-2">
                    Share AccrediPro with friends and earn rewards when they join!
                </p>
            </div>

            <ReferralWidget
                referralCode={code}
                referralUrl={referralUrl}
                referralCount={referralCount}
                userName={session.user.firstName || "friend"}
            />

            {/* How it works */}
            <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border">
                <h2 className="text-xl font-bold text-gray-900 mb-4">How It Works</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-3 bg-burgundy-100 rounded-full flex items-center justify-center">
                            <span className="text-burgundy-600 font-bold">1</span>
                        </div>
                        <h3 className="font-medium text-gray-900">Share Your Link</h3>
                        <p className="text-gray-500 text-sm mt-1">
                            Send your unique referral link to friends
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-3 bg-burgundy-100 rounded-full flex items-center justify-center">
                            <span className="text-burgundy-600 font-bold">2</span>
                        </div>
                        <h3 className="font-medium text-gray-900">They Sign Up</h3>
                        <p className="text-gray-500 text-sm mt-1">
                            Your friend creates an account using your link
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-3 bg-burgundy-100 rounded-full flex items-center justify-center">
                            <span className="text-burgundy-600 font-bold">3</span>
                        </div>
                        <h3 className="font-medium text-gray-900">Both Get Rewards</h3>
                        <p className="text-gray-500 text-sm mt-1">
                            You both receive special bonuses
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="mt-6 bg-gradient-to-r from-burgundy-50 to-gold-50 rounded-2xl p-6 border border-burgundy-100">
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-gray-600 text-sm">Your Code</p>
                        <p className="text-lg font-mono font-bold text-burgundy-600">{code}</p>
                    </div>
                    <div>
                        <p className="text-gray-600 text-sm">Link Clicks</p>
                        <p className="text-2xl font-bold text-burgundy-700">{totalClicks}</p>
                    </div>
                    <div>
                        <p className="text-gray-600 text-sm">Conversions</p>
                        <p className="text-2xl font-bold text-green-600">{referralCount}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}


