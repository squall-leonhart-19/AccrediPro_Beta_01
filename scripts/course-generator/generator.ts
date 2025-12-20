/**
 * Course Generator - Main Script
 * Generates complete course structures from templates
 */

import { generateMiniDiploma, type MiniDiplomaConfig } from './templates/mini-diploma';
import { generateFoundationCertificate, FOUNDATION_DEFAULTS, type FoundationConfig } from './templates/foundation';
import { generatePractitionerBundle, PRACTITIONER_BUNDLE_DEFAULTS, type PractitionerBundleConfig } from './templates/practitioner-bundle';
import { generateIncomeAccelerator, INCOME_ACCELERATOR_DEFAULTS, type IncomeAcceleratorConfig } from './templates/income-accelerator';
import * as fs from 'fs/promises';
import * as path from 'path';

// Niche definition interface
export interface NicheDefinition {
    name: string;
    slug: string;
    category: string;
    categorySlug: string;
    targetAudience: string;
    keyBenefit: string;
    primaryProblem: string;
    // Optional advanced configs
    rootCauses?: string[];
    assessmentMethods?: string[];
    treatmentApproaches?: string[];
    specialPopulations?: string[];
    advancedTopics?: string[];
    masterTopics?: string[];
    specializations?: string[];
    averageClientPrice?: string;
    potentialMonthlyIncome?: string;
    typicalClientProblems?: string[];
    serviceFormats?: string[];
}

export type CourseLevel = 'mini-diploma' | 'foundation' | 'practitioner-bundle' | 'income-accelerator' | 'all';

export interface GeneratedCourse {
    level: string;
    course: {
        title: string;
        slug: string;
        description: string;
        shortDescription: string;
        price: number;
        duration: number;
    };
    modules: Array<{
        title: string;
        description: string;
        lessons: Array<{
            title: string;
            description: string;
            duration: number;
            isFreePreview?: boolean;
            lessonType?: string;
        }>;
    }>;
    niche: NicheDefinition;
    generatedAt: string;
}

/**
 * Generate all courses for a given niche
 */
export function generateCoursesForNiche(niche: NicheDefinition, level: CourseLevel = 'all'): GeneratedCourse[] {
    const results: GeneratedCourse[] = [];
    const timestamp = new Date().toISOString();

    // Mini Diploma
    if (level === 'mini-diploma' || level === 'all') {
        const miniDiplomaConfig: MiniDiplomaConfig = {
            nicheName: niche.name,
            nicheSlug: niche.slug,
            category: niche.category,
            categorySlug: niche.categorySlug,
            targetAudience: niche.targetAudience,
            keyBenefit: niche.keyBenefit,
            primaryProblem: niche.primaryProblem,
        };
        const miniDiploma = generateMiniDiploma(miniDiplomaConfig);
        results.push({
            level: 'mini-diploma',
            ...miniDiploma,
            niche,
            generatedAt: timestamp,
        });
    }

    // Foundation Certificate
    if (level === 'foundation' || level === 'all') {
        const foundationConfig: FoundationConfig = {
            nicheName: niche.name,
            nicheSlug: niche.slug,
            category: niche.category,
            categorySlug: niche.categorySlug,
            targetAudience: niche.targetAudience,
            keyBenefit: niche.keyBenefit,
            primaryProblem: niche.primaryProblem,
            rootCauses: niche.rootCauses || FOUNDATION_DEFAULTS.rootCauses,
            assessmentMethods: niche.assessmentMethods || FOUNDATION_DEFAULTS.assessmentMethods,
            treatmentApproaches: niche.treatmentApproaches || FOUNDATION_DEFAULTS.treatmentApproaches,
            specialPopulations: niche.specialPopulations || FOUNDATION_DEFAULTS.specialPopulations,
        };
        const foundation = generateFoundationCertificate(foundationConfig);
        results.push({
            level: 'foundation',
            ...foundation,
            niche,
            generatedAt: timestamp,
        });
    }

    // Practitioner Bundle
    if (level === 'practitioner-bundle' || level === 'all') {
        const bundleConfig: PractitionerBundleConfig = {
            nicheName: niche.name,
            nicheSlug: niche.slug,
            category: niche.category,
            categorySlug: niche.categorySlug,
            targetAudience: niche.targetAudience,
            keyBenefit: niche.keyBenefit,
            primaryProblem: niche.primaryProblem,
            advancedTopics: niche.advancedTopics || PRACTITIONER_BUNDLE_DEFAULTS.advancedTopics,
            masterTopics: niche.masterTopics || PRACTITIONER_BUNDLE_DEFAULTS.masterTopics,
            specializations: niche.specializations || PRACTITIONER_BUNDLE_DEFAULTS.specializations,
        };
        const bundle = generatePractitionerBundle(bundleConfig);
        results.push({
            level: 'practitioner-bundle',
            ...bundle,
            niche,
            generatedAt: timestamp,
        });
    }

    // Income Accelerator
    if (level === 'income-accelerator' || level === 'all') {
        const incomeConfig: IncomeAcceleratorConfig = {
            nicheName: niche.name,
            nicheSlug: niche.slug,
            category: niche.category,
            categorySlug: niche.categorySlug,
            targetAudience: niche.targetAudience,
            averageClientPrice: niche.averageClientPrice || INCOME_ACCELERATOR_DEFAULTS.averageClientPrice,
            potentialMonthlyIncome: niche.potentialMonthlyIncome || INCOME_ACCELERATOR_DEFAULTS.potentialMonthlyIncome,
            typicalClientProblems: niche.typicalClientProblems || INCOME_ACCELERATOR_DEFAULTS.typicalClientProblems,
            serviceFormats: niche.serviceFormats || INCOME_ACCELERATOR_DEFAULTS.serviceFormats,
        };
        const income = generateIncomeAccelerator(incomeConfig);
        results.push({
            level: 'income-accelerator',
            ...income,
            niche,
            generatedAt: timestamp,
        });
    }

    return results;
}

/**
 * Save generated courses to JSON files
 */
export async function saveGeneratedCourses(courses: GeneratedCourse[], outputDir: string): Promise<string[]> {
    await fs.mkdir(outputDir, { recursive: true });
    const savedFiles: string[] = [];

    for (const course of courses) {
        const filename = `${course.course.slug}.json`;
        const filepath = path.join(outputDir, filename);
        await fs.writeFile(filepath, JSON.stringify(course, null, 2));
        savedFiles.push(filepath);
    }

    return savedFiles;
}

/**
 * CLI entry point
 */
async function main() {
    const args = process.argv.slice(2);

    // Parse arguments
    const nicheArg = args.find(a => a.startsWith('--niche='))?.split('=')[1];
    const levelArg = args.find(a => a.startsWith('--level='))?.split('=')[1] as CourseLevel || 'all';
    const outputArg = args.find(a => a.startsWith('--output='))?.split('=')[1] || './output';

    if (!nicheArg) {
        console.log('Usage: npx tsx generator.ts --niche=gut-health [--level=all|mini-diploma|foundation|practitioner-bundle|income-accelerator] [--output=./output]');
        console.log('\nAvailable niches:');
        console.log('  gut-health, womens-hormone-health, narcissistic-abuse-recovery, nervous-system-regulation');
        console.log('  (or load from niches.json for all 405 niches)');
        process.exit(1);
    }

    // Load niche definition
    const nichesPath = path.join(__dirname, 'niches.json');
    let niche: NicheDefinition;

    try {
        const nichesData = await fs.readFile(nichesPath, 'utf-8');
        const niches = JSON.parse(nichesData) as Record<string, NicheDefinition>;
        niche = niches[nicheArg];
        if (!niche) {
            throw new Error(`Niche "${nicheArg}" not found in niches.json`);
        }
    } catch {
        // Use inline defaults for pilot niches
        const PILOT_NICHES: Record<string, NicheDefinition> = {
            'gut-health': {
                name: 'Gut Health',
                slug: 'gut-health',
                category: 'Gut Health',
                categorySlug: 'gut-health',
                targetAudience: 'women struggling with digestive issues',
                keyBenefit: 'restored gut health and vitality',
                primaryProblem: 'bloating, IBS, and digestive dysfunction',
                rootCauses: ['Poor Diet & Food Sensitivities', 'Stress & Nervous System Dysregulation', 'Microbiome Imbalance'],
                assessmentMethods: ['Comprehensive Health History', 'Symptom Pattern Analysis', 'Food & Lifestyle Journal'],
                treatmentApproaches: ['The 5R Gut Healing Protocol', 'Anti-Inflammatory Nutrition', 'Stress Reduction'],
                specialPopulations: ['Women Over 40'],
                advancedTopics: ['Advanced GI Testing (GI-MAP, SIBO)', 'Complex Protocol Design'],
                masterTopics: ['Microbiome Mastery', 'Gut-Brain Axis Expert'],
                specializations: ['SIBO & IBS', 'Leaky Gut Repair', 'Autoimmune Gut Healing'],
                potentialMonthlyIncome: '$5,000-$15,000/month',
                averageClientPrice: '$500-$2,500 per client',
            },
            'womens-hormone-health': {
                name: "Women's Hormone Health",
                slug: 'womens-hormone-health',
                category: "Women's Health",
                categorySlug: 'womens-health',
                targetAudience: 'women experiencing hormonal imbalances',
                keyBenefit: 'balanced hormones and renewed energy',
                primaryProblem: 'fatigue, weight gain, and mood swings',
                rootCauses: ['Estrogen Dominance', 'Adrenal Dysfunction', 'Thyroid Imbalances'],
                treatmentApproaches: ['Cycle Syncing', 'Hormone-Supportive Nutrition'],
                specialPopulations: ['Perimenopausal Women'],
                specializations: ['Perimenopause & Menopause', 'PCOS', 'Thyroid Health'],
                potentialMonthlyIncome: '$8,000-$20,000/month',
            },
            'narcissistic-abuse-recovery': {
                name: 'Narcissistic Abuse Recovery',
                slug: 'narcissistic-abuse-recovery',
                category: 'Relationship Trauma',
                categorySlug: 'relationship-trauma',
                targetAudience: 'survivors of narcissistic abuse',
                keyBenefit: 'healing and reclaiming their identity',
                primaryProblem: 'trauma bonds and emotional manipulation',
                rootCauses: ['Trauma Bonding', 'Identity Erosion', 'Nervous System Dysregulation'],
                treatmentApproaches: ['Trauma-Informed Coaching', 'Nervous System Regulation'],
                specialPopulations: ['Women Leaving Toxic Relationships'],
                specializations: ['Trauma Bond Breaking', 'Self-Worth Rebuilding', 'Boundary Setting'],
                potentialMonthlyIncome: '$6,000-$18,000/month',
            },
            'nervous-system-regulation': {
                name: 'Nervous System Regulation',
                slug: 'nervous-system-regulation',
                category: 'Mental Health',
                categorySlug: 'mental-health',
                targetAudience: 'people struggling with anxiety and chronic stress',
                keyBenefit: 'a calm, regulated nervous system',
                primaryProblem: 'chronic stress, anxiety, and dysregulation',
                rootCauses: ['Chronic Stress', 'Unresolved Trauma', 'Lifestyle Factors'],
                treatmentApproaches: ['Polyvagal Techniques', 'Somatic Practices'],
                specialPopulations: ['High-Stress Professionals'],
                specializations: ['Anxiety & Panic', 'Trauma Recovery', 'Burnout Healing'],
                potentialMonthlyIncome: '$5,000-$15,000/month',
            },
        };

        niche = PILOT_NICHES[nicheArg];
        if (!niche) {
            console.error(`Niche "${nicheArg}" not found. Available pilot niches: ${Object.keys(PILOT_NICHES).join(', ')}`);
            process.exit(1);
        }
    }

    console.log(`\n🚀 Generating ${levelArg} course(s) for: ${niche.name}\n`);

    const courses = generateCoursesForNiche(niche, levelArg);
    const outputPath = path.resolve(process.cwd(), outputArg);
    const savedFiles = await saveGeneratedCourses(courses, outputPath);

    console.log(`✅ Generated ${courses.length} course(s):\n`);
    for (const course of courses) {
        console.log(`   📚 ${course.course.title}`);
        console.log(`      Slug: ${course.course.slug}`);
        console.log(`      Modules: ${course.modules.length}`);
        console.log(`      Lessons: ${course.modules.reduce((acc, m) => acc + m.lessons.length, 0)}`);
        console.log(`      Price: $${course.course.price}`);
        console.log('');
    }

    console.log(`📁 Saved to: ${outputPath}`);
    savedFiles.forEach(f => console.log(`   → ${path.basename(f)}`));
}

main().catch(console.error);
