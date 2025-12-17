/**
 * GoHighLevel (GHL) Webhook Integration
 * Sends leads to GHL for SMS automation
 */

interface GHLContact {
    firstName: string;
    lastName?: string;
    email: string;
    phone?: string;
    source?: string;
    tags?: string[];
}

/**
 * Send a new lead to GoHighLevel
 * This will trigger any GHL workflows you have set up for the webhook
 */
export async function sendLeadToGHL(contact: GHLContact): Promise<boolean> {
    const webhookUrl = process.env.GHL_WEBHOOK_URL;

    if (!webhookUrl) {
        console.log("[GHL] No webhook URL configured, skipping GHL integration");
        return false;
    }

    try {
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                // GHL expects these field names
                first_name: contact.firstName,
                last_name: contact.lastName || "",
                email: contact.email,
                phone: contact.phone || "",
                source: contact.source || "AccrediPro Mini Diploma",
                tags: contact.tags?.join(",") || "mini-diploma-lead",
                // Additional custom fields
                custom_field_mini_diploma: "true",
                custom_field_signup_date: new Date().toISOString(),
            }),
        });

        if (response.ok) {
            console.log(`[GHL] ✅ Lead sent: ${contact.email}`);
            return true;
        } else {
            console.error(`[GHL] ❌ Failed to send lead: ${response.status} ${response.statusText}`);
            return false;
        }
    } catch (error) {
        console.error("[GHL] Error sending lead:", error);
        return false;
    }
}

/**
 * Send a completed mini diploma event to GHL
 * Triggers any completion workflows you have set up
 */
export async function sendMiniDiplomaCompleteToGHL(contact: GHLContact): Promise<boolean> {
    const webhookUrl = process.env.GHL_COMPLETION_WEBHOOK_URL;

    if (!webhookUrl) {
        // Try the main webhook with a different tag
        return sendLeadToGHL({
            ...contact,
            tags: [...(contact.tags || []), "mini-diploma-completed"],
        });
    }

    try {
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                first_name: contact.firstName,
                last_name: contact.lastName || "",
                email: contact.email,
                phone: contact.phone || "",
                event: "mini_diploma_completed",
                completed_at: new Date().toISOString(),
            }),
        });

        if (response.ok) {
            console.log(`[GHL] ✅ Completion event sent: ${contact.email}`);
            return true;
        } else {
            console.error(`[GHL] ❌ Failed to send completion: ${response.status}`);
            return false;
        }
    } catch (error) {
        console.error("[GHL] Error sending completion:", error);
        return false;
    }
}
