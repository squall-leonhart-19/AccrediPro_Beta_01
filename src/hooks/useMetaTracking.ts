"use client";

import { useCallback, useEffect, useRef } from "react";

type EventType = "PageView" | "AddToCart" | "Lead" | "InitiateCheckout" | "ViewContent";

interface TrackOptions {
  email?: string;
  firstName?: string;
  value?: number;
  currency?: string;
  contentName?: string;
  contentName?: string;
  contentId?: string;
  pixelId?: string;
}

// Get Facebook cookies if available
function getFacebookCookies(): { fbc?: string; fbp?: string } {
  if (typeof document === "undefined") return {};

  const cookies = document.cookie.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split("=");
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  return {
    fbc: cookies._fbc,
    fbp: cookies._fbp,
  };
}

// Send tracking event to our API
async function trackEvent(eventType: EventType, options: TrackOptions = {}): Promise<boolean> {
  try {
    const { fbc, fbp } = getFacebookCookies();

    const response = await fetch("/api/meta/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType,
        sourceUrl: window.location.href,
        ...options,
        fbc,
        fbp,
      }),
    });

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error(`[Meta Track] Failed to send ${eventType}:`, error);
    return false;
  }
}

/**
 * Hook for Meta CAPI tracking
 *
 * Usage:
 * const { trackPageView, trackAddToCart } = useMetaTracking();
 *
 * // On page load
 * useEffect(() => { trackPageView("FM Certification"); }, []);
 *
 * // On CTA click
 * <button onClick={() => trackAddToCart("FM Certification", 197)}>Enroll</button>
 */
/**
 * Hook for Meta CAPI tracking
 * Supports optional pixelId override for multi-pixel setups.
 */
export function useMetaTracking() {
  const hasTrackedPageView = useRef(false);

  // Track PageView - automatically deduplicated per page load
  const trackPageView = useCallback((contentName?: string) => {
    if (hasTrackedPageView.current) return;
    hasTrackedPageView.current = true;
    trackEvent("PageView", { contentName });
  }, []);

  // Track AddToCart - when user clicks CTA to go to checkout
  const trackAddToCart = useCallback((contentName: string, value: number, contentId?: string) => {
    trackEvent("AddToCart", { contentName, value, contentId });
  }, []);

  // Track ViewContent - when user views specific content (like curriculum section)
  const trackViewContent = useCallback((contentName: string, contentId?: string, pixelId?: string) => {
    trackEvent("ViewContent", { contentName, contentId, pixelId });
  }, []);

  // Track InitiateCheckout - when user starts checkout process
  const trackInitiateCheckout = useCallback((contentName: string, value: number, contentId?: string) => {
    trackEvent("InitiateCheckout", { contentName, value, contentId });
  }, []);

  // Track Lead - when user provides contact info (exit popup, etc)
  const trackLead = useCallback((contentName: string, email?: string, firstName?: string, pixelId?: string) => {
    trackEvent("Lead", { contentName, email, firstName, pixelId });
  }, []);

  return {
    trackPageView,
    trackAddToCart,
    trackViewContent,
    trackInitiateCheckout,
    trackLead,
  };
}

/**
 * Hook that auto-tracks PageView on mount
 * Use this on sales pages for automatic PageView tracking
 */
export function usePageViewTracking(contentName: string) {
  const { trackPageView } = useMetaTracking();

  useEffect(() => {
    trackPageView(contentName);
  }, [contentName, trackPageView]);
}
