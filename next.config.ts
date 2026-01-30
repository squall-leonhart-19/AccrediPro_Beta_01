import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

// Bundle analyzer (run: npm run build:analyze)
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

// PWA configuration
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  // Import custom service worker for push notifications
  importScripts: ["/sw-push.js"],
  fallbacks: {
    document: "/offline",
  },
  runtimeCaching: [
    {
      // Cache lesson pages for offline access
      urlPattern: /^https:\/\/learn\.accredipro\.academy\/learning\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "lesson-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },
    {
      // Cache images
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "image-cache",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },
    {
      // Cache fonts
      urlPattern: /\.(?:woff|woff2|ttf|otf|eot)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "font-cache",
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
      },
    },
    {
      // Cache API responses (stale-while-revalidate)
      urlPattern: /^https:\/\/learn\.accredipro\.academy\/api\/.*/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "api-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 5, // 5 minutes
        },
      },
    },
    {
      // Cache static assets
      urlPattern: /^https:\/\/learn\.accredipro\.academy\/_next\/static\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "static-cache",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
      },
    },
  ],
});

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Redirect old diploma URLs to new unified portal
  async redirects() {
    const diplomaSlugs = [
      'functional-medicine',
      'womens-health',
      'womens-hormone-health',
      'gut-health',
      'hormone-health',
      'holistic-nutrition',
      'nurse-coach',
      'health-coach',
      'spiritual-healing',
      'energy-healing',
      'christian-coaching',
      'reiki-healing',
      'adhd-coaching',
      'pet-nutrition',
    ];

    return diplomaSlugs.map(slug => ({
      source: `/${slug}-diploma/:path*`,
      destination: `/portal/${slug}/:path*`,
      permanent: true,
    }));
  },
  // Security headers for all routes
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            // Content Security Policy - allows necessary resources while blocking XSS
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Scripts: self + inline for Next.js + Sentry + analytics + Facebook Pixel + Trustpilot + Wistia
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.sentry.io https://*.google-analytics.com https://*.googletagmanager.com https://js.stripe.com https://connect.facebook.net https://widget.trustpilot.com https://fast.wistia.com https://*.wistia.com",
              // Styles: self + inline for dynamic styles
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Images: various CDNs and blob for local processing + Facebook
              "img-src 'self' data: blob: https: http: https://*.accredipro.academy",
              // Fonts: Google Fonts + self
              "font-src 'self' https://fonts.gstatic.com data:",
              // Connect: APIs + ... + Trustpilot + Wistia
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.sentry.io https://*.google-analytics.com https://api.stripe.com https://elevenlabs.io https://api.openai.com https://api.anthropic.com https://*.facebook.com https://*.facebook.net https://pub-bc3849663dc849e59aee2d3c517f51e1.r2.dev https://*.accredipro.academy https://fonts.googleapis.com https://fonts.gstatic.com https://images.unsplash.com https://i.pravatar.cc https://api.dicebear.com https://randomuser.me https://widget.trustpilot.com https://*.wistia.com https://*.wistia.net",
              // Frames: Stripe + ... + Trustpilot + Wistia
              "frame-src 'self' https://js.stripe.com https://www.youtube.com https://player.vimeo.com https://*.facebook.com https://widget.trustpilot.com https://fast.wistia.net https://*.wistia.net https://*.wistia.com",
              // Media: self + Supabase storage for audio/video + Wistia
              "media-src 'self' blob: https://*.supabase.co https://*.wistia.com https://*.wistia.net https://embed-ssl.wistia.com",
              // Workers: allow blob for PWA and other workers
              "worker-src 'self' blob:",
              // Objects: none (no Flash, etc)
              "object-src 'none'",
              // Base URI: self only
              "base-uri 'self'",
              // Form actions: self only
              "form-action 'self'",
              // Frame ancestors: none (same as X-Frame-Options DENY)
              "frame-ancestors 'none'",
              // Upgrade insecure requests
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "coach.accredipro.academy",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "accredipro.academy",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
        pathname: "/api/portraits/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        // Cloudflare R2 public bucket for course thumbnails and PDFs
        protocol: "https",
        hostname: "pub-bc3849663dc849e59aee2d3c517f51e1.r2.dev",
        pathname: "/**",
      },
      {
        // Cloudflare R2 custom domain
        protocol: "https",
        hostname: "assets.accredipro.academy",
        pathname: "/**",
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Fix Turbopack workspace root detection
  // turbopack: {
  //   root: process.cwd(),
  // },
};

export default withSentryConfig(withPWA(withBundleAnalyzer(nextConfig)), {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "accredipro",

  project: "accredipro-lms",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
// Sun Jan  4 03:23:01 CET 2026
