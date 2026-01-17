/**
 * Seed Zombie Profiles from Generated Images
 * 
 * This script creates zombie User profiles from the AI-generated images
 * in /docs/User_Profile_img/
 * 
 * Run with: npx ts-node scripts/seed-zombies-from-images.ts
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// US States for realistic locations
const US_STATES = [
    "Texas", "California", "Florida", "New York", "Ohio", "Pennsylvania",
    "Illinois", "Georgia", "North Carolina", "Michigan", "Arizona",
    "Washington", "Colorado", "Tennessee", "Virginia", "Oregon", "Minnesota",
    "Wisconsin", "Massachusetts", "Indiana", "South Carolina", "Alabama",
    "Kentucky", "Louisiana", "Oklahoma", "Connecticut", "Iowa", "Utah",
    "Nevada", "Arkansas", "Kansas", "Mississippi", "New Mexico"
];

// First names pool - common American women's names
const FIRST_NAMES = [
    "Jennifer", "Michelle", "Amanda", "Jessica", "Melissa", "Stephanie", "Nicole",
    "Elizabeth", "Heather", "Tiffany", "Kimberly", "Christina", "Lauren", "Ashley",
    "Sarah", "Amy", "Angela", "Rebecca", "Kathleen", "Brenda", "Pamela", "Karen",
    "Nancy", "Lisa", "Betty", "Margaret", "Sandra", "Dorothy", "Donna", "Carol",
    "Patricia", "Sharon", "Susan", "Julie", "Rachel", "Megan", "Christine", "Catherine",
    "Deborah", "Denise", "Diane", "Maria", "Anna", "Crystal", "Tammy", "Tracy",
    "Kelly", "Wendy", "Teresa", "Theresa", "Cynthia", "Carolyn", "Virginia", "Paula",
    "Ruth", "Gloria", "Martha", "Robin", "Joyce", "Jean", "Judith", "Ann", "Marie",
    "Janet", "Janice", "Helen", "Doris", "Marilyn", "Judy", "Beverly", "Barbara",
    "Katherine", "Linda", "Cheryl", "Bonnie", "Laura", "Diana", "Emily", "Danielle",
    "Brittany", "Amber", "Courtney", "Holly", "Samantha", "Natalie", "Lindsey", "Vanessa"
];

// Last names pool
const LAST_NAMES = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
    "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
    "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
    "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
    "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell",
    "Carter", "Roberts", "Phillips", "Evans", "Turner", "Diaz", "Parker", "Cruz",
    "Edwards", "Collins", "Reyes", "Stewart", "Morris", "Morales", "Murphy", "Cook",
    "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper", "Peterson", "Bailey", "Reed",
    "Kelly", "Howard", "Ramos", "Kim", "Cox", "Ward", "Richardson", "Watson", "Brooks"
];

// Professional titles relevant to functional medicine
const PROFESSIONAL_TITLES = [
    "Certified Functional Medicine Coach",
    "Holistic Health Practitioner",
    "Integrative Wellness Coach",
    "Functional Nutrition Specialist",
    "Holistic Nutrition Coach",
    "Health & Wellness Coach",
    "Certified Health Coach",
    "Integrative Health Coach",
    "Women's Health Coach",
    "Gut Health Specialist",
    "Hormone Health Coach",
    "Stress & Lifestyle Coach",
    "Certified Wellness Consultant",
    "Functional Health Advisor",
    "Root Cause Practitioner"
];

// Specialties pool
const SPECIALTIES_POOL = [
    ["Gut Health", "Digestive Wellness"],
    ["Hormone Balance", "Women's Health"],
    ["Stress Management", "Adrenal Health"],
    ["Weight Management", "Metabolism"],
    ["Autoimmune Support", "Inflammation"],
    ["Thyroid Health", "Energy Optimization"],
    ["Detoxification", "Liver Support"],
    ["Mental Wellness", "Brain Health"],
    ["Sleep Optimization", "Circadian Health"],
    ["Blood Sugar Balance", "Metabolic Health"],
    ["Food Sensitivities", "Elimination Diets"],
    ["Anti-Aging", "Longevity"],
    ["Chronic Fatigue", "Energy Recovery"],
    ["Menopause Support", "Perimenopause"],
    ["Fertility Support", "Preconception Health"]
];

// Bio templates
const BIO_TEMPLATES = [
    "After struggling with [issue] for years, I finally found answers through functional medicine. Now I help other women discover their root causes and reclaim their health. [years] years experience helping clients transform their lives.",
    "Former [profession] turned health coach after my own healing journey. I specialize in helping busy women over 40 find energy, balance, and vitality without extreme diets or endless supplements.",
    "Board-certified in functional nutrition with a passion for helping women understand their bodies. I believe in personalized approaches because no two women are the same. [years] years in practice.",
    "I went from exhausted and overwhelmed to thriving, and I want that for you too. My approach combines science-based protocols with real-life practicality for lasting results.",
    "Mother of [kids], health advocate, and certified practitioner. I understand the challenges of balancing family, career, and health. Let me help you find YOUR path to wellness.",
    "My own health crisis led me to functional medicine [years] years ago. Now I guide women through the same transformation I experienced. It's never too late to feel amazing.",
    "Registered nurse turned functional medicine coach. I bring my clinical background to create comprehensive health plans that actually work for real women with real lives.",
    "After watching my [relative] struggle with [issue], I dedicated my career to helping women prevent and reverse chronic conditions through root cause approaches.",
    "Twenty years in corporate America left me burned out and sick. Functional medicine saved my life. Now I help other professional women avoid the same fate.",
    "Certified through AccrediPro Standards Institute. I use evidence-based protocols combined with compassionate coaching to help women of all ages achieve optimal health."
];

const ISSUES = ["hormone imbalances", "gut issues", "chronic fatigue", "thyroid problems", "autoimmune symptoms", "weight struggles", "brain fog", "sleep issues"];
const PROFESSIONS = ["teacher", "nurse", "corporate executive", "accountant", "lawyer", "marketing director", "HR manager", "office manager"];
const RELATIVES = ["mother", "sister", "grandmother", "aunt"];

function random<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateSlug(firstName: string, lastName: string): string {
    const base = `${firstName.toLowerCase()}-${lastName.toLowerCase()}`;
    const suffix = Math.floor(Math.random() * 1000);
    return `${base}-${suffix}`;
}

function generateBio(): string {
    let bio = random(BIO_TEMPLATES);
    bio = bio.replace("[issue]", random(ISSUES));
    bio = bio.replace("[profession]", random(PROFESSIONS));
    bio = bio.replace("[relative]", random(RELATIVES));
    bio = bio.replace("[years]", String(Math.floor(Math.random() * 8) + 3));
    bio = bio.replace("[kids]", String(Math.floor(Math.random() * 3) + 1));
    bio = bio.replace("[issue]", random(ISSUES));
    return bio;
}

async function main() {
    console.log("🧟 Starting Zombie Profile Seeding...\n");

    const imagesDir = path.join(process.cwd(), "docs/User_Profile_img");

    if (!fs.existsSync(imagesDir)) {
        console.error("❌ Images directory not found:", imagesDir);
        process.exit(1);
    }

    // Get all image files
    const imageFiles = fs.readdirSync(imagesDir)
        .filter(f => f.endsWith('.png') && f.startsWith('user_'));

    console.log(`📸 Found ${imageFiles.length} profile images\n`);

    // Check how many zombies already exist
    const existingCount = await prisma.user.count({
        where: { isFakeProfile: true }
    });
    console.log(`📊 Existing zombie profiles: ${existingCount}\n`);

    // Track used names to avoid duplicates
    const usedNames = new Set<string>();
    const existingZombies = await prisma.user.findMany({
        where: { isFakeProfile: true },
        select: { firstName: true, lastName: true }
    });
    existingZombies.forEach(z => usedNames.add(`${z.firstName} ${z.lastName}`));

    let created = 0;
    let skipped = 0;

    for (const imageFile of imageFiles) {
        // Extract age and scene from filename
        const match = imageFile.match(/user_(\d+)_(.+?)_\d+\.png/);
        if (!match) {
            skipped++;
            continue;
        }

        // Generate unique name
        let firstName: string, lastName: string, fullName: string;
        let attempts = 0;
        do {
            firstName = random(FIRST_NAMES);
            lastName = random(LAST_NAMES);
            fullName = `${firstName} ${lastName}`;
            attempts++;
        } while (usedNames.has(fullName) && attempts < 100);

        if (usedNames.has(fullName)) {
            skipped++;
            continue;
        }
        usedNames.add(fullName);

        // Generate profile data
        const slug = generateSlug(firstName, lastName);
        const location = random(US_STATES);
        const title = random(PROFESSIONAL_TITLES);
        const specialties = random(SPECIALTIES_POOL);
        const bio = generateBio();
        const avatarUrl = `/zombie-avatars/${imageFile}`; // Public path

        try {
            await prisma.user.create({
                data: {
                    email: `zombie-${slug}@fake.accredipro.academy`,
                    firstName,
                    lastName,
                    avatar: avatarUrl,
                    bio,
                    location,
                    professionalTitle: title,
                    specialties,
                    slug,
                    isFakeProfile: true,
                    isPublicDirectory: Math.random() > 0.3, // 70% in directory
                    acceptingClients: Math.random() > 0.4, // 60% accepting
                    role: "STUDENT",
                }
            });
            created++;

            if (created % 50 === 0) {
                console.log(`✅ Created ${created} profiles...`);
            }
        } catch (error: any) {
            if (error.code === 'P2002') {
                skipped++;
            } else {
                console.error(`❌ Error creating profile:`, error.message);
            }
        }
    }

    console.log(`\n✅ Seeding complete!`);
    console.log(`   Created: ${created}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Total zombies: ${existingCount + created}`);

    await prisma.$disconnect();
}

main().catch(console.error);
