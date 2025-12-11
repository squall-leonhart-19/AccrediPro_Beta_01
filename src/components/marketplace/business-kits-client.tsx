"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Package, Search, Star, Clock, FileText, Users, Zap, CheckCircle2,
    ArrowRight, Sparkles, Crown, TrendingUp, Gift, ShoppingCart,
} from "lucide-react";

interface Product {
    id: string;
    title: string;
    slug: string;
    description: string;
    shortDescription?: string;
    thumbnail?: string;
    price: number;
    compareAtPrice?: number | null;
    productType: "CORE_PROGRAM" | "SPECIALTY_KIT" | "BUNDLE" | "TEMPLATE_PACK" | "MARKETING_KIT" | "EBOOK";
    category: string;
    specialty?: string | null;
    duration?: string | null;
    sessionsCount?: number | null;
    materialsCount?: number | null;
    isFeatured: boolean;
    isBestseller: boolean;
    avgRating: number;
    reviewCount: number;
    features: string[];
    highlights: string[];
}

interface BusinessKitsClientProps {
    products: Product[];
    categories: string[];
    purchasedIds: string[];
}

const productTypeLabels: Record<string, { label: string; color: string; icon: any }> = {
    CORE_PROGRAM: { label: "Core Program", color: "bg-burgundy-100 text-burgundy-700", icon: Crown },
    SPECIALTY_KIT: { label: "Specialty Kit", color: "bg-blue-100 text-blue-700", icon: Package },
    BUNDLE: { label: "Bundle", color: "bg-purple-100 text-purple-700", icon: Gift },
    TEMPLATE_PACK: { label: "Templates", color: "bg-green-100 text-green-700", icon: FileText },
    MARKETING_KIT: { label: "Marketing", color: "bg-amber-100 text-amber-700", icon: TrendingUp },
    EBOOK: { label: "E-Book", color: "bg-teal-100 text-teal-700", icon: FileText },
};

const categoryLabels: Record<string, string> = {
    "functional-medicine": "Functional Medicine",
    "gut-health": "Gut Health",
    "hormones": "Hormones",
    "weight-loss": "Weight Loss",
    "stress-adrenal": "Stress & Adrenal",
    "ebooks": "E-Books & Guides",
};

export function BusinessKitsClient({ products, categories, purchasedIds }: BusinessKitsClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedType, setSelectedType] = useState<string>("all");

    // Filter products
    const filteredProducts = products.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
        const matchesType = selectedType === "all" || p.productType === selectedType;
        return matchesSearch && matchesCategory && matchesType;
    });

    const corePrograms = filteredProducts.filter(p => p.productType === "CORE_PROGRAM");
    const specialtyKits = filteredProducts.filter(p => p.productType === "SPECIALTY_KIT");
    const bundles = filteredProducts.filter(p => p.productType === "BUNDLE");
    const featuredProducts = products.filter(p => p.isFeatured).slice(0, 3);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-900 text-white py-16">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
                <div className="max-w-7xl mx-auto px-6 relative">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-5 h-5 text-gold-400" />
                            <span className="text-gold-400 font-medium">Done-For-You</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Business Kits Marketplace
                        </h1>
                        <p className="text-xl text-burgundy-100 mb-8">
                            Launch your coaching practice instantly with ready-to-use programs,
                            client materials, and marketing templates. Start earning from day one.
                        </p>
                        <div className="flex items-center gap-8 text-sm">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                                <span>Instant Download</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                                <span>Coach Workspace Ready</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                                <span>White-Label</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Banner */}
            {featuredProducts.length > 0 && (
                <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
                    <div className="bg-white rounded-2xl shadow-xl border p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Star className="w-5 h-5 text-gold-500 fill-gold-500" />
                            <h2 className="font-semibold text-gray-900">Featured Products</h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                            {featuredProducts.map(product => (
                                <Link
                                    key={product.id}
                                    href={`/business-kits/${product.slug}`}
                                    className="group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-burgundy-50 to-gold-50 border border-burgundy-100 hover:border-burgundy-300 transition-all"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-burgundy-100 flex items-center justify-center flex-shrink-0">
                                        <Package className="w-7 h-7 text-burgundy-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 truncate group-hover:text-burgundy-600">{product.title}</p>
                                        <p className="text-sm text-gray-500">{product.duration || "Specialty Kit"}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-burgundy-600">${product.price}</p>
                                        {product.compareAtPrice && (
                                            <p className="text-xs text-gray-400 line-through">${product.compareAtPrice}</p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Filters */}
            <section className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[250px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search programs and kits..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setSelectedCategory("all")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === "all"
                                ? "bg-burgundy-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            All Categories
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat
                                    ? "bg-burgundy-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                {categoryLabels[cat] || cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Type Filter */}
                <div className="flex items-center gap-2 mt-4">
                    <span className="text-sm text-gray-500">Type:</span>
                    <button
                        onClick={() => setSelectedType("all")}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedType === "all" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        All
                    </button>
                    {Object.entries(productTypeLabels).map(([type, { label }]) => (
                        <button
                            key={type}
                            onClick={() => setSelectedType(type)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedType === type ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </section>

            {/* Core Programs Section */}
            {corePrograms.length > 0 && (
                <section className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-burgundy-100">
                            <Crown className="w-5 h-5 text-burgundy-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Core Programs</h2>
                            <p className="text-gray-500">Complete coaching systems ready to use</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {corePrograms.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                isPurchased={purchasedIds.includes(product.id)}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Specialty Kits Section */}
            {specialtyKits.length > 0 && (
                <section className="max-w-7xl mx-auto px-6 py-8 bg-gray-50 -mx-6 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-blue-100">
                                <Package className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Specialty Kits</h2>
                                <p className="text-gray-500">Focused protocols for specific client needs</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {specialtyKits.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    isPurchased={purchasedIds.includes(product.id)}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Bundles Section */}
            {bundles.length > 0 && (
                <section className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-purple-100">
                            <Gift className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Bundles</h2>
                            <p className="text-gray-500">Save big with multi-product bundles</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bundles.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                isPurchased={purchasedIds.includes(product.id)}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Empty State */}
            {filteredProducts.length === 0 && (
                <section className="max-w-7xl mx-auto px-6 py-16 text-center">
                    <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500 mb-6">Try adjusting your filters or search query</p>
                    <Button onClick={() => { setSearchQuery(""); setSelectedCategory("all"); setSelectedType("all"); }}>
                        Clear Filters
                    </Button>
                </section>
            )}

            {/* Value Proposition */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 text-white text-center">
                    <h2 className="text-3xl font-bold mb-4">Why Choose Our Business Kits?</h2>
                    <p className="text-gray-300 max-w-2xl mx-auto mb-12">
                        Skip months of creating materials. Get everything you need to charge premium prices and deliver exceptional results.
                    </p>

                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="w-14 h-14 rounded-2xl bg-burgundy-500/20 flex items-center justify-center mx-auto mb-4">
                                <Zap className="w-7 h-7 text-burgundy-400" />
                            </div>
                            <h3 className="font-semibold mb-2">Instant Launch</h3>
                            <p className="text-sm text-gray-400">Start coaching the same day you purchase</p>
                        </div>
                        <div className="text-center">
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                                <Users className="w-7 h-7 text-blue-400" />
                            </div>
                            <h3 className="font-semibold mb-2">Workspace Ready</h3>
                            <p className="text-sm text-gray-400">Loads directly into Coach Workspace</p>
                        </div>
                        <div className="text-center">
                            <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-7 h-7 text-green-400" />
                            </div>
                            <h3 className="font-semibold mb-2">Complete Materials</h3>
                            <p className="text-sm text-gray-400">Sessions, worksheets, and marketing included</p>
                        </div>
                        <div className="text-center">
                            <div className="w-14 h-14 rounded-2xl bg-gold-500/20 flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="w-7 h-7 text-gold-400" />
                            </div>
                            <h3 className="font-semibold mb-2">ROI Guarantee</h3>
                            <p className="text-sm text-gray-400">One client pays for everything</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function ProductCard({ product, isPurchased }: { product: Product; isPurchased: boolean }) {
    const typeInfo = productTypeLabels[product.productType] || productTypeLabels.SPECIALTY_KIT;
    const TypeIcon = typeInfo.icon;
    const savings = product.compareAtPrice ? product.compareAtPrice - product.price : 0;

    return (
        <Link
            href={`/business-kits/${product.slug}`}
            className="group bg-white rounded-2xl border shadow-sm hover:shadow-xl transition-all overflow-hidden"
        >
            {/* Image/Thumbnail */}
            <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-50 relative overflow-hidden">
                {product.thumbnail ? (
                    <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <TypeIcon className="w-16 h-16 text-gray-200" />
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {product.isBestseller && (
                        <Badge className="bg-amber-500 text-white text-xs">
                            <Star className="w-3 h-3 mr-1 fill-white" /> Bestseller
                        </Badge>
                    )}
                    {product.isFeatured && !product.isBestseller && (
                        <Badge className="bg-burgundy-600 text-white text-xs">Featured</Badge>
                    )}
                    {product.productType === "BUNDLE" && savings > 0 && (
                        <Badge className="bg-green-500 text-white text-xs">Save ${savings}</Badge>
                    )}
                </div>

                {isPurchased && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Owned
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                <Badge className={`${typeInfo.color} text-xs mb-2`}>
                    {product.duration || typeInfo.label}
                </Badge>

                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-burgundy-600 transition-colors line-clamp-2">
                    {product.title}
                </h3>

                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {product.shortDescription || product.description.substring(0, 100)}
                </p>

                {/* Star Rating */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${star <= Math.round(product.avgRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-gray-500">
                        {product.avgRating.toFixed(1)} ({product.reviewCount})
                    </span>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                    {product.sessionsCount && (
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {product.sessionsCount} sessions
                        </span>
                    )}
                    {product.materialsCount && (
                        <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" /> {product.materialsCount} materials
                        </span>
                    )}
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-2xl font-bold text-burgundy-600">${product.price}</span>
                        {product.compareAtPrice && (
                            <span className="text-sm text-gray-400 line-through ml-2">${product.compareAtPrice}</span>
                        )}
                    </div>

                    {isPurchased ? (
                        <span className="text-sm text-green-600 font-medium">Access →</span>
                    ) : (
                        <Button size="sm" className="bg-burgundy-600 hover:bg-burgundy-700">
                            <ShoppingCart className="w-4 h-4 mr-1" /> Buy
                        </Button>
                    )}
                </div>
            </div>
        </Link>
    );
}
