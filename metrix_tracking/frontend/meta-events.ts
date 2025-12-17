// ============================================
// META EVENTS - CLIENT HELPER
// ============================================
// Use this in your application code to send conversion events
// ============================================

interface MetaEventOptions {
    email?: string;
    phone?: string;
    first_name?: string;
    last_name?: string;
    value?: number;
    currency?: string;
    content_name?: string;
    external_id?: string; // Your internal user ID
}

interface MetaTrackingData {
    fbc?: string;
    fbp?: string;
    fbclid?: string;
    event_source_url?: string;
    user_agent?: string;
    client_ip?: string;
}

interface SendEventParams extends MetaEventOptions, MetaTrackingData {
    event_name: string;
}

// Your Supabase Edge Function URL
// Replace with your actual project URL
const EDGE_FUNCTION_URL = 'https://YOUR-PROJECT.supabase.co/functions/v1/meta-conversions';

/**
 * Send a conversion event to Meta via your Edge Function
 */
async function sendMetaEvent(
    eventName: string,
    options: MetaEventOptions = {},
    trackingData: MetaTrackingData = {}
): Promise<{ success: boolean; event_id?: string; error?: string }> {
    try {
        const payload: SendEventParams = {
            event_name: eventName,
            ...options,
            ...trackingData,
            event_source_url: trackingData.event_source_url || window.location.href,
            user_agent: trackingData.user_agent || navigator.userAgent,
        };

        const response = await fetch(EDGE_FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('[MetaEvents] Error:', result);
            return { success: false, error: result.error || 'Unknown error' };
        }

        console.log('[MetaEvents] Sent:', eventName, result);
        return { success: true, event_id: result.event_id };
    } catch (error) {
        console.error('[MetaEvents] Failed to send event:', error);
        return { success: false, error: String(error) };
    }
}

// ============================================
// CONVENIENCE FUNCTIONS FOR YOUR FUNNEL EVENTS
// ============================================

/**
 * Track when user submits lead form (optin)
 */
export async function trackLead(
    email: string,
    options: Omit<MetaEventOptions, 'email'> = {},
    trackingData: MetaTrackingData = {}
) {
    return sendMetaEvent('Lead', { email, ...options }, trackingData);
}

/**
 * Track when user logs in / creates account
 */
export async function trackCompleteRegistration(
    email: string,
    options: Omit<MetaEventOptions, 'email'> = {},
    trackingData: MetaTrackingData = {}
) {
    return sendMetaEvent('CompleteRegistration', { email, ...options }, trackingData);
}

/**
 * Track when user starts the mini diploma
 */
export async function trackStartMiniDiploma(
    email: string,
    options: Omit<MetaEventOptions, 'email'> = {},
    trackingData: MetaTrackingData = {}
) {
    return sendMetaEvent('StartMiniDiploma', {
        email,
        content_name: 'Mini Diploma',
        ...options,
    }, trackingData);
}

/**
 * Track when user completes the mini diploma
 */
export async function trackCompleteMiniDiploma(
    email: string,
    options: Omit<MetaEventOptions, 'email'> = {},
    trackingData: MetaTrackingData = {}
) {
    return sendMetaEvent('CompleteMiniDiploma', {
        email,
        content_name: 'Mini Diploma',
        ...options,
    }, trackingData);
}

/**
 * Track when user visits checkout page
 */
export async function trackInitiateCheckout(
    email: string,
    value: number,
    options: Omit<MetaEventOptions, 'email' | 'value'> = {},
    trackingData: MetaTrackingData = {}
) {
    return sendMetaEvent('InitiateCheckout', {
        email,
        value,
        currency: options.currency || 'USD',
        ...options,
    }, trackingData);
}

/**
 * Track when user completes purchase
 */
export async function trackPurchase(
    email: string,
    value: number,
    options: Omit<MetaEventOptions, 'email' | 'value'> = {},
    trackingData: MetaTrackingData = {}
) {
    return sendMetaEvent('Purchase', {
        email,
        value,
        currency: options.currency || 'USD',
        content_name: options.content_name || 'Main Course',
        ...options,
    }, trackingData);
}

// ============================================
// USAGE EXAMPLES
// ============================================
/*

// 1. On lead form submission:
import { trackLead } from './meta-events';
import { MetaTracking } from './meta-tracking';

async function handleFormSubmit(email: string) {
  const trackingData = MetaTracking.getTrackingData();
  await trackLead(email, {}, trackingData);
}

// 2. When user starts mini diploma:
import { trackStartMiniDiploma } from './meta-events';

async function onMiniDiplomaStart(userEmail: string) {
  const trackingData = MetaTracking.getTrackingData();
  await trackStartMiniDiploma(userEmail, {
    external_id: 'user_123' // optional: your internal user ID
  }, trackingData);
}

// 3. When user completes mini diploma:
import { trackCompleteMiniDiploma } from './meta-events';

async function onMiniDiplomaComplete(userEmail: string) {
  const trackingData = MetaTracking.getTrackingData();
  await trackCompleteMiniDiploma(userEmail, {}, trackingData);
}

// 4. On checkout page load:
import { trackInitiateCheckout } from './meta-events';

async function onCheckoutPageLoad(userEmail: string) {
  const trackingData = MetaTracking.getTrackingData();
  await trackInitiateCheckout(userEmail, 997, {
    content_name: 'Certification Course'
  }, trackingData);
}

// 5. After successful payment:
import { trackPurchase } from './meta-events';

async function onPaymentSuccess(userEmail: string, amount: number) {
  const trackingData = MetaTracking.getTrackingData();
  await trackPurchase(userEmail, amount, {
    content_name: 'Certification Course'
  }, trackingData);
}

*/

export { sendMetaEvent };
