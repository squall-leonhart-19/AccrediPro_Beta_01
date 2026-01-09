#!/usr/bin/env node
/**
 * Fix Course Thumbnails and Categories
 * - Updates thumbnail paths to match actual file names
 * - Consolidates duplicate categories
 */

require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const fs = require('fs');
const path = require('path');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'courses', 'images');

// Mapping from course slug patterns to actual image file base names
const SLUG_TO_IMAGE_MAP = {
    'certified-astronomy-practitioner': 'certified-astronomy-practitioner',
    'astronomy-practitioner': 'certified-astronomy-practitioner',

    'certified-autism-and-neurodiversity-support-specialist': 'certified-autism-and-neurodiversity-support-specialist',
    'autism-and-neurodiversity-support-specialist': 'certified-autism-and-neurodiversity-support-specialist',

    'certified-birth-doula-coach': 'certified-birth-doula-coach',
    'birth-doula-coach': 'certified-birth-doula-coach',

    'certified-christian-life-coach': 'certified-christian-life-coach',
    'christian-life-coach': 'certified-christian-life-coach',

    'certified-clinical-herbalist': 'certified-clinical-herbalist',
    'clinical-herbalist': 'certified-clinical-herbalist',

    'certified-conscious-parenting-coach': 'certified-conscious-parenting-coach',
    'conscious-parenting-coach': 'certified-conscious-parenting-coach',

    'certified-efttapping-therapist': 'certified-efttapping-therapist',
    'efttapping-therapist': 'certified-efttapping-therapist',

    'certified-energy-healing-practitioner': 'certified-energy-healing-practitioner',
    'energy-healing-practitioner': 'certified-energy-healing-practitioner',

    'certified-functional-medicine-practitioner': 'certified-functional-medicine-practitioner',
    'functional-medicine-practitioner': 'certified-functional-medicine-practitioner',

    'certified-gestalt-therapy-practitioner': 'certified-gestalt-therapy-practitioner',
    'gestalt-therapy-practitioner': 'certified-gestalt-therapy-practitioner',

    'certified-grief-and-loss-specialist': 'certified-grief-and-loss-specialist',
    'grief-and-loss-specialist': 'certified-grief-and-loss-specialist',

    'certified-integrative-medicine-practitioner': 'certified-integrative-medicine-practitioner',
    'integrative-medicine-practitioner': 'certified-integrative-medicine-practitioner',

    'certified-lgbtq-affirming-wellness-coach': 'certified-lgbtq-affirming-wellness-coach',
    'lgbtq-affirming-wellness-coach': 'certified-lgbtq-affirming-wellness-coach',

    'certified-narcissistic-abuse-recovery-specialist': 'certified-narcissistic-abuse-recovery-specialist',
    'narcissistic-abuse-recovery-specialist': 'certified-narcissistic-abuse-recovery-specialist',

    'certified-pet-wellness-specialist': 'certified-pet-wellness-specialist',
    'pet-wellness-specialist': 'certified-pet-wellness-specialist',

    'certified-sex-practitioner': 'certified-sex-practitioner',
    'sex-practitioner': 'certified-sex-practitioner',

    'certified-womens-hormone-health-specialist': 'certified-womens-hormone-health-specialist',
    'womens-hormone-health-specialist': 'certified-womens-hormone-health-specialist',
};

// Get available images
function getAvailableImages() {
    const files = fs.readdirSync(IMAGES_DIR);
    return files.filter(f => f.endsWith('.webp'));
}

// Find matching image for course
function findImageForCourse(slug, title) {
    const availableImages = getAvailableImages();

    // Determine tier from slug/title
    let tier = '1';
    if (slug.includes('advanced') || title.toLowerCase().includes('advanced')) tier = '2';
    else if (slug.includes('master') || title.toLowerCase().includes('master')) tier = '3';
    else if (slug.includes('practice') || title.toLowerCase().includes('practice path')) tier = '4';

    // Try to match by slug pattern
    for (const [pattern, imageBase] of Object.entries(SLUG_TO_IMAGE_MAP)) {
        if (slug.includes(pattern)) {
            const imageName = `${imageBase}_l${tier}.webp`;
            if (availableImages.includes(imageName)) {
                return `/courses/images/${imageName}`;
            }
        }
    }

    // Try fuzzy match on slug
    const slugClean = slug.replace(/-advanced$|-master$|-practice-path$/, '');
    for (const img of availableImages) {
        const imgBase = img.replace(/_l\d\.webp$/, '');
        if (slugClean.includes(imgBase) || imgBase.includes(slugClean.substring(0, 20))) {
            const imageName = `${imgBase}_l${tier}.webp`;
            if (availableImages.includes(imageName)) {
                return `/courses/images/${imageName}`;
            }
        }
    }

    return null; // Use fallback
}

async function fixThumbnails() {
    console.log('🖼️ Fixing course thumbnails...\n');

    const courses = await prisma.course.findMany({
        select: { id: true, slug: true, title: true, thumbnail: true }
    });

    let fixed = 0;
    for (const course of courses) {
        const newThumbnail = findImageForCourse(course.slug, course.title);

        if (newThumbnail && newThumbnail !== course.thumbnail) {
            await prisma.course.update({
                where: { id: course.id },
                data: { thumbnail: newThumbnail }
            });
            console.log(`  ✅ ${course.slug} → ${newThumbnail}`);
            fixed++;
        }
    }

    console.log(`\n📊 Fixed ${fixed} thumbnails`);
}

async function consolidateCategories() {
    console.log('\n📁 Consolidating categories...\n');

    // Keep these primary categories
    const PRIMARY_CATEGORIES = {
        'Health & Wellness': ['Wellness & Balance', 'Functional Medicine', 'Herbalism'],
        'Mental Health': ['Mental Health & Trauma'],
        'Spiritual & Energy': ['Spiritual Healing'],
        "Women's Health": [],
        'Family & Parenting': [],
        'Therapy & Bodywork': [],
        'Pet & Animal': [],
    };

    // Delete empty/unused categories
    const categoriesToDelete = [
        'Leadership & Management',
        'Business Strategy',
        'Communication Skills',
        'Technology & Digital',
        'Mini Diploma',
        'Level 1: Core Certifications',
        'Level 2: Advanced Specializations',
        'Level 3: Business Mastery',
        'Gut Health',
    ];

    for (const catName of categoriesToDelete) {
        try {
            // First move any courses to a better category
            const cat = await prisma.category.findUnique({
                where: { name: catName },
                select: { id: true }
            });

            if (cat) {
                // Move courses to Health & Wellness
                const targetCat = await prisma.category.findUnique({
                    where: { name: 'Health & Wellness' },
                    select: { id: true }
                });

                if (targetCat) {
                    await prisma.course.updateMany({
                        where: { categoryId: cat.id },
                        data: { categoryId: targetCat.id }
                    });
                }

                // Delete the category
                await prisma.category.delete({
                    where: { id: cat.id }
                });
                console.log(`  🗑️ Deleted category: ${catName}`);
            }
        } catch (e) {
            // Category might not exist or have constraints
        }
    }

    console.log('\n✅ Categories consolidated');
}

async function main() {
    console.log('🔧 Fixing Course Display Issues\n');
    console.log('='.repeat(60));

    await fixThumbnails();
    await consolidateCategories();

    console.log('\n' + '='.repeat(60));
    console.log('✅ All fixes applied!');

    await prisma.$disconnect();
}

main().catch(async (error) => {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
});
