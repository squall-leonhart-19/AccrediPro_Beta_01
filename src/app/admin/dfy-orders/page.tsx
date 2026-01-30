import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import DFYOrdersClient from "./client";

export const metadata = {
    title: "DFY Orders | Admin",
    description: "Manage Done-For-You fulfillment orders",
};

export default async function DFYOrdersPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN"].includes(session.user.role as string)) {
        redirect("/");
    }

    // Fetch all DFY purchases with related data
    const purchases = await prisma.dFYPurchase.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            user: {
                select: { id: true, firstName: true, lastName: true, email: true, image: true }
            },
            product: {
                select: { id: true, name: true, price: true }
            },
            assignedTo: {
                select: { id: true, firstName: true, lastName: true }
            }
        },
        take: 100
    });

    // Get Jonathan for assignment
    const jonathan = await prisma.user.findFirst({
        where: { email: "jonathan@accredipro.academy" },
        select: { id: true, firstName: true, lastName: true }
    });

    return (
        <div className="p-6">
            <DFYOrdersClient
                purchases={JSON.parse(JSON.stringify(purchases))}
                jonathanId={jonathan?.id || null}
            />
        </div>
    );
}
