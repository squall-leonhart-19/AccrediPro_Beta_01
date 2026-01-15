/**
 * Unify Lesson CSS - Batch Update Script
 * Updates all FM lesson HTML files to use the unified Gold Standard v5.0 CSS
 *
 * Usage: npx tsx scripts/unify-lesson-css.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const FM_PATH = path.join(process.cwd(), 'FM/FM-Update');
const UNIFIED_CSS_PATH = path.join(FM_PATH, 'shared/lesson-styles-unified.css');

// Read the unified CSS
const unifiedCSS = fs.readFileSync(UNIFIED_CSS_PATH, 'utf-8');

// Modules to process
const modules = [
  'Module_00',
  'Module_01',
  'Module_02',
  'Module_03',
  'Module_04',
  'Module_05',
  'Module_06',
  'Module_07',
  'Module_08',
  'Module_09',
  'Module_10',
  'Module_11',
  'Module_12',
  'Module_14',
  'Module_15',
  'Module_16',
  'Module_18',
  'Module_19',
  'Module_20',
];

function processFile(filePath: string): boolean {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Extract body content
  const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) {
    console.log(`  ⚠️  No body found in ${path.basename(filePath)}`);
    return false;
  }

  // Extract title
  const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : 'Lesson';

  // Get body content
  let bodyContent = bodyMatch[1].trim();

  // Remove any existing brand-header or lesson-footer divs
  bodyContent = bodyContent.replace(/<div class="brand-header"><\/div>/g, '');
  bodyContent = bodyContent.replace(/<div class="lesson-footer"><\/div>/g, '');

  // Create new HTML with unified CSS
  const newHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
${unifiedCSS}
    </style>
</head>
<body>
${bodyContent}
</body>
</html>`;

  // Write back
  fs.writeFileSync(filePath, newHTML);
  return true;
}

async function main() {
  console.log('🚀 Unifying Lesson CSS (Gold Standard v5.0)\n');
  console.log(`📂 Source: ${FM_PATH}\n`);

  let totalProcessed = 0;
  let totalSuccess = 0;

  for (const moduleName of modules) {
    const modulePath = path.join(FM_PATH, moduleName);

    if (!fs.existsSync(modulePath)) {
      console.log(`⏭️  Skipping ${moduleName} (not found)`);
      continue;
    }

    const files = fs.readdirSync(modulePath).filter(f => f.endsWith('.html'));

    if (files.length === 0) {
      console.log(`⏭️  Skipping ${moduleName} (no HTML files)`);
      continue;
    }

    console.log(`\n📦 Processing ${moduleName} (${files.length} files)...`);

    for (const file of files) {
      const filePath = path.join(modulePath, file);
      totalProcessed++;

      try {
        const success = processFile(filePath);
        if (success) {
          totalSuccess++;
          console.log(`   ✅ ${file}`);
        }
      } catch (error) {
        console.log(`   ❌ ${file}: ${error}`);
      }
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`📊 Summary: ${totalSuccess}/${totalProcessed} files updated`);
  console.log('✨ All lessons now use unified Gold Standard v5.0 CSS!');
  console.log('\n💡 Next step: Run import scripts to update database content.');
}

main().catch(console.error);
