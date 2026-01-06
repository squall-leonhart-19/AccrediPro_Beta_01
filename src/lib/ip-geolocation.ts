/**
 * IP Geolocation Utility
 * Uses ip-api.com (free tier: 45 requests/minute, no API key needed)
 * Falls back gracefully if rate limited or unavailable
 */

interface GeoLocation {
    country: string | null;
    countryCode: string | null;
    city: string | null;
    region: string | null;
    isp: string | null;
    success: boolean;
}

// Cache to avoid redundant lookups
const geoCache = new Map<string, GeoLocation>();

export async function lookupIpLocation(ip: string | null): Promise<GeoLocation> {
    if (!ip || ip === "::1" || ip === "127.0.0.1" || ip.startsWith("192.168.")) {
        return {
            country: "Local",
            countryCode: "LO",
            city: "Local Network",
            region: null,
            isp: null,
            success: true,
        };
    }

    // Check cache first
    if (geoCache.has(ip)) {
        return geoCache.get(ip)!;
    }

    try {
        // ip-api.com is free for non-commercial use (45 req/min)
        const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,city,regionName,isp`, {
            signal: AbortSignal.timeout(3000), // 3 second timeout
        });

        if (!response.ok) {
            console.warn(`[GeoIP] Request failed for ${ip}: ${response.status}`);
            return { country: null, countryCode: null, city: null, region: null, isp: null, success: false };
        }

        const data = await response.json();

        if (data.status === "fail") {
            console.warn(`[GeoIP] Lookup failed for ${ip}: ${data.message}`);
            return { country: null, countryCode: null, city: null, region: null, isp: null, success: false };
        }

        const result: GeoLocation = {
            country: data.country || null,
            countryCode: data.countryCode || null,
            city: data.city || null,
            region: data.regionName || null,
            isp: data.isp || null,
            success: true,
        };

        // Cache the result
        geoCache.set(ip, result);

        console.log(`[GeoIP] ${ip} → ${result.city}, ${result.country} (${result.countryCode})`);
        return result;

    } catch (error) {
        console.error(`[GeoIP] Error looking up ${ip}:`, error);
        return { country: null, countryCode: null, city: null, region: null, isp: null, success: false };
    }
}

/**
 * Compare login country with billing country
 * Returns a fraud risk assessment
 */
export function assessCountryMismatch(
    loginCountryCode: string | null,
    billingCountryCode: string | null
): {
    isMismatch: boolean;
    riskLevel: "none" | "low" | "medium" | "high";
    message: string | null;
} {
    if (!loginCountryCode || !billingCountryCode) {
        return { isMismatch: false, riskLevel: "none", message: null };
    }

    const loginCode = loginCountryCode.toUpperCase();
    const billingCode = billingCountryCode.toUpperCase();

    if (loginCode === billingCode) {
        return { isMismatch: false, riskLevel: "none", message: null };
    }

    // Some country pairs are lower risk (adjacent countries, US territories, etc.)
    const lowRiskPairs = [
        ["US", "CA"], ["CA", "US"], // US/Canada
        ["US", "MX"], ["MX", "US"], // US/Mexico
        ["GB", "IE"], ["IE", "GB"], // UK/Ireland
        ["DE", "AT"], ["AT", "DE"], // Germany/Austria
        ["DE", "CH"], ["CH", "DE"], // Germany/Switzerland
        ["AU", "NZ"], ["NZ", "AU"], // Australia/New Zealand
        ["US", "PR"], ["US", "VI"], ["US", "GU"], // US territories
    ];

    const isLowRisk = lowRiskPairs.some(
        ([a, b]) => (loginCode === a && billingCode === b)
    );

    if (isLowRisk) {
        return {
            isMismatch: true,
            riskLevel: "low",
            message: `Login from ${loginCode}, billing address is ${billingCode} (adjacent/related regions)`,
        };
    }

    return {
        isMismatch: true,
        riskLevel: "high",
        message: `🚩 FRAUD RISK: Login from ${loginCode} but billing address is ${billingCode}`,
    };
}
