/**
 * App Icon Generator for Biblical Alignment
 *
 * This script documents the required icon sizes and generates placeholder icons
 * for iOS and Android platforms using the app's brand colors.
 *
 * Brand Colors:
 * - Gold: #d4a853
 * - Dark: #1a1a2e
 *
 * Usage:
 *   npx ts-node scripts/generate-app-icons.ts
 *
 * Or with sharp installed:
 *   npm install sharp
 *   npx ts-node scripts/generate-app-icons.ts
 */

import * as fs from "fs";
import * as path from "path";

// Brand colors
const GOLD = "#d4a853";
const DARK = "#1a1a2e";

// Icon design: Gold scripture/book icon on dark background
const createIconSVG = (size: number): string => {
  const padding = Math.round(size * 0.15);
  const iconSize = size - padding * 2;
  const strokeWidth = Math.max(1, Math.round(size * 0.04));

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${DARK}" rx="${Math.round(size * 0.2)}"/>
  <g transform="translate(${padding}, ${padding})">
    <path d="M${iconSize * 0.15} ${iconSize * 0.1}h${iconSize * 0.5}l${iconSize * 0.2} ${iconSize * 0.2}v${iconSize * 0.6}a${iconSize * 0.06} ${iconSize * 0.06} 0 0 1-${iconSize * 0.06} ${iconSize * 0.06}H${iconSize * 0.15}a${iconSize * 0.06} ${iconSize * 0.06} 0 0 1-${iconSize * 0.06}-${iconSize * 0.06}V${iconSize * 0.16}a${iconSize * 0.06} ${iconSize * 0.06} 0 0 1 ${iconSize * 0.06}-${iconSize * 0.06}z" fill="${GOLD}"/>
    <path d="M${iconSize * 0.65} ${iconSize * 0.1}v${iconSize * 0.2}h${iconSize * 0.2}" fill="none" stroke="${DARK}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M${iconSize * 0.25} ${iconSize * 0.4}h${iconSize * 0.4}M${iconSize * 0.25} ${iconSize * 0.55}h${iconSize * 0.4}M${iconSize * 0.25} ${iconSize * 0.7}h${iconSize * 0.25}" stroke="${DARK}" stroke-width="${strokeWidth}" stroke-linecap="round"/>
  </g>
</svg>`;
};

// iOS icon sizes (all required for modern iOS)
const iosIconSizes = [
  { name: "AppIcon-20x20@1x.png", size: 20 },
  { name: "AppIcon-20x20@2x.png", size: 40 },
  { name: "AppIcon-20x20@3x.png", size: 60 },
  { name: "AppIcon-29x29@1x.png", size: 29 },
  { name: "AppIcon-29x29@2x.png", size: 58 },
  { name: "AppIcon-29x29@3x.png", size: 87 },
  { name: "AppIcon-40x40@1x.png", size: 40 },
  { name: "AppIcon-40x40@2x.png", size: 80 },
  { name: "AppIcon-40x40@3x.png", size: 120 },
  { name: "AppIcon-60x60@2x.png", size: 120 },
  { name: "AppIcon-60x60@3x.png", size: 180 },
  { name: "AppIcon-76x76@1x.png", size: 76 },
  { name: "AppIcon-76x76@2x.png", size: 152 },
  { name: "AppIcon-83.5x83.5@2x.png", size: 167 },
  { name: "AppIcon-1024x1024@1x.png", size: 1024 },
];

// Android icon sizes
const androidIconSizes = [
  { folder: "mipmap-mdpi", name: "ic_launcher.png", size: 48 },
  { folder: "mipmap-hdpi", name: "ic_launcher.png", size: 72 },
  { folder: "mipmap-xhdpi", name: "ic_launcher.png", size: 96 },
  { folder: "mipmap-xxhdpi", name: "ic_launcher.png", size: 144 },
  { folder: "mipmap-xxxhdpi", name: "ic_launcher.png", size: 192 },
  { folder: "mipmap-mdpi", name: "ic_launcher_round.png", size: 48 },
  { folder: "mipmap-hdpi", name: "ic_launcher_round.png", size: 72 },
  { folder: "mipmap-xhdpi", name: "ic_launcher_round.png", size: 96 },
  { folder: "mipmap-xxhdpi", name: "ic_launcher_round.png", size: 144 },
  { folder: "mipmap-xxxhdpi", name: "ic_launcher_round.png", size: 192 },
  { folder: "mipmap-mdpi", name: "ic_launcher_foreground.png", size: 108 },
  { folder: "mipmap-hdpi", name: "ic_launcher_foreground.png", size: 162 },
  { folder: "mipmap-xhdpi", name: "ic_launcher_foreground.png", size: 216 },
  { folder: "mipmap-xxhdpi", name: "ic_launcher_foreground.png", size: 324 },
  { folder: "mipmap-xxxhdpi", name: "ic_launcher_foreground.png", size: 432 },
];

// Splash screen sizes
const splashSizes = [
  { name: "splash-2732x2732.png", size: 2732 },
];

const webAppDir = path.resolve(__dirname, "..");
const iosAssetsDir = path.join(
  webAppDir,
  "ios/App/App/Assets.xcassets/AppIcon.appiconset"
);
const iosSplashDir = path.join(
  webAppDir,
  "ios/App/App/Assets.xcassets/Splash.imageset"
);
const androidResDir = path.join(webAppDir, "android/app/src/main/res");

async function generateIcons() {
  console.log("App Icon Generator for Biblical Alignment");
  console.log("==========================================\n");

  console.log("Brand Colors:");
  console.log(`  Gold: ${GOLD}`);
  console.log(`  Dark: ${DARK}\n`);

  // Check if sharp is available
  let sharp: typeof import("sharp") | null = null;
  try {
    sharp = require("sharp");
    console.log("Sharp library found - generating PNG icons\n");
  } catch {
    console.log("Sharp library not found - generating SVG sources only");
    console.log("Install sharp to generate PNGs: npm install sharp\n");
  }

  // Generate iOS icons
  console.log("iOS Icons Required:");
  console.log("-------------------");
  for (const icon of iosIconSizes) {
    console.log(`  ${icon.name} (${icon.size}x${icon.size})`);

    if (sharp) {
      const svg = createIconSVG(icon.size);
      const outputPath = path.join(iosAssetsDir, icon.name);
      await sharp(Buffer.from(svg)).png().toFile(outputPath);
      console.log(`    -> Generated: ${outputPath}`);
    }
  }

  // Generate Android icons
  console.log("\nAndroid Icons Required:");
  console.log("-----------------------");
  for (const icon of androidIconSizes) {
    console.log(`  ${icon.folder}/${icon.name} (${icon.size}x${icon.size})`);

    if (sharp) {
      const svg = createIconSVG(icon.size);
      const folderPath = path.join(androidResDir, icon.folder);
      fs.mkdirSync(folderPath, { recursive: true });
      const outputPath = path.join(folderPath, icon.name);
      await sharp(Buffer.from(svg)).png().toFile(outputPath);
      console.log(`    -> Generated: ${outputPath}`);
    }
  }

  // Generate splash screens
  console.log("\nSplash Screens:");
  console.log("---------------");
  for (const splash of splashSizes) {
    console.log(`  ${splash.name} (${splash.size}x${splash.size})`);

    if (sharp) {
      // Splash is just solid dark background with centered icon
      const iconSize = Math.round(splash.size * 0.25);
      const iconOffset = Math.round((splash.size - iconSize) / 2);

      const splashSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${splash.size}" height="${splash.size}" viewBox="0 0 ${splash.size} ${splash.size}">
  <rect width="${splash.size}" height="${splash.size}" fill="${DARK}"/>
  <g transform="translate(${iconOffset}, ${iconOffset})">
    ${createIconSVG(iconSize).replace(/<svg[^>]*>/, "").replace("</svg>", "")}
  </g>
</svg>`;

      // iOS splash
      const iosSplashPath = path.join(iosSplashDir, splash.name);
      await sharp(Buffer.from(splashSvg)).png().toFile(iosSplashPath);
      console.log(`    -> Generated iOS: ${iosSplashPath}`);

      // Also generate the 1x and 2x variants
      await sharp(Buffer.from(splashSvg))
        .png()
        .toFile(path.join(iosSplashDir, "splash-2732x2732-1.png"));
      await sharp(Buffer.from(splashSvg))
        .png()
        .toFile(path.join(iosSplashDir, "splash-2732x2732-2.png"));

      // Android splash
      const androidSplashPath = path.join(androidResDir, "drawable/splash.png");
      await sharp(Buffer.from(splashSvg))
        .resize(480, 480)
        .png()
        .toFile(androidSplashPath);
      console.log(`    -> Generated Android: ${androidSplashPath}`);
    }
  }

  // Save SVG source file
  const svgSourcePath = path.join(webAppDir, "public/app-icon.svg");
  fs.writeFileSync(svgSourcePath, createIconSVG(512));
  console.log(`\nSVG source saved to: ${svgSourcePath}`);

  console.log("\nDone!");
}

// Export for testing
export { createIconSVG, iosIconSizes, androidIconSizes, GOLD, DARK };

// Run if called directly
if (require.main === module) {
  generateIcons().catch(console.error);
}
