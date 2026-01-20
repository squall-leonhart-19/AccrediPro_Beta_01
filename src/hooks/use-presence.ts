"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getSupabaseClient } from "@/lib/supabase-client";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface PresenceState {
  odorUserId: string;
  isOnline: boolean;
  isTyping: boolean;
  lastSeen: Date | null;
}

interface UsePresenceOptions {
  currentUserId: string;
  otherUserId: string | null;
  conversationId?: string;
  enabled?: boolean;
}

/**
 * Hook for real-time presence and typing indicators
 *
 * Uses Supabase Realtime Presence feature:
 * - Track who's online
 * - Show "typing..." indicator
 * - Show "last seen" time
 */
export function usePresence({
  currentUserId,
  otherUserId,
  enabled = true,
}: UsePresenceOptions) {
  const [otherUserOnline, setOtherUserOnline] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [lastSeen, setLastSeen] = useState<Date | null>(null);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const supabase = getSupabaseClient();

  // Broadcast that we're typing
  const setTyping = useCallback((isTyping: boolean) => {
    if (!channelRef.current) return;

    channelRef.current.track({
      odorUserId: currentUserId,
      isTyping,
      lastActive: new Date().toISOString(),
    });

    // Auto-clear typing after 3 seconds of no input
    if (isTyping) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        channelRef.current?.track({
          odorUserId: currentUserId,
          isTyping: false,
          lastActive: new Date().toISOString(),
        });
      }, 3000);
    }
  }, [currentUserId]);

  useEffect(() => {
    if (!enabled || !otherUserId || !currentUserId || !supabase) {
      return;
    }

    // Create consistent room name for the conversation
    const [id1, id2] = [currentUserId, otherUserId].sort();
    const roomName = `presence:${id1}:${id2}`;

    // Cleanup previous channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase.channel(roomName, {
      config: {
        presence: {
          key: currentUserId,
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        console.log("[PRESENCE] Sync:", state);

        // Check if other user is present
        const otherUserPresence = state[otherUserId];
        if (otherUserPresence && otherUserPresence.length > 0) {
          const latest = otherUserPresence[0] as any;
          setOtherUserOnline(true);
          setOtherUserTyping(latest.isTyping || false);
          if (latest.lastActive) {
            setLastSeen(new Date(latest.lastActive));
          }
        } else {
          setOtherUserOnline(false);
          setOtherUserTyping(false);
        }
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log("[PRESENCE] Join:", key, newPresences);
        if (key === otherUserId) {
          setOtherUserOnline(true);
          const latest = newPresences[0] as any;
          if (latest) {
            setOtherUserTyping(latest.isTyping || false);
          }
        }
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        console.log("[PRESENCE] Leave:", key, leftPresences);
        if (key === otherUserId) {
          setOtherUserOnline(false);
          setOtherUserTyping(false);
          // Update last seen to now
          setLastSeen(new Date());
        }
      })
      .subscribe(async (status) => {
        console.log("[PRESENCE] Channel status:", status);
        if (status === "SUBSCRIBED") {
          // Track our presence
          await channel.track({
            odorUserId: currentUserId,
            isTyping: false,
            lastActive: new Date().toISOString(),
          });
        }
      });

    channelRef.current = channel;

    // Cleanup
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [currentUserId, otherUserId, enabled, supabase]);

  return {
    otherUserOnline,
    otherUserTyping,
    lastSeen,
    setTyping,
  };
}

/**
 * Global presence - track online status across the app
 */
export function useGlobalPresence({
  userId,
  enabled = true,
}: {
  userId: string;
  enabled?: boolean;
}) {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const supabase = getSupabaseClient();

  useEffect(() => {
    if (!enabled || !userId || !supabase) return;

    const channel = supabase.channel("global-presence", {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const online = new Set(Object.keys(state));
        setOnlineUsers(online);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            online_at: new Date().toISOString(),
          });
        }
      });

    channelRef.current = channel;

    // Send heartbeat every 30s to stay in presence
    const heartbeat = setInterval(() => {
      if (channelRef.current && !document.hidden) {
        channelRef.current.track({
          online_at: new Date().toISOString(),
        });
      }
    }, 30000);

    return () => {
      clearInterval(heartbeat);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [userId, enabled, supabase]);

  const isOnline = useCallback((checkUserId: string) => {
    return onlineUsers.has(checkUserId);
  }, [onlineUsers]);

  return {
    onlineUsers,
    isOnline,
    onlineCount: onlineUsers.size,
  };
}
