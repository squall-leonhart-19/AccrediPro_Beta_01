"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft, Package, Star, CheckCircle2, Clock, FileText, Download,
    ShoppingCart, Play, Lock, Crown, Gift, Users, Zap, ChevronDown, ChevronUp,
} from "lucide-react";

interface ProductFile {
    id: string;
    name: string;
    description?: string | null;
    fileUrl: string;
    fileType: string;
    fileSize?: number | null;
    category?: string | null;
}

interface Product {
    id: string;
    title: string;
    slug: string;
    description: string;
    shortDescription?: string | null;
    thumbnail?: string | null;
    previewImage?: string | null;
    price: number;
    compareAtPrice?: number | null;
    productType: string;
    category: string;
    specialty?: string | null;
    duration?: string | null;
    sessionsCount?: number | null;
    materialsCount?: number | null;
    isFeatured: boolean;
    isBestseller: boolean;
    features: string[];
    highlights: string[];
    files: ProductFile[];
}

interface ProductDetailClientProps {
    product: Product;
    relatedProducts: Product[];
    isPurchased: boolean;
}

const categoryLabels: Record<string, string> = {
    "functional-medicine": "Functional Medicine",
    "gut-health": "Gut Health",
    "hormones": "Hormones",
    "weight-loss": "Weight Loss",
    "stress-adrenal": "Stress & Adrenal",
};

const fileCategories: Record<string, { label: string; icon: any }> = {
    "session-scripts": { label: "Session Scripts", icon: FileText },
    "client-materials": { label: "Client Materials", icon: Users },
    "marketing": { label: "Marketing Materials", icon: Zap },
    "worksheets": { label: "Worksheets & Forms", icon: FileText },
    "other": { label: "Other Materials", icon: Package },
};

export function ProductDetailClient({ product, relatedProducts, isPurchased }: ProductDetailClientProps) {
    const [showAllFeatures, setShowAllFeatures] = useState(false);
    const savings = product.compareAtPrice ? product.compareAtPrice - product.price : 0;

    // Group files by category
    const filesByCategory = product.files.reduce((acc, file) => {
        const cat = file.category || "other";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(file);
        return acc;
    }, {} as Record<string, ProductFile[]>);

    const handleBuy = () => {
        // Placeholder for checkout flow
        alert("Checkout coming soon! This will integrate with Stripe.");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <Link href="/business-kits" className="inline-flex items-center gap-2 text-gray-500 hover:text-burgundy-600">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Business Kits
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Product Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Hero Card */}
                        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                            {/* Product Image */}
                            <div className="aspect-video bg-gradient-to-br from-burgundy-100 to-gold-50 relative">
                                {product.previewImage || product.thumbnail ? (
                                    <img
                                        src={product.previewImage || product.thumbnail || ""}
                                        alt={product.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package className="w-24 h-24 text-burgundy-200" />
                                    </div>
                                )}

                                {/* Badges */}
                                <div className="absolute top-4 left-4 flex gap-2">
                                    {product.isBestseller && (
                                        <Badge className="bg-amber-500 text-white">
                                            <Star className="w-3 h-3 mr-1 fill-white" /> Bestseller
                                        </Badge>
                                    )}
                                    {product.productType === "BUNDLE" && savings > 0 && (
                                        <Badge className="bg-green-500 text-white">Save ${savings}</Badge>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8">
                                <div className="flex items-center gap-2 mb-3">
                                    <Badge variant="outline">{categoryLabels[product.category] || product.category}</Badge>
                                    {product.duration && <Badge className="bg-burgundy-100 text-burgundy-700">{product.duration}</Badge>}
                                </div>

                                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>

                                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                    {product.description}
                                </p>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl mb-6">
                                    {product.sessionsCount && (
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-burgundy-600">{product.sessionsCount}</p>
                                            <p className="text-sm text-gray-500">Sessions</p>
                                        </div>
                                    )}
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-blue-600">{product.files.length || product.materialsCount || 0}</p>
                                        <p className="text-sm text-gray-500">Materials</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-green-600">Instant</p>
                                        <p className="text-sm text-gray-500">Access</p>
                                    </div>
                                </div>

                                {/* Highlights */}
                                {product.highlights.length > 0 && (
                                    <div className="space-y-2 mb-6">
                                        <h3 className="font-semibold text-gray-900">Key Highlights</h3>
                                        <div className="grid md:grid-cols-2 gap-2">
                                            {product.highlights.map((highlight, i) => (
                                                <div key={i} className="flex items-start gap-2 text-sm">
                                                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                    <span>{highlight}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* What's Included */}
                        <div className="bg-white rounded-2xl shadow-sm border p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Package className="w-5 h-5 text-burgundy-600" />
                                What's Included
                            </h2>

                            <div className="space-y-3">
                                {(showAllFeatures ? product.features : product.features.slice(0, 8)).map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {product.features.length > 8 && (
                                <button
                                    onClick={() => setShowAllFeatures(!showAllFeatures)}
                                    className="mt-4 flex items-center gap-2 text-burgundy-600 hover:text-burgundy-700 font-medium"
                                >
                                    {showAllFeatures ? (
                                        <>Show Less <ChevronUp className="w-4 h-4" /></>
                                    ) : (
                                        <>Show All {product.features.length} Items <ChevronDown className="w-4 h-4" /></>
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Files (if purchased) */}
                        {isPurchased && product.files.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border p-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Download className="w-5 h-5 text-burgundy-600" />
                                    Your Files
                                </h2>

                                <div className="space-y-6">
                                    {Object.entries(filesByCategory).map(([cat, files]) => {
                                        const catInfo = fileCategories[cat] || fileCategories.other;
                                        const CatIcon = catInfo.icon;
                                        return (
                                            <div key={cat}>
                                                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                                    <CatIcon className="w-4 h-4 text-gray-400" />
                                                    {catInfo.label}
                                                </h3>
                                                <div className="grid md:grid-cols-2 gap-3">
                                                    {files.map(file => (
                                                        <a
                                                            key={file.id}
                                                            href={file.fileUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-3 p-3 rounded-lg border hover:border-burgundy-300 hover:bg-burgundy-50 transition-colors"
                                                        >
                                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold uppercase text-gray-500">
                                                                {file.fileType}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium text-gray-900 truncate">{file.name}</p>
                                                                {file.description && (
                                                                    <p className="text-xs text-gray-500 truncate">{file.description}</p>
                                                                )}
                                                            </div>
                                                            <Download className="w-4 h-4 text-gray-400" />
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Buy Box */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Price Card */}
                            <div className="bg-white rounded-2xl shadow-sm border p-6">
                                {isPurchased ? (
                                    <>
                                        <div className="flex items-center gap-2 mb-4">
                                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                                            <span className="font-semibold text-green-600">You Own This Product</span>
                                        </div>
                                        <p className="text-gray-500 mb-4">
                                            Access all materials below or load this program into your Coach Workspace.
                                        </p>
                                        <Button className="w-full bg-burgundy-600 hover:bg-burgundy-700">
                                            Open in Coach Workspace
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        {/* Price */}
                                        <div className="mb-4">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-4xl font-bold text-gray-900">${product.price}</span>
                                                {product.compareAtPrice && (
                                                    <span className="text-xl text-gray-400 line-through">${product.compareAtPrice}</span>
                                                )}
                                            </div>
                                            {savings > 0 && (
                                                <p className="text-green-600 font-medium">Save ${savings} today!</p>
                                            )}
                                        </div>

                                        {/* Buy Button */}
                                        <Button
                                            onClick={handleBuy}
                                            className="w-full bg-burgundy-600 hover:bg-burgundy-700 h-14 text-lg"
                                        >
                                            <ShoppingCart className="w-5 h-5 mr-2" />
                                            Buy Now
                                        </Button>

                                        {/* Trust Badges */}
                                        <div className="mt-6 pt-6 border-t space-y-3">
                                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                                <Zap className="w-5 h-5 text-burgundy-500" />
                                                <span>Instant digital delivery</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                                <Lock className="w-5 h-5 text-burgundy-500" />
                                                <span>Secure checkout</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                                <Crown className="w-5 h-5 text-burgundy-500" />
                                                <span>Lifetime access</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* ROI Calculator */}
                            {!isPurchased && (
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                                    <h3 className="font-semibold text-green-800 mb-2">💰 ROI Potential</h3>
                                    <p className="text-sm text-green-700 mb-4">
                                        Charge your clients ${product.price * 3}-${product.price * 5} for this program.
                                    </p>
                                    <div className="bg-white rounded-lg p-4 text-center">
                                        <p className="text-sm text-gray-500">One client pays for everything</p>
                                        <p className="text-2xl font-bold text-green-600">+{Math.round(((product.price * 3 - product.price) / product.price) * 100)}% ROI</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="mt-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map(p => (
                                <Link
                                    key={p.id}
                                    href={`/business-kits/${p.slug}`}
                                    className="bg-white rounded-xl border p-4 hover:shadow-lg transition-all"
                                >
                                    <div className="aspect-[4/3] bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                                        <Package className="w-12 h-12 text-gray-200" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{p.title}</h3>
                                    <p className="text-burgundy-600 font-bold">${p.price}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
