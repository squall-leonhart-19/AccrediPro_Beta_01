import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Trophy, Link as LinkIcon, TrendingUp } from "lucide-react";

export const metadata = {
    title: "Referral Program | Admin",
};

export default async function AdminReferralsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/");
    }

    // Get top referrers
    const topReferrers = await prisma.user.findMany({
        where: {
            referralCount: { gt: 0 },
            isFakeProfile: false,
        },
        orderBy: { referralCount: "desc" },
        take: 20,
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
            referralCode: true,
            referralCount: true,
        },
    });

    // Get total stats
    const stats = await prisma.user.aggregate({
        where: {
            referredBy: { not: null },
            isFakeProfile: false,
        },
        _count: true,
    });

    const totalReferred = stats._count || 0;

    const usersWithReferralCode = await prisma.user.count({
        where: {
            referralCode: { not: null },
            isFakeProfile: false,
        },
    });

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Referral Program</h1>
                <p className="text-gray-600">Track viral growth and top referrers</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{totalReferred}</div>
                            <div className="text-xs text-gray-500">Total Referred</div>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <LinkIcon className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{usersWithReferralCode}</div>
                            <div className="text-xs text-gray-500">Active Links</div>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">
                                {usersWithReferralCode > 0 ? (totalReferred / usersWithReferralCode).toFixed(1) : "0"}
                            </div>
                            <div className="text-xs text-gray-500">Avg Referrals</div>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-gold-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{topReferrers.length}</div>
                            <div className="text-xs text-gray-500">Active Referrers</div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Top Referrers Leaderboard */}
            <Card className="p-6">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-gold-500" />
                    Top Referrers Leaderboard
                </h2>
                {topReferrers.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No referrals yet. Share referral links to grow!</p>
                ) : (
                    <div className="space-y-3">
                        {topReferrers.map((user, index) => (
                            <div
                                key={user.id}
                                className={`flex items-center justify-between p-3 rounded-lg ${index === 0 ? "bg-gold-50 border border-gold-200" :
                                        index === 1 ? "bg-gray-100" :
                                            index === 2 ? "bg-orange-50" : "bg-white border"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? "bg-gold-500 text-white" :
                                            index === 1 ? "bg-gray-400 text-white" :
                                                index === 2 ? "bg-orange-400 text-white" : "bg-gray-200 text-gray-700"
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {user.firstName} {user.lastName}
                                        </p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge variant="secondary" className="text-xs">
                                        {user.referralCode}
                                    </Badge>
                                    <div className="text-right">
                                        <span className="text-xl font-bold text-purple-600">{user.referralCount}</span>
                                        <span className="text-xs text-gray-500 ml-1">referrals</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}
