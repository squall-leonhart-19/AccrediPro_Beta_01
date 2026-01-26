
/**
 * Script to replace external assets from coach.accredipro.academy with R2 URLs
 * Run with: npx tsx scripts/replace-external-assets.ts
 */

import fs from 'fs';
import path from 'path';

const OLD_DOMAIN_REGEX = /https:\/\/coach\.accredipro\.academy\/wp-content\/uploads\/\d{4}\/\d{2}\/([^"'\)\s]+)/gi;
const NEW_BASE_URL = "https://assets.accredipro.academy/migrated/";

const ROOT_DIR = process.cwd();
const EXCLUDE_DIRS = ['node_modules', '.git', '.next', '.gemini', 'dist', 'build', 'coverage'];
const INCLUDE_EXTS = ['.ts', '.tsx', '.js', '.jsx', '.html', '.css', '.scss', '.md', '.json'];

function getAllFiles(dir: string, fileList: string[] = []): string[] {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (!EXCLUDE_DIRS.includes(file)) {
                getAllFiles(filePath, fileList);
            }
        } else {
            if (INCLUDE_EXTS.includes(path.extname(file))) {
                fileList.push(filePath);
            }
        }
    });

    return fileList;
}

function normalizeOldUrl(url: string): string {
    // Some URLs might have query params or be different casing, but the regex captures the filename
    // We just need to make sure we construct the new URL correctly
    return url;
}

async function main() {
    console.log("🚀 Starting asset URL replacement...");
    console.log(`Target: ${NEW_BASE_URL}`);

    const allFiles = getAllFiles(ROOT_DIR);
    let changedFiles = 0;
    let totalReplacements = 0;

    for (const filePath of allFiles) {
        const content = fs.readFileSync(filePath, 'utf8');

        // Find matches
        const matches = content.match(OLD_DOMAIN_REGEX);

        if (matches && matches.length > 0) {
            let newContent = content;
            let fileReplacements = 0;

            // Replace all occurrences
            newContent = content.replace(OLD_DOMAIN_REGEX, (match, filename) => {
                fileReplacements++;
                // Handle potential URL encoding or query params if needed, but simple filename usually works
                // Clean filename of any trailing punctuation captured by greedy regex if any (regex above excludes quotes/spaces)
                const cleanFilename = filename.split('?')[0];
                return `${NEW_BASE_URL}${cleanFilename}`;
            });

            if (newContent !== content) {
                fs.writeFileSync(filePath, newContent, 'utf8');
                console.log(`✅ Updated ${path.relative(ROOT_DIR, filePath)} (${fileReplacements} matches)`);
                changedFiles++;
                totalReplacements += fileReplacements;
            }
        }
    }

    console.log("\n========================================");
    console.log(`🎉 Replacement Complete!`);
    console.log(`Files updated: ${changedFiles}`);
    console.log(`Total URLs replaced: ${totalReplacements}`);
    console.log("========================================");
}

main().catch(console.error);
