import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

/**
 * Google Sheets Integration for DFY Orders
 *
 * Auto-syncs DFY intake form submissions to a Google Sheet.
 *
 * Required env vars:
 * - GOOGLE_SHEETS_CLIENT_EMAIL: Service account email
 * - GOOGLE_SHEETS_PRIVATE_KEY: Service account private key (with \n newlines)
 * - DFY_GOOGLE_SHEET_ID: The spreadsheet ID from the Google Sheets URL
 *
 * Setup:
 * 1. Create a Google Cloud project
 * 2. Enable Google Sheets API
 * 3. Create a Service Account + download JSON key
 * 4. Share the Google Sheet with the service account email (Editor access)
 * 5. Add env vars to .env.local / Vercel
 */

const SHEET_HEADERS = [
  "Order ID",
  "Purchase Date",
  "Customer Email",
  "First Name",
  "Last Name",
  "Product",
  "Amount",
  "Fulfillment Status",
  "Intake Submitted",
  "Delivered At",
  // Intake form fields
  "Coaching Title",
  "Certifications",
  "Story",
  "Ideal Client",
  "Program Name",
  "Program Details",
  "Price",
  "Success Stories",
  "Differentiation",
  "Concerns",
  "Website Feel",
  "Colors",
  "Social Media",
  "How To Start",
  "Scheduling Tool",
  "Website Goal",
  "Anything Else",
  "Photo URLs",
  "Notes",
  "Synced At",
];

function getAuth(): JWT | null {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    console.log("[GOOGLE SHEETS] Not configured - missing GOOGLE_SHEETS_CLIENT_EMAIL or GOOGLE_SHEETS_PRIVATE_KEY");
    return null;
  }

  return new JWT({
    email: clientEmail,
    key: privateKey.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

async function getSheet() {
  const sheetId = process.env.DFY_GOOGLE_SHEET_ID;
  if (!sheetId) {
    throw new Error("DFY_GOOGLE_SHEET_ID not configured");
  }

  const auth = getAuth();
  if (!auth) {
    throw new Error("Google Sheets auth not configured");
  }

  const doc = new GoogleSpreadsheet(sheetId, auth);
  await doc.loadInfo();

  // Get or create "DFY Orders" sheet
  let sheet = doc.sheetsByTitle["DFY Orders"];
  if (!sheet) {
    sheet = await doc.addSheet({
      title: "DFY Orders",
      headerValues: SHEET_HEADERS,
    });
    console.log("[GOOGLE SHEETS] Created 'DFY Orders' sheet with headers");
  }

  return sheet;
}

/**
 * Check if Google Sheets is configured
 */
export function isGoogleSheetsConfigured(): boolean {
  return !!(
    process.env.GOOGLE_SHEETS_CLIENT_EMAIL &&
    process.env.GOOGLE_SHEETS_PRIVATE_KEY &&
    process.env.DFY_GOOGLE_SHEET_ID
  );
}

/**
 * Append a single DFY order row to Google Sheets
 * Called automatically when intake form is submitted
 */
export async function appendDFYOrderToSheet(order: {
  id: string;
  createdAt: Date | string;
  userEmail: string;
  firstName: string;
  lastName: string;
  productTitle: string;
  purchasePrice: number | string;
  fulfillmentStatus: string;
  deliveredAt?: Date | string | null;
  notes?: string | null;
  intakeData?: Record<string, any> | null;
}): Promise<{ success: boolean; error?: string }> {
  if (!isGoogleSheetsConfigured()) {
    return { success: false, error: "Google Sheets not configured" };
  }

  try {
    const sheet = await getSheet();
    const intake = order.intakeData || {};

    const formatArray = (val: any) =>
      Array.isArray(val) ? val.join(", ") : String(val || "");

    await sheet.addRow({
      "Order ID": order.id,
      "Purchase Date": new Date(order.createdAt).toLocaleString("en-US", { timeZone: "America/New_York" }),
      "Customer Email": order.userEmail,
      "First Name": order.firstName || "",
      "Last Name": order.lastName || "",
      "Product": order.productTitle,
      "Amount": `$${order.purchasePrice}`,
      "Fulfillment Status": order.fulfillmentStatus,
      "Intake Submitted": order.intakeData ? "Yes" : "No",
      "Delivered At": order.deliveredAt
        ? new Date(order.deliveredAt).toLocaleString("en-US", { timeZone: "America/New_York" })
        : "",
      "Coaching Title": String(intake.coachingTitle || ""),
      "Certifications": String(intake.certifications || ""),
      "Story": String(intake.story || ""),
      "Ideal Client": String(intake.idealClient || ""),
      "Program Name": String(intake.programName || ""),
      "Program Details": String(intake.programDetails || ""),
      "Price": String(intake.price || ""),
      "Success Stories": String(intake.successStories || ""),
      "Differentiation": String(intake.differentiation || ""),
      "Concerns": formatArray(intake.concerns),
      "Website Feel": formatArray(intake.websiteFeel),
      "Colors": String(intake.colors || ""),
      "Social Media": String(intake.socialMedia || ""),
      "How To Start": String(intake.howToStart || ""),
      "Scheduling Tool": String(intake.schedulingTool || ""),
      "Website Goal": String(intake.websiteGoal || ""),
      "Anything Else": String(intake.anythingElse || ""),
      "Photo URLs": formatArray(intake.photoUrls),
      "Notes": order.notes || "",
      "Synced At": new Date().toLocaleString("en-US", { timeZone: "America/New_York" }),
    });

    console.log(`[GOOGLE SHEETS] ✅ Row added for order ${order.id} (${order.userEmail})`);
    return { success: true };
  } catch (error) {
    console.error(`[GOOGLE SHEETS] ❌ Failed to append row for ${order.id}:`, error);
    return { success: false, error: String(error) };
  }
}

/**
 * Full sync - clears the sheet and writes all DFY orders
 * Called from admin "Sync to Sheets" button
 */
export async function fullSyncDFYOrdersToSheet(
  orders: Array<{
    id: string;
    createdAt: Date | string;
    userEmail: string;
    firstName: string;
    lastName: string;
    productTitle: string;
    purchasePrice: number | string;
    fulfillmentStatus: string;
    deliveredAt?: Date | string | null;
    notes?: string | null;
    intakeData?: Record<string, any> | null;
  }>
): Promise<{ success: boolean; rowsWritten: number; error?: string }> {
  if (!isGoogleSheetsConfigured()) {
    return { success: false, rowsWritten: 0, error: "Google Sheets not configured" };
  }

  try {
    const sheet = await getSheet();

    // Clear existing data (keep headers)
    await sheet.clear();
    await sheet.setHeaderRow(SHEET_HEADERS);

    const formatArray = (val: any) =>
      Array.isArray(val) ? val.join(", ") : String(val || "");

    // Build all rows
    const rows = orders.map((order) => {
      const intake = order.intakeData || {};
      return {
        "Order ID": order.id,
        "Purchase Date": new Date(order.createdAt).toLocaleString("en-US", { timeZone: "America/New_York" }),
        "Customer Email": order.userEmail,
        "First Name": order.firstName || "",
        "Last Name": order.lastName || "",
        "Product": order.productTitle,
        "Amount": `$${order.purchasePrice}`,
        "Fulfillment Status": order.fulfillmentStatus,
        "Intake Submitted": order.intakeData ? "Yes" : "No",
        "Delivered At": order.deliveredAt
          ? new Date(order.deliveredAt).toLocaleString("en-US", { timeZone: "America/New_York" })
          : "",
        "Coaching Title": String(intake.coachingTitle || ""),
        "Certifications": String(intake.certifications || ""),
        "Story": String(intake.story || ""),
        "Ideal Client": String(intake.idealClient || ""),
        "Program Name": String(intake.programName || ""),
        "Program Details": String(intake.programDetails || ""),
        "Price": String(intake.price || ""),
        "Success Stories": String(intake.successStories || ""),
        "Differentiation": String(intake.differentiation || ""),
        "Concerns": formatArray(intake.concerns),
        "Website Feel": formatArray(intake.websiteFeel),
        "Colors": String(intake.colors || ""),
        "Social Media": String(intake.socialMedia || ""),
        "How To Start": String(intake.howToStart || ""),
        "Scheduling Tool": String(intake.schedulingTool || ""),
        "Website Goal": String(intake.websiteGoal || ""),
        "Anything Else": String(intake.anythingElse || ""),
        "Photo URLs": formatArray(intake.photoUrls),
        "Notes": order.notes || "",
        "Synced At": new Date().toLocaleString("en-US", { timeZone: "America/New_York" }),
      };
    });

    // Batch add (google-spreadsheet handles batching internally)
    if (rows.length > 0) {
      await sheet.addRows(rows);
    }

    console.log(`[GOOGLE SHEETS] ✅ Full sync complete: ${rows.length} orders written`);
    return { success: true, rowsWritten: rows.length };
  } catch (error) {
    console.error("[GOOGLE SHEETS] ❌ Full sync failed:", error);
    return { success: false, rowsWritten: 0, error: String(error) };
  }
}
