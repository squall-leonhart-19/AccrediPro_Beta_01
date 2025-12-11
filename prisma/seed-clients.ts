// Sample client data for demo purposes
// Run this seed by calling: npx ts-node prisma/seed-clients.ts

import prisma from "../src/lib/prisma";

async function seedClients() {
    // Find a coach user
    const coach = await prisma.user.findFirst({
        where: { role: { in: ["ADMIN", "INSTRUCTOR", "MENTOR"] } },
    });

    if (!coach) {
        console.log("No coach user found. Please create one first.");
        return;
    }

    console.log(`Seeding clients for coach: ${coach.firstName} ${coach.lastName}`);

    const sampleClients = [
        {
            coachId: coach.id,
            name: "Sarah Mitchell",
            email: "sarah.m@email.com",
            phone: "+1 (555) 123-4567",
            status: "ACTIVE" as const,
            startDate: new Date("2024-11-01"),
            packageType: "8-Week Transformation",
            primaryConcerns: "Low energy, digestive issues, difficulty losing weight despite diet changes. Experiencing afternoon fatigue and brain fog.",
            healthGoals: "Increase energy levels, improve digestion, lose 15 lbs, reduce brain fog. Long-term goal: sustainable healthy lifestyle.",
            currentHealth: "Generally stable but not optimal. Energy crashes mid-afternoon, mild bloating after meals, interrupted sleep.",
            conditions: ["Hypothyroidism", "IBS"],
            medications: ["Levothyroxine 50mcg"],
            supplements: ["Vitamin D", "Probiotic"],
            allergies: ["Gluten sensitivity", "Dairy"],
            dietType: "Gluten-free",
            sleepHours: 6.5,
            exerciseFreq: "2-3x per week",
            stressLevel: 7,
            totalSessions: 4,
            notes: "Very motivated client. Showing good progress with elimination diet. Responds well to accountability check-ins.",
            assessments: [
                { id: "1", date: "2024-11-01", type: "Energy", score: 4, notes: "Initial assessment" },
                { id: "2", date: "2024-11-15", type: "Energy", score: 6, notes: "Improvement after week 2" },
                { id: "3", date: "2024-11-01", type: "Stress", score: 8, notes: "High work deadline pressure" },
                { id: "4", date: "2024-11-15", type: "Stress", score: 6, notes: "Started meditation" },
            ],
        },
        {
            coachId: coach.id,
            name: "Michael Chen",
            email: "mchen@email.com",
            phone: "+1 (555) 234-5678",
            status: "ACTIVE" as const,
            startDate: new Date("2024-10-15"),
            packageType: "12-Week Protocol",
            primaryConcerns: "Chronic stress, poor sleep quality, weight gain in midsection. High cortisol suspected.",
            healthGoals: "Better stress management, improve sleep to 7+ hours, lose belly fat, more mental clarity.",
            currentHealth: "High stress executive. Relies on coffee, skips meals, works long hours. Recently elevated blood pressure.",
            conditions: ["Pre-hypertension", "Elevated cortisol"],
            medications: [],
            supplements: ["Magnesium", "Ashwagandha", "Fish oil"],
            allergies: [],
            dietType: "Mediterranean-style",
            sleepHours: 5,
            exerciseFreq: "1x per week",
            stressLevel: 9,
            totalSessions: 6,
            notes: "Busy executive, hard to schedule. Prefers evening calls. Making good progress with sleep hygiene protocols. Needs accountability for exercise.",
            assessments: [
                { id: "1", date: "2024-10-15", type: "Sleep", score: 3, notes: "Very poor sleep" },
                { id: "2", date: "2024-11-15", type: "Sleep", score: 5, notes: "Some improvement" },
                { id: "3", date: "2024-10-15", type: "Stress", score: 9, notes: "Critical" },
                { id: "4", date: "2024-11-15", type: "Stress", score: 7, notes: "Improving with breathwork" },
            ],
        },
        {
            coachId: coach.id,
            name: "Emily Rodriguez",
            email: "emilyr@email.com",
            phone: "+1 (555) 345-6789",
            status: "ACTIVE" as const,
            startDate: new Date("2024-11-15"),
            packageType: "4-Week Gut Reset",
            primaryConcerns: "Severe bloating, food sensitivities, acne, irregular digestion. Suspected SIBO.",
            healthGoals: "Eliminate bloating, identify food triggers, clear skin, regular bowel movements.",
            currentHealth: "Young professional, otherwise healthy. Main issues are gut-related affecting quality of life.",
            conditions: ["SIBO (suspected)", "Hormonal acne"],
            medications: [],
            supplements: ["Digestive enzymes", "L-glutamine"],
            allergies: ["Shellfish"],
            dietType: "Low-FODMAP (trial)",
            sleepHours: 7,
            exerciseFreq: "4x per week",
            stressLevel: 5,
            totalSessions: 2,
            notes: "New client, very compliant. Keeping detailed food diary. Good at following protocols. Seeing improvement in bloating already.",
            assessments: [
                { id: "1", date: "2024-11-15", type: "Digestion", score: 3, notes: "Severe bloating" },
                { id: "2", date: "2024-11-22", type: "Digestion", score: 5, notes: "50% reduction in bloating" },
            ],
        },
        {
            coachId: coach.id,
            name: "David Thompson",
            email: "dthompson@email.com",
            status: "PAUSED" as const,
            startDate: new Date("2024-09-01"),
            packageType: "8-Week Transformation",
            primaryConcerns: "Weight loss plateau, sugar cravings, emotional eating patterns.",
            healthGoals: "Break through plateau, develop healthy relationship with food, sustainable habits.",
            currentHealth: "Overweight but active. Has lost 30 lbs before but regained. Yo-yo pattern.",
            conditions: ["Pre-diabetes (reversed)"],
            medications: [],
            supplements: ["Chromium", "Berberine"],
            allergies: [],
            dietType: "Low-carb",
            sleepHours: 7.5,
            exerciseFreq: "3x per week",
            stressLevel: 6,
            totalSessions: 8,
            notes: "Paused program due to vacation. Will resume in January. Made great progress before pause - down 12 lbs. Struggles with consistency during holidays.",
            assessments: [
                { id: "1", date: "2024-09-01", type: "Cravings", score: 8, notes: "Strong sugar cravings" },
                { id: "2", date: "2024-10-15", type: "Cravings", score: 4, notes: "Much better control" },
            ],
        },
        {
            coachId: coach.id,
            name: "Jennifer Walsh",
            email: "jwalsj@email.com",
            phone: "+1 (555) 456-7890",
            status: "COMPLETED" as const,
            startDate: new Date("2024-08-01"),
            packageType: "12-Week Protocol",
            primaryConcerns: "Hormone imbalance, PMS, mood swings, fatigue during cycle.",
            healthGoals: "Balance hormones naturally, reduce PMS symptoms, stable energy throughout cycle.",
            currentHealth: "Completed program successfully. Hormones much more balanced. Considering maintenance package.",
            conditions: ["PCOS (mild)"],
            medications: [],
            supplements: ["Vitex", "Myo-inositol", "Omega-3"],
            allergies: ["Tree nuts"],
            dietType: "Anti-inflammatory",
            sleepHours: 8,
            exerciseFreq: "5x per week",
            stressLevel: 4,
            totalSessions: 12,
            notes: "SUCCESS STORY! Completed full 12-week hormone protocol. PMS symptoms reduced by 80%. Regular cycles now. Great testimonial candidate. Referred 2 clients.",
            assessments: [
                { id: "1", date: "2024-08-01", type: "PMS", score: 9, notes: "Severe symptoms" },
                { id: "2", date: "2024-10-15", type: "PMS", score: 2, notes: "Dramatic improvement!" },
                { id: "3", date: "2024-08-01", type: "Energy", score: 4, notes: "Fatigue mid-cycle" },
                { id: "4", date: "2024-10-15", type: "Energy", score: 8, notes: "Stable energy" },
            ],
        },
    ];

    for (const client of sampleClients) {
        await prisma.client.create({
            data: client as any,
        });
        console.log(`Created client: ${client.name}`);
    }

    console.log("Seed complete!");
}

seedClients()
    .catch(console.error)
    .finally(() => process.exit(0));
