import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import prisma from "./prisma";
import { headers } from "next/headers";
import { triggerAutoMessage } from "./auto-messages";
import { lookupIpLocation } from "./ip-geolocation";

// Helper to parse user agent
function parseUserAgent(ua: string | null) {
  if (!ua) return { device: "Unknown", browser: "Unknown" };

  let device = "Desktop";
  if (/mobile/i.test(ua)) device = "Mobile";
  else if (/tablet|ipad/i.test(ua)) device = "Tablet";

  let browser = "Unknown";
  if (/chrome/i.test(ua) && !/edge|edg/i.test(ua)) browser = "Chrome";
  else if (/firefox/i.test(ua)) browser = "Firefox";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
  else if (/edge|edg/i.test(ua)) browser = "Edge";
  else if (/opera|opr/i.test(ua)) browser = "Opera";

  return { device, browser };
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("[AUTH] Login attempt for:", credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.log("[AUTH] Missing credentials");
          throw new Error("Invalid credentials");
        }

        const email = credentials.email.toLowerCase();
        console.log("[AUTH] Looking up user:", email);

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            passwordHash: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
            firstLoginAt: true,
            hasCompletedOnboarding: true, // For Start Here visibility
            miniDiplomaCategory: true,
            accessExpiresAt: true,
            marketingTags: {
              include: { tag: true },
            },
            tags: true, // UserTag - simple string tags from admin create
          },
        });

        if (!user) {
          console.log("[AUTH] User not found:", email);
          throw new Error("Invalid credentials");
        }

        if (!user.passwordHash) {
          console.log("[AUTH] User has no passwordHash:", email);
          throw new Error("Invalid credentials");
        }

        console.log("[AUTH] User found:", {
          id: user.id,
          email: user.email,
          isActive: user.isActive,
          hashLength: user.passwordHash?.length,
          hashPrefix: user.passwordHash?.substring(0, 7),
        });

        if (!user.isActive) {
          console.log("[AUTH] Account deactivated:", email);
          throw new Error("Account is deactivated");
        }

        let isPasswordValid = false;
        try {
          console.log("[AUTH] Comparing password...");
          isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );
          console.log("[AUTH] Password valid:", isPasswordValid);
        } catch (bcryptError) {
          console.error("[AUTH] bcrypt.compare error:", bcryptError, {
            email: credentials.email,
            hashLength: user.passwordHash?.length,
            hashPrefix: user.passwordHash?.substring(0, 10),
          });
          throw new Error("Password verification failed");
        }

        if (!isPasswordValid) {
          console.log("[AUTH] Invalid password for:", email);
          throw new Error("Invalid credentials");
        }

        // Check if this is the first login
        const isFirstLogin = !user.firstLoginAt;
        const now = new Date();

        // Get request headers for login tracking (moved before user update for registration evidence)
        let ipAddress: string | null = null;
        let userAgent: string | null = null;
        try {
          const headersList = await headers();
          ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] ||
            headersList.get("x-real-ip") ||
            null;
          userAgent = headersList.get("user-agent");
        } catch {
          // Headers might not be available in some contexts
        }

        const { device, browser } = parseUserAgent(userAgent);

        // Update user login stats - fire and forget (don't await to prevent timeout)
        prisma.user.update({
          where: { id: user.id },
          data: {
            lastLoginAt: now,
            firstLoginAt: isFirstLogin ? now : undefined,
            loginCount: { increment: 1 },
            // On first login: capture registration data and TOS acceptance
            ...(isFirstLogin && {
              registrationIp: ipAddress,
              registrationUserAgent: userAgent,
              registrationDevice: device,
              registrationBrowser: browser,
              tosAcceptedAt: now,
              tosVersion: "1.0",
              refundPolicyAcceptedAt: now,
              refundPolicyVersion: "1.0",
            }),
          },
          select: { id: true },
        }).then(() => {
          console.log("[AUTH] Login stats updated for:", user.id);
        }).catch((err) => {
          console.error("[AUTH] Failed to update login stats:", err);
        });

        // Create login history record with geolocation - fire and forget
        lookupIpLocation(ipAddress).then((geo) => {
          return prisma.loginHistory.create({
            data: {
              userId: user.id,
              ipAddress,
              userAgent,
              device,
              browser,
              isFirstLogin,
              loginMethod: "credentials",
              location: geo.city && geo.country ? `${geo.city}, ${geo.country}` : null,
              country: geo.country,
              countryCode: geo.countryCode,
            },
          });
        }).then(() => {
          console.log("[AUTH] Login history created with geo for:", user.id);
        }).catch((err) => {
          console.error("[AUTH] Failed to create login history:", err);
        });

        // Send welcome message on first login
        if (isFirstLogin) {
          console.log(`[AUTH] First login detected for user ${user.id} (${user.email})`);
          triggerAutoMessage({
            userId: user.id,
            trigger: "first_login",
          }).catch((err) => {
            console.error(`[AUTH] Failed to send welcome message:`, err);
          });
        }

        // Check mini diploma status for LEAD users
        let miniDiplomaCourseSlug: string | null = null;
        if (user.miniDiplomaCategory) {
          // Map category to course slug
          const categoryToSlug: Record<string, string> = {
            "womens-health": "womens-health-mini-diploma",
            "functional-medicine": "fm-mini-diploma",
          };
          miniDiplomaCourseSlug = categoryToSlug[user.miniDiplomaCategory] || null;
        }

        // Check if user has FM certification tag for My Circle access
        // Check both UserMarketingTag (relational) and UserTag (simple string) tables
        const hasFMCertification =
          user.marketingTags?.some(
            (t) => t.tag.slug === "functional_medicine_complete_certification_purchased"
          ) ||
          user.tags?.some(
            (t) => t.tag === "functional_medicine_complete_certification_purchased"
          ) || false;

        // Note: Don't include image/avatar in JWT - it can cause token size issues
        // Avatar is fetched separately when needed
        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
          image: null, // Removed to prevent JWT bloat
          role: user.role,
          userType: (user as any).userType || "STUDENT",
          firstName: user.firstName,
          lastName: user.lastName,
          isFirstLogin,
          hasCompletedOnboarding: user.hasCompletedOnboarding || false, // For Start Here visibility
          miniDiplomaCategory: user.miniDiplomaCategory || null,
          miniDiplomaCourseSlug,
          accessExpiresAt: (user as any).accessExpiresAt?.toISOString() || null,
          hasFMCertification,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      // On initial login: set user data
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.userType = user.userType;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.isFirstLogin = user.isFirstLogin;
        token.hasCompletedOnboarding = user.hasCompletedOnboarding;
        token.miniDiplomaCategory = user.miniDiplomaCategory;
        token.miniDiplomaCourseSlug = user.miniDiplomaCourseSlug;
        token.accessExpiresAt = user.accessExpiresAt;
        token.hasFMCertification = user.hasFMCertification;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.userType = token.userType as "LEAD" | "STUDENT" | undefined;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.isFirstLogin = token.isFirstLogin as boolean;
        session.user.hasCompletedOnboarding = token.hasCompletedOnboarding as boolean;
        session.user.miniDiplomaCategory = token.miniDiplomaCategory as string | null;
        session.user.miniDiplomaCourseSlug = token.miniDiplomaCourseSlug as string | null;
        session.user.accessExpiresAt = token.accessExpiresAt as string | null;
        session.user.hasFMCertification = token.hasFMCertification as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
