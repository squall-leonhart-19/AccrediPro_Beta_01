// ============================================
// META TRACKING - FRONTEND UTILITY
// ============================================
// Add this to your landing pages to capture Meta tracking data
// ============================================

/**
 * MetaTracking - Captures and manages Meta (Facebook) tracking parameters
 * for server-side conversion tracking via Conversions API
 */
class MetaTracking {
    private static STORAGE_KEY = 'meta_tracking';

    /**
     * Initialize tracking - call this on page load
     * Captures fbclid from URL and reads existing cookies
     */
    static init(): void {
        const params = this.captureFromUrl();
        const cookies = this.captureFromCookies();

        // Merge with existing stored data (don't overwrite if already have fbclid)
        const existing = this.getStoredData();
        const merged = {
            ...existing,
            ...cookies,
            ...(params.fbclid ? params : {}), // Only overwrite if we have a new fbclid
            captured_at: new Date().toISOString(),
        };

        this.storeData(merged);
        console.log('[MetaTracking] Initialized:', merged);
    }

    /**
     * Capture fbclid from URL parameters
     */
    static captureFromUrl(): { fbclid?: string } {
        const urlParams = new URLSearchParams(window.location.search);
        const fbclid = urlParams.get('fbclid');
        return fbclid ? { fbclid } : {};
    }

    /**
     * Capture _fbc and _fbp cookies set by Meta Pixel
     */
    static captureFromCookies(): { fbc?: string; fbp?: string } {
        const getCookie = (name: string): string | undefined => {
            const match = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
            return match ? match.pop() : undefined;
        };

        return {
            fbc: getCookie('_fbc'),
            fbp: getCookie('_fbp'),
        };
    }

    /**
     * Store tracking data in localStorage
     */
    static storeData(data: Record<string, unknown>): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('[MetaTracking] Could not store data:', e);
        }
    }

    /**
     * Get stored tracking data
     */
    static getStoredData(): Record<string, unknown> {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.warn('[MetaTracking] Could not read stored data:', e);
            return {};
        }
    }

    /**
     * Get all tracking data needed for API calls
     * Call this when submitting forms or tracking events
     */
    static getTrackingData(): {
        fbclid?: string;
        fbc?: string;
        fbp?: string;
        event_source_url: string;
        user_agent: string;
    } {
        const stored = this.getStoredData();
        const cookies = this.captureFromCookies(); // Get fresh cookie values

        return {
            fbclid: stored.fbclid as string | undefined,
            fbc: cookies.fbc || (stored.fbc as string | undefined),
            fbp: cookies.fbp || (stored.fbp as string | undefined),
            event_source_url: window.location.href,
            user_agent: navigator.userAgent,
        };
    }

    /**
     * Get tracking data as hidden form fields
     * Use this to add tracking to your forms automatically
     */
    static getFormFields(): Record<string, string> {
        const data = this.getTrackingData();
        const fields: Record<string, string> = {
            event_source_url: data.event_source_url,
            user_agent: data.user_agent,
        };

        if (data.fbclid) fields.fbclid = data.fbclid;
        if (data.fbc) fields.fbc = data.fbc;
        if (data.fbp) fields.fbp = data.fbp;

        return fields;
    }

    /**
     * Inject hidden fields into a form element
     * @param formSelector - CSS selector for the form
     */
    static injectIntoForm(formSelector: string): void {
        const form = document.querySelector(formSelector) as HTMLFormElement;
        if (!form) {
            console.warn(`[MetaTracking] Form not found: ${formSelector}`);
            return;
        }

        const fields = this.getFormFields();
        Object.entries(fields).forEach(([name, value]) => {
            // Remove existing field if present
            const existing = form.querySelector(`input[name="${name}"]`);
            if (existing) existing.remove();

            // Add new hidden field
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            form.appendChild(input);
        });

        console.log('[MetaTracking] Injected fields into form:', formSelector, fields);
    }
}

// Auto-initialize on page load
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => MetaTracking.init());
    } else {
        MetaTracking.init();
    }
}

// Export for module usage
export { MetaTracking };

// Also expose globally for non-module usage
if (typeof window !== 'undefined') {
    (window as unknown as Record<string, unknown>).MetaTracking = MetaTracking;
}
