/**
 * Scholarship Payment Links Configuration
 *
 * Maps scholarship amounts to Stripe payment links.
 * Used by admin panel to quickly send payment links.
 *
 * UPDATE THESE with your actual Stripe payment links!
 */

export interface PaymentLinkConfig {
  amount: number;
  label: string;
  stripeLink: string; // Your Stripe payment link
  description: string;
}

// Generate payment links from $10 to $500 in increments
// IMPORTANT: Replace the stripeLink values with your actual Stripe links!
export const SCHOLARSHIP_PAYMENT_LINKS: PaymentLinkConfig[] = [
  // Micro amounts ($10-$50)
  { amount: 10, label: "$10", stripeLink: "https://buy.stripe.com/REPLACE_10", description: "Micro scholarship - $10" },
  { amount: 20, label: "$20", stripeLink: "https://buy.stripe.com/REPLACE_20", description: "Micro scholarship - $20" },
  { amount: 25, label: "$25", stripeLink: "https://buy.stripe.com/REPLACE_25", description: "Micro scholarship - $25" },
  { amount: 30, label: "$30", stripeLink: "https://buy.stripe.com/REPLACE_30", description: "Micro scholarship - $30" },
  { amount: 40, label: "$40", stripeLink: "https://buy.stripe.com/REPLACE_40", description: "Micro scholarship - $40" },
  { amount: 50, label: "$50", stripeLink: "https://buy.stripe.com/REPLACE_50", description: "Micro scholarship - $50" },

  // Small amounts ($75-$150)
  { amount: 75, label: "$75", stripeLink: "https://buy.stripe.com/REPLACE_75", description: "Small scholarship - $75" },
  { amount: 97, label: "$97", stripeLink: "https://buy.stripe.com/REPLACE_97", description: "Small scholarship - $97" },
  { amount: 100, label: "$100", stripeLink: "https://buy.stripe.com/REPLACE_100", description: "Small scholarship - $100" },
  { amount: 125, label: "$125", stripeLink: "https://buy.stripe.com/REPLACE_125", description: "Small scholarship - $125" },
  { amount: 147, label: "$147", stripeLink: "https://buy.stripe.com/REPLACE_147", description: "Small scholarship - $147" },
  { amount: 150, label: "$150", stripeLink: "https://buy.stripe.com/REPLACE_150", description: "Small scholarship - $150" },

  // Medium amounts ($175-$300)
  { amount: 175, label: "$175", stripeLink: "https://buy.stripe.com/REPLACE_175", description: "Medium scholarship - $175" },
  { amount: 197, label: "$197", stripeLink: "https://buy.stripe.com/REPLACE_197", description: "Medium scholarship - $197" },
  { amount: 200, label: "$200", stripeLink: "https://buy.stripe.com/REPLACE_200", description: "Medium scholarship - $200" },
  { amount: 225, label: "$225", stripeLink: "https://buy.stripe.com/REPLACE_225", description: "Medium scholarship - $225" },
  { amount: 247, label: "$247", stripeLink: "https://buy.stripe.com/REPLACE_247", description: "Medium scholarship - $247" },
  { amount: 250, label: "$250", stripeLink: "https://buy.stripe.com/REPLACE_250", description: "Medium scholarship - $250" },
  { amount: 275, label: "$275", stripeLink: "https://buy.stripe.com/REPLACE_275", description: "Medium scholarship - $275" },
  { amount: 297, label: "$297", stripeLink: "https://buy.stripe.com/REPLACE_297", description: "Medium scholarship - $297" },
  { amount: 300, label: "$300", stripeLink: "https://buy.stripe.com/REPLACE_300", description: "Medium scholarship - $300" },

  // Standard amounts ($350-$500)
  { amount: 347, label: "$347", stripeLink: "https://buy.stripe.com/REPLACE_347", description: "Standard scholarship - $347" },
  { amount: 350, label: "$350", stripeLink: "https://buy.stripe.com/REPLACE_350", description: "Standard scholarship - $350" },
  { amount: 397, label: "$397", stripeLink: "https://buy.stripe.com/REPLACE_397", description: "Standard scholarship - $397" },
  { amount: 400, label: "$400", stripeLink: "https://buy.stripe.com/REPLACE_400", description: "Standard scholarship - $400" },
  { amount: 447, label: "$447", stripeLink: "https://buy.stripe.com/REPLACE_447", description: "Standard scholarship - $447" },
  { amount: 450, label: "$450", stripeLink: "https://buy.stripe.com/REPLACE_450", description: "Standard scholarship - $450" },
  { amount: 497, label: "$497", stripeLink: "https://buy.stripe.com/REPLACE_497", description: "Standard scholarship - $497" },
  { amount: 500, label: "$500", stripeLink: "https://buy.stripe.com/REPLACE_500", description: "Standard scholarship - $500" },

  // Premium amounts ($600-$1000) - for hot leads
  { amount: 597, label: "$597", stripeLink: "https://buy.stripe.com/REPLACE_597", description: "Premium scholarship - $597" },
  { amount: 697, label: "$697", stripeLink: "https://buy.stripe.com/REPLACE_697", description: "Premium scholarship - $697" },
  { amount: 797, label: "$797", stripeLink: "https://buy.stripe.com/REPLACE_797", description: "Premium scholarship - $797" },
  { amount: 897, label: "$897", stripeLink: "https://buy.stripe.com/REPLACE_897", description: "Premium scholarship - $897" },
  { amount: 997, label: "$997", stripeLink: "https://buy.stripe.com/REPLACE_997", description: "Premium scholarship - $997" },
];

/**
 * Find the closest payment link for a given amount
 */
export function findClosestPaymentLink(amount: number): PaymentLinkConfig | null {
  if (amount <= 0) return null;

  // Find exact match first
  const exact = SCHOLARSHIP_PAYMENT_LINKS.find(p => p.amount === amount);
  if (exact) return exact;

  // Find closest (round up to nearest available amount)
  const sorted = [...SCHOLARSHIP_PAYMENT_LINKS].sort((a, b) => a.amount - b.amount);
  const closest = sorted.find(p => p.amount >= amount);

  return closest || sorted[sorted.length - 1]; // Return highest if amount exceeds all
}

/**
 * Get payment link for a specific amount
 */
export function getPaymentLink(amount: number): string | null {
  const config = findClosestPaymentLink(amount);
  return config?.stripeLink || null;
}

/**
 * Format amount from user input (handles "$100", "100", "100.00", etc.)
 */
export function parseAmountFromMessage(message: string): number | null {
  const match = message.match(/\$?(\d{1,5})(?:[.,]\d{2})?/);
  if (!match) return null;
  return parseInt(match[1], 10);
}
