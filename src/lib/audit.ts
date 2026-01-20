import prisma from "./prisma";
import { headers } from "next/headers";
import { AuditAction } from "@prisma/client";

interface AuditLogParams {
  userId: string;
  userEmail: string;
  userRole: string;
  action: AuditAction;
  entity: string;
  entityId?: string;
  details?: Record<string, unknown>;
}

/**
 * Log an audit event for sensitive admin actions
 * This is fire-and-forget - don't await to prevent blocking
 */
export async function logAudit({
  userId,
  userEmail,
  userRole,
  action,
  entity,
  entityId,
  details,
}: AuditLogParams): Promise<void> {
  try {
    // Get request context (IP, user agent)
    let ipAddress: string | null = null;
    let userAgent: string | null = null;

    try {
      const headersList = await headers();
      ipAddress =
        headersList.get("x-forwarded-for")?.split(",")[0] ||
        headersList.get("x-real-ip") ||
        null;
      userAgent = headersList.get("user-agent");
    } catch {
      // Headers might not be available in some contexts
    }

    await prisma.auditLog.create({
      data: {
        userId,
        userEmail,
        userRole,
        action,
        entity,
        entityId,
        details: details ? JSON.parse(JSON.stringify(details)) : undefined,
        ipAddress,
        userAgent,
      },
    });

    console.log(`[AUDIT] ${action} on ${entity}${entityId ? ` (${entityId})` : ""} by ${userEmail}`);
  } catch (error) {
    // Log error but don't throw - audit logging should never break main functionality
    console.error("[AUDIT] Failed to log audit event:", error);
  }
}

/**
 * Helper to create audit log from session
 */
export function createAuditLogger(session: {
  user: { id: string; email?: string | null; role: string };
}) {
  return (
    action: AuditAction,
    entity: string,
    entityId?: string,
    details?: Record<string, unknown>
  ) => {
    // Fire and forget - don't await
    logAudit({
      userId: session.user.id,
      userEmail: session.user.email || "unknown",
      userRole: session.user.role,
      action,
      entity,
      entityId,
      details,
    }).catch(() => {});
  };
}

// Re-export AuditAction for convenience
export { AuditAction };
