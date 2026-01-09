import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Camera } from "lucide-react";

export const dynamic = "force-dynamic";

async function getProfileData(userId: string) {
    return prisma.user.findUnique({
        where: { id: userId },
        select: {
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
        },
    });
}

export default async function LeadProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/login");

    const user = await getProfileData(session.user.id);
    if (!user) redirect("/login");

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

            {/* Avatar Section */}
            <Card className="mb-6">
                <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.firstName || "Profile"}
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-burgundy-100 flex items-center justify-center">
                                    <User className="w-10 h-10 text-burgundy-600" />
                                </div>
                            )}
                            <button className="absolute bottom-0 right-0 w-8 h-8 bg-burgundy-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-burgundy-700">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {user.firstName} {user.lastName}
                            </h2>
                            <p className="text-gray-500 flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {user.email}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" defaultValue={user.firstName || ""} />
                        </div>
                        <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" defaultValue={user.lastName || ""} />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" defaultValue={user.email || ""} disabled className="bg-gray-50" />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                    <Button className="bg-burgundy-600 hover:bg-burgundy-700">
                        Save Changes
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
