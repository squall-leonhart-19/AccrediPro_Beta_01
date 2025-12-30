import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Chat Cleanup Cron Job
 * 
 * Runs daily to clean up old sales chat data:
 * - Deletes chats older than 90 days for non-converted visitors
 * - Keeps chats from converted customers (email exists in User table)
 * 
 * Schedule: Daily at 3 AM UTC (configured in vercel.json)
 */

export async function GET() {
    const startTime = Date.now();
    console.log("[CHAT-CLEANUP] Starting daily chat cleanup...");

    try {
        // Calculate cutoff date (90 days ago)
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 90);

        console.log(`[CHAT-CLEANUP] Cutoff date: ${cutoffDate.toISOString()}`);

        // Get all unique visitor emails from old chats
        const oldChats = await prisma.salesChat.findMany({
            where: {
                createdAt: { lt: cutoffDate }
            },
            select: {
                id: true,
                visitorId: true,
                visitorEmail: true,
                createdAt: true
            }
        });

        console.log(`[CHAT-CLEANUP] Found ${oldChats.length} messages older than 90 days`);

        if (oldChats.length === 0) {
            return NextResponse.json({
                success: true,
                message: "No old chats to clean up",
                deleted: 0,
                preserved: 0,
                duration: Date.now() - startTime
            });
        }

        // Get unique visitor emails that are NOT null
        const visitorEmails = [...new Set(
            oldChats
                .map(chat => chat.visitorEmail)
                .filter((email): email is string => email !== null && email !== undefined)
        )];

        console.log(`[CHAT-CLEANUP] Found ${visitorEmails.length} unique visitor emails to check`);

        // Check which emails exist in User table (converted customers)
        const convertedUsers = await prisma.user.findMany({
            where: {
                email: { in: visitorEmails }
            },
            select: { email: true }
        });

        const convertedEmails = new Set(convertedUsers.filter(u => u.email).map(u => u.email!.toLowerCase()));
        console.log(`[CHAT-CLEANUP] Found ${convertedEmails.size} converted customers`);

        // Separate chats to delete vs preserve
        const chatsToDelete: string[] = [];
        const chatsToPreserve: string[] = [];

        for (const chat of oldChats) {
            const email = chat.visitorEmail?.toLowerCase();
            if (email && convertedEmails.has(email)) {
                chatsToPreserve.push(chat.id);
            } else {
                chatsToDelete.push(chat.id);
            }
        }

        console.log(`[CHAT-CLEANUP] Will delete ${chatsToDelete.length} chats, preserve ${chatsToPreserve.length}`);

        // Delete old chats from non-converted visitors
        if (chatsToDelete.length > 0) {
            const deleteResult = await prisma.salesChat.deleteMany({
                where: {
                    id: { in: chatsToDelete }
                }
            });
            console.log(`[CHAT-CLEANUP] ✅ Deleted ${deleteResult.count} old chat messages`);
        }

        // Also clean up old ChatOptin records (90+ days, no corresponding User)
        const oldOptins = await prisma.chatOptin.findMany({
            where: {
                createdAt: { lt: cutoffDate }
            },
            select: {
                id: true,
                email: true
            }
        });

        const optinEmailsToCheck = oldOptins
            .filter(o => o.email)
            .map(o => o.email as string);

        const convertedOptinUsers = await prisma.user.findMany({
            where: {
                email: { in: optinEmailsToCheck }
            },
            select: { email: true }
        });

        const convertedOptinEmails = new Set(convertedOptinUsers.filter(u => u.email).map(u => u.email!.toLowerCase()));

        const optinsToDelete = oldOptins.filter(o => {
            const email = o.email?.toLowerCase();
            return !email || !convertedOptinEmails.has(email);
        });

        if (optinsToDelete.length > 0) {
            await prisma.chatOptin.deleteMany({
                where: {
                    id: { in: optinsToDelete.map(o => o.id) }
                }
            });
            console.log(`[CHAT-CLEANUP] ✅ Deleted ${optinsToDelete.length} old opt-in records`);
        }

        const duration = Date.now() - startTime;
        console.log(`[CHAT-CLEANUP] ✅ Cleanup completed in ${duration}ms`);

        return NextResponse.json({
            success: true,
            message: "Chat cleanup completed",
            deleted: chatsToDelete.length,
            preserved: chatsToPreserve.length,
            optinsDeleted: optinsToDelete.length,
            duration
        });

    } catch (error) {
        console.error("[CHAT-CLEANUP] ❌ Error during cleanup:", error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
