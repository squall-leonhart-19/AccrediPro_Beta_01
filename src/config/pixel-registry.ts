/**
 * 🏛 AccrediPro Product & Pixel Registry (Data-Driven)
 * 
 * Maps specific ClickFunnels Product IDs/SKUs to their designated Niche Pixel.
 * Sourced from: flagship-courses_1st_launch.csv
 */

// 1. The Niche Pixels
export const PIXEL_REGISTRY = {
    SarahFunctionalMedicine: "1322772629882941",
    SarahWomensHormones: "850610277953898",
    SarahIntegrativeMedicine: "891230473365293",
    RoyalCertified: "1287915349067829", // Legacy / Global Pixel
    OliviaNarcTrauma: "1597875198295507",
    OliviaNeurodiversity: "1385545802948983",
    OliviaGriefEndoflife: "24407167482235913",
    MayaTherapyModalities: "1457985822188538",
    MayaMindfulness: "646982888027535",
    LunaSpiritualEnergy: "2704198756438773",
    LunaSexIntimacy: "1434222918226500",
    LunaEsoteric: "1450319269546390",
    EmmaFertilityBirth: "1432983004908408",
    EmmaParenting: "1406328650457869",
    GraceFaithBased: "519202804384181",
    BellaPetWellness: "1532546858004361",
    SageHerbalism: "3036827549833666",
    RachelInclusiveWellness: "903423298829371",
} as const;

export type PixelKey = keyof typeof PIXEL_REGISTRY;

// 2. The Product Map (generated from CSV)
// Maps "CF SKU" (or Product ID pattern) -> PixelKey
const PRODUCT_PIXEL_MAP: Record<string, PixelKey> = {
    // === ROYAL CERTIFIED (Legacy / Core) ===
    "the-coach-business-toolkit": "RoyalCertified",
    "coach-business-toolkit": "RoyalCertified",
    "toolkit": "RoyalCertified",
    "functional-medicine-practitioner": "RoyalCertified",
    "fm078": "RoyalCertified",
    "fm-certification": "RoyalCertified",
    "fm-pro-accelerator": "RoyalCertified", // Assuming legacy FM accelerator also goes here

    // FUNctional Medicine (New Silo - if applicable, otherwise overrides above)
    // "functional-medicine": "SarahFunctionalMedicine", 
    "fm-mini-diploma": "SarahFunctionalMedicine", // Leads go to Niche? Or Royal? Keeping Niche for now based on 'mini diploma' context

    // Women's Health
    "womens-hormone": "SarahWomensHormones",
    "wh044": "SarahWomensHormones",

    // Narrative Medicine / Integration
    "integrative-medicine": "SarahIntegrativeMedicine",
    "gf009": "SarahIntegrativeMedicine",

    // Narcissistic Abuse
    "narcissistic": "OliviaNarcTrauma",
    "nt040": "OliviaNarcTrauma",

    // Neurodiversity
    "autism": "OliviaNeurodiversity",
    "neurodiversity": "OliviaNeurodiversity",
    "nd009": "OliviaNeurodiversity",

    // Grief
    "grief": "OliviaGriefEndoflife",
    "gl013": "OliviaGriefEndoflife",

    // Therapy
    "gestalt": "MayaTherapyModalities",
    "tm014": "MayaTherapyModalities",

    // Mindfulness
    "eft": "MayaMindfulness",
    "tapping": "MayaMindfulness",
    "mm013": "MayaMindfulness",

    // Energy
    "energy-healing": "LunaSpiritualEnergy",
    "se019": "LunaSpiritualEnergy",

    // Sex
    "sex-practitioner": "LunaSexIntimacy",
    "si009": "LunaSexIntimacy",

    // Esoteric
    "astrology": "LunaEsoteric",
    "lu062": "LunaEsoteric",

    // Fertility
    "birth-doula": "EmmaFertilityBirth",
    "fb001": "EmmaFertilityBirth",

    // Parenting
    "conscious-parenting": "EmmaParenting",
    "ep008": "EmmaParenting",

    // Faith
    "christian": "GraceFaithBased",
    "gf003": "GraceFaithBased",

    // Pet
    "pet-wellness": "BellaPetWellness",
    "pw001": "BellaPetWellness",

    // Herbalism
    "herbalist": "SageHerbalism",
    "hb001": "SageHerbalism",

    // Inclusive
    "lgbtq": "RachelInclusiveWellness",
    "iw004": "RachelInclusiveWellness",
};

/**
 * Resolves the correct Pixel ID based on Product ID or Name.
 * Strategy: Check exact map -> Check keyword inclusion -> Default to SarahFM
 */
export const resolvePixelForProduct = (productId: string | undefined, productName: string | undefined): string => {
    const searchString = `${productId || ''} ${productName || ''}`.toLowerCase();

    // 1. Check Keywords in Map
    for (const [key, pixelKey] of Object.entries(PRODUCT_PIXEL_MAP)) {
        if (searchString.includes(key.toLowerCase())) {
            return PIXEL_REGISTRY[pixelKey];
        }
    }

    // 2. Fallback to Functional Medicine (Safe Default)
    // console.warn(`[PixelRegistry] Unknown product: ${searchString}. Defaulting to SarahFM.`);
    return PIXEL_REGISTRY.SarahFunctionalMedicine;
};

// 3. The Tag Map (generated from CSV + Legacy Overrides)
// Maps "CF SKU" or Keyword -> User Tag(s) to apply
const PRODUCT_TAG_MAP: Record<string, string | string[]> = {
    // === ROYAL CERTIFIED (Legacy Bundles) ===
    "fm-pro-accelerator": [
        "fm_pro_practice_path_purchased",
        "fm_pro_master_depth_purchased",
        "fm_pro_advanced_clinical_purchased",
        "functional_medicine_complete_certification_purchased"
    ],
    "functional-medicine-practitioner-certification": "functional_medicine_complete_certification_purchased",
    "fm-certification": "functional_medicine_complete_certification_purchased",
    "the-coach-business-toolkit": "coach_business_toolkit_purchased", // Specific tag for the bump

    // PET WELLNESS
    // PET WELLNESS
    "pet-wellness-specialist-certification": "pet_wellness_specialist_purchased",
    "pw001-pro-accelerator": "pw001_pro_accelerator_purchased",
    "pw001": "pet_wellness_specialist_purchased",

    // BIRTH DOULA
    "birth-doula-coach-certification": "birth_doula_coach_purchased",
    "fb001-pro-accelerator": "fb001_pro_accelerator_purchased",
    "fb001": "birth_doula_coach_purchased",

    // PARENTING
    "conscious-parenting-coach-certification": "conscious_parenting_coach_purchased",
    "ep008-pro-accelerator": "ep008_pro_accelerator_purchased",
    "ep008": "conscious_parenting_coach_purchased",

    // FAITH
    "christian-life-coach-certification": "christian_life_coach_purchased",
    "gf003-pro-accelerator": "gf003_pro_accelerator_purchased",
    "gf003": "christian_life_coach_purchased",

    // SEX
    "sex-practitioner-certification": "sex_practitioner_purchased",
    "si009-pro-accelerator": "si009_pro_accelerator_purchased",
    "si009": "sex_practitioner_purchased",

    // ASTROLOGY (Esoteric)
    "astrology-practitioner-certification": "astrology_practitioner_purchased",
    "lu062-pro-accelerator": "lu062_pro_accelerator_purchased",
    "lu062": "astrology_practitioner_purchased",

    // ENERGY HEALING
    "energy-healing-practitioner-certification": "energy_healing_practitioner_purchased",
    "se019-pro-accelerator": "se019_pro_accelerator_purchased",
    "se019": "energy_healing_practitioner_purchased",

    // EFT/TAPPING
    "efttapping-therapist-certification": "efttapping_therapist_purchased",
    "mm013-pro-accelerator": "mm013_pro_accelerator_purchased",
    "mm013": "efttapping_therapist_purchased",

    // GESTALT
    "gestalt-therapy-practitioner-certification": "gestalt_therapy_practitioner_purchased",
    "tm014-pro-accelerator": "tm014_pro_accelerator_purchased",
    "tm014": "gestalt_therapy_practitioner_purchased",

    // GRIEF
    "grief-and-loss-specialist-certification": "grief_and_loss_specialist_purchased",
    "gl013-pro-accelerator": "gl013_pro_accelerator_purchased",
    "gl013": "grief_and_loss_specialist_purchased",

    // NARCISSISTIC
    "narcissistic-abuse-recovery-specialist-certification": "narcissistic_abuse_recovery_specialist_purchased",
    "nt040-pro-accelerator": "nt040_pro_accelerator_purchased",
    "nt040": "narcissistic_abuse_recovery_specialist_purchased",

    // NEURODIVERSITY
    "autism-and-neurodiversity-support-specialist-certification": "autism_and_neurodiversity_support_specialist_purchased",
    "nd009-pro-accelerator": "nd009_pro_accelerator_purchased",
    "nd009": "autism_and_neurodiversity_support_specialist_purchased",

    // LGBTQ
    "lgbtq-and-affirming-wellness-coach-certification": "lgbtq_and_affirming_wellness_coach_purchased",
    "iw004-pro-accelerator": "iw004_pro_accelerator_purchased",
    "iw004": "lgbtq_and_affirming_wellness_coach_purchased",

    // HERBALISM
    "clinical-herbalist-certification": "clinical_herbalist_purchased",
    "hb001-pro-accelerator": "hb001_pro_accelerator_purchased",
    "hb001": "clinical_herbalist_purchased",

    // FUNCTIONAL MEDICINE
    "functional-medicine-practitioner-certification": "functional_medicine_practitioner_purchased",
    "fm078-pro-accelerator": "fm078_pro_accelerator_purchased",
    "fm078": "functional_medicine_practitioner_purchased",

    // INTEGRATIVE
    "integrative-medicine-practitioner-certification": "integrative_medicine_practitioner_purchased",
    "gf009-pro-accelerator": "gf009_pro_accelerator_purchased",
    "gf009": "integrative_medicine_practitioner_purchased",

    // WOMENS HORMONES
    "womens-hormone-health-specialist-certification": "womens_hormone_health_specialist_purchased",
    "wh044-pro-accelerator": "wh044_pro_accelerator_purchased",
    "wh044": "womens_hormone_health_specialist_purchased",

    // DFY BUSINESS ACCELERATOR
    "dfy-business-accelerator": "dfy_purchased",
    "dfy_business_accelerator": "dfy_purchased",
    "dfy_program_ds": "dfy_purchased",
    "done-for-you": "dfy_purchased",
    "done for you": "dfy_purchased",
};

/**
 * Resolves the User Tag to apply based on Product ID/Name
 */
export const resolveTagsForProduct = (productId: string | undefined, productName: string | undefined): string | string[] | null => {
    const searchString = `${productId || ''} ${productName || ''}`.toLowerCase();

    // 1. Check Exact/Partial Keyword in Map
    for (const [key, tag] of Object.entries(PRODUCT_TAG_MAP)) {
        if (searchString.includes(key.toLowerCase())) {
            return tag;
        }
    }
    return null;
};
