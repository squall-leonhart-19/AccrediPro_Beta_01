"use client";

import { FloatingMentorChat } from "./floating-mentor-chat";

/**
 * Client-side wrapper for the floating mentor chat
 * Allows server components to include the chat widget
 */
export function FloatingMentorChatWrapper() {
    return <FloatingMentorChat />;
}
