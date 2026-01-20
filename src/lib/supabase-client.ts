import { createClient } from "@supabase/supabase-js";

// Browser-side Supabase client for Realtime features
// Uses anon key (safe for client-side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Singleton pattern - reuse the same client
let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseClient && typeof window !== "undefined") {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10, // Rate limit for performance
        },
      },
    });
  }
  return supabaseClient;
}

// For direct import in hooks
export const supabase = typeof window !== "undefined"
  ? createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;
