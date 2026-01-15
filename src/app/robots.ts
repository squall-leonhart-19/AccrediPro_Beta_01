import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = "https://accredipro.academy";

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    // Auth & Private routes
                    "/api/",
                    "/admin/",
                    "/dashboard/",
                    "/my-courses/",
                    "/my-learning/",
                    "/messages/",
                    "/settings/",
                    "/coach-portal/",

                    // Internal/test pages
                    "/test-*",
                    "/chat-test/",
                    "/voice-test/",
                    "/preview-lesson/",
                    "/fm-test-*/",
                    "/sentry-example-page/",

                    // Thank you pages (no value for SEO)
                    "/*/thank-you/",
                    "/check-email/",

                    // Learning paths (require auth)
                    "/learning/",
                    "/courses/*/learn/",

                    // Verification/internal
                    "/verify/",
                    "/ticket-feedback/",
                ],
            },
            {
                // Allow AI crawlers for AEO
                userAgent: "GPTBot",
                allow: [
                    "/",
                    "/certifications/",
                    "/about/",
                    "/fm-certification/",
                    "/directory/",
                    "/blog/",
                    "/career-paths/",
                    "/salary-guide/",
                    "/llms.txt",
                ],
                disallow: [
                    "/api/",
                    "/admin/",
                    "/dashboard/",
                ],
            },
            {
                userAgent: "ChatGPT-User",
                allow: [
                    "/",
                    "/certifications/",
                    "/about/",
                    "/llms.txt",
                ],
                disallow: [
                    "/api/",
                    "/admin/",
                ],
            },
            {
                userAgent: "Google-Extended",
                allow: "/",
                disallow: [
                    "/api/",
                    "/admin/",
                ],
            },
            {
                userAgent: "PerplexityBot",
                allow: [
                    "/",
                    "/certifications/",
                    "/llms.txt",
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
