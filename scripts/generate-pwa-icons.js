/**
 * PWA Icon Generator Script
 *
 * Run: node scripts/generate-pwa-icons.js
 *
 * Generates PNG icons from the ASI logo for PWA
 * Uses sharp for image processing
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available, if not provide instructions
let sharp;
try {
  sharp = require('sharp');
} catch {
  console.log('Sharp not installed. Installing...');
  console.log('Run: npm install sharp --save-dev');
  console.log('\nAlternatively, manually create PNG icons from the ASI logo:');
  console.log('Source: /public/ASI_LOGO-removebg-preview.png');
  console.log('Required sizes: 72, 96, 128, 144, 152, 192, 384, 512');
  process.exit(1);
}

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '../public/icons');
const sourceLogo = path.join(__dirname, '../public/ASI_LOGO-removebg-preview.png');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

async function generateIcons() {
  console.log('Generating PWA icons from ASI logo...\n');

  for (const size of sizes) {
    const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);

    try {
      // Create a square icon with the logo centered on a burgundy background
      const background = Buffer.from(
        `<svg width="${size}" height="${size}">
          <rect width="${size}" height="${size}" fill="#722f37" rx="${Math.round(size * 0.15)}"/>
        </svg>`
      );

      // Resize logo to fit within the icon (with padding)
      const logoSize = Math.round(size * 0.7);
      const resizedLogo = await sharp(sourceLogo)
        .resize(logoSize, logoSize, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .toBuffer();

      // Composite the logo onto the background
      const padding = Math.round((size - logoSize) / 2);

      await sharp(background)
        .composite([
          {
            input: resizedLogo,
            top: padding,
            left: padding
          }
        ])
        .png()
        .toFile(outputPath);

      console.log(`✓ Created icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`✗ Error creating ${size}x${size}: ${error.message}`);
    }
  }

  console.log('\n✅ PWA icons generated successfully!');
  console.log('\nNext steps:');
  console.log('1. Verify icons look correct in /public/icons/');
  console.log('2. Update manifest.json if needed');
  console.log('3. Deploy to production');
}

generateIcons().catch(console.error);
