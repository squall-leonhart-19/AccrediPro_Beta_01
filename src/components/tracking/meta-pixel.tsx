'use client';

import Script from 'next/script';
import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const DEFAULT_PIXEL_ID = '1287915349067829'; // Royal Certified (Backend/Global)

export const PIXEL_CONFIG = {
    ROYAL_CERTIFIED: '1287915349067829',
    FUNCTIONAL_MEDICINE: '1829815637745689',
};

// Extend window type for Facebook Pixel
declare global {
    interface Window {
        fbq: (...args: unknown[]) => void;
        _fbq: unknown;
    }
}

// Helper to track custom events
export const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', eventName, params);
    }
};

// Helper to track custom events with custom names
export const trackCustomEvent = (eventName: string, params?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('trackCustom', eventName, params);
    }
};

// Time tracking helper
export const trackTimeSpent = (pageName: string, seconds: number) => {
    trackCustomEvent('TimeSpent', {
        page: pageName,
        seconds: seconds,
        minutes: Math.round(seconds / 60 * 10) / 10,
    });
};

// Scroll depth tracking helper
export const trackScrollDepth = (pageName: string, depth: number) => {
    trackCustomEvent('ScrollDepth', {
        page: pageName,
        depth: depth,
    });
};

// Video watch tracking helper
export const trackVideoWatch = (videoId: string, percentWatched: number, duration: number) => {
    trackCustomEvent('VideoWatch', {
        video_id: videoId,
        percent_watched: percentWatched,
        duration_seconds: duration,
    });
};

// Lead event (for sign-ups)
export const trackLead = (params?: { content_name?: string; content_category?: string; value?: number; currency?: string }) => {
    trackEvent('Lead', {
        content_name: params?.content_name || 'Mini Diploma Sign Up',
        content_category: params?.content_category || 'Free Course',
        value: params?.value || 0,
        currency: params?.currency || 'USD',
    });
};

// Complete Registration event
export const trackCompleteRegistration = (params?: { content_name?: string; status?: string; value?: number }) => {
    trackEvent('CompleteRegistration', {
        content_name: params?.content_name || 'Account Created',
        status: params?.status || 'completed',
        value: params?.value || 0,
        currency: 'USD',
    });
};

// Purchase event (for course purchases)
export const trackPurchase = (params: { value: number; currency?: string; content_name?: string; content_ids?: string[] }) => {
    trackEvent('Purchase', {
        value: params.value,
        currency: params.currency || 'USD',
        content_name: params.content_name,
        content_ids: params.content_ids,
        content_type: 'product',
    });
};

// View Content event
export const trackViewContent = (params: { content_name: string; content_category?: string; content_ids?: string[]; value?: number }) => {
    trackEvent('ViewContent', {
        content_name: params.content_name,
        content_category: params.content_category,
        content_ids: params.content_ids,
        content_type: 'product',
        value: params.value || 0,
        currency: 'USD',
    });
};

// Add to Cart event (for checkout initiation)
export const trackAddToCart = (params: { content_name: string; content_ids?: string[]; value: number; currency?: string }) => {
    trackEvent('AddToCart', {
        content_name: params.content_name,
        content_ids: params.content_ids,
        content_type: 'product',
        value: params.value,
        currency: params.currency || 'USD',
    });
};

// Initiate Checkout event
export const trackInitiateCheckout = (params: { content_name: string; value: number; currency?: string; num_items?: number }) => {
    trackEvent('InitiateCheckout', {
        content_name: params.content_name,
        value: params.value,
        currency: params.currency || 'USD',
        num_items: params.num_items || 1,
    });
};

export default function MetaPixel({ pixelId = DEFAULT_PIXEL_ID }: { pixelId?: string }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const pageStartTime = useRef<number>(Date.now());
    const scrollMilestones = useRef<Set<number>>(new Set());

    // Track page views on route change
    useEffect(() => {
        if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('track', 'PageView');
        }

        // Reset time tracking for new page
        pageStartTime.current = Date.now();
        scrollMilestones.current = new Set();
    }, [pathname, searchParams]);

    // Track time spent on page
    useEffect(() => {
        const trackTimeInterval = setInterval(() => {
            const timeSpent = Math.floor((Date.now() - pageStartTime.current) / 1000);

            // Track at specific milestones: 30s, 60s, 120s, 300s, 600s
            const milestones = [30, 60, 120, 300, 600];
            milestones.forEach(milestone => {
                if (timeSpent >= milestone && !scrollMilestones.current.has(-milestone)) {
                    scrollMilestones.current.add(-milestone); // Using negative to differentiate time milestones
                    trackCustomEvent('TimeOnPage', {
                        page: pathname,
                        seconds: milestone,
                        milestone: `${milestone}s`,
                    });
                }
            });
        }, 5000);

        // Track time on page unload
        const handleUnload = () => {
            const timeSpent = Math.floor((Date.now() - pageStartTime.current) / 1000);
            if (timeSpent > 5) {
                trackTimeSpent(pathname, timeSpent);
            }
        };

        window.addEventListener('beforeunload', handleUnload);

        return () => {
            clearInterval(trackTimeInterval);
            window.removeEventListener('beforeunload', handleUnload);
            handleUnload();
        };
    }, [pathname]);

    // Track scroll depth
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.round((scrollTop / docHeight) * 100);

            // Track at 25%, 50%, 75%, 100%
            const milestones = [25, 50, 75, 100];
            milestones.forEach(milestone => {
                if (scrollPercent >= milestone && !scrollMilestones.current.has(milestone)) {
                    scrollMilestones.current.add(milestone);
                    trackScrollDepth(pathname, milestone);
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [pathname]);

    return (
        <>
            {/* Meta Pixel Base Code */}
            <Script
                id="meta-pixel-base"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `,
                }}
            />
            {/* Fallback noscript pixel */}
            <noscript>
                <img
                    height="1"
                    width="1"
                    style={{ display: 'none' }}
                    src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
                    alt=""
                />
            </noscript>
        </>
    );
}
