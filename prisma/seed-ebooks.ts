import prisma from "../src/lib/prisma";

const EBOOK_PRODUCTS = [
    {
        title: "The Complete Functional Medicine Practitioner's Handbook",
        slug: "fm-practitioners-handbook",
        description: "Your essential reference guide for running a successful functional medicine practice. Covers everything from client assessment to protocol development, business operations, and professional growth strategies.",
        shortDescription: "Essential reference guide for FM practitioners",
        price: 47,
        compareAtPrice: 97,
        productType: "EBOOK" as const,
        category: "ebooks",
        materialsCount: 1,
        isFeatured: true,
        isBestseller: false,
        sortOrder: 100,
        avgRating: 4.9,
        reviewCount: 127,
        features: [
            "300+ pages of actionable content",
            "Client assessment frameworks",
            "Protocol development templates",
            "Business operations guides",
            "Case study examples",
            "Reference charts and tables",
            "Lifetime updates included",
        ],
        highlights: [
            "Perfect desk reference",
            "Printable PDF format",
            "Quick-reference sections",
            "Evidence-based protocols",
        ],
    },
    {
        title: "Gut Health Deep Dive: A Client Education E-Book",
        slug: "gut-health-client-ebook",
        description: "A beautifully designed e-book you can give to your clients to educate them on gut health fundamentals. White-label ready - add your branding and share directly with clients.",
        shortDescription: "White-label client education e-book",
        price: 27,
        compareAtPrice: 47,
        productType: "EBOOK" as const,
        category: "ebooks",
        materialsCount: 1,
        isFeatured: false,
        isBestseller: true,
        sortOrder: 101,
        avgRating: 4.8,
        reviewCount: 89,
        features: [
            "50-page illustrated e-book",
            "White-label ready (editable Canva template)",
            "Professional graphics included",
            "Client-friendly language",
            "Gut-brain connection explained",
            "Food lists and recipes",
            "Action steps for clients",
        ],
        highlights: [
            "Give to your clients",
            "Brand it as your own",
            "Professional design",
            "Increases perceived value",
        ],
    },
    {
        title: "Hormone Harmony: Women's Health Guide",
        slug: "hormone-harmony-ebook",
        description: "Comprehensive guide to women's hormonal health covering menstrual cycles, perimenopause, menopause, and beyond. Perfect for client education or as a lead magnet.",
        shortDescription: "Women's hormonal health education guide",
        price: 27,
        compareAtPrice: 47,
        productType: "EBOOK" as const,
        category: "ebooks",
        materialsCount: 1,
        isFeatured: false,
        isBestseller: false,
        sortOrder: 102,
        avgRating: 4.7,
        reviewCount: 56,
        features: [
            "65-page comprehensive guide",
            "Menstrual cycle education",
            "Perimenopause support",
            "Menopause management",
            "Nutrition for hormones",
            "Lifestyle interventions",
            "White-label Canva template",
        ],
        highlights: [
            "High-value lead magnet",
            "Client education tool",
            "Editable template",
            "Beautifully designed",
        ],
    },
    {
        title: "Complete E-Book Bundle for Health Coaches",
        slug: "ebook-bundle-coaches",
        description: "Get all 5 of our bestselling e-books at a massive discount. Includes practitioner handbook, gut health guide, hormone guide, stress management guide, and recipe collection.",
        shortDescription: "All 5 bestselling e-books at 60% off",
        price: 97,
        compareAtPrice: 247,
        productType: "BUNDLE" as const,
        category: "ebooks",
        materialsCount: 5,
        isFeatured: true,
        isBestseller: true,
        sortOrder: 99,
        avgRating: 5.0,
        reviewCount: 43,
        bundleProductIds: [],
        bundleDiscount: 150,
        features: [
            "FM Practitioner's Handbook ($47 value)",
            "Gut Health Client E-Book ($27 value)",
            "Hormone Harmony Guide ($27 value)",
            "Stress & Adrenal Recovery Guide ($27 value)",
            "Anti-Inflammatory Recipe Collection ($27 value)",
            "All white-label ready",
            "Lifetime updates on all books",
        ],
        highlights: [
            "Save $150",
            "5 complete e-books",
            "Instant download",
            "Best value bundle",
        ],
    },
    {
        title: "Stress & Adrenal Recovery: Client Education Guide",
        slug: "stress-adrenal-ebook",
        description: "Help your clients understand the stress-health connection with this beautifully illustrated guide. Covers HPA axis, cortisol, adrenal fatigue, and recovery strategies.",
        shortDescription: "Stress and adrenal health education",
        price: 27,
        compareAtPrice: 47,
        productType: "EBOOK" as const,
        category: "ebooks",
        materialsCount: 1,
        isFeatured: false,
        isBestseller: false,
        sortOrder: 103,
        avgRating: 4.6,
        reviewCount: 34,
        features: [
            "45-page illustrated guide",
            "HPA axis explained simply",
            "Cortisol and stress connection",
            "Signs of adrenal dysfunction",
            "Recovery protocols",
            "Sleep optimization chapter",
            "White-label Canva template",
        ],
        highlights: [
            "Client-friendly explanations",
            "Professional graphics",
            "Editable template",
            "Instant credibility boost",
        ],
    },
];

async function seedEbooks() {
    console.log("📚 Seeding E-Book Products...");

    for (const product of EBOOK_PRODUCTS) {
        const existing = await prisma.dFYProduct.findUnique({
            where: { slug: product.slug },
        });

        if (existing) {
            console.log(`  ⏭️  Skipping ${product.title} (already exists)`);
            continue;
        }

        await prisma.dFYProduct.create({
            data: {
                ...product,
                price: product.price,
                compareAtPrice: product.compareAtPrice,
                bundleDiscount: product.bundleDiscount || null,
            },
        });
        console.log(`  ✅ Created: ${product.title}`);
    }

    // Update existing FM products with reviews
    console.log("\n⭐ Adding reviews to existing products...");
    const fmProducts = await prisma.dFYProduct.findMany({
        where: { category: "functional-medicine" },
    });

    const reviewData = [
        { avgRating: 4.9, reviewCount: 156 },
        { avgRating: 4.8, reviewCount: 234 },
        { avgRating: 4.7, reviewCount: 89 },
        { avgRating: 5.0, reviewCount: 67 },
        { avgRating: 4.8, reviewCount: 112 },
        { avgRating: 4.6, reviewCount: 78 },
        { avgRating: 4.9, reviewCount: 45 },
        { avgRating: 4.7, reviewCount: 93 },
        { avgRating: 4.8, reviewCount: 61 },
        { avgRating: 4.5, reviewCount: 34 },
        { avgRating: 4.9, reviewCount: 22 },
        { avgRating: 4.6, reviewCount: 18 },
    ];

    for (let i = 0; i < fmProducts.length; i++) {
        const product = fmProducts[i];
        const reviews = reviewData[i % reviewData.length];
        await prisma.dFYProduct.update({
            where: { id: product.id },
            data: reviews,
        });
        console.log(`  ⭐ Updated ${product.title}: ${reviews.avgRating}★ (${reviews.reviewCount} reviews)`);
    }

    console.log("\n🎉 Seeding complete!");
}

seedEbooks()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
