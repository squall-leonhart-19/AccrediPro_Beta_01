/**
 * Email Typo Detector
 * 
 * Detects and suggests corrections for common email typos.
 * Uses rules-based approach first, then AI fallback if needed.
 */

import Anthropic from "@anthropic-ai/sdk";

// Common domain typos and their corrections
const DOMAIN_TYPOS: Record<string, string> = {
    // Gmail
    "gamil.com": "gmail.com",
    "gmial.com": "gmail.com",
    "gmal.com": "gmail.com",
    "gmaill.com": "gmail.com",
    "gmail.cm": "gmail.com",
    "gmail.co": "gmail.com",
    "gmail.con": "gmail.com",
    "gmail.cim": "gmail.com",
    "gmail.vom": "gmail.com",
    "gmail.xom": "gmail.com",
    "gmail.comm": "gmail.com",
    "gmail.om": "gmail.com",
    "gmailo.com": "gmail.com",
    "gmailc.om": "gmail.com",
    "g]mail.com": "gmail.com",
    "gnail.com": "gmail.com",
    "gmsil.com": "gmail.com",
    "gimail.com": "gmail.com",
    "hmail.com": "gmail.com",

    // Yahoo
    "yaho.com": "yahoo.com",
    "yahooo.com": "yahoo.com",
    "yahoo.cm": "yahoo.com",
    "yahoo.co": "yahoo.com",
    "yahoo.con": "yahoo.com",
    "yhaoo.com": "yahoo.com",
    "yhoo.com": "yahoo.com",
    "yaoo.com": "yahoo.com",
    "yahho.com": "yahoo.com",

    // Hotmail/Outlook
    "hotmal.com": "hotmail.com",
    "hotmai.com": "hotmail.com",
    "hotmaill.com": "hotmail.com",
    "hotmail.cm": "hotmail.com",
    "hotmail.co": "hotmail.com",
    "hotmail.con": "hotmail.com",
    "homail.com": "hotmail.com",
    "hotmial.com": "hotmail.com",
    "hitmail.com": "hotmail.com",
    "outlok.com": "outlook.com",
    "outloo.com": "outlook.com",
    "outlook.cm": "outlook.com",
    "outlook.co": "outlook.com",
    "outlook.con": "outlook.com",
    "outllook.com": "outlook.com",
    "outlookk.com": "outlook.com",

    // iCloud
    "iclod.com": "icloud.com",
    "icloud.cm": "icloud.com",
    "icloud.co": "icloud.com",
    "icloud.con": "icloud.com",
    "iclloud.com": "icloud.com",
    "icoud.com": "icloud.com",
    "iclould.com": "icloud.com",

    // AOL
    "aol.cm": "aol.com",
    "aol.co": "aol.com",
    "aol.con": "aol.com",
    "aoll.com": "aol.com",

    // Protonmail
    "protonmal.com": "protonmail.com",
    "protonmail.cm": "protonmail.com",
    "protonmail.con": "protonmail.com",

    // Common TLD typos
    ".cmo": ".com",
    ".ocm": ".com",
    ".comm": ".com",
    ".coom": ".com",
};

// Common valid domains for validation
const COMMON_DOMAINS = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "icloud.com",
    "aol.com",
    "protonmail.com",
    "live.com",
    "msn.com",
    "me.com",
    "mac.com",
    "comcast.net",
    "verizon.net",
    "att.net",
    "cox.net",
    "sbcglobal.net",
];

export interface TypoDetectionResult {
    hasSuggestion: boolean;
    originalEmail: string;
    suggestedEmail: string | null;
    source: "rules" | "ai" | null;
    confidence: number;
    reason: string | null;
}

/**
 * Levenshtein distance between two strings
 */
function levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

/**
 * Find closest matching domain
 */
function findClosestDomain(domain: string): { domain: string; distance: number } | null {
    let closest: { domain: string; distance: number } | null = null;

    for (const validDomain of COMMON_DOMAINS) {
        const distance = levenshteinDistance(domain.toLowerCase(), validDomain);
        // Only suggest if distance is small (1-2 characters off)
        if (distance <= 2 && (!closest || distance < closest.distance)) {
            closest = { domain: validDomain, distance };
        }
    }

    return closest;
}

/**
 * Rules-based typo detection
 */
function detectTypoRules(email: string): TypoDetectionResult {
    const lowerEmail = email.toLowerCase().trim();
    const [localPart, domain] = lowerEmail.split("@");

    if (!domain) {
        return {
            hasSuggestion: false,
            originalEmail: email,
            suggestedEmail: null,
            source: null,
            confidence: 0,
            reason: "Invalid email format - no @ symbol",
        };
    }

    // Check direct domain typo match
    if (DOMAIN_TYPOS[domain]) {
        return {
            hasSuggestion: true,
            originalEmail: email,
            suggestedEmail: `${localPart}@${DOMAIN_TYPOS[domain]}`,
            source: "rules",
            confidence: 0.99,
            reason: `Known typo: ${domain} → ${DOMAIN_TYPOS[domain]}`,
        };
    }

    // Check for TLD typos
    for (const [typo, correct] of Object.entries(DOMAIN_TYPOS)) {
        if (typo.startsWith(".") && domain.endsWith(typo)) {
            const fixedDomain = domain.replace(typo, correct);
            return {
                hasSuggestion: true,
                originalEmail: email,
                suggestedEmail: `${localPart}@${fixedDomain}`,
                source: "rules",
                confidence: 0.95,
                reason: `TLD typo: ${typo} → ${correct}`,
            };
        }
    }

    // Use Levenshtein distance to find close matches
    const closestMatch = findClosestDomain(domain);
    if (closestMatch && closestMatch.distance <= 2 && closestMatch.domain !== domain) {
        return {
            hasSuggestion: true,
            originalEmail: email,
            suggestedEmail: `${localPart}@${closestMatch.domain}`,
            source: "rules",
            confidence: closestMatch.distance === 1 ? 0.95 : 0.85,
            reason: `Similar to ${closestMatch.domain} (${closestMatch.distance} character difference)`,
        };
    }

    return {
        hasSuggestion: false,
        originalEmail: email,
        suggestedEmail: null,
        source: null,
        confidence: 0,
        reason: null,
    };
}

/**
 * AI-powered typo detection using Claude
 */
async function detectTypoAI(email: string): Promise<TypoDetectionResult> {
    try {
        const anthropic = new Anthropic();

        const response = await anthropic.messages.create({
            model: "claude-haiku-4-20250514",
            max_tokens: 150,
            messages: [
                {
                    role: "user",
                    content: `Analyze this bounced email address for typos: "${email}"

Common domains to check against: gmail.com, yahoo.com, hotmail.com, outlook.com, icloud.com, aol.com, protonmail.com

If you detect a typo, respond with ONLY valid JSON:
{"hasFix": true, "corrected": "correct@email.com", "confidence": 0.95, "reason": "brief explanation"}

If no typo detected or unsure:
{"hasFix": false, "corrected": null, "confidence": 0, "reason": "no obvious typo detected"}

JSON only, no other text:`,
                },
            ],
        });

        const content = response.content[0];
        if (content.type !== "text") {
            throw new Error("Unexpected response type");
        }

        const result = JSON.parse(content.text);

        return {
            hasSuggestion: result.hasFix,
            originalEmail: email,
            suggestedEmail: result.corrected,
            source: "ai",
            confidence: result.confidence,
            reason: result.reason,
        };
    } catch (error) {
        console.error("[EMAIL_TYPO] AI detection failed:", error);
        return {
            hasSuggestion: false,
            originalEmail: email,
            suggestedEmail: null,
            source: null,
            confidence: 0,
            reason: "AI detection failed",
        };
    }
}

/**
 * Main typo detection function
 * Tries rules first, falls back to AI if no match found
 */
export async function detectEmailTypo(email: string): Promise<TypoDetectionResult> {
    console.log(`[EMAIL_TYPO] Checking: ${email}`);

    // Try rules-based detection first (fast, free)
    const rulesResult = detectTypoRules(email);

    if (rulesResult.hasSuggestion) {
        console.log(`[EMAIL_TYPO] Rules match: ${email} → ${rulesResult.suggestedEmail} (${rulesResult.confidence})`);
        return rulesResult;
    }

    // Fall back to AI detection
    console.log(`[EMAIL_TYPO] No rules match, trying AI...`);
    const aiResult = await detectTypoAI(email);

    if (aiResult.hasSuggestion) {
        console.log(`[EMAIL_TYPO] AI suggestion: ${email} → ${aiResult.suggestedEmail} (${aiResult.confidence})`);
    } else {
        console.log(`[EMAIL_TYPO] No suggestion found for ${email}`);
    }

    return aiResult;
}

/**
 * Quick check if email domain looks suspicious
 */
export function isLikelyTypo(email: string): boolean {
    const [, domain] = email.toLowerCase().split("@");
    if (!domain) return false;

    // Check if it's in our typo list
    if (DOMAIN_TYPOS[domain]) return true;

    // Check if it's close to a common domain
    const closestMatch = findClosestDomain(domain);
    if (closestMatch && closestMatch.distance <= 2 && closestMatch.domain !== domain) {
        return true;
    }

    return false;
}
