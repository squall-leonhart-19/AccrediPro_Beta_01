/**
 * Generate Master Zombie Profiles CSV with R2 Avatar URLs
 * Maps 1000 unique profiles to R2 avatars
 */

import * as fs from 'fs';
import * as path from 'path';

// Read R2 avatar URLs
const avatarsPath = '/Users/pochitino/Desktop/accredipro-lms/Zombie_Profiles/data/r2_avatars.txt';
const avatarUrls = fs.readFileSync(avatarsPath, 'utf-8').trim().split('\n');

console.log(`Loaded ${avatarUrls.length} avatar URLs\n`);

// Name pools for generating unique names
const FIRST_NAMES = [
    // Common American women's names (40-65 demographic)
    "Jennifer", "Michelle", "Lisa", "Amanda", "Jessica", "Sarah", "Rebecca", "Nicole",
    "Stephanie", "Melissa", "Christina", "Angela", "Heather", "Rachel", "Kimberly",
    "Laura", "Amy", "Andrea", "Maria", "Danielle", "Brittany", "Ashley", "Diana",
    "Karen", "Nancy", "Susan", "Margaret", "Betty", "Dorothy", "Patricia", "Sandra",
    "Carol", "Ruth", "Sharon", "Donna", "Brenda", "Carolyn", "Janet", "Catherine",
    "Frances", "Ann", "Joyce", "Diane", "Alice", "Julie", "Teresa", "Doris", "Martha",
    "Gloria", "Evelyn", "Jean", "Cheryl", "Kelly", "Tammy", "Tracy", "Tina", "Dawn",
    "Denise", "Tanya", "Monica", "Wendy", "Robin", "Crystal", "Gina", "Jill", "Dana",
    "Paula", "Sherry", "Carla", "Linda", "Barbara", "Elizabeth", "Mary", "Jennifer",
    "Shannon", "Kristin", "Kathleen", "Christine", "Cynthia", "Virginia", "Deborah"
];

const LAST_INITIALS = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "R", "S", "T", "W"];

const CITIES = [
    "Austin, TX", "Denver, CO", "Phoenix, AZ", "Seattle, WA", "San Diego, CA",
    "Nashville, TN", "Miami, FL", "Chicago, IL", "Boston, MA", "Portland, OR",
    "Atlanta, GA", "Dallas, TX", "Charlotte, NC", "Tampa, FL", "Minneapolis, MN",
    "Raleigh, NC", "San Francisco, CA", "Houston, TX", "Las Vegas, NV", "Orlando, FL",
    "Salt Lake City, UT", "Sacramento, CA", "Indianapolis, IN", "Columbus, OH", "Kansas City, MO",
    "Oklahoma City, OK", "Louisville, KY", "Memphis, TN", "Albuquerque, NM", "Tucson, AZ",
    "Fresno, CA", "Long Beach, CA", "Virginia Beach, VA", "Milwaukee, WI", "Cleveland, OH",
    "New Orleans, LA", "Baltimore, MD", "Pittsburgh, PA", "Cincinnati, OH", "St. Louis, MO",
    "Riverside, CA", "Lexington, KY", "Anchorage, AK", "Honolulu, HI", "Boise, ID",
    "Richmond, VA", "Des Moines, IA", "Birmingham, AL", "Omaha, NE", "Scottsdale, AZ",
    "Jacksonville, FL", "Charleston, SC", "Savannah, GA", "Fort Worth, TX", "Spokane, WA",
    "Knoxville, TN", "Grand Rapids, MI", "Providence, RI", "Newark, NJ", "Little Rock, AR",
    "Tulsa, OK", "Worcester, MA", "Bakersfield, CA", "Reno, NV", "Durham, NC",
    "Chesapeake, VA", "Lubbock, TX", "Laredo, TX", "Madison, WI", "Chandler, AZ",
    "Baton Rouge, LA", "Irvine, CA", "Shreveport, LA", "Tacoma, WA", "Modesto, CA"
];

const BACKGROUNDS = [
    "nurse", "NP", "RN", "pharmacist", "physical therapist", "massage therapist",
    "mom", "stay-at-home mom", "single mom", "empty nester", "grandma",
    "teacher", "professor", "educator", "school counselor",
    "corporate", "marketing", "tech", "HR", "accountant", "realtor",
    "yoga instructor", "fitness trainer", "personal trainer", "pilates instructor",
    "therapist", "counselor", "social worker", "psychologist",
    "chiropractor", "esthetician", "dietitian", "nutritionist",
    "military spouse", "admin", "healthcare admin", "research scientist", "engineer",
    "dental hygienist", "medical assistant", "CNA", "EMT", "lab tech"
];

const INCOME_LEVELS = [
    "$4.1K/mo", "$4.2K/mo", "$4.3K/mo", "$4.5K/mo", "$4.6K/mo", "$4.7K/mo", "$4.8K/mo", "$4.9K/mo",
    "$5.1K/mo", "$5.2K/mo", "$5.4K/mo", "$5.5K/mo", "$5.6K/mo", "$5.7K/mo", "$5.8K/mo", "$5.9K/mo",
    "$6.1K/mo", "$6.2K/mo", "$6.4K/mo", "$6.5K/mo", "$6.7K/mo", "$6.8K/mo", "$6.9K/mo",
    "$7.1K/mo", "$7.2K/mo", "$7.4K/mo", "$7.5K/mo", "$7.6K/mo", "$7.8K/mo", "$7.9K/mo",
    "$8.1K/mo", "$8.2K/mo", "$8.4K/mo", "$8.5K/mo", "$8.6K/mo", "$8.7K/mo", "$8.9K/mo",
    "$9.1K/mo", "$9.4K/mo", "$9.5K/mo", "$9.7K/mo", "$9.8K/mo",
    "$10.2K/mo", "$10.3K/mo", "$10.6K/mo", "$10.8K/mo",
    "$11.1K/mo", "$11.2K/mo", "$11.5K/mo", "$12.1K/mo", "$12.4K/mo", "$13.2K/mo"
];

const PERSONALITY_TYPES = ["leader", "struggler", "questioner", "buyer"];
const TIERS = [1, 1, 2, 2, 2, 3, 3]; // Weighted distribution

// Generate unique profiles
const usedNames = new Set<string>();
const profiles: any[] = [];

for (let i = 0; i < avatarUrls.length; i++) {
    let name = "";
    let attempts = 0;

    // Generate unique name
    while (attempts < 100) {
        const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
        const lastInitial = LAST_INITIALS[Math.floor(Math.random() * LAST_INITIALS.length)];
        name = `${firstName} ${lastInitial}.`;

        if (!usedNames.has(name)) {
            usedNames.add(name);
            break;
        }
        attempts++;

        // If we can't find unique name, add number
        if (attempts >= 99) {
            name = `${firstName} ${lastInitial}${Math.floor(Math.random() * 9) + 1}.`;
        }
    }

    const profile = {
        id: i + 1,
        name,
        location: CITIES[Math.floor(Math.random() * CITIES.length)],
        background: BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)],
        incomeLevel: INCOME_LEVELS[Math.floor(Math.random() * INCOME_LEVELS.length)],
        personalityType: PERSONALITY_TYPES[Math.floor(Math.random() * PERSONALITY_TYPES.length)],
        tier: TIERS[Math.floor(Math.random() * TIERS.length)],
        isGraduate: Math.random() > 0.3, // 70% are graduates
        avatarUrl: avatarUrls[i]
    };

    profiles.push(profile);
}

// Create CSV
const csvHeader = "id,name,location,background,incomeLevel,personalityType,tier,isGraduate,avatarUrl";
const csvRows = profiles.map(p =>
    `${p.id},"${p.name}","${p.location}","${p.background}","${p.incomeLevel}","${p.personalityType}",${p.tier},${p.isGraduate},"${p.avatarUrl}"`
);
const csvContent = [csvHeader, ...csvRows].join('\n');

// Write CSV
const outputPath = '/Users/pochitino/Desktop/accredipro-lms/Zombie_Profiles/data/zombie_profiles_master.csv';
fs.writeFileSync(outputPath, csvContent);
console.log(`✅ Created master CSV with ${profiles.length} profiles`);
console.log(`📍 Saved to: ${outputPath}`);

// Also output JSON for easy import
const jsonPath = '/Users/pochitino/Desktop/accredipro-lms/Zombie_Profiles/data/zombie_profiles_master.json';
fs.writeFileSync(jsonPath, JSON.stringify(profiles, null, 2));
console.log(`📍 Also saved JSON to: ${jsonPath}`);

// Stats
console.log('\n📊 Stats:');
console.log(`- Total profiles: ${profiles.length}`);
console.log(`- Unique names: ${usedNames.size}`);
console.log(`- Graduates: ${profiles.filter(p => p.isGraduate).length}`);
console.log(`- Leaders: ${profiles.filter(p => p.personalityType === 'leader').length}`);
console.log(`- Tier 1 (active): ${profiles.filter(p => p.tier === 1).length}`);
