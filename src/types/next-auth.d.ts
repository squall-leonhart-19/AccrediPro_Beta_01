import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      userType?: "LEAD" | "STUDENT";
      firstName: string | null;
      lastName: string | null;
      isFirstLogin?: boolean;
      hasCompletedOnboarding?: boolean;
      miniDiplomaCategory?: string | null;
      miniDiplomaCourseSlug?: string | null;
      isMiniDiplomaOnly?: boolean;
      isFMPreviewOnly?: boolean;
      accessExpiresAt?: string | null;
      hasFMCertification?: boolean;
      // Impersonation fields
      isImpersonating?: boolean;
      originalAdminId?: string;
      originalAdminName?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
    userType?: "LEAD" | "STUDENT";
    firstName: string | null;
    lastName: string | null;
    isFirstLogin?: boolean;
    hasCompletedOnboarding?: boolean;
    miniDiplomaCategory?: string | null;
    miniDiplomaCourseSlug?: string | null;
    isMiniDiplomaOnly?: boolean;
    isFMPreviewOnly?: boolean;
    accessExpiresAt?: string | null;
    hasFMCertification?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
    userType?: "LEAD" | "STUDENT";
    firstName: string | null;
    lastName: string | null;
    isFirstLogin?: boolean;
    hasCompletedOnboarding?: boolean;
    miniDiplomaCategory?: string | null;
    miniDiplomaCourseSlug?: string | null;
    isMiniDiplomaOnly?: boolean;
    isFMPreviewOnly?: boolean;
    accessExpiresAt?: string | null;
    hasFMCertification?: boolean;
    // Impersonation fields
    isImpersonating?: boolean;
    originalAdminId?: string;
    originalAdminRole?: string;
    originalAdminName?: string;
  }
}
