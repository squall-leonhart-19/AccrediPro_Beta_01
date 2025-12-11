import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ProductDetailClient } from "@/components/marketplace/product-detail-client";

interface PageProps {
    params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
    const product = await prisma.dFYProduct.findUnique({
        where: { slug },
        include: {
            files: { orderBy: { sortOrder: "asc" } },
        },
    });

    if (!product) return null;

    return {
        ...product,
        price: Number(product.price),
        compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
        bundleDiscount: product.bundleDiscount ? Number(product.bundleDiscount) : null,
        files: product.files,
    };
}

async function getRelatedProducts(category: string, currentId: string) {
    const products = await prisma.dFYProduct.findMany({
        where: {
            category,
            isActive: true,
            id: { not: currentId },
        },
        take: 4,
    });
    return products.map(p => ({
        ...p,
        price: Number(p.price),
        compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
        bundleDiscount: p.bundleDiscount ? Number(p.bundleDiscount) : null,
    }));
}

export default async function ProductDetailPage({ params }: PageProps) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/login");
    }

    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

    const relatedProducts = await getRelatedProducts(product.category, product.id);

    // Check if user already purchased
    const purchase = await prisma.dFYPurchase.findUnique({
        where: {
            userId_productId: {
                userId: session.user.id,
                productId: product.id,
            },
        },
    });

    return (
        <ProductDetailClient
            product={product as any}
            relatedProducts={relatedProducts as any}
            isPurchased={!!purchase}
        />
    );
}
