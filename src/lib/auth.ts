import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import prisma from "./prisma";
import { headers } from "next/headers";
import { triggerAutoMessage } from "./auto-messages";

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
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          throw new Error("Invalid credentials");
        }

        if (!user.isActive) {
          throw new Error("Account is deactivated");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        // Check if this is the first login
        const isFirstLogin = !user.firstLoginAt;
        const now = new Date();

        // Update user login stats
        await prisma.user.update({
          where: { id: user.id },
          data: {
            lastLoginAt: now,
            firstLoginAt: isFirstLogin ? now : undefined,
            loginCount: { increment: 1 },
          },
        });

        // Get request headers for login tracking
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

        // Create login history record
        await prisma.loginHistory.create({
          data: {
            userId: user.id,
            ipAddress,
            userAgent,
            device,
            browser,
            isFirstLogin,
            loginMethod: "credentials",
          },
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

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
          image: user.avatar,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          isFirstLogin,
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
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.isFirstLogin = user.isFirstLogin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.isFirstLogin = token.isFirstLogin as boolean;
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
