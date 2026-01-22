import prisma from './src/lib/prisma';

// Test the name parsing logic
function parseProductNameToCourseSlugs(productName: string, productId?: string): string[] {
    if (!productName) return [];

    const lowerName = productName.toLowerCase().trim();

    const isProAccelerator = lowerName.includes('pro accelerator') ||
        lowerName.includes('pro-accelerator') ||
        productId?.includes('pro-accelerator');

    let cleanName = lowerName
        .replace(/™|®|©/g, '')
        .replace(/certified\s*/gi, '')
        .replace(/\s*certification\s*/gi, '')
        .replace(/\s*pro\s*accelerator\s*/gi, '')
        .replace(/\s+/g, ' ')
        .trim();

    let baseSlug = cleanName
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    if (!baseSlug.startsWith('certified-')) {
        baseSlug = 'certified-' + baseSlug;
    }

    if (isProAccelerator) {
        return [baseSlug + '-advanced', baseSlug + '-master', baseSlug + '-practice'];
    }

    return [baseSlug];
}

// Test cases
const testCases = [
    'Certified Gut Health Specialist™',
    'Gut Health Pro Accelerator',
    'Certified Trauma Recovery Specialist™',
    'Trauma Recovery Pro Accelerator',
    'Certified Tantra Practitioner™',
    'Certified Pet Wellness Specialist™',
];

async function main() {
    console.log('=== TESTING DYNAMIC COURSE MATCHING ===\n');

    for (const name of testCases) {
        const slugs = parseProductNameToCourseSlugs(name, undefined);
        console.log('Product:', name);
        console.log('  Parsed slugs:', slugs);

        // Check if courses exist in DB
        for (const slug of slugs) {
            const course = await prisma.course.findFirst({ where: { slug }, select: { slug: true, title: true } });
            if (course) {
                console.log('  ✅ DB Match:', course.slug);
            } else {
                console.log('  ❌ No match for:', slug);
            }
        }
        console.log('');
    }
}

main().finally(() => prisma.$disconnect());
