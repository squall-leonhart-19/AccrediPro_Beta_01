/**
 * Niche-to-Zombie Mapping Registry
 * 
 * Source of truth for which zombie persona belongs to which niche.
 * Used by createMasterclassPod() to assign the correct zombie per niche.
 * Data extracted from /src/data/zombies/*.json
 */

export interface NicheZombieMapping {
    nicheId: string;
    zombieName: string;
    zombieAvatar: string;
    personalityType: string;
}

export const NICHE_ZOMBIE_REGISTRY: Record<string, NicheZombieMapping> = {
    "functional-medicine": {
        nicheId: "functional-medicine",
        zombieName: "Jennifer Parker",
        zombieAvatar: "/zombies/jennifer.webp",
        personalityType: "enthusiastic",
    },
    "adhd-coaching": {
        nicheId: "adhd-coaching",
        zombieName: "Melissa Torres",
        zombieAvatar: "/zombies/melissa.webp",
        personalityType: "enthusiastic",
    },
    "christian-coaching": {
        nicheId: "christian-coaching",
        zombieName: "Grace Williams",
        zombieAvatar: "/zombies/grace.webp",
        personalityType: "supportive",
    },
    "energy-healing": {
        nicheId: "energy-healing",
        zombieName: "Luna Martinez",
        zombieAvatar: "/zombies/luna.webp",
        personalityType: "empathetic",
    },
    "gut-health": {
        nicheId: "gut-health",
        zombieName: "Diana Reeves",
        zombieAvatar: "/zombies/diana.webp",
        personalityType: "analytical",
    },
    "health-coach": {
        nicheId: "health-coach",
        zombieName: "Karen Mitchell",
        zombieAvatar: "/zombies/karen.webp",
        personalityType: "enthusiastic",
    },
    "holistic-nutrition": {
        nicheId: "holistic-nutrition",
        zombieName: "Sophia Bennett",
        zombieAvatar: "/zombies/sophia.webp",
        personalityType: "supportive",
    },
    "hormone-health": {
        nicheId: "hormone-health",
        zombieName: "Patricia Gonzalez",
        zombieAvatar: "/zombies/patricia.webp",
        personalityType: "analytical",
    },
    "integrative-health": {
        nicheId: "integrative-health",
        zombieName: "Patricia Chen",
        zombieAvatar: "/zombies/patricia.webp",
        personalityType: "curious",
    },
    "life-coaching": {
        nicheId: "life-coaching",
        zombieName: "Keisha Davis",
        zombieAvatar: "/zombies/keisha.webp",
        personalityType: "enthusiastic",
    },
    "nurse-coach": {
        nicheId: "nurse-coach",
        zombieName: "Maria Santos",
        zombieAvatar: "/zombies/maria.webp",
        personalityType: "supportive",
    },
    "pet-nutrition": {
        nicheId: "pet-nutrition",
        zombieName: "Brianna Cooper",
        zombieAvatar: "/zombies/brianna.webp",
        personalityType: "enthusiastic",
    },
    "reiki-healing": {
        nicheId: "reiki-healing",
        zombieName: "Maya Thompson",
        zombieAvatar: "/zombies/maya.webp",
        personalityType: "empathetic",
    },
    "spiritual-healing": {
        nicheId: "spiritual-healing",
        zombieName: "Rachel Greene",
        zombieAvatar: "/zombies/rachel.webp",
        personalityType: "empathetic",
    },
    "womens-health": {
        nicheId: "womens-health",
        zombieName: "Catherine Brooks",
        zombieAvatar: "/zombies/catherine.webp",
        personalityType: "supportive",
    },
    "womens-hormone-health": {
        nicheId: "womens-hormone-health",
        zombieName: "Catherine Brooks",
        zombieAvatar: "/zombies/catherine.webp",
        personalityType: "supportive",
    },
};

/**
 * Get the zombie data for a given niche.
 * Falls back to functional-medicine (Jennifer) if niche not found.
 */
export function getZombieForNiche(nicheCategory: string): NicheZombieMapping {
    // Normalize niche: remove trailing -diploma, -mini-diploma etc.
    const normalizedNiche = nicheCategory
        .replace(/-mini-diploma$/, "")
        .replace(/-diploma$/, "");

    return NICHE_ZOMBIE_REGISTRY[normalizedNiche] || NICHE_ZOMBIE_REGISTRY["functional-medicine"];
}
