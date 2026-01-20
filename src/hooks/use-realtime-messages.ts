"use client";

import { useEffect, useRef, useCallback } from "react";
import { getSupabaseClient } from "@/lib/supabase-client";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  isRead: boolean;
  createdAt: Date;
  attachmentUrl?: string | null;
  attachmentType?: string | null;
  attachmentName?: string | null;
  voiceDuration?: number | null;
  isAiVoice?: boolean;
  transcription?: string | null;
  replyToId?: string | null;
  replyTo?: {
    id: string;
    content: string;
    senderId: string;
    attachmentType?: string | null;
  } | null;
  reactions?: { id: string; emoji: string; userId: string }[];
}

interface UseRealtimeMessagesOptions {
  currentUserId: string;
  otherUserId: string | null;
  onNewMessage: (message: Message) => void;
  onMessageUpdate?: (message: Partial<Message> & { id: string }) => void;
  onMessageDelete?: (messageId: string) => void;
  enabled?: boolean;
}

/**
 * Hook for real-time message updates via Supabase Realtime
 *
 * Subscribes to:
 * - INSERT: New messages in the conversation
 * - UPDATE: Message edits, read receipts, reactions
 * - DELETE: Message deletions
 */
export function useRealtimeMessages({
  currentUserId,
  otherUserId,
  onNewMessage,
  onMessageUpdate,
  onMessageDelete,
  enabled = true,
}: UseRealtimeMessagesOptions) {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const supabase = getSupabaseClient();

  // Cleanup function
  const cleanup = useCallback(() => {
    if (channelRef.current) {
      supabase?.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  }, [supabase]);

  useEffect(() => {
    // Don't subscribe if disabled or no conversation selected
    if (!enabled || !otherUserId || !currentUserId || !supabase) {
      cleanup();
      return;
    }

    // Create unique channel name for this conversation (sorted IDs for consistency)
    const [id1, id2] = [currentUserId, otherUserId].sort();
    const channelName = `messages:${id1}:${id2}`;

    // Cleanup previous subscription
    cleanup();

    // Subscribe to Message table changes
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Message",
          // Filter: only messages in this conversation
          filter: `or(and(senderId.eq.${currentUserId},receiverId.eq.${otherUserId}),and(senderId.eq.${otherUserId},receiverId.eq.${currentUserId}))`,
        },
        (payload) => {
          console.log("[REALTIME] New message:", payload.new);
          const newMessage = payload.new as Message;

          // Only process if it's a message TO us (avoid duplicating our own sends)
          if (newMessage.receiverId === currentUserId) {
            onNewMessage({
              ...newMessage,
              createdAt: new Date(newMessage.createdAt),
            });
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Message",
          filter: `or(and(senderId.eq.${currentUserId},receiverId.eq.${otherUserId}),and(senderId.eq.${otherUserId},receiverId.eq.${currentUserId}))`,
        },
        (payload) => {
          console.log("[REALTIME] Message updated:", payload.new);
          if (onMessageUpdate) {
            const updated = payload.new as Message;
            onMessageUpdate({
              ...updated,
              createdAt: new Date(updated.createdAt),
            });
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "Message",
        },
        (payload) => {
          console.log("[REALTIME] Message deleted:", payload.old);
          if (onMessageDelete) {
            onMessageDelete((payload.old as { id: string }).id);
          }
        }
      )
      .subscribe((status) => {
        console.log(`[REALTIME] Channel ${channelName} status:`, status);
      });

    channelRef.current = channel;

    // Cleanup on unmount or dependency change
    return cleanup;
  }, [currentUserId, otherUserId, enabled, supabase, onNewMessage, onMessageUpdate, onMessageDelete, cleanup]);

  return {
    isConnected: !!channelRef.current,
    disconnect: cleanup,
  };
}

/**
 * Hook for real-time notification updates
 * Useful for unread counts, badges, etc.
 */
export function useRealtimeNotifications({
  userId,
  onNewNotification,
  enabled = true,
}: {
  userId: string;
  onNewNotification: (notification: any) => void;
  enabled?: boolean;
}) {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const supabase = getSupabaseClient();

  useEffect(() => {
    if (!enabled || !userId || !supabase) return;

    const channelName = `notifications:${userId}`;

    // Cleanup previous
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Notification",
          filter: `userId=eq.${userId}`,
        },
        (payload) => {
          console.log("[REALTIME] New notification:", payload.new);
          onNewNotification(payload.new);
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [userId, enabled, supabase, onNewNotification]);
}
