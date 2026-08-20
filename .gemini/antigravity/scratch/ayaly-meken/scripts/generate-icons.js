const sharp = require('C:/Users/flexi/.gemini/antigravity/scratch/aura-pms/node_modules/sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.resolve('public');
const iconsDir = path.resolve('public/icons');

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

// Minimalist, bold AM logo with rich emerald green gradient exactly matching Altyn Qonaq's AQ design
const svgFullBleed = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#059669" />
      <stop offset="100%" stop-color="#064E3B" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#emeraldGrad)"/>
  <text x="256" y="325" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-size="240" font-weight="900" letter-spacing="-10" fill="#FFFFFF" text-anchor="middle">AM</text>
</svg>`;

fs.writeFileSync('public/favicon.svg', svgFullBleed.trim());
fs.writeFileSync('public/icons/icon-512.svg', svgFullBleed.trim());
fs.writeFileSync('public/icons/icon-192.svg', svgFullBleed.trim());
fs.writeFileSync('public/icons/icon-maskable.svg', svgFullBleed.trim());

async function buildPngs() {
  const buf = Buffer.from(svgFullBleed);
  
  await sharp(buf).resize(512, 512).png().toFile('public/icons/icon-512.png');
  await sharp(buf).resize(192, 192).png().toFile('public/icons/icon-192.png');
  await sharp(buf).resize(180, 180).png().toFile('public/apple-touch-icon.png');
  await sharp(buf).resize(180, 180).png().toFile('public/apple-touch-icon-precomposed.png');
  await sharp(buf).resize(180, 180).png().toFile('public/icons/apple-touch-icon.png');
  await sharp(buf).resize(64, 64).png().toFile('public/favicon.png');
  await sharp(buf).resize(32, 32).png().toFile('public/favicon.ico');
  
  console.log('SUCCESS: All Ayaly Meken AM icons generated successfully!');
}

buildPngs().catch(console.error);
