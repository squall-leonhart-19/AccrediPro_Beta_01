/**
 * Email Tracking Utilities
 * 
 * Adds open pixel and click tracking to emails
 */

const BASE_URL = process.env.SITE_URL || "https://learn.accredipro.academy";

/**
 * Generate a tracking pixel img tag for the email
 */
export function getTrackingPixel(emailSendId: string): string {
    if (!emailSendId) return "";
    return `<img src="${BASE_URL}/api/track/open/${emailSendId}" width="1" height="1" alt="" style="display:none;width:1px;height:1px;border:0;" />`;
}

/**
 * Wrap a URL with click tracking
 */
export function trackLink(url: string, emailSendId: string): string {
    if (!emailSendId || !url) return url;
    // Don't track mailto: or tel: links
    if (url.startsWith("mailto:") || url.startsWith("tel:")) return url;
    // Don't track unsubscribe links (CAN-SPAM compliance)
    if (url.includes("unsubscribe") || url.includes("preferences")) return url;

    const encodedUrl = encodeURIComponent(url);
    return `${BASE_URL}/api/track/click/${emailSendId}?url=${encodedUrl}`;
}

/**
 * Process HTML email content to add tracking
 * - Adds tracking pixel before </body>
 * - Wraps all links with click tracking
 */
export function addTrackingToEmail(html: string, emailSendId: string): string {
    if (!emailSendId) return html;

    let trackedHtml = html;

    // 1. Add tracking pixel before </body>
    const trackingPixel = getTrackingPixel(emailSendId);
    if (trackedHtml.includes("</body>")) {
        trackedHtml = trackedHtml.replace("</body>", `${trackingPixel}</body>`);
    } else {
        // No body tag, append at end
        trackedHtml += trackingPixel;
    }

    // 2. Replace all <a href="..."> with tracked versions
    // Skip mailto:, tel:, and unsubscribe links
    trackedHtml = trackedHtml.replace(
        /<a\s+([^>]*?)href=["']([^"']+)["']([^>]*?)>/gi,
        (match, before, url, after) => {
            // Skip special protocols and unsubscribe
            if (
                url.startsWith("mailto:") ||
                url.startsWith("tel:") ||
                url.includes("unsubscribe") ||
                url.includes("preferences")
            ) {
                return match;
            }
            const trackedUrl = trackLink(url, emailSendId);
            return `<a ${before}href="${trackedUrl}"${after}>`;
        }
    );

    return trackedHtml;
}

/**
 * Get tracking stats summary for an email
 */
export interface EmailTrackingStats {
    opens: number;
    clicks: number;
    firstOpenedAt: Date | null;
    firstClickedAt: Date | null;
    clickedLinks: string[];
}

export function formatTrackingStats(emailSend: {
    openCount: number;
    clickCount: number;
    openedAt: Date | null;
    clickedAt: Date | null;
    clickedLinks: string[];
}): EmailTrackingStats {
    return {
        opens: emailSend.openCount,
        clicks: emailSend.clickCount,
        firstOpenedAt: emailSend.openedAt,
        firstClickedAt: emailSend.clickedAt,
        clickedLinks: emailSend.clickedLinks || [],
    };
}
