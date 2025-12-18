import { PrismaClient, TagCategory } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

interface TagData {
  name: string;
  slug: string;
  category: TagCategory;
  color: string;
  description: string;
  isSystem: boolean;
}

const defaultTags: TagData[] = [
  // ==================== STAGE TAGS (Lifecycle) ====================
  {
    name: "Mini Started",
    slug: "stage_mini_started",
    category: "STAGE",
    color: "#3B82F6", // Blue
    description: "User has started their free Mini Diploma",
    isSystem: true,
  },
  {
    name: "Mini Completed",
    slug: "stage_mini_completed",
    category: "STAGE",
    color: "#10B981", // Green
    description: "User has completed their free Mini Diploma",
    isSystem: true,
  },
  {
    name: "Training Started",
    slug: "stage_training_started",
    category: "STAGE",
    color: "#8B5CF6", // Purple
    description: "User has started the Graduate Orientation Training",
    isSystem: true,
  },
  {
    name: "Training Completed",
    slug: "stage_training_completed",
    category: "STAGE",
    color: "#6366F1", // Indigo
    description: "User has completed the Graduate Orientation Training",
    isSystem: true,
  },
  {
    name: "Challenge Started",
    slug: "stage_challenge_started",
    category: "STAGE",
    color: "#F59E0B", // Amber
    description: "User has started the 7-Day Activation Challenge",
    isSystem: true,
  },
  {
    name: "Challenge Completed",
    slug: "stage_challenge_completed",
    category: "STAGE",
    color: "#EF4444", // Red
    description: "User has completed the 7-Day Activation Challenge",
    isSystem: true,
  },
  {
    name: "Decision Phase",
    slug: "stage_decision",
    category: "STAGE",
    color: "#EC4899", // Pink
    description: "User is in the decision phase (ready to buy)",
    isSystem: true,
  },
  {
    name: "Customer $997",
    slug: "stage_buyer_997",
    category: "STAGE",
    color: "#059669", // Emerald
    description: "User has purchased the $997 certification",
    isSystem: true,
  },
  {
    name: "VIP Customer",
    slug: "stage_buyer_vip",
    category: "STAGE",
    color: "#D4AF37", // Gold
    description: "High-value customer with multiple purchases",
    isSystem: true,
  },

  // ==================== INTENT TAGS (Engagement Level) ====================
  {
    name: "Cold Lead",
    slug: "intent_cold",
    category: "INTENT",
    color: "#6B7280", // Gray
    description: "Low engagement, needs warming up",
    isSystem: true,
  },
  {
    name: "Warm Lead",
    slug: "intent_warm",
    category: "INTENT",
    color: "#F97316", // Orange
    description: "Moderate engagement, showing interest",
    isSystem: true,
  },
  {
    name: "Hot Lead",
    slug: "intent_hot",
    category: "INTENT",
    color: "#DC2626", // Red
    description: "High engagement, ready to convert",
    isSystem: true,
  },

  // ==================== BEHAVIOR TAGS (Auto-assigned) ====================
  {
    name: "Email Opener",
    slug: "behavior_email_opener",
    category: "BEHAVIOR",
    color: "#14B8A6", // Teal
    description: "Consistently opens marketing emails (>50% open rate)",
    isSystem: true,
  },
  {
    name: "Email Clicker",
    slug: "behavior_email_clicker",
    category: "BEHAVIOR",
    color: "#0EA5E9", // Sky
    description: "Frequently clicks links in emails",
    isSystem: true,
  },
  {
    name: "Video Watcher",
    slug: "behavior_video_watcher",
    category: "BEHAVIOR",
    color: "#A855F7", // Purple
    description: "Watches >75% of course videos",
    isSystem: true,
  },
  {
    name: "Pricing Viewer",
    slug: "behavior_pricing_viewer",
    category: "BEHAVIOR",
    color: "#F43F5E", // Rose
    description: "Has viewed pricing/sales page multiple times",
    isSystem: true,
  },
  {
    name: "Community Active",
    slug: "behavior_community_active",
    category: "BEHAVIOR",
    color: "#22C55E", // Green
    description: "Active in community (posts, comments, likes)",
    isSystem: true,
  },
  {
    name: "Fast Completer",
    slug: "behavior_fast_completer",
    category: "BEHAVIOR",
    color: "#3B82F6", // Blue
    description: "Completes content faster than average",
    isSystem: true,
  },

  // ==================== SOURCE TAGS (Lead Source) ====================
  {
    name: "Freebie: Functional Medicine",
    slug: "source_freebie_fm",
    category: "SOURCE",
    color: "#722F37", // Burgundy (brand)
    description: "Came from Functional Medicine Mini Diploma freebie",
    isSystem: true,
  },
  {
    name: "Freebie: Gut Health",
    slug: "source_freebie_gut",
    category: "SOURCE",
    color: "#15803D", // Green
    description: "Came from Gut Health Mini Diploma freebie",
    isSystem: true,
  },
  {
    name: "Freebie: Hormone Health",
    slug: "source_freebie_hormones",
    category: "SOURCE",
    color: "#DB2777", // Pink
    description: "Came from Hormone Health Mini Diploma freebie",
    isSystem: true,
  },
  {
    name: "Freebie: Autism",
    slug: "source_freebie_autism",
    category: "SOURCE",
    color: "#7C3AED", // Violet
    description: "Came from Autism specialty Mini Diploma freebie",
    isSystem: true,
  },
  {
    name: "Webinar Attendee",
    slug: "source_webinar",
    category: "SOURCE",
    color: "#0891B2", // Cyan
    description: "Registered for or attended a webinar",
    isSystem: true,
  },
  {
    name: "Organic Search",
    slug: "source_organic",
    category: "SOURCE",
    color: "#65A30D", // Lime
    description: "Found through organic search (Google, etc.)",
    isSystem: true,
  },
  {
    name: "Social Media",
    slug: "source_social",
    category: "SOURCE",
    color: "#E11D48", // Rose
    description: "Came from social media (Instagram, Facebook, etc.)",
    isSystem: true,
  },
  {
    name: "Referral",
    slug: "source_referral",
    category: "SOURCE",
    color: "#D97706", // Amber
    description: "Referred by another student or affiliate",
    isSystem: true,
  },
  {
    name: "Paid Ads",
    slug: "source_paid_ads",
    category: "SOURCE",
    color: "#2563EB", // Blue
    description: "Came from paid advertising",
    isSystem: true,
  },

  // ==================== SPECIFIC COURSE/NICHE TAGS ====================
  {
    name: "Source: FM General",
    slug: "source_functional_medicine_general",
    category: "SOURCE",
    color: "#722F37", // Burgundy
    description: "Lead source: Functional Medicine General opt-in",
    isSystem: true,
  },
  {
    name: "Source: Mini Diploma Freebie",
    slug: "source_mini_diploma_freebie",
    category: "SOURCE",
    color: "#6366F1", // Indigo
    description: "Lead source: Mini Diploma freebie download",
    isSystem: true,
  },
  {
    name: "Lead: FM General",
    slug: "lead_functional_medicine_general",
    category: "STAGE",
    color: "#3B82F6", // Blue
    description: "Lead interested in Functional Medicine",
    isSystem: true,
  },
  {
    name: "Mini Diploma: FM General",
    slug: "mini_diploma_category_functional_medicine_general",
    category: "STAGE",
    color: "#8B5CF6", // Purple
    description: "Mini Diploma category: Functional Medicine General",
    isSystem: true,
  },
  {
    name: "Enrolled FM Mini Diploma",
    slug: "enrolled_functional_medicine_mini_diploma",
    category: "STAGE",
    color: "#10B981", // Green
    description: "Enrolled in Functional Medicine Mini Diploma",
    isSystem: true,
  },
  {
    name: "Mini Diploma Started",
    slug: "mini_diploma_started",
    category: "STAGE",
    color: "#F59E0B", // Amber
    description: "User has started their Mini Diploma",
    isSystem: true,
  },
  {
    name: "Nurture 30-Day",
    slug: "nurture_30_day",
    category: "STAGE",
    color: "#EC4899", // Pink
    description: "In 30-day nurture sequence",
    isSystem: true,
  },

  // ==================== SUPPRESSION TAGS ====================
  {
    name: "Purchased - Suppress",
    slug: "suppress_purchased",
    category: "SUPPRESS",
    color: "#059669", // Emerald
    description: "Has purchased - exclude from sales sequences",
    isSystem: true,
  },
  {
    name: "Unsubscribed",
    slug: "suppress_unsubscribed",
    category: "SUPPRESS",
    color: "#DC2626", // Red
    description: "Unsubscribed from marketing emails",
    isSystem: true,
  },
  {
    name: "Do Not Contact",
    slug: "suppress_do_not_contact",
    category: "SUPPRESS",
    color: "#1F2937", // Dark gray
    description: "Requested no contact - GDPR/compliance",
    isSystem: true,
  },
  {
    name: "Bounced Email",
    slug: "suppress_bounced",
    category: "SUPPRESS",
    color: "#9CA3AF", // Gray
    description: "Email address has bounced",
    isSystem: true,
  },
  {
    name: "Complained",
    slug: "suppress_complained",
    category: "SUPPRESS",
    color: "#7C2D12", // Dark orange
    description: "Marked email as spam",
    isSystem: true,
  },
];

async function seed() {
  console.log("Seeding marketing tags...\n");

  for (const tag of defaultTags) {
    const result = await prisma.marketingTag.upsert({
      where: { slug: tag.slug },
      update: {
        name: tag.name,
        category: tag.category,
        color: tag.color,
        description: tag.description,
        isSystem: tag.isSystem,
      },
      create: tag,
    });
    console.log(`  ✓ ${result.name} (${result.category})`);
  }

  console.log(`\nSeeded ${defaultTags.length} marketing tags successfully!`);
  console.log("\n📊 Tag Categories:");
  console.log(`   STAGE: ${defaultTags.filter(t => t.category === 'STAGE').length} tags`);
  console.log(`   INTENT: ${defaultTags.filter(t => t.category === 'INTENT').length} tags`);
  console.log(`   BEHAVIOR: ${defaultTags.filter(t => t.category === 'BEHAVIOR').length} tags`);
  console.log(`   SOURCE: ${defaultTags.filter(t => t.category === 'SOURCE').length} tags`);
  console.log(`   SUPPRESS: ${defaultTags.filter(t => t.category === 'SUPPRESS').length} tags`);
}

seed()
  .catch((e) => {
    console.error("Error seeding tags:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
