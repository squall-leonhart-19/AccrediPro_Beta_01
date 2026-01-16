"use client";

import { SessionProvider } from "next-auth/react";
import { FloatingMentorChat } from "./floating-mentor-chat";

/**
 * Client-side wrapper for the floating mentor chat
 * Includes SessionProvider to ensure useSession works in any layout
 * Allows server components to include the chat widget
 */
export function FloatingMentorChatWrapper() {
    return (
        <SessionProvider>
            <FloatingMentorChat />
        </SessionProvider>
    );
}
