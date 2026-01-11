
import fs from 'fs';
import path from 'path';

// Usage: npx tsx scripts/scaffold-mini-diploma.ts --name "Gut Health" --slug "gut-health"

const args = process.argv.slice(2);
const nameArg = args.indexOf('--name');
const slugArg = args.indexOf('--slug');

if (nameArg === -1 || slugArg === -1) {
    console.error('Usage: npx tsx scripts/scaffold-mini-diploma.ts --name "Gut Health" --slug "gut-health"');
    process.exit(1);
}

const NEW_NAME = args[nameArg + 1];
const NEW_SLUG = args[slugArg + 1];

const ROOT_DIR = process.cwd();

// Source Paths (The Templates)
const SRC_LANDING = path.join(ROOT_DIR, 'src/app/(public)/womens-health-mini-diploma');
const SRC_LESSONS = path.join(ROOT_DIR, 'src/components/mini-diploma/lessons/womens-health');
const SRC_NURTURE = path.join(ROOT_DIR, 'src/lib/wh-nurture-60-day-v3.ts');
const SRC_DMS = path.join(ROOT_DIR, 'src/lib/wh-sarah-dms.ts');

// Destination Paths (The New Assets)
const DEST_LANDING = path.join(ROOT_DIR, `src/app/(public)/${NEW_SLUG}-mini-diploma`);
const DEST_LESSONS = path.join(ROOT_DIR, `src/components/mini-diploma/lessons/${NEW_SLUG}`);
const DEST_NURTURE = path.join(ROOT_DIR, `src/lib/${NEW_SLUG}-nurture-60-day.ts`);
const DEST_DMS = path.join(ROOT_DIR, `src/lib/${NEW_SLUG}-dms.ts`);

function mkdir(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function replaceContent(content: string, isCode: boolean = false): string {
    let newContent = content;

    // 1. Literal Name Replacements
    newContent = newContent.replace(/Women's Health/g, NEW_NAME);

    // 2. Slug Replacements
    newContent = newContent.replace(/womens-health-mini-diploma/g, `${NEW_SLUG}-mini-diploma`);
    newContent = newContent.replace(/womens-health/g, NEW_SLUG); // General slug replacement

    // 3. Code/Tag Replacements
    newContent = newContent.replace(/wh-nurture/g, `${NEW_SLUG}-nurture`);
    newContent = newContent.replace(/wh-dm/g, `${NEW_SLUG}-dm`);
    newContent = newContent.replace(/wh-lesson/g, `${NEW_SLUG}-lesson`);
    newContent = newContent.replace(/wh-mini-diploma/g, `${NEW_SLUG}-mini-diploma`);

    // 4. File Import Replacements (Specific to Nurture/DM cloning)
    if (isCode) {
        // Fix imports in the generated nurture file
        newContent = newContent.replace(/WH_NURTURE_60_DAY_V3/g, `${NEW_SLUG.toUpperCase().replace(/-/g, '_')}_NURTURE_SEQUENCE`);
        newContent = newContent.replace(/TIME_BASED_DMS/g, `${NEW_SLUG.toUpperCase().replace(/-/g, '_')}_DMS`);
    }

    return newContent;
}

function cloneDirectory(src: string, dest: string) {
    mkdir(dest);
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        // Rename files if they contain the slug (e.g. lesson-router)
        // Actually, specific lesson files don't usually have "womens-health" in the filename, but good to be safe
        let destName = entry.name.replace(/womens-health/g, NEW_SLUG);
        const destPath = path.join(dest, destName);

        if (entry.isDirectory()) {
            cloneDirectory(srcPath, destPath);
        } else {
            const content = fs.readFileSync(srcPath, 'utf8');
            const newContent = replaceContent(content, srcPath.endsWith('.ts') || srcPath.endsWith('.tsx'));
            fs.writeFileSync(destPath, newContent);
            console.log(`Created: ${destPath}`);
        }
    }
}

function cloneFile(src: string, dest: string) {
    const content = fs.readFileSync(src, 'utf8');
    const newContent = replaceContent(content, true);
    fs.writeFileSync(dest, newContent);
    console.log(`Created: ${dest}`);
}

async function updateRegistry() {
    const registryPath = path.join(ROOT_DIR, 'src/lib/mini-diploma-registry.ts');
    let content = fs.readFileSync(registryPath, 'utf8');

    // Prepare Import Statements
    const nurtureImport = `import { ${NEW_SLUG.toUpperCase().replace(/-/g, '_')}_NURTURE_SEQUENCE } from "./${NEW_SLUG}-nurture-60-day";\n`;
    const dmImport = `import { ${NEW_SLUG.toUpperCase().replace(/-/g, '_')}_DMS } from "./${NEW_SLUG}-dms";\n`;

    // Prepare Config Object
    const newConfig = `
    "${NEW_SLUG}-mini-diploma": {
        name: "${NEW_NAME}",
        slug: "${NEW_SLUG}-mini-diploma",
        nurtureSequence: ${NEW_SLUG.toUpperCase().replace(/-/g, '_')}_NURTURE_SEQUENCE,
        dmSequence: ${NEW_SLUG.toUpperCase().replace(/-/g, '_')}_DMS,
        nudgePrefix: "${NEW_SLUG}-nudge",
        nurturePrefix: "${NEW_SLUG}-nurture",
        completionTag: "${NEW_SLUG}-mini-diploma:completed"
    },`;

    // Inject Imports (at top)
    content = nurtureImport + dmImport + content;

    // Inject Config (before end of object)
    // Find the closing brace of the registry object
    const registryEndIndex = content.lastIndexOf('};');
    if (registryEndIndex !== -1) {
        content = content.slice(0, registryEndIndex) + newConfig + "\n" + content.slice(registryEndIndex);
    }

    fs.writeFileSync(registryPath, content);
    console.log(`Updated Registry: ${registryPath}`);
}

// MAIN EXECUTION
console.log(`🚀 Scaffolding Mini Diploma: ${NEW_NAME} (${NEW_SLUG})...`);

try {
    // 1. Clone Landing Page
    cloneDirectory(SRC_LANDING, DEST_LANDING);

    // 2. Clone Lessons
    cloneDirectory(SRC_LESSONS, DEST_LESSONS);

    // 3. Clone Nurture
    cloneFile(SRC_NURTURE, DEST_NURTURE);

    // 4. Clone DMs
    cloneFile(SRC_DMS, DEST_DMS);

    // 5. Update Registry
    updateRegistry();

    console.log(`✅ Success! Generated ${NEW_NAME} Mini Diploma.`);
    console.log(`\nNEXT STEPS:`);
    console.log(`1. Review content in src/lib/${NEW_SLUG}-nurture-60-day.ts`);
    console.log(`2. Review content in src/components/mini-diploma/lessons/${NEW_SLUG}/`);

} catch (e) {
    console.error("Error scaffolding:", e);
}
