import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { BusinessKitsClient } from "@/components/marketplace/business-kits-client";

async function getProducts() {
    const products = await prisma.dFYProduct.findMany({
        where: { isActive: true },
        orderBy: [
            { isFeatured: "desc" },
            { isBestseller: "desc" },
            { sortOrder: "asc" },
        ],
    });
    return products.map(p => ({
        ...p,
        price: Number(p.price),
        compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
        bundleDiscount: p.bundleDiscount ? Number(p.bundleDiscount) : null,
    }));
}

async function getCategories() {
    const products = await prisma.dFYProduct.findMany({
        where: { isActive: true },
        select: { category: true },
        distinct: ["category"],
    });
    return products.map(p => p.category);
}

export default async function BusinessKitsPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/login");
    }

    const [products, categories] = await Promise.all([
        getProducts(),
        getCategories(),
    ]);

    // Get user's purchased products
    const userPurchases = await prisma.dFYPurchase.findMany({
        where: { userId: session.user.id, status: "COMPLETED" },
        select: { productId: true },
    });
    const purchasedIds = userPurchases.map(p => p.productId);

    return (
        <BusinessKitsClient
            products={products}
            categories={categories}
            purchasedIds={purchasedIds}
        />
    );
}
