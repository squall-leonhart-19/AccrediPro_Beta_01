import { MetadataRoute } from "next";

const BASE_URL = "https://accredipro.academy";

/**
 * Public sitemap - Marketing pages only
 *
 * NOTE: We intentionally exclude dynamic course/professional pages
 * to prevent competitors from scraping our full catalog.
 * Google will still discover and index individual pages through internal links.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static marketing pages only - no database queries
    const staticPages: MetadataRoute.Sitemap = [
        // Homepage & Core
        { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
        { url: `${BASE_URL}/certifications`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
        { url: `${BASE_URL}/fm-certification`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },

        // Certification category pages (public knowledge)
        { url: `${BASE_URL}/certifications/functional-medicine`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
        { url: `${BASE_URL}/certifications/gut-health`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
        { url: `${BASE_URL}/certifications/womens-health`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
        { url: `${BASE_URL}/certifications/nutrition`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },

        // Lead Magnet pages (public - we WANT these indexed)
        { url: `${BASE_URL}/fm-mini-diploma`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
        { url: `${BASE_URL}/gut-health-mini-diploma`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
        { url: `${BASE_URL}/womens-health-mini-diploma`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
        { url: `${BASE_URL}/holistic-nutrition-mini-diploma`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
        { url: `${BASE_URL}/integrative-health-mini-diploma`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
        { url: `${BASE_URL}/roots-method`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },

        // Trust & Authority pages
        { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
        { url: `${BASE_URL}/accreditation`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
        { url: `${BASE_URL}/standards`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
        { url: `${BASE_URL}/leadership`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
        { url: `${BASE_URL}/directory`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
        { url: `${BASE_URL}/testimonials`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
        { url: `${BASE_URL}/success-stories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },

        // Career/conversion pages
        { url: `${BASE_URL}/career-paths`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
        { url: `${BASE_URL}/salary-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
        { url: `${BASE_URL}/how-it-works`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
        { url: `${BASE_URL}/apply`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },

        // Info pages
        { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
        { url: `${BASE_URL}/job-board`, lastModified: new Date(), changeFrequency: "daily", priority: 0.5 },
        { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },

        // Legal pages
        { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
        { url: `${BASE_URL}/terms-of-service`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
        { url: `${BASE_URL}/refund-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
        { url: `${BASE_URL}/code-of-ethics`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    ];

    // NOTE: Dynamic course/professional pages are NOT included here
    // to prevent competitors from seeing our full catalog.
    // Google will still index them via internal links.

    return staticPages;
}
