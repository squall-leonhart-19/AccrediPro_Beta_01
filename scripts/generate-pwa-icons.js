/**
 * PWA Icon Generator Script
 *
 * Run: node scripts/generate-pwa-icons.js
 *
 * This generates placeholder icons. Replace with actual ASI branded icons:
 * - Use the ASI logo from: https://coach.accredipro.academy/wp-content/uploads/2026/01/ASI_LOGO-removebg-preview.png
 * - Export in sizes: 72, 96, 128, 144, 152, 192, 384, 512
 */

const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '../public/icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG placeholder icons
sizes.forEach(size => {
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#722f37" rx="${size * 0.15}"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#d4af37" font-family="Arial, sans-serif" font-weight="bold" font-size="${size * 0.25}">ASI</text>
</svg>`;

  fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.svg`), svg);
  console.log(`Created icon-${size}x${size}.svg`);
});

console.log('\\nPlaceholder icons created!');
console.log('\\nIMPORTANT: Replace these with actual PNG icons for production.');
console.log('Download ASI logo and resize to required dimensions.');
